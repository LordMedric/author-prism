import Anthropic from "@anthropic-ai/sdk";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class ClaudeProvider {
  private client: Anthropic | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (key) {
      this.client = new Anthropic({ apiKey: key });
    }
  }

  public async complete(
    messages: ChatMessage[],
    systemPrompt: string,
    model = "claude-3-7-sonnet-20250219"
  ): Promise<string> {
    if (!this.client) {
      throw new Error("Anthropic API key is not configured. Please set ANTHROPIC_API_KEY or provide it in Settings.");
    }

    const formattedMessages = messages.map(m => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content
    }));

    const response = await this.client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: formattedMessages
    });

    const block = response.content[0];
    if (block && "text" in block) {
      return block.text;
    }
    return "";
  }
}
