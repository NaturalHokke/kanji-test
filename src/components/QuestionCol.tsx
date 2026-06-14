import { parseLineLegacy } from "../legacy/parseLegacy";

type Props = {
  num: string;
  question: string;
};

export function QuestionCol({ num, question }: Props) {
  return (
    <div className="q-col">
      <div className="q-num">{num}</div>
      <div className="q-text">
        <div
          className="q-text-inner"
          dangerouslySetInnerHTML={{ __html: parseLineLegacy(question) }}
        />
      </div>
    </div>
  );
}
