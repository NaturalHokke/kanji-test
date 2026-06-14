import type { TokenSegment } from "../parser/types";

type Props = { token: TokenSegment };

export function TokenWrite({ token }: Props) {
  const { yomi, writeWidth, lineStyle, emphasis } = token;
  const widthClass = writeWidth <= 6 ? `w-${writeWidth}` : "w-6";

  return (
    <span
      className={[
        "blank-ruby",
        widthClass,
        lineStyle === "wavy" ? "line-wavy" : "line-solid",
        emphasis === "bold" ? "token-emphasis-bold" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="kanji-box" />
      <rt className="display-text">{yomi}</rt>
    </span>
  );
}
