import { useEffect, useRef } from "react";
import {
  BOX_SCALE_OPTIONS,
  COL_GAP_MM_OPTIONS,
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

const NOTATION_HELP_ID = "notation-help-text";

export function Editor({
  settings,
  questions,
  parseErrors,
  onSettingsChange,
  onQuestionsChange,
  onBuild,
}: Props) {
  const notationHelpTriggerRef = useRef<HTMLButtonElement>(null);
  const defaults = buildDefaultSettings();

  useEffect(() => {
    notationHelpTriggerRef.current?.setAttribute(
      "interestfor",
      NOTATION_HELP_ID,
    );
  }, []);

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

      <details className="size-settings-accordion">
        <summary>文字サイズ・余白</summary>
        <div className="accordion-body">
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
                onChange={(e) =>
                  patch({ subtitleSize: Number(e.target.value) })
                }
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

          <div className="row-2">
            <div>
              <label htmlFor="writeColGap">書き取り・列間余白 (mm)</label>
              <select
                id="writeColGap"
                value={settings.writeColGap}
                onChange={(e) =>
                  patch({ writeColGap: Number(e.target.value) })
                }
              >
                {COL_GAP_MM_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="readColGap">読み取り・列間余白 (mm)</label>
              <select
                id="readColGap"
                value={settings.readColGap}
                onChange={(e) => patch({ readColGap: Number(e.target.value) })}
              >
                {COL_GAP_MM_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </details>

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

      <div className="field-label-row">
        <label htmlFor="questions">問題（1行1問）</label>
        <button
          ref={notationHelpTriggerRef}
          type="button"
          id="notation-help-trigger"
          className="notation-help-trigger"
          aria-label="記法の説明"
          popoverTarget={NOTATION_HELP_ID}
        >
          ?
        </button>
      </div>
      <div
        id={NOTATION_HELP_ID}
        popover="hint"
        className="notation-help-popover"
      >
        <strong>記法</strong>
        <br />
        基本: <code>「表記｜読み」</code>
        <br />
        例: <code>「失敗｜しっぱい」を「許す｜ゆるす」</code>
        <br />
        太字: <code>『表記｜読み』</code>
        <br />
        半角: <code>&quot;表記|読み&quot;</code>{" "}
        <code>&apos;表記|読み&apos;</code> も可
      </div>
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
    </aside>
  );
}
