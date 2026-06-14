import { PER_PAGE, ORIENTATION_UI } from "../constants";
import type { SheetSettings } from "../constants";
import { Sheet } from "./Sheet";

type Props = {
  questions: string[];
  settings: SheetSettings;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function Preview({ questions, settings }: Props) {
  const orientation = settings.orientation;
  const orientUi = ORIENTATION_UI[orientation];

  if (questions.length === 0) {
    return (
      <main className="preview-wrap">
        <p className="preview-label">↓ 印刷プレビュー（{orientUi.preview}）</p>
        <div id="print-root" data-orientation={orientation}>
          <div className="empty-msg">問題を入力して「作成」を押してください</div>
        </div>
      </main>
    );
  }

  const pages = chunk(questions, PER_PAGE);

  return (
    <main className="preview-wrap">
      <p className="preview-label">↓ 印刷プレビュー（{orientUi.preview}）</p>
      <div id="print-root" data-orientation={orientation}>
        {pages.map((pageQs, pi) => (
          <Sheet
            key={pi}
            pageQuestions={pageQs}
            pageIndex={pi}
            settings={settings}
          />
        ))}
      </div>
    </main>
  );
}
