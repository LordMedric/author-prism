export interface OpenRouterMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class OpenRouterProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || "";
  }

  public async complete(
    messages: OpenRouterMessage[],
    systemPrompt?: string,
    modelId: string = "anthropic/claude-3.7-sonnet"
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenRouter API Key or OAuth token is missing. Please sign in or configure in Settings.");
    }

    // Map internal model IDs to OpenRouter model slugs
    const openRouterModelMap: Record<string, string> = {
      "claude-3-7-sonnet-20250219": "anthropic/claude-3.7-sonnet",
      "claude-3-5-haiku-20241022": "anthropic/claude-3.5-haiku",
      "gemini-2.5-pro": "google/gemini-2.5-pro",
      "gemini-2.0-flash-thinking-exp": "google/gemini-2.0-flash-thinking-exp:free",
      "gemini-2.0-flash": "google/gemini-2.0-flash-001",
      "gemini-1.5-pro": "google/gemini-pro-1.5",
      "gemini-1.5-flash-8b": "google/gemini-flash-1.5-8b",
    };

    const targetModel = openRouterModelMap[modelId] || modelId;

    const payloadMessages = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : messages;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://github.com/LordMedric/author-prism",
        "X-Title": "Author Prism",
      },
      body: JSON.stringify({
        model: targetModel,
        messages: payloadMessages,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`OpenRouter Error (${res.status}): ${errBody}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }
}
