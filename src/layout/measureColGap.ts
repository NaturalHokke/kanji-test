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

function readAlphaPx(sheet: HTMLElement): number {
  const raw = getComputedStyle(sheet).getPropertyValue("--gap-col-alpha").trim();
  return cssLengthToPx(sheet, raw || "1mm");
}

function maxRtDisplayWidth(sheet: HTMLElement): number {
  let max = 0;
  for (const rt of sheet.querySelectorAll("rt.display-text")) {
    max = Math.max(max, rt.getBoundingClientRect().width);
  }
  return max;
}

/** 書き取り: max(rt.display-text 幅) + α、その他: α のみ */
export function measureColGap(sheet: HTMLElement, mode: PreviewMode): number {
  const alpha = readAlphaPx(sheet);
  if (mode !== "write") return alpha;
  return maxRtDisplayWidth(sheet) + alpha;
}
