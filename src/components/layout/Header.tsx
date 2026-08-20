"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Download, 
  Upload, 
  Settings, 
  Presentation, 
  BookOpen, 
  GraduationCap, 
  Quote, 
  Sliders, 
  ChevronDown, 
  Sun, 
  Moon, 
  PanelLeft, 
  PanelRight, 
  MoreHorizontal,
  Info,
  Zap,
  Brain,
  Layers
} from "lucide-react";
import { AVAILABLE_MODELS, AIModelOption } from "@/lib/ai/router";
import { GradeLevel } from "@/lib/rubric/rubric-engine";

interface HeaderProps {
  activeModel: string;
  onSelectModel: (modelId: string) => void;
  activeToneName: string;
  targetGrade: GradeLevel;
  onOpenToneModal: () => void;
  onOpenRubricModal: () => void;
  onOpenCitationsModal: () => void;
  onOpenSlidesModal: () => void;
  onOpenReadingsModal: () => void;
  onOpenSettingsModal: () => void;
  onExportDocx: () => void;
  onImportFile: () => void;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isAiPanelOpen: boolean;
  onToggleAiPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModel,
  onSelectModel,
  activeToneName,
  targetGrade,
  onOpenToneModal,
  onOpenRubricModal,
  onOpenCitationsModal,
  onOpenSlidesModal,
  onOpenReadingsModal,
  onOpenSettingsModal,
  onExportDocx,
  onImportFile,
  documentTitle,
  setDocumentTitle,
  theme,
  onToggleTheme,
  isSidebarOpen,
  onToggleSidebar,
  isAiPanelOpen,
  onToggleAiPanel,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<AIModelOption | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentModel = AVAILABLE_MODELS.find(m => m.id === activeModel) || AVAILABLE_MODELS[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    if (modelDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modelDropdownOpen]);

  return (
    <header className="h-13 border-b border-border/80 bg-card/60 backdrop-blur-md px-3 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Sidebar Toggle + Title */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition ${
            !isSidebarOpen ? "opacity-60" : "text-foreground"
          }`}
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-foreground/5 flex items-center justify-center border border-border text-foreground">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs text-foreground tracking-tight hidden sm:inline">Author Prism</span>
        </div>

        <span className="text-muted-foreground/40 text-xs">/</span>

        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          placeholder="Untitled Document"
          className="bg-transparent border border-transparent hover:border-border/60 focus:border-border rounded px-1.5 py-0.5 text-xs font-medium text-foreground focus:outline-none transition max-w-[200px] truncate"
        />
      </div>

      {/* Center: Simplified Context Indicators (Model & Status) */}
      <div className="flex items-center gap-1.5">
        {/* Model Selector Dropdown with Interactive Specialty Tooltip Cards */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-muted/70 text-[11px] font-medium text-foreground/90 transition border border-transparent hover:border-border/60"
            title="Switch AI Model Provider (Claude & Gemini)"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${currentModel.provider === "claude" ? "bg-amber-500" : "bg-blue-500"}`} />
            <span>{currentModel.name}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[460px] rounded-xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 border-b border-border/50 mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Select Model Provider</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {/* Column 1: Anthropic Claude */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 flex items-center gap-1">
                    <span>Anthropic Claude</span>
                  </div>
                  {AVAILABLE_MODELS.filter(m => m.provider === "claude").map((m) => (
                    <div
                      key={m.id}
                      onMouseEnter={() => setHoveredModel(m)}
                      onMouseLeave={() => setHoveredModel(null)}
                      onClick={() => {
                        onSelectModel(m.id);
                        setModelDropdownOpen(false);
                      }}
                      className={`p-2 rounded-lg text-xs cursor-pointer transition flex flex-col gap-0.5 border ${
                        activeModel === m.id
                          ? "border-amber-500/50 bg-amber-500/10 font-semibold text-foreground"
                          : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground">{m.name}</span>
                        {m.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-medium">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{m.contextWindow}</span>
                    </div>
                  ))}
                </div>

                {/* Column 2: Google Gemini */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 flex items-center gap-1">
                    <span>Google Gemini</span>
                  </div>
                  {AVAILABLE_MODELS.filter(m => m.provider === "gemini").map((m) => (
                    <div
                      key={m.id}
                      onMouseEnter={() => setHoveredModel(m)}
                      onMouseLeave={() => setHoveredModel(null)}
                      onClick={() => {
                        onSelectModel(m.id);
                        setModelDropdownOpen(false);
                      }}
                      className={`p-2 rounded-lg text-xs cursor-pointer transition flex flex-col gap-0.5 border ${
                        activeModel === m.id
                          ? "border-blue-500/50 bg-blue-500/10 font-semibold text-foreground"
                          : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground">{m.name}</span>
                        {m.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300 font-medium">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{m.contextWindow}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Specialty Card on Hover */}
              <div className="mt-2 p-2.5 rounded-lg bg-muted/60 border border-border/60 text-xs space-y-1 min-h-[58px]">
                {hoveredModel ? (
                  <>
                    <div className="flex items-center justify-between font-semibold text-foreground text-[11px]">
                      <span>{hoveredModel.name} ({hoveredModel.contextWindow})</span>
                      <span className="text-[10px] uppercase font-mono text-muted-foreground">{hoveredModel.provider}</span>
                    </div>
                    <p className="text-[11px] text-primary dark:text-primary font-medium">
                      🎯 <span className="underline">Specialty</span>: {hoveredModel.bestFor}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{hoveredModel.description}</p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground text-[11px] h-full py-1">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Hover over any Claude or Gemini model above to view its writing specialty and context window.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tone Pill */}
        <button
          onClick={onOpenToneModal}
          className="px-2.5 py-1 rounded-md hover:bg-muted/70 text-[11px] text-muted-foreground hover:text-foreground transition flex items-center gap-1"
          title="Change Voice & Tone Profile"
        >
          <Sliders className="w-3 h-3 text-muted-foreground" />
          <span className="max-w-[90px] truncate">{activeToneName.split(" ")[0]}</span>
        </button>

        {/* Grade Standard Pill */}
        <button
          onClick={onOpenRubricModal}
          className="px-2.5 py-1 rounded-md hover:bg-muted/70 text-[11px] font-medium text-muted-foreground hover:text-foreground transition flex items-center gap-1"
          title="Target Academic Grade Level & Rubric"
        >
          <GraduationCap className="w-3 h-3 text-muted-foreground" />
          <span>{targetGrade}</span>
        </button>
      </div>

      {/* Right: Clean Action Bar */}
      <div className="flex items-center gap-1">
        {/* Readings Shortcut */}
        <button
          onClick={onOpenReadingsModal}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
          title="Reading Assignments & Chapter Synthesizer"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Citations Shortcut */}
        <button
          onClick={onOpenCitationsModal}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
          title="Harvard Citations & MyBib"
        >
          <Quote className="w-4 h-4" />
        </button>

        {/* Slides Shortcut */}
        <button
          onClick={onOpenSlidesModal}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
          title="Executive PPTX Slide Builder"
        >
          <Presentation className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Export DOCX button */}
        <button
          onClick={onExportDocx}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition ml-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* More Menu (Import / Settings) */}
        <div className="relative">
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {moreMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-lg border border-border bg-popover shadow-lg py-1 z-50 text-xs">
              <button
                onClick={() => {
                  onImportFile();
                  setMoreMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2 text-foreground"
              >
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Import File (.pdf/.docx/.md)</span>
              </button>
              <button
                onClick={() => {
                  onOpenSettingsModal();
                  setMoreMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2 text-foreground"
              >
                <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                <span>API Settings</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Co-author Panel Toggle */}
        <button
          onClick={onToggleAiPanel}
          className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition ml-1 ${
            isAiPanelOpen ? "text-foreground bg-muted/50" : ""
          }`}
          title={isAiPanelOpen ? "Hide AI assistant" : "Show AI assistant"}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
