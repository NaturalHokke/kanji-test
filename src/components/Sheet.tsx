import { PER_PAGE, PER_TIER, CIRCLED } from "../constants";
import type { SheetSettings } from "../constants";
import type { ParseResult } from "../parser/types";
import { SheetHeader } from "./SheetHeader";
import { QuestionCol } from "./QuestionCol";

type Props = {
  pageQuestions: ParseResult[];
  pageIndex: number;
  settings: SheetSettings;
};

export function Sheet({ pageQuestions, pageIndex, settings }: Props) {
  const tier1 = pageQuestions.slice(0, PER_TIER);
  const tier2 = pageQuestions.slice(PER_TIER, PER_PAGE);

  const renderTier = (tier: ParseResult[], tierStart: number) => (
    <div className="q-tier">
      {tier.map((q, i) => {
        const globalIndex = tierStart + i;
        const num =
          CIRCLED[globalIndex] ??
          String(pageIndex * PER_PAGE + globalIndex + 1);
        return (
          <QuestionCol key={globalIndex} num={num} segments={q.segments} />
        );
      })}
    </div>
  );

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
          {tier1.length > 0 && renderTier(tier1, 0)}
          {tier2.length > 0 && renderTier(tier2, PER_TIER)}
        </div>
      </div>
    </div>
  );
}
