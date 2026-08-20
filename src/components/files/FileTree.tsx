"use client";

import React, { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  FolderPlus, 
  FilePlus, 
  MoreVertical, 
  Trash2, 
  Edit2,
  Check
} from "lucide-react";
import { FileItem } from "@/lib/files/file-tree";

interface FileTreeProps {
  files: FileItem[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (name: string, parentId: string | null) => void;
  onCreateFolder: (name: string, parentId: string | null) => void;
  onRenameItem: (id: string, newName: string) => void;
  onDeleteItem: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onRenameItem,
  onDeleteItem,
  onToggleFolder,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [creatingInParent, setCreatingInParent] = useState<{ parentId: string | null; type: "file" | "folder" } | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const handleStartRename = (item: FileItem) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleSaveRename = () => {
    if (editingId && editName.trim()) {
      onRenameItem(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !creatingInParent) return;

    if (creatingInParent.type === "file") {
      const fileName = newItemName.includes(".") ? newItemName : `${newItemName}.md`;
      onCreateFile(fileName, creatingInParent.parentId);
    } else {
      onCreateFolder(newItemName.trim(), creatingInParent.parentId);
    }

    setCreatingInParent(null);
    setNewItemName("");
  };

  // Helper to render nodes recursively
  const renderNodes = (parentId: string | null, depth = 0) => {
    const childNodes = files.filter(f => f.parentId === parentId);

    return (
      <div className="space-y-0.5">
        {childNodes.map((item) => {
          const isFolder = item.type === "folder";
          const isActive = item.id === activeFileId;
          const isEditing = item.id === editingId;

          return (
            <div key={item.id} className="select-none">
              <div
                style={{ paddingLeft: `${depth * 12 + 6}px` }}
                className={`group flex items-center justify-between py-1 px-2 rounded-md text-xs transition cursor-pointer ${
                  isActive
                    ? "bg-foreground/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                onClick={() => {
                  if (isFolder) {
                    onToggleFolder(item.id);
                  } else {
                    onSelectFile(item.id);
                  }
                }}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {isFolder ? (
                    <>
                      <span className="text-muted-foreground/70">
                        {item.isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </span>
                      {item.isOpen ? (
                        <FolderOpen className="w-3.5 h-3.5 text-indigo-500/80 shrink-0" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-indigo-500/80 shrink-0" />
                      )}
                    </>
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 ml-3.5" />
                  )}

                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={handleSaveRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="text-xs bg-background text-foreground border border-border px-1 py-0.5 rounded w-full focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate text-[11px]">{item.name}</span>
                  )}
                </div>

                {/* Hover Actions */}
                <div
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isFolder && (
                    <>
                      <button
                        onClick={() => {
                          setCreatingInParent({ parentId: item.id, type: "file" });
                          setNewItemName("");
                        }}
                        className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="New File in Folder"
                      >
                        <FilePlus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setCreatingInParent({ parentId: item.id, type: "folder" });
                          setNewItemName("");
                        }}
                        className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="New Subfolder"
                      >
                        <FolderPlus className="w-3 h-3" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleStartRename(item)}
                    className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Rename"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Render Children if folder is open */}
              {isFolder && item.isOpen && renderNodes(item.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {/* File Tree Header with Actions */}
      <div className="flex items-center justify-between px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        <span>Project Files</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCreatingInParent({ parentId: null, type: "file" })}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="New Root File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCreatingInParent({ parentId: null, type: "folder" })}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="New Root Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inline Creation Input Form */}
      {creatingInParent && (
        <form onSubmit={handleCreateSubmit} className="px-2 py-1 flex items-center gap-1">
          <input
            type="text"
            placeholder={creatingInParent.type === "file" ? "file-name.md" : "folder-name"}
            value={newItemName}
            autoFocus
            onChange={(e) => setNewItemName(e.target.value)}
            onBlur={() => {
              if (!newItemName.trim()) setCreatingInParent(null);
            }}
            className="text-xs bg-background text-foreground border border-border px-1.5 py-0.5 rounded w-full focus:outline-none"
          />
          <button
            type="submit"
            className="p-1 rounded bg-foreground text-background text-[10px]"
          >
            <Check className="w-3 h-3" />
          </button>
        </form>
      )}

      {/* Render Node Tree */}
      <div className="py-0.5">{renderNodes(null, 0)}</div>
    </div>
  );
};
