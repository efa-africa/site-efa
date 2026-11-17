// EFA · Index de recherche des ateliers : titre, promesse, question, chapitres, écrans. Sortie JSON sur stdout.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'../..');
const D=JSON.parse(fs.readFileSync(R+'/data/mon-efa-ateliers.json','utf8'));
const out={};
for(const id of Object.keys(D)){const f=R+'/ateliers-guides/'+id+'.js';let txt=[],ch=[],h1='';
 if(fs.existsSync(f)){global.window={};try{require(f);const A=window.ATELIER;h1=A.h1||'';
  txt.push(A.titre||'',A.h1||'',(A.question&&A.question.t)||'');
  (A.chapitres||[]).forEach(c=>{ch.push(c.t);txt.push(c.t,c.desc||'',c.acq||'');(c.e||[]).forEach(e=>{txt.push(e.t||'',(e.c||'').slice(0,400));(e.f||[]).forEach(x=>txt.push(x));});});
  txt.push((A.fin&&A.fin.k)||'',(A.fin&&A.fin.titre)||'');}catch(e){}}
 out[id]={h1:h1,ch:ch,x:txt.join(' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,6000)};}
process.stdout.write(JSON.stringify(out));
