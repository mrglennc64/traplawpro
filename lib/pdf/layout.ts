import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";

const INK = rgb(0.1, 0.1, 0.12);
const NAVY = rgb(0.11, 0.21, 0.34);
const MUTED = rgb(0.42, 0.42, 0.47);
const RULE = rgb(0.8, 0.8, 0.83);
const ROW_ALT = rgb(0.96, 0.96, 0.97);

const PAGE_W = 612; // US Letter
const PAGE_H = 792;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;

/**
 * A small flow-layout PDF builder over pdf-lib: title, meta rows, section
 * headings, key/value tables, data tables, wrapped paragraphs, bullet lists
 * and signature blocks — enough to reproduce the SoundExchange-style
 * Letter-of-Direction / Schedule / cover-letter templates.
 */
export class PdfBuilder {
  private pdf!: PDFDocument;
  private font!: PDFFont;
  private bold!: PDFFont;
  private italic!: PDFFont;
  private page!: PDFPage;
  private y = PAGE_H - MARGIN;

  static async create() {
    const b = new PdfBuilder();
    b.pdf = await PDFDocument.create();
    b.font = await b.pdf.embedFont(StandardFonts.Helvetica);
    b.bold = await b.pdf.embedFont(StandardFonts.HelveticaBold);
    b.italic = await b.pdf.embedFont(StandardFonts.HelveticaOblique);
    b.page = b.pdf.addPage([PAGE_W, PAGE_H]);
    return b;
  }

  private ensure(space: number) {
    if (this.y - space < MARGIN) {
      this.page = this.pdf.addPage([PAGE_W, PAGE_H]);
      this.y = PAGE_H - MARGIN;
    }
  }

  private wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
    const lines: string[] = [];
    for (const rawLine of text.split("\n")) {
      const words = rawLine.split(/\s+/).filter(Boolean);
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) > maxW && line) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  spacer(h = 10) {
    this.ensure(h);
    this.y -= h;
  }

  title(text: string, opts: { center?: boolean } = {}) {
    const size = 20;
    this.ensure(size + 12);
    const w = this.bold.widthOfTextAtSize(text, size);
    const x = opts.center ? (PAGE_W - w) / 2 : MARGIN;
    this.page.drawText(text, { x, y: this.y, size, font: this.bold, color: NAVY });
    this.y -= size + 6;
  }

  subtitle(text: string, opts: { center?: boolean } = {}) {
    const size = 12;
    this.ensure(size + 10);
    const w = this.italic.widthOfTextAtSize(text, size);
    const x = opts.center ? (PAGE_W - w) / 2 : MARGIN;
    this.page.drawText(text, { x, y: this.y, size, font: this.italic, color: MUTED });
    this.y -= size + 10;
  }

  /** Bold label + value on one line (e.g. "ISRC: USUM71814031"). */
  metaRow(label: string, value: string) {
    const size = 11;
    this.ensure(size + 6);
    const labelText = `${label}:`;
    this.page.drawText(labelText, { x: MARGIN, y: this.y, size, font: this.bold, color: INK });
    const labelW = this.bold.widthOfTextAtSize(labelText, size);
    const valueX = MARGIN + Math.max(labelW + 8, 130);
    const lines = this.wrap(value, this.font, size, PAGE_W - MARGIN - valueX);
    this.page.drawText(lines[0] ?? "", { x: valueX, y: this.y, size, font: this.font, color: INK });
    this.y -= size + 6;
    for (const extra of lines.slice(1)) {
      this.ensure(size + 4);
      this.page.drawText(extra, { x: valueX, y: this.y, size, font: this.font, color: INK });
      this.y -= size + 4;
    }
  }

  sectionHeading(text: string) {
    const size = 13;
    this.spacer(8);
    this.ensure(size + 10);
    this.page.drawText(text.toUpperCase(), { x: MARGIN, y: this.y, size, font: this.bold, color: NAVY });
    this.y -= size + 4;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_W - MARGIN, y: this.y },
      thickness: 1,
      color: RULE,
    });
    this.y -= 10;
  }

  paragraph(text: string, opts: { italic?: boolean; size?: number } = {}) {
    const size = opts.size ?? 11;
    const font = opts.italic ? this.italic : this.font;
    const color = opts.italic ? MUTED : INK;
    for (const line of this.wrap(text, font, size, CONTENT_W)) {
      this.ensure(size + 5);
      this.page.drawText(line, { x: MARGIN, y: this.y, size, font, color });
      this.y -= size + 5;
    }
    this.y -= 4;
  }

  bullets(items: string[]) {
    const size = 11;
    for (const item of items) {
      const wrapped = this.wrap(item, this.font, size, CONTENT_W - 16);
      this.ensure(size + 5);
      this.page.drawText("•", { x: MARGIN, y: this.y, size, font: this.font, color: INK });
      this.page.drawText(wrapped[0] ?? "", { x: MARGIN + 14, y: this.y, size, font: this.font, color: INK });
      this.y -= size + 5;
      for (const extra of wrapped.slice(1)) {
        this.ensure(size + 4);
        this.page.drawText(extra, { x: MARGIN + 14, y: this.y, size, font: this.font, color: INK });
        this.y -= size + 4;
      }
    }
    this.y -= 4;
  }

  /** Two-column label/value table with row separators (LOD-style boxes). */
  kvTable(rows: { label: string; value: string }[]) {
    const size = 11;
    const labelW = 200;
    const valX = MARGIN + labelW + 12;
    const valW = PAGE_W - MARGIN - valX;
    for (const row of rows) {
      const valueLines = this.wrap(row.value, this.font, size, valW);
      const rowH = Math.max(1, valueLines.length) * (size + 4) + 12;
      this.ensure(rowH);
      const top = this.y;
      let ty = top - 10;
      this.page.drawText(row.label, { x: MARGIN + 6, y: ty, size, font: this.bold, color: INK });
      for (const line of valueLines) {
        this.page.drawText(line, { x: valX, y: ty, size, font: this.font, color: INK });
        ty -= size + 4;
      }
      this.y = top - rowH;
      this.page.drawLine({
        start: { x: MARGIN, y: this.y },
        end: { x: PAGE_W - MARGIN, y: this.y },
        thickness: 0.75,
        color: RULE,
      });
    }
    this.y -= 12;
  }

  /** Header row + data rows table (Schedule 1 repertoire chart). */
  table(headers: string[], rows: string[][], colWeights?: number[]) {
    const size = 10;
    const weights = colWeights ?? headers.map(() => 1);
    const totalW = weights.reduce((a, b) => a + b, 0);
    const widths = weights.map((w) => (w / totalW) * CONTENT_W);
    const xs: number[] = [];
    let x = MARGIN;
    for (const w of widths) {
      xs.push(x);
      x += w;
    }

    const drawRow = (cells: string[], font: PDFFont, headerRow: boolean) => {
      const cellLines = cells.map((c, i) =>
        this.wrap(c, font, size, widths[i] - 12)
      );
      const maxLines = Math.max(...cellLines.map((l) => l.length));
      const rowH = maxLines * (size + 3) + 10;
      this.ensure(rowH);
      const top = this.y;
      if (headerRow) {
        this.page.drawRectangle({
          x: MARGIN,
          y: top - rowH,
          width: CONTENT_W,
          height: rowH,
          color: NAVY,
        });
      }
      cellLines.forEach((lines, i) => {
        let ty = top - 9;
        for (const line of lines) {
          this.page.drawText(line, {
            x: xs[i] + 6,
            y: ty,
            size,
            font,
            color: headerRow ? rgb(1, 1, 1) : INK,
          });
          ty -= size + 3;
        }
      });
      this.y = top - rowH;
      this.page.drawLine({
        start: { x: MARGIN, y: this.y },
        end: { x: PAGE_W - MARGIN, y: this.y },
        thickness: 0.75,
        color: RULE,
      });
    };

    drawRow(headers, this.bold, true);
    rows.forEach((r) => drawRow(r, this.font, false));
    this.y -= 12;
  }

  /** Callout note block with a left accent bar. */
  note(text: string) {
    const size = 10;
    const lines = this.wrap(text, this.italic, size, CONTENT_W - 24);
    const h = lines.length * (size + 4) + 16;
    this.ensure(h);
    const top = this.y;
    this.page.drawRectangle({
      x: MARGIN,
      y: top - h,
      width: CONTENT_W,
      height: h,
      color: ROW_ALT,
    });
    this.page.drawRectangle({
      x: MARGIN,
      y: top - h,
      width: 4,
      height: h,
      color: NAVY,
    });
    let ty = top - 12;
    for (const line of lines) {
      this.page.drawText(line, { x: MARGIN + 14, y: ty, size, font: this.italic, color: INK });
      ty -= size + 4;
    }
    this.y = top - h - 12;
  }

  /** Signature field: "Label: ____________". */
  signatureField(label: string, value?: string) {
    const size = 11;
    this.ensure(size + 18);
    this.page.drawText(`${label}:`, { x: MARGIN, y: this.y, size, font: this.font, color: INK });
    const labelW = this.font.widthOfTextAtSize(`${label}:`, size);
    const lineX = MARGIN + Math.max(labelW + 12, 130);
    if (value) {
      this.page.drawText(value, { x: lineX, y: this.y, size, font: this.bold, color: INK });
    }
    this.page.drawLine({
      start: { x: lineX, y: this.y - 4 },
      end: { x: PAGE_W - MARGIN, y: this.y - 4 },
      thickness: 0.75,
      color: INK,
    });
    this.y -= size + 18;
  }

  /** Left-aligned plain text line (letterhead, addresses). */
  line(text: string, opts: { bold?: boolean; muted?: boolean; size?: number } = {}) {
    const size = opts.size ?? 11;
    const font = opts.bold ? this.bold : this.font;
    const color = opts.muted ? MUTED : INK;
    this.ensure(size + 4);
    this.page.drawText(text, { x: MARGIN, y: this.y, size, font, color });
    this.y -= size + 4;
  }

  /** Embed a PNG/JPEG signature image (data URL) at a sane width. */
  async image(dataUrl: string, opts: { maxW?: number; maxH?: number } = {}) {
    const maxW = opts.maxW ?? 220;
    const maxH = opts.maxH ?? 70;
    try {
      const commaIdx = dataUrl.indexOf(",");
      if (commaIdx < 0) return;
      const b64 = dataUrl.slice(commaIdx + 1);
      const bytes = Uint8Array.from(Buffer.from(b64, "base64"));
      const img = dataUrl.includes("image/jpeg") || dataUrl.includes("image/jpg")
        ? await this.pdf.embedJpg(bytes)
        : await this.pdf.embedPng(bytes);
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const w = img.width * scale;
      const h = img.height * scale;
      this.ensure(h + 6);
      this.page.drawImage(img, { x: MARGIN, y: this.y - h, width: w, height: h });
      this.y -= h + 6;
    } catch {
      // Non-fatal: skip an unreadable signature image.
    }
  }

  async save() {
    return this.pdf.save();
  }
}
