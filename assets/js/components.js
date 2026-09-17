(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-right');
  function closeMenu() {
    toggle?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('open');
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu(); toggle.focus();
    }
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
})();
