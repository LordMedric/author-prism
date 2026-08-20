export interface FrameworkTemplate {
  id: string;
  name: string;
  category: "Academic Journal & Reflection" | "Business Strategy" | "Executive Analysis";
  description: string;
  defaultContent: string;
  rubricFocus: string;
}

export const FRAMEWORK_TEMPLATES: FrameworkTemplate[] = [
  {
    id: "academic-journal-assignment",
    name: "Academic Journal Assignment (Leadership & Business Reflexivity)",
    category: "Academic Journal & Reflection",
    description: "Formal 6-part academic journal reflection paper (Introduction, Experience, Academic Theory Connection, Leadership Identity, Lessons Learned, Conclusion).",
    rubricFocus: "Focus on reflexive self-awareness, leadership identity, application of group dynamic theories, and Harvard referencing.",
    defaultContent: `# SG7014 Leadership in Practise: Journal Assignment #2
## Topic: My Ability to Lead Groups (How Do I Lead Groups?)

### 1. Introduction
Effective group leadership requires dynamic reflexive self-awareness and an understanding of interpersonal group dynamics. As a leader operating in complex environments, my primary leadership orientation combines transformational facilitation with situational adaptability. This journal reflection critically evaluates my ability to lead groups by analyzing a specific challenge encountered during a cross-functional strategic project, connecting the experience with academic frameworks, and examining its implications for my evolving leadership identity.

### 2. Analysis of Experience or Problem
During a recent organizational restructuring initiative, I led a multidisciplinary team of five specialists tasked with streamlining our deployment workflow under tight deadlines. A critical conflict arose between software engineering and operational compliance regarding milestone validation protocols. As group leader, I facilitated structured consensus workshops, shifting away from top-down directives to collaborative problem-solving. By actively listening to technical friction points and realigning incentives around shared risk mitigation, our group successfully developed an automated compliance pipeline that shortened release cycles by 28%.

### 3. Connection with Academic Content
Analyzing this experience through Tuckman's (1965) model of group development, the team encountered significant friction during the 'Storming' phase due to conflicting departmental priorities. By adopting Hersey and Blanchard's (1988) Situational Leadership Theory, I recognized that team members possessed high technical competence but low collaborative alignment. Consequently, I shifted my leadership style from 'Directing' (S1) to 'Supporting' (S3) and 'Delegating' (S4). Furthermore, integrating Argyris and Schön's (1978) double-loop learning enabled the group to question underlying protocol assumptions rather than merely fixing superficial symptoms, substantially improving collective effectiveness.

### 4. Analysis of Leadership Identity
This experience illuminated key dimensions of my leadership identity. It revealed that my leadership is anchored in collaborative inquiry, transparency, and high emotional intelligence. However, it also exposed a tendency to over-accommodate dissenting views in early stages, which initially delayed decision velocity. Reflecting on this has helped me redefine my leadership identity not as a passive mediator, but as an active catalyst who balances psychological safety with decisive strategic direction.

### 5. Analysis of Lessons Learned
A key lesson from this experience is that group effectiveness hinges on proactive expectation setting rather than reactive conflict resolution. If faced with a similar challenge, I would institute explicit team charters and decision-making matrices during the 'Forming' stage. Furthermore, I have identified a need to strengthen my skills in high-stakes negotiation and rapid executive alignment to prevent cross-functional stalemates from escalating.

### 6. Conclusion
In conclusion, leading groups demands continuous self-leadership, acute self-awareness, and situational responsiveness. Grounding practical leadership dilemmas in academic frameworks such as Situational Leadership and group development models has provided actionable insights to refine my leadership praxis and enhance long-term group performance.

## References
- Argyris, C. and Schön, D. (1978) *Organizational Learning: A Theory of Action Perspective*. Reading, MA: Addison-Wesley.
- Hersey, P. and Blanchard, K.H. (1988) *Management of Organizational Behavior: Utilizing Human Resources*. 5th edn. Englewood Cliffs, NJ: Prentice-Hall.
- Tuckman, B.W. (1965) 'Developmental sequence in small groups', *Psychological Bulletin*, 63(6), pp. 384-399. doi: 10.1037/h0022100.
`
  },
  {
    id: "gibbs-reflective-cycle",
    name: "Gibbs' Reflective Cycle (6 Stages)",
    category: "Academic Journal & Reflection",
    description: "Higher education reflective paper: Description, Feelings, Evaluation, Critical Analysis, Conclusion, Action Plan.",
    rubricFocus: "Allocate minimal space to 'Description'; focus 70% on Evaluation, Critical Analysis, and Action Plan.",
    defaultContent: `# Reflective Paper: Critical Practice & Experiential Learning (Gibbs' Cycle)

## 1. Description
*Briefly describe what happened, providing context without over-narrating.*

## 2. Feelings & Reactions
*What were your thoughts and emotional responses during the event?*

## 3. Evaluation
*What was good and bad about the experience? What worked and what faltered?*

## 4. Critical Analysis & Theoretical Synthesis
*Make sense of the situation. Integrate literature, models (e.g., Tuckman, Argyris & Schön, Kolb), and Harvard citations.*

## 5. Conclusion (General & Specific)
*What else could you have done? What did you learn about your own praxis and self-awareness?*

## 6. Action Plan & Future Praxis
*If a similar situation arose again, what specific steps will you take to improve effectiveness?*

## References
`
  },
  {
    id: "swot-tows-matrix",
    name: "SWOT & TOWS Strategic Analysis",
    category: "Business Strategy",
    description: "Holistic internal/external diagnostic combined with actionable TOWS matrix strategies.",
    rubricFocus: "Cross-match internal capabilities with external dynamics to justify strategic priorities.",
    defaultContent: `# Strategic Analysis: SWOT & TOWS Matrix

## Executive Summary
This report evaluates the strategic posture of [Organization Name], assessing internal competencies against macro-environmental shifts.

## 1. Internal & External Diagnostic (SWOT)

### Strengths (Internal Core Competencies)
- **S1 Proprietary Technology**: High barriers to entry with robust IP portfolio.
- **S2 Strong Brand Equity**: Top-of-mind recall in key demographic segments.

### Weaknesses (Internal Vulnerabilities)
- **W1 Capital Intensity**: High fixed operational overhead compared to agile entrants.
- **W2 Legacy Architecture**: Technical debt slowing down feature iteration.

### Opportunities (External Horizons)
- **O1 Emerging Market Expansion**: 24% CAGR in target international regions.
- **O2 Strategic Partnerships**: Collaborative distribution channels with tier-1 platforms.

### Threats (External Market Risks)
- **T1 Regulatory Tightening**: Impending compliance mandates across core territories.
- **T2 Macro Inflationary Pressure**: Squeeze on consumer discretionary spending.

---

## 2. TOWS Strategic Synthesis

| Strategy Vector | Strategic Initiatives & Rationale |
| :--- | :--- |
| **SO Strategies** *(Leverage S for O)* | Deploy proprietary IP (S1) into fast-growing emerging markets (O1) via local tier-1 alliances (O2). |
| **ST Strategies** *(Use S to counter T)* | Leverage strong brand equity (S2) to establish premium pricing power against inflationary pressures (T2). |
| **WO Strategies** *(Overcome W via O)* | Modernize legacy stack (W2) through cloud-native vendor partnerships (O2). |
| **WT Strategies** *(Minimize W & avoid T)* | Divest non-core legacy units to decrease capital intensity (W1) ahead of regulatory compliance deadlines (T1). |

## 3. Strategic Recommendations & Implementation Roadmap
1. **Horizon 1 (0-6 months)**: Establish partnership framework and regulatory audit.
2. **Horizon 2 (6-18 months)**: Pilot emerging market launch with modernized core product.

## References
`
  },
  {
    id: "kolb-learning-cycle",
    name: "Kolb's Experiential Learning Cycle",
    category: "Academic Journal & Reflection",
    description: "Four-stage experiential learning cycle: Concrete Experience, Reflective Observation, Abstract Conceptualization, Active Experimentation.",
    rubricFocus: "Demonstrate clear cognitive transition from concrete events to abstract conceptualization and practical experimentation.",
    defaultContent: `# Experiential Learning Journal: Kolb's Cycle

## 1. Concrete Experience (Doing / Having an Experience)
*What was the tangible situation or challenge encountered?*

## 2. Reflective Observation (Reviewing / Reflecting on the Experience)
*What did I observe? What were the different perspectives and underlying assumptions?*

## 3. Abstract Conceptualization (Concluding / Learning from the Experience)
*How can academic theories and research explain this phenomenon? What general principles emerge?*

## 4. Active Experimentation (Planning / Trying out what you have learned)
*How will I test these new concepts in upcoming professional or academic scenarios?*

## References
`
  },
  {
    id: "pestle-analysis",
    name: "PESTLE Macro-Environmental Analysis",
    category: "Business Strategy",
    description: "Comprehensive external environmental diagnostic (Political, Economic, Social, Technological, Legal, Environmental).",
    rubricFocus: "Focus on strategic implications of macro trends rather than just listing background facts.",
    defaultContent: `# Macro-Environmental Diagnostic: PESTLE Analysis

## 1. Political Factors
*Government policy, geopolitical stability, trade restrictions, taxation policy.*

## 2. Economic Factors
*Interest rates, inflation trends, exchange rates, disposable income dynamics.*

## 3. Social & Cultural Factors
*Demographic shifts, consumer attitudes, lifestyle trends, workplace expectations.*

## 4. Technological Factors
*AI integration, automation, R&D landscape, digital transformation imperatives.*

## 5. Legal & Regulatory Factors
*Employment law, consumer protection, antitrust regulations, data privacy (GDPR).*

## 6. Environmental & Sustainability Factors
*Carbon neutrality mandates, circular economy demands, climate resilience.*

## Strategic Implications & Executive Action Plan
*Synthesize the top 3 critical external drivers and organizational response strategy.*

## References
`
  }
];
