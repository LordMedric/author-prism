import { ClaudeProvider, ChatMessage } from "./providers/claude";
import { GeminiProvider } from "./providers/gemini";
import { promptBuilder, PromptContext } from "./prompt-builder";

export type AIProviderName = "claude" | "gemini";

export interface AIModelOption {
  id: string;
  provider: AIProviderName;
  name: string;
  description: string;
  contextWindow: string;
  bestFor: string;
  badge?: string;
}

export const AVAILABLE_MODELS: AIModelOption[] = [
  // Anthropic Claude Family
  {
    id: "claude-3-7-sonnet-20250219",
    provider: "claude",
    name: "Claude 3.7 Sonnet",
    description: "State-of-the-art reflective reasoning, executive prose, and nuanced academic writing.",
    contextWindow: "200k tokens",
    bestFor: "Master of reflective essays, tone matching & Harvard formatting",
    badge: "Recommended"
  },
  {
    id: "claude-3-5-haiku-20241022",
    provider: "claude",
    name: "Claude 3.5 Haiku",
    description: "Fast, concise drafting and instant grammar and citation checks.",
    contextWindow: "200k tokens",
    bestFor: "Fast writing & quick in-line paragraph edits",
  },

  // Google Gemini Family
  {
    id: "gemini-2.5-pro",
    provider: "gemini",
    name: "Gemini 2.5 Pro",
    description: "Google's most capable reasoning model with deep academic synthesis and analytical depth.",
    contextWindow: "2M tokens",
    bestFor: "Deep critical reasoning & executive strategy synthesis (SWOT/TOWS/PESTLE)",
    badge: "Reasoning"
  },
  {
    id: "gemini-2.0-flash-thinking-exp",
    provider: "gemini",
    name: "Gemini 2.0 Flash Thinking",
    description: "Chain-of-thought model specialized in multi-step rubric gap analysis and verification.",
    contextWindow: "1M tokens",
    bestFor: "Rubric gap auditing (/grade) & step-by-step criteria verification",
    badge: "Auditing"
  },
  {
    id: "gemini-2.0-flash",
    provider: "gemini",
    name: "Gemini 2.0 Flash",
    description: "Ultra-fast multimodal document ingestion, slide drafting, and rapid paper synthesis.",
    contextWindow: "1M tokens",
    bestFor: "High-speed co-authoring & slide deck generation",
    badge: "Speed"
  },
  {
    id: "gemini-1.5-pro",
    provider: "gemini",
    name: "Gemini 1.5 Pro",
    description: "Massive 2,000,000 token context window for reading whole books and entire reading packets.",
    contextWindow: "2M tokens",
    bestFor: "Massive multi-book & reading assignment ingestion without truncation",
    badge: "2M Context"
  },
  {
    id: "gemini-1.5-flash-8b",
    provider: "gemini",
    name: "Gemini 1.5 Flash 8B",
    description: "Ultra-low latency model for instant in-line cursor suggestions and citation mining.",
    contextWindow: "1M tokens",
    bestFor: "Instant in-line cursor writing & quick citation mining",
  }
];

export class AIRouter {
  public async executeChat(
    modelId: string,
    messages: ChatMessage[],
    context: PromptContext = {},
    apiKeys?: { claudeKey?: string; geminiKey?: string }
  ): Promise<string> {
    const selectedModel = AVAILABLE_MODELS.find(m => m.id === modelId) || AVAILABLE_MODELS[0];
    const systemPrompt = promptBuilder.buildSystemPrompt(context);

    if (selectedModel.provider === "claude") {
      const claude = new ClaudeProvider(apiKeys?.claudeKey);
      return await claude.complete(messages, systemPrompt, selectedModel.id);
    } else {
      const gemini = new GeminiProvider(apiKeys?.geminiKey);
      return await gemini.complete(messages, systemPrompt, selectedModel.id);
    }
  }
}

export const aiRouter = new AIRouter();
