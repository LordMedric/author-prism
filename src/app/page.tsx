"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { WorkspaceEditor } from "@/components/editor/WorkspaceEditor";
import { AiAssistantPanel, ChatViewMode } from "@/components/chat/AiAssistantPanel";
import { SlideDeckModal } from "@/components/slides/SlideDeckModal";
import { ReadingSummarizerModal } from "@/components/readings/ReadingSummarizerModal";
import { CitationManagerModal } from "@/components/citations/CitationManagerModal";
import { ToneProfileModal } from "@/components/tone/ToneProfileModal";
import { RubricAuditorModal } from "@/components/rubric/RubricAuditorModal";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { AiPaperGeneratorModal } from "@/components/writer/AiPaperGeneratorModal";
import { FRAMEWORK_TEMPLATES, FrameworkTemplate } from "@/lib/templates/frameworks";
import { DEFAULT_TONE_PROFILES } from "@/lib/tone/default-profiles";
import { GradeLevel } from "@/lib/rubric/rubric-engine";
import { CitationItem } from "@/lib/citations/harvard-formatter";
import { FileItem, DEFAULT_PROJECT_FILES } from "@/lib/files/file-tree";
import { formatWordCount } from "@/lib/utils";

export default function Home() {
  // File Hierarchy State
  const [files, setFiles] = useState<FileItem[]>(DEFAULT_PROJECT_FILES);
  const [activeFileId, setActiveFileId] = useState<string>("file-journal-2");

  // Content for currently selected active file
  const activeFile = files.find(f => f.id === activeFileId);
  const [content, setContent] = useState<string>(activeFile?.content || FRAMEWORK_TEMPLATES[0].defaultContent);
  const [documentTitle, setDocumentTitle] = useState(activeFile?.name || "SG7014-Journal-Assignment-2.md");

  // AI, Tone, Rubric, Theme States
  const [activeModel, setActiveModel] = useState<string>("claude-3-7-sonnet-20250219");
  const [activeToneId, setActiveToneId] = useState<string>("academic-journal-practitioner");
  const [targetGrade, setTargetGrade] = useState<GradeLevel>("Distinction");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatViewMode, setChatViewMode] = useState<ChatViewMode>("docked");

  // Citations
  const [citations, setCitations] = useState<CitationItem[]>([
    {
      id: "sample-1",
      type: "book",
      authors: [{ lastName: "Gibbs", firstName: "Graham" }],
      year: 1988,
      title: "Learning by Doing: A Guide to Teaching and Learning Methods",
      placeOfPublication: "Oxford",
      publisher: "Further Education Unit",
    },
    {
      id: "sample-2",
      type: "journal",
      authors: [
        { lastName: "Argyris", firstName: "Chris" },
        { lastName: "Schön", firstName: "Donald" }
      ],
      year: 1978,
      title: "Organizational Learning: A Theory of Action Perspective",
      sourceTitle: "Addison-Wesley",
      volume: "12",
      issue: "3",
      pages: "112-129",
      doi: "10.2307/40183921"
    }
  ]);

  const [apiKeys, setApiKeys] = useState<any>({});

  // Hydrate persistent API keys & sign-ins from local device vault on start
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("author_prism_keys_v1");
        if (stored) {
          setApiKeys(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load local vault keys:", e);
      }
    }
  }, []);

  // Modals state
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState(false);
  const [isToneModalOpen, setIsToneModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);

  // Sync theme with document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Sync content back to active file in files array
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  // Switch active file
  const handleSelectFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file && file.type === "file") {
      setActiveFileId(file.id);
      setContent(file.content || "");
      setDocumentTitle(file.name);
    }
  };

  // Create new file
  const handleCreateFile = (name: string, parentId: string | null) => {
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name,
      type: "file",
      parentId,
      content: `# ${name.replace(/\.[^/.]+$/, "")}\n\nStart writing here...`,
    };
    setFiles(prev => [...prev, newFile]);
    handleSelectFile(newFile.id);
  };

  // Create new folder
  const handleCreateFolder = (name: string, parentId: string | null) => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name,
      type: "folder",
      parentId,
      isOpen: true,
    };
    setFiles(prev => [...prev, newFolder]);
  };

  // Rename item
  const handleRenameItem = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    if (id === activeFileId) {
      setDocumentTitle(newName);
    }
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id && f.parentId !== id));
    if (id === activeFileId) {
      const remainingFiles = files.filter(f => f.id !== id && f.type === "file");
      if (remainingFiles.length > 0) {
        handleSelectFile(remainingFiles[0].id);
      }
    }
  };

  // Toggle folder open/close
  const handleToggleFolder = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isOpen: !f.isOpen } : f));
  };

  const handleSelectTemplate = (template: FrameworkTemplate) => {
    if (content.trim().length > 100) {
      if (!confirm(`Replace current document with "${template.name}" template?`)) {
        return;
      }
    }
    handleContentChange(template.defaultContent);
    setDocumentTitle(template.name);
  };

  const handleApplyGeneratedPaper = (title: string, markdownContent: string) => {
    const safeTitle = title.endsWith(".md") ? title : `${title.replace(/[^a-zA-Z0-9_-]/g, "-")}.md`;
    handleContentChange(markdownContent);
    setDocumentTitle(safeTitle);
    handleRenameItem(activeFileId, safeTitle);
  };

  const handleExportDocx = async () => {
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: "docx",
          content,
          title: documentTitle,
        }),
      });

      if (!res.ok) throw new Error("Failed to export DOCX");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e: any) {
      alert(`Export error: ${e.message}`);
    }
  };

  const handleImportFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,.md,.txt";
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/import", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.markdown || data.text) {
          const newDocTitle = data.title || file.name;
          const importedFile: FileItem = {
            id: `file-imported-${Date.now()}`,
            name: newDocTitle.endsWith(".md") ? newDocTitle : `${newDocTitle}.md`,
            type: "file",
            parentId: null,
            content: data.markdown || data.text,
          };
          setFiles(prev => [...prev, importedFile]);
          setActiveFileId(importedFile.id);
          setContent(importedFile.content || "");
          setDocumentTitle(importedFile.name);
        }
      } catch (err: any) {
        alert(`Import failed: ${err.message}`);
      }
    };
    input.click();
  };

  const activeTone = DEFAULT_TONE_PROFILES.find(t => t.id === activeToneId) || DEFAULT_TONE_PROFILES[0];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      <Header
        activeModel={activeModel}
        onSelectModel={setActiveModel}
        activeToneName={activeTone.name}
        targetGrade={targetGrade}
        onOpenToneModal={() => setIsToneModalOpen(true)}
        onOpenRubricModal={() => setIsRubricModalOpen(true)}
        onOpenCitationsModal={() => setIsCitationModalOpen(true)}
        onOpenSlidesModal={() => setIsSlideModalOpen(true)}
        onOpenReadingsModal={() => setIsReadingModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onExportDocx={handleExportDocx}
        onImportFile={handleImportFile}
        documentTitle={documentTitle}
        setDocumentTitle={(title) => {
          setDocumentTitle(title);
          handleRenameItem(activeFileId, title);
        }}
        theme={theme}
        onToggleTheme={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isAiPanelOpen={chatViewMode !== "bubble"}
        onToggleAiPanel={() => setChatViewMode(prev => prev === "bubble" ? "docked" : "bubble")}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar with File Hierarchy Tree */}
        <Sidebar
          isOpen={isSidebarOpen}
          files={files}
          activeFileId={activeFileId}
          onSelectFile={handleSelectFile}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onRenameItem={handleRenameItem}
          onDeleteItem={handleDeleteItem}
          onToggleFolder={handleToggleFolder}
          onSelectTemplate={handleSelectTemplate}
          onOpenToneModal={() => setIsToneModalOpen(true)}
          onOpenRubricModal={() => setIsRubricModalOpen(true)}
          onOpenCitationsModal={() => setIsCitationModalOpen(true)}
          onOpenReadingsModal={() => setIsReadingModalOpen(true)}
          onOpenSlidesModal={() => setIsSlideModalOpen(true)}
          wordCount={formatWordCount(content)}
        />

        {/* Center Workspace Editor with in-line AI bubble & AI Author button */}
        <WorkspaceEditor
          content={content}
          onChange={handleContentChange}
          onOpenCitationPicker={() => setIsCitationModalOpen(true)}
          onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
          activeModel={activeModel}
          activeToneId={activeToneId}
          targetGrade={targetGrade}
          apiKeys={apiKeys}
        />

        {/* 3-Mode AI Assistant: Floating Bubble, Docked Sidebar, or Maximized Overlay */}
        <AiAssistantPanel
          viewMode={chatViewMode}
          onChangeViewMode={setChatViewMode}
          activeModel={activeModel}
          activeToneId={activeToneId}
          targetGrade={targetGrade}
          activeDocContent={content}
          onApplyChanges={handleContentChange}
          onAppendToDoc={(snippet) => handleContentChange(`${content}\n\n${snippet}`)}
          onOpenRubricModal={() => setIsRubricModalOpen(true)}
          apiKeys={apiKeys}
        />
      </div>

      {/* AI Full Paper Authoring Studio Modal */}
      <AiPaperGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onApplyGeneratedPaper={handleApplyGeneratedPaper}
        activeModel={activeModel}
        activeToneId={activeToneId}
        targetGrade={targetGrade}
        apiKeys={apiKeys}
      />

      {/* Feature Modals */}
      <SlideDeckModal
        isOpen={isSlideModalOpen}
        onClose={() => setIsSlideModalOpen(false)}
        documentContent={content}
      />

      <ReadingSummarizerModal
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
        onInsertToDoc={(snippet) => handleContentChange(`${content}\n\n${snippet}`)}
        activeModel={activeModel}
        apiKeys={apiKeys}
      />

      <CitationManagerModal
        isOpen={isCitationModalOpen}
        onClose={() => setIsCitationModalOpen(false)}
        citations={citations}
        onUpdateCitations={setCitations}
        onInsertInTextCitation={(inText) => handleContentChange(`${content} ${inText}`)}
        onInsertBibliography={(bib) => handleContentChange(`${content}\n\n${bib}`)}
      />

      <ToneProfileModal
        isOpen={isToneModalOpen}
        onClose={() => setIsToneModalOpen(false)}
        activeToneId={activeToneId}
        onSelectTone={setActiveToneId}
      />

      <RubricAuditorModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
        targetGrade={targetGrade}
        onSelectGrade={setTargetGrade}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        apiKeys={apiKeys}
        onSaveKeys={setApiKeys}
      />
    </div>
  );
}
