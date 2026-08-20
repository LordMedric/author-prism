import { FRAMEWORK_TEMPLATES } from "../templates/frameworks";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  content?: string;
  isOpen?: boolean;
}

export const DEFAULT_PROJECT_FILES: FileItem[] = [
  // Root Folders
  { id: "folder-journal-assignments", name: "Journal Assignments", type: "folder", parentId: null, isOpen: true },
  { id: "folder-reflections", name: "Reflective Essays", type: "folder", parentId: null, isOpen: true },
  { id: "folder-strategy", name: "Business Strategy", type: "folder", parentId: null, isOpen: true },
  { id: "folder-readings", name: "Reading Notes", type: "folder", parentId: null, isOpen: false },

  // Files in Journal Assignments
  {
    id: "file-journal-2",
    name: "SG7014-Journal-Assignment-2.md",
    type: "file",
    parentId: "folder-journal-assignments",
    content: FRAMEWORK_TEMPLATES[0].defaultContent,
  },

  // Files in Reflections
  {
    id: "file-gibbs",
    name: "Gibbs-Reflective-Essay.md",
    type: "file",
    parentId: "folder-reflections",
    content: FRAMEWORK_TEMPLATES[1].defaultContent,
  },
  {
    id: "file-kolb",
    name: "Kolb-Experiential-Cycle.md",
    type: "file",
    parentId: "folder-reflections",
    content: FRAMEWORK_TEMPLATES[3].defaultContent,
  },

  // Files in Strategy
  {
    id: "file-swot",
    name: "SWOT-TOWS-Analysis.md",
    type: "file",
    parentId: "folder-strategy",
    content: FRAMEWORK_TEMPLATES[2].defaultContent,
  },
  {
    id: "file-pestle",
    name: "PESTLE-Diagnostic.md",
    type: "file",
    parentId: "folder-strategy",
    content: FRAMEWORK_TEMPLATES[4].defaultContent,
  },

  // Files in Readings
  {
    id: "file-reading-notes",
    name: "Leadership-Chapters-1-4-Notes.md",
    type: "file",
    parentId: "folder-readings",
    content: `# SG7014 Reading Notes: Chapters 1 to 4\n\n## Group Leadership Models\n- **Tuckman (1965)**: Forming, Storming, Norming, Performing, Adjourning.\n- **Hersey & Blanchard (1988)**: Situational Leadership (Directing, Coaching, Supporting, Delegating).\n- **Argyris & Schön (1978)**: Single-loop vs Double-loop learning.\n- **Bass & Avolio (1994)**: Transformational & Transactional Leadership.`,
  },
];
