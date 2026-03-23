"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FEED_SOURCES } from "@/lib/feeds/sources";
import { parseRSS, type FeedItem } from "@/lib/feeds/parser";

const CACHE_TTL_MS = 30 * 60 * 1000;
const CONCURRENCY = 4;

interface FeedState {
  items: FeedItem[];
  lastFetch: string | null;
  loading: boolean;
  errors: Record<string, string>;
  enabledSources: string[];

  fetchAll: () => Promise<void>;
  fetchIfStale: () => Promise<void>;
  toggleSource: (id: string) => void;
}

// Hämtar XML via Rust-kommandot fetch_rss (kringgår CORS helt).
// Faller tillbaka på native fetch i dev-läge (webbläsare utan Tauri).
async function fetchXml(url: string): Promise<string> {
  // Tauri-miljö: anropa direkt via window.__TAURI_INTERNALS__ (ingen import — undviker Turbopack-bundling)
  type TauriInvoke = (cmd: string, args: Record<string, unknown>) => Promise<string>;
  const internals = typeof window !== "undefined"
    ? (window as unknown as { __TAURI_INTERNALS__?: { invoke: TauriInvoke } }).__TAURI_INTERNALS__
    : undefined;

  if (internals) {
    return internals.invoke("fetch_rss", { url });
  }

  // Dev-läge i webbläsare: native fetch misslyckas p.g.a. CORS — fungerar bara i Tauri-appen
  const res = await fetch(url, {
    headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
  }).catch(() => { throw new Error("CORS blockerar — öppna i Tauri-appen"); });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchFeed(url: string, sourceId: string): Promise<FeedItem[]> {
  const xml = await fetchXml(url);
  const items = parseRSS(xml, sourceId);
  if (items.length === 0) throw new Error("Tom feed — inga artiklar hittades");
  return items;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      items: [],
      lastFetch: null,
      loading: false,
      errors: {},
      enabledSources: FEED_SOURCES.map((s) => s.id),

      fetchAll: async () => {
        set({ loading: true, errors: {} });
        const sources = FEED_SOURCES;
        const newErrors: Record<string, string> = {};
        const allItems: FeedItem[] = [];

        for (let i = 0; i < sources.length; i += CONCURRENCY) {
          const batch = sources.slice(i, i + CONCURRENCY);
          const results = await Promise.allSettled(
            batch.map((s) => fetchFeed(s.url, s.id))
          );
          results.forEach((result, idx) => {
            const sourceId = batch[idx].id;
            if (result.status === "fulfilled") {
              allItems.push(...result.value);
            } else {
              newErrors[sourceId] = result.reason instanceof Error
  ? result.reason.message
  : String(result.reason ?? "Okänt fel");
            }
          });
        }

        const seen = new Set<string>();
        const deduped = allItems
          .filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          })
          .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        set({
          items: deduped,
          lastFetch: new Date().toISOString(),
          loading: false,
          errors: newErrors,
        });
      },

      fetchIfStale: async () => {
        const { lastFetch, loading, fetchAll } = get();
        if (loading) return;
        if (!lastFetch) { await fetchAll(); return; }
        const age = Date.now() - new Date(lastFetch).getTime();
        if (age > CACHE_TTL_MS) await fetchAll();
      },

      toggleSource: (id) =>
        set((state) => ({
          enabledSources: state.enabledSources.includes(id)
            ? state.enabledSources.filter((s) => s !== id)
            : [...state.enabledSources, id],
        })),
    }),
    {
      name: "gamgi-feed-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        items: state.items,
        lastFetch: state.lastFetch,
        enabledSources: state.enabledSources,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<FeedState>;
        const allSourceIds = FEED_SOURCES.map((s) => s.id);
        const stored = p.enabledSources ?? [];
        // Keep existing enabled sources that still exist + auto-enable new unknown sources
        const newSources = allSourceIds.filter((id) => !stored.includes(id));
        const merged = [...stored.filter((id) => allSourceIds.includes(id)), ...newSources];
        return { ...current, ...p, enabledSources: merged };
      },
    }
  )
);
