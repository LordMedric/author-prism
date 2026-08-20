import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "./claude";

export class GeminiProvider {
  private client: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key) {
      this.client = new GoogleGenerativeAI(key);
    }
  }

  public async complete(
    messages: ChatMessage[],
    systemPrompt: string,
    modelName = "gemini-2.0-flash"
  ): Promise<string> {
    if (!this.client) {
      throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY or provide it in Settings.");
    }

    const model = this.client.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    const fullConversation = messages
      .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const result = await model.generateContent(fullConversation);
    const response = await result.response;
    return response.text();
  }
}
