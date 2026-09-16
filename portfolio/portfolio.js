
const root = document.documentElement;
const loader = document.getElementById("loader");
const loaderValue = document.getElementById("loaderPct");
const loaderFill = document.getElementById("loaderFill");
const navWrap = document.getElementById("navWrap");
const hero = document.getElementById("hero");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Loader */
if(loader){
  let value = 0;
  const timer = setInterval(() => {
    value = Math.min(95, value + Math.max(1, Math.ceil((95 - value) * .14)));
    if(loaderValue) loaderValue.textContent = String(value).padStart(2,"0") + "%";
    if(loaderFill) loaderFill.style.width = value + "%";
  }, 55);

  addEventListener("load", () => {
    clearInterval(timer);
    let v = value;
    const finish = setInterval(() => {
      v = Math.min(100, v + 4);
      if(loaderValue) loaderValue.textContent = String(v).padStart(2,"0") + "%";
      if(loaderFill) loaderFill.style.width = v + "%";
      if(v >= 100){
        clearInterval(finish);
        setTimeout(() => loader.classList.add("done"), reducedMotion ? 0 : 220);
      }
    }, 24);
  });

  setTimeout(() => loader.classList.add("done"), 3000);
}

/* Nav glass */
function updateNav(){
  if(navWrap) navWrap.classList.toggle("scrolled", scrollY > 34);
}
updateNav();
addEventListener("scroll", updateNav, {passive:true});

/* Hero site-light */
if(hero && !reducedMotion && matchMedia("(pointer:fine)").matches){
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    root.style.setProperty("--spot-x", ((e.clientX-r.left)/r.width*100)+"%");
    root.style.setProperty("--spot-y", ((e.clientY-r.top)/r.height*100)+"%");
  });
}

/* Existing site-style survey cursor */
const core = document.getElementById("cursorCore");
const lens = document.getElementById("cursorLens");
const label = document.getElementById("cursorLabel");

if(core && lens && label && !reducedMotion && matchMedia("(pointer:fine)").matches){
  let mx = innerWidth/2, my = innerHeight/2, lx = mx, ly = my;

  addEventListener("pointermove", e => {
    mx=e.clientX; my=e.clientY;
    core.style.left=mx+"px";
    core.style.top=my+"px";
    document.body.classList.add("cursor-ready");
  }, {passive:true});

  addEventListener("pointerleave", () => document.body.classList.remove("cursor-ready"));

  document.querySelectorAll("a,button,[data-cursor]").forEach(el => {
    el.addEventListener("pointerenter", () => {
      lens.classList.add("active");
      label.textContent = el.dataset.cursor || (el.tagName === "A" ? "OPEN" : "ACTION");
      label.classList.add("show");
    });
    el.addEventListener("pointerleave", () => {
      lens.classList.remove("active");
      label.classList.remove("show");
    });
  });

  (function loop(){
    lx += (mx-lx)*.16;
    ly += (my-ly)*.16;
    lens.style.left=lx+"px";
    lens.style.top=ly+"px";
    label.style.left=lx+"px";
    label.style.top=ly+"px";
    requestAnimationFrame(loop);
  })();
}

/* Scroll reveal */
const revealItems = document.querySelectorAll(".reveal");
if("IntersectionObserver" in window && !reducedMotion){
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:"0px 0px -35px 0px"});

  revealItems.forEach(el => io.observe(el));
}else{
  revealItems.forEach(el => el.classList.add("visible"));
}

/* Project image lightbox */
const lightbox = document.getElementById("portfolioLightbox");
if(lightbox){
  const image = lightbox.querySelector("img");
  document.querySelectorAll("[data-lightbox]").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      image.src = item.href;
      lightbox.classList.add("open");
    });
  });

  lightbox.addEventListener("click", e => {
    if(e.target === lightbox || e.target.closest("[data-close-lightbox]")){
      lightbox.classList.remove("open");
      image.removeAttribute("src");
    }
  });

  addEventListener("keydown", e => {
    if(e.key === "Escape"){
      lightbox.classList.remove("open");
      image.removeAttribute("src");
    }
  });
}
