(() => {
  const list=document.getElementById('homeProjects');
  if(!list)return;
  function render(){
    const l=window.siteLang();
    list.innerHTML=window.PROJECTS.slice(0,3).map(p=>`<a class="project-card reveal visible" href="portfolio/projects/${p.slug}.html" data-transition data-cursor="PROJECT"><div class="project-copy"><small>${p.num} / ${p.category[l]}</small><h3>${p.title[l]}</h3><p>${p.desc[l]}</p></div><div class="project-media"><img src="assets/img/${p.cover}" alt="${p.title[l]}"></div><span class="project-num">${p.num}</span></a>`).join('');
  }
  render(); document.addEventListener('languagechange',render);
})();
