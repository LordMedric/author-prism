"use client";

import React, { useState } from "react";
import { 
  X, 
  Wand2, 
  Sparkles, 
  FileText, 
  GraduationCap, 
  Sliders, 
  BookOpen, 
  Quote, 
  ArrowRight, 
  Check,
  RefreshCw,
  Layers,
  CheckCircle2,
  Upload,
  Paperclip,
  ChevronDown
} from "lucide-react";
import { GradeLevel } from "@/lib/rubric/rubric-engine";
import { FRAMEWORK_TEMPLATES, FrameworkTemplate } from "@/lib/templates/frameworks";
import { DEFAULT_TONE_PROFILES, ToneProfile } from "@/lib/tone/default-profiles";

interface AiPaperGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGeneratedPaper: (title: string, markdownContent: string) => void;
  activeModel: string;
  activeToneId: string;
  targetGrade: GradeLevel;
  apiKeys?: { claudeKey?: string; geminiKey?: string };
}

export const AiPaperGeneratorModal: React.FC<AiPaperGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyGeneratedPaper,
  activeModel,
  activeToneId,
  targetGrade,
  apiKeys,
}) => {
  const [topic, setTopic] = useState("");
  const [userContext, setUserContext] = useState("");
  const [uploadedBriefName, setUploadedBriefName] = useState<string | null>(null);
  const [briefText, setBriefText] = useState("");
  const [isUploadingBrief, setIsUploadingBrief] = useState(false);
  const [targetWordCount, setTargetWordCount] = useState("500");
  const [selectedFrameworkId, setSelectedFrameworkId] = useState(FRAMEWORK_TEMPLATES[0].id);
  const [selectedToneId, setSelectedToneId] = useState<string>(activeToneId || DEFAULT_TONE_PROFILES[0].id);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(targetGrade || "Distinction");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "preview">("input");

  if (!isOpen) return null;

  const activeFramework = FRAMEWORK_TEMPLATES.find(f => f.id === selectedFrameworkId) || FRAMEWORK_TEMPLATES[0];
  const activeTone = DEFAULT_TONE_PROFILES.find(t => t.id === selectedToneId) || DEFAULT_TONE_PROFILES[0];

  const handleBriefFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBrief(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text || data.markdown) {
        const fullContent = data.markdown || data.text;
        setUploadedBriefName(file.name);
        setBriefText(fullContent);

        // If topic is empty, infer from file title or first non-empty line
        if (!topic.trim()) {
          const firstLine = fullContent.split(/\r?\n/).find((l: string) => l.trim().length > 5);
          setTopic(firstLine?.replace(/^[#\*\-]+\s*/, "").slice(0, 80) || data.title || file.name);
        }
      }
    } catch (err: any) {
      alert(`Failed to parse brief: ${err.message}`);
    } finally {
      setIsUploadingBrief(false);
    }
  };

  const handleGeneratePaper = async () => {
    if (!topic.trim() && !briefText.trim()) return;
    setIsGenerating(true);
    setStep("preview");

    const prompt = `
You are tasked with authoring a complete, rigorous, and publication-ready academic/strategy paper adhering to the following specifications:

### SPECIFICATIONS:
- **Title / Topic**: "${topic || uploadedBriefName || activeFramework.name}"
- **Framework Model**: "${activeFramework.name}"
- **Target Academic Standard**: "${selectedGrade}" (Distinction = deep critical evaluation, theoretical synthesis, minimal descriptive fluff)
- **Voice & Tone Profile**: "${activeTone.name}" (${activeTone.perspective}, formality ${activeTone.formality}/5, criticality ${activeTone.criticality}/5)
- **Target Word Count**: Approximately ${targetWordCount} words.

### VOICE & TONE GUIDELINES:
${activeTone.systemInstructions}

### ASSIGNMENT BRIEF & REQUIREMENTS (IF UPLOADED):
"""
${briefText || "No explicit assignment brief file uploaded."}
"""

### USER INPUTS & RAW CONTEXT / NOTES:
"""
${userContext || "No additional raw notes provided; synthesize the topic and brief fully using core academic literature and foundational frameworks."}
"""

### AUTHORING INSTRUCTIONS:
1. Write a complete, full-length document structured according to the chosen framework.
2. Directly answer and satisfy all requirements, learning outcomes, and criteria outlined in the assignment brief.
3. Ensure every section satisfies the **${selectedGrade}** grading rubric benchmarks:
   - For Academic Journal / Reflective models: Keep description under 15%; dedicate 85% to critical self-awareness, theoretical synthesis (e.g. Tuckman, Situational Leadership, Argyris & Schön), analysis of leadership identity, and actionable lessons learned.
   - For Strategic models (SWOT/TOWS/PESTLE): Cross-match internal capabilities with external drivers to formulate clear strategic horizons.
4. Substantively cite academic literature throughout in **Harvard style** (Author, Year) or Author (Year, p. X).
5. Conclude with a complete, alphabetized **## References** section formatted in standard Harvard style.
`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: activeModel,
          messages: [{ role: "user", content: prompt }],
          context: {
            toneId: selectedToneId,
            targetGrade: selectedGrade,
          },
          apiKeys,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setGeneratedPaper(data.reply);
      } else if (data.error) {
        alert(`Generation error: ${data.error}`);
        setStep("input");
      }
    } catch (e: any) {
      alert(`Network error: ${e.message}`);
      setStep("input");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptPaper = () => {
    if (generatedPaper) {
      onApplyGeneratedPaper(topic || uploadedBriefName || activeFramework.name, generatedPaper);
      onClose();
      setGeneratedPaper(null);
      setStep("input");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">AuthorPrism Studio</h2>
              <p className="text-xs text-muted-foreground">
                Author complete reflective essays, journal assignments, and strategy papers from your brief & notes
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {step === "input" ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {/* 1. Topic & Assignment Brief Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground">1. Assignment Brief or Topic</label>

                {/* Upload Assignment Brief File Button */}
                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-muted/60 hover:bg-muted text-foreground text-[11px] font-medium cursor-pointer transition">
                  <Upload className="w-3 h-3 text-primary" />
                  <span>{isUploadingBrief ? "Parsing Brief..." : uploadedBriefName ? "Replace Brief" : "Upload Assignment Brief (.pdf/.docx/.txt)"}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleBriefFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Brief Badge indicator if uploaded */}
              {uploadedBriefName && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Paperclip className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-semibold truncate">Loaded Brief: {uploadedBriefName}</span>
                    <span className="opacity-80">({briefText.split(/\s+/).length} words parsed)</span>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedBriefName(null);
                      setBriefText("");
                    }}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                    title="Remove brief"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. SG7014 Journal Assignment #2: My Ability to Lead Groups..."
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-xs"
              />
            </div>

            {/* 2. Framework Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">2. Select Framework / Paper Structure</label>
              <div className="grid grid-cols-2 gap-2">
                {FRAMEWORK_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedFrameworkId(tmpl.id)}
                    className={`p-3 rounded-xl text-left border transition flex flex-col gap-1 ${
                      selectedFrameworkId === tmpl.id
                        ? "border-primary/50 bg-primary/5 text-foreground font-semibold shadow-sm"
                        : "border-border bg-background hover:bg-muted/60 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">{tmpl.name}</span>
                      {selectedFrameworkId === tmpl.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">{tmpl.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Voice & Tone Profile Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center justify-between">
                <span>3. Voice & Tone Profile</span>
                <span className="text-[10px] text-muted-foreground">Select writing personality & perspective</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DEFAULT_TONE_PROFILES.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedToneId(tone.id)}
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col gap-1 ${
                      selectedToneId === tone.id
                        ? "border-indigo-500/50 bg-indigo-500/5 text-foreground font-semibold shadow-sm"
                        : "border-border bg-background hover:bg-muted/60 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-xs">{tone.name}</span>
                      {selectedToneId === tone.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground line-clamp-2">{tone.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. User Raw Context, Notes, & Experiences */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center justify-between">
                <span>4. Your Raw Notes, Key Experiences & Context</span>
                <span className="text-[10px] text-muted-foreground">What happened? Specific leadership examples?</span>
              </label>
              <textarea
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                rows={3}
                placeholder="Paste rough bullets, personal incident description, conflict encountered, actions taken, or team context here..."
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary text-xs leading-relaxed"
              />
            </div>

            {/* 5. Calibration Summary & Word Count */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-border bg-muted/20">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Target Academic Standard</span>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                  className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none mt-1"
                >
                  <option value="Distinction">Distinction (70%+ / First-Class)</option>
                  <option value="Merit">Merit (60-69% / 2:1)</option>
                  <option value="Pass">Pass (50-59% / 2:2)</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Target Word Count</span>
                <select
                  value={targetWordCount}
                  onChange={(e) => setTargetWordCount(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none mt-1"
                >
                  <option value="500">~500 words (Journal Assignment standard)</option>
                  <option value="1000">~1,000 words</option>
                  <option value="1500">~1,500 words</option>
                  <option value="2500">~2,500 words</option>
                  <option value="3500">~3,500 words</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePaper}
                disabled={(!topic.trim() && !briefText.trim()) || isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Author Full Paper with AI</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Generating State or Preview State */}
            <div className="p-3 border-b border-border flex items-center justify-between bg-card/60">
              <div className="flex items-center gap-2 text-xs">
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                    <span className="font-semibold text-foreground">Author Prism is drafting with {activeTone.name} ({selectedGrade})...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-foreground">Draft Complete ({activeTone.name} &bull; {selectedGrade})</span>
                  </>
                )}
              </div>

              {!isGenerating && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep("input")}
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs"
                  >
                    Back to Inputs
                  </button>
                  <button
                    onClick={handleAcceptPaper}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Paper to Editor</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-background">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-muted-foreground">
                  <Wand2 className="w-10 h-10 animate-bounce text-primary" />
                  <p className="text-sm font-semibold text-foreground">Synthesizing assignment brief in {activeTone.name} tone...</p>
                  <p className="text-xs max-w-md">Applying theoretical frameworks, structuring reflexivity, and formatting Harvard citations.</p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground bg-transparent p-0 border-0">
                    {generatedPaper}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
