import { useLayoutEffect, type RefObject } from "react";

/** プレビュー枠の幅に収まるよう縮小（100% 超の拡大はしない） */
export function usePreviewFitScale(
  scrollRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  hostRef: RefObject<HTMLElement | null>,
  deps: unknown[],
) {
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const content = contentRef.current;
    const host = hostRef.current;
    if (!scroll || !content || !host) return;

    const update = () => {
      content.style.transform = "none";
      content.style.transformOrigin = "";
      host.style.removeProperty("height");

      const naturalW = content.offsetWidth;
      const naturalH = content.offsetHeight;
      const availableW = scroll.clientWidth;
      if (naturalW <= 0) return;

      const scale = Math.min(1, availableW / naturalW);

      if (scale < 1) {
        content.style.transformOrigin = "top left";
        content.style.transform = `scale(${scale})`;
        host.style.height = `${naturalH * scale}px`;
      } else {
        host.style.height = `${naturalH}px`;
      }
    };

    const ro = new ResizeObserver(update);
    ro.observe(scroll);
    ro.observe(content);
    update();

    return () => ro.disconnect();
  }, deps);
}
