import { NextRequest, NextResponse } from "next/server";
import { aiRouter } from "@/lib/ai/router";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { modelId, messages, context, apiKeys } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
    }

    const reply = await aiRouter.executeChat(
      modelId || "claude-3-7-sonnet-20250219",
      messages,
      context || {},
      apiKeys
    );

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error occurred while contacting AI model." },
      { status: 500 }
    );
  }
}
