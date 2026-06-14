import type { TokenSegment } from "../parser/types";

type Props = { token: TokenSegment };

export function TokenWrite({ token }: Props) {
  const { yomi, writeWidth, lineStyle, emphasis } = token;
  const widthClass = writeWidth <= 6 ? `w-${writeWidth}` : "w-6";
  const boxes =
    writeWidth <= 1 ? (
      <span className="kanji-box" />
    ) : (
      <span className="kanji-box-stack">
        {Array.from({ length: writeWidth }, (_, i) => (
          <span key={i} className="kanji-box kanji-box-unit" />
        ))}
      </span>
    );

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
      {boxes}
      <rt className="display-text">{yomi}</rt>
    </span>
  );
}
