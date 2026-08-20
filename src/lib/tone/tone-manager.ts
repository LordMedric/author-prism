import { DEFAULT_TONE_PROFILES, ToneProfile } from "./default-profiles";

export class ToneManager {
  private profiles: Map<string, ToneProfile> = new Map();

  constructor() {
    DEFAULT_TONE_PROFILES.forEach(p => this.profiles.set(p.id, p));
  }

  public getAllProfiles(): ToneProfile[] {
    return Array.from(this.profiles.values());
  }

  public getProfile(id: string): ToneProfile {
    return this.profiles.get(id) || DEFAULT_TONE_PROFILES[0];
  }

  public addProfile(profile: ToneProfile): void {
    this.profiles.set(profile.id, profile);
  }

  public buildTonePrompt(profileId: string): string {
    const profile = this.getProfile(profileId);
    return `
### ACTIVE VOICE & TONE PROFILE: "${profile.name}"
- Perspective: ${profile.perspective}
- Formality Level: ${profile.formality}/5
- Criticality & Depth: ${profile.criticality}/5 (5 = deep critical synthesis vs surface description)
- Vocabulary Density: ${profile.vocabularyDensity}

Specific Tone Guidelines:
${profile.systemInstructions}

Representative Phrasing Models:
${profile.samplePhrases.map(s => `- "${s}"`).join("\n")}
`;
  }
}

export const toneManager = new ToneManager();
