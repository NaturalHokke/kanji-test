import { useCallback, useRef, useState } from "react";
import { ORIENTATION_UI, PREVIEW_MODE_LABELS } from "../constants";
import type { SheetSettings } from "../constants";
import { usePreviewFitScale } from "../hooks/usePreviewFitScale";
import type { ParseResult, PreviewMode } from "../parser/types";
import { LayoutMeasurer, type LayoutResult } from "./LayoutMeasurer";
import { Sheet } from "./Sheet";

type Props = {
  lines: ParseResult[];
  settings: SheetSettings;
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
};

const EMPTY_LAYOUT: LayoutResult = { layout: { pages: [] }, colGap: 0 };

export function Preview({ lines, settings, mode, onModeChange }: Props) {
  const orientation = settings.orientation;
  const orientUi = ORIENTATION_UI[orientation];
  const [layoutResult, setLayoutResult] = useState<LayoutResult>(EMPTY_LAYOUT);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleLayout = useCallback((next: LayoutResult) => {
    setLayoutResult(next);
  }, []);

  usePreviewFitScale(scrollRef, contentRef, hostRef, [
    lines,
    layoutResult,
    orientation,
    settings,
    mode,
  ]);

  return (
    <main className="preview-wrap">
      <div className="preview-toolbar">
        <p className="preview-label">
          印刷プレビュー（{orientUi.preview}）
        </p>
        <label htmlFor="previewMode" className="preview-mode-label">
          表示
        </label>
        <select
          id="previewMode"
          className="preview-mode-select"
          value={mode}
          onChange={(e) => onModeChange(e.target.value as PreviewMode)}
        >
          {(Object.keys(PREVIEW_MODE_LABELS) as PreviewMode[]).map((key) => (
            <option key={key} value={key}>
              {PREVIEW_MODE_LABELS[key]}
            </option>
          ))}
        </select>
      </div>
      {lines.length > 0 && (
        <LayoutMeasurer
          lines={lines}
          settings={settings}
          mode={mode}
          onLayout={handleLayout}
        />
      )}
      <div
        className="preview-scroll"
        ref={scrollRef}
        data-orientation={orientation}
      >
        <div className="preview-scale-host" ref={hostRef}>
          <div id="print-root" ref={contentRef} data-orientation={orientation}>
            {lines.length === 0 ? (
              <div className="empty-msg">
                問題を入力して「作成」を押してください
              </div>
            ) : (
              layoutResult.layout.pages.map((pageTiers, pi) => (
                <Sheet
                  key={pi}
                  tiers={pageTiers}
                  lines={lines}
                  settings={settings}
                  mode={mode}
                  colGap={layoutResult.colGap}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
