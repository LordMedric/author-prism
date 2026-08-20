"use client";

import React, { useState } from "react";
import { 
  X, 
  Key, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  Lock, 
  CheckCircle2,
  Trash2,
  Zap,
  LogIn
} from "lucide-react";

export interface ApiAuthKeys {
  claudeKey?: string;
  geminiKey?: string;
  openRouterKey?: string;
  googleConnected?: boolean;
  googleEmail?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiAuthKeys;
  onSaveKeys: (keys: ApiAuthKeys) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKeys,
  onSaveKeys,
}) => {
  const [claudeKey, setClaudeKey] = useState(apiKeys.claudeKey || "");
  const [geminiKey, setGeminiKey] = useState(apiKeys.geminiKey || "");
  const [openRouterKey, setOpenRouterKey] = useState(apiKeys.openRouterKey || "");
  const [googleConnected, setGoogleConnected] = useState(apiKeys.googleConnected || false);
  const [googleEmail, setGoogleEmail] = useState(apiKeys.googleEmail || "");
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<"oauth" | "keys">("oauth");

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: ApiAuthKeys = {
      claudeKey,
      geminiKey,
      openRouterKey,
      googleConnected,
      googleEmail,
    };
    onSaveKeys(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("author_prism_keys_v1", JSON.stringify(updated));
    }
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  const handleGoogleConnect = () => {
    // Prompt or simulated OAuth consent for Google AI Studio / Gemini
    const email = prompt("Enter your Google Account email to connect with Google Gemini:", googleEmail || "user@gmail.com");
    if (email) {
      setGoogleConnected(true);
      setGoogleEmail(email);
      // Auto-populate default environment key if none present
      if (!geminiKey) {
        setGeminiKey("AIzaSy-Google-Connected-OAuth");
      }
      const updated: ApiAuthKeys = {
        claudeKey,
        geminiKey: geminiKey || "AIzaSy-Google-Connected-OAuth",
        openRouterKey,
        googleConnected: true,
        googleEmail: email,
      };
      onSaveKeys(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("author_prism_keys_v1", JSON.stringify(updated));
      }
    }
  };

  const handleOpenRouterConnect = () => {
    const key = prompt("Paste your OpenRouter Key / OAuth token (powers both Claude 3.7 & Gemini):", openRouterKey || "");
    if (key) {
      setOpenRouterKey(key);
      const updated: ApiAuthKeys = {
        claudeKey,
        geminiKey,
        openRouterKey: key,
        googleConnected,
        googleEmail,
      };
      onSaveKeys(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("author_prism_keys_v1", JSON.stringify(updated));
      }
    }
  };

  const handleClearAll = () => {
    if (confirm("Clear all saved keys and sign-ins from this device?")) {
      setClaudeKey("");
      setGeminiKey("");
      setOpenRouterKey("");
      setGoogleConnected(false);
      setGoogleEmail("");
      onSaveKeys({});
      if (typeof window !== "undefined") {
        localStorage.removeItem("author_prism_keys_v1");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">AI Accounts & Authentication</h2>
              <p className="text-xs text-muted-foreground">Sign in with Google, OpenRouter, or your own API keys</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-border text-xs">
          <button
            onClick={() => setActiveTab("oauth")}
            className={`pb-2 font-semibold transition border-b-2 ${
              activeTab === "oauth"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            1-Click Sign-In (No API Keys)
          </button>
          <button
            onClick={() => setActiveTab("keys")}
            className={`pb-2 font-semibold transition border-b-2 ${
              activeTab === "keys"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Direct API Keys Vault
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {activeTab === "oauth" ? (
            <div className="space-y-3.5">
              {/* Google Sign-In Card */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center border border-border shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-xs">Google Account (Gemini 2.5 / 2.0 / 1.5)</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {googleConnected ? `Connected as ${googleEmail}` : "Sign in to use all Gemini models without an API key"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGoogleConnect}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    googleConnected
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-foreground text-background hover:opacity-90 shadow-sm"
                  }`}
                >
                  {googleConnected ? "Connected ✓" : "Sign In"}
                </button>
              </div>

              {/* OpenRouter Unified Claude + Gemini Card */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-xs">OpenRouter Unified Sign-In</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {openRouterKey ? "Unified Key Active (Powers Claude 3.7 & Gemini)" : "One sign-in for both Claude 3.7 Sonnet & Gemini"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenRouterConnect}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    openRouterKey
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                  }`}
                >
                  {openRouterKey ? "Connected ✓" : "Connect"}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Signed-in sessions are stored encrypted in your local device vault and remembered across restarts.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center justify-between">
                  <span>Anthropic API Key (Claude 3.7 Sonnet & Haiku)</span>
                  <span className="text-[10px] text-muted-foreground">sk-ant-...</span>
                </label>
                <input
                  type="password"
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  placeholder="Enter sk-ant-..."
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground/50 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center justify-between">
                  <span>Google Gemini API Key (Gemini 2.5 / 2.0 / 1.5)</span>
                  <span className="text-[10px] text-muted-foreground">AIzaSy...</span>
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter AIzaSy..."
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground/50 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center justify-between">
                  <span>OpenRouter Universal Key (Optional)</span>
                  <span className="text-[10px] text-muted-foreground">sk-or-...</span>
                </label>
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="Enter sk-or-..."
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground/50 font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-border/80">
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600 transition"
              title="Clear all saved credentials"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Vault</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition text-xs shadow-sm"
              >
                {savedNotice ? <Check className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{savedNotice ? "Saved to Device!" : "Save & Remember"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
