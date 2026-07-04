#!/usr/bin/env node
/**
 * Renders the legal documents (src/content/legal/*.json) to PDF using the
 * globally installed Playwright + Chromium (no project dependency needed).
 */
const fs = require("fs");
const path = require("path");

const GLOBAL_NODE_MODULES = "/opt/node22/lib/node_modules";
const { chromium } = require(path.join(GLOBAL_NODE_MODULES, "playwright"));

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "legal");

const DOCS = [
  { json: "termos.json", pdf: "termo-de-uso.pdf" },
  { json: "privacidade.json", pdf: "politica-de-privacidade.pdf" },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderHtml(content) {
  const sectionsHtml = content.sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
      const items = section.items
        ? `<ul>${section.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("\n")}</ul>`
        : "";
      return `<section><h2>${escapeHtml(section.heading)}</h2>${paragraphs}${items}</section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(content.title)}</title>
<style>
  @page { size: A4; margin: 26mm 20mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #111;
    font-size: 12pt;
    line-height: 1.6;
  }
  header {
    border-bottom: 2px solid #111;
    padding-bottom: 12px;
    margin-bottom: 24px;
  }
  header .brand {
    font-family: Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 11pt;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #444;
  }
  h1 {
    font-size: 20pt;
    margin: 6px 0 4px;
  }
  .updated {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 9pt;
    color: #666;
  }
  h2 {
    font-size: 12.5pt;
    margin: 20px 0 8px;
    page-break-after: avoid;
  }
  p, li {
    text-align: justify;
  }
  ul {
    margin: 6px 0;
    padding-left: 20px;
  }
  li {
    margin-bottom: 6px;
  }
  section {
    page-break-inside: avoid;
  }
  footer {
    margin-top: 32px;
    padding-top: 10px;
    border-top: 1px solid #ccc;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 8pt;
    color: #888;
  }
</style>
</head>
<body>
  <header>
    <div class="brand">Trackpile</div>
    <h1>${escapeHtml(content.title)}</h1>
    <div class="updated">Última atualização: ${escapeHtml(content.updatedAt)}</div>
  </header>
  ${sectionsHtml}
  <footer>Trackpile — documento gerado automaticamente a partir do conteúdo publicado em trackpile.app</footer>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const doc of DOCS) {
      const content = JSON.parse(
        fs.readFileSync(path.join(ROOT, "src", "content", "legal", doc.json), "utf8")
      );
      const html = renderHtml(content);
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const outPath = path.join(OUT_DIR, doc.pdf);
      await page.pdf({
        path: outPath,
        format: "A4",
        printBackground: true,
        margin: { top: "26mm", bottom: "20mm", left: "20mm", right: "20mm" },
      });
      await page.close();
      console.log(`Gerado: ${path.relative(ROOT, outPath)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
