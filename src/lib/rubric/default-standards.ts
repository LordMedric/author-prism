export type GradeLevel = "Distinction" | "Merit" | "Pass";

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number; // percentage, e.g. 25
  distinctionCriteria: string;
  meritCriteria: string;
  passCriteria: string;
}

export interface GradingRubric {
  id: string;
  title: string;
  description: string;
  criteria: RubricCriterion[];
}

export const DEFAULT_ACADEMIC_RUBRIC: GradingRubric = {
  id: "standard-higher-ed",
  title: "Higher Education Academic & Reflective Standard",
  description: "Standard UK/International rubric for reflective essays, business strategy, and journal evaluations.",
  criteria: [
    {
      id: "critical-reflection-analysis",
      name: "Critical Analysis & Reflective Depth",
      weight: 35,
      distinctionCriteria: "Exceptional critical self-awareness and analytical rigor. Demonstrates sophisticated synthesis of theoretical frameworks with real-world practice. Challenges assumptions and identifies systemic nuances.",
      meritCriteria: "Solid analytical capability beyond simple narration. Links experience with relevant theory clearly, though some critical questioning could be pushed further.",
      passCriteria: "Primarily descriptive account with rudimentary attempts at reflection. Theoretical linkages are surface-level or disconnected."
    },
    {
      id: "application-of-frameworks",
      name: "Application of Models & Frameworks (SWOT / Gibbs / Kolb / PESTLE)",
      weight: 25,
      distinctionCriteria: "Seamless and insightful integration of frameworks. Evaluates limitations of models and proposes tailored strategic actions or self-development milestones.",
      meritCriteria: "Accurate application of selected models. Clear structure with relevant categorization of strengths, weaknesses, or reflection stages.",
      passCriteria: "Basic or mechanical filling of framework boxes without synthesis or strategic rationale."
    },
    {
      id: "evidence-referencing-harvard",
      name: "Academic Evidence & Harvard Referencing",
      weight: 20,
      distinctionCriteria: "Flawless Harvard referencing throughout. Extensive, high-quality scholarly sources cited critically to substantiate all key claims and strategic recommendations.",
      meritCriteria: "Accurate Harvard referencing with minor formatting inconsistencies. Good range of credible academic and industry sources.",
      passCriteria: "Inconsistent referencing with missing citations or reliance on non-credible sources."
    },
    {
      id: "structure-clarity-voice",
      name: "Structure, Executive Clarity & Voice",
      weight: 20,
      distinctionCriteria: "Compelling narrative flow with polished executive/scholarly phrasing. Flawless grammar, coherent progression of arguments, and impactful conclusions.",
      meritCriteria: "Well-organized with clear headings and logical paragraph transitions. Minor stylistic roughness.",
      passCriteria: "Adequate structure but occasionally repetitive, unclear phrasing, or disjointed flow."
    }
  ]
};
