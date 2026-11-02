/* EFA · Moteur des ateliers guidés (même expérience que « Mes premiers pas en Bourse »).
   Chaque page déclare window.ATELIER = { ... } puis charge ce fichier.
   Vues : accueil → question → chapitres → écrans → fiche. Voix d'Élysée en option (ATELIER.voix). */
(function(){
var A=window.ATELIER; if(!A) return;
var P=A.chapitres;
var COUL=[{c:'#E44828',t:'#FDEBE6',x:'#fff'},{c:'#2188D6',t:'#E6F2FC',x:'#fff'},{c:'#1E8E57',t:'#E3F5EC',x:'#fff'},{c:'#F2B84B',t:'#FEF4DF',x:'#0B1220'},{c:'#0B1220',t:'#E9ECF2',x:'#fff'}];
var ETAPES=[]; P.forEach(function(ph,i){ ph.e.forEach(function(e){ e.ph=i; e.n=ETAPES.length+1; ETAPES.push(e); }); });
var NB=ETAPES.length;
var KEY='efa-at-'+A.id, etat={}, D={};
try{ var s=JSON.parse(localStorage.getItem(KEY)||'{}')||{}; etat=s.etat||{}; D=s.D||{}; }catch(e){}
function sv(){ try{ localStorage.setItem(KEY,JSON.stringify({etat:etat,D:D})); }catch(e){} }
var cur=Math.min(+(D._pos||0),NB-1);
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function F(n){ return Math.round(n||0).toLocaleString('fr-FR').replace(/\s/g,' ')+' F'; }
function N(v){ v=String(v==null?'':v).replace(/[^\d.,-]/g,'').replace(',','.'); return +v||0; }
function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return [].slice.call((r||document).querySelectorAll(s)); }
var H={F:F,N:N,esc:esc};

/* ---------- Widgets génériques ---------- */
function champ(c){ var v=D[c.id]==null?'':D[c.id];
  if(c.type==='area') return '<div class="ch" style="grid-column:1/-1"><label for="'+c.id+'">'+esc(c.l)+'</label><textarea id="'+c.id+'" placeholder="'+esc(c.ph||'')+'">'+esc(v)+'</textarea></div>';
  if(c.type==='txt') return '<div class="ch"'+(c.large?' style="grid-column:1/-1"':'')+'><label for="'+c.id+'">'+esc(c.l)+'</label><input id="'+c.id+'" placeholder="'+esc(c.ph||'')+'" value="'+esc(v)+'"></div>';
  return '<div class="ch"><label for="'+c.id+'">'+esc(c.l)+'</label><input id="'+c.id+'" inputmode="decimal" placeholder="'+esc(c.ph||'0')+'" value="'+esc(v)+'"></div>'; }
function puces(p){ var v=D[p.id]||(p.m?[]:''); return (p.k?'<p class="w-k" style="margin-top:14px">'+esc(p.k)+'</p>':'')+'<div class="puces" data-p="'+p.id+'"'+(p.m?' data-m':'')+'>'+p.l.map(function(x){ var on=p.m?v.indexOf(x)>=0:v===x; return '<button type="button" class="pu" aria-pressed="'+on+'" data-v="'+esc(x)+'">'+esc(x)+'</button>'; }).join('')+'</div>'; }
function quiz(q,i){ return '<div class="qz" data-r="'+q[2]+'"><p>'+esc(q[0])+'</p><div class="b">'+q[1].map(function(o,k){ return '<button type="button" data-c="'+k+'">'+esc(o)+'</button>'; }).join('')+'</div><em></em></div>'; }
function tuiles(f){ return '<div class="tuiles">'+f.map(function(x,i){ return '<div class="tu"><b class="n">'+(i+1)+'</b><p>'+esc(x)+'</p></div>'; }).join('')+'</div>'; }
function widget(e){ var w=e.w, h='';
  if(e.f&&(!w||w.consignes)) h+=tuiles(e.f);
  if(!w) return h;
  if(w.ex) h+='<p class="exemple"'+(e.f?' style="margin-top:14px"':'')+'><b>Exemple :</b> '+esc(w.ex)+'</p>';
  if(w.k) h+='<p class="w-k">'+esc(w.k)+'</p>';
  if(w.champs) h+='<div class="champs'+(w.c3?' c3':'')+'">'+w.champs.map(champ).join('')+'</div>';
  if(w.puces) (w.puces.length?w.puces:[w.puces]).forEach(function(p){ h+=puces(p); });
  if(w.quiz) h+='<div style="margin-top:6px">'+w.quiz.map(quiz).join('')+'</div>';
  if(w.v) h+='<div id="w_v"></div>';
  return h; }
function vie(e){ if(e.w&&e.w.v){ var z=$('#w_v'); if(z){ try{ z.innerHTML=e.w.v(D,H)||''; }catch(x){ z.innerHTML=''; } } } }

/* ---------- Progression ---------- */
function faitsCh(i){ return ETAPES.filter(function(x){return x.ph===i&&etat['s'+x.n];}).length; }
function totCh(i){ return ETAPES.filter(function(x){return x.ph===i;}).length; }
function totFaits(){ return ETAPES.filter(function(x){return etat['s'+x.n];}).length; }
function chActif(){ for(var i=0;i<P.length;i++) if(faitsCh(i)<totCh(i)) return i; return P.length-1; }
var vue=D._vue||(totFaits()||D._pos?'chapitres':'accueil');
function voir(v,k){ vue=v; if(k!=null) cur=Math.max(0,Math.min(NB-1,k)); D._vue=v; D._pos=cur; sv(); rendu(); var s=$('#scene'); if(s.getBoundingClientRect().top<0||v!=='ecran') s.scrollIntoView({behavior:'smooth',block:'start'}); }
function aller(k){ if(k>=NB) return voir('fin'); if(k<0) return voir('chapitres'); var a=ETAPES[cur], b=ETAPES[k]; if(a&&b&&b.ph!==a.ph&&k>cur) return voir('chapitres',k); voir('ecran',k); }
function carteCh(i){ var f=faitsCh(i), t=totCh(i), c=COUL[i%5], act=i===chActif()&&f<t, fin=f===t;
  return '<div class="ch5'+(act?' actif':'')+(fin?' fini':'')+'" style="--cc:'+c.c+';--cx2:'+c.x+'"><span class="no">'+(i+1)+'</span><div style="flex:1"><h3>'+esc(P[i].acq)+'</h3><small>Chapitre '+(i+1)+' · '+esc(P[i].t)+'</small><p style="margin:6px 0 0;font-size:15px;color:var(--ink2)">'+esc(P[i].desc)+'</p><div class="bar"><i style="width:'+(f/t*100)+'%"></i></div><small>'+f+' activité'+(f>1?'s':'')+' sur '+t+'</small><button type="button" data-ch="'+i+'">'+(fin?'Revoir le chapitre':f?'Continuer le chapitre':'Commencer le chapitre')+'</button></div></div>'; }

function rendu(){
  var z=$('#scene'); document.querySelector('.pp-couv').classList.toggle('court',vue!=='accueil');
  $('#pp-h1').textContent=vue==='accueil'?A.h1:A.titre;
  z.style.cssText='';
  if(vue==='accueil'){ z.innerHTML='<div class="ec-anim"><p class="vue-t">Ce que vous saurez faire</p><p class="vue-p">'+P.length+' acquis concrets, un chapitre chacun.</p><div class="acq">'+P.map(function(ph,i){ var c=COUL[i%5]; return '<div class="ch5" style="--cc:'+c.c+';--cx2:'+c.x+'"><span class="no">'+(i+1)+'</span><div><h3>'+esc(ph.acq)+'</h3><p style="margin:6px 0 0;font-size:15px;color:var(--ink2)">'+esc(ph.desc)+'</p></div></div>'; }).join('')+'</div><button type="button" class="cta" id="go2">Commencer par une question</button></div>'; $('#go2').onclick=function(){ voir('question'); }; return; }
  if(vue==='question'){ var Q=A.question, r=D.q1, bon=Q.r.filter(function(x){return x[3];})[0];
    z.innerHTML='<div class="ec-anim"><p class="vue-t">'+esc(Q.t)+'</p><p class="vue-p">Une seule réponse. Il n’y a pas de piège : chacune vous apprend quelque chose.</p><div class="q1">'+Q.r.map(function(x){ return '<button type="button" data-q="'+x[0]+'" aria-pressed="'+(r===x[0])+'" class="'+(r&&x[3]?'bon':'')+'">'+esc(x[1])+'</button>'; }).join('')+'</div>'+(r?'<div class="verdict '+(r===bon[0]?'v-ok':'v-mid')+'">'+esc(Q.r.filter(function(x){return x[0]===r;})[0][2])+'</div><button type="button" class="cta" id="go3">Découvrir mon parcours</button>':'')+'</div>';
    $$('.q1 button').forEach(function(b){ b.onclick=function(){ D.q1=b.dataset.q; sv(); rendu(); }; }); if(r) $('#go3').onclick=function(){ voir('chapitres'); }; return; }
  if(vue==='chapitres'){ var tf=totFaits();
    z.innerHTML='<div class="ec-anim"><p class="vue-t">Votre parcours</p><p class="vue-p">'+(tf?tf+' activité'+(tf>1?'s':'')+' validée'+(tf>1?'s':'')+' sur '+NB+'. Reprenez où vous en êtes.':'Commencez par le chapitre 1, ou par celui qui vous parle le plus.')+'</p><div class="acq">'+P.map(function(_,i){return carteCh(i);}).join('')+'</div><button type="button" class="cta sec" id="vfiche">Voir ma fiche</button></div>';
    $$('[data-ch]').forEach(function(b){ b.onclick=function(){ var i=+b.dataset.ch, L=ETAPES.filter(function(x){return x.ph===i;}), k=L.filter(function(x){return !etat['s'+x.n];})[0]||L[0]; voir('ecran',ETAPES.indexOf(k)); }; });
    $('#vfiche').onclick=function(){ voir('fin'); }; return; }
  if(vue==='fin'){ var tf2=totFaits(), mq=P.map(function(_,i){return i;}).filter(function(i){return faitsCh(i)<totCh(i);});
    function li(l,v){ return '<div><span>'+esc(l)+'</span><b'+(v?'':' class="vide"')+'>'+(v?esc(v):'à compléter')+'</b></div>'; }
    var titre=tf2===NB?A.fin.titre:tf2===0?'Vous avez exploré l’atelier':'Vous avez bien avancé';
    var sous=tf2===NB?NB+' activités validées sur '+NB+'.':tf2===0?'0 activité validée pour l’instant. Les exercices font la différence : reprenez-les à votre rythme.':tf2+' activités validées sur '+NB+'. Il reste '+mq.map(function(i){return '« '+P[i].acq+' »';}).join(', ')+'.';
    var S=A.fin.suite;
    z.innerHTML='<div class="ec-anim"><span class="pp-k" style="color:#B8341A">'+esc(A.fin.k||'Ma fiche')+'</span><p class="vue-t">'+esc(titre)+'</p><p class="vue-p">'+esc(sous)+'</p>'
     +'<div class="fiche-r">'+A.fin.fiche.map(function(x){ var v=''; try{ v=x[1](D,H)||''; }catch(e){} return li(x[0],v); }).join('')+'</div>'
     +(tf2<NB?'<button type="button" class="cta" id="repr">Reprendre mes exercices</button> ':'')+'<button type="button" class="cta sec" id="impr">Enregistrer ma fiche (PDF)</button>'
     +'<div class="suites"><div class="suite"><h3>Revoir l’atelier</h3><p>Reprenez un chapitre, complétez votre fiche, refaites un exercice avec de nouveaux chiffres. À votre rythme.</p><button type="button" class="cta sec" id="revoir">Voir les chapitres</button></div>'
     +(S?'<div class="suite"><h3>'+esc(S.t)+'</h3><p>'+esc(S.p)+'</p><a class="cta" href="'+esc(S.lien)+'">'+esc(S.b)+'</a></div>':'')+'</div>'
     +'<p style="margin:16px 0 0;font-size:15px">Votre avis améliore l’atelier et vous rapporte 1 crédit : <a class="lien" href="coaching.html?avis='+esc(A.id)+'#avis">donner mon avis</a> · <button type="button" id="raz" style="all:unset;cursor:pointer;color:var(--bleu);text-decoration:underline">tout recommencer</button></p></div>';
    if($('#repr')) $('#repr').onclick=function(){ var i=mq[0], L=ETAPES.filter(function(x){return x.ph===i;}), k=L.filter(function(x){return !etat['s'+x.n];})[0]; voir('ecran',ETAPES.indexOf(k)); };
    $('#impr').onclick=function(){ window.print(); }; $('#revoir').onclick=function(){ voir('chapitres'); };
    $('#raz').onclick=function(){ etat={}; D={_vue:'accueil',_pos:0}; sv(); voir('accueil',0); }; return; }
  var e=ETAPES[cur], c=COUL[e.ph%5], L=ETAPES.filter(function(x){return x.ph===e.ph;}), on=!!etat['s'+e.n], fc=faitsCh(e.ph);
  z.style.cssText='--c:'+c.c+';--ct:'+c.t+';--cx:'+c.x;
  z.innerHTML='<div class="prog2"><span>Chapitre '+(e.ph+1)+' sur '+P.length+' · '+fc+' activité'+(fc>1?'s':'')+' sur '+L.length+'</span><span class="b"><i style="width:'+(fc/L.length*100)+'%"></i></span><a id="tous">Tous les chapitres</a></div>'
   +'<article class="ec ec-anim"><div class="ec-tete"><span class="ec-k"><i>'+(e.ph+1)+'</i>'+esc(P[e.ph].acq)+'</span><h2>'+esc(e.t)+'</h2><div class="ec-pts">'+L.map(function(x){ return '<i class="'+(x.n===e.n?'on':etat['s'+x.n]?'ok':'')+'"></i>'; }).join('')+'</div></div>'
   +'<div class="ec-corps"><div class="coach"><img src="clone/assets/elysee-portrait-carre.jpg" alt=""><div><small>Le coach</small><p>'+esc(e.c)+'</p></div></div>'
   +widget(e)
   +'<button type="button" class="preuve" id="pv" aria-pressed="'+on+'"><span class="bx">'+(on?'✓':'')+'</span>'+esc(e.p)+'</button>'
   +'<div class="nav"><button type="button" class="prec" id="prec" aria-label="Écran précédent">←</button><button type="button" class="suiv" id="suiv">Continuer →</button></div><p class="ecn">Écran '+e.n+' sur '+NB+'</p></div></article>';
  vie(e);
  $('#pv').onclick=function(){ var v=!etat['s'+e.n]; etat['s'+e.n]=v; sv(); this.setAttribute('aria-pressed',v); this.querySelector('.bx').textContent=v?'✓':''; var f2=faitsCh(e.ph); $('.prog2 span').textContent='Chapitre '+(e.ph+1)+' sur '+P.length+' · '+f2+' activité'+(f2>1?'s':'')+' sur '+L.length; $('.prog2 .b i').style.width=(f2/L.length*100)+'%'; };
  $('#prec').onclick=function(){ cur===0?voir('chapitres'):aller(cur-1); }; $('#suiv').onclick=function(){ aller(cur+1); }; $('#tous').onclick=function(){ voir('chapitres'); };
}
$('#pp-go').onclick=function(){ voir('question'); };
var sc=$('#scene');
sc.addEventListener('input',function(ev){ var t=ev.target; if(!t.id) return; D[t.id]=t.value; sv(); var e=ETAPES[cur]; if(vue==='ecran'&&e) vie(e); });
sc.addEventListener('click',function(ev){
  var pu=ev.target.closest('.pu'); if(pu){ var box=pu.closest('.puces'), id=box.dataset.p, m=box.hasAttribute('data-m'), v=pu.dataset.v;
    if(m){ var arr=(D[id]||[]).slice(), i=arr.indexOf(v); if(i>=0) arr.splice(i,1); else arr.push(v); D[id]=arr; $$('.pu',box).forEach(function(b){ b.setAttribute('aria-pressed',arr.indexOf(b.dataset.v)>=0); }); }
    else { D[id]=v; $$('.pu',box).forEach(function(b){ b.setAttribute('aria-pressed',b===pu); }); }
    sv(); var e=ETAPES[cur]; if(e) vie(e); return; }
  var q=ev.target.closest('.qz button'); if(q){ var bx=q.closest('.qz'), bon=q.dataset.c===bx.dataset.r, e2=ETAPES[cur], k=$$('.qz',sc).indexOf(bx), Q=e2.w.quiz[k];
    $$('button',bx).forEach(function(x){ x.className=''; }); q.className=bon?'bon':'faux'; bx.querySelector('em').textContent=(bon?'Oui. ':'Pas tout à fait. ')+(Q[3]||''); return; }
});
document.addEventListener('keydown',function(e){ if(vue!=='ecran'||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if(e.key==='ArrowRight') aller(cur+1); if(e.key==='ArrowLeft') aller(cur-1); });

/* ---------- Voix d'Élysée ---------- */
var VX={dir:'audio/'+A.id+'/',on:true,cle:'',a:new Audio(),v:A.voixVersion||1};
var bar=$('#voix'), ec=$('#pp-ecoute');
if(!A.voix){ if(bar) bar.hidden=true; if(ec) ec.hidden=true; rendu(); return; }
try{ VX.on=localStorage.getItem('efa-voix')!=='off'; }catch(e){}
VX.a.preload='auto';
var IC_PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>', IC_PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/></svg>';
function vxCle(){ if(vue==='accueil') return '00-accueil'; if(vue==='question') return '01-question'; if(vue==='chapitres') return '02-parcours'; if(vue==='fin') return '99-fin'; var e=ETAPES[cur]; return e?'e'+(e.n<10?'0':'')+e.n:''; }
function vxUI(){ var joue=!VX.a.paused&&!VX.a.ended; bar.classList.toggle('coupee',!VX.on); bar.classList.toggle('joue',VX.on&&joue);
  $('#vx-couper').textContent=VX.on?'Couper la voix':'Réactiver la voix';
  $('#vx-s').textContent=VX.on?(joue?'Élysée vous parle':'Touchez ▶ pour écouter'):'Vous avancez seul';
  $('#vx-lire').innerHTML=joue?IC_PAUSE:IC_PLAY; $('#vx-lire').setAttribute('aria-label',joue?'Mettre en pause':'Écouter cet écran');
  if(ec) ec.hidden=!(vue==='accueil'&&VX.on&&!joue); }
function vxJouer(force){ var k=vxCle(); if(!k||!VX.on){ vxUI(); return; }
  if(k!==VX.cle){ VX.cle=k; VX.a.src=VX.dir+k+'.mp3?v='+VX.v; } else if(!force&&VX.a.ended){ vxUI(); return; }
  if(force) try{ VX.a.currentTime=0; }catch(e){}
  var p=VX.a.play(); if(p&&p.then) p.then(vxUI,vxUI); vxUI(); }
function vxStop(){ try{ VX.a.pause(); }catch(e){} vxUI(); }
['play','pause','ended'].forEach(function(ev){ VX.a.addEventListener(ev,vxUI); });
$('#vx-couper').onclick=function(){ VX.on=!VX.on; try{ localStorage.setItem('efa-voix',VX.on?'on':'off'); }catch(e){} if(VX.on){ VX.cle=''; vxJouer(true); } else vxStop(); };
$('#vx-lire').onclick=function(){ if(!VX.a.paused&&!VX.a.ended) vxStop(); else vxJouer(VX.a.ended||vxCle()!==VX.cle); };
if(ec) ec.onclick=function(){ VX.on=true; try{ localStorage.setItem('efa-voix','on'); }catch(e){} VX.cle=''; vxJouer(true); };
var _rendu=rendu; rendu=function(){ _rendu(); if(VX.on&&vxCle()!==VX.cle) vxJouer(false); else vxUI(); };
rendu();
})();
