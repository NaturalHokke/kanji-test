export const PER_PAGE = 20;
export const PER_TIER = 10;

export const CIRCLED = [
  "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩",
  "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳",
];

export const ORIENTATION_UI = {
  landscape: { label: "横向き", preview: "A4 横向き・縦書き" },
  portrait: { label: "縦向き", preview: "A4 縦向き・縦書き" },
} as const;

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
  colGap: number;
};

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
    colGap: Math.max(2, Math.min(6, Math.round(52 / PER_TIER * 10) / 10)),
  };
}

export function rangeOptions(min: number, max: number, selected: number) {
  return Array.from({ length: max - min + 1 }, (_, i) => {
    const n = min + i;
    return { value: n, label: String(n), selected: n === selected };
  });
}

export const BOX_SCALE_OPTIONS = [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
