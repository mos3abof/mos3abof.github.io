// On a page with extra.tufte = true (templates/page.html): its footnotes
// become sidenotes, as components/tufte.html's sidenote writes them, so they
// sit in the margin beside their line (css/tufte.css). Each reference gets
// its note; the list at the end goes once every footnote in it has been
// moved. Without this script, the footnotes stay at the end, as anywhere else.

const strings = (() => {
  try { return JSON.parse(document.getElementById("zt-strings")?.textContent || "{}"); } catch { return {}; }
})();

// The note's text: the footnote's, less its links back, its paragraphs as
// spans (a note sits inside the paragraph that refers to it).
function noteText(item) {
  const text = document.createElement("span");
  text.className = "tf-note__text";
  for (const child of item.children) {
    const part = child.cloneNode(true);
    part.querySelectorAll('a[href*="#fr-"]').forEach((a) => a.remove());
    if (part.tagName === "P") {
      const para = document.createElement("span");
      para.className = "tf-note__para";
      para.append(...part.childNodes);
      text.append(para);
    } else {
      text.append(part);
    }
  }
  return text;
}

function sidenote(item) {
  const note = document.createElement("span");
  note.className = "tf-note tf-note--side";
  const ref = document.createElement("label");
  ref.className = "tf-note__ref";
  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.className = "tf-note__toggle";
  toggle.setAttribute("aria-label", strings.sidenote_toggle || "Show the note");
  ref.append(toggle);
  note.append(ref, noteText(item));
  return note;
}

function footnotesToSidenotes() {
  const prose = document.querySelector(".site-doc--tufte .zt-prose");
  if (!prose) return;
  const moved = new Set();
  prose.querySelectorAll("sup.footnote-reference").forEach((sup) => {
    const href = sup.querySelector("a")?.getAttribute("href") || "";
    const id = decodeURIComponent(href.slice(href.indexOf("#") + 1));
    const item = id && document.getElementById(id);
    if (!item || !item.closest(".footnotes")) return;
    const note = sidenote(item);
    if (sup.id) note.id = sup.id; // links to the reference still land on it
    // Trailing space before the reference would leave a gap before the number.
    const before = sup.previousSibling;
    if (before?.nodeType === Node.TEXT_NODE) before.textContent = before.textContent.replace(/\s+$/, "");
    sup.replaceWith(note);
    moved.add(item);
  });
  // A citation in the title (extra.title) links to its note, now in the text.
  document.querySelectorAll("#zt-title sup.footnote-reference a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const id = decodeURIComponent(href.slice(href.indexOf("#") + 1));
    const ref = [...prose.querySelectorAll(".tf-note[id]")].find((n) => n.id.startsWith(`fr-${id.slice(3)}-`));
    if (ref) a.setAttribute("href", "#" + ref.id);
  });
  const list = prose.querySelector(".footnotes");
  if (list && [...list.querySelectorAll("li[id]")].every((li) => moved.has(li))) list.hidden = true;
}

footnotesToSidenotes();
