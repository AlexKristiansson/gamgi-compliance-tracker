"use client";

import { useEffect, useState } from "react";
import { useFeedStore } from "@/lib/store/feedStore";
import { FEED_SOURCES, SOURCE_BADGE_COLORS } from "@/lib/feeds/sources";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RefreshCw, ExternalLink, AlertCircle, Rss, Clock, ChevronDown,
} from "lucide-react";

export function NewsFeed() {
  const { items, lastFetch, loading, errors, enabledSources, fetchIfStale, fetchAll } =
    useFeedStore();
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    fetchIfStale();
    const interval = setInterval(fetchIfStale, 30 * 60 * 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleItems = items.filter((item) => enabledSources.includes(item.sourceId));
  const errorEntries = Object.entries(errors);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Rss className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">GDPR-nyhetsflöde</h2>
          {visibleItems.length > 0 && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
              {visibleItems.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastFetch && (
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatAge(lastFetch)}
            </span>
          )}
          {errorEntries.length > 0 && (
            <button
              onClick={() => setShowErrors((v) => !v)}
              className="text-[10px] text-amber-600 flex items-center gap-1 hover:text-amber-800"
            >
              <AlertCircle className="w-3 h-3" />
              {errorEntries.length} källa{errorEntries.length > 1 ? "r" : ""} misslyckades
              <ChevronDown className={cn("w-3 h-3 transition-transform", showErrors && "rotate-180")} />
            </button>
          )}
          <button
            onClick={() => fetchAll()}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            {loading ? "Hämtar…" : "Uppdatera"}
          </button>
        </div>
      </div>

      {/* Feldetaljer (expanderbar) */}
      {showErrors && errorEntries.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 space-y-1.5">
          <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wide">Felmeddelanden</p>
          {errorEntries.map(([sourceId, msg]) => {
            const source = FEED_SOURCES.find((s) => s.id === sourceId);
            return (
              <div key={sourceId} className="flex items-start gap-2 text-xs">
                <span className="font-medium text-amber-900 flex-shrink-0 w-28">
                  {source?.name ?? sourceId}
                </span>
                <span className="text-amber-700 font-mono text-[10px] break-all">{msg}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Källfilter */}
      <SourceFilter />

      {/* Nyheter */}
      <div className="divide-y divide-gray-50 max-h-[560px] overflow-y-auto">
        {loading && visibleItems.length === 0 && <LoadingSkeleton />}

        {!loading && visibleItems.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            <Rss className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Inga nyheter laddade ännu.</p>
            <button
              onClick={() => fetchAll()}
              className="mt-2 text-blue-600 hover:underline text-xs"
            >
              Hämta nu
            </button>
          </div>
        )}

        {visibleItems.map((item) => {
          const source = FEED_SOURCES.find((s) => s.id === item.sourceId);
          if (!source) return null;
          const badgeColor = SOURCE_BADGE_COLORS[source.color] ?? SOURCE_BADGE_COLORS.blue;

          return (
            <article key={item.id} className="px-4 py-3 hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", badgeColor)}>
                      {source.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatDate(item.pubDate)}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                    title="Öppna artikel"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-blue-600" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SourceFilter() {
  const { enabledSources, toggleSource, errors } = useFeedStore();
  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-2 border-b border-gray-100 bg-gray-50">
      {FEED_SOURCES.map((source) => {
        const active = enabledSources.includes(source.id);
        const hasError = !!errors[source.id];
        const badgeColor = SOURCE_BADGE_COLORS[source.color];
        return (
          <button
            key={source.id}
            onClick={() => toggleSource(source.id)}
            title={hasError ? errors[source.id] : source.description}
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full border transition-all",
              active ? cn(badgeColor, "border-transparent") : "bg-white text-gray-400 border-gray-200",
              hasError && "opacity-60"
            )}
          >
            {source.name}{hasError ? " ⚠" : ""}
          </button>
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-4 py-3 animate-pulse">
          <div className="flex gap-2 mb-2">
            <div className="h-3.5 w-12 bg-gray-200 rounded-full" />
            <div className="h-3.5 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" });
  } catch { return ""; }
}

function formatAge(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just nu";
  if (min < 60) return `${min} min sedan`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h sedan`;
  return `${Math.floor(h / 24)}d sedan`;
}
