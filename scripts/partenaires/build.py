# Page « Espaces partenaires » : la présentation des espaces publicitaires d'EFA aux banques, assureurs, SGI, sociétés de gestion, microfinances.
import os, subprocess
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
CLE_FORM = '426191fb-4812-4de4-b602-5857464c5916'

THEMES = [
  ('budget', 'Mon budget au quotidien', 'Banque · compte épargne, microfinance', 'Construire sa réserve, suivre ses dépenses, mobile money'),
  ('placer', 'Épargner et placer', 'Société de gestion · fonds communs, banque · dépôt à terme', 'Choisir un placement selon la date de ses projets'),
  ('bourse', 'Investir en Bourse (BRVM)', 'SGI · compte-titres', 'Ouvrir son compte, passer son premier ordre, toucher ses dividendes'),
  ('credit', 'Crédit et dettes', 'Banque ou microfinance · crédit responsable', 'Calculer le vrai coût d’un crédit, rembourser sans se noyer'),
  ('activite', 'Mon activité', 'Banque · financement des PME, microfinance', 'Séparer les caisses, savoir si l’on gagne, investir dans son activité'),
  ('famille', 'Famille et retraite', 'Société d’assurance · assurance-vie, retraite complémentaire', 'Préparer la retraite, financer les études, protéger les siens'),
  ('terrain', 'Terrain et logement', 'Banque · crédit immobilier, promoteur agréé', 'Ce que permettent ses revenus, acheter un lot sans se faire avoir'),
  ('arnaques', 'Éviter les arnaques', 'Banque · placements agréés', 'Reconnaître la promesse trop belle avant de payer'),
]
lignes = ''.join('<tr id="%s"><td><b>%s</b><small>%s</small></td><td>%s</td><td><span class="pill">Bientôt</span></td></tr>' % (c, t, m, p) for c, t, p, m in THEMES)
cats = ''.join('<option>%s</option>' % c for c in ['Banque', 'Microfinance', 'SGI', 'Société de gestion (OPCVM)', 'Société d’assurance', 'Promoteur immobilier', 'Autre'])
coches = ''.join('<label class="ck"><input type="checkbox" name="themes" value="%s"> %s</label>' % (t, t) for c, t, p, m in THEMES)

PAGE = '''<!DOCTYPE html>
<html data-clone data-clone-coquille lang="fr">
<head>
<meta charset="utf-8"><link rel="icon" type="image/png" href="clone/assets/efa-oiseau.png"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B1220">
<title>Espaces partenaires · EFA</title>
<link rel="canonical" href="https://efa.africa/partenaires">
<meta name="description" content="Banques, assureurs, SGI, sociétés de gestion, microfinances : présentez votre offre sur efa.africa au moment où elle devient utile, au cœur des ateliers, des guides et des outils.">
<meta property="og:type" content="website"><meta property="og:title" content="Espaces partenaires · EFA">
<meta property="og:description" content="Présentez votre offre au moment où elle devient utile.">
<meta property="og:image" content="https://efa.africa/clone/assets/theme-placer-900.webp">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap">
<style>
.pa{font-family:"Source Sans 3",system-ui,sans-serif;color:#2A3142}
.pa *{box-sizing:border-box}
.pa-in{max-width:1080px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.pa-hero{background:#0B1220;color:#E8EDF5;padding-block:56px 60px}
.pa-k{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#DA3C1B;margin:0}
.pa-hero .pa-k{color:#F09680}
.pa h1{font-family:"Libre Baskerville",Georgia,serif;font-weight:700;font-size:clamp(34px,5.6vw,60px);line-height:1.1;color:#fff;margin:12px 0 0;text-wrap:balance;max-width:18ch}
.pa-hero p.ch{font-size:clamp(17px,2vw,20px);color:#C9D1DE;max-width:58ch;margin:16px 0 0;line-height:1.5}
.pa-acts{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.pa-b{display:inline-flex;align-items:center;min-height:48px;padding:12px 20px;border-radius:8px;font-weight:800;font-size:16px;text-decoration:none!important;border:0;cursor:pointer;font-family:inherit}
.pa-b.r{background:#DA3C1B;color:#fff!important}.pa-b.s{background:#1F2C45;color:#fff!important}.pa-b.c{background:#FFFFFF;color:#0B1220!important}
.pa-sec{padding-block:54px}
.pa h2{font-family:"Libre Baskerville",Georgia,serif;font-weight:700;font-size:clamp(26px,3.6vw,40px);line-height:1.14;color:#0B1220;margin:8px 0 0;text-wrap:balance}
.pa p.sous{font-size:17.5px;color:#4E5566;max-width:62ch;margin:10px 0 0;line-height:1.5}
.g3{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin-top:24px}
.c{background:#FFFFFF;border-radius:14px;padding:22px}
.c h3{font-family:"Libre Baskerville",Georgia,serif;font-size:19px;line-height:1.22;color:#0B1220;margin:0}
.c p{margin:8px 0 0;font-size:16px;line-height:1.5;color:#4E5566}
.c .n{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:999px;background:#0B1220;color:#fff;font-weight:800;margin-bottom:12px}
.fmt{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:24px}
.fmt .c{display:flex;flex-direction:column}.fmt .c .pa-b{margin-top:auto;align-self:flex-start}
.fmt .c p{margin-bottom:16px}
.ex{background:#EAF3FB;border-radius:12px;padding:12px 14px;margin:0 0 16px;font-size:14px}
.ex b{display:block;font-family:"Libre Baskerville",Georgia,serif;font-size:15.5px;color:#0B1220}
.ex .k{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5F6676}
.tb-w{overflow-x:auto;margin-top:22px;background:#FFFFFF;border-radius:14px}
.tb{width:100%;border-collapse:collapse;font-size:15.5px}
.tb th{text-align:left;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7A8293;padding:14px 16px;background:#F5F8FA}
.tb td{padding:14px 16px;vertical-align:top;border-top:1px solid #E3EBF0}
.tb td b{display:block;color:#0B1220}.tb td small{display:block;color:#5F6676;font-size:14px;margin-top:2px}
.tb tr:target td{background:#EAF3FB}
.pill{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:#0B1220;color:#fff;border-radius:999px;padding:4px 10px}
.pour{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:24px}
.pour .c{background:#0B1220;color:#C9D1DE}.pour .c h3{color:#fff}.pour .c p{color:#C9D1DE}
.pour ul{margin:10px 0 0;padding-left:18px;font-size:15.5px;line-height:1.5}.pour li{margin:4px 0}
.regles{margin:22px 0 0;padding:0;list-style:none;display:grid;gap:10px}
.regles li{background:#FFFFFF;border-radius:12px;padding:14px 16px;font-size:16px}
.regles b{color:#0B1220}
.offres .c .px{font-size:14px;font-weight:800;color:#1B71B2;margin-top:12px}
.form{background:#FFFFFF;border-radius:16px;padding:24px;margin-top:24px;display:grid;gap:14px;max-width:760px}
.form label{display:grid;gap:6px;font-weight:700;font-size:15px;color:#0B1220}
.form input,.form select,.form textarea{font:400 16px "Source Sans 3",system-ui,sans-serif!important;padding:12px!important;border-radius:8px!important;border:1px solid #CBD5DD!important;background:#FFFFFF!important;color:#0B1220!important;width:100%}
.form .row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.form fieldset{border:0;padding:0;margin:0}.form legend{font-weight:700;font-size:15px;color:#0B1220;margin-bottom:8px}
.cks{display:flex;flex-wrap:wrap;gap:8px}
.ck{display:inline-flex!important;align-items:center;gap:8px!important;background:#F1F7FA;border-radius:999px;padding:8px 12px;font-weight:600!important;font-size:14.5px!important;cursor:pointer}
.ck input{width:auto!important;padding:0!important}
.ok{background:#173B2B;color:#fff;border-radius:12px;padding:16px;font-weight:700}
.err{color:#B3261E;font-weight:700}
@media(max-width:620px){.form .row{grid-template-columns:1fr}.pa-sec{padding-block:40px}.tb thead{display:none}.tb tr{display:grid;grid-template-columns:1fr auto;gap:4px 12px;padding:14px 16px;border-top:1px solid #E3EBF0}.tb tr:first-child{border-top:0}.tb td{border:0;padding:0}.tb td:nth-child(1){grid-column:1}.tb td:nth-child(2){grid-column:1;font-size:14.5px;color:#1B71B2;font-weight:700}.tb td:nth-child(3){grid-column:2;grid-row:1}}
</style>
</head>
<body>
<header class="top"></header>
<main class="pa" id="contenu" data-garde>
<section class="pa-hero"><div class="pa-in">
  <p class="pa-k">Espaces partenaires</p>
  <h1>Présentez votre offre au moment où elle devient utile.</h1>
  <p class="ch">Sur efa.africa, on apprend à gérer son argent : budget, épargne, crédit, Bourse, retraite, activité. Nos espaces partenaires placent votre offre au bon moment de cet apprentissage, au cœur des ateliers, des guides et des outils. Jamais en travers.</p>
  <div class="pa-acts"><a class="pa-b r" href="#contact">Réserver un espace</a><a class="pa-b s" href="#formats">Voir les formats</a></div>
</div></section>

<section class="pa-sec"><div class="pa-in">
  <p class="pa-k">Pourquoi c’est différent</p>
  <h2>Une audience qui apprend, avant d’agir.</h2>
  <div class="g3">
    <div class="c"><span class="n">1</span><h3>Au bon moment</h3><p>Votre offre d’assurance-vie apparaît quand la personne calcule sa retraite, votre compte-titres quand elle apprend à passer son premier ordre.</p></div>
    <div class="c"><span class="n">2</span><h3>Une décision préparée</h3><p>Ceux qui vous découvrent ont compris les bases : ils arrivent avec de meilleures questions, et des projets plus clairs.</p></div>
    <div class="c"><span class="n">3</span><h3>Dans le dessin du site</h3><p>Pas de bannière ni de clignotant : vos espaces ont la forme des contenus EFA, avec la mention « Partenaire d’EFA ».</p></div>
  </div>
</div></section>

<section class="pa-sec" id="formats" style="background:#E8F0F5"><div class="pa-in">
  <p class="pa-k">Les formats</p>
  <h2>Quatre espaces, chacun à sa place.</h2>
  <p class="sous">Touchez « Voir en vrai » : le format s’affiche sur cette page, comme vos futurs lecteurs le verront.</p>
  <div class="fmt">
    <div class="c"><h3>L’intercalaire</h3><p>Un plein écran entre deux chapitres d’un atelier. Il se passe après 3 secondes, une seule fois par atelier.</p><button class="pa-b r" type="button" data-demo="intercalaire">Voir en vrai</button></div>
    <div class="c"><h3>L’éphémère</h3><p>Une bulle qui monte en bas d’un guide ou d’un article, liée au sujet lu, puis disparaît seule après 8 secondes.</p><button class="pa-b r" type="button" data-demo="bulle">Voir en vrai</button></div>
    <div class="c"><h3>Sous le résultat d’un outil</h3><div class="ex"><span class="k">Partenaire d’EFA · Assurance-vie</span><b>Mettre de côté 40 000 F par mois, automatiquement ?</b>Simuler avec notre partenaire →</div><p>Juste après un calcul (budget, retraite, coût d’un crédit) : la suite logique de ce que la personne vient de découvrir.</p></div>
    <div class="c"><h3>La carte intégrée</h3><div class="ex"><span class="k">Partenaire d’EFA · SGI</span><b>Ouvrir votre compte-titres en ligne</b>Découvrir l’offre →</div><p>Parmi les ateliers d’un thème, au même format que les contenus EFA. <a href="ateliers-bourse.html" style="color:#1B71B2;font-weight:700">Voir l’emplacement réservé</a></p></div>
  </div>
</div></section>

<section class="pa-sec"><div class="pa-in">
  <p class="pa-k">Où apparaîtra votre marque</p>
  <h2>Un partenaire par catégorie, dans chaque thème.</h2>
  <p class="sous">Chaque thème réunit ateliers, guides et outils. Les espaces y sont ouverts par catégorie d’acteur : ils seront bientôt renseignés avec les offres de nos partenaires.</p>
  <div class="tb-w"><table class="tb"><thead><tr><th>Thème et moments</th><th>Partenaires attendus</th><th>Statut</th></tr></thead><tbody>%%LIGNES%%
  <tr id="sgi"><td><b>Vitrine des SGI</b><small>Comparer les SGI agréées, puis les contacter</small></td><td>SGI · places mises en avant</td><td><span class="pill">Bientôt</span></td></tr></tbody></table></div>
</div></section>

<section class="pa-sec" style="background:#E8F0F5"><div class="pa-in">
  <p class="pa-k">Pour chacun</p>
  <h2>Ce que chacun y gagne.</h2>
  <div class="pour">
    <div class="c"><h3>Pour le lecteur</h3><ul><li>Une offre en lien avec ce qu’il apprend, au moment où il en a besoin.</li><li>Toujours la mention « Partenaire d’EFA ».</li><li>Toujours fermable, jamais pendant un exercice.</li></ul></div>
    <div class="c"><h3>Pour le partenaire</h3><ul><li>Une présence sur les sujets qui comptent pour vous, et seulement ceux-là.</li><li>Un emplacement réservé à votre catégorie dans le thème choisi.</li><li>Un relevé régulier des vues et des clics.</li></ul></div>
    <div class="c"><h3>Pour la qualité d’EFA</h3><ul><li>Les ateliers, guides et outils restent écrits par EFA.</li><li>Une seule annonce par écran.</li><li>Pas d’offre de crédit dans les ateliers sur les dettes.</li></ul></div>
  </div>
</div></section>

<section class="pa-sec offres"><div class="pa-in">
  <p class="pa-k">Les offres</p>
  <h2>Trois façons d’être présent.</h2>
  <div class="g3">
    <div class="c"><h3>Partenaire de thème</h3><p>Votre catégorie sur un thème entier : carte intégrée, intercalaires et éphémères, pour plusieurs mois.</p><p class="px">Sur proposition</p></div>
    <div class="c"><h3>Campagne d’un mois</h3><p>Pour un lancement ou une saison (rentrée, fin d’année, Tabaski) : les formats éphémères sur les sujets choisis.</p><p class="px">Sur proposition</p></div>
    <div class="c"><h3>Vitrine des SGI</h3><p>Une place mise en avant dans la vitrine, avec votre fiche complète et les demandes de contact des lecteurs.</p><p class="px">Sur proposition</p></div>
  </div>
</div></section>

<section class="pa-sec" id="contact" style="background:#E8F0F5"><div class="pa-in">
  <p class="pa-k">Réserver un espace</p>
  <h2>Parlons de votre place.</h2>
  <p class="sous">Dites-nous qui vous êtes et les thèmes qui vous intéressent. Nous revenons vers vous avec les emplacements disponibles.</p>
  <form class="form" id="pa-f" novalidate>
    <div class="row"><label>Organisation<input name="organisation" required autocomplete="organization"></label><label>Catégorie<select name="categorie">%%CATS%%</select></label></div>
    <fieldset><legend>Thèmes qui vous intéressent</legend><div class="cks">%%COCHES%%</div></fieldset>
    <div class="row"><label>Nom et fonction<input name="nom" required autocomplete="name"></label><label>E-mail professionnel<input name="email" type="email" required autocomplete="email"></label></div>
    <label>WhatsApp ou téléphone<input name="telephone" type="tel" autocomplete="tel"></label>
    <label>Votre message<textarea name="message" rows="4" placeholder="Votre offre, votre calendrier, vos questions."></textarea></label>
    <p class="err" id="pa-err" hidden></p>
    <button class="pa-b r" type="submit">Envoyer ma demande</button>
  </form>
  <div id="pa-ok" class="ok" hidden>Merci, votre demande est bien arrivée. Nous revenons vers vous très vite.</div>
</div></section>
</main>
<footer class="efa-foot"></footer>
<script>
(function(){
  var LOGO='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="18" fill="#0E3B66"/><text x="40" y="47" font-family="Arial" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">LOGO</text></svg>');
  var EX={lab:'Partenaire d’EFA',k:'Votre catégorie',t:'Votre offre, ici, au bon moment',p:'Une phrase claire sur votre offre, liée au sujet que la personne vient d’apprendre.',c:'Voir l’offre',u:'partenaires.html#contact',i:'theme-placer-900.webp',logo:LOGO};
  [].forEach.call(document.querySelectorAll('[data-demo]'),function(b){ b.addEventListener('click',function(){
    if(window.EFA_ANNONCES) EFA_ANNONCES.demo(b.dataset.demo,EX); }); });
  var f=document.getElementById('pa-f'), er=document.getElementById('pa-err');
  f.addEventListener('submit',function(e){ e.preventDefault(); er.hidden=true;
    var d=new FormData(f), org=(d.get('organisation')||'').trim(), nom=(d.get('nom')||'').trim(), mail=(d.get('email')||'').trim();
    if(!org||!nom||!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(mail)){ er.textContent='Merci de renseigner l’organisation, votre nom et un e-mail valide.'; er.hidden=false; return; }
    var th=d.getAll('themes').join(', ')||'non précisé';
    var b=f.querySelector('button'); b.disabled=true; b.textContent='Envoi…';
    fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:'%%CLE%%',subject:'efa.africa · Espaces partenaires · '+org,from_name:'Site efa.africa',name:nom,email:mail,replyto:mail,organisation:org,categorie:d.get('categorie'),themes:th,telephone:d.get('telephone')||'',message:d.get('message')||''})})
      .then(function(r){return r.json();}).then(function(j){ if(j&&j.success){ f.hidden=true; document.getElementById('pa-ok').hidden=false; try{ if(window.goatcounter&&goatcounter.count) goatcounter.count({path:'partenaires-demande',title:'Demande partenaire',event:true}); }catch(x){} } else throw 0; })
      .catch(function(){ b.disabled=false; b.textContent='Envoyer ma demande'; er.textContent='L’envoi n’a pas abouti. Réessayez, ou écrivez-nous à contact@efa.africa.'; er.hidden=false; });
  });
})();
</script>
</body>
</html>
'''
PAGE = PAGE.replace('%%LIGNES%%', lignes).replace('%%CATS%%', cats).replace('%%COCHES%%', coches).replace('%%CLE%%', CLE_FORM)
open('partenaires.html', 'w', encoding='utf-8').write(PAGE)
subprocess.check_call(['python3', 'scripts/clone/habiller.py', '--page', 'partenaires.html'], stdout=subprocess.DEVNULL)
print('partenaires.html : fait')
