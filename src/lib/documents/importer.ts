import mammoth from "mammoth";
const pdfParse = require("pdf-parse");

export class DocumentImporter {
  /**
   * Extract plain text and markdown from an uploaded DOCX buffer
   */
  public async parseDocx(buffer: Buffer): Promise<{ text: string; markdown: string }> {
    try {
      const textResult = await mammoth.extractRawText({ buffer });
      const mdResult = await mammoth.convertToHtml({ buffer });
      
      // HTML to markdown transformation
      const markdown = mdResult.value
        .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n\n")
        .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n\n")
        .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n\n")
        .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
        .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<em>(.*?)<\/em>/gi, "*$1*")
        .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
        .replace(/<ul>|<\/ul>|<ol>|<\/ol>/gi, "\n");

      return {
        text: textResult.value,
        markdown: markdown || textResult.value
      };
    } catch (e) {
      console.error("DOCX parsing error:", e);
      throw new Error("Failed to parse DOCX document.");
    }
  }

  /**
   * Extract plain text and formatted markdown from an uploaded PDF buffer
   */
  public async parsePdf(buffer: Buffer): Promise<{ text: string; markdown: string }> {
    try {
      const data = await pdfParse(buffer);
      const text = data.text || "";
      
      return {
        text,
        markdown: text
      };
    } catch (e) {
      console.error("PDF parsing error:", e);
      throw new Error("Failed to parse PDF document.");
    }
  }
}

export const documentImporter = new DocumentImporter();
