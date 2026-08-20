"use client";

import React from "react";
import { 
  BookOpen, 
  Quote, 
  Sliders, 
  GraduationCap, 
  Presentation,
  Compass,
  FileText
} from "lucide-react";
import { FRAMEWORK_TEMPLATES, FrameworkTemplate } from "@/lib/templates/frameworks";
import { FileItem } from "@/lib/files/file-tree";
import { FileTree } from "../files/FileTree";

interface SidebarProps {
  isOpen: boolean;
  files: FileItem[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (name: string, parentId: string | null) => void;
  onCreateFolder: (name: string, parentId: string | null) => void;
  onRenameItem: (id: string, newName: string) => void;
  onDeleteItem: (id: string) => void;
  onToggleFolder: (id: string) => void;
  onSelectTemplate: (template: FrameworkTemplate) => void;
  onOpenToneModal: () => void;
  onOpenRubricModal: () => void;
  onOpenCitationsModal: () => void;
  onOpenReadingsModal: () => void;
  onOpenSlidesModal: () => void;
  wordCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onRenameItem,
  onDeleteItem,
  onToggleFolder,
  onSelectTemplate,
  onOpenToneModal,
  onOpenRubricModal,
  onOpenCitationsModal,
  onOpenReadingsModal,
  onOpenSlidesModal,
  wordCount,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="w-60 border-r border-border/80 bg-card/40 flex flex-col h-[calc(100vh-3.25rem)] select-none transition-all duration-200">
      <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
        {/* Project File Hierarchy */}
        <FileTree
          files={files}
          activeFileId={activeFileId}
          onSelectFile={onSelectFile}
          onCreateFile={onCreateFile}
          onCreateFolder={onCreateFolder}
          onRenameItem={onRenameItem}
          onDeleteItem={onDeleteItem}
          onToggleFolder={onToggleFolder}
        />

        <div className="h-[1px] bg-border/60 mx-1" />

        {/* Templates */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3 h-3" />
            <span>Framework Templates</span>
          </div>

          <div className="space-y-0.5">
            {FRAMEWORK_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl)}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/70 text-[11px] text-muted-foreground hover:text-foreground transition truncate block"
                title={tmpl.description}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-border/60 mx-1" />

        {/* Tools */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Tools
          </div>

          <div className="space-y-0.5">
            <button
              onClick={onOpenReadingsModal}
              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/70 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-2 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reading Ingestion</span>
            </button>

            <button
              onClick={onOpenCitationsModal}
              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/70 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-2 transition"
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Harvard & MyBib</span>
            </button>

            <button
              onClick={onOpenSlidesModal}
              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/70 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-2 transition"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>PPTX Slides</span>
            </button>

            <button
              onClick={onOpenToneModal}
              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/70 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-2 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Voice & Tone</span>
            </button>

            <button
              onClick={onOpenRubricModal}
              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/70 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-2 transition"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Rubric Scale</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-2.5 border-t border-border/80 text-[11px] text-muted-foreground flex items-center justify-between">
        <span>Word count</span>
        <span className="font-medium text-foreground">{wordCount} words</span>
      </div>
    </aside>
  );
};
