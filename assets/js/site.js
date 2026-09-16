
const root = document.documentElement;
const nav = document.getElementById("navWrap");
const hero = document.getElementById("hero");
const project = document.getElementById("projectObject");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Nav */
function updateNav(){
  if(nav) nav.classList.toggle("scrolled", scrollY > 34);
}
updateNav();
addEventListener("scroll", updateNav, {passive:true});

/* Hero spotlight */
if(hero && !reduced && matchMedia("(pointer:fine)").matches){
  hero.addEventListener("pointermove", e=>{
    const r = hero.getBoundingClientRect();
    root.style.setProperty("--spot-x", ((e.clientX-r.left)/r.width*100)+"%");
    root.style.setProperty("--spot-y", ((e.clientY-r.top)/r.height*100)+"%");
  });
}

/* Project reveal */
if(project){
  project.addEventListener("pointermove", e=>{
    const r = project.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width;
    const y = (e.clientY-r.top)/r.height;
    project.style.setProperty("--reveal-x", (x*100)+"%");
    project.style.setProperty("--reveal-y", (y*100)+"%");
    if(!reduced && matchMedia("(pointer:fine)").matches){
      const rx = ((.5-y)*4)+3;
      const ry = ((x-.5)*7)-5;
      project.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(-1.2deg)`;
    }
  });
  project.addEventListener("pointerleave", ()=>{
    if(!reduced) project.style.transform = "rotateX(3deg) rotateY(-5deg) rotateZ(-1.2deg)";
  });
  project.addEventListener("click", ()=>project.classList.toggle("is-open"));
  project.addEventListener("keydown", e=>{
    if(e.key==="Enter" || e.key===" "){
      e.preventDefault();
      project.classList.toggle("is-open");
    }
  });
}

/* Survey cursor */
const core = document.getElementById("cursorCore");
const lens = document.getElementById("cursorLens");
const label = document.getElementById("cursorLabel");

if(core && lens && label && !reduced && matchMedia("(pointer:fine)").matches){
  let mx=innerWidth/2,my=innerHeight/2,lx=mx,ly=my;
  addEventListener("pointermove", e=>{
    mx=e.clientX; my=e.clientY;
    core.style.left=mx+"px"; core.style.top=my+"px";
    document.body.classList.add("cursor-ready");
  }, {passive:true});
  addEventListener("pointerleave", ()=>document.body.classList.remove("cursor-ready"));

  document.querySelectorAll("a,button,[data-cursor]").forEach(el=>{
    el.addEventListener("pointerenter", ()=>{
      lens.classList.add("active");
      const text = el.dataset.cursor || (el.tagName==="A" ? "OPEN" : "ACTION");
      label.textContent=text;
      label.classList.add("show");
    });
    el.addEventListener("pointerleave", ()=>{
      lens.classList.remove("active");
      label.classList.remove("show");
    });
  });

  (function loop(){
    lx += (mx-lx)*.16; ly += (my-ly)*.16;
    lens.style.left=lx+"px"; lens.style.top=ly+"px";
    label.style.left=lx+"px"; label.style.top=ly+"px";
    requestAnimationFrame(loop);
  })();
}

/* Reveal on scroll */
const revealItems = document.querySelectorAll(".reveal");
if("IntersectionObserver" in window && !reduced){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:"0px 0px -35px 0px"});
  revealItems.forEach(el=>io.observe(el));
}else{
  revealItems.forEach(el=>el.classList.add("visible"));
}

/* Loader */
const loader = document.getElementById("loader");
const fill = document.getElementById("loaderFill");
const pct = document.getElementById("loaderPct");
if(loader){
  let v=0;
  const timer=setInterval(()=>{
    v=Math.min(94, v + Math.max(1, Math.ceil((94-v)*.13)));
    if(fill) fill.style.width=v+"%";
    if(pct) pct.textContent=String(v).padStart(2,"0")+"%";
  },55);

  addEventListener("load", ()=>{
    clearInterval(timer);
    let end=v;
    const finish=setInterval(()=>{
      end=Math.min(100,end+4);
      if(fill) fill.style.width=end+"%";
      if(pct) pct.textContent=String(end).padStart(2,"0")+"%";
      if(end>=100){
        clearInterval(finish);
        setTimeout(()=>loader.classList.add("done"), reduced?0:230);
      }
    },25);
  });
  setTimeout(()=>loader.classList.add("done"),3000);
}

/* Copy email if present */
const copyEmail=document.getElementById("copyEmail");
if(copyEmail){
  copyEmail.addEventListener("click", async ()=>{
    try{
      await navigator.clipboard.writeText("mirzaadc@gmail.com");
      copyEmail.textContent="Copied";
      setTimeout(()=>copyEmail.textContent="Copy email",1300);
    }catch{
      location.href="mailto:mirzaadc@gmail.com";
    }
  });
}
