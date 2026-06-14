import { SegmentRenderer } from "./SegmentRenderer";
import type { Segment, PreviewMode } from "../parser/types";

type Props = {
  num: number;
  segments: Segment[];
  mode: PreviewMode;
};

export function QuestionCol({ num, segments, mode }: Props) {
  const digits = String(num).length;

  return (
    <div className="q-col">
      <div className="q-num" data-digits={digits}>
        <span className="q-num-inner">{num}</span>
      </div>
      <div className="q-text">
        <div className="q-text-inner">
          <SegmentRenderer segments={segments} mode={mode} />
        </div>
      </div>
    </div>
  );
}
