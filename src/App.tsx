import { useCallback, useEffect, useState } from "react";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";
import {
  DEFAULT_QUESTIONS,
  buildDefaultSettings,
  type SheetSettings,
} from "./constants";

function parseQuestions(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function App() {
  const [settings, setSettings] = useState<SheetSettings>(buildDefaultSettings);
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [builtQuestions, setBuiltQuestions] = useState<string[]>(() =>
    parseQuestions(DEFAULT_QUESTIONS),
  );

  const handleBuild = useCallback(() => {
    setBuiltQuestions(parseQuestions(questions));
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
        onSettingsChange={setSettings}
        onQuestionsChange={setQuestions}
        onBuild={handleBuild}
      />
      <Preview questions={builtQuestions} settings={settings} />
    </div>
  );
}
