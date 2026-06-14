import type { TokenSegment } from "../parser/types";

type Props = {
  token: TokenSegment;
  mode: "write" | "read";
};

export function TokenAnswer({ token, mode }: Props) {
  const text = mode === "write" ? token.surface : token.yomi;
  return (
    <span
      className={[
        "token-answer",
        token.emphasis === "bold" ? "token-emphasis-bold" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="display-text">{text}</span>
    </span>
  );
}
