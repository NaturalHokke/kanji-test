/** 旧 @(...)@ 記法（Phase 1 移植用。Phase 2 で削除） */

export function parseLineLegacy(text: string): string {
  const re = /@\(([^)]*)\)@|@([^@]+)@/g;
  return text.replace(re, (_, paren, bare) => {
    const inner = (paren !== undefined ? paren : bare).trim();
    let yomi = "";
    let width = 1;

    if (/^\d+$/.test(inner)) {
      width = Math.min(parseInt(inner, 10), 6);
    } else if (inner.includes(",")) {
      const parts = inner.split(",").map((s: string) => s.trim());
      yomi = parts[0] || "";
      width = parts[1]
        ? Math.min(parseInt(parts[1], 10) || 1, 6)
        : yomi.length || 1;
    } else if (inner.startsWith(",") || inner === "") {
      width = 1;
    } else {
      yomi = inner;
      width = Math.max(1, Math.min(yomi.length, 6));
    }

    const box = `<span class="kanji-box"></span>`;
    if (yomi) {
      return `<ruby class="blank-ruby w-${width}">${box}<rt>${escapeHtml(yomi)}</rt></ruby>`;
    }
    return `<span class="blank-ruby w-${width}">${box}</span>`;
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
