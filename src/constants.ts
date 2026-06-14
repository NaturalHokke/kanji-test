import type { PreviewMode } from "./parser/types";

export const ORIENTATION_UI = {
  landscape: { label: "横向き", preview: "A4 横向き・縦書き" },
  portrait: { label: "縦向き", preview: "A4 縦向き・縦書き" },
} as const;

export const PREVIEW_MODE_LABELS: Record<string, string> = {
  write: "書き取り",
  read: "読み取り",
  "answer-write": "書き解答",
  "answer-read": "読み解答",
};

export const DEFAULT_QUESTIONS =
  "「失敗｜しっぱい」を「許す｜ゆるす」";

export type Orientation = "landscape" | "portrait";

export type SheetSettings = {
  orientation: Orientation;
  title: string;
  subtitle: string;
  nameLine: string;
  bodySize: number;
  titleSize: number;
  subtitleSize: number;
  nameSize: number;
  yomiSize: number;
  boxScale: number;
  writeColGap: number;
  readColGap: number;
};

export type LayoutMode = "write" | "read";

/** 1 ページあたりの段数（縦向き 2 段・横向き 1 段） */
export function tiersPerPageForOrientation(orientation: Orientation): number {
  return orientation === "portrait" ? 2 : 1;
}

/** 版組計測・列 gap に使うモード（解答は対応する問題形式に合わせる） */
export function layoutModeForPreview(mode: PreviewMode): LayoutMode {
  if (mode === "read" || mode === "answer-read") return "read";
  return "write";
}

/** 列 gap の α（mm）。書き取り・読み取りで別設定 */
export function colGapAlphaMm(
  settings: SheetSettings,
  mode: PreviewMode,
): number {
  if (layoutModeForPreview(mode) === "read") return settings.readColGap;
  return settings.writeColGap;
}

export function buildDefaultSettings(): SheetSettings {
  return {
    orientation: "portrait",
    title: "漢字テスト",
    subtitle: "線を引いた部分を漢字（漢字と送り仮名）で書きましょう。",
    nameLine: "年　　組　　名前（　　　　　　　　　　）",
    bodySize: 20,
    titleSize: 16,
    subtitleSize: 10,
    nameSize: 14,
    yomiSize: 9,
    boxScale: 100,
    writeColGap: 3,
    readColGap: 8,
  };
}

export function rangeOptions(min: number, max: number, selected: number) {
  return Array.from({ length: max - min + 1 }, (_, i) => {
    const n = min + i;
    return { value: n, label: String(n), selected: n === selected };
  });
}

/** 列間余白 α（mm）の選択肢 */
export const COL_GAP_MM_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10];

export const BOX_SCALE_OPTIONS = [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
