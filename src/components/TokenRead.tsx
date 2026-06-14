import type { TokenSegment } from "../parser/types";

type Props = { token: TokenSegment };

export function TokenRead({ token }: Props) {
  const { surface, readWidth, emphasis } = token;

  return (
    <span
      className={[
        "token-read",
        emphasis === "bold" ? "token-emphasis-bold" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="display-text surface">{surface}</span>
      {readWidth > 0 &&
        Array.from({ length: readWidth }, (_, i) => (
          <span key={i} className="read-slot" />
        ))}
    </span>
  );
}
