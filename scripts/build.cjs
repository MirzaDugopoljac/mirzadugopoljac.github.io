// Regenerate the static pages after editing project data or translations.
const fs = require('node:fs');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
global.window = {};
require('../assets/js/i18n.js');
require('../assets/js/projects.js');
const t = window.I18N;
const additions = {
  'nav.ceramics': ['Çamurun Sırlı Hali', 'Çamurun Sırlı Hali', 'Çamurun Sırlı Hali'],
  'home.title': ['Places for people.<br><em>Room for nature.</em>', 'İnsanlar için mekân.<br><em>Doğaya yer aç.</em>', 'Prostori za ljude.<br><em>Mjesto za prirodu.</em>'],
  'home.copy': ['I’m <strong>Mirza Dugopoljac</strong>, a landscape architecture student at Bursa Uludağ University. I explore how thoughtful design can connect people, everyday life and the natural world.', 'Ben <strong>Mirza Dugopoljac</strong>, Bursa Uludağ Üniversitesi’nde peyzaj mimarlığı öğrencisiyim. Tasarımın insanları, gündelik yaşamı ve doğayı nasıl bir araya getirebileceğini araştırıyorum.', 'Ja sam <strong>Mirza Dugopoljac</strong>, student pejzažne arhitekture na Univerzitetu Bursa Uludağ. Istražujem kako promišljen dizajn povezuje ljude, svakodnevni život i prirodu.'],
  'new.selected': ['Selected work', 'Seçili projeler', 'Odabrani radovi'],
  'new.workTitle': ['Ideas grounded<br>in <em>place.</em>', 'Yerle bağ kuran<br><em>fikirler.</em>', 'Ideje ukorijenjene<br>u <em>prostoru.</em>'],
  'new.all': ['Explore all 7 projects ↗', '7 projenin tamamını incele ↗', 'Pogledaj svih 7 projekata ↗'],
  'new.cv': ['Download CV ↓', 'Özgeçmişi indir ↓', 'Preuzmi CV ↓'],
  'new.pdf': ['Portfolio PDF ↓', 'Portfolyo PDF ↓', 'Portfolio PDF ↓'],
  'new.intro': ['A little about me', 'Kısaca ben', 'Ukratko o meni'],
  'new.introTitle': ['From reading a landscape<br>to <em>shaping its future.</em>', 'Peyzajı okumaktan<br><em>geleceğini şekillendirmeye.</em>', 'Od razumijevanja pejzaža<br>do <em>oblikovanja budućnosti.</em>'],
  'new.talk': ['Let’s start<br><em>a conversation.</em>', 'Bir sohbetle<br><em>başlayalım.</em>', 'Započnimo<br><em>razgovor.</em>'],
  'new.talkText': ['Have a project, a collaboration or an opportunity in mind? I’d love to hear about it.', 'Bir proje, iş birliği veya fırsat hakkında konuşmak ister misiniz? Sizden haber almak isterim.', 'Imate projekat, saradnju ili priliku na umu? Volio bih čuti više.'],
  'new.email': ['Get in touch ↗', 'İletişime geç ↗', 'Javi se ↗'],
  'new.allFilter': ['All projects', 'Tüm projeler', 'Svi projekti'],
  'new.landscape': ['Landscape', 'Peyzaj', 'Pejzaž'],
  'new.planning': ['Planning & GIS', 'Planlama ve CBS', 'Planiranje i GIS'],
  'new.detail': ['Objects & details', 'Nesneler ve detaylar', 'Objekti i detalji'],
  'new.role': ['Landscape architecture student', 'Peyzaj mimarlığı öğrencisi', 'Student pejzažne arhitekture'],
  'new.menu': ['Menu', 'Menü', 'Meni'],
  'new.skip': ['Skip to content', 'İçeriğe geç', 'Pređi na sadržaj'],
  'new.close': ['Close image', 'Görseli kapat', 'Zatvori sliku'],
  'new.downloads': ['Take a closer look', 'Daha yakından incele', 'Pogledaj detaljnije'],
  'new.education': ['Education', 'Eğitim', 'Obrazovanje'],
  'new.design': ['Landscape design', 'Peyzaj tasarımı', 'Pejzažni dizajn'],
  'new.gis': ['GIS & planning', 'CBS ve planlama', 'GIS i planiranje'],
  'new.visualization': ['Visualization', 'Görselleştirme', 'Vizualizacija']
};
Object.assign(additions, require('./editorial.cjs').translations, require('./itech.cjs').translations);
for (const [key, values] of Object.entries(additions)) t[key] = Object.fromEntries(['en','tr','bs'].map((lang,i) => [lang, values[i]]));
fs.writeFileSync('assets/js/i18n.js', 'window.I18N = ' + JSON.stringify(t, null, 2) + ';\n');
const text = key => t[key]?.en || key;
const tr = (key, tag='span', cls='') => `<${tag}${cls ? ` class="${cls}"` : ''} data-i18n="${key}">${text(key)}</${tag}>`;
const link = (url,key,cls='btn secondary', extra='') => `<a class="${cls}" href="${url}" ${extra} data-i18n="${key}">${text(key)}</a>`;
const projects = window.PROJECTS;
const card = (p,root,projectRoot) => `<a class="project-card" href="${projectRoot}${p.slug}.html"><div class="project-media"><img src="${root}assets/img/${p.cover}" alt="${p.title.en}" loading="lazy" width="1200" height="800"></div><div class="project-copy"><small>${p.category.en}</small><h3>${p.title.en}<span aria-hidden="true">↗</span></h3><p>${p.desc.en}</p></div></a>`;
function nav(root,active) {
  return `<a class="skip-link" href="#main" data-i18n="new.skip">${text('new.skip')}</a><div class="nav-wrap"><nav class="nav shell" aria-label="Main navigation"><a class="brand" href="${root}index.html"><span class="identity-square" aria-hidden="true"></span><span>Mirza Dugopoljac<small data-i18n="new.role">${text('new.role')}</small></span></a><button class="menu-toggle" aria-controls="navigation" aria-expanded="false" data-i18n="new.menu">Menu</button><div class="nav-right" id="navigation"><div class="nav-links">${[['work','portfolio/index.html','nav.work'],['about','about.html','nav.about'],['contact','contact.html','nav.contact'],['ceramics','camurun-sirli-hali-hero-pack/index.html','nav.ceramics'],['itech','itech.html','nav.itech']].map(([page,url,key]) => `<a href="${root}${url}" ${active===page?'aria-current="page"':''} data-i18n="${key}">${text(key)}</a>`).join('')}</div><div class="lang" aria-label="Language">${['en','tr','bs'].map((lang,i) => `<button data-lang="${lang}" aria-label="${['English','Türkçe','Bosanski'][i]}" aria-pressed="${lang==='en'}">${lang.toUpperCase()}</button>`).join('')}</div></div></nav></div>`;
}
function footer(root) {
  return `<section class="cta-wrap"><div class="shell cta"><div class="section-label contact-label" data-i18n="ed.contactLabel">07 / Direct contact</div>${tr('new.talk','h2')}<div class="cta-side">${tr('new.talkText','p')}${link('mailto:mirzaadc@gmail.com','new.email','btn primary')}<a class="email-link" href="mailto:mirzaadc@gmail.com">mirzaadc@gmail.com</a></div></div></section><footer class="shell footer"><span>© ${new Date().getFullYear()} Mirza Dugopoljac</span><span>Bursa · Türkiye</span><div><a href="https://www.linkedin.com/in/mirzadugopoljac/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/MirzaDugopoljac" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></footer>`;
}
function page(file,active,title,description,body,script='',project='') {
  const depth=file.split('/').length-1, root=depth?'../'.repeat(depth):'./';
  const canonical='https://mirzadugopoljac.github.io/'+(file==='index.html'?'':file);
  const titleText=project?projects.find(p=>p.slug===project).title.en+' | Mirza Dugopoljac':text(title);
  fs.writeFileSync(file, `<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${titleText}</title><meta name="description" content="${description}"><meta name="theme-color" content="#101112"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${titleText}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://mirzadugopoljac.github.io/assets/og-cover.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${root}portfolio/assets/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="${root}assets/css/site.css"></head>\n<body data-root="${root}" data-active="${active}" data-title-key="${title}"${project?` data-project="${project}"`:''}>${nav(root,active)}<main id="main">${body}${footer(root)}</main><script src="${root}assets/js/i18n.js"></script><script src="${root}assets/js/projects.js"></script><script src="${root}assets/js/components.js"></script><script src="${root}assets/js/site.js"></script>${script?`<script src="${root}assets/js/${script}.js"></script>`:''}</body></html>\n`);
}
page('itech.html','itech','title.itech','Explore iTech: an R&D team developing smart eyewear, agricultural AI and humanitarian UAV systems.',require('./itech.cjs').body({tr}),'itech');
const approach = `<section class="section"><div class="shell"><div class="section-head">${tr('home.section1','div','section-label')}${tr('home.section1Title','h2','section-title')}</div><div class="process-grid">${[1,2,3].map(n=>`<article class="process"><small>0${n}</small>${tr('home.p'+n,'h3')}${tr('home.p'+n+'p','p')}</article>`).join('')}</div></div></section>`;
const home = require('./editorial.cjs').home({tr,link,projects});
page('index.html','home','title.home','Mirza Dugopoljac — landscape architecture student in Bursa. Explore landscape design, public spaces, GIS planning and architectural visualization.',home,'home-projects');
const hero=(prefix,actions='')=>`<header class="hero"><div class="hero-center shell"><div class="kicker">${tr(prefix+'.kicker')}<span>Bursa · Türkiye</span></div>${tr(prefix+'.title','h1')}${tr(prefix+'.copy','p','hero-copy')}${actions?`<div class="actions">${actions}</div>`:''}</div></header>`;
page('portfolio/index.html','work','title.portfolio','Seven projects by Mirza Dugopoljac, spanning public space, residential landscapes, GIS planning and detailed design.',hero('portfolio',link('#projects','portfolio.projectsCta','btn primary')+link('../files/Portfolyo.pdf','new.pdf','btn secondary','download'))+`<section class="section" id="projects"><div class="shell"><div class="filter-bar"><div class="filters" aria-label="Filter projects">${[['all','new.allFilter'],['landscape','new.landscape'],['planning','new.planning'],['detail','new.detail']].map(([filter,key])=>`<button data-filter="${filter}" aria-pressed="${filter==='all'}" data-i18n="${key}">${text(key)}</button>`).join('')}</div><span id="projectCount" role="status" aria-live="polite">7 / 7</span></div><div class="projects" id="projectList">${projects.map(p=>card(p,'../','projects/')).join('')}</div></div></section>`,'portfolio');
page('about.html','about','title.about','Meet Mirza Dugopoljac, a landscape architecture student at Bursa Uludağ University exploring design, planting, GIS and visualization.',hero('about',link('files/CV.pdf','new.cv','btn primary','download')+link('contact.html','new.email'))+`<section class="section intro-section"><div class="shell intro-grid"><div class="portrait"><img src="assets/img/profile-2.webp" alt="Mirza Dugopoljac" width="600" height="750"></div><div>${tr('about.section1','div','section-label')}${tr('about.quote','blockquote')}${tr('about.quoteP','p')}<div class="bio-facts"><div><small>Education</small><strong>Bursa Uludağ University</strong></div><div><small data-i18n="new.role">${text('new.role')}</small><strong>Design · Planning · GIS</strong></div></div></div></div></section>${approach}`);
page('contact.html','contact','title.contact','Contact Mirza Dugopoljac about landscape architecture projects, collaborations and opportunities. Based in Bursa, Türkiye.',hero('contact',link('mailto:mirzaadc@gmail.com','new.email','btn primary'))+`<section class="section"><div class="shell contact-grid"><article class="contact-main"><small>Email</small>${tr('contact.emailTitle','h2')}${tr('contact.emailP','p')}<div class="contact-email"><a href="mailto:mirzaadc@gmail.com">mirzaadc@gmail.com</a><button class="copy" id="copyEmail" aria-live="polite" data-i18n="contact.copyButton">${text('contact.copyButton')}</button></div></article><div class="stack"><a class="contact-card" href="https://www.linkedin.com/in/mirzadugopoljac/" target="_blank" rel="noopener noreferrer"><small>LinkedIn ↗</small>${tr('contact.linkedinTitle','h3')}${tr('contact.linkedinP','p')}</a><div class="contact-card">${tr('new.downloads','h3')}<div class="actions">${link('files/CV.pdf','new.cv','text-link','download')}${link('files/Portfolyo.pdf','new.pdf','text-link','download')}</div></div></div></div></section>`);
for (const p of projects) {
  const next=projects[(projects.indexOf(p)+1)%projects.length];
  page(`portfolio/projects/${p.slug}.html`,'work','',p.desc.en.replaceAll('"','&quot;'),`<header class="hero case-hero"><div class="hero-center shell"><a class="text-link" href="../index.html" data-i18n="common.back">${text('common.back')}</a><div class="kicker" id="caseKicker">${p.num} / ${p.category.en}</div><h1 id="caseTitle">${p.title.en}</h1><p class="hero-copy" id="caseDesc">${p.desc.en}</p></div><div class="case-cover shell"><img id="caseCover" src="../../assets/img/${p.cover}" alt="${p.title.en}" fetchpriority="high" width="1400" height="900"></div></header><section class="section"><div class="shell"><div class="meta-grid">${[['common.type','metaType',p.category.en],['common.context','metaContext',p.context.en],['common.focus','metaFocus',p.focus.en]].map(([key,id,value])=>`<div>${tr(key,'small')}<strong id="${id}">${value}</strong></div>`).join('')}</div><div class="story">${tr('common.story','h2','section-label')}<p id="storyText">${p.story.en}</p></div></div></section><section class="section gallery-section"><div class="shell"><div class="section-head">${tr('common.visuals','h2','section-title')}${tr('common.openHelp','p')}</div><div class="gallery" id="gallery">${p.gallery.map(([img,cap])=>`<a href="../../assets/img/${img}" data-lightbox><img src="../../assets/img/${img}" alt="${cap.en}" loading="lazy"><span class="caption">${cap.en}</span></a>`).join('')}</div></div></section><section class="section"><div class="shell"><a class="next" id="nextProject" href="${next.slug}.html"><div>${tr('common.next','small')}<strong id="nextTitle">${next.title.en}</strong></div><span aria-hidden="true">↗</span></a></div></section><dialog class="lightbox" id="lightbox" aria-label="Project image"><button data-close data-i18n="new.close">Close image</button><img alt=""></dialog>`,'project-page',p.slug);
}
console.log('Built 12 static pages with English fallback content.');
const outputPages = ['itech.html','index.html','about.html','contact.html','portfolio/index.html',...projects.map(p=>`portfolio/projects/${p.slug}.html`)];
for (const file of outputPages) {
  let html = fs.readFileSync(file, 'utf8')
    .replace('https://mirzadugopoljac.github.io/assets/og-cover.jpg', 'https://mirzadugopoljac.github.io/portfolio/assets/og-cover.jpg')
    .replace('</head>', '<noscript><style>.menu-toggle{display:none}.nav-right{display:flex;position:static;flex-wrap:wrap;padding:0;border:0;box-shadow:none}.nav{flex-wrap:wrap;padding-block:15px}</style></noscript></head>')
    .replace('<span>Landscape design</span>', tr('new.design'))
    .replace('<span>GIS & planning</span>', tr('new.gis'))
    .replace('<span>Visualization</span>', tr('new.visualization'))
    .replace('<small>Education</small>', tr('new.education','small'));
  if (file === 'portfolio/index.html') html=html.replace('<div class="filter-bar">', tr('new.selected','h2','visually-hidden')+'<div class="filter-bar">');
  const cssRoot='../'.repeat(file.split('/').length-1)||'./';
  html=html.replace('</head>', `<link rel="stylesheet" href="${cssRoot}assets/css/editorial.css"></head>`);
  html=html.replace('</head>', `<link rel="stylesheet" href="${cssRoot}assets/css/earth.css"></head>`);
  html=html.replace('content="#101112"','content="#15251c"');
  if (file === 'itech.html') html=html.replace('</head>', '<link rel="stylesheet" href="assets/css/itech.css"></head>');
  if (file === 'index.html') html=html.replace('</body>', '<script src="assets/js/terrain.js"></script></body>');
  html=html.replace('</body>', `<script src="${cssRoot}assets/js/effects.js"></script></body>`);
  fs.writeFileSync(file, html.replace(/></g, '>\n<'));
}
