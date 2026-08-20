"use client";

import React, { useState } from "react";
import { X, Key, ShieldCheck, Check, Sparkles } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: { claudeKey?: string; geminiKey?: string };
  onSaveKeys: (keys: { claudeKey?: string; geminiKey?: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKeys,
  onSaveKeys,
}) => {
  const [claudeKey, setClaudeKey] = useState(apiKeys.claudeKey || "");
  const [geminiKey, setGeminiKey] = useState(apiKeys.geminiKey || "");
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKeys({ claudeKey, geminiKey });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">API Settings & Keys</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>API keys are stored securely in your local browser session and never sent to third-party databases.</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center justify-between">
              <span>Anthropic API Key (Claude)</span>
              <span className="text-[10px] text-muted-foreground">sk-ant-...</span>
            </label>
            <input
              type="password"
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
              placeholder="Enter ANTHROPIC_API_KEY..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <span className="text-[10px] text-muted-foreground">AIzaSy...</span>
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter GEMINI_API_KEY..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary font-mono text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              {savedNotice ? <Check className="w-4 h-4" /> : <Key className="w-3.5 h-3.5" />}
              <span>{savedNotice ? "Saved!" : "Save Keys"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
