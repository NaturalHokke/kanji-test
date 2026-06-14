import type { Segment, PreviewMode } from "../parser/types";
import { TokenWrite } from "./TokenWrite";
import { TokenRead } from "./TokenRead";
import { TokenAnswer } from "./TokenAnswer";
import { PlainText } from "./PlainText";

type Props = {
  segments: Segment[];
  mode: PreviewMode;
};

export function SegmentRenderer({ segments, mode }: Props) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <PlainText key={i} content={seg.content} />;
        }
        switch (mode) {
          case "write":
            return <TokenWrite key={i} token={seg} />;
          case "read":
            return <TokenRead key={i} token={seg} />;
          case "answer-write":
            return <TokenAnswer key={i} token={seg} mode="write" />;
          case "answer-read":
            return <TokenAnswer key={i} token={seg} mode="read" />;
        }
      })}
    </>
  );
}
