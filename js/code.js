// Code blocks in .site-prose become the design system's (components/code),
// as the theme's script does for .zt-prose (theme.js's enhanceCode): a bar
// naming the language and a copy button. Runs before the theme's script,
// which then colours the code (highlightCode) and wires the button (initCopy).

const strings = (() => {
  try { return JSON.parse(document.getElementById("zt-strings")?.textContent || "{}"); } catch { return {}; }
})();
const say = (key, fallback) => strings[key] || fallback;

const SPRITE = new URL("../arabesque/icons.svg", import.meta.url).pathname;

function icon(name, className) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", `al-icon ${className}`);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `${SPRITE}#al-icon-${name}`);
  svg.append(use);
  return svg;
}

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  node.append(...children);
  return node;
};

for (const pre of document.querySelectorAll(".site-prose pre")) {
  if (pre.closest(".al-code, .zt-mermaid")) continue;
  const code = pre.querySelector("code");
  const lang = pre.dataset.lang || code?.dataset.lang || "";
  const caption = lang === "plain" ? "" : lang;
  if (code && lang && !code.children.length) code.dataset.language = lang;
  pre.classList.add("al-code__pre");
  pre.setAttribute("dir", "ltr");
  pre.tabIndex = 0;
  if (!pre.hasAttribute("aria-label")) pre.setAttribute("aria-label", caption || say("code", "Code"));

  const copy = el("button", {
    type: "button",
    class: "al-button al-button--quiet al-button--sm al-code__copy",
    "data-copy": "",
    "data-label-copy": say("copy", "Copy"),
    "data-label-copied": say("copied", "Copied"),
    "data-label-failed": say("copy_failed", "Couldn't copy. The text is selected, so you can copy it yourself."),
  }, icon("copy", "al-code__copy-idle"), icon("check", "al-code__copy-done"), el("span", { "data-copy-label": "" }, say("copy", "Copy")));
  const bar = el("div", { class: "al-code__bar" });
  if (caption) bar.append(el("span", { class: "al-code__caption", dir: "ltr" }, caption));
  bar.append(copy);

  const block = el("div", { class: "al-code" });
  pre.replaceWith(block);
  block.append(bar, pre, el("span", { class: "al-visually-hidden", role: "status", "data-copy-status": "" }));
}
