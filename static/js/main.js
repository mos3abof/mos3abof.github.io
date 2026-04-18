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

document.addEventListener('DOMContentLoaded', initApp)
