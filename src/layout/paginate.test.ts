import { describe, expect, it } from "vitest";
import {
  packQuestionsIntoTiers,
  packTiersIntoPages,
  paginate,
  type QuestionMeasure,
} from "./paginate";

function m(index: number, width: number): QuestionMeasure {
  return { index, width };
}

describe("packQuestionsIntoTiers", () => {
  it("packs columns until width is exceeded", () => {
    const tiers = packQuestionsIntoTiers(
      [m(0, 30), m(1, 30), m(2, 30), m(3, 30)],
      100,
      10,
    );
    expect(tiers).toEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it("puts an oversized column alone in a tier", () => {
    const tiers = packQuestionsIntoTiers([m(0, 200), m(1, 30)], 100, 10);
    expect(tiers).toEqual([[0], [1]]);
  });
});

describe("packTiersIntoPages", () => {
  it("chunks two tiers per page for portrait", () => {
    const pages = packTiersIntoPages([[0], [1], [2]], 2);
    expect(pages).toEqual([[[0], [1]], [[2]]]);
  });

  it("chunks one tier per page for landscape", () => {
    const pages = packTiersIntoPages([[0], [1], [2]], 1);
    expect(pages).toEqual([[[0]], [[1]], [[2]]]);
  });
});

describe("paginate", () => {
  it("returns empty pages for no questions", () => {
    expect(
      paginate([], {
        availableWidth: 100,
        colGap: 5,
        tiersPerPage: 2,
      }),
    ).toEqual({ pages: [] });
  });
});
