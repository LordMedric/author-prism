"use client";

import React, { useState } from "react";
import { 
  X, 
  Quote, 
  Search, 
  Plus, 
  Copy, 
  ArrowDownToLine, 
  Trash2, 
  Upload, 
  BookMarked,
  Check
} from "lucide-react";
import { CitationItem, harvardFormatter } from "@/lib/citations/harvard-formatter";
import { myBibParser } from "@/lib/citations/mybib-parser";

interface CitationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  citations: CitationItem[];
  onUpdateCitations: (items: CitationItem[]) => void;
  onInsertInTextCitation: (inTextStr: string) => void;
  onInsertBibliography: (bibStr: string) => void;
}

export const CitationManagerModal: React.FC<CitationManagerModalProps> = ({
  isOpen,
  onClose,
  citations,
  onUpdateCitations,
  onInsertInTextCitation,
  onInsertBibliography,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CitationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [myBibText, setMyBibText] = useState("");
  const [activeTab, setActiveTab] = useState<"library" | "search" | "mybib">("library");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const res = await fetch(`/api/citations/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (e: any) {
      alert(`Search failed: ${e.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCitation = (item: CitationItem) => {
    if (!citations.some(c => c.id === item.id || (c.doi && c.doi === item.doi))) {
      onUpdateCitations([...citations, item]);
    }
  };

  const handleRemoveCitation = (id: string) => {
    onUpdateCitations(citations.filter(c => c.id !== id));
  };

  const handleImportMyBib = () => {
    if (!myBibText.trim()) return;
    let parsed: CitationItem[] = [];
    if (myBibText.trim().startsWith("[") || myBibText.trim().startsWith("{")) {
      parsed = myBibParser.parseCslJson(myBibText);
    } else {
      parsed = myBibParser.parseRis(myBibText);
    }

    if (parsed.length > 0) {
      onUpdateCitations([...citations, ...parsed]);
      setMyBibText("");
      setActiveTab("library");
    } else {
      alert("Could not parse MyBib data. Please ensure it is valid CSL-JSON or RIS format.");
    }
  };

  const copyInText = (item: CitationItem) => {
    const text = harvardFormatter.formatInText(item);
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Harvard Referencing & MyBib Manager</h2>
              <p className="text-xs text-muted-foreground">Standard UK/Harvard citation generator & metadata finder</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted p-1 rounded-lg border border-border text-xs">
              <button
                onClick={() => setActiveTab("library")}
                className={`px-3 py-1 rounded transition ${activeTab === "library" ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                My Library ({citations.length})
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`px-3 py-1 rounded transition ${activeTab === "search" ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Lookup (DOI/Title)
              </button>
              <button
                onClick={() => setActiveTab("mybib")}
                className={`px-3 py-1 rounded transition ${activeTab === "mybib" ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Import MyBib
              </button>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: LIBRARY */}
          {activeTab === "library" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Project Citations ({citations.length})
                </span>

                {citations.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onInsertBibliography(harvardFormatter.generateBibliography(citations))}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Insert Full Reference List</span>
                    </button>
                  </div>
                )}
              </div>

              {citations.length === 0 ? (
                <div className="p-8 border border-dashed border-border rounded-xl text-center text-xs text-muted-foreground space-y-2">
                  <BookMarked className="w-8 h-8 mx-auto text-muted-foreground/40" />
                  <p>No citations added yet.</p>
                  <p className="text-[11px]">Use the "Lookup (DOI/Title)" tab or import from MyBib to populate your reference list.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {citations.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between text-xs group hover:border-primary/40 transition"
                    >
                      <div className="flex-1 pr-4 space-y-1">
                        <div className="font-semibold text-foreground">
                          {c.authors.map(a => `${a.lastName}, ${a.firstName?.charAt(0) || ""}`).join(", ")} ({c.year})
                        </div>
                        <div className="text-muted-foreground text-[11px] italic">{c.title}</div>
                        <div className="text-[10px] text-muted-foreground">{c.sourceTitle || c.publisher}</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onInsertInTextCitation(harvardFormatter.formatInText(c))}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium transition"
                          title="Insert (Author, Year) into editor"
                        >
                          Insert In-Text
                        </button>
                        <button
                          onClick={() => copyInText(c)}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground transition"
                          title="Copy In-Text citation"
                        >
                          {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleRemoveCitation(c.id)}
                          className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEARCH */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Enter DOI (e.g. 10.1002/smj.425), Book Title, or Author..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearching ? "Searching..." : "Search"}</span>
                </button>
              </div>

              <div className="space-y-2">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 pr-4 space-y-1">
                      <div className="font-semibold text-foreground">
                        {item.authors.map(a => `${a.lastName}, ${a.firstName?.charAt(0) || ""}`).join(", ")} ({item.year})
                      </div>
                      <div className="text-muted-foreground italic">{item.title}</div>
                      <div className="text-[10px] text-muted-foreground">{item.sourceTitle || item.publisher}</div>
                    </div>

                    <button
                      onClick={() => handleAddCitation(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Library</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT MYBIB */}
          {activeTab === "mybib" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Paste your exported CSL-JSON or RIS citations from <a href="https://www.mybib.com" target="_blank" rel="noreferrer" className="text-primary underline">MyBib.com</a> below to bulk-import them into Author Prism.
              </p>

              <textarea
                value={myBibText}
                onChange={(e) => setMyBibText(e.target.value)}
                placeholder="Paste CSL-JSON or RIS format here..."
                className="w-full h-48 p-3 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
              />

              <button
                onClick={handleImportMyBib}
                disabled={!myBibText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Citations</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
