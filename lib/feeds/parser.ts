export interface FeedItem {
  id: string;
  sourceId: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;       // ISO string
  fetchedAt: string;     // ISO string
}

// Parsar RSS 2.0 och Atom XML till FeedItem[]
export function parseRSS(xml: string, sourceId: string): FeedItem[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    // RSS 2.0
    const rssItems = doc.querySelectorAll("item");
    if (rssItems.length > 0) {
      return Array.from(rssItems).slice(0, 10).map((item, i) => {
        const title = item.querySelector("title")?.textContent?.trim() ?? "";
        const link  = item.querySelector("link")?.textContent?.trim()
          ?? item.querySelector("link")?.getAttribute("href") ?? "";
        const desc  = stripHtml(
          item.querySelector("description")?.textContent?.trim() ?? ""
        );
        const pubDate = item.querySelector("pubDate")?.textContent?.trim()
          ?? item.querySelector("dc\\:date")?.textContent?.trim()
          ?? new Date().toISOString();

        return {
          id: `${sourceId}-${i}-${hashStr(title)}`,
          sourceId,
          title,
          link,
          description: desc.slice(0, 280),
          pubDate: safeDate(pubDate),
          fetchedAt: new Date().toISOString(),
        };
      });
    }

    // Atom
    const atomEntries = doc.querySelectorAll("entry");
    if (atomEntries.length > 0) {
      return Array.from(atomEntries).slice(0, 10).map((entry, i) => {
        const title = entry.querySelector("title")?.textContent?.trim() ?? "";
        const link  = entry.querySelector("link")?.getAttribute("href")
          ?? entry.querySelector("link")?.textContent?.trim() ?? "";
        const desc  = stripHtml(
          entry.querySelector("summary")?.textContent?.trim()
          ?? entry.querySelector("content")?.textContent?.trim() ?? ""
        );
        const pubDate = entry.querySelector("updated")?.textContent?.trim()
          ?? entry.querySelector("published")?.textContent?.trim()
          ?? new Date().toISOString();

        return {
          id: `${sourceId}-${i}-${hashStr(title)}`,
          sourceId,
          title,
          link,
          description: desc.slice(0, 280),
          pubDate: safeDate(pubDate),
          fetchedAt: new Date().toISOString(),
        };
      });
    }

    return [];
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

function safeDate(raw: string): string {
  try {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }
  return Math.abs(h).toString(36);
}
