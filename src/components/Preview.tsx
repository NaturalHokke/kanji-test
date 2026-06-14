import { useCallback, useState } from "react";
import { ORIENTATION_UI, PREVIEW_MODE_LABELS } from "../constants";
import type { SheetSettings } from "../constants";
import type { ParseResult, PreviewMode } from "../parser/types";
import { LayoutMeasurer, type LayoutResult } from "./LayoutMeasurer";
import { Sheet } from "./Sheet";

type Props = {
  lines: ParseResult[];
  settings: SheetSettings;
  mode: PreviewMode;
};

const EMPTY_LAYOUT: LayoutResult = { layout: { pages: [] }, colGap: 0 };

export function Preview({ lines, settings, mode }: Props) {
  const orientation = settings.orientation;
  const orientUi = ORIENTATION_UI[orientation];
  const modeLabel = PREVIEW_MODE_LABELS[mode] ?? mode;
  const [layoutResult, setLayoutResult] = useState<LayoutResult>(EMPTY_LAYOUT);

  const handleLayout = useCallback((next: LayoutResult) => {
    setLayoutResult(next);
  }, []);

  if (lines.length === 0) {
    return (
      <main className="preview-wrap">
        <p className="preview-label">
          ↓ 印刷プレビュー（{orientUi.preview}・{modeLabel}）
        </p>
        <div id="print-root" data-orientation={orientation}>
          <div className="empty-msg">問題を入力して「作成」を押してください</div>
        </div>
      </main>
    );
  }

  return (
    <main className="preview-wrap">
      <p className="preview-label">
        ↓ 印刷プレビュー（{orientUi.preview}・{modeLabel}）
      </p>
      <LayoutMeasurer
        lines={lines}
        settings={settings}
        mode={mode}
        onLayout={handleLayout}
      />
      <div id="print-root" data-orientation={orientation}>
        {layoutResult.layout.pages.map((pageTiers, pi) => (
          <Sheet
            key={pi}
            tiers={pageTiers}
            lines={lines}
            settings={settings}
            mode={mode}
            colGap={layoutResult.colGap}
          />
        ))}
      </div>
    </main>
  );
}
