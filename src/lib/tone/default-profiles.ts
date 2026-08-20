export interface ToneProfile {
  id: string;
  name: string;
  description: string;
  perspective: "first-person" | "third-person" | "executive-first-plural" | "hybrid";
  formality: number; // 1 to 5
  criticality: number; // 1 to 5 (1 = descriptive, 5 = deeply critical/evaluative)
  vocabularyDensity: "accessible" | "professional" | "scholarly";
  systemInstructions: string;
  samplePhrases: string[];
}

export const DEFAULT_TONE_PROFILES: ToneProfile[] = [
  {
    id: "academic-journal-practitioner",
    name: "Academic Journal & Reflective Practitioner",
    description: "Formal academic reflection for higher ed journal assignments. Balances first-person reflexivity with rigorous theoretical synthesis (Tuckman, Situational Leadership, Argyris & Schön) and Harvard citations.",
    perspective: "first-person",
    formality: 4,
    criticality: 5,
    vocabularyDensity: "scholarly",
    systemInstructions: `Adopt a rigorous academic reflective voice suitable for formal university/business school journal assignments (e.g., Ducere SG7014 Leadership in Practise standard).
- Write in the first person ('I observed', 'Upon critical reflection, I recognized', 'This experience highlighted my tendency to').
- Maintain high academic rigor: This is NOT an informal diary; it is a critical, scholarly evaluation of professional praxis and leadership identity.
- Allocate minimal space to pure description (under 15%); dedicate the majority of the essay to critical self-awareness, connection to academic frameworks (e.g., Tuckman's stages, Situational Leadership, Transformational Leadership, Argyris & Schön), analysis of leadership identity, and actionable lessons learned.
- Substantively substantiate assertions with Harvard referencing.`,
    samplePhrases: [
      "Critically reflecting on this incident, I recognize that my initial facilitation style was anchored in...",
      "Analyzing this dynamic through Tuckman's (1965) model of group development reveals that...",
      "Integrating Hersey and Blanchard's (1988) Situational Leadership framework enabled me to adapt my leadership style from directing to supporting...",
      "This experience revealed a pivotal evolution in my leadership identity, transitioning from reactive mediation to decisive strategic alignment."
    ]
  },
  {
    id: "strategic-executive",
    name: "Strategic Executive & Board Advisor",
    description: "Decisive, structured, and action-oriented tone ideal for SWOT, PESTLE, TOWS, and C-Suite strategy decks.",
    perspective: "executive-first-plural",
    formality: 5,
    criticality: 4,
    vocabularyDensity: "professional",
    systemInstructions: `Adopt a decisive executive advisory tone suitable for corporate strategy, board presentations, and business analysis.
- Use crisp, structured, and active language ('We recommend', 'Strategic imperative', 'Key value drivers').
- Quantify impact, risk exposure, and competitive advantage where possible.
- Structure observations into clear thematic pillars (SWOT quadrants, strategic priorities, milestone roadmaps).
- Prioritize strategic clarity and executive synthesis over verbose narration.`,
    samplePhrases: [
      "The strategic imperative is to leverage existing core competencies to capture emerging market opportunities.",
      "A critical vulnerability identified in the SWOT analysis stems from supply chain friction...",
      "We recommend a phased implementation across three strategic horizons to mitigate operational risk."
    ]
  },
  {
    id: "academic-analyst",
    name: "Objective Academic Essayist",
    description: "Third-person scholarly discourse with analytical hedging, objective synthesis, and rigorous Harvard citations.",
    perspective: "third-person",
    formality: 5,
    criticality: 5,
    vocabularyDensity: "scholarly",
    systemInstructions: `Adopt an objective, high-rigor academic voice formatted for higher education essays and journal submissions.
- Maintain a disciplined third-person perspective ('The evidence indicates', 'Scholars contend', 'This paper argues').
- Employ academic hedging and nuanced argumentation ('appears to suggest', 'demonstrates a propensity toward').
- Ensure every assertion is backed by critical reasoning and Harvard referencing.`,
    samplePhrases: [
      "Extensive empirical evidence demonstrates a significant correlation between...",
      "Contrary to conventional frameworks, contemporary scholars argue that...",
      "This synthesis illustrates the multidimensional nature of organizational resilience."
    ]
  },
  {
    id: "reflective-scholar",
    name: "Gibbs / Kolb Reflective Scholar",
    description: "First-person critical reflection with scholarly grounding, introspection, emotional awareness, and actionable self-critique.",
    perspective: "first-person",
    formality: 4,
    criticality: 5,
    vocabularyDensity: "scholarly",
    systemInstructions: `Adopt a reflective academic voice adhering to Gibbs' or Kolb's reflective frameworks.
- Write in the first person with deep introspection.
- Seamlessly synthesize experiential learning with academic literature and theoretical frameworks.`,
    samplePhrases: [
      "Upon critical reflection, I recognized that my initial assumptions were influenced by...",
      "Integrating Kolb's experiential learning model, this realization marked a pivotal shift in my understanding of...",
      "While the immediate outcome appeared satisfactory, deeper analysis reveals underlying systemic tensions..."
    ]
  }
];
