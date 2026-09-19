(() => {
  const list = document.getElementById('homeProjects');
  if (!list) return;
  const tabs = [...document.querySelectorAll('[data-layer]')];
  const layers = {
    plan: {image:'square-plan-1.webp',slug:'urban-square'},
    experience: {image:'square-render-2.webp',slug:'urban-square'},
    analysis: {image:'planning-natural-1.webp',slug:'urban-landscape-planning'}
  };
  let active = 'plan';
  function renderLayer() {
    const lang = window.siteLang();
    const layer = layers[active];
    const project = window.PROJECTS.find(p=>p.slug===layer.slug);
    const image = document.getElementById('layerImage');
    image.src = 'assets/img/'+layer.image;
    image.alt = project.title[lang]+' â€” '+window.trText('ed.'+active);
    document.getElementById('layerProject').textContent=project.title[lang];
    document.getElementById('layerCode').textContent='MDâ€”'+project.num;
    document.getElementById('layerCase').href='portfolio/projects/'+layer.slug+'.html';
    document.getElementById('layerLink').href='portfolio/projects/'+layer.slug+'.html';
    document.getElementById('layer-panel').setAttribute('aria-labelledby','tab-'+active);
    for (const [id,suffix] of [['layerLabel','Label'],['layerTitle','Title'],['layerCopy','Copy']]) {
      const el=document.getElementById(id);
      el.dataset.i18n='ed.'+active+suffix;
      el.textContent=window.trText(el.dataset.i18n);
    }
    tabs.forEach(tab=>{
      const selected=tab.dataset.layer===active;
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    });
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>{active=tab.dataset.layer;renderLayer();});
    tab.addEventListener('keydown',event=>{
      let next=index;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=tabs.length-1;
      else return;
      event.preventDefault();active=tabs[next].dataset.layer;renderLayer();tabs[next].focus();
    });
  });
  function render() {
    const lang=window.siteLang();
    list.innerHTML=['gemlik','urban-square','urban-landscape-planning','collective-housing'].map(slug=>{
      const p=window.PROJECTS.find(project=>project.slug===slug);
      return `<article class="work-record"><div class="record-meta"><span>P-${p.num}</span><span>${p.context[lang]}</span><span>${p.category[lang]}</span></div><a class="record-image" href="portfolio/projects/${p.slug}.html"><img src="assets/img/${p.cover}" ${p.slug==='gemlik' ? `srcset="assets/img/gemlik-09-800.webp 800w, assets/img/gemlik-09.webp 1600w" sizes="90vw"` : ''} alt="${p.title[lang]}" loading="lazy" width="1400" height="900"><span class="image-cross" aria-hidden="true">+</span></a><div class="record-description"><h3><a href="portfolio/projects/${p.slug}.html">${p.title[lang]}</a></h3><p>${p.desc[lang]}</p><a class="text-link" href="portfolio/projects/${p.slug}.html">${window.trText('ed.case')}</a></div></article>`;
    }).join('');
    document.querySelectorAll('[data-note-title]').forEach(el=>{
      const p=window.PROJECTS.find(project=>project.slug===el.dataset.noteTitle);
      el.textContent=p.title[lang];
    });
    document.querySelectorAll('[data-note-copy]').forEach(el=>{
      const p=window.PROJECTS.find(project=>project.slug===el.dataset.noteCopy);
      el.textContent=p.story[lang];
    });
    document.querySelectorAll('[data-note-meta]').forEach(el=>{
      const p=window.PROJECTS.find(project=>project.slug===el.dataset.noteMeta);
      el.textContent='P-'+p.num+' / '+p.category[lang];
    });
    renderLayer();
  }
  render();
  document.addEventListener('languagechange',render);
})();
