import { describe, expect, it } from "vitest";
import { computeColGapPx } from "./measureColGap";

describe("computeColGapPx", () => {
  it("adds lane width and alpha for write mode", () => {
    expect(computeColGapPx("write", 5, 12)).toBe(17);
  });

  it("adds lane width and alpha for read mode", () => {
    expect(computeColGapPx("read", 5, 12)).toBe(17);
  });

  it("uses alpha only for answer modes", () => {
    expect(computeColGapPx("answer-write", 5, 12)).toBe(5);
    expect(computeColGapPx("answer-read", 5, 12)).toBe(5);
  });
});
