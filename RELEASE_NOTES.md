# Author Prism v1.0.0 — Initial Release 🖋️✨

An offline-capable, AI-powered writing and strategy workspace designed specifically for **Reflective Essays**, **Academic Journal Papers**, **SWOT & Business Strategy**, **Executive PowerPoint Decks**, and **Reading Ingestion**.

---

## 🌟 Key Highlights & Capabilities

### 1. Dual AI Core (Claude + Gemini)
- **Anthropic Claude (3.7 Sonnet & 3.5 Haiku)**: Specialized in first-person critical reflection, leadership reflexivity, Harvard referencing, and tone calibration.
- **Google Gemini (2.5 Pro, 2.0 Flash Thinking, 2.0 Flash, 1.5 Pro - 2M Context, 1.5 Flash 8B)**: Massive multi-book reading packet ingestion, deep reasoning, rapid chapter synthesis, and slide drafting.
- **Interactive Model Hover Cards**: Hover over any model in the header to view its context window size and academic writing specialty.

### 2. AuthorPrism Studio (Assignment Brief & Notes to Full Paper)
- Upload assignment briefs directly in **`.pdf`**, **`.docx`**, or **`.txt`**.
- Author full-length papers structured across academic frameworks with Harvard referencing and calibrated grade standards (Distinction 70%+, Merit, Pass).

### 3. ClaudePrism-Style In-Line Floating Chat Bubble
- Sleek floating circular button with `lucide-message-circle` icon.
- Press **`Ctrl+K`** / **`⌘K`** anywhere to summon a blank prompt bubble to write at cursor or edit highlighted text.
- 1-Click **Insert at Cursor** and **Replace Selection** preview.

### 4. Academic Journal & Reflective Writing Frameworks
- **Academic Journal Assignment (SG7014 standard)**: 6-part formal leadership reflection structure.
- **Gibbs' Reflective Cycle**: Description, Feelings, Evaluation, Analysis, Conclusion, Action Plan.
- **Kolb's Experiential Learning Model**: Experience, Reflection, Conceptualization, Experimentation.
- **SWOT & TOWS Strategic Analysis**: 4-quadrant diagnostic with actionable strategic initiatives.
- **PESTLE Macro-Environmental Analysis**: External driver evaluation.

### 5. Harvard Referencing & MyBib Integration
- Search DOIs and book titles via CrossRef and Google Books API.
- Direct CSL-JSON & RIS import from [MyBib.com](https://www.mybib.com/).
- In-text citation generator: `(Author, Year)` or `Author (Year, p. X)`.
- Auto-generate alphabetized Harvard reference lists.

### 6. Executive PowerPoint Slide Builder (`.pptx`)
- 16:9 widescreen presentation generator with curated themes (*Nordic Slate*, *Emerald Executive*, *Clean Editorial*, *Midnight Navy*).
- Layouts: Title Hook, SWOT Quadrants, 3-Pillar Cards, Key Metrics, and 4-Stage Timelines.

### 7. Reading Ingestion & Chapter-by-Chapter Summarizer
- Ingest multi-chapter PDFs and books using Gemini's 2M token context.
- Chapter thesis extraction, critical evaluation, and Harvard citation mining.

### 8. Native Desktop & Web Launch Modes
- Run in browser: `npm run dev`
- Run as native desktop app: `npm run desktop` (Electron runtime) or package with Tauri v2.
- Dark & Light Mode toggle (Light mode default).

---

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/LordMedric/author-prism.git
cd author-prism

# Install dependencies
npm install

# Run as Native Desktop App
npm run desktop

# Or run in your browser
npm run dev
```
