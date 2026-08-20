export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
  summary?: string;
  keyTheories?: string[];
  keyQuotes?: string[];
  citations?: string[];
  critique?: string;
  reflectionPrompts?: string[];
}

export interface ReadingDocument {
  id: string;
  title: string;
  author?: string;
  rawText: string;
  totalWords: number;
  chapters: Chapter[];
  overallSummary?: string;
  coreFrameworks?: string[];
  minedCitations?: { author: string; year: string; title: string }[];
}

export class ChapterParser {
  /**
   * Split a long document into chapters/sections using regex patterns
   */
  public parseChapters(rawText: string, docTitle = "Reading Assignment"): Chapter[] {
    // Pattern looking for Chapter / Section headers: e.g. "Chapter 1: ...", "Section 2 ...", "1. Introduction"
    const chapterRegex = /(?:^|\n)(?:(?:Chapter|Section|Part|Module)\s+(\d+|[IVXLCDM]+)[:\.\s-]+([^\n]+)|(\d+\.\d*)\s+([^\n]+))/gi;

    const chapters: Chapter[] = [];
    let match: RegExpExecArray | null;
    const indices: { index: number; title: string; num: number }[] = [];
    let count = 1;

    while ((match = chapterRegex.exec(rawText)) !== null) {
      const num = match[1] ? parseInt(match[1], 10) || count : count;
      const title = (match[2] || match[4] || `Section ${count}`).trim();
      indices.push({
        index: match.index,
        title,
        num
      });
      count++;
    }

    if (indices.length === 0) {
      // Fallback: If no explicit chapter headings found, split by major double breaks (~2000-3000 words chunks) or treat as single unit
      const words = rawText.split(/\s+/);
      if (words.length <= 2500) {
        return [{
          id: `ch-1`,
          number: 1,
          title: docTitle,
          content: rawText,
          wordCount: words.length
        }];
      }

      // Chunk into ~2000 word segments
      const chunkSize = 2000;
      const chunks: Chapter[] = [];
      for (let i = 0; i < words.length; i += chunkSize) {
        const slice = words.slice(i, i + chunkSize).join(" ");
        const chNum = Math.floor(i / chunkSize) + 1;
        chunks.push({
          id: `ch-${chNum}`,
          number: chNum,
          title: `Part ${chNum}: Executive Synthesis`,
          content: slice,
          wordCount: slice.split(/\s+/).length
        });
      }
      return chunks;
    }

    for (let i = 0; i < indices.length; i++) {
      const current = indices[i];
      const nextIndex = i < indices.length - 1 ? indices[i + 1].index : rawText.length;
      const content = rawText.slice(current.index, nextIndex).trim();

      chapters.push({
        id: `ch-${current.num}-${i}`,
        number: current.num,
        title: current.title,
        content,
        wordCount: content.split(/\s+/).filter(Boolean).length
      });
    }

    return chapters;
  }
}

export const chapterParser = new ChapterParser();
