import { normalizeNotation } from "./normalize";
import type { ParseError, ParseResult, Segment, TokenSegment } from "./types";

const HIRAGANA = /[\u3041-\u3093]/;

const TOKEN_RE =
  /(「([^|」]+)\|([^」]+)」|『([^|』]+)\|([^』]+)』)/g;

export function hasHiragana(s: string): boolean {
  return HIRAGANA.test(s);
}

export function suffixMatchLength(surface: string, yomi: string): number {
  let i = 0;
  while (
    i < surface.length &&
    i < yomi.length &&
    HIRAGANA.test(surface[surface.length - 1 - i]) &&
    surface[surface.length - 1 - i] === yomi[yomi.length - 1 - i]
  ) {
    i++;
  }
  return i;
}

function buildToken(
  surface: string,
  yomi: string,
  emphasis: "normal" | "bold",
): TokenSegment {
  const okurigana = hasHiragana(surface);
  return {
    type: "token",
    surface,
    yomi,
    emphasis,
    hasOkurigana: okurigana,
    writeWidth: surface.length,
    readWidth: yomi.length - suffixMatchLength(surface, yomi),
    lineStyle: okurigana ? "wavy" : "solid",
  };
}

function findBracketErrors(line: string, lineNum: number): ParseError[] {
  const errors: ParseError[] = [];
  const opens = ["「", "『"];
  const closes: Record<string, string> = { "「": "」", "『": "』" };

  for (const open of opens) {
    let searchFrom = 0;
    while (searchFrom < line.length) {
      const start = line.indexOf(open, searchFrom);
      if (start === -1) break;
      const close = closes[open];
      const end = line.indexOf(close, start + 1);
      if (end === -1) {
        errors.push({ line: lineNum, message: "括弧が閉じられていません" });
        break;
      }
      const inner = line.slice(start + 1, end);
      if (!inner.includes("|")) {
        errors.push({ line: lineNum, message: "区切り文字（｜）がありません" });
      }
      searchFrom = end + 1;
    }
  }

  return errors;
}

export function parseLine(line: string, lineNum: number): ParseResult {
  const normalized = normalizeNotation(line);
  const bracketErrors = findBracketErrors(normalized, lineNum);

  if (bracketErrors.length > 0) {
    return {
      segments: [{ type: "text", content: line }],
      errors: bracketErrors,
    };
  }

  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: normalized.slice(lastIndex, match.index),
      });
    }

    const isBold = match[0].startsWith("『");
    const surface = (isBold ? match[4] : match[2]).trim();
    const yomi = (isBold ? match[5] : match[3]).trim();
    segments.push(buildToken(surface, yomi, isBold ? "bold" : "normal"));
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < normalized.length) {
    segments.push({ type: "text", content: normalized.slice(lastIndex) });
  }

  return { segments, errors: [] };
}

export function parseDocument(text: string): {
  lines: ParseResult[];
  errors: ParseError[];
} {
  const lines: ParseResult[] = [];
  const errors: ParseError[] = [];

  for (const [i, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line) continue;
    const result = parseLine(line, i + 1);
    lines.push(result);
    errors.push(...result.errors);
  }

  return { lines, errors };
}

export function buildAnswerText(
  segments: Segment[],
  mode: "write" | "read",
): string {
  return segments
    .map((seg) => {
      if (seg.type === "text") return seg.content;
      return mode === "write" ? seg.surface : seg.yomi;
    })
    .join("");
}
