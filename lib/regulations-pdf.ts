import { regulations } from "@/app/regulations/data";

const pageWidth = 595;
const pageHeight = 842;
const margin = 48;
const contentWidth = pageWidth - margin * 2;
const bodyFontSize = 11;
const headingFontSize = 15;
const titleFontSize = 20;
const lineHeight = 16;

type PdfPage = {
  lines: string[];
};

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function estimateTextWidth(text: string, fontSize: number) {
  return text.length * fontSize * 0.52;
}

function wrapText(text: string, fontSize: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (estimateTextWidth(candidate, fontSize) <= contentWidth) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function pushLine(pages: PdfPage[], text: string, y: { value: number }, fontSize = bodyFontSize) {
  if (y.value < margin) {
    pages.push({ lines: [] });
    y.value = pageHeight - margin;
  }

  pages[pages.length - 1].lines.push(`BT /F1 ${fontSize} Tf 1 0 0 1 ${margin} ${y.value} Tm (${escapePdfText(text)}) Tj ET`);
  y.value -= lineHeight;
}

function pushWrappedBlock(pages: PdfPage[], text: string, y: { value: number }, fontSize = bodyFontSize) {
  for (const line of wrapText(text, fontSize)) {
    pushLine(pages, line, y, fontSize);
  }

  y.value -= 6;
}

export function buildRegulationsPdf() {
  const pages: PdfPage[] = [{ lines: [] }];
  const y = { value: pageHeight - margin };

  pushWrappedBlock(pages, regulations.title, y, titleFontSize);
  pushWrappedBlock(pages, "Official regulations for the Oceania Youth Chess 2027 tournament.", y);
  y.value -= 4;

  for (const section of regulations.sections) {
    pushWrappedBlock(pages, section.heading, y, headingFontSize);

    for (const paragraph of section.paragraphs) {
      pushWrappedBlock(pages, paragraph, y);
    }

    if (section.list) {
      for (const item of section.list) {
        pushWrappedBlock(pages, `- ${item}`, y);
      }
    }

    if (section.orderedList) {
      for (const [index, item] of section.orderedList.entries()) {
        pushWrappedBlock(pages, `${index + 1}. ${item}`, y);
      }
    }

    y.value -= 4;
  }

  const objects: string[] = [];
  const addObject = (content: string) => {
    objects.push(content);
    return objects.length;
  };

  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];
  const contentIds: number[] = [];

  for (const page of pages) {
    const stream = page.lines.join("\n");
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    contentIds.push(contentId);
    const pageId = addObject(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`,
    );
    pageIds.push(pageId);
  }

  const pagesId = addObject(`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`);
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  for (let index = 0; index < pageIds.length; index += 1) {
    objects[pageIds[index] - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentIds[index]} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`;
  }

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}
