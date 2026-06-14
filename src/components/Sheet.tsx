import { CIRCLED } from "../constants";
import type { SheetSettings } from "../constants";
import type { ParseResult, PreviewMode } from "../parser/types";
import { SheetHeader } from "./SheetHeader";
import { QuestionCol } from "./QuestionCol";

type Props = {
  tiers: number[][];
  lines: ParseResult[];
  settings: SheetSettings;
  mode: PreviewMode;
};

function questionNum(globalIndex: number): string {
  return CIRCLED[globalIndex] ?? String(globalIndex + 1);
}

export function Sheet({ tiers, lines, settings, mode }: Props) {
  return (
    <div
      className="sheet"
      data-orientation={settings.orientation}
      style={
        {
          "--body-size": `${settings.bodySize}pt`,
          "--title-size": `${settings.titleSize}pt`,
          "--subtitle-size": `${settings.subtitleSize}pt`,
          "--name-size": `${settings.nameSize}pt`,
          "--yomi-size": `${settings.yomiSize}pt`,
          "--box-scale": settings.boxScale / 100,
          "--gap-col": `${settings.colGap}mm`,
        } as React.CSSProperties
      }
    >
      <div className="sheet-layout">
        <SheetHeader settings={settings} />
        <div className="questions-area">
          {tiers.map((tier, ti) => (
            <div key={ti} className="q-tier">
              {tier.map((lineIndex) => (
                <QuestionCol
                  key={lineIndex}
                  num={questionNum(lineIndex)}
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
