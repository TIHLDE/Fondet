// Portfolio weights ("fordeling") are not exposed by any public Nordnet API.
// The Forvaltningsgruppen publishes them each quarter in the report PDFs under
// public/reports, one line per fund: "<Fund> - Porteføljevekt: NN,NN %". This
// reads the newest report, extracts those weights, and matches them to the
// funds Nordnet currently reports as held. A fund held but not in the report
// (bought after it was written) has no published weight yet; a fund in the
// report but no longer held (sold) simply never gets matched.

import fs from "fs";
import path from "path";
import { getDocumentProxy, extractText } from "unpdf";

const REPORTS_DIR = path.join(process.cwd(), "public", "reports");

export interface ReportWeights {
  period: string;
  weights: { name: string; weight: number }[];
}

interface ReportFile {
  file: string;
  rank: number;
  isQuarter: boolean;
  label: string;
}

// Newest first; a quarterly report wins over the annual one for the same year,
// since the annual is often still a draft when the Q4 numbers are already final.
function reportFiles(): ReportFile[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(REPORTS_DIR);
  } catch {
    return [];
  }
  const parsed: ReportFile[] = [];
  for (const file of files) {
    const q = file.match(/kvartalsrapport-q(\d)-(\d{4})/i);
    if (q) {
      const year = parseInt(q[2], 10);
      parsed.push({
        file,
        rank: year * 10 + parseInt(q[1], 10),
        isQuarter: true,
        label: `Q${q[1]} ${year}`,
      });
      continue;
    }
    const a = file.match(/arsrapport-(\d{4})/i);
    if (a) {
      const year = parseInt(a[1], 10);
      parsed.push({
        file,
        rank: year * 10 + 4,
        isQuarter: false,
        label: `Årsrapport ${year}`,
      });
    }
  }
  return parsed.sort((l, r) =>
    r.rank !== l.rank ? r.rank - l.rank : Number(r.isQuarter) - Number(l.isQuarter),
  );
}

function parseWeights(text: string): { name: string; weight: number }[] {
  // The fund name sits right before "- Porteføljevekt: NN %", anchored to the
  // preceding sentence end so the description of the previous fund is not
  // swept into the name.
  const re =
    /[.»]\s*([A-ZÆØÅÖ][^–]{2,50}?)\s*[–-]\s*Portef(?:ø|o)ljevekt:\s*(\d+[.,]\d+)\s*%/gi;
  const seen = new Set<string>();
  const out: { name: string; weight: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const name = m[1].trim().replace(/\s+/g, " ");
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, weight: parseFloat(m[2].replace(",", ".")) });
  }
  return out;
}

async function extractReport(file: string): Promise<ReportWeights | null> {
  let buf: Buffer;
  try {
    buf = await fs.promises.readFile(path.join(REPORTS_DIR, file));
  } catch {
    return null;
  }
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: true });
  return { period: "", weights: parseWeights(text) };
}

// A report is only trusted if it yields a plausible full allocation: enough
// funds and a total near 100 %. This filters out half-written drafts.
function isValid(w: { weight: number }[]): boolean {
  if (w.length < 4) return false;
  const sum = w.reduce((s, x) => s + x.weight, 0);
  return sum >= 80 && sum <= 120;
}

let cache: { key: string; value: ReportWeights | null } | null = null;

export async function getReportWeights(): Promise<ReportWeights | null> {
  const candidates = reportFiles();
  const key = candidates.map((c) => c.file).join("|");
  if (cache && cache.key === key) return cache.value;

  let value: ReportWeights | null = null;
  for (const candidate of candidates) {
    const report = await extractReport(candidate.file);
    if (report && isValid(report.weights)) {
      value = { period: candidate.label, weights: report.weights };
      break;
    }
  }
  cache = { key, value };
  return value;
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bnok\b/g, "")
    .replace(/[^a-zæøå0-9]/g, "");
}

// Weight for a held fund, matched by normalized name. Returns null when the
// fund is not in the newest report (typically bought after it was published).
export function weightFor(
  fundName: string,
  report: ReportWeights | null,
): number | null {
  if (!report) return null;
  const target = normalize(fundName);
  for (const w of report.weights) {
    const source = normalize(w.name);
    if (source === target || source.includes(target) || target.includes(source)) {
      return w.weight;
    }
  }
  return null;
}
