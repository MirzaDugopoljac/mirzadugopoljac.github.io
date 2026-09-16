(() => {
  const body = document.body;
  const root = body.dataset.root || './';
  const active = body.dataset.active || '';
  const logo = `${root}assets/brand/logo-monogram.png`;

  const incoming = sessionStorage.getItem('mirza-transition') === '1';
  const incomingLabel = sessionStorage.getItem('mirza-transition-label') || 'Mirza Dugopoljac';

  if (incoming) body.classList.add('page-arriving');

  const nav = `
  <div class="nav-wrap" id="navWrap">
    <nav class="nav shell">
      <a class="brand" href="${root}index.html" data-cursor="HOME">
        <img src="${logo}" alt="Mirza Dugopoljac logo">
        <span>Mirza Dugopoljac</span>
      </a>

      <div class="nav-right">
        <div class="nav-links">
          <a class="${active==='work'?'active':''}" href="${root}portfolio/index.html" data-i18n="nav.work" data-cursor="WORK"></a>
          <a class="${active==='about'?'active':''}" href="${root}about.html" data-i18n="nav.about" data-cursor="ABOUT"></a>
          <a href="https://github.com/MirzaDugopoljac" target="_blank" rel="noopener">GitHub</a>
          <a class="nav-cta ${active==='contact'?'active':''}" href="${root}contact.html" data-i18n="nav.contact" data-cursor="CONTACT"></a>
        </div>

        <div class="lang" aria-label="Language">
          <button data-lang="en">EN</button>
          <button data-lang="tr">TR</button>
          <button data-lang="bs">BS</button>
        </div>
      </div>
    </nav>
  </div>`;

  const loader = active === 'home' && !incoming ? `
  <div class="loader" id="loader" aria-hidden="true">
    <div class="loader-clay"></div>
    <div class="loader-box">
      <div class="loader-row">
        <div class="loader-brand">
          <img src="${logo}" alt="">
          <strong>Mirza Dugopoljac</strong>
        </div>
        <span>Landscape Architecture</span>
      </div>

      <div class="loader-number" id="loaderPct">00%</div>
      <div class="loader-bar"><div class="loader-fill" id="loaderFill"></div></div>
      <div class="loader-foot">
        <span>Loading site</span>
        <span>2026</span>
      </div>
    </div>
  </div>` : '';

  if (active === 'home' && !incoming) body.classList.add('page-arriving', 'home-loading');

  const cursor = `
  <div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>
  <div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
  <div class="cursor-label" id="cursorLabel" aria-hidden="true"></div>`;

  const transition = `
  <div class="transition ${incoming ? 'incoming' : ''}" id="pageTransition" aria-hidden="true">
    <div class="transition-clay"></div>
    <div class="transition-inner">
      <img src="${logo}" alt="">
      <span>Mirza Dugopoljac</span>
      <strong id="transitionLabel">${incomingLabel}</strong>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', transition + loader + nav + cursor);
})();