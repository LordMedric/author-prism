import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";
import { slideGenerator } from "../slides/slide-generator";
import { SlideData } from "../slides/slide-templates";

export class DocumentExporter {
  /**
   * Export Markdown content to a beautifully styled DOCX file with headings, paragraphs, and page numbering
   */
  public async exportToDocx(
    markdownContent: string,
    title = "Academic & Strategic Document",
    author = "Author Prism"
  ): Promise<Buffer> {
    const lines = markdownContent.split(/\r?\n/);
    const docChildren: Paragraph[] = [];

    // Title Block
    docChildren.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300, before: 200 }
      })
    );

    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Author: ${author}  |  Generated via Author Prism`, italics: true, color: "666666" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 500 }
      })
    );

    // Process markdown lines
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        docChildren.push(new Paragraph({ text: "", spacing: { after: 100 } }));
        continue;
      }

      if (line.startsWith("# ")) {
        docChildren.push(
          new Paragraph({
            text: line.replace(/^#\s+/, ""),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 }
          })
        );
      } else if (line.startsWith("## ")) {
        docChildren.push(
          new Paragraph({
            text: line.replace(/^##\s+/, ""),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 }
          })
        );
      } else if (line.startsWith("### ")) {
        docChildren.push(
          new Paragraph({
            text: line.replace(/^###\s+/, ""),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 80 }
          })
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        docChildren.push(
          new Paragraph({
            text: line.replace(/^[-*]\s+/, ""),
            bullet: { level: 0 },
            spacing: { after: 60 }
          })
        );
      } else if (/^\d+\.\s+/.test(line)) {
        docChildren.push(
          new Paragraph({
            text: line.replace(/^\d+\.\s+/, ""),
            spacing: { after: 60 }
          })
        );
      } else {
        docChildren.push(
          new Paragraph({
            text: line,
            spacing: { after: 120 },
            alignment: AlignmentType.LEFT
          })
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren
        }
      ]
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Export Presentation Slides to a native PPTX buffer
   */
  public async exportToPptx(
    slides: SlideData[],
    theme = "nordic-slate",
    meta = { title: "Strategy Presentation", author: "Author Prism" }
  ): Promise<ArrayBuffer> {
    const pptx = await slideGenerator.generatePresentation(slides, theme, meta);
    return (await pptx.write({ outputType: "arraybuffer" })) as ArrayBuffer;
  }
}

export const documentExporter = new DocumentExporter();
