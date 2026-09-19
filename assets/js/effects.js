/* Framework-free loading, particle typography, terrain-aware navigation and tilt. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer:fine)');
  const lang = window.siteLang?.() || 'en';
  const words = {
    en: ['Reading the landscape.', 'Preparing the portfolio', 'Skip introduction', 'LAND / WATER / LIFE'],
    tr: ['Peyzajı okumak.', 'Portfolyo hazırlanıyor', 'Girişi atla', 'ARAZİ / SU / YAŞAM'],
    bs: ['Čitanje pejzaža.', 'Priprema portfolija', 'Preskoči uvod', 'TLO / VODA / ŽIVOT']
  }[lang];
  const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));

  function assembleHeadline() {
    const heading=document.querySelector('.home-hero h1');
    if (!heading || reduced.matches || document.hidden) return;
    const rect=heading.getBoundingClientRect(), style=getComputedStyle(heading);
    const mask=document.createElement('canvas'); mask.width=Math.ceil(rect.width); mask.height=Math.ceil(rect.height);
    const sample=mask.getContext('2d',{willReadFrequently:true});
    if(!sample)return;
    sample.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    if ('letterSpacing' in sample) sample.letterSpacing=style.letterSpacing;
    sample.textBaseline='top';sample.fillStyle='#fff';
    let y=0;
    const lineHeight=parseFloat(style.lineHeight);
    for(const paragraph of heading.innerText.split('\n')){
      let line='';
      for(const word of paragraph.split(' ')){
        const candidate=line?line+' '+word:word;
        if(line && sample.measureText(candidate).width>rect.width){sample.fillText(line,0,y);y+=lineHeight;line=word;}else line=candidate;
      }
      sample.fillText(line,0,y);y+=lineHeight;
    }
    const data=sample.getImageData(0,0,mask.width,mask.height).data,points=[];
    for(let py=0;py<mask.height;py+=5)for(let px=0;px<mask.width;px+=5){
      if(data[(py*mask.width+px)*4+3]>100)points.push({x:px,y:py,dx:(Math.random()-.5)*160,dy:(Math.random()-.5)*120});
    }
    const canvas=document.createElement('canvas');canvas.className='headline-particles';canvas.setAttribute('aria-hidden','true');
    canvas.width=mask.width;canvas.height=mask.height;
    const ctx=canvas.getContext('2d');if(!ctx)return;
    heading.classList.add('assembling');heading.append(canvas);
    const start=performance.now();
    const cleanup=()=>{canvas.remove();heading.classList.remove('assembling');};
    function draw(now){
      const t=Math.min(1,(now-start)/850),ease=1-Math.pow(1-t,3);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#cfddba';ctx.globalAlpha=t>.8?(1-t)/.2:1;
      for(const p of points)ctx.fillRect(p.x+p.dx*(1-ease),p.y+p.dy*(1-ease),2.5,2.5);
      if(t<1&&!reduced.matches)requestAnimationFrame(draw);else cleanup();
    }
    requestAnimationFrame(draw);setTimeout(cleanup,1100);
  }

  async function homeIntro(){
    if(document.body.dataset.active!=='home')return;
    // Returning through browser history should restore the page, not replay an intro.
    if(performance.getEntriesByType('navigation')[0]?.type==='back_forward')return;
    const loader=document.createElement('div');loader.className='home-loader';
    loader.innerHTML=`<span class="loader-brand">Mirza Dugopoljac / Portfolio</span><div class="loader-topography" aria-hidden="true">${[0,1,2,3,4].map(n=>`<i style="--ring:${n}"></i>`).join('')}<strong>MD</strong></div><span class="loader-caption">${words[1]}</span><p class="loader-title">${words[0]}</p><div class="loader-track" role="progressbar" aria-label="${words[1]}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><button class="loader-skip">${words[2]} ↗</button><span class="loader-foot">${words[3]}</span>`;
    document.body.prepend(loader);
    const content=[document.querySelector('.nav-wrap'),document.querySelector('main')].filter(Boolean);
    content.forEach(el=>{el.inert=true;});
    const previousFocus=document.activeElement;
    const skip=loader.querySelector('button');skip.focus({preventScroll:true});
    let closed=false,completed=0;
    function finish(){
      if(closed)return;closed=true;
      loader.querySelector('[role=progressbar]').setAttribute('aria-valuenow','100');
      loader.querySelector('.loader-track span').style.width='100%';
      content.forEach(el=>{el.inert=false;});
      loader.classList.add('is-leaving');
      if(document.activeElement===skip){
        if(previousFocus && previousFocus!==document.body)previousFocus.focus({preventScroll:true});
        else document.querySelector('.brand')?.focus({preventScroll:true});
      }
      setTimeout(()=>{loader.remove();assembleHeadline();},reduced.matches?0:400);
    }
    skip.addEventListener('click',finish);
    loader.addEventListener('keydown',event=>{if(event.key==='Escape')finish();});
    const image=document.getElementById('layerImage');
    const jobs=[document.fonts?.ready||Promise.resolve(),image?.decode?.().catch(()=>{})||Promise.resolve()];
    const assets=Promise.all(jobs.map(job=>Promise.resolve(job).finally(()=>{
      if(closed)return;completed++;
      const percent=Math.round(completed/jobs.length*100);
      loader.querySelector('[role=progressbar]').setAttribute('aria-valuenow',String(percent));
      loader.querySelector('.loader-track span').style.width=percent+'%';
    })));
    try {
      await Promise.race([Promise.all([assets,sleep(reduced.matches?0:1100)]),sleep(3200)]);
    } finally {
      finish();
    }
  }
  // Content is available immediately; no mandatory loading sequence.

  const stage=document.querySelector('.layer-stage');
  stage?.addEventListener('pointermove',event=>{
    if(reduced.matches||!fine.matches)return;
    const box=stage.getBoundingClientRect();
    stage.style.setProperty('--tilt-x',((.5-(event.clientY-box.top)/box.height)*12)+'deg');
    stage.style.setProperty('--tilt-y',(((event.clientX-box.left)/box.width-.5)*16)+'deg');
  });
  stage?.addEventListener('pointerleave',()=>{stage.style.setProperty('--tilt-x','0deg');stage.style.setProperty('--tilt-y','0deg');});
  if(!reduced.matches && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:.06});
    document.querySelectorAll('.proof-strip,.door,.capability,.work-record,.project-note').forEach(el=>{
      if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal-ready');observer.observe(el);}
    });
    reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible'));}});
  }


})();
