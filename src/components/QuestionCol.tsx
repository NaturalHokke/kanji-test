import { SegmentRenderer } from "./SegmentRenderer";
import type { Segment, PreviewMode } from "../parser/types";

type Props = {
  num: string;
  segments: Segment[];
  mode: PreviewMode;
};

export function QuestionCol({ num, segments, mode }: Props) {
  return (
    <div className="q-col">
      <div className="q-num">{num}</div>
      <div className="q-text">
        <div className="q-text-inner">
          <SegmentRenderer segments={segments} mode={mode} />
        </div>
      </div>
    </div>
  );
}
