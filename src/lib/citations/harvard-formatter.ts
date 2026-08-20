export interface CitationItem {
  id: string;
  type: "book" | "journal" | "website" | "report" | "chapter";
  authors: { firstName?: string; lastName: string }[];
  year: string | number;
  title: string;
  sourceTitle?: string; // Journal Name, Book Title, Website Name
  publisher?: string;
  placeOfPublication?: string;
  volume?: string | number;
  issue?: string | number;
  pages?: string;
  doi?: string;
  url?: string;
  accessDate?: string;
}

export class HarvardFormatter {
  /**
   * Format authors in Harvard style: e.g. "Smith, J. and Jones, A." or "Taylor, R., Brown, M. and Davis, L."
   */
  public formatAuthors(authors: { firstName?: string; lastName: string }[]): string {
    if (!authors || authors.length === 0) return "Anon.";

    const formatted = authors.map((a) => {
      const initial = a.firstName ? ` ${a.firstName.trim().charAt(0)}.` : "";
      return `${a.lastName},${initial}`;
    });

    if (formatted.length === 1) return formatted[0];
    if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
    if (formatted.length > 3) return `${formatted[0]} et al.`;

    const allButLast = formatted.slice(0, -1).join(", ");
    return `${allButLast} and ${formatted[formatted.length - 1]}`;
  }

  /**
   * Generate an in-text citation: e.g. "(Smith, 2023)" or "(Smith and Jones, 2022, p. 45)"
   */
  public formatInText(item: CitationItem, page?: string | number, isDirectQuote = false): string {
    const authorStr = item.authors && item.authors.length > 0 
      ? (item.authors.length > 2 ? `${item.authors[0].lastName} et al.` : item.authors.map(a => a.lastName).join(" and "))
      : item.title.slice(0, 20);

    const yearStr = item.year || "n.d.";
    const pageStr = page ? `, p. ${page}` : "";

    return isDirectQuote
      ? `${authorStr} (${yearStr}${pageStr})`
      : `(${authorStr}, ${yearStr}${pageStr})`;
  }

  /**
   * Generate a full Harvard reference list entry
   */
  public formatReferenceEntry(item: CitationItem): string {
    const authors = this.formatAuthors(item.authors);
    const year = item.year ? `(${item.year})` : "(n.d.)";

    switch (item.type) {
      case "book": {
        const title = `*${item.title}*`;
        const place = item.placeOfPublication ? `${item.placeOfPublication}: ` : "";
        const pub = item.publisher ? `${item.publisher}.` : "";
        return `${authors} ${year} ${title}. ${place}${pub}`.trim();
      }
      case "journal": {
        const articleTitle = `'${item.title}'`;
        const journal = item.sourceTitle ? `*${item.sourceTitle}*` : "";
        const vol = item.volume ? `, ${item.volume}` : "";
        const iss = item.issue ? `(${item.issue})` : "";
        const pgs = item.pages ? `, pp. ${item.pages}` : "";
        const doi = item.doi ? ` doi: ${item.doi}.` : ".";
        return `${authors} ${year} ${articleTitle}, ${journal}${vol}${iss}${pgs}${doi}`.trim();
      }
      case "website": {
        const siteTitle = `*${item.title}*`;
        const source = item.sourceTitle ? ` Available at: ${item.url}` : item.url ? ` Available at: ${item.url}` : "";
        const accessed = item.accessDate ? ` (Accessed: ${item.accessDate}).` : ".";
        return `${authors} ${year} ${siteTitle}.${source}${accessed}`.trim();
      }
      case "report": {
        const reportTitle = `*${item.title}*`;
        const pub = item.publisher ? ` ${item.publisher}.` : "";
        const url = item.url ? ` Available at: ${item.url}` : "";
        return `${authors} ${year} ${reportTitle}.${pub}${url}`.trim();
      }
      default: {
        return `${authors} ${year} *${item.title}*.`;
      }
    }
  }

  /**
   * Generate an alphabetized Harvard bibliography from a list of items
   */
  public generateBibliography(items: CitationItem[]): string {
    if (!items || items.length === 0) return "";

    const sorted = [...items].sort((a, b) => {
      const authorA = (a.authors[0]?.lastName || a.title).toLowerCase();
      const authorB = (b.authors[0]?.lastName || b.title).toLowerCase();
      return authorA.localeCompare(authorB);
    });

    const entries = sorted.map((item) => this.formatReferenceEntry(item));
    return `## References\n\n${entries.map(e => `${e}\n`).join("\n")}`;
  }
}

export const harvardFormatter = new HarvardFormatter();
