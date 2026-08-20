import { Chapter, ChapterParser, ReadingDocument } from "./chapter-parser";

export class ReadingManager {
  private parser = new ChapterParser();
  private documents: Map<string, ReadingDocument> = new Map();

  public createDocument(title: string, rawText: string, author?: string): ReadingDocument {
    const chapters = this.parser.parseChapters(rawText, title);
    const doc: ReadingDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      author,
      rawText,
      totalWords: rawText.split(/\s+/).filter(Boolean).length,
      chapters
    };

    this.documents.set(doc.id, doc);
    return doc;
  }

  public getDocument(id: string): ReadingDocument | undefined {
    return this.documents.get(id);
  }

  public getAllDocuments(): ReadingDocument[] {
    return Array.from(this.documents.values());
  }

  public updateChapterSummary(docId: string, chapterId: string, updates: Partial<Chapter>): void {
    const doc = this.documents.get(docId);
    if (!doc) return;

    const chIndex = doc.chapters.findIndex(c => c.id === chapterId);
    if (chIndex !== -1) {
      doc.chapters[chIndex] = { ...doc.chapters[chIndex], ...updates };
    }
  }

  public buildChapterPrompt(chapter: Chapter, docTitle: string): string {
    return `
### READING ASSIGNMENT SYNTHESIS REQUEST
- Source Document: "${docTitle}"
- Chapter / Section: "${chapter.title}" (Words: ${chapter.wordCount})

Please analyze and synthesize this chapter adhering to the following structure:
1. **Executive Summary & Core Thesis**: Key premise and underlying arguments in 3-4 concise paragraphs.
2. **Key Theoretical Frameworks & Concepts**: Bulleted list of key models, definitions, and frameworks introduced.
3. **Critical Evaluation & Critique**: Strengths, assumptions, and potential blind spots in the chapter's reasoning.
4. **Harvard In-Text Citations & References Mined**: Any authors, studies, or historical sources referenced inside this chapter formatted in Harvard style: (Author, Year).
5. **Practical Application / Reflective Prompts**: 3 actionable questions or strategic prompts applying these insights to real-world business strategy or personal reflective practice.

Text Content:
"""
${chapter.content.slice(0, 15000)}
"""
`;
  }
}

export const readingManager = new ReadingManager();
