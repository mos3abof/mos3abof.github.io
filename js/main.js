const initApp = () => {
  const hamburgerBtn = document.getElementById('hamburger-button')
  const mobileMenu = document.getElementById('mobile-menu')
  const themeToggleBtn = document.getElementById('theme-toggle')

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.toggle('hidden') === false
    mobileMenu.classList.toggle('flex', isOpen)
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen))
  }

  hamburgerBtn.addEventListener('click', toggleMenu)
  mobileMenu.addEventListener('click', toggleMenu)

  themeToggleBtn.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('color-theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('color-theme', 'dark')
    }
  })
}

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

document.addEventListener('DOMContentLoaded', initApp)
document.addEventListener('DOMContentLoaded', initFootnoteBacklinks)
