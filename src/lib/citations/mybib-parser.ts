import { CitationItem } from "./harvard-formatter";

export class MyBibParser {
  /**
   * Parse CSL-JSON exported from MyBib
   */
  public parseCslJson(jsonStr: string): CitationItem[] {
    try {
      const data = JSON.parse(jsonStr);
      const items = Array.isArray(data) ? data : [data];

      return items.map((item: any) => {
        const authors = (item.author || []).map((a: any) => ({
          firstName: a.given || "",
          lastName: a.family || a.literal || "Anon"
        }));

        const year = item.issued?.["date-parts"]?.[0]?.[0] || item.year || "n.d.";

        let type: CitationItem["type"] = "book";
        if (item.type === "article-journal") type = "journal";
        else if (item.type === "webpage") type = "website";
        else if (item.type === "report") type = "report";

        return {
          id: item.id || `mybib-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type,
          authors: authors.length > 0 ? authors : [{ lastName: "Unknown" }],
          year,
          title: item.title || "Untitled",
          sourceTitle: item["container-title"] || "",
          publisher: item.publisher || "",
          placeOfPublication: item["publisher-place"] || "",
          volume: item.volume || "",
          issue: item.issue || "",
          pages: item.page || "",
          doi: item.DOI || "",
          url: item.URL || "",
          accessDate: item.accessed?.["date-parts"]?.[0]?.join("-") || ""
        };
      });
    } catch (e) {
      console.error("Failed to parse CSL-JSON:", e);
      return [];
    }
  }

  /**
   * Parse RIS format exported from MyBib or academic databases
   */
  public parseRis(risText: string): CitationItem[] {
    const entries: CitationItem[] = [];
    const blocks = risText.split(/ER\s+-/g);

    for (const block of blocks) {
      if (!block.trim()) continue;
      const lines = block.split(/\r?\n/);
      let title = "";
      let year = "";
      let journal = "";
      let publisher = "";
      let doi = "";
      let url = "";
      let volume = "";
      let issue = "";
      let pages = "";
      const authors: { firstName?: string; lastName: string }[] = [];

      for (const line of lines) {
        const tag = line.slice(0, 2).trim();
        const value = line.slice(5).trim();
        if (!tag || !value) continue;

        if (tag === "AU" || tag === "A1") {
          const parts = value.split(",");
          authors.push({
            lastName: parts[0]?.trim() || "Anon",
            firstName: parts[1]?.trim() || ""
          });
        } else if (tag === "TI" || tag === "T1") {
          title = value;
        } else if (tag === "PY" || tag === "Y1") {
          year = value.slice(0, 4);
        } else if (tag === "JO" || tag === "JF" || tag === "T2") {
          journal = value;
        } else if (tag === "PB") {
          publisher = value;
        } else if (tag === "DO") {
          doi = value;
        } else if (tag === "UR") {
          url = value;
        } else if (tag === "VL") {
          volume = value;
        } else if (tag === "IS") {
          issue = value;
        } else if (tag === "SP") {
          pages = value;
        }
      }

      if (title || authors.length > 0) {
        entries.push({
          id: `ris-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: journal ? "journal" : "book",
          authors: authors.length > 0 ? authors : [{ lastName: "Unknown" }],
          year: year || "n.d.",
          title: title || "Untitled Work",
          sourceTitle: journal,
          publisher,
          doi,
          url,
          volume,
          issue,
          pages
        });
      }
    }

    return entries;
  }
}

export const myBibParser = new MyBibParser();
