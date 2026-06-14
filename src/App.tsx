import { useCallback, useEffect, useMemo, useState } from "react";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";
import {
  DEFAULT_QUESTIONS,
  buildDefaultSettings,
  type SheetSettings,
} from "./constants";
import { parseDocument } from "./parser";
import type { ParseResult, PreviewMode } from "./parser/types";

export function App() {
  const [settings, setSettings] = useState<SheetSettings>(buildDefaultSettings);
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("write");
  const [builtLines, setBuiltLines] = useState<ParseResult[]>(() =>
    parseDocument(DEFAULT_QUESTIONS).lines,
  );

  const parseErrors = useMemo(
    () => parseDocument(questions).errors,
    [questions],
  );

  const handleBuild = useCallback(() => {
    setBuiltLines(parseDocument(questions).lines);
  }, [questions]);

  useEffect(() => {
    handleBuild();
  }, [
    settings.title,
    settings.subtitle,
    settings.nameLine,
    settings.bodySize,
    settings.titleSize,
    settings.subtitleSize,
    settings.nameSize,
    settings.yomiSize,
    settings.boxScale,
    settings.orientation,
    handleBuild,
  ]);

  return (
    <div className="editor">
      <Editor
        settings={settings}
        questions={questions}
        previewMode={previewMode}
        parseErrors={parseErrors}
        onSettingsChange={setSettings}
        onQuestionsChange={setQuestions}
        onPreviewModeChange={setPreviewMode}
        onBuild={handleBuild}
      />
      <Preview lines={builtLines} settings={settings} mode={previewMode} />
    </div>
  );
}
