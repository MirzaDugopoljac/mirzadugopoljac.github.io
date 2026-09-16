(() => {
  const I18N = window.I18N || {};
  const $ = (s,c=document) => c.querySelector(s);
  const $$ = (s,c=document) => [...c.querySelectorAll(s)];

  let lang = ['en','tr','bs'].includes(localStorage.getItem('mirza-lang'))
    ? localStorage.getItem('mirza-lang')
    : 'en';

  window.siteLang = () => lang;
  window.trText = key => I18N[key]?.[lang] ?? key;

  function applyLang(next){
    lang = next;
    localStorage.setItem('mirza-lang', lang);
    document.documentElement.lang = lang;

    $$('[data-i18n]').forEach(el => {
      const value = I18N[el.dataset.i18n]?.[lang];
      if (value !== undefined) el.innerHTML = value;
    });

    $$('[data-lang]').forEach(button => {
      button.classList.toggle('active', button.dataset.lang === lang);
    });

    const titleKey = document.body.dataset.titleKey;
    if (titleKey && I18N[titleKey]?.[lang]) {
      document.title = I18N[titleKey][lang];
    }

    document.dispatchEvent(new CustomEvent('languagechange', { detail:{ lang } }));
  }

  window.applyLang = applyLang;
  $$('[data-lang]').forEach(button => {
    button.addEventListener('click', () => applyLang(button.dataset.lang));
  });
  applyLang(lang);

  /* ---------------------------------------------------------
     NAV + HERO LIGHT
  --------------------------------------------------------- */
  const nav = $('#navWrap');
  const hero = $('.hero');

  const updateNav = () => nav?.classList.toggle('scrolled', scrollY > 30);
  updateNav();
  addEventListener('scroll', updateNav, { passive:true });

  if (hero && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      document.documentElement.style.setProperty(
        '--spot-x',
        ((event.clientX - rect.left) / rect.width * 100) + '%'
      );
      document.documentElement.style.setProperty(
        '--spot-y',
        ((event.clientY - rect.top) / rect.height * 100) + '%'
      );
    });
  }

  /* ---------------------------------------------------------
     HOME-ONLY LOADER
     It visibly climbs 00 → 100, then reveals the home hero.
  --------------------------------------------------------- */
  const loader = $('#loader');
  const fill = $('#loaderFill');
  const pct = $('#loaderPct');

  function finishHomeEntry(){
    document.body.classList.remove('home-loading');
    requestAnimationFrame(() => {
      document.body.classList.add('page-entered');
      setTimeout(() => document.body.classList.remove('page-arriving'), 850);
    });
  }

  if (loader && fill && pct) {
    let progress = 0;
    let pageLoaded = document.readyState === 'complete';

    if (!pageLoaded) {
      addEventListener('load', () => { pageLoaded = true; }, { once:true });
    }

    const tick = setInterval(() => {
      if (progress < 92) {
        progress += progress < 55 ? 2 : 1;
      } else if (pageLoaded && progress < 100) {
        progress += 1;
      }

      progress = Math.min(progress, 100);
      pct.textContent = String(progress).padStart(2,'0') + '%';
      fill.style.width = progress + '%';

      if (progress >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          loader.classList.add('done');
          finishHomeEntry();
        }, 220);
      }
    }, 24);

    /* Failsafe: complete gracefully even if a remote font stalls. */
    setTimeout(() => {
      pageLoaded = true;
    }, 2300);
  }

  /* ---------------------------------------------------------
     SEAMLESS PAGE TRANSITIONS
     All internal HTML navigation uses the same transition,
     whether or not data-transition was manually added.
  --------------------------------------------------------- */
  const transition = $('#pageTransition');
  document.documentElement.classList.remove('transition-pending');
  const transitionLabel = $('#transitionLabel');
  const arrivedFromTransition = transition?.classList.contains('incoming');

  if (arrivedFromTransition) {
    sessionStorage.removeItem('mirza-transition');
    sessionStorage.removeItem('mirza-transition-label');

    requestAnimationFrame(() => {
      transition.classList.add('exit');

      setTimeout(() => {
        document.body.classList.add('page-entered');
      }, 100);

      setTimeout(() => {
        transition.classList.remove('incoming', 'exit');
        document.body.classList.remove('page-arriving');
      }, 720);
    });
  } else if (!loader) {
    /* Direct visit to a non-home page: still give the page a subtle entrance. */
    document.body.classList.add('page-arriving');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.add('page-entered'));
    });
    setTimeout(() => document.body.classList.remove('page-arriving'), 850);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;

    /* Same-page anchors should scroll normally. */
    if (url.pathname === location.pathname && url.hash) return;

    /* PDFs/files should open normally. */
    if (/\.(pdf|zip|jpg|jpeg|png|webp|svg)$/i.test(url.pathname)) return;

    event.preventDefault();

    const rawLabel =
      link.textContent.trim().replace(/\s+/g,' ').replace(/[↗→↓]/g,'').trim() ||
      'Next page';

    sessionStorage.setItem('mirza-transition', '1');
    sessionStorage.setItem('mirza-transition-label', rawLabel);

    if (transitionLabel) transitionLabel.textContent = rawLabel;
    transition?.classList.remove('incoming', 'exit');
    transition?.classList.add('active');

    setTimeout(() => {
      location.href = url.href;
    }, 500);
  });

  addEventListener('pageshow', () => {
    transition?.classList.remove('active');
  });

  /* ---------------------------------------------------------
     CURSOR
     The complete cursor graphic stays ON the pointer.
     No delayed follower / interpolation.
  --------------------------------------------------------- */
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  const cursorLabel = $('#cursorLabel');

  if (dot && ring && cursorLabel && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', event => {
      const x = event.clientX;
      const y = event.clientY;

      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';
      cursorLabel.style.left = x + 'px';
      cursorLabel.style.top = y + 'px';

      document.body.classList.add('cursor-ready');
    }, { passive:true });

    addEventListener('pointerleave', () => {
      document.body.classList.remove('cursor-ready');
    });

    document.addEventListener('pointerover', event => {
      const el = event.target.closest('a,button,[data-cursor]');
      if (!el) return;

      ring.classList.add('active');
      dot.classList.add('active');

      cursorLabel.textContent = el.dataset.cursor || 'OPEN';
      cursorLabel.classList.add('show');
    });

    document.addEventListener('pointerout', event => {
      const from = event.target.closest?.('a,button,[data-cursor]');
      if (!from) return;

      const to = event.relatedTarget?.closest?.('a,button,[data-cursor]');
      if (from === to) return;

      ring.classList.remove('active');
      dot.classList.remove('active');
      cursorLabel.classList.remove('show');
    });
  }

  /* ---------------------------------------------------------
     SCROLL REVEALS — stronger pop for text and imagery
  --------------------------------------------------------- */
  const reveal = $$('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold:.10,
      rootMargin:'0px 0px -30px 0px'
    });

    reveal.forEach(item => observer.observe(item));
  } else {
    reveal.forEach(item => item.classList.add('visible'));
  }

  /* ---------------------------------------------------------
     UTILITIES
  --------------------------------------------------------- */
  const copy = $('#copyEmail');

  if (copy) {
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('mirzaadc@gmail.com');
        const old = copy.textContent;
        copy.textContent = lang === 'tr' ? 'Kopyalandı' : lang === 'bs' ? 'Kopirano' : 'Copied';
        setTimeout(() => copy.textContent = old, 1200);
      } catch {
        location.href = 'mailto:mirzaadc@gmail.com';
      }
    });
  }

  const box = $('#lightbox');

  if (box) {
    const image = $('img', box);

    document.addEventListener('click', event => {
      const link = event.target.closest('[data-lightbox]');
      if (!link) return;

      event.preventDefault();
      image.src = link.href;
      box.classList.add('open');
    });

    box.addEventListener('click', event => {
      if (event.target === box || event.target.closest('[data-close]')) {
        box.classList.remove('open');
      }
    });

    addEventListener('keydown', event => {
      if (event.key === 'Escape') box.classList.remove('open');
    });
  }
})();