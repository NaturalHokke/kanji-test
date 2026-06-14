export type QuestionMeasure = {
  index: number;
  width: number;
  height: number;
};

export type PaginateOptions = {
  availableWidth: number;
  availableHeight: number;
  colGap: number;
  tierGap: number;
};

export type PageLayout = {
  pages: number[][][];
};

function tierHeight(
  tier: number[],
  byIndex: Map<number, QuestionMeasure>,
): number {
  return Math.max(...tier.map((i) => byIndex.get(i)?.height ?? 0));
}

export function packQuestionsIntoTiers(
  measures: QuestionMeasure[],
  availableWidth: number,
  colGap: number,
): number[][] {
  if (measures.length === 0) return [];

  const tiers: number[][] = [];
  let current: number[] = [];
  let usedWidth = 0;

  for (const q of measures) {
    const gap = current.length > 0 ? colGap : 0;
    const nextWidth = usedWidth + gap + q.width;

    if (current.length > 0 && nextWidth > availableWidth) {
      tiers.push(current);
      current = [q.index];
      usedWidth = q.width;
    } else {
      current.push(q.index);
      usedWidth = nextWidth;
    }
  }

  if (current.length > 0) tiers.push(current);
  return tiers;
}

export function packTiersIntoPages(
  tiers: number[][],
  byIndex: Map<number, QuestionMeasure>,
  availableHeight: number,
  tierGap: number,
): number[][][] {
  if (tiers.length === 0) return [];

  const pages: number[][][] = [];
  let currentPage: number[][] = [];
  let usedHeight = 0;

  for (const tier of tiers) {
    const h = tierHeight(tier, byIndex);
    const gap = currentPage.length > 0 ? tierGap : 0;
    const nextHeight = usedHeight + gap + h;

    if (currentPage.length > 0 && nextHeight > availableHeight) {
      pages.push(currentPage);
      currentPage = [tier];
      usedHeight = h;
    } else {
      currentPage.push(tier);
      usedHeight = nextHeight;
    }
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}

export function paginate(
  measures: QuestionMeasure[],
  options: PaginateOptions,
): PageLayout {
  const byIndex = new Map(measures.map((m) => [m.index, m]));
  const tiers = packQuestionsIntoTiers(
    measures,
    options.availableWidth,
    options.colGap,
  );
  const pages = packTiersIntoPages(
    tiers,
    byIndex,
    options.availableHeight,
    options.tierGap,
  );
  return { pages };
}
