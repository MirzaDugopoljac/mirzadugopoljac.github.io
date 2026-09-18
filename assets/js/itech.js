(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const page=document.querySelector('.itech-page'),button=document.getElementById('itech-motion');
 let paused=reduced.matches;
 function update(){page.classList.toggle('itech-paused',paused);button.setAttribute('aria-pressed',String(paused));button.dataset.i18n=paused?'it.resume':'it.pause';button.textContent=window.trText(button.dataset.i18n);}
 button.addEventListener('click',()=>{paused=!paused;update();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;update();});
 document.addEventListener('languagechange',update);update();
 if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.itech-project').forEach(el=>{el.classList.add('motion-ready');observer.observe(el);});}
})();
