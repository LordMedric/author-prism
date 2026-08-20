import { NextRequest, NextResponse } from "next/server";
import { citationFetcher } from "@/lib/citations/metadata-fetcher";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ items: [] });
    }

    const isDoi = query.startsWith("10.") || query.includes("doi.org/");
    const results = isDoi
      ? await citationFetcher.searchCrossRef(query)
      : await Promise.all([
          citationFetcher.searchCrossRef(query),
          citationFetcher.searchGoogleBooks(query)
        ]).then(([crossref, books]) => [...crossref, ...books]);

    return NextResponse.json({ items: results });
  } catch (err: any) {
    console.error("Citation search error:", err);
    return NextResponse.json({ error: err.message || "Failed to search citations." }, { status: 500 });
  }
}
