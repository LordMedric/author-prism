"use client";

import React, { useState } from "react";
import { 
  X, 
  Presentation, 
  Download, 
  Plus, 
  Trash2, 
  Palette, 
  Layout, 
  Sparkles,
  Layers,
  FileText
} from "lucide-react";
import { SlideData, SLIDE_THEMES, SlideTheme } from "@/lib/slides/slide-templates";

interface SlideDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent: string;
}

export const SlideDeckModal: React.FC<SlideDeckModalProps> = ({
  isOpen,
  onClose,
  documentContent,
}) => {
  const [themeKey, setThemeKey] = useState("nordic-slate");
  const [deckTitle, setDeckTitle] = useState("Executive Strategy Presentation");
  const [slides, setSlides] = useState<SlideData[]>([
    {
      type: "title",
      title: "Strategic Overview & Reflective Evaluation",
      subtitle: "Executive Briefing & Action Framework | Author Prism",
      badge: "STRATEGY HORIZON 2026",
      notes: "Welcome stakeholders. Today we review the strategic evaluation and core operational frameworks."
    },
    {
      type: "swot",
      title: "Strategic Posture: SWOT Diagnostic",
      subtitle: "Internal Core Capabilities vs. External Macro Realities",
      badge: "DIAGNOSTIC MATRIX",
      cards: [
        { title: "STRENGTHS", desc: "Proprietary IP portfolio and strong customer brand loyalty." },
        { title: "WEAKNESSES", desc: "High fixed capital intensity and technical architecture debt." },
        { title: "OPPORTUNITIES", desc: "24% CAGR in emerging markets with tier-1 distribution alliances." },
        { title: "THREATS", desc: "Impending regulatory tightening and inflationary pressure on spending." }
      ],
      notes: "Focus on SO strategies: deploying our IP into fast growing international markets."
    },
    {
      type: "cards-3",
      title: "Strategic Horizons & Implementation Pillars",
      subtitle: "Key transformation workstreams",
      badge: "EXECUTION PLAN",
      cards: [
        { title: "Horizon 1: Foundation", tag: "MONTHS 0-6", desc: "Conduct regulatory audit and solidify tier-1 distribution partnerships." },
        { title: "Horizon 2: Scale", tag: "MONTHS 6-18", desc: "Pilot modernized product stack in top 2 international growth markets." },
        { title: "Horizon 3: Expansion", tag: "MONTHS 18-36", desc: "Establish permanent operational hubs and automated self-serve platform." }
      ]
    },
    {
      type: "metrics",
      title: "Key Performance & Impact Projections",
      subtitle: "Quantifiable milestones across operational horizons",
      badge: "METRICS & OKRS",
      metrics: [
        { value: "+34%", label: "Operating Efficiency via Stack Modernization", change: "Projected YoY" },
        { value: "$4.2M", label: "Estimated Addressable Market Pipeline", change: "Targeted by Q4" },
        { value: "98.4%", label: "Target Compliance & SLA Reliability", change: "Zero critical audit gaps" }
      ]
    }
  ]);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const currentTheme = SLIDE_THEMES[themeKey] || SLIDE_THEMES["nordic-slate"];

  const handleExportPptx = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: "pptx",
          slides,
          theme: themeKey,
          title: deckTitle,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate PPTX");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${deckTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e: any) {
      alert(`Export error: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const addSlide = (type: SlideData["type"]) => {
    const newSlide: SlideData = {
      type,
      title: `New ${type.toUpperCase()} Slide`,
      subtitle: "Add descriptive subheadings here",
      badge: "SECTION",
      cards: [
        { title: "Pillar 1", desc: "Detail points..." },
        { title: "Pillar 2", desc: "Detail points..." },
        { title: "Pillar 3", desc: "Detail points..." }
      ]
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Executive Slide Deck Builder</h2>
              <p className="text-xs text-muted-foreground">Design and export modern 16:9 PowerPoint presentations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Selector */}
            <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg border border-border text-xs">
              <Palette className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              {Object.values(SLIDE_THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeKey(t.id)}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    themeKey === t.id ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.name.split(" ")[0]}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportPptx}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? "Generating PPTX..." : "Download .PPTX"}</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Slide List & Editor */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {slides.map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-border bg-background space-y-3 relative group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {s.type}
                    </span>
                  </div>

                  <button
                    onClick={() => removeSlide(idx)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-destructive hover:bg-destructive/10 transition"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Slide Title</label>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => {
                        const updated = [...slides];
                        updated[idx].title = e.target.value;
                        setSlides(updated);
                      }}
                      className="w-full text-xs font-semibold p-2 rounded border border-border bg-card text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Subtitle / Category</label>
                    <input
                      type="text"
                      value={s.subtitle || ""}
                      onChange={(e) => {
                        const updated = [...slides];
                        updated[idx].subtitle = e.target.value;
                        setSlides(updated);
                      }}
                      className="w-full text-xs p-2 rounded border border-border bg-card text-foreground"
                    />
                  </div>
                </div>

                {/* Speaker Notes */}
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">Speaker Notes</label>
                  <input
                    type="text"
                    value={s.notes || ""}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[idx].notes = e.target.value;
                      setSlides(updated);
                    }}
                    placeholder="Add presenter talking points..."
                    className="w-full text-xs p-2 rounded border border-border bg-card text-muted-foreground focus:text-foreground"
                  />
                </div>
              </div>
            ))}

            {/* Add Slide Toolbar */}
            <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">Add New Slide:</span>
              <button
                onClick={() => addSlide("title")}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium transition"
              >
                + Title Slide
              </button>
              <button
                onClick={() => addSlide("swot")}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium transition"
              >
                + SWOT Matrix
              </button>
              <button
                onClick={() => addSlide("cards-3")}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium transition"
              >
                + 3-Pillar Cards
              </button>
              <button
                onClick={() => addSlide("metrics")}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium transition"
              >
                + Metric Callouts
              </button>
              <button
                onClick={() => addSlide("timeline")}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium transition"
              >
                + 4-Step Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
