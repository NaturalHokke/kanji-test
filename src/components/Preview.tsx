import { PER_PAGE, ORIENTATION_UI, PREVIEW_MODE_LABELS } from "../constants";
import type { SheetSettings } from "../constants";
import type { ParseResult, PreviewMode } from "../parser/types";
import { Sheet } from "./Sheet";

type Props = {
  lines: ParseResult[];
  settings: SheetSettings;
  mode: PreviewMode;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function Preview({ lines, settings, mode }: Props) {
  const orientation = settings.orientation;
  const orientUi = ORIENTATION_UI[orientation];
  const modeLabel = PREVIEW_MODE_LABELS[mode] ?? mode;

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

  const pages = chunk(lines, PER_PAGE);

  return (
    <main className="preview-wrap">
      <p className="preview-label">
        ↓ 印刷プレビュー（{orientUi.preview}・{modeLabel}）
      </p>
      <div id="print-root" data-orientation={orientation}>
        {pages.map((pageQs, pi) => (
          <Sheet
            key={pi}
            pageQuestions={pageQs}
            pageIndex={pi}
            settings={settings}
            mode={mode}
          />
        ))}
      </div>
    </main>
  );
}
