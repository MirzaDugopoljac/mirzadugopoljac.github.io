(() => {
  let lang = 'en';
  try { lang = localStorage.getItem('mirza-lang') || 'en'; } catch {}
  window.siteLang = () => lang;
  window.trText = key => window.I18N[key]?.[lang] ?? key;
  function applyLang(next) {
    lang = ['en', 'tr', 'bs'].includes(next) ? next : 'en';
    try { localStorage.setItem('mirza-lang', lang); } catch {}
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const text = window.I18N[el.dataset.i18n]?.[lang];
      if (text !== undefined) el.innerHTML = text;
    });
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.classList.toggle('active', button.dataset.lang === lang);
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
    const title = window.I18N[document.body.dataset.titleKey]?.[lang];
    if (title) document.title = title;
    document.dispatchEvent(new CustomEvent('languagechange'));
  }
  window.applyLang = applyLang;
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => applyLang(button.dataset.lang));
  });
  applyLang(lang);
  const copy = document.getElementById('copyEmail');
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('mirzaadc@gmail.com');
      copy.textContent = {en:'Copied!', tr:'Kopyalandı!', bs:'Kopirano!'}[lang];
      setTimeout(() => { copy.textContent = window.trText('contact.copyButton'); }, 1800);
    } catch { location.href = 'mailto:mirzaadc@gmail.com'; }
  });
  const dialog = document.getElementById('lightbox');
  if (dialog) {
    let opener;
    const image = dialog.querySelector('img');
    document.addEventListener('click', event => {
      const link = event.target.closest('[data-lightbox]');
      if (!link) return;
      event.preventDefault(); opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt || '';
      dialog.showModal();
    });
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { image.removeAttribute('src'); opener?.focus(); });
  }
})();
