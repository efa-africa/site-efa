const header=document.querySelector('.header'),toggle=document.querySelector('.menu-toggle'),menu=document.querySelector('#menu');
function syncHeader(){header.classList.toggle('scrolled',scrollY>65)}addEventListener('scroll',syncHeader,{passive:true});syncHeader();
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Ouvrir le menu')}
toggle.addEventListener('click',()=>{let open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu')});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu()});
const amount=document.querySelector('#amount'),amountOutput=document.querySelector('#amount-output'),total=document.querySelector('#total'),format=new Intl.NumberFormat('fr-FR');function calculate(){let n=Number(amount.value);amountOutput.textContent=format.format(n)+' FCFA';total.innerHTML=format.format(n*12)+' <small>FCFA</small>'}if(amount){amount.addEventListener('input',calculate);calculate();}
const lessons={budget:{kicker:'LE QUOTIDIEN · PREMIÈRE LEÇON',title:'Ce qui entre, ce qui reste',intro:'Serge gagne 500 000 FCFA, puis 700 000 FCFA. Pourtant, son solde à la fin du mois reste proche de zéro. L’augmentation du revenu ne dit rien, à elle seule, sur ce qui est conservé.',steps:['Notez votre revenu total du dernier mois.','Listez vos dépenses fixes, variables et aides à des proches.','Calculez la différence : revenu moins sorties.'],action:'Cette semaine, choisissez une seule dépense à observer pendant sept jours.',link:'https://efa.africa/parcours.html'},projet:{kicker:'LES PROJETS · PREMIÈRE LEÇON',title:'Du flux au capital',intro:'Recevoir une somme dans une tontine peut financer un projet, mais ce montant n’est pas automatiquement un gain. La question utile est : qu’en reste-t-il après les engagements et les dépenses ?',steps:['Écrivez l’objectif du projet et sa date.','Distinguez les sommes reçues des sommes déjà versées ou encore dues.','Prévoyez les coûts, une marge et une réserve.'],action:'Écrivez une phrase claire : « Cette somme servira à… »',link:'https://efa.africa/etude-tontine-en-chiffres.html'},investir:{kicker:'L’AVENIR · PREMIÈRE LEÇON',title:'Comprendre avant de placer',intro:'Un placement se juge selon son objectif, sa durée, ses risques, sa disponibilité et ses frais. Le rendement annoncé n’est qu’une partie de la décision.',steps:['Précisez l’objectif et la date à laquelle vous aurez besoin de l’argent.','Demandez ce que vous pouvez perdre et quand vous pourrez récupérer les fonds.','Comparez les frais et l’organisme qui porte le produit.'],action:'Avant toute décision, posez ces trois questions par écrit.',link:'https://efa.africa/bourse-essentiel.html'}};
const dialog=document.querySelector('#lesson-dialog'),content=document.querySelector('#lesson-content');document.querySelectorAll('[data-lesson]').forEach(button=>button.addEventListener('click',()=>{let x=lessons[button.dataset.lesson];content.innerHTML=`<p class="eyebrow cyan">${x.kicker}</p><h2 id="lesson-title">${x.title}</h2><p>${x.intro}</p><h3>Votre exercice en trois étapes</h3><ol>${x.steps.map(s=>`<li>${s}</li>`).join('')}</ol><div class="lesson-action"><strong>Votre premier pas</strong><p>${x.action}</p></div><a class="text-link" href="${x.link}" target="_blank" rel="noopener">Approfondir sur le site EFA actuel ↗</a>`;dialog.showModal()}));document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

/* V2 laboratoire : onglets, blocs « + », navigation par ancre */
(function(){
  const onglets=[...document.querySelectorAll('.tabbar [role=tab]')];
  const panneaux=[...document.querySelectorAll('.panel')];
  const ids=panneaux.map(p=>p.id);
  function activer(id){
    if(!ids.includes(id)) id='apprendre';
    panneaux.forEach(p=>{p.hidden=p.id!==id});
    onglets.forEach(o=>{const on=o.dataset.tab===id;o.setAttribute('aria-selected',String(on));o.tabIndex=on?0:-1});
    document.querySelectorAll('.desktop-nav a').forEach(a=>a.style.color=a.getAttribute('href')==='#'+id?'var(--cyan)':'');
  }
  function suivre(ancre,defiler){
    const cible=ancre&&document.getElementById(ancre);
    if(!cible){activer('apprendre');return}
    const panneau=cible.closest('.panel');
    activer(panneau?panneau.id:'apprendre');
    if(cible.tagName==='DETAILS') cible.open=true;
    if(defiler) requestAnimationFrame(()=>cible.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
  }
  onglets.forEach((o,i)=>{
    o.addEventListener('click',()=>{activer(o.dataset.tab);history.replaceState(null,'','#'+o.dataset.tab);document.querySelector('.tabbar').scrollIntoView({block:'start'})});
    o.addEventListener('keydown',ev=>{
      if(ev.key!=='ArrowRight'&&ev.key!=='ArrowLeft')return;
      const n=onglets[(i+(ev.key==='ArrowRight'?1:onglets.length-1))%onglets.length];n.focus();n.click();
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',ev=>{
    const id=a.getAttribute('href').slice(1);const cible=document.getElementById(id);
    if(!cible||!cible.closest('.panel'))return;
    ev.preventDefault();history.replaceState(null,'','#'+id);suivre(id,true);
  }));
  document.querySelectorAll('[data-tout]').forEach(b=>b.addEventListener('click',()=>{
    const blocs=[...document.querySelectorAll('#'+b.dataset.tout+' .bloc')];
    const ouvrir=blocs.some(d=>!d.open);blocs.forEach(d=>d.open=ouvrir);b.textContent=ouvrir?'Tout fermer':'Tout ouvrir';
  }));
  addEventListener('hashchange',()=>suivre(location.hash.slice(1),true));
  suivre(location.hash.slice(1),false);
})();
/* Bandeau des principes (gauche → droite) et fil EFA News · BRVM */
(function(){
  var run=document.getElementById('fil-run');if(!run)return;
  var f=function(n,d){return Number(n).toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d});};
  var v=function(x){return '<em class="'+(x>0?'up':x<0?'down':'flat')+'">'+(x>0?'▲ +':x<0?'▼ −':'■ ')+f(Math.abs(x),2)+' %</em>';};
  var it=[],B=(window.EFA_DATA||{}).brvm,N=window.EFA_NEWS||[];
  var news=N.map(function(n){return {c:'EFA NEWS',t:n.t,h:n.h};});
  var brvm=[];
  if(B&&B.indices&&B.indices.length){
    B.indices.slice(0,3).forEach(function(i){brvm.push({c:'BRVM',t:i[0]+' <b>'+f(i[2],2)+'</b> '+v(i[3])+' · séance du '+B.seance,h:'../methode.html#brvm'});});
    var a=(B.actions||[]).slice().sort(function(x,y){return y[4]-x[4];});
    if(a.length){brvm.push({c:'BRVM',t:'Plus forte hausse : '+a[0][1]+' '+v(a[0][4]),h:'../methode.html#brvm'});
      brvm.push({c:'BRVM',t:'Plus forte baisse : '+a[a.length-1][1]+' '+v(a[a.length-1][4]),h:'../methode.html#brvm'});}
  }
  var efa=(window.EFA_IT||[]).map(function(n){return {c:'EFA',t:n.t,h:n.h};});
  var auto=efa.concat(news), n=Math.max(auto.length,brvm.length*3);
  for(var k=0;k<auto.length;k++){if(k%3===0&&brvm[k/3])it.push(brvm[k/3]);it.push(auto[k]);}
  if(!it.length){document.getElementById('fil').hidden=true;return;}
  var h=it.map(function(x){return '<a class="fil-it" href="'+x.h+'"><span class="fil-cat '+(x.c==='BRVM'?'b':'n')+'">'+x.c+'</span>'+x.t+'</a>';}).join('');
  run.innerHTML=h+h;run.style.setProperty('--dur',(it.length*6)+'s');
  var root=document.getElementById('fil'),pb=root.querySelector('.fil-pause');
  pb.addEventListener('click',function(){var p=root.classList.toggle('pause');pb.setAttribute('aria-pressed',String(p));pb.textContent=p?'▶':'❚❚';pb.setAttribute('aria-label',p?'Reprendre le défilement':'Mettre en pause le défilement');});
})();
/* Actualités EFA News : une ligne monte toutes les 3,5 s, pause au survol */
(function(){
  var vue=document.getElementById('mef-news');if(!vue)return;
  var ul=vue.querySelector('ul'),items=[].slice.call(ul.children);if(items.length<5)return;
  items.forEach(function(li){ul.appendChild(li.cloneNode(true));});
  [].slice.call(ul.children).slice(items.length).forEach(function(li){li.setAttribute('aria-hidden','true');li.querySelector('a').tabIndex=-1;});
  var i=0,pause=false,red=matchMedia('(prefers-reduced-motion: reduce)').matches;if(red){vue.style.overflowY='auto';return;}
  vue.addEventListener('mouseenter',function(){pause=true;});vue.addEventListener('mouseleave',function(){pause=false;});
  vue.addEventListener('focusin',function(){pause=true;});vue.addEventListener('focusout',function(){pause=false;});
  setInterval(function(){if(pause||document.hidden)return;i++;var h=ul.children[0].offsetHeight;ul.style.transition='transform .7s ease';ul.style.transform='translateY(-'+(i*h)+'px)';
    if(i===items.length){setTimeout(function(){ul.style.transition='none';i=0;ul.style.transform='translateY(0)';},750);}},3500);
})();

