import { suffixMatchLength } from "../parser/parse";
import type { TokenSegment } from "../parser/types";

type Props = { token: TokenSegment };

export function TokenRead({ token }: Props) {
  const { surface, yomi, emphasis } = token;
  const okuriganaLen = suffixMatchLength(surface, yomi);
  const stem = okuriganaLen > 0 ? surface.slice(0, -okuriganaLen) : surface;
  const okurigana = okuriganaLen > 0 ? surface.slice(-okuriganaLen) : "";

  return (
    <span
      className={[
        "token-read",
        emphasis === "bold" ? "token-emphasis-bold" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="display-text surface">{stem}</span>
      {okurigana ? (
        <span className="display-text okurigana">{okurigana}</span>
      ) : null}
      <span className="read-yomi-lane" aria-hidden />
    </span>
  );
}
