(() => {
  const list=document.getElementById('projectList');
  function render(){const lang=window.siteLang();list.innerHTML=window.PROJECTS.map(p=>`<a class="project-card reveal visible" href="projects/${p.slug}.html" data-transition data-cursor="PROJECT"><div class="project-copy"><small>${p.num} / ${p.category[lang]}</small><h3>${p.title[lang]}</h3><p>${p.desc[lang]}</p></div><div class="project-media"><img src="../assets/img/${p.cover}" alt="${p.title[lang]}"></div><span class="project-num">${p.num}</span></a>`).join('');}
  render(); document.addEventListener('languagechange',render);
})();
