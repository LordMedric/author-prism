# Author Prism 🖋️✨

**Author Prism** is an offline-capable, AI-powered writing and strategy workspace designed specifically for:
- **Reflective Essays & Journals** (Gibbs' Reflective Cycle, Kolb's Learning Cycle, Rolfe Framework)
- **Business Strategy & Diagnostics** (SWOT & TOWS Matrix, PESTLE, Porter's 5 Forces, Business Model Canvas)
- **Executive Strategy Slide Decks** (16:9 Widescreen, Multi-Theme, Native `.pptx` Export)
- **Reading Assignment Ingestion & Chapter-by-Chapter Synthesizer** (Gemini 1M+ Token Context)
- **Harvard Referencing & MyBib Integration** (In-Text Citation Auto-formatting + Alphabetized Reference List Builder)
- **Voice & Tone Profiling** (`voice-and-tone.md` Builder & Switcher)
- **Academic Rubric Calibration** (Distinction, Merit, Pass Benchmarks & Pre-Submission Draft Audit)
- **Multi-Format Interoperability** (DOCX, PDF, PPTX, Markdown)

---

## 🚀 Key Capabilities

### 1. Dual AI Core (Claude + Gemini)
- **Claude 3.7 Sonnet / Opus**: Renowned for nuanced first-person reflective analysis, academic prose, Harvard formatting, and executive synthesis.
- **Gemini 2.0 Flash / 1.5 Pro (1M–2M Context)**: Rapid ingestion of entire textbooks, multi-chapter reading assignments, and slide layout structuring.

### 2. Executive PPTX Slide Generator
- 16:9 widescreen presentation builder.
- Themes: *Nordic Slate*, *Emerald Executive*, *Clean Editorial*, *Midnight Navy*.
- Slide layouts: Title Hook, SWOT Quadrant Cards, 3-Pillar Comparative Cards, Metric Callouts, 4-Stage Roadmap/Timeline, and Presenter Speaker Notes.

### 3. Reading Ingestion & Chapter Synthesizer
- Ingest PDF, DOCX, or text reading packets.
- Automatically detect chapter/section boundaries.
- Chapter-by-chapter core thesis synthesis, critique, and Harvard citation mining.
- 1-click insertion into active drafts.

### 4. Harvard Referencing & MyBib Integration
- Search DOIs and book titles via CrossRef and Google Books API.
- Direct CSL-JSON & RIS import from [MyBib.com](https://www.mybib.com/).
- Instant in-text citation inserter: `(Author, Year)` or `Author (Year, p. X)`.
- Auto-generate alphabetized UK/Harvard reference lists.

### 5. Voice & Tone Switcher
- Pre-built profiles: *Reflective Scholar*, *Strategic Executive*, *Academic Analyst*, *Conversational Thinker*.
- Fine-tune perspective (1st vs 3rd person), formality (1-5), and criticality dials.

### 6. Academic Rubric & Grading Scale
- Calibrated standards: **Distinction (70%+)**, **Merit (60–69%)**, **Pass (50–59%)**.
- Pre-Submission Draft Audit (`/grade`): Pinpoints exact paragraphs needing higher critical depth and provides upgrade recommendations.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ (Node 24 LTS recommended)
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Privacy & Offline Capability
- Documents and projects reside locally on your disk.
- API keys are stored in your secure local session.
