"use client";

import React, { useState } from "react";
import { 
  X, 
  BookOpen, 
  Upload, 
  Sparkles, 
  BookmarkCheck, 
  ArrowDownToLine, 
  RefreshCw, 
  Quote, 
  FileText,
  ChevronRight,
  List
} from "lucide-react";
import { Chapter, ReadingDocument } from "@/lib/readings/chapter-parser";
import { readingManager } from "@/lib/readings/reading-manager";

interface ReadingSummarizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToDoc: (text: string) => void;
  activeModel: string;
  apiKeys?: { claudeKey?: string; geminiKey?: string };
}

export const ReadingSummarizerModal: React.FC<ReadingSummarizerModalProps> = ({
  isOpen,
  onClose,
  onInsertToDoc,
  activeModel,
  apiKeys,
}) => {
  const [readingDoc, setReadingDoc] = useState<ReadingDocument | null>(() => {
    const sampleText = `Chapter 1: The Strategic Dilemma in Dynamic Markets
In contemporary business environments, organizations frequently face rapid environmental turbulence. Strategic management theories by Porter (1985) and Barney (1991) emphasize the enduring value of sustainable competitive advantage. However, dynamic capabilities as formulated by Teece (2007) argue that static resource configurations are insufficient. Leaders must sense, seize, and transform core assets to survive disruption.

Chapter 2: Experiential Learning and Organizational Reflexivity
Reflection is not merely an individual cognitive exercise; it is an organizational imperative. Argyris and Schön (1978) introduced double-loop learning to explain how teams must challenge underlying assumptions rather than merely fixing symptoms. In reflective practice, Gibbs (1988) underscores that emotional awareness directly informs decision-making velocity and long-term strategic resilience.`;
    return readingManager.createDocument("Strategic Management & Reflexivity Readings", sampleText, "Harvard Business & Education");
  });

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(readingDoc?.chapters[0] || null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [summaryOutput, setSummaryOutput] = useState<string>("");

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        const doc = readingManager.createDocument(data.title || file.name, data.text);
        setReadingDoc(doc);
        setSelectedChapter(doc.chapters[0] || null);
        setSummaryOutput("");
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    }
  };

  const handleSynthesizeChapter = async () => {
    if (!selectedChapter || !readingDoc) return;
    setIsSynthesizing(true);

    try {
      const prompt = readingManager.buildChapterPrompt(selectedChapter, readingDoc.title);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: "gemini-2.0-flash", // Default to Gemini for fast document synthesis
          messages: [{ role: "user", content: prompt }],
          apiKeys,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setSummaryOutput(data.reply);
      }
    } catch (e: any) {
      alert(`Synthesis error: ${e.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Reading Ingestion & Chapter Synthesizer</h2>
              <p className="text-xs text-muted-foreground">
                Ingest textbooks and papers &bull; Deep synthesis via Gemini 1M+ token context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Book / PDF / DOCX</span>
              <input type="file" accept=".pdf,.docx,.txt,.md" onChange={handleFileUpload} className="hidden" />
            </label>

            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chapter Selector Sidebar */}
          <div className="w-72 border-r border-border bg-muted/20 p-3 overflow-y-auto space-y-2">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase px-2 mb-1">
              Detected Chapters ({readingDoc?.chapters.length || 0})
            </div>

            {readingDoc?.chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChapter(ch);
                  setSummaryOutput("");
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition flex flex-col gap-1 border ${
                  selectedChapter?.id === ch.id
                    ? "bg-primary/10 border-primary/40 text-primary font-medium shadow-sm"
                    : "bg-card hover:bg-muted border-border text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{ch.title}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {ch.wordCount} words
                </span>
              </button>
            ))}
          </div>

          {/* Chapter Detail & Synthesis Output Pane */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {selectedChapter && (
              <div className="p-4 border-b border-border flex items-center justify-between bg-card/40">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{selectedChapter.title}</h3>
                  <p className="text-xs text-muted-foreground">{selectedChapter.wordCount} words</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSynthesizeChapter}
                    disabled={isSynthesizing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    {isSynthesizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{isSynthesizing ? "Synthesizing..." : "Synthesize Chapter"}</span>
                  </button>

                  {summaryOutput && (
                    <button
                      onClick={() => onInsertToDoc(`\n### Synthesis: ${selectedChapter.title}\n\n${summaryOutput}\n`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Insert into Draft</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {summaryOutput ? (
                <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini Deep Chapter Synthesis & Harvard Citations</span>
                  </div>
                  <div className="prose dark:prose-invert prose-xs max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground bg-transparent p-0 border-0">
                      {summaryOutput}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase">Raw Chapter Text Preview</div>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedChapter?.content || "Select a chapter on the left to begin."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
