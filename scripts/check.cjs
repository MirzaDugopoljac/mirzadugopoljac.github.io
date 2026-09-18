const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
process.chdir(path.join(__dirname, '..'));
const context = {window:{}};
vm.runInNewContext(fs.readFileSync('assets/js/i18n.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('assets/js/projects.js','utf8'),context);
const pages = ['camurun-sirli-hali-hero-pack/index.html','index.html','about.html','contact.html','portfolio/index.html',...context.window.PROJECTS.map(p=>`portfolio/projects/${p.slug}.html`)];
const errors=[];
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  if(new Set(ids).size!==ids.length)errors.push(`${file}: duplicate IDs`);
  for(const [,target] of html.matchAll(/href="#([^"]+)"/g)){
    if(!ids.includes(target))errors.push(`${file}: missing anchor #${target}`);
  }
  for(const [,targets] of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)){
    for(const target of targets.split(' '))if(!ids.includes(target))errors.push(`${file}: missing ARIA target ${target}`);
  }
  if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${file}: expected one h1`);
  for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(/^(https?:|mailto:|#|data:)/.test(url))continue;
    const target=path.resolve(path.dirname(file),url.split('#')[0]);
    if(!fs.existsSync(target))errors.push(`${file}: missing ${url}`);
  }
  for(const [,key] of html.matchAll(/data-i18n="([^"]+)"/g)){
    for(const lang of ['en','tr','bs'])if(!context.window.I18N[key]?.[lang])errors.push(`${file}: missing ${key}.${lang}`);
  }
}
for(const p of context.window.PROJECTS){
  for(const image of [p.cover,...p.gallery.map(([image])=>image)])if(!fs.existsSync('assets/img/'+image))errors.push(`Missing project image: ${image}`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`PASS: ${pages.length} pages; local links, images, anchors, ARIA references, heading structure and EN/TR/BS translations.`);
