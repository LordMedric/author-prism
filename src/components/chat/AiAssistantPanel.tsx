"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  GraduationCap, 
  Bot, 
  User, 
  Copy, 
  ArrowDownToLine, 
  RefreshCw, 
  X, 
  Minimize2, 
  Maximize2, 
  Columns, 
  MessageCircle, 
  CornerDownLeft
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GradeLevel } from "@/lib/rubric/rubric-engine";

export type ChatViewMode = "bubble" | "docked" | "maximized";

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AiAssistantPanelProps {
  viewMode: ChatViewMode;
  onChangeViewMode: (mode: ChatViewMode) => void;
  activeModel: string;
  activeToneId: string;
  targetGrade: GradeLevel;
  activeDocContent: string;
  onApplyChanges: (newText: string) => void;
  onAppendToDoc: (text: string) => void;
  onOpenRubricModal: () => void;
  apiKeys?: { claudeKey?: string; geminiKey?: string };
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  viewMode,
  onChangeViewMode,
  activeModel,
  activeToneId,
  targetGrade,
  activeDocContent,
  onApplyChanges,
  onAppendToDoc,
  onOpenRubricModal,
  apiKeys,
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Ready to assist with **${targetGrade}** standard writing, reflection, and strategy.\n\nClick **Audit (/grade)** to evaluate against the rubric, or ask me to draft, critique, or polish.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, viewMode]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: activeModel,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            toneId: activeToneId,
            targetGrade: targetGrade,
            activeDocContent: activeDocContent,
          },
          apiKeys,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: `⚠️ **Error:** ${data.error}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            role: "assistant",
            content: data.reply,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Network error: ${err.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuditDraft = () => {
    handleSendMessage(
      `Please perform a **Pre-Submission Rubric Audit** on my active document against the **${targetGrade}** standard.\n\n1. Assess Critical Reflection/Analysis, Model Application, Harvard Referencing, and Structure.\n2. Point out specific paragraphs needing improvement.\n3. Provide concrete rewrite snippets to elevate to **${targetGrade}**.\n\nCurrent Document:\n"""\n${activeDocContent}\n"""`
    );
  };

  // 1. BUBBLE MODE (Exact Clean Circular Chat Bubble Button)
  if (viewMode === "bubble") {
    return (
      <div className="fixed bottom-6 right-6 z-50 select-none">
        <button
          type="button"
          onClick={() => onChangeViewMode("docked")}
          className="pointer-events-auto flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl scale-100 opacity-100"
          aria-label="Open AI Assistant"
          title="Open AI Assistant (Ctrl+K)"
        >
          <MessageCircle className="size-5 text-foreground" />
        </button>
      </div>
    );
  }

  // 2. MAXIMIZED OVERLAY MODE (Centered spacious overlay covering middle panel)
  if (viewMode === "maximized") {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-card border border-border rounded-2xl w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-3.5 border-b border-border/80 flex items-center justify-between bg-card/80 select-none">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground">AuthorPrism Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {activeModel} &bull; {targetGrade}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAuditDraft}
                disabled={isLoading || !activeDocContent.trim()}
                className="px-2.5 py-1 rounded text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition disabled:opacity-50"
              >
                Run Rubric Audit (/grade)
              </button>

              <div className="h-4 w-[1px] bg-border mx-1" />

              <button
                onClick={() => onChangeViewMode("docked")}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
                title="Dock to side panel"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeViewMode("bubble")}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
                title="Minimize to chat bubble"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeViewMode("bubble")}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
                  {m.role === "user" ? <span>You</span> : <span>Author Prism ({targetGrade})</span>}
                </div>

                <div
                  className={`p-4 rounded-xl max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-muted/60 text-foreground border border-border/60"
                  }`}
                >
                  <div className="prose dark:prose-invert prose-xs max-w-none prose-p:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>

                  {m.role === "assistant" && m.id !== "welcome" && (
                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-3 justify-end text-xs">
                      <button
                        onClick={() => navigator.clipboard.writeText(m.content)}
                        className="hover:underline text-muted-foreground flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => onAppendToDoc(m.content)}
                        className="hover:underline font-semibold text-foreground flex items-center gap-1"
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        <span>Insert into Document</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs py-2">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <span>Author Prism is synthesizing your request...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Large Input Form */}
          <div className="p-4 border-t border-border/80 bg-card/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={2}
                placeholder="Ask AI assistant, brainstorm frameworks, or press Enter to send..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground/50 transition resize-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl bg-foreground text-background hover:opacity-90 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. DOCKED SIDEBAR MODE (Right-side panel)
  return (
    <div className="w-80 border-l border-border/80 bg-card/40 flex flex-col h-[calc(100vh-3.25rem)] transition-all duration-200">
      {/* Header */}
      <div className="p-2.5 border-b border-border/80 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>AI Assistant</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleAuditDraft}
            disabled={isLoading || !activeDocContent.trim()}
            className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted hover:bg-muted/80 text-foreground transition disabled:opacity-50"
            title="Audit against rubric"
          >
            Audit (/grade)
          </button>

          <button
            onClick={() => onChangeViewMode("maximized")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Maximize to overlay studio"
          >
            <Maximize2 className="w-3 h-3" />
          </button>

          <button
            onClick={() => onChangeViewMode("bubble")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Minimize to chat bubble"
          >
            <Minimize2 className="w-3 h-3" />
          </button>

          <button
            onClick={() => onChangeViewMode("bubble")}
            className="p-1 rounded hover:bg-muted text-muted-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-2.5 rounded-lg max-w-[95%] leading-relaxed ${
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-muted/60 text-foreground border border-border/40"
              }`}
            >
              <div className="prose dark:prose-invert prose-xs max-w-none prose-p:my-0.5">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>

              {m.role === "assistant" && m.id !== "welcome" && (
                <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center gap-2 justify-end text-[10px]">
                  <button
                    onClick={() => navigator.clipboard.writeText(m.content)}
                    className="hover:underline text-muted-foreground flex items-center gap-0.5"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => onAppendToDoc(m.content)}
                    className="hover:underline font-medium text-foreground flex items-center gap-0.5"
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                    <span>Insert</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs py-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2.5 border-t border-border/80 bg-card/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI or /grade..."
            className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:border-foreground/50 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-md bg-foreground text-background hover:opacity-90 transition disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
