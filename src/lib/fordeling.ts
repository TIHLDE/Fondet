// Per-fund facts that are not exposed by any public Nordnet API: the portfolio
// weight, the management fee, and the benchmark index. The Forvaltningsgruppen
// publishes all three each quarter in the report PDFs under public/reports, one
// section per fund headed "<Fund> - Porteføljevekt: NN,NN %" followed by a
// "Fakta om fondet" table with "Forvaltningshonorar" and "Referanseindeks".
// This reads the newest report and matches each fund to the funds Nordnet
// currently reports as held. A held fund missing from the report (bought after
// it was written) has no published facts yet; a fund sold since the report
// simply never gets matched.

import fs from "fs";
import path from "path";
import { getDocumentProxy, extractText } from "unpdf";

const REPORTS_DIR = path.join(process.cwd(), "public", "reports");

export interface ReportFund {
  name: string;
  weight: number;
  feePercent: number | null;
  benchmark: string | null;
}

export interface ReportData {
  period: string;
  funds: ReportFund[];
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

// Each fund heading anchors to the preceding sentence end so the description of
// the previous fund is not swept into the name.
const HEADING =
  /[.»]\s*([A-ZÆØÅÖ][^–]{2,50}?)\s*[–-]\s*Portef(?:ø|o)ljevekt:\s*(\d+[.,]\d+)\s*%/gi;

function parseFunds(text: string): ReportFund[] {
  const marks: { name: string; weight: number; start: number; end: number }[] =
    [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = HEADING.exec(text))) {
    const name = m[1].trim().replace(/\s+/g, " ");
    if (seen.has(name)) continue;
    seen.add(name);
    marks.push({
      name,
      weight: parseFloat(m[2].replace(",", ".")),
      start: m.index,
      end: HEADING.lastIndex,
    });
  }

  return marks.map((mark, i) => {
    // The Fakta table sits between this heading and the next one.
    const block = text.slice(
      mark.end,
      i + 1 < marks.length ? marks[i + 1].start : mark.end + 1200,
    );
    const fee = block.match(/Forvaltningshonorar\s+(\d+[.,]\d+)\s*%/i);
    const bench = block.match(
      /Referanseindeks\s+(.+?)\s+(?:Forvaltningshonorar|Mandat|Fondstype|Periode)/i,
    );
    return {
      name: mark.name,
      weight: mark.weight,
      feePercent: fee ? parseFloat(fee[1].replace(",", ".")) : null,
      benchmark: bench ? bench[1].trim().replace(/\s+/g, " ") : null,
    };
  });
}

async function extractReport(file: string): Promise<ReportFund[] | null> {
  let buf: Buffer;
  try {
    buf = await fs.promises.readFile(path.join(REPORTS_DIR, file));
  } catch {
    return null;
  }
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: true });
  return parseFunds(text);
}

// A report is only trusted if it yields a plausible full allocation: enough
// funds and a total near 100 %. This filters out half-written drafts.
function isValid(funds: ReportFund[]): boolean {
  if (funds.length < 4) return false;
  const sum = funds.reduce((s, f) => s + f.weight, 0);
  return sum >= 80 && sum <= 120;
}

let cache: { key: string; value: ReportData | null } | null = null;

export async function getReportData(): Promise<ReportData | null> {
  const candidates = reportFiles();
  const key = candidates.map((c) => c.file).join("|");
  if (cache && cache.key === key) return cache.value;

  let value: ReportData | null = null;
  for (const candidate of candidates) {
    const funds = await extractReport(candidate.file);
    if (funds && isValid(funds)) {
      value = { period: candidate.label, funds };
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

// The report entry for a held fund, matched by normalized name. Null when the
// fund is not in the newest report (typically bought after it was published).
export function reportFundFor(
  fundName: string,
  data: ReportData | null,
): ReportFund | null {
  if (!data) return null;
  const target = normalize(fundName);
  for (const f of data.funds) {
    const source = normalize(f.name);
    if (source === target || source.includes(target) || target.includes(source)) {
      return f;
    }
  }
  return null;
}
