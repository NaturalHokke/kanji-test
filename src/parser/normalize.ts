/** 半角括弧・区切りを正規化（内部は「」『』と |） */
export function normalizeNotation(text: string): string {
  let out = "";
  let i = 0;

  while (i < text.length) {
    const c = text[i];

    if (c === '"') {
      const end = text.indexOf('"', i + 1);
      if (end === -1) {
        out += c;
        i++;
        continue;
      }
      out += `「${normalizeInner(text.slice(i + 1, end))}」`;
      i = end + 1;
    } else if (c === "'") {
      const end = text.indexOf("'", i + 1);
      if (end === -1) {
        out += c;
        i++;
        continue;
      }
      out += `『${normalizeInner(text.slice(i + 1, end))}』`;
      i = end + 1;
    } else {
      out += c === "｜" ? "|" : c;
      i++;
    }
  }

  return out;
}

function normalizeInner(s: string): string {
  return s.replace(/[｜|]/g, "|");
}
