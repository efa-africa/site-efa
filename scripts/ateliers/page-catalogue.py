#!/usr/bin/env python3
"""EFA · Fabrique ateliers.html : tous les ateliers rangés par thème.
Chaque thème : un parcours principal (dans l'ordre) puis les ateliers à la carte, en rangées qu'on fait glisser.
Source : data/mon-efa-ateliers.json (node scripts/mon-efa/catalogue.js) + THEMES ci-dessous.
Usage : python3 scripts/ateliers/page-catalogue.py  puis  python3 scripts/clone/habiller.py --page ateliers.html
Un atelier absent de THEMES est signalé : l'ajouter dans un thème."""
import json, os, re, html
os.chdir(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
D = json.load(open('data/mon-efa-ateliers.json', encoding='utf-8'))
D['jeu-portefeuille-baisse'] = {'t': 'Jeu : mon portefeuille face à la baisse', 'n': 0, 'page': 'jeu-portefeuille-baisse.html', 'prix': 0, 'jeu': 1}
verrou = open('efa-verrou.js', encoding='utf-8').read()
UNITE = set(re.findall(r"'atelier-[^']+': \['([^']+)', \d+, '[^']*', \d, \d, 'unite'\]", verrou))

THEMES = [
  ('budget', 'Mon budget au quotidien', 'Savoir où part l’argent, tenir un budget et se constituer une réserve.', 'coach-budget-3.webp',
   ['ou-passe-mon-argent', 'budget-qui-tient', 'reserve-securite', 'mobile-money-frais'], ['budget-zero', 'finances-personnelles', 'epargner-ne-suffit-pas', 'grosse-somme', 'preter-ou-donner']),
  ('placer', 'Placer mon épargne', 'Choisir un placement selon la date de vos projets, et le comprendre avant de signer.', 'theme-placer-900.webp',
   ['epargner-ne-suffit-pas', 'placer-selon-horizon', 'placements-expliques', 'revenu-fixe', 'fonds-commun', 'strategie-investissement'], ['court-terme', 'bons-du-tresor', 'economie-pour-investir', 'inflation', 'crypto-reseaux', 'assurance-vie', 'tontine-spirale']),
  ('bourse', 'La Bourse (BRVM)', 'De zéro à votre portefeuille : comprendre, choisir une action, construire, encaisser des dividendes.', 'marches-entree-r.webp',
   ['premiers-pas-bourse', 'premiere-action', 'lire-societe-cotee', 'construire-son-portefeuille', 'portefeuille-factures'], ['investir-dividendes', 'etats-financiers', 'marche-emergent', 'premier-ordre-brvm', 'economie-pour-investir', 'jeu-portefeuille-baisse']),
  ('credit', 'Crédit et dettes', 'Emprunter quand c’est utile, en connaître le vrai coût, et sortir des dettes.', 'q3.webp',
   ['credit-fait-pour-moi', 'cout-reel-de-mon-credit', 'ma-banque-va-t-elle-me-preter', 'bien-utiliser-mon-credit', 'rembourser-sans-se-noyer'],
   ['eviter-le-surendettement', 'sortir-dettes', 'quand-le-credit-va-mal', 'grandir-avec-le-credit', 'choisir-sa-microfinance']),
  ('activite', 'Mon activité', 'Séparer la caisse de la maison, savoir si l’on gagne vraiment, investir au bon moment.', 'coach-entreprise.webp',
   ['ou-est-l-argent-de-mon-activite', 'commerce-sans-comptabilite', 'activite-gagne-t-elle', 'investir-activite'], ['inflation', 'lire-business-plan']),
  ('famille', 'Famille et retraite', 'Préparer sa retraite, financer les études, faire face aux grands moments.', 'atelier-pilier-famille.webp',
   ['retraite-droits', 'retraite-sans-pension', 'assurance-vie'], ['etudes-enfant', 'deces-parent', 'preter-ou-donner']),
  ('terrain', 'Terrain et logement', 'Savoir ce que vos revenus permettent, et acheter un lot sans se faire avoir.', 'univers-terrain.webp',
   ['acheter-construire-attendre', 'acheter-un-lot'], []),
  ('arnaques', 'Se protéger des arnaques', 'Reconnaître la promesse trop belle et le faux conseiller, avant de payer.', 'gen-arnaques.webp',
   ['avant-de-confier-ou-d-investir', 'rendement-garanti', 'faux-conseiller'], ['crypto-reseaux', 'vente-en-reseau']),
]
vus = {i for th in THEMES for i in th[4] + th[5]}
manque = [k for k in D if k not in vus]
if manque: print('À ranger dans un thème :', manque)
for th in THEMES:
    for i in th[4] + th[5]: assert i in D, i

e = lambda s: html.escape(s, quote=True)
def prix(i, a):
    if a.get('jeu'): return '<span class="px g">Jeu gratuit</span>'
    if not a['prix']: return '<span class="px g">Gratuit</span>'
    if i in UNITE: return '<span class="px">Abonnés</span><span class="px2">ou 5 000 F à l’unité</span>'
    return '<span class="px">Abonnés</span>' + ('<span class="px2">chapitre 1 offert</span>' if a.get('offerts') else '')
def carte(i, k=None):
    a = D[i]; n = a.get('n') or 0
    meta = 'Jeu · 5 minutes' if a.get('jeu') else ('%d activités' % n if n else 'Avec Élysée Johnson')
    return ('<a class="ca" href="%s" data-id="%s"><span class="ca-n">%s</span><h3>%s</h3><span class="ca-m">%s</span>'
            '<span class="ca-pr" hidden><i></i></span><span class="ca-b">%s</span></a>') % (
        e(a['page']), e(i), ('Étape %d' % k) if k else 'À la carte', e(a['t']), meta, prix(i, a))
FL = '<span class="fl"><button type="button" data-d="-1" aria-label="Précédents">‹</button><button type="button" data-d="1" aria-label="Suivants">›</button></span>'
blocs, puces = [], []
for cle, titre, chapo, img, parc, carteL in THEMES:
    nb = len(parc) + len(carteL)
    puces.append('<a href="#%s">%s <small>%d</small></a>' % (cle, e(titre), nb))
    s = ('<section class="th" id="%s" aria-labelledby="t-%s"><div class="th-tete"><img src="clone/assets/%s" alt="" loading="lazy" width="900" height="506">'
         '<div><p class="th-k">%d ateliers</p><h2 id="t-%s">%s</h2><p>%s</p></div></div>') % (cle, cle, img, nb, cle, e(titre), e(chapo))
    s += '<div class="rg"><div class="rg-t"><h3>Le parcours</h3><span>%d étapes, dans l’ordre</span>%s</div><div class="rail parc">%s</div></div>' % (
        len(parc), FL, ''.join(carte(i, k + 1) for k, i in enumerate(parc)))
    if carteL:
        s += '<div class="rg"><div class="rg-t"><h3>À la carte</h3><span>selon votre situation</span>%s</div><div class="rail">%s</div></div>' % (FL, ''.join(carte(i) for i in carteL))
    blocs.append(s + '</section>')
total = len(D)

modele = open('mon-efa.html', encoding='utf-8').read()
entete = re.search(r'<header class="header clone-head".*?</header>\n<header data-v1-cache class="top"></header>', modele, re.S).group(0)
pied = modele[modele.index('<section class="efa-pourvous"'):modele.index('<script src="clone/habillage.js')]

CSS = r"""
:root{--nuit:#0B1220;--fond:#F1F7FA;--papier:#FFFFFF;--line:#DCE8ED;--corail:#DA3C1B;--corail-texte:#B8341A;--bleu:#1B71B2;--bleu-pale:#E6F2FC;--vert:#1E8E57;--vert-pale:#E3F4EA;--ink:#2A3142;--ink2:#4E5566;--ink3:#5F6676;
--f-display:"Libre Baskerville",Baskerville,Georgia,"Times New Roman",serif;--f-body:"Source Sans 3","Source Sans Pro",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;
--gut-g:max(16px,env(safe-area-inset-left,0px));--gut-d:max(16px,env(safe-area-inset-right,0px))}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-padding-top:120px}
body{margin:0;background:#F1F7FA;color:var(--ink);font-family:var(--f-body);font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.cat h1,.cat h2,.cat h3{font-family:var(--f-display);font-weight:700;line-height:1.15;margin:0;text-wrap:balance;color:#0B1220;text-transform:none;letter-spacing:-.005em}
.cat p{margin:0}.cat a{text-decoration:none;color:inherit}
.cat :focus-visible{outline:3px solid var(--bleu);outline-offset:3px}
.cat{max-width:1180px;margin:0 auto;padding:28px var(--gut-d) 56px var(--gut-g)}
.cat-k{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:var(--corail-texte);margin-bottom:10px!important}
.cat h1{font-size:clamp(34px,6vw,58px)}
.cat-chapo{font-size:clamp(17px,2vw,19px);color:var(--ink2);max-width:62ch;margin-top:12px!important}
.puces{position:sticky;top:var(--haut,64px);z-index:5;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:22px calc(-1*var(--gut-g)) 0;padding:10px var(--gut-d) 10px var(--gut-g);background:#FFFFFF}
.puces::-webkit-scrollbar{display:none}
.puces a{flex:0 0 auto;font-size:14.5px;font-weight:700;padding:9px 14px;border-radius:999px;background:#EEF5FC!important;color:#0B1220!important}
.puces a small{font-weight:800;color:var(--ink3);margin-left:4px}
.puces a.on{background:#0B1220!important;color:#fff!important}.puces a.on small{color:#C9D1DE}
.reprise{margin-top:26px}
.th{margin-top:44px}
.th-tete{display:grid;grid-template-columns:minmax(0,300px) 1fr;gap:20px;align-items:center}
.th-tete img{width:100%!important;height:auto!important;aspect-ratio:16/9!important;object-fit:cover;border-radius:14px;display:block;background:#DCE8ED}
.th-k{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--bleu)}
.th h2{font-size:clamp(26px,3.6vw,38px);margin-top:6px}
.th-tete p:last-child{color:var(--ink2);margin-top:8px;max-width:56ch}
.rg{margin-top:20px}
.rg-t{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.rg-t h3{font-size:19px}.rg-t .fl{margin-left:auto;display:none;gap:6px}.fl button{width:40px;height:40px;border-radius:999px;border:0;background:#EEF5FC;color:#0B1220;font-size:20px;font-weight:800;cursor:pointer}
@media (hover:hover) and (min-width:900px){.rg-t .fl{display:flex}}.rg-t span{font-size:14.5px;color:var(--ink3)}
.rail{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(-1*var(--gut-g));padding:4px var(--gut-d) 14px var(--gut-g);scroll-padding-left:var(--gut-g);scrollbar-width:thin;overscroll-behavior-x:contain}
.ca{flex:0 0 min(78vw,250px);scroll-snap-align:start;display:flex;flex-direction:column;gap:8px;background:#EEF5FC!important;box-shadow:none!important;border:0!important;border-radius:14px;padding:18px 18px 16px;min-height:200px;transition:transform .15s}
.ca:hover{transform:translateY(-2px)}
.parc .ca{background:#0B1220!important;color:#fff!important}
.parc .ca h3{color:#fff!important}
.ca-n{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--corail-texte)}
.parc .ca-n{color:#F09680}
.ca h3{font-size:18px;line-height:1.22}
.ca-m{font-size:14.5px;color:var(--ink3)}.parc .ca-m{color:#C9D1DE}
.ca-pr{height:6px;border-radius:99px;background:rgba(127,140,160,.25);overflow:hidden}
.ca-pr i{display:block;height:100%;background:#3CCB7F;border-radius:99px}
.ca-b{margin-top:auto;display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px}
.px{font-size:13px;font-weight:800;padding:4px 10px;border-radius:999px;background:#FFFFFF;color:var(--bleu)}
.px.g{background:#FFFFFF;color:var(--vert)}
.parc .px{background:#1B2B47;color:#6DB8F2}.parc .px.g{background:#173B2B;color:#3CCB7F}
.px2{font-size:13px;color:var(--ink3)}.parc .px2{color:#C9D1DE}
.ca-ok{font-size:13px;font-weight:800;color:var(--vert)}.parc .ca-ok{color:#3CCB7F}
.aide{margin-top:52px;background:#EEF5FC;border-radius:14px;padding:22px;display:flex;flex-wrap:wrap;gap:14px 24px;align-items:center;justify-content:space-between}
.aide p{max-width:60ch;color:var(--ink2)}.aide b{color:#0B1220}
.bouton{display:inline-flex;align-items:center;font-weight:800;font-size:16px;min-height:46px;padding:12px 22px;border-radius:8px;background:var(--corail);color:#fff!important}
.eli{margin-top:52px;background:#0B1220;color:#fff;border-radius:14px;padding:22px;display:grid;grid-template-columns:140px 1fr;gap:22px;align-items:center}
.eli img{width:140px!important;height:175px!important;max-width:none!important;object-fit:cover!important;object-position:50% 12%;border-radius:12px!important;display:block}
.cat .eli h2{color:#fff;font-size:clamp(24px,3vw,32px);margin-top:6px}.eli p:not(.th-k){color:#C9D1DE;margin-top:8px!important;max-width:56ch}
.eli-b{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.bouton.b2{background:#FFFFFF;color:#0B1220!important}
@media (max-width:640px){.eli{grid-template-columns:1fr;gap:14px}.eli img{width:88px!important;height:88px!important;border-radius:999px!important}.th-tete{grid-template-columns:1fr}.th-tete img{aspect-ratio:21/9!important}}
"""
JS = r"""
(function(){
  function lire(k){ try{ return JSON.parse(localStorage.getItem(k)||'null'); }catch(e){ return null; } }
  var cours=[];
  document.querySelectorAll('.ca[data-id]').forEach(function(c){
    var n=+(c.querySelector('.ca-m').textContent.match(/\d+/)||[0])[0], s=lire('efa-at-'+c.dataset.id); if(!s||!s.etat||!n) return;
    var f=Object.keys(s.etat).filter(function(k){return s.etat[k];}).length; if(!f) return;
    var pr=c.querySelector('.ca-pr'); pr.hidden=false; pr.firstChild.style.width=Math.min(100,f/n*100)+'%';
    c.querySelector('.ca-b').insertAdjacentHTML('afterbegin','<span class="ca-ok">'+(f>=n?'Terminé ✓':f+' sur '+n)+'</span>');
    if(f<n&&cours.indexOf(c.dataset.id)<0) cours.push(c.dataset.id);
  });
  if(cours.length){ var z=document.getElementById('reprise'), r=z.querySelector('.rail');
    cours.forEach(function(id){ var c=document.querySelector('.ca[data-id="'+id+'"]').cloneNode(true); c.querySelector('.ca-n').textContent='Je continue'; r.appendChild(c); }); z.hidden=false; }
  document.addEventListener('click',function(ev){ var b=ev.target.closest&&ev.target.closest('.fl button'); if(!b) return; var r=b.closest('.rg').querySelector('.rail'); r.scrollBy({left:+b.dataset.d*r.clientWidth*.8,behavior:'smooth'}); });
  var h=document.querySelector('.clone-head'); if(h) document.documentElement.style.setProperty('--haut',h.offsetHeight+'px');
  var P=[].slice.call(document.querySelectorAll('.puces a')), T=P.map(function(a){return document.querySelector(a.getAttribute('href'));});
  if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting){ var i=T.indexOf(x.target); P.forEach(function(a,j){a.classList.toggle('on',j===i);}); var a=P[i]; a.parentNode.scrollTo({left:a.offsetLeft-16,behavior:'smooth'}); } }); },{rootMargin:'-40% 0px -55% 0px'}); T.forEach(function(t){io.observe(t);}); }
})();
"""
page = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"><link rel="icon" type="image/png" href="clone/assets/efa-oiseau.png"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B1220">
<title>Les ateliers EFA · par thème, en parcours ou à la carte</title>
<link rel="canonical" href="https://efa.africa/ateliers">

<meta name="description" content="Tous les ateliers EFA rangés par thème : budget, épargne, Bourse (BRVM), crédit, activité, famille et retraite, terrain, arnaques. Suivez le parcours d’un thème ou choisissez à la carte.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap">
<style>%s</style>
</head>
<body>
%s
<main class="cat" id="ateliers" data-garde>
  <p class="cat-k">Les ateliers EFA · %d ateliers</p>
  <h1>Choisissez un thème. Suivez le parcours, ou piochez.</h1>
  <p class="cat-chapo">Chaque thème a son parcours principal, dans l’ordre, puis des ateliers à la carte selon votre situation. Faites glisser les rangées pour tout voir. Vos ateliers commencés restent dans Mon EFA.</p>
  <nav class="puces" aria-label="Thèmes">%s</nav>
  <section class="reprise" id="reprise" hidden aria-label="Je continue"><div class="rg-t"><h3>Je continue</h3><span>là où je me suis arrêté</span></div><div class="rail"></div></section>
  %s
  <section class="eli" aria-labelledby="eli-t"><img src="elysee-portrait.jpg" alt="Portrait d’Élysée Johnson" width="606" height="909" loading="lazy"><div><p class="th-k" style="color:#6DB8F2">Avec Élysée Johnson</p><h2 id="eli-t">Votre cas, avec le fondateur d’EFA.</h2><p>Des ateliers approfondis où il répond personnellement à votre question, et des rendez-vous pour décider.</p><div class="eli-b"><a class="bouton" href="ateliers-elysee.html#coaching-elysee">Les ateliers avec Élysée</a><a class="bouton b2" href="ateliers-elysee.html#rendez-vous-elysee">Réserver un rendez-vous</a></div></div></section>
  <div class="aide"><p><b>Vous ne savez pas par où commencer ?</b> Le diagnostic vous indique le thème qui compte le plus pour vous aujourd’hui, en 3 minutes.</p><a class="bouton" href="diagnostic.html">Faire mon diagnostic</a></div>
</main>
<script>%s</script>
%s</body>
</html>
""" % (CSS, entete, total, ''.join(puces), '\n'.join(blocs), JS, pied)
open('ateliers.html', 'w', encoding='utf-8').write(page)
print('ateliers.html : %d ateliers, %d thèmes' % (total, len(THEMES)))
