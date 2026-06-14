export type QuestionMeasure = {
  index: number;
  width: number;
};

export type PaginateOptions = {
  availableWidth: number;
  colGap: number;
  tiersPerPage: number;
};

export type PageLayout = {
  pages: number[][][];
};

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

/** 段をページに分割（段数は向きで固定、高さは CSS で均等割り） */
export function packTiersIntoPages(
  tiers: number[][],
  tiersPerPage: number,
): number[][][] {
  if (tiers.length === 0 || tiersPerPage < 1) return [];

  const pages: number[][][] = [];
  for (let i = 0; i < tiers.length; i += tiersPerPage) {
    pages.push(tiers.slice(i, i + tiersPerPage));
  }
  return pages;
}

export function paginate(
  measures: QuestionMeasure[],
  options: PaginateOptions,
): PageLayout {
  const tiers = packQuestionsIntoTiers(
    measures,
    options.availableWidth,
    options.colGap,
  );
  const pages = packTiersIntoPages(tiers, options.tiersPerPage);
  return { pages };
}
