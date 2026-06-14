import { describe, expect, it } from "vitest";
import { parseLine } from "./parse";

function token(segments: ReturnType<typeof parseLine>["segments"]) {
  const t = segments.find((s) => s.type === "token");
  if (!t || t.type !== "token") throw new Error("no token");
  return t;
}

describe("parseLine", () => {
  it("parses 失敗 token", () => {
    const { segments, errors } = parseLine("「失敗｜しっぱい」", 1);
    expect(errors).toHaveLength(0);
    const t = token(segments);
    expect(t.surface).toBe("失敗");
    expect(t.yomi).toBe("しっぱい");
    expect(t.writeWidth).toBe(2);
    expect(t.readWidth).toBe(4);
    expect(t.lineStyle).toBe("solid");
    expect(t.emphasis).toBe("normal");
  });

  it("parses 許す token with wavy", () => {
    const t = token(parseLine("「許す｜ゆるす」", 1).segments);
    expect(t.writeWidth).toBe(2);
    expect(t.readWidth).toBe(2);
    expect(t.lineStyle).toBe("wavy");
  });

  it("parses bold token", () => {
    const t = token(parseLine("『許す｜ゆるす』", 1).segments);
    expect(t.emphasis).toBe("bold");
  });

  it("normalizes halfwidth quotes", () => {
    const t = token(parseLine('"失敗|しっぱい"', 1).segments);
    expect(t.surface).toBe("失敗");
    expect(t.yomi).toBe("しっぱい");
  });

  it("parses plain text", () => {
    const { segments } = parseLine("を", 1);
    expect(segments).toEqual([{ type: "text", content: "を" }]);
  });

  it("errors on missing separator", () => {
    const { errors, segments } = parseLine("「失敗」", 1);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("区切り");
    expect(segments[0].type).toBe("text");
  });

  it("parses halfwidth single quotes as bold", () => {
    const t = token(parseLine("'許す|ゆるす'", 1).segments);
    expect(t.emphasis).toBe("bold");
  });
});
