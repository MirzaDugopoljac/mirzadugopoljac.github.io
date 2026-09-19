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
    let opener,index=0,startX=0;
    const image=dialog.querySelector('img');
    const controls=document.createElement('div');controls.className='gallery-controls';
    controls.innerHTML='<button type="button" data-prev aria-label="Previous image">←</button><span class="gallery-status" aria-live="polite"></span><button type="button" data-next aria-label="Next image">→</button>';
    dialog.append(controls);
    const links=()=>[...document.querySelectorAll('[data-lightbox]')];
    function show(next){const items=links();index=(next+items.length)%items.length;image.src=items[index].href;image.alt=items[index].querySelector('img')?.alt||'';controls.querySelector('.gallery-status').textContent=`${String(index+1).padStart(2,'0')} / ${items.length} — ${image.alt}`;}
    document.addEventListener('click',event=>{const link=event.target.closest('[data-lightbox]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();opener=link;show(links().indexOf(link));dialog.showModal();document.body.style.overflow='hidden';});
    controls.querySelector('[data-prev]').addEventListener('click',()=>show(index-1));controls.querySelector('[data-next]').addEventListener('click',()=>show(index+1));
    dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();show(index+1);}if(event.key==='ArrowLeft'){event.preventDefault();show(index-1);}});
    image.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;},{passive:true});image.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>60)show(index+(dx<0?1:-1));},{passive:true});
    dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
    dialog.addEventListener('close',()=>{image.removeAttribute('src');document.body.style.overflow='';opener?.focus();});
  }
})();
