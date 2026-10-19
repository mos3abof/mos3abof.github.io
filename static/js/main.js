const initFootnoteBacklinks = () => {
  document.querySelectorAll('sup.footnote-reference').forEach(sup => {
    const anchor = sup.querySelector('a');
    if (!anchor) return;
    const num = anchor.getAttribute('href').replace('#', '');
    sup.id = `fnref-${num}`;
  });

  document.querySelectorAll('sup.footnote-definition-label').forEach(sup => {
    const num = sup.textContent.trim();
    const link = document.createElement('a');
    link.href = `#fnref-${num}`;
    link.textContent = sup.textContent;
    link.setAttribute('aria-label', `Back to reference ${num}`);
    sup.textContent = '';
    sup.appendChild(link);
  });
}

document.addEventListener('DOMContentLoaded', initFootnoteBacklinks)
