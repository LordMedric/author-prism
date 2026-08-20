import pptxgen from "pptxgenjs";
import { SlideData, SlideTheme, SLIDE_THEMES } from "./slide-templates";

export class SlideGenerator {
  /**
   * Generate a PPTX presentation from an array of SlideData and a chosen theme
   */
  public async generatePresentation(
    slides: SlideData[],
    themeKey = "nordic-slate",
    meta = { title: "Executive Strategy Presentation", author: "Author Prism" }
  ): Promise<pptxgen> {
    const theme: SlideTheme = SLIDE_THEMES[themeKey] || SLIDE_THEMES["nordic-slate"];
    const pptx = new pptxgen();

    // Set 16:9 Widescreen Layout
    pptx.layout = "LAYOUT_16x9";
    pptx.author = meta.author;
    pptx.title = meta.title;

    for (const slideData of slides) {
      const slide = pptx.addSlide();
      slide.background = { color: theme.bg };

      if (slideData.notes) {
        slide.addNotes(slideData.notes);
      }

      switch (slideData.type) {
        case "title":
          this.buildTitleSlide(slide, slideData, theme);
          break;
        case "swot":
          this.buildSwotSlide(slide, slideData, theme);
          break;
        case "cards-3":
          this.build3CardSlide(slide, slideData, theme);
          break;
        case "cards-2":
          this.build2CardSlide(slide, slideData, theme);
          break;
        case "metrics":
          this.buildMetricsSlide(slide, slideData, theme);
          break;
        case "timeline":
          this.buildTimelineSlide(slide, slideData, theme);
          break;
        default:
          this.build3CardSlide(slide, slideData, theme);
      }
    }

    return pptx;
  }

  private buildTitleSlide(slide: any, data: SlideData, theme: SlideTheme) {
    // Top Badge / Category
    if (data.badge) {
      slide.addText(data.badge.toUpperCase(), {
        x: 1.0,
        y: 1.8,
        w: 11.3,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: theme.accent,
        fontFace: "Arial",
      });
    }

    // Main Title
    slide.addText(data.title, {
      x: 1.0,
      y: 2.3,
      w: 11.3,
      h: 2.0,
      fontSize: 38,
      bold: true,
      color: theme.textPrimary,
      fontFace: "Arial",
      valign: "top",
    });

    // Subtitle
    if (data.subtitle) {
      slide.addText(data.subtitle, {
        x: 1.0,
        y: 4.4,
        w: 10.0,
        h: 1.5,
        fontSize: 18,
        color: theme.textMuted,
        fontFace: "Calibri",
        valign: "top",
      });
    }
  }

  private buildHeader(slide: any, data: SlideData, theme: SlideTheme) {
    if (data.badge) {
      slide.addText(data.badge.toUpperCase(), {
        x: 0.8,
        y: 0.5,
        w: 11.7,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: theme.accent,
        fontFace: "Arial",
      });
    }

    slide.addText(data.title, {
      x: 0.8,
      y: data.badge ? 0.8 : 0.6,
      w: 11.7,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: theme.textPrimary,
      fontFace: "Arial",
    });

    if (data.subtitle) {
      slide.addText(data.subtitle, {
        x: 0.8,
        y: data.badge ? 1.4 : 1.2,
        w: 11.7,
        h: 0.4,
        fontSize: 13,
        color: theme.textMuted,
        fontFace: "Calibri",
      });
    }
  }

  private buildSwotSlide(slide: any, data: SlideData, theme: SlideTheme) {
    this.buildHeader(slide, data, theme);

    const quadrants = [
      { label: "STRENGTHS", color: theme.accent, bgTint: theme.cardBg, x: 0.8, y: 1.9 },
      { label: "WEAKNESSES", color: theme.accent4, bgTint: theme.cardBg, x: 6.8, y: 1.9 },
      { label: "OPPORTUNITIES", color: theme.accent2, bgTint: theme.cardBg, x: 0.8, y: 4.4 },
      { label: "THREATS", color: theme.accent3, bgTint: theme.cardBg, x: 6.8, y: 4.4 },
    ];

    const cards = data.cards || [];

    quadrants.forEach((q, idx) => {
      const cardData = cards[idx] || { title: q.label, desc: "Key strategic dimension" };

      // Card Background Box
      slide.addShape("roundRect", {
        x: q.x,
        y: q.y,
        w: 5.7,
        h: 2.3,
        fill: { color: q.bgTint },
        line: { color: q.color, width: 1.5 },
        rectRadius: 0.1,
      });

      // Quadrant Header
      slide.addText(q.label, {
        x: q.x + 0.3,
        y: q.y + 0.2,
        w: 5.1,
        h: 0.3,
        fontSize: 13,
        bold: true,
        color: q.color,
        fontFace: "Arial",
      });

      // Card Content
      slide.addText(cardData.desc, {
        x: q.x + 0.3,
        y: q.y + 0.6,
        w: 5.1,
        h: 1.5,
        fontSize: 12,
        color: theme.textPrimary,
        fontFace: "Calibri",
        valign: "top",
      });
    });
  }

  private build3CardSlide(slide: any, data: SlideData, theme: SlideTheme) {
    this.buildHeader(slide, data, theme);
    const cards = (data.cards || []).slice(0, 3);
    const cardWidth = 3.65;
    const cardGap = 0.4;
    const startX = 0.8;
    const startY = 1.9;

    cards.forEach((c, idx) => {
      const x = startX + idx * (cardWidth + cardGap);
      const accent = [theme.accent, theme.accent2, theme.accent3][idx % 3];

      slide.addShape("roundRect", {
        x,
        y: startY,
        w: cardWidth,
        h: 4.8,
        fill: { color: theme.cardBg },
        line: { color: accent, width: 1.5 },
        rectRadius: 0.1,
      });

      if (c.tag) {
        slide.addText(c.tag.toUpperCase(), {
          x: x + 0.3,
          y: startY + 0.3,
          w: cardWidth - 0.6,
          h: 0.3,
          fontSize: 10,
          bold: true,
          color: accent,
          fontFace: "Arial",
        });
      }

      slide.addText(c.title, {
        x: x + 0.3,
        y: startY + (c.tag ? 0.6 : 0.3),
        w: cardWidth - 0.6,
        h: 0.6,
        fontSize: 16,
        bold: true,
        color: theme.textPrimary,
        fontFace: "Arial",
      });

      slide.addText(c.desc, {
        x: x + 0.3,
        y: startY + (c.tag ? 1.3 : 1.0),
        w: cardWidth - 0.6,
        h: 3.2,
        fontSize: 13,
        color: theme.textMuted,
        fontFace: "Calibri",
        valign: "top",
      });
    });
  }

  private build2CardSlide(slide: any, data: SlideData, theme: SlideTheme) {
    this.buildHeader(slide, data, theme);
    const cards = (data.cards || []).slice(0, 2);
    const cardWidth = 5.65;
    const cardGap = 0.4;
    const startX = 0.8;
    const startY = 1.9;

    cards.forEach((c, idx) => {
      const x = startX + idx * (cardWidth + cardGap);
      const accent = [theme.accent, theme.accent2][idx % 2];

      slide.addShape("roundRect", {
        x,
        y: startY,
        w: cardWidth,
        h: 4.8,
        fill: { color: theme.cardBg },
        line: { color: accent, width: 1.5 },
        rectRadius: 0.1,
      });

      slide.addText(c.title, {
        x: x + 0.4,
        y: startY + 0.4,
        w: cardWidth - 0.8,
        h: 0.6,
        fontSize: 18,
        bold: true,
        color: theme.textPrimary,
        fontFace: "Arial",
      });

      slide.addText(c.desc, {
        x: x + 0.4,
        y: startY + 1.1,
        w: cardWidth - 0.8,
        h: 3.4,
        fontSize: 14,
        color: theme.textMuted,
        fontFace: "Calibri",
        valign: "top",
      });
    });
  }

  private buildMetricsSlide(slide: any, data: SlideData, theme: SlideTheme) {
    this.buildHeader(slide, data, theme);
    const metrics = (data.metrics || []).slice(0, 3);
    const width = 3.65;
    const gap = 0.4;
    const startX = 0.8;
    const startY = 2.2;

    metrics.forEach((m, idx) => {
      const x = startX + idx * (width + gap);
      const accent = [theme.accent, theme.accent2, theme.accent3][idx % 3];

      slide.addShape("roundRect", {
        x,
        y: startY,
        w: width,
        h: 4.2,
        fill: { color: theme.cardBg },
        line: { color: accent, width: 1.5 },
        rectRadius: 0.1,
      });

      // Metric Value
      slide.addText(m.value, {
        x: x + 0.3,
        y: startY + 0.6,
        w: width - 0.6,
        h: 1.0,
        fontSize: 40,
        bold: true,
        color: accent,
        fontFace: "Arial",
      });

      // Label
      slide.addText(m.label, {
        x: x + 0.3,
        y: startY + 1.8,
        w: width - 0.6,
        h: 1.5,
        fontSize: 14,
        bold: true,
        color: theme.textPrimary,
        fontFace: "Arial",
        valign: "top",
      });

      if (m.change) {
        slide.addText(m.change, {
          x: x + 0.3,
          y: startY + 3.4,
          w: width - 0.6,
          h: 0.5,
          fontSize: 12,
          color: theme.accent3,
          fontFace: "Calibri",
        });
      }
    });
  }

  private buildTimelineSlide(slide: any, data: SlideData, theme: SlideTheme) {
    this.buildHeader(slide, data, theme);
    const steps = (data.timeline || []).slice(0, 4);
    const width = 2.7;
    const gap = 0.3;
    const startX = 0.8;
    const startY = 2.2;

    steps.forEach((s, idx) => {
      const x = startX + idx * (width + gap);
      const accent = [theme.accent, theme.accent2, theme.accent3, theme.accent4][idx % 4];

      slide.addShape("roundRect", {
        x,
        y: startY,
        w: width,
        h: 4.2,
        fill: { color: theme.cardBg },
        line: { color: accent, width: 1.5 },
        rectRadius: 0.1,
      });

      slide.addText(`STAGE ${s.step || idx + 1}`, {
        x: x + 0.2,
        y: startY + 0.3,
        w: width - 0.4,
        h: 0.3,
        fontSize: 11,
        bold: true,
        color: accent,
        fontFace: "Arial",
      });

      slide.addText(s.title, {
        x: x + 0.2,
        y: startY + 0.7,
        w: width - 0.4,
        h: 0.6,
        fontSize: 15,
        bold: true,
        color: theme.textPrimary,
        fontFace: "Arial",
      });

      slide.addText(s.desc, {
        x: x + 0.2,
        y: startY + 1.4,
        w: width - 0.4,
        h: 2.4,
        fontSize: 12,
        color: theme.textMuted,
        fontFace: "Calibri",
        valign: "top",
      });
    });
  }
}

export const slideGenerator = new SlideGenerator();
