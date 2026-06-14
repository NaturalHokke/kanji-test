import { SegmentRenderer } from "./SegmentRenderer";
import type { Segment } from "../parser/types";

type Props = {
  num: string;
  segments: Segment[];
};

export function QuestionCol({ num, segments }: Props) {
  return (
    <div className="q-col">
      <div className="q-num">{num}</div>
      <div className="q-text">
        <div className="q-text-inner">
          <SegmentRenderer segments={segments} />
        </div>
      </div>
    </div>
  );
}
