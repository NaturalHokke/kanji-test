import { useLayoutEffect, useRef, type CSSProperties } from "react";
import type { SheetSettings } from "../constants";
import type { ParseResult, PreviewMode } from "../parser/types";
import { measureColGap } from "../layout/measureColGap";
import { paginate, type PageLayout } from "../layout/paginate";
import { QuestionCol } from "./QuestionCol";
import { SheetHeader } from "./SheetHeader";

export type LayoutResult = {
  layout: PageLayout;
  colGap: number;
};

type Props = {
  lines: ParseResult[];
  settings: SheetSettings;
  mode: PreviewMode;
  onLayout: (result: LayoutResult) => void;
};

function sheetCssVars(settings: SheetSettings): CSSProperties {
  return {
    "--body-size": `${settings.bodySize}pt`,
    "--title-size": `${settings.titleSize}pt`,
    "--subtitle-size": `${settings.subtitleSize}pt`,
    "--name-size": `${settings.nameSize}pt`,
    "--yomi-size": `${settings.yomiSize}pt`,
    "--box-scale": settings.boxScale / 100,
    "--gap-col-alpha": `${settings.colGap}mm`,
  } as CSSProperties;
}

export function LayoutMeasurer({ lines, settings, mode, onLayout }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || lines.length === 0) {
      onLayout({ layout: { pages: [] }, colGap: 0 });
      return;
    }

    const sheetLayout = sheet.querySelector<HTMLElement>(".sheet-layout");
    const header = sheet.querySelector<HTMLElement>(".sheet-header");
    const questionsArea = sheet.querySelector<HTMLElement>(".questions-area");
    if (!sheetLayout || !header || !questionsArea) {
      onLayout({ layout: { pages: [] }, colGap: 0 });
      return;
    }

    const colGap = measureColGap(sheet, mode);
    sheet.style.setProperty("--gap-col", `${colGap}px`);

    const sheetStyle = getComputedStyle(sheet);
    const padX =
      parseFloat(sheetStyle.paddingLeft) + parseFloat(sheetStyle.paddingRight);
    const padY =
      parseFloat(sheetStyle.paddingTop) + parseFloat(sheetStyle.paddingBottom);
    const layoutGap = parseFloat(getComputedStyle(sheetLayout).gap) || 0;
    const tierGap = parseFloat(getComputedStyle(questionsArea).gap) || 0;

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

    onLayout({
      layout: paginate(measures, {
        availableWidth,
        availableHeight,
        colGap,
        tierGap,
      }),
      colGap,
    });
  }, [lines, settings, mode, onLayout]);

  if (lines.length === 0) return null;

  return (
    <div className="layout-measurer" aria-hidden>
      <div
        ref={sheetRef}
        className="sheet"
        data-orientation={settings.orientation}
        data-preview-mode={mode}
        style={sheetCssVars(settings)}
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
                  <QuestionCol num={1} segments={line.segments} mode={mode} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
