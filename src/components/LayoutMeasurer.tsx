import { useLayoutEffect, useRef, type CSSProperties } from "react";
import type { SheetSettings } from "../constants";
import type { ParseResult, PreviewMode } from "../parser/types";
import { paginate, type PageLayout } from "../layout/paginate";
import { QuestionCol } from "./QuestionCol";
import { SheetHeader } from "./SheetHeader";

type Props = {
  lines: ParseResult[];
  settings: SheetSettings;
  mode: PreviewMode;
  onLayout: (layout: PageLayout) => void;
};

export function LayoutMeasurer({ lines, settings, mode, onLayout }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || lines.length === 0) {
      onLayout({ pages: [] });
      return;
    }

    const sheetLayout = sheet.querySelector<HTMLElement>(".sheet-layout");
    const header = sheet.querySelector<HTMLElement>(".sheet-header");
    const tier = sheet.querySelector<HTMLElement>(".q-tier");
    if (!sheetLayout || !header || !tier) {
      onLayout({ pages: [] });
      return;
    }

    const sheetStyle = getComputedStyle(sheet);
    const padX =
      parseFloat(sheetStyle.paddingLeft) + parseFloat(sheetStyle.paddingRight);
    const padY =
      parseFloat(sheetStyle.paddingTop) + parseFloat(sheetStyle.paddingBottom);
    const layoutGap = parseFloat(getComputedStyle(sheetLayout).gap) || 0;
    const colGap = parseFloat(getComputedStyle(tier).gap) || 0;
    const tierGap =
      parseFloat(
        getComputedStyle(sheet.querySelector(".questions-area")!).gap,
      ) || 0;

    const availableWidth =
      sheet.clientWidth - padX - header.getBoundingClientRect().width - layoutGap;
    const availableHeight = sheet.clientHeight - padY;

    const measures = lines.map((_, i) => {
      const host = colRefs.current[i];
      const col = host?.querySelector<HTMLElement>(".q-col");
      const rect = col?.getBoundingClientRect();
      return {
        index: i,
        width: rect?.width ?? 0,
        height: rect?.height ?? 0,
      };
    });

    onLayout(
      paginate(measures, {
        availableWidth,
        availableHeight,
        colGap,
        tierGap,
      }),
    );
  }, [lines, settings, mode, onLayout]);

  if (lines.length === 0) return null;

  const sheetStyle = {
    "--body-size": `${settings.bodySize}pt`,
    "--title-size": `${settings.titleSize}pt`,
    "--subtitle-size": `${settings.subtitleSize}pt`,
    "--name-size": `${settings.nameSize}pt`,
    "--yomi-size": `${settings.yomiSize}pt`,
    "--box-scale": settings.boxScale / 100,
    "--gap-col": `${settings.colGap}mm`,
  } as CSSProperties;

  return (
    <div className="layout-measurer" aria-hidden>
      <div
        ref={sheetRef}
        className="sheet"
        data-orientation={settings.orientation}
        style={sheetStyle}
      >
        <div className="sheet-layout">
          <SheetHeader settings={settings} />
          <div className="questions-area">
            <div className="q-tier measure-tier">
              {lines.map((line, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    colRefs.current[i] = el;
                  }}
                  className="measure-col-host"
                >
                  <QuestionCol num="①" segments={line.segments} mode={mode} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
