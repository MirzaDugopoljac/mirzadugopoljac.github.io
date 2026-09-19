(() => {
  const list = document.getElementById('projectList');
  if (!list) return;
  let selected = 'all';
  const groups = {
    landscape: ['urban-square', 'collective-housing', 'single-residence', 'gemlik'],
    planning: ['urban-landscape-planning'],
    detail: ['interactive-seating']
  };
  function render() {
    const lang = window.siteLang();
    const projects = window.PROJECTS.filter(p => selected === 'all' || groups[selected].includes(p.slug));
    list.innerHTML = projects.map(p => `<a class="project-card" href="projects/${p.slug}.html"><div class="project-media"><img src="../assets/img/${p.cover}" ${p.slug==='gemlik' ? `srcset="../assets/img/gemlik-09-800.webp 800w, ../assets/img/gemlik-09.webp 1600w" sizes="(max-width:760px) 90vw, 60vw"` : ''} alt="${p.title[lang]}" loading="lazy" width="1200" height="800"></div><div class="project-copy"><small>${p.num} / ${p.category[lang]}</small><h3>${p.title[lang]}<span aria-hidden="true">â†—</span></h3><p>${p.desc[lang]}</p></div></a>`).join('');
    document.getElementById('projectCount').textContent = `${projects.length} / ${window.PROJECTS.length}`;
  }
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      selected = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      render();
    });
  });
  render(); document.addEventListener('languagechange', render);
})();
