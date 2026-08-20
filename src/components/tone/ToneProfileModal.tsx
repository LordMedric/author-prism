"use client";

import React, { useState } from "react";
import { 
  X, 
  Sliders, 
  Sparkles, 
  Check, 
  Plus, 
  UserCheck, 
  BookOpen, 
  Briefcase 
} from "lucide-react";
import { DEFAULT_TONE_PROFILES, ToneProfile } from "@/lib/tone/default-profiles";

interface ToneProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeToneId: string;
  onSelectTone: (toneId: string) => void;
}

export const ToneProfileModal: React.FC<ToneProfileModalProps> = ({
  isOpen,
  onClose,
  activeToneId,
  onSelectTone,
}) => {
  const [profiles, setProfiles] = useState<ToneProfile[]>(DEFAULT_TONE_PROFILES);
  const [selectedId, setSelectedId] = useState<string>(activeToneId);
  const [sampleText, setSampleText] = useState("");

  if (!isOpen) return null;

  const currentProfile = profiles.find(p => p.id === selectedId) || profiles[0];

  const handleSaveAndApply = () => {
    onSelectTone(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl h-[75vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Voice & Tone Profile Builder</h2>
              <p className="text-xs text-muted-foreground">Calibrate personality, perspective, and academic criticality</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndApply}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              Apply Tone Profile
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Profile List */}
          <div className="w-64 border-r border-border bg-muted/20 p-3 space-y-2 overflow-y-auto">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase px-2 mb-1">
              Pre-built Profiles
            </div>

            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left p-3 rounded-xl text-xs transition flex flex-col gap-1 border ${
                  selectedId === p.id
                    ? "bg-primary/10 border-primary/40 text-primary font-medium shadow-sm"
                    : "bg-card hover:bg-muted border-border text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{p.name}</span>
                  {selectedId === p.id && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <span className="text-[10px] text-muted-foreground line-clamp-2">
                  {p.description}
                </span>
              </button>
            ))}
          </div>

          {/* Profile Customizer / Preview */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-background">
            <div>
              <h3 className="text-sm font-bold text-foreground">{currentProfile.name}</h3>
              <p className="text-xs text-muted-foreground">{currentProfile.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Perspective</span>
                <div className="text-xs font-semibold text-foreground capitalize">
                  {currentProfile.perspective.replace("-", " ")}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Criticality vs Description</span>
                <div className="text-xs font-semibold text-foreground">
                  Level {currentProfile.criticality} / 5 (High Synthesis)
                </div>
              </div>
            </div>

            {/* System Instructions Preview */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground">System Guidelines Injected into AI:</span>
              <pre className="p-3.5 rounded-xl border border-border bg-card text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {currentProfile.systemInstructions}
              </pre>
            </div>

            {/* Sample Phrasing */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground">Model Sentence Structures:</span>
              <div className="space-y-1.5">
                {currentProfile.samplePhrases.map((phrase, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-card border border-border text-xs text-muted-foreground italic">
                    "{phrase}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
