import { NextRequest, NextResponse } from "next/server";
import { documentExporter } from "@/lib/documents/exporter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { format, content, slides, title, theme, author } = body;

    if (format === "docx") {
      const buffer = await documentExporter.exportToDocx(
        content || "",
        title || "Author Prism Document",
        author || "Author Prism"
      );

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${(title || "document").replace(/[^a-zA-Z0-9_-]/g, "_")}.docx"`,
        },
      });
    } else if (format === "pptx") {
      const arrayBuffer = await documentExporter.exportToPptx(
        slides || [],
        theme || "nordic-slate",
        { title: title || "Strategy Presentation", author: author || "Author Prism" }
      );

      return new NextResponse(new Uint8Array(arrayBuffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="${(title || "presentation").replace(/[^a-zA-Z0-9_-]/g, "_")}.pptx"`,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported export format" }, { status: 400 });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json({ error: err.message || "Failed to export document" }, { status: 500 });
  }
}
