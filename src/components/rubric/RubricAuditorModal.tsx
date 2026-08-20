"use client";

import React, { useState } from "react";
import { 
  X, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Sliders, 
  BookOpen, 
  Sparkles,
  Upload
} from "lucide-react";
import { GradeLevel } from "@/lib/rubric/rubric-engine";
import { DEFAULT_ACADEMIC_RUBRIC, GradingRubric } from "@/lib/rubric/default-standards";

interface RubricAuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
}

export const RubricAuditorModal: React.FC<RubricAuditorModalProps> = ({
  isOpen,
  onClose,
  targetGrade,
  onSelectGrade,
}) => {
  const [rubric, setRubric] = useState<GradingRubric>(DEFAULT_ACADEMIC_RUBRIC);
  const [customRubricText, setCustomRubricText] = useState("");
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  if (!isOpen) return null;

  const levels: { level: GradeLevel; badge: string; desc: string; color: string }[] = [
    {
      level: "Distinction",
      badge: "70% - 100% (First-Class / A)",
      desc: "Deep critical self-awareness, theoretical synthesis, original insight, and flawless Harvard citations.",
      color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    },
    {
      level: "Merit",
      badge: "60% - 69% (2:1 / B)",
      desc: "Strong analytical application of frameworks, structured argument, and clear conceptual grounding.",
      color: "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      level: "Pass",
      badge: "50% - 59% (2:2 / C)",
      desc: "Accurate descriptive account, baseline framework utilization, and essential referencing.",
      color: "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Academic Grading Scale & Rubric Calibration</h2>
              <p className="text-xs text-muted-foreground">Calibrate AI evaluation benchmarks against UK / Higher Ed standards</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Grade Level Selection Cards */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
              1. Select Target Effort & Grade Level
            </span>

            <div className="grid grid-cols-3 gap-3">
              {levels.map((item) => (
                <button
                  key={item.level}
                  onClick={() => onSelectGrade(item.level)}
                  className={`p-4 rounded-xl text-left border transition flex flex-col justify-between ${
                    targetGrade === item.level
                      ? `${item.color} shadow-sm ring-1 ring-primary/40`
                      : "border-border bg-background hover:bg-muted/60 text-foreground"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span>{item.level}</span>
                      {targetGrade === item.level && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className="text-[10px] font-semibold opacity-80 block">{item.badge}</span>
                    <p className="text-[11px] text-muted-foreground pt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rubric Criteria Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                2. Active Rubric Criteria ({rubric.title})
              </span>
            </div>

            <div className="space-y-3">
              {rubric.criteria.map((c) => {
                const targetText = 
                  targetGrade === "Distinction" ? c.distinctionCriteria :
                  targetGrade === "Merit" ? c.meritCriteria : c.passCriteria;

                return (
                  <div key={c.id} className="p-4 rounded-xl border border-border bg-background space-y-2 text-xs">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>{c.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Weight: {c.weight}%
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase">
                        Target Standard ({targetGrade}):
                      </span>
                      <p className="text-muted-foreground leading-relaxed">{targetText}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
