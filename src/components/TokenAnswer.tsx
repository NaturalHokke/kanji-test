import type { TokenSegment } from "../parser/types";

type Props = {
  token: TokenSegment;
  mode: "write" | "read";
};

export function TokenAnswer({ token, mode }: Props) {
  const { surface, yomi, writeWidth, emphasis } = token;
  const emphasisClass =
    emphasis === "bold" ? "token-emphasis-bold" : "";

  if (mode === "write") {
    const widthClass = writeWidth <= 6 ? `w-${writeWidth}` : "w-6";
    return (
      <span
        className={[
          "blank-ruby",
          "blank-ruby-answer",
          widthClass,
          emphasisClass,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="kanji-box">
          <span className="display-text">{surface}</span>
        </span>
        <rt className="write-yomi-lane" aria-hidden />
      </span>
    );
  }

  return (
    <span
      className={["token-answer", emphasisClass].filter(Boolean).join(" ")}
    >
      <span className="display-text">{yomi}</span>
    </span>
  );
}
