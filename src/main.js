import "./styles/main.css";

const PER_PAGE = 20;
const PER_TIER = 10;
const CIRCLED = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩",
                 "⑪","⑫","⑬","⑭","⑮","⑯","⑰","⑱","⑲","⑳"];

const $ = (id) => document.getElementById(id);

function fillSizeSelect(id, min, max, defaultVal) {
    const sel = $(id);
    sel.innerHTML = "";
    for (let n = min; n <= max; n++) {
        const opt = document.createElement("option");
        opt.value = String(n);
        opt.textContent = String(n);
        if (n === defaultVal) opt.selected = true;
        sel.appendChild(opt);
    }
}

fillSizeSelect("bodySize", 6, 49, 18);
fillSizeSelect("titleSize", 8, 36, 16);
fillSizeSelect("subtitleSize", 6, 36, 12);
fillSizeSelect("nameSize", 6, 36, 12);
fillSizeSelect("yomiSize", 4, 20, 8);

(function fillBoxScale() {
    const sel = $("boxScale");
    [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180].forEach(n => {
        const opt = document.createElement("option");
        opt.value = String(n);
        opt.textContent = String(n);
        if (n === 130) opt.selected = true;
        sel.appendChild(opt);
    });
})();

/** 行テキスト → HTML（@(...)@ を解答枠に変換） */
function parseLine(text) {
    // @(よみ,桁)@ / @(よみ)@ / @(桁)@ / @よみ,桁@ / @よみ@
    const re = /@\(([^)]*)\)@|@([^@]+)@/g;
    return text.replace(re, (_, paren, bare) => {
        const inner = (paren !== undefined ? paren : bare).trim();
        let yomi = "";
        let width = 1;

        if (/^\d+$/.test(inner)) {
            width = Math.min(parseInt(inner, 10), 6);
        } else if (inner.includes(",")) {
            const parts = inner.split(",").map(s => s.trim());
            yomi = parts[0] || "";
            width = parts[1] ? Math.min(parseInt(parts[1], 10) || 1, 6) : (yomi.length || 1);
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

function escapeHtml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function getQuestions() {
    return $("questions").value
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);
}

function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size));
    }
    return out;
}

function buildQuestionCol(q, num) {
    const col = document.createElement("div");
    col.className = "q-col";
    col.innerHTML =
        `<div class="q-num">${num}</div>` +
        `<div class="q-text"><div class="q-text-inner">${parseLine(q)}</div></div>`;
    return col;
}

function buildTier(tierQuestions, tierStartIndex, pageIndex) {
    const tier = document.createElement("div");
    tier.className = "q-tier";
    tierQuestions.forEach((q, i) => {
        const globalIndex = tierStartIndex + i;
        const num = CIRCLED[globalIndex] ?? `${pageIndex * PER_PAGE + globalIndex + 1}`;
        tier.appendChild(buildQuestionCol(q, num));
    });
    return tier;
}

function buildSheet(pageQuestions, pageIndex, settings) {
    const sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.style.setProperty("--body-size", settings.bodySize + "pt");
    sheet.style.setProperty("--title-size", settings.titleSize + "pt");
    sheet.style.setProperty("--subtitle-size", settings.subtitleSize + "pt");
    sheet.style.setProperty("--name-size", settings.nameSize + "pt");
    sheet.style.setProperty("--yomi-size", settings.yomiSize + "pt");
    sheet.style.setProperty("--box-scale", settings.boxScale / 100);
    sheet.style.setProperty("--gap-col", settings.colGap + "mm");
    /* レイアウト間隔（--gap-header-body 等）は .sheet の CSS 変数を参照。JS から上書きしない */

    const layout = document.createElement("div");
    layout.className = "sheet-layout";

    const header = document.createElement("div");
    header.className = "sheet-header";
    /* 右列=表題+名前、左列=説明 */
    header.innerHTML =
        `<div class="header-col header-col-title">` +
            `<div class="sheet-title header-vtext">${escapeHtml(settings.title)}</div>` +
            `<div class="name-line header-vtext">${escapeHtml(settings.nameLine)}</div>` +
        `</div>` +
        `<div class="header-col header-col-instruction">` +
            `<div class="sheet-instruction header-vtext">${escapeHtml(settings.subtitle)}</div>` +
        `</div>`;

    const area = document.createElement("div");
    area.className = "questions-area";

    const tier1 = pageQuestions.slice(0, PER_TIER);
    const tier2 = pageQuestions.slice(PER_TIER, PER_PAGE);

    if (tier1.length) {
        area.appendChild(buildTier(tier1, 0, pageIndex));
    }
    if (tier2.length) {
        area.appendChild(buildTier(tier2, PER_TIER, pageIndex));
    }

    /* flex row-reverse: 表題列=右端、問題=左（上段①–⑩、下段⑪–⑳） */
    layout.appendChild(header);
    layout.appendChild(area);
    sheet.appendChild(layout);
    return sheet;
}

function render() {
    const settings = {
        title: $("title").value.trim() || "漢字テスト",
        subtitle: $("subtitle").value.trim(),
        nameLine: $("nameFormat").value === "hiragana"
            ? "ねん　　くみ　　なまえ（　　　　　　　　　　　　）"
            : "年　　組　　名前（　　　　　　　　　　）",
        bodySize: parseInt($("bodySize").value, 10),
        titleSize: parseInt($("titleSize").value, 10),
        subtitleSize: parseInt($("subtitleSize").value, 10),
        nameSize: parseInt($("nameSize").value, 10),
        yomiSize: parseInt($("yomiSize").value, 10),
        boxScale: parseInt($("boxScale").value, 10),
        colGap: Math.max(2, Math.min(6, Math.round(52 / PER_TIER * 10) / 10)),
    };

    const questions = getQuestions();
    const root = $("print-root");
    root.innerHTML = "";

    if (questions.length === 0) {
        root.innerHTML = '<div class="empty-msg">問題を入力して「作成」を押してください</div>';
        return;
    }

    const pages = chunk(questions, PER_PAGE);
    pages.forEach((pageQs, pi) => {
        root.appendChild(buildSheet(pageQs, pi, settings));
    });
}

function shuffleQuestions() {
    const lines = getQuestions();
    for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    $("questions").value = lines.join("\n");
    render();
}

function saveTxt() {
    const blob = new Blob([$("questions").value], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kanji-test-questions.txt";
    a.click();
    URL.revokeObjectURL(a.href);
}

$("btnBuild").addEventListener("click", render);
$("btnShuffle").addEventListener("click", shuffleQuestions);
$("btnPrint").addEventListener("click", () => window.print());
$("btnSave").addEventListener("click", saveTxt);
$("btnLoad").addEventListener("click", () => $("fileLoad").click());
$("fileLoad").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        $("questions").value = reader.result;
        render();
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
});

["title", "subtitle", "bodySize", "titleSize", "subtitleSize", "nameSize", "yomiSize", "boxScale", "nameFormat"].forEach(id => {
    $(id).addEventListener("change", render);
});

render();
