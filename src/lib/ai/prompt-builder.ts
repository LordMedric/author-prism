import { toneManager } from "../tone/tone-manager";
import { rubricEngine, GradeLevel } from "../rubric/rubric-engine";
import { CitationItem, harvardFormatter } from "../citations/harvard-formatter";

export interface PromptContext {
  toneId?: string;
  targetGrade?: GradeLevel;
  citations?: CitationItem[];
  readingContext?: string;
  frameworkType?: string;
  activeDocContent?: string;
}

export class PromptBuilder {
  public buildSystemPrompt(ctx: PromptContext = {}): string {
    const tonePrompt = toneManager.buildTonePrompt(ctx.toneId || "reflective-scholar");
    const rubricPrompt = rubricEngine.buildRubricPrompt(ctx.targetGrade || "Distinction");

    const bibSection = ctx.citations && ctx.citations.length > 0
      ? `\n### ACTIVE CITATION LIBRARY (HARVARD REFERENCING)\nThe following sources are in the user's library. Use accurate in-text citations like (Author, Year) or Author (Year, p. X) whenever making relevant claims:\n${ctx.citations.map(c => `- ${harvardFormatter.formatReferenceEntry(c)}`).join("\n")}`
      : `\n### HARVARD REFERENCING MANDATE\nAlways adhere strictly to Harvard referencing conventions for in-text citations: (Author, Year) or Author (Year, p. X).`;

    const readingSection = ctx.readingContext
      ? `\n### ACTIVE READING ASSIGNMENT CONTEXT\nThe user has uploaded relevant reading material:\n"""\n${ctx.readingContext}\n"""`
      : "";

    return `
You are **Author Prism**, an elite AI co-author and strategy advisor specializing in:
1. Higher Education Reflective Essays & Critical Journals (Gibbs, Kolb, Rolfe).
2. Corporate Business Strategy & Diagnostics (SWOT, TOWS, PESTLE, Porter's 5 Forces, Business Model Canvas).
3. Academic & Executive Writing with rigorous Harvard Referencing and MyBib integration.

${tonePrompt}

${rubricPrompt}

${bibSection}

${readingSection}

### OPERATIONAL PRINCIPLES:
- When drafting or editing, elevate surface narration into deep critical analysis, conceptual linking, and actionable praxis.
- Match the active voice and tone profile precisely.
- Ensure all assertions, strategic initiatives, and reflective insights are substantiated and intellectually sound.
- If asked to propose changes to the user's document, format edits clearly with before/after blocks or targeted insertion points.
`.trim();
  }
}

export const promptBuilder = new PromptBuilder();
