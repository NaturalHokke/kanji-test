import { useRef } from "react";
import {
  BOX_SCALE_OPTIONS,
  ORIENTATION_UI,
  buildDefaultSettings,
  rangeOptions,
  type SheetSettings,
  type Orientation,
} from "../constants";

import type { ParseError } from "../parser/types";

type Props = {
  settings: SheetSettings;
  questions: string;
  parseErrors: ParseError[];
  onSettingsChange: (settings: SheetSettings) => void;
  onQuestionsChange: (questions: string) => void;
  onBuild: () => void;
};

export function Editor({
  settings,
  questions,
  parseErrors,
  onSettingsChange,
  onQuestionsChange,
  onBuild,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const defaults = buildDefaultSettings();
  const orientUi = ORIENTATION_UI[settings.orientation];

  const patch = (partial: Partial<SheetSettings>) =>
    onSettingsChange({ ...settings, ...partial });

  const shuffle = () => {
    const lines = questions
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    onQuestionsChange(lines.join("\n"));
    onBuild();
  };

  const saveTxt = () => {
    const blob = new Blob([questions], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kanji-test-questions.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      onQuestionsChange(String(reader.result ?? ""));
      onBuild();
    };
    reader.readAsText(file, "UTF-8");
  };

  return (
    <aside className="sidebar">
      <h1>漢字テスト作成</h1>

      <label htmlFor="title">表題</label>
      <input
        id="title"
        type="text"
        value={settings.title}
        onChange={(e) => patch({ title: e.target.value })}
      />

      <label htmlFor="subtitle">説明</label>
      <input
        id="subtitle"
        type="text"
        value={settings.subtitle}
        onChange={(e) => patch({ subtitle: e.target.value })}
      />

      <div className="row-2">
        <div>
          <label htmlFor="bodySize">本文サイズ (pt)</label>
          <select
            id="bodySize"
            value={settings.bodySize}
            onChange={(e) => patch({ bodySize: Number(e.target.value) })}
          >
            {rangeOptions(6, 49, defaults.bodySize).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="titleSize">表題サイズ (pt)</label>
          <select
            id="titleSize"
            value={settings.titleSize}
            onChange={(e) => patch({ titleSize: Number(e.target.value) })}
          >
            {rangeOptions(8, 36, defaults.titleSize).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row-2">
        <div>
          <label htmlFor="subtitleSize">説明サイズ (pt)</label>
          <select
            id="subtitleSize"
            value={settings.subtitleSize}
            onChange={(e) => patch({ subtitleSize: Number(e.target.value) })}
          >
            {rangeOptions(6, 36, defaults.subtitleSize).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nameSize">名前欄サイズ (pt)</label>
          <select
            id="nameSize"
            value={settings.nameSize}
            onChange={(e) => patch({ nameSize: Number(e.target.value) })}
          >
            {rangeOptions(6, 36, defaults.nameSize).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row-2">
        <div>
          <label htmlFor="yomiSize">読み仮名サイズ (pt)</label>
          <select
            id="yomiSize"
            value={settings.yomiSize}
            onChange={(e) => patch({ yomiSize: Number(e.target.value) })}
          >
            {rangeOptions(4, 20, defaults.yomiSize).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="boxScale">入力欄の大きさ (%)</label>
          <select
            id="boxScale"
            value={settings.boxScale}
            onChange={(e) => patch({ boxScale: Number(e.target.value) })}
          >
            {BOX_SCALE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label htmlFor="nameFormat">名前欄</label>
      <select
        id="nameFormat"
        value={settings.nameLine.includes("ねん") ? "hiragana" : "kanji"}
        onChange={(e) =>
          patch({
            nameLine:
              e.target.value === "hiragana"
                ? "ねん　　くみ　　なまえ（　　　　　　　　　　　　）"
                : "年　　組　　名前（　　　　　　　　　　）",
          })
        }
      >
        <option value="kanji">年　　組　　名前（　　　　　　　　　　）</option>
        <option value="hiragana">ねん　　くみ　　なまえ（　　　　　　　　　　　　）</option>
      </select>

      <label htmlFor="pageOrientation">印刷仕様（A4）</label>
      <select
        id="pageOrientation"
        value={settings.orientation}
        onChange={(e) =>
          patch({ orientation: e.target.value as Orientation })
        }
      >
        <option value="landscape">横向き（297×210 mm）</option>
        <option value="portrait">縦向き（210×297 mm）</option>
      </select>

      <label htmlFor="questions">問題（1行1問）</label>
      <textarea
        id="questions"
        spellCheck={false}
        value={questions}
        onChange={(e) => onQuestionsChange(e.target.value)}
      />

      {parseErrors.length > 0 && (
        <div className="parse-errors">
          {parseErrors.map((err, i) => (
            <p key={i}>
              {err.line}行目: {err.message}
            </p>
          ))}
        </div>
      )}

      <div className="btn-row">
        <button type="button" className="primary" onClick={onBuild}>
          作成
        </button>
        <button type="button" onClick={shuffle}>
          シャッフル
        </button>
        <button type="button" onClick={() => window.print()}>
          印刷 / PDF
        </button>
      </div>
      <div className="btn-row">
        <button type="button" onClick={saveTxt}>
          保存
        </button>
        <button type="button" onClick={() => fileRef.current?.click()}>
          読込
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) loadFile(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="help">
        <strong>記法</strong>
        <br />
        解答枠：<code>@(よみ,文字数)@</code>
        <br />
        例：<code>@(きもち,2)@</code> → 読み「きもち」の2マス枠
        <br />
        文字数省略：<code>@(きもち)@</code> → 読みの文字数で自動
        <br />
        読み省略：<code>@(,2)@</code> または <code>@(2)@</code>
        <br />
        <br />
        1ページ <strong>20問</strong>（10問×2段・A4 {orientUi.label}）。21問目以降は次ページへ。
        <br />
        印刷時は倍率 85〜90% で調整できます。
        <br />
        書体：<strong>UD明朝</strong>（未インストール時は BIZ UDPMincho）
      </div>
    </aside>
  );
}
