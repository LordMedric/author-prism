import { CitationItem } from "./harvard-formatter";

export class CitationMetadataFetcher {
  /**
   * Search CrossRef API for DOIs or query strings
   */
  public async searchCrossRef(query: string): Promise<CitationItem[]> {
    try {
      // If query is a DOI
      const isDoi = query.startsWith("10.") || query.includes("doi.org/");
      const cleanDoi = isDoi ? query.replace(/^https?:\/\/doi\.org\//, "").trim() : null;

      const url = cleanDoi
        ? `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`
        : `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "AuthorPrism/1.0 (mailto:support@authorprism.dev)"
        }
      });

      if (!res.ok) return [];

      const data = await res.json();
      const items = cleanDoi ? [data.message] : (data.message?.items || []);

      return items.map((item: any) => {
        const authors = (item.author || []).map((a: any) => ({
          firstName: a.given || "",
          lastName: a.family || a.name || "Anon"
        }));

        const year = item.created?.["date-parts"]?.[0]?.[0] || 
                     item.published?.["date-parts"]?.[0]?.[0] || 
                     new Date().getFullYear();

        return {
          id: item.DOI || `crossref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: item.type === "book" ? "book" : "journal",
          authors: authors.length > 0 ? authors : [{ lastName: "Unknown" }],
          year: year,
          title: item.title?.[0] || "Untitled Work",
          sourceTitle: item["container-title"]?.[0] || "",
          publisher: item.publisher || "",
          volume: item.volume || "",
          issue: item.issue || "",
          pages: item.page || "",
          doi: item.DOI || "",
          url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : "")
        };
      });
    } catch (err) {
      console.error("CrossRef search failed:", err);
      return [];
    }
  }

  /**
   * Search Google Books API for books by ISBN or title
   */
  public async searchGoogleBooks(query: string): Promise<CitationItem[]> {
    try {
      const cleanQuery = query.replace(/[^0-9a-zA-Z\s]/g, "");
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanQuery)}&maxResults=5`);
      if (!res.ok) return [];

      const data = await res.json();
      if (!data.items) return [];

      return data.items.map((item: any) => {
        const info = item.volumeInfo || {};
        const authors = (info.authors || []).map((a: string) => {
          const parts = a.split(" ");
          const lastName = parts.pop() || "";
          const firstName = parts.join(" ");
          return { firstName, lastName };
        });

        const publishedYear = info.publishedDate ? info.publishedDate.substring(0, 4) : "";

        return {
          id: item.id || `gbooks-${Date.now()}`,
          type: "book",
          authors: authors.length > 0 ? authors : [{ lastName: info.publisher || "Anon" }],
          year: publishedYear,
          title: info.title || "Untitled Book",
          publisher: info.publisher || "",
          pages: info.pageCount ? `${info.pageCount}` : "",
          url: info.infoLink || ""
        };
      });
    } catch (err) {
      console.error("Google Books search failed:", err);
      return [];
    }
  }
}

export const citationFetcher = new CitationMetadataFetcher();
