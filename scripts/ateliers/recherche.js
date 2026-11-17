  /* Recherche des ateliers : texte libre + mots clés, synonymes, sans accents, résultats classés.
     Index : data/ateliers-recherche.json (fabriqué par page-catalogue.py). Lien direct : ateliers.html?q=… */
  var IDX=null, form=document.getElementById('rech'), q=document.getElementById('q'), res=document.getElementById('res');
  function nz(t){ return String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’']/g,' '); }
  var SYN={bourse:'brvm action actions dividende cotee sgi',brvm:'bourse action actions sgi',action:'bourse brvm',dividende:'dividendes action bourse',
   credit:'pret emprunt dette dettes banque microfinance',dette:'dettes credit pret rembourser',pret:'credit emprunt preter',emprunt:'credit pret',
   epargne:'epargner placer placement reserve',placer:'placement epargne placements',placement:'placer epargne fonds',
   budget:'depenses argent mois',argent:'budget depenses',retraite:'pension cnps cgrae',cnps:'retraite pension',
   arnaque:'arnaques escroquerie fraude faux rendement garanti',fraude:'arnaque',escroquerie:'arnaque',
   tontine:'cotisation club tour',club:'tontine investissement',terrain:'lot maison logement immobilier construire',maison:'terrain logement',
   logement:'terrain maison loyer',activite:'commerce business entreprise boutique',entreprise:'activite commerce business',commerce:'activite',
   tresor:'bons obligations etat',obligation:'obligations revenu fixe tresor',crypto:'bitcoin ethereum solana ton cryptomonnaie',inflation:'prix hausse pouvoir achat',
   famille:'enfant enfants parents deces etudes',assurance:'assurance-vie contrat'};
  var VIDES=['de','la','le','les','des','du','un','une','et','en','mon','ma','mes','je','pour','au','aux','que','qui','comment','quoi','est','sur','dans','avec'];
  function esc(t){ return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function charger(cb){ if(IDX) return cb(); fetch('data/ateliers-recherche.json').then(function(r){return r.json();}).then(function(d){ function mo(t){ return ' '+nz(t).replace(/[^a-z0-9]+/g,' ')+' '; } IDX=d.map(function(a){ return {a:a,t:mo(a.t),th:mo(a.th.join(' ')),ch:mo(a.ch.join(' ')),x:mo(a.h+' '+a.x)}; }); cb(); }).catch(function(){ res.hidden=false; res.innerHTML='<p class="res-vide">La recherche n’a pas pu se charger. Vérifiez votre connexion.</p>'; }); }
  function mots(v){ return nz(v).split(/[^a-z0-9]+/).filter(function(m){ return m.length>1&&VIDES.indexOf(m)<0; }); }
  function racine(m){ return m.length>4?m.replace(/(es|s|x)$/,''):m; }
  function score(it,ms){ var s=0, tous=true; ms.forEach(function(m){ var r=racine(m), al=[r].concat((SYN[m]||SYN[r]||'').split(' ').filter(Boolean).map(racine)), best=0;
      al.forEach(function(w,k){ var f=k?0.6:1, v=0, W=' '+w; if(it.t.indexOf(W)>=0) v=10; else if(it.th.indexOf(W)>=0) v=6; else if(it.ch.indexOf(W)>=0) v=4; else if(it.x.indexOf(W)>=0) v=1.5+Math.min(3,it.x.split(W).length-2)*0.5; if(v*f>best) best=v*f; });
      if(!best) tous=false; s+=best; }); return tous?s:s*0.35; }
  function surl(t,ms){ var h=esc(t); ms.forEach(function(m){ var r=racine(m); if(r.length<3) return; var re=new RegExp('('+r.split('').map(function(c){ return '['+c+({a:'àâä',e:'éèêë',i:'îï',o:'ôö',u:'ùûü',c:'ç'}[c]||'')+']'; }).join('')+'[a-zà-ÿ]*)','gi'); h=h.replace(re,'<mark>$1</mark>'); }); return h; }
  function extrait(it,ms){ for(var i=0;i<ms.length;i++){ var r=racine(ms[i]); var c=it.a.ch.filter(function(x){ return nz(x).indexOf(r)>=0; })[0]; if(c) return 'Chapitre : '+c; } return it.a.h||it.a.ch.slice(0,2).join(' · '); }
  function fermer(push){ document.body.classList.remove('cherche'); res.hidden=true; res.innerHTML=''; if(push){ try{ history.replaceState(null,'',location.pathname); }catch(e){} } }
  function chercher(v,push,defile){ var ms=mots(v); if(!ms.length){ fermer(push); return; }
    charger(function(){ var S=IDX.map(function(it){ return [score(it,ms),it]; }).sort(function(a,b){ return b[0]-a[0]; }), top=S.length?S[0][0]:0, L=S.filter(function(x){ return x[0]>=Math.max(1.5,top*0.3); }).map(function(x){ return x[1]; });
      document.body.classList.add('cherche'); res.hidden=false;
      res.innerHTML='<h2>Résultats pour « '+esc(v.trim())+' »</h2><p class="res-n">'+(L.length?L.length+' atelier'+(L.length>1?'s':''):'Aucun atelier ne correspond')+' · <a href="#" id="raz">Revenir aux thèmes</a></p>'
       +(L.length?'<div class="res-l">'+L.slice(0,24).map(function(it){ var a=it.a; return '<a class="res-c" href="'+esc(a.p)+'?src=recherche"><span class="rk">'+esc(a.th[0]||'Atelier')+'</span><h3>'+surl(a.t,ms)+'</h3><p>'+surl(extrait(it,ms),ms)+'</p><span class="rb"><b>'+esc(a.acc)+'</b>'+(a.n?a.n+' activités':'')+'</span></a>'; }).join('')+'</div>'
        :'<div class="res-vide"><p><b>Essayez un mot plus simple</b> : budget, épargne, tontine, Bourse, crédit, retraite. Ou faites le <a href="diagnostic.html">diagnostic</a> : il vous indique par où commencer.</p></div>');
      document.getElementById('raz').onclick=function(e){ e.preventDefault(); q.value=''; fermer(true); window.scrollTo({top:0,behavior:'smooth'}); };
      if(push){ try{ history.replaceState(null,'','?q='+encodeURIComponent(v.trim())); }catch(e){} }
      if(defile) res.scrollIntoView({behavior:'smooth',block:'start'}); }); }
  var tm; q.addEventListener('input',function(){ clearTimeout(tm); var v=q.value; tm=setTimeout(function(){ if(mots(v).length) chercher(v,false,false); else fermer(false); },300); });
  q.addEventListener('focus',function(){ charger(function(){}); },{once:true});
  form.addEventListener('submit',function(e){ e.preventDefault(); chercher(q.value,true,true); q.blur(); });
  document.querySelectorAll('.mots button').forEach(function(b){ b.onclick=function(){ q.value=b.dataset.m; chercher(b.dataset.m,true,true); }; });
  var q0=new URLSearchParams(location.search).get('q'); if(q0){ q.value=q0; chercher(q0,false,false); }
