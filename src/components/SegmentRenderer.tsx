import type { Segment } from "../parser/types";
import { TokenWrite } from "./TokenWrite";
import { PlainText } from "./PlainText";

type Props = {
  segments: Segment[];
};

export function SegmentRenderer({ segments }: Props) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <PlainText key={i} content={seg.content} />;
        }
        return <TokenWrite key={i} token={seg} />;
      })}
    </>
  );
}
