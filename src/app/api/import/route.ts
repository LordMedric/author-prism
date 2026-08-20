import { NextRequest, NextResponse } from "next/server";
import { documentImporter } from "@/lib/documents/importer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      const result = await documentImporter.parsePdf(buffer);
      return NextResponse.json({
        title: file.name.replace(/\.[^/.]+$/, ""),
        text: result.text,
        markdown: result.markdown
      });
    } else if (fileName.endsWith(".docx")) {
      const result = await documentImporter.parseDocx(buffer);
      return NextResponse.json({
        title: file.name.replace(/\.[^/.]+$/, ""),
        text: result.text,
        markdown: result.markdown
      });
    } else if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
      const text = buffer.toString("utf-8");
      return NextResponse.json({
        title: file.name.replace(/\.[^/.]+$/, ""),
        text,
        markdown: text
      });
    }

    return NextResponse.json({ error: "Unsupported file type. Please upload .pdf, .docx, .md, or .txt" }, { status: 400 });
  } catch (err: any) {
    console.error("Import error:", err);
    return NextResponse.json({ error: err.message || "Failed to parse uploaded document" }, { status: 500 });
  }
}
