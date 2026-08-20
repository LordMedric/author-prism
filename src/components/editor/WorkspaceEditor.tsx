"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  List, 
  Quote as QuoteIcon, 
  Columns, 
  Edit3, 
  Eye,
  BookmarkPlus,
  Wand2,
  Sparkles
} from "lucide-react";
import { formatWordCount, formatReadingTime } from "@/lib/utils";
import { InlineAiBubble } from "./InlineAiBubble";
import { GradeLevel } from "@/lib/rubric/rubric-engine";

interface WorkspaceEditorProps {
  content: string;
  onChange: (newContent: string) => void;
  onOpenCitationPicker?: () => void;
  onOpenAiGenerator?: () => void;
  activeModel: string;
  activeToneId: string;
  targetGrade: GradeLevel;
  apiKeys?: { claudeKey?: string; geminiKey?: string };
}

export const WorkspaceEditor: React.FC<WorkspaceEditorProps> = ({
  content,
  onChange,
  onOpenCitationPicker,
  onOpenAiGenerator,
  activeModel,
  activeToneId,
  targetGrade,
  apiKeys,
}) => {
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [selectedText, setSelectedText] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const words = formatWordCount(content);
  const readingTime = formatReadingTime(words);

  const insertSnippet = (prefix: string, suffix = "") => {
    onChange(`${content}\n${prefix} ${suffix}`);
  };

  const handleSelectText = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      setCursorPos(start);
      setSelectedText(content.substring(start, end));
    }
  };

  const handleInsertAiText = (generatedText: string, replaceSelection = false) => {
    if (replaceSelection && textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const updated = content.substring(0, start) + generatedText + content.substring(end);
      onChange(updated);
    } else {
      // Append at cursor or end
      const insertPoint = cursorPos > 0 ? cursorPos : content.length;
      const updated = content.substring(0, insertPoint) + "\n\n" + generatedText + "\n\n" + content.substring(insertPoint);
      onChange(updated);
    }
    setSelectedText("");
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.25rem)] bg-background overflow-hidden relative">
      {/* Sleek Minimalist Toolbar */}
      <div className="h-10 border-b border-border/80 px-3 flex items-center justify-between text-xs select-none bg-card/20">
        <div className="flex items-center gap-0.5">
          {/* AuthorPrism Studio Button */}
          {onOpenAiGenerator && (
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition text-[11px] shadow-sm mr-1.5"
              title="Open AuthorPrism Studio"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>AuthorPrism Studio</span>
            </button>
          )}

          <button
            onClick={() => insertSnippet("# ")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSnippet("## ")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-3 w-[1px] bg-border mx-1" />

          <button
            onClick={() => insertSnippet("**", "**")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSnippet("*", "*")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSnippet("> ")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Quote"
          >
            <QuoteIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSnippet("- ")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Bullet list"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          {onOpenCitationPicker && (
            <button
              onClick={onOpenCitationPicker}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition ml-1"
              title="Insert Harvard Citation"
            >
              <BookmarkPlus className="w-3 h-3 text-emerald-500" />
              <span>(Cite)</span>
            </button>
          )}
        </div>

        {/* View Mode & Metrics */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{words} words &bull; {readingTime}</span>

          <div className="flex items-center bg-muted/60 rounded-md p-0.5 border border-border/60">
            <button
              onClick={() => setViewMode("edit")}
              className={`p-1 rounded text-xs transition ${
                viewMode === "edit" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Write only"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`p-1 rounded text-xs transition ${
                viewMode === "split" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Split view"
            >
              <Columns className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`p-1 rounded text-xs transition ${
                viewMode === "preview" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Preview only"
            >
              <Eye className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={`h-full flex flex-col relative ${viewMode === "split" ? "w-1/2 border-r border-border/80" : "w-full max-w-3xl mx-auto"}`}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              onSelect={handleSelectText}
              onClick={handleSelectText}
              onKeyUp={handleSelectText}
              placeholder="Draft your essay or strategy report..."
              className="w-full h-full p-8 bg-transparent resize-none focus:outline-none font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/40 overflow-y-auto"
              spellCheck={true}
            />

            {/* ClaudePrism Floating AI Chat Bubble Button */}
            <div className="absolute right-4 bottom-6 z-30">
              <InlineAiBubble
                selectedText={selectedText}
                cursorPosition={cursorPos}
                documentContent={content}
                activeModel={activeModel}
                activeToneId={activeToneId}
                targetGrade={targetGrade}
                onInsertText={handleInsertAiText}
                apiKeys={apiKeys}
              />
            </div>
          </div>
        )}

        {(viewMode === "preview" || viewMode === "split") && (
          <div className={`h-full overflow-y-auto p-8 bg-card/20 ${viewMode === "split" ? "w-1/2" : "w-full max-w-3xl mx-auto"}`}>
            <article className="prose dark:prose-invert max-w-none text-foreground prose-sm prose-headings:text-foreground prose-p:leading-relaxed prose-table:border-collapse prose-th:border prose-th:border-border/80 prose-th:p-2 prose-td:border prose-td:border-border/80 prose-td:p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || "*Preview appears here.*"}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};
