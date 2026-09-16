(() => {
  const slug=document.body.dataset.project;
  const p=window.PROJECTS.find(x=>x.slug===slug); if(!p)return;
  const next=window.PROJECTS[(window.PROJECTS.indexOf(p)+1)%window.PROJECTS.length];
  const root='../../';
  function render(){const l=window.siteLang();
    document.title=p.title[l]+' | Mirza Dugopoljac';
    document.getElementById('caseKicker').textContent=p.num+' / '+p.category[l];
    document.getElementById('caseTitle').textContent=p.title[l];
    document.getElementById('caseDesc').textContent=p.desc[l];
    document.getElementById('caseCover').src=root+'assets/img/'+p.cover;
    document.getElementById('metaType').textContent=p.category[l];
    document.getElementById('metaContext').textContent=p.context[l];
    document.getElementById('metaFocus').textContent=p.focus[l];
    document.getElementById('storyText').textContent=p.story[l];
    document.getElementById('gallery').innerHTML=p.gallery.map(([img,cap])=>`<a href="${root}assets/img/${img}" data-lightbox data-cursor="VIEW"><img src="${root}assets/img/${img}" alt="${cap[l]}"><span class="caption">${cap[l]}</span></a>`).join('');
    const nextLink=document.getElementById('nextProject'); nextLink.href=next.slug+'.html'; document.getElementById('nextTitle').textContent=next.title[l];
  }
  render(); document.addEventListener('languagechange',render);
})();
