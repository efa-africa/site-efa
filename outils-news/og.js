const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
// Images de partage 1200 × 630 des articles EFA News. Usage : node outils-news/og.js <site> [--tout]
const SITE=process.argv[2]||'.';const F=path.join(SITE,'outils-news','fonts')+'/';const TOUT=process.argv.includes('--tout');
const ff=(n,f)=>`@font-face{font-family:'${n}';src:url(${'data:font/woff2;base64,'+fs.readFileSync(F+f).toString('base64')}) format('woff2');font-weight:${f.match(/-(\d00)-/)[1]}}`;
const fonts=[ff('LB','libre-baskerville-latin-700-normal.woff2'),ff('SS','source-sans-3-latin-400-normal.woff2'),ff('SS','source-sans-3-latin-700-normal.woff2'),ff('SS','source-sans-3-latin-800-normal.woff2')].join('');
const logo='data:image/png;base64,'+fs.readFileSync(path.join(SITE,'logo-efa-96.png')).toString('base64');
const L=JSON.parse(fs.readFileSync(path.join(SITE,'outils-news','og-liste.json'),'utf8'));
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
for(const a of L){
 const out=path.join(SITE,'news/og',a.id+'.png');if(!TOUT&&fs.existsSync(out))continue;
 await p.setContent(`<html><head><style>${fonts}*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#0B1220;color:#fff;font-family:SS;padding:56px 64px;display:flex;flex-direction:column;position:relative;overflow:hidden}
 .h{display:flex;gap:14px;align-items:center}.p{background:#EC6243;font-weight:800;letter-spacing:.14em;font-size:20px;padding:7px 14px;border-radius:5px}.r{font-weight:800;letter-spacing:.2em;text-transform:uppercase;font-size:18px;color:#F09680}
 h1{font-family:LB;font-weight:700;font-size:54px;line-height:1.12;margin-top:34px;max-width:1000px;text-wrap:balance}
 .v{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:30px}.v b{font-family:LB;font-size:70px;line-height:1;color:#fff;white-space:nowrap}.v span{display:block;font-size:22px;color:#C9D1DE;margin-top:10px;max-width:640px}
 .f{display:flex;align-items:center;gap:12px;font-size:20px;color:#AEB6C6;white-space:nowrap}.f img{width:52px;height:52px}
 .bar{position:absolute;left:0;right:0;bottom:0;height:10px;background:#DA3C1B}</style></head><body>
 <div class="h"><span class="p">EFA | NEWS</span><span class="r">${esc(a.rub)} · ${esc(a.d)}</span></div><h1>${esc(a.t)}</h1>
 <div class="v"><div><b>${esc(a.v)}</b><span>${esc(a.l)}</span></div><div class="f"><img src="${logo}">efa.africa</div></div><div class="bar"></div></body></html>`);
 await p.evaluate(()=>document.fonts.ready);
 // réduire le titre s'il déborde
 await p.evaluate(()=>{const h=document.querySelector('h1');let s=54;while(h.scrollHeight>200&&s>38){s-=2;h.style.fontSize=s+'px';}});
 await p.screenshot({path:out});console.log('image',a.id);
}
await b.close();})();
