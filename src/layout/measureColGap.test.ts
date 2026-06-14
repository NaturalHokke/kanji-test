import { describe, expect, it } from "vitest";
import { layoutModeForPreview } from "../constants";
import { computeColGapPx } from "./measureColGap";

describe("layoutModeForPreview", () => {
  it("maps answer modes to question layout modes", () => {
    expect(layoutModeForPreview("write")).toBe("write");
    expect(layoutModeForPreview("answer-write")).toBe("write");
    expect(layoutModeForPreview("read")).toBe("read");
    expect(layoutModeForPreview("answer-read")).toBe("read");
  });
});

describe("computeColGapPx", () => {
  it("adds lane width and alpha for write layout", () => {
    expect(computeColGapPx("write", 5, 12)).toBe(17);
  });

  it("adds lane width and alpha for read layout", () => {
    expect(computeColGapPx("read", 5, 12)).toBe(17);
  });
});
