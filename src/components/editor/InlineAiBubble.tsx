"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  Send, 
  X, 
  Check, 
  RefreshCw, 
  ArrowDownToLine, 
  Sparkles,
  CornerDownLeft
} from "lucide-react";
import { GradeLevel } from "@/lib/rubric/rubric-engine";

interface InlineAiBubbleProps {
  selectedText: string;
  cursorPosition: number;
  documentContent: string;
  activeModel: string;
  activeToneId: string;
  targetGrade: GradeLevel;
  onInsertText: (generatedText: string, replaceSelection?: boolean) => void;
  apiKeys?: { claudeKey?: string; geminiKey?: string };
}

export const InlineAiBubble: React.FC<InlineAiBubbleProps> = ({
  selectedText,
  cursorPosition,
  documentContent,
  activeModel,
  activeToneId,
  targetGrade,
  onInsertText,
  apiKeys,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K listener to summon chat bubble
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setGeneratedResult(null);
      } else if (e.key === "Escape" && isOpen) {
        if (!isLoading) {
          setIsOpen(false);
          setGeneratedResult(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bubbleContainerRef.current &&
        !bubbleContainerRef.current.contains(event.target as Node)
      ) {
        if (!isLoading && !generatedResult) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLoading, generatedResult]);

  const handleGenerate = async (customInstruction?: string) => {
    const instruction = customInstruction || prompt.trim();
    if (!instruction || isLoading) return;

    setIsLoading(true);
    setGeneratedResult(null);

    const fullPrompt = selectedText
      ? `${instruction}\n\nSelected Text to rewrite/improve:\n"""\n${selectedText}\n"""\n\nFull Document Context for reference:\n"""\n${documentContent.slice(0, 4000)}\n"""`
      : `${instruction}\n\nPreceding Document Context for reference:\n"""\n${documentContent.slice(-3000)}\n"""`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: activeModel,
          messages: [{ role: "user", content: fullPrompt }],
          context: {
            toneId: activeToneId,
            targetGrade: targetGrade,
            activeDocContent: documentContent,
          },
          apiKeys,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setGeneratedResult(data.reply);
      } else if (data.error) {
        alert(`AI Error: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Generation failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (generatedResult) {
      onInsertText(generatedResult, Boolean(selectedText));
      setGeneratedResult(null);
      setPrompt("");
      setIsOpen(false);
    }
  };

  const handleDiscard = () => {
    setGeneratedResult(null);
  };

  return (
    <div ref={bubbleContainerRef} className="relative z-30 select-none">
      {/* 1. Exact ClaudePrism Circular Floating Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setGeneratedResult(null);
          }}
          className="pointer-events-auto flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl scale-100 opacity-100"
          aria-label="Open AI Assistant"
          title="Open AI Assistant (Ctrl+K)"
        >
          <MessageCircle className="size-5 text-foreground" />
        </button>
      )}

      {/* 2. ClaudePrism Floating Blank Popover */}
      {isOpen && (
        <div className="absolute right-0 bottom-0 w-[440px] max-w-[90vw] rounded-2xl border border-border bg-card shadow-2xl p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-xs">
          {/* Popover Header */}
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI Assistant</span>
              <span className="text-[10px] font-normal text-muted-foreground">
                ({targetGrade})
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setGeneratedResult(null);
                }}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Selected Text indicator */}
          {selectedText && (
            <div className="px-3 py-1 rounded-lg bg-muted/60 text-[11px] text-muted-foreground truncate border border-border/40">
              <span className="font-semibold text-foreground">Selection: </span>
              "{selectedText.slice(0, 50)}..."
            </div>
          )}

          {/* Blank Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="relative flex items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                selectedText
                  ? "Ask AI to edit or rewrite selection..."
                  : "Ask AI to write at cursor..."
              }
              className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground/40 transition placeholder:text-muted-foreground/50 shadow-inner"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="absolute right-1.5 p-1.5 rounded-lg bg-foreground text-background hover:opacity-90 transition disabled:opacity-30"
              title="Send prompt"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CornerDownLeft className="w-3.5 h-3.5" />
              )}
            </button>
          </form>

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="pt-2 border-t border-border/60 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Proposed Text</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="px-2.5 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-foreground text-background text-[11px] font-semibold hover:opacity-90 transition shadow-sm"
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                    <span>{selectedText ? "Replace Selection" : "Insert at Cursor"}</span>
                  </button>
                </div>
              </div>

              <div className="max-h-52 overflow-y-auto text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans bg-muted/30 p-3 rounded-xl border border-border/50">
                {generatedResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
