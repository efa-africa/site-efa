# Page « J'ai une question » : un moteur de recherche qui répond par du contenu gratuit et 2 ateliers.
# Fabrique data/question-index.json (contenus gratuits du sitemap) et question.html, puis l'habille.
import re, os, json, html, subprocess
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
E = lambda t: html.escape(str(t), quote=True)

verrou = open('efa-verrou.js', encoding='utf-8').read()
PAYANTES = set(re.findall(r"'([a-z0-9-]+)': *\['[a-z0-9-]+', *\d+", verrou))
EXCLUES = set('''index abonnement demo quiz lettre organisations rendez-vous rejoindre programme-organisation cadres dirigeants patrimoine
certificat-maitrise certificat-patrimoine certificat-cefa etudiants auteur tribunes methode ely ceo corporate traders news decryptage
outils investir bibliotheque ateliers ateliers-elysee parcours'''.split())
OUTILS = set('''diagnostic ou-est-passe-mon-argent cercle-spirale preparer-ma-retraite valoriser-mon-entreprise outil-budget generateur-de-projet
decider point-de-depart choisir-son-rang-tontine cout-total-credit liberte-financiere mon-business-plan-tient-il jeu-portefeuille-baisse'''.split())

def texte(s):
    s = re.sub(r'<(script|style|header|footer|nav|template)\b.*?</\1>', ' ', s, flags=re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()

def genre(p):
    if p.startswith('news/'): return 'Actualité'
    if p.startswith('decryptage-'): return 'Décryptage'
    if p.startswith('etude-'): return 'Étude'
    if p.startswith('africa-2075'): return 'Prospective'
    if p[:-5] in OUTILS: return 'Outil gratuit'
    if p.startswith(('ecole-', 'bourse-', 'tontine-formations')): return 'Cours gratuit'
    return 'Guide'

locs = re.findall(r'<loc>https://efa.africa/([^<]*)</loc>', open('sitemap.xml', encoding='utf-8').read())
IDX = []
for l in locs:
    p = (l or 'index') + ('' if l.endswith('.html') else '.html')
    nom = p[:-5]
    if '?' in p or not os.path.exists(p) or nom in EXCLUES or nom in PAYANTES or nom.startswith(('atelier-', 'ateliers-')): continue
    s = open(p, encoding='utf-8').read()
    t = re.search(r'<title>([^<]*)</title>', s)
    t = html.unescape(t.group(1)).split(' · ')[0].strip() if t else nom
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    d = html.unescape(d.group(1)) if d else ''
    hs = [texte(h) for h in re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', s, flags=re.S)][:14]
    corps = s[s.find('<main'):s.find('</main>')] if '<main' in s else s
    IDX.append({'t': t, 'p': p, 'k': genre(p), 'd': d[:220], 'h': hs, 'x': texte(corps)[:2500]})
os.makedirs('data', exist_ok=True)
json.dump(IDX, open('data/question-index.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

MOTS = ['Faire mon budget', 'Épargner', 'Tontine', 'Bourse (BRVM)', 'Crédit et dettes', 'Retraite', 'Arnaques', 'Acheter un terrain',
        'Lancer une activité', 'Mobile money', 'Dividendes', 'Bons du Trésor']

PAGE = '''<!DOCTYPE html>
<html data-clone data-clone-coquille lang="fr">
<head>
<meta charset="utf-8"><link rel="icon" type="image/png" href="clone/assets/efa-oiseau.png"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B1220">
<title>J’ai une question · EFA</title>
<link rel="canonical" href="https://efa.africa/question">
<meta name="description" content="Posez votre question d’argent : budget, épargne, tontine, crédit, Bourse, retraite. EFA vous montre les contenus gratuits qui y répondent et les 2 ateliers pour aller au bout.">
<meta property="og:type" content="website"><meta property="og:title" content="J’ai une question · EFA">
<meta property="og:description" content="Posez votre question d’argent. On vous montre où trouver la réponse.">
<meta property="og:image" content="https://efa.africa/clone/assets/budget-entree.webp">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap">
<style>
.qn{max-width:1060px;margin:0 auto;padding:30px max(16px,env(safe-area-inset-left,0px)) 70px;font-family:"Source Sans 3",system-ui,sans-serif;color:#2A3142}
.qn *{box-sizing:border-box}
.qn-k{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#DA3C1B;margin:0}
.qn h1{font-family:"Libre Baskerville",Georgia,serif;font-weight:700;font-size:clamp(32px,5.4vw,56px);line-height:1.12;color:#0B1220;margin:12px 0 0;text-wrap:balance}
.qn-chapo{font-size:clamp(17px,2vw,19px);color:#4E5566;max-width:60ch;margin:12px 0 0}
.qn-f{display:flex;gap:10px;margin-top:26px;background:#FFFFFF;border-radius:16px;padding:10px;box-shadow:0 14px 34px -24px rgba(11,18,32,.55)}
.qn-f input{flex:1;min-width:0;border:0!important;outline:0;background:transparent!important;font:400 18px/1.4 "Source Sans 3",system-ui,sans-serif!important;color:#0B1220!important;padding:10px 8px!important}
.qn-f button{flex:0 0 auto;border:0;border-radius:10px;background:#DA3C1B;color:#fff;font:800 16px/1 "Source Sans 3",system-ui,sans-serif;padding:0 20px;min-height:48px;cursor:pointer}
.qn-f:focus-within{box-shadow:0 0 0 3px #6DB8F2,0 14px 34px -24px rgba(11,18,32,.55)}
.qn-mots{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.qn-mots button{border:0;border-radius:999px;background:#FFFFFF;color:#0B1220;font:700 15px/1 "Source Sans 3",system-ui,sans-serif;padding:10px 14px;cursor:pointer}
.qn-mots button:hover{background:#E6F2FC}
.qn-ex{font-size:15px;color:#5F6676;margin:14px 0 0}
.qn-ex a{color:#1B71B2;font-weight:700;cursor:pointer}
#qn-res{margin-top:38px}
.qn h2{font-family:"Libre Baskerville",Georgia,serif;font-weight:700;font-size:clamp(23px,3vw,30px);line-height:1.15;color:#0B1220;margin:0}
.qn-sous{color:#4E5566;margin:6px 0 0}
.qn-gr{display:grid;gap:10px;margin-top:16px}
.qn-c{display:block;background:#FFFFFF;border-radius:14px;padding:16px 18px;color:#2A3142!important;text-decoration:none!important;transition:background .15s}
.qn-c:hover{background:#E6F2FC}
.qn-c .tg{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#1B71B2;margin-bottom:4px}
.qn-c .tg.g{color:#1F8A55}
.qn-c h3{font-family:"Libre Baskerville",Georgia,serif;font-weight:700;font-size:19px;line-height:1.22;color:#0B1220;margin:0}
.qn-c p{margin:6px 0 0;font-size:15.5px;color:#4E5566}
.qn mark{background:#FDE3DC;color:inherit;border-radius:3px;padding:0 2px}
.qn-at{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:16px}
.qn-a{display:flex;flex-direction:column;background:#0B1220;border-radius:16px;overflow:hidden;color:#fff!important;text-decoration:none!important}
.qn-a img{display:block;width:100%!important;height:auto!important;aspect-ratio:4/5;object-fit:contain;background:#06182E}
.qn-a span.b{display:flex;flex-direction:column;gap:6px;padding:14px 16px}
.qn-a b{font-family:"Libre Baskerville",Georgia,serif;font-size:17px;line-height:1.25}
.qn-a i{font-style:normal;font-size:14px;color:#C9D1DE}
.qn-a em{font-style:normal;align-self:flex-start;font-size:13px;font-weight:800;border-radius:999px;padding:5px 10px;background:#1B2B47;color:#6DB8F2}
.qn-a em.g{background:#173B2B;color:#3CCB7F}
.qn-bloc{margin-top:40px}
.qn-vide{background:#FFFFFF;border-radius:14px;padding:18px;margin-top:16px}
.qn-aide{margin-top:44px;background:#0B1220;color:#E8EDF5;border-radius:16px;padding:22px 22px}
.qn-aide p{margin:0}.qn-aide b{color:#fff;font-family:"Libre Baskerville",Georgia,serif;font-size:20px}
.qn-aide a{display:inline-block;margin-top:12px;background:#DA3C1B;color:#fff!important;font-weight:800;border-radius:8px;padding:12px 18px;text-decoration:none!important}
@media(max-width:560px){.qn-f{flex-direction:column}.qn-f button{width:100%}.qn-at{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.qn-a span.b{padding:10px 12px}.qn-a b{font-size:15px}}
</style>
</head>
<body>
<header class="top"></header>
<main class="qn" id="contenu" data-garde>
  <p class="qn-k">J’ai une question</p>
  <h1>Posez votre question. On vous montre où trouver la réponse.</h1>
  <p class="qn-chapo">Écrivez-la avec vos mots. Nous cherchons dans tous les contenus gratuits d’EFA, et nous vous proposons les 2 ateliers qui vont au bout du sujet.</p>
  <form class="qn-f" id="qn-f" role="search" autocomplete="off">
    <label for="qn-q" class="vh" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Votre question</label>
    <input id="qn-q" name="q" type="search" placeholder="Ex. : comment épargner avec un petit salaire ?" enterkeyhint="search">
    <button type="submit">Chercher</button>
  </form>
  <div class="qn-mots" aria-label="Mots clés">%%MOTS%%</div>
  <p class="qn-ex">Ou essayez : <a data-q="Dois-je prêter de l’argent à ma sœur ?">Dois-je prêter de l’argent à ma sœur ?</a> · <a data-q="Comment acheter une action à la BRVM ?">Comment acheter une action à la BRVM ?</a> · <a data-q="Que faire de ma tontine ?">Que faire de ma tontine ?</a></p>
  <div id="qn-res" aria-live="polite"></div>
  <section class="qn-aide"><p><b>Vous ne trouvez pas votre réponse ?</b></p><p style="margin-top:6px">Posez-la à notre équipe : nous y répondons, et elle nous aide à écrire les prochains contenus.</p><a href="rendez-vous.html#contact">Poser ma question à EFA</a></section>
</main>
<footer class="efa-foot"></footer>
<script>
(function(){
  var F=document.getElementById('qn-f'), Q=document.getElementById('qn-q'), R=document.getElementById('qn-res'), C=null, A=null;
  function nz(t){ return String(t||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[’']/g,' '); }
  function mo(t){ return ' '+nz(t).replace(/[^a-z0-9]+/g,' ')+' '; }
  var SYN={bourse:'brvm action actions dividende sgi',brvm:'bourse action sgi',action:'bourse brvm',dividende:'dividendes action bourse',
   credit:'pret emprunt dette dettes banque microfinance',dette:'dettes credit rembourser',pret:'credit emprunt preter',preter:'pret proche',emprunt:'credit pret',
   epargne:'epargner reserve placer',epargner:'epargne reserve',placer:'placement epargne',placement:'placer epargne fonds',
   budget:'depenses argent mois',salaire:'revenu budget',retraite:'pension cnps',arnaque:'arnaques escroquerie fraude rendement garanti',arnaques:'arnaque',
   tontine:'cotisation club rang',terrain:'lot maison logement construire',maison:'terrain logement',activite:'commerce business entreprise',
   lancer:'activite business projet declic',business:'activite commerce projet',entreprise:'activite commerce',tresor:'bons obligations etat dat',
   obligation:'obligations revenu fixe tresor',mobile:'money transfert frais',enfant:'enfants etudes famille',famille:'enfant parents deces'};
  var VIDES='de la le les des du un une et en mon ma mes je j me pour au aux que qui comment quoi est sur dans avec ce cette ces il elle on faut peux dois veux fait faire ai a quel quelle quels quelles est-ce ou si plus son sa ses vos votre nos notre tu te ne pas y'.split(' ');
  function mots(v){ return nz(v).split(/[^a-z0-9]+/).filter(function(m){ return m.length>1&&VIDES.indexOf(m)<0; }); }
  function rac(m){ return m.length>4?m.replace(/(es|s|x)$/,''):m; }
  function score(it,ms){ var s=0,n=0; ms.forEach(function(m){ var r=rac(m), al=[r].concat((SYN[m]||SYN[r]||'').split(' ').filter(Boolean).map(rac)), b=0;
      al.forEach(function(w,k){ var f=k?0.55:1, v=0, W=' '+w; if(it.T.indexOf(W)>=0) v=10; else if(it.D.indexOf(W)>=0) v=6; else if(it.H.indexOf(W)>=0) v=4; else if(it.X.indexOf(W)>=0) v=1.2+Math.min(3,it.X.split(W).length-2)*0.4; if(v*f>b) b=v*f; });
      if(b) n++; s+=b; }); return s*(0.4+0.6*n/ms.length); }
  function esc(t){ return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function surl(t,ms){ var h=esc(t); ms.forEach(function(m){ var r=rac(m); if(r.length<3) return; var re=new RegExp('(^|[^a-zà-ÿ])('+r.split('').map(function(c){ return '['+c+({a:'àâä',e:'éèêë',i:'îï',o:'ôö',u:'ùûü',c:'ç'}[c]||'')+']'; }).join('')+'[a-zà-ÿ]*)','gi'); h=h.replace(re,'$1<mark>$2</mark>'); }); return h; }
  function charger(cb){ if(C&&A) return cb(); Promise.all([fetch('data/question-index.json?v=%%V%%').then(function(r){return r.json();}),fetch('data/ateliers-recherche.json?v=%%V%%').then(function(r){return r.json();})]).then(function(d){
      C=d[0].map(function(a){ return {a:a,T:mo(a.t),D:mo(a.d),H:mo(a.h.join(' ')),X:mo(a.x)}; });
      A=d[1].map(function(a){ return {a:a,T:mo(a.t),D:mo(a.h+' '+a.th.join(' ')),H:mo(a.ch.join(' ')),X:mo(a.x)}; }); cb();
    }).catch(function(){ R.innerHTML='<p class="qn-vide">La recherche n’a pas pu se charger. Vérifiez votre connexion et réessayez.</p>'; }); }
  function top(L,ms,n){ var S=L.map(function(it){ return [score(it,ms),it]; }).filter(function(x){ return x[0]>=2; }).sort(function(a,b){ return b[0]-a[0]; }); if(!S.length) return []; var m=S[0][0]; return S.filter(function(x){ return x[0]>=m*0.4; }).slice(0,n).map(function(x){ return x[1].a; }); }
  function chercher(v,push){ var ms=mots(v); if(!ms.length){ R.innerHTML=''; return; }
    charger(function(){
      var c=top(C,ms,5), a=top(A,ms,2);
      var h='<section class="qn-bloc"><h2>À lire, gratuit</h2><p class="qn-sous">Pour « '+esc(v.trim())+' »</p>';
      h+= c.length ? '<div class="qn-gr">'+c.map(function(x){ return '<a class="qn-c" href="'+esc(x.p)+'?src=question"><span class="tg'+(x.k==='Outil gratuit'?' g':'')+'">'+esc(x.k)+'</span><h3>'+surl(x.t,ms)+'</h3>'+(x.d?'<p>'+surl(x.d,ms)+'</p>':'')+'</a>'; }).join('')+'</div>'
        : '<div class="qn-vide">Aucun contenu gratuit ne répond encore à cette question. Essayez un mot plus simple : budget, épargne, tontine, crédit, Bourse, retraite.</div>';
      h+='</section>';
      if(a.length){ h+='<section class="qn-bloc"><h2>'+(a.length>1?'2 ateliers pour aller au bout':'L’atelier pour aller au bout')+'</h2><p class="qn-sous">Pas à pas, à votre rythme, avec des exercices sur votre situation.</p><div class="qn-at">'
        +a.map(function(x,k){ return '<a class="qn-a" href="'+esc(x.p)+'?src=question"><img src="clone/assets/affiches/'+(k?'sv/':'')+esc(x.id)+'.webp?v=1" alt="Affiche de l’atelier « '+esc(x.t)+' »" width="720" height="900" loading="lazy" onerror="this.remove()"><span class="b"><b>'+esc(x.t)+'</b><i>'+(x.n?x.n+' activités':'')+'</i><em class="'+(/gratuit/i.test(x.acc)?'g':'')+'">'+esc(x.acc)+'</em></span></a>'; }).join('')+'</div></section>'; }
      R.innerHTML=h;
      if(push){ try{ history.replaceState(null,'','?q='+encodeURIComponent(v.trim())); }catch(e){} R.scrollIntoView({behavior:'smooth',block:'start'}); }
    }); }
  F.addEventListener('submit',function(e){ e.preventDefault(); chercher(Q.value,true); Q.blur(); });
  [].forEach.call(document.querySelectorAll('.qn-mots button,.qn-ex a'),function(b){ b.addEventListener('click',function(){ Q.value=b.dataset.q; chercher(b.dataset.q,true); }); });
  Q.addEventListener('focus',function(){ charger(function(){}); },{once:true});
  var q0=new URLSearchParams(location.search).get('q'); if(q0){ Q.value=q0; chercher(q0,false); }
})();
</script>
</body>
</html>
'''
import time
V = time.strftime('%Y%m%d%H%M')
PAGE = PAGE.replace('%%MOTS%%', ''.join('<button type="button" data-q="%s">%s</button>' % (E(m), E(m)) for m in MOTS)).replace('%%V%%', V)
open('question.html', 'w', encoding='utf-8').write(PAGE)
subprocess.check_call(['python3', 'scripts/clone/habiller.py', '--page', 'question.html'], stdout=subprocess.DEVNULL)
print('question.html :', len(IDX), 'contenus gratuits indexés')
