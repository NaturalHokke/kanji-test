import { describe, expect, it } from "vitest";
import {
  packQuestionsIntoTiers,
  packTiersIntoPages,
  paginate,
  type QuestionMeasure,
} from "./paginate";

function m(index: number, width: number, height: number): QuestionMeasure {
  return { index, width, height };
}

describe("packQuestionsIntoTiers", () => {
  it("packs columns until width is exceeded", () => {
    const tiers = packQuestionsIntoTiers(
      [m(0, 30, 10), m(1, 30, 10), m(2, 30, 10), m(3, 30, 10)],
      100,
      10,
    );
    expect(tiers).toEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it("puts an oversized column alone in a tier", () => {
    const tiers = packQuestionsIntoTiers([m(0, 200, 10), m(1, 30, 10)], 100, 10);
    expect(tiers).toEqual([[0], [1]]);
  });
});

describe("packTiersIntoPages", () => {
  it("packs tiers until height is exceeded", () => {
    const byIndex = new Map([
      [0, m(0, 10, 40)],
      [1, m(1, 10, 40)],
      [2, m(2, 10, 40)],
    ]);
    const pages = packTiersIntoPages(
      [[0], [1], [2]],
      byIndex,
      100,
      10,
    );
    expect(pages).toEqual([[[0], [1]], [[2]]]);
  });
});

describe("paginate", () => {
  it("returns empty pages for no questions", () => {
    expect(
      paginate([], {
        availableWidth: 100,
        availableHeight: 100,
        colGap: 5,
        tierGap: 5,
      }),
    ).toEqual({ pages: [] });
  });
});
