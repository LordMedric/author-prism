import { DEFAULT_ACADEMIC_RUBRIC, GradingRubric, GradeLevel } from "./default-standards";
export type { GradeLevel, GradingRubric };

export class RubricEngine {
  private activeRubric: GradingRubric = DEFAULT_ACADEMIC_RUBRIC;
  private targetLevel: GradeLevel = "Distinction";

  public getActiveRubric(): GradingRubric {
    return this.activeRubric;
  }

  public setRubric(rubric: GradingRubric): void {
    this.activeRubric = rubric;
  }

  public setTargetLevel(level: GradeLevel): void {
    this.targetLevel = level;
  }

  public getTargetLevel(): GradeLevel {
    return this.targetLevel;
  }

  public buildRubricPrompt(targetLevel: GradeLevel = this.targetLevel): string {
    const r = this.activeRubric;
    const criteriaText = r.criteria.map((c) => {
      const targetExpectation = 
        targetLevel === "Distinction" ? c.distinctionCriteria :
        targetLevel === "Merit" ? c.meritCriteria : c.passCriteria;

      return `#### ${c.name} (Weight: ${c.weight}%)
- **Target Expectation (${targetLevel})**: ${targetExpectation}
- Full Benchmark Scale:
  - Distinction (70%+): ${c.distinctionCriteria}
  - Merit (60-69%): ${c.meritCriteria}
  - Pass (50-59%): ${c.passCriteria}`;
    }).join("\n\n");

    return `
### ACTIVE GRADING CALIBRATION: Target Level = "${targetLevel.toUpperCase()}"
Rubric Standard: "${r.title}"

The user has calibrated this document to meet **${targetLevel}** standards.
Ensure all drafted text, critique, theoretical linkages, and recommendations rigorously satisfy these criteria:

${criteriaText}

When reviewing or drafting:
1. Elevate beyond descriptive narrative to deep critical synthesis and theoretical grounding.
2. Explicitly verify Harvard citations for key claims.
3. If performing a rubric audit, point out exact areas where the current text is only "Pass" or "Merit" and provide concrete steps to elevate to "Distinction".
`;
  }
}

export const rubricEngine = new RubricEngine();
