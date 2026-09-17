/* Decorative, illustrative contour field — not measured site or elevation data. */
(() => {
  const canvas = document.getElementById('terrainField');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const toggle = document.getElementById('fieldToggle');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = matchMedia('(max-width: 760px)');
  const finePointer = matchMedia('(pointer: fine)');
  let width = 0, height = 0, frame = 0, last = 0, time = 0;
  let paused = reduceMotion.matches || smallScreen.matches;
  let pointerX = .7, pointerY = .3, x = .7, y = .3;
  let visible = true;
  function label() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.dataset.i18n = paused ? 'ed.resume' : 'ed.pause';
    toggle.textContent = window.trText(toggle.dataset.i18n);
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const cx = width * (.72 + (x-.5)*.045);
    const cy = height * (.45 + (y-.5)*.07);
    const scale = Math.min(width, 1600);
    for (let line=0; line<38; line++) {
      ctx.beginPath();
      const radius = 42 + line * scale * .014;
      for (let point=0; point<=128; point++) {
        const angle = point / 128 * Math.PI * 2;
        const waviness = Math.sin(angle*3+line*.055+time*.00008)*.12 + Math.cos(angle*5-time*.00004)*.06;
        const r=radius*(1+waviness);
        const px=cx+Math.cos(angle)*r*1.6;
        const py=cy+Math.sin(angle)*r*.54+Math.sin(angle*2+line*.04)*24;
        if (!point) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.strokeStyle = line%5===0 ? 'rgba(208,165,118,.28)' : 'rgba(161,191,134,.14)';
      ctx.lineWidth = line%5===0 ? .9 : .55;
      ctx.stroke();
    }
    // Seeded survey points: stable across frames, with a slow luminous drift.
    for(let n=0;n<(smallScreen.matches?450:1800);n++) {
      let px=((n*7919)%2000)/2000*width;
      let py=height*.46+Math.sin(px/width*7+n*.023+time*.00009)*height*.19+((n*31)%180);
      const dx=px-pointerX*width,dy=py-pointerY*height,dist=Math.hypot(dx,dy);
      if(dist<120&&dist>0&&!paused){const push=(1-dist/120)*35;px+=dx/dist*push;py+=dy/dist*push;}
      const alpha=.13+(Math.sin(n+time*.0005)+1)*.12;
      ctx.fillStyle=n%3?`rgba(174,201,146,${alpha})`:`rgba(214,168,121,${alpha})`;
      ctx.fillRect(px,py,n%11===0?2:1,n%11===0?2:1);
    }
  }
  function loop(stamp) {
    frame=0;
    if (paused || !visible || document.hidden) return;
    if (stamp-last>40) {
      time+=Math.min(stamp-last,80); last=stamp;
      x+=(pointerX-x)*.08; y+=(pointerY-y)*.08; draw();
    }
    frame=requestAnimationFrame(loop);
  }
  function schedule() {
    cancelAnimationFrame(frame); frame=0;
    draw(); label();
    if (!paused && visible && !document.hidden) {last=performance.now(); frame=requestAnimationFrame(loop);}
  }
  function resize() {
    const box=canvas.getBoundingClientRect(); width=box.width; height=box.height;
    const ratio=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0); schedule();
  }
  window.addEventListener('pointermove', event => {
    if (paused || !finePointer.matches) return;
    const box=canvas.getBoundingClientRect();
    pointerX=(event.clientX-box.left)/box.width; pointerY=(event.clientY-box.top)/box.height;
  },{passive:true});
  toggle.addEventListener('click',()=>{paused=!paused;schedule();});
  reduceMotion.addEventListener('change',()=>{paused=reduceMotion.matches||smallScreen.matches;schedule();});
  smallScreen.addEventListener('change',()=>{paused=reduceMotion.matches||smallScreen.matches;schedule();});
  document.addEventListener('visibilitychange',schedule);
  document.addEventListener('languagechange',label);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();}).observe(canvas);
  resize();
})();
