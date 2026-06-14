import type { CSSProperties } from "react";
import { colGapAlphaMm, layoutModeForPreview, type SheetSettings } from "../constants";
import type { ParseResult, PreviewMode } from "../parser/types";
import { SheetHeader } from "./SheetHeader";
import { QuestionCol } from "./QuestionCol";

type Props = {
  tiers: number[][];
  lines: ParseResult[];
  settings: SheetSettings;
  mode: PreviewMode;
  colGap: number;
};

function enumerateSheetQuestions(tiers: number[][]): { lineIndex: number; num: number }[][] {
  let num = 0;
  return tiers.map((tier) =>
    tier.map((lineIndex) => ({ lineIndex, num: ++num })),
  );
}

export function Sheet({ tiers, lines, settings, mode, colGap }: Props) {
  const numberedTiers = enumerateSheetQuestions(tiers);
  const layoutMode = layoutModeForPreview(mode);

  const sheetStyle = {
    "--body-size": `${settings.bodySize}pt`,
    "--title-size": `${settings.titleSize}pt`,
    "--subtitle-size": `${settings.subtitleSize}pt`,
    "--name-size": `${settings.nameSize}pt`,
    "--yomi-size": `${settings.yomiSize}pt`,
    "--box-scale": settings.boxScale / 100,
    "--gap-col-alpha": `${colGapAlphaMm(settings, mode)}mm`,
    ...(colGap > 0 ? { "--gap-col": `${colGap}px` } : {}),
  } as CSSProperties;

  return (
    <div
      className="sheet"
      data-orientation={settings.orientation}
      data-preview-mode={layoutMode}
      style={sheetStyle}
    >
      <div className="sheet-layout">
        <SheetHeader settings={settings} />
        <div className="questions-area">
          {numberedTiers.map((tier, ti) => (
            <div key={ti} className="q-tier">
              {tier.map(({ lineIndex, num }) => (
                <QuestionCol
                  key={lineIndex}
                  num={num}
                  segments={lines[lineIndex].segments}
                  mode={mode}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
