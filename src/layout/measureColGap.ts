import type { LayoutMode } from "../constants";
import { layoutModeForPreview } from "../constants";
import type { PreviewMode } from "../parser/types";

/** mm / pt 等の CSS 長さを px に換算する */
export function cssLengthToPx(
  container: HTMLElement,
  value: string,
  property: "width" | "height" = "width",
): number {
  const probe = document.createElement("div");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  if (property === "width") {
    probe.style.width = value;
  } else {
    probe.style.height = value;
  }
  container.appendChild(probe);
  const px = probe.getBoundingClientRect()[property];
  container.removeChild(probe);
  return px;
}

/** 列 gap = レーン幅 + α（版組は write / read 基準） */
export function computeColGapPx(
  layoutMode: LayoutMode,
  alphaPx: number,
  laneWidthPx: number,
): number {
  return laneWidthPx + alphaPx;
}

function readAlphaPx(sheet: HTMLElement): number {
  const raw = getComputedStyle(sheet).getPropertyValue("--gap-col-alpha").trim();
  return cssLengthToPx(sheet, raw || "1mm");
}

function maxElementWidth(sheet: HTMLElement, selector: string): number {
  let max = 0;
  for (const el of sheet.querySelectorAll(selector)) {
    max = Math.max(max, el.getBoundingClientRect().width);
  }
  return max;
}

function fallbackYomiLaneWidthPx(sheet: HTMLElement): number {
  const style = getComputedStyle(sheet);
  const laneVar = style.getPropertyValue("--width-yomi-lane").trim();
  if (laneVar) return cssLengthToPx(sheet, laneVar);
  const yomi = style.getPropertyValue("--yomi-size").trim() || "9pt";
  return cssLengthToPx(sheet, yomi);
}

function laneWidthForLayout(
  sheet: HTMLElement,
  layoutMode: LayoutMode,
): number {
  const selector =
    layoutMode === "write" ? "rt.display-text" : ".read-yomi-lane";
  const measured = maxElementWidth(sheet, selector);
  return measured || fallbackYomiLaneWidthPx(sheet);
}

/** 書き: max(rt 幅)+α、読み: max(読み記入レーン幅)+α（解答モードも同版組） */
export function measureColGap(sheet: HTMLElement, mode: PreviewMode): number {
  const layoutMode = layoutModeForPreview(mode);
  const alpha = readAlphaPx(sheet);
  return computeColGapPx(
    layoutMode,
    alpha,
    laneWidthForLayout(sheet, layoutMode),
  );
}
