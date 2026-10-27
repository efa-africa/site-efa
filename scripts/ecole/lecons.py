#!/usr/bin/env python3
"""Génère les 4 leçons pilotes ajoutées le 24/10/2026 (modules 11, 16, 18, 23) à partir du gabarit
« une question, une réponse » de salaire-fixe-activite.html (en-tête, styles, pied de page, scripts communs)."""
import re, json
from pathlib import Path
R = Path(__file__).resolve().parents[2]
T = (R / 'salaire-fixe-activite.html').read_text(encoding='utf-8')
HEAD_CSS = T[T.index('<link rel="preconnect"'):T.index('<script type="application/ld+json">')]
STYLE = T[T.index('<!-- Gabarit EFA'):T.index('</head>')]
HEADER = T[T.index('<header class="top">'):T.index('<main>')]
FOOTER = T[T.index('<footer class="efa-foot">'):T.index('<script>\n(function(){\n  var vu=false')]
FIN = '<script data-goatcounter="https://efa-africa.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>\n<script src="efa-appli.js?v=2026102820" defer></script>\n</body>\n</html>\n'

def page(slug, titre, desc, module, crumb, kick, minutes, corps, script, sources):
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": titre, "description": desc, "inLanguage": "fr", "datePublished": "2026-10-24", "dateModified": "2026-10-24",
         "mainEntityOfPage": "https://efa.africa/%s.html" % slug, "author": {"@type": "Organization", "name": "Éducation Financière Afrique", "url": "https://efa.africa/"},
         "publisher": {"@type": "Organization", "name": "Éducation Financière Afrique", "url": "https://efa.africa/"}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://efa.africa/"},
            {"@type": "ListItem", "position": 2, "name": "L’école", "item": "https://efa.africa/parcours.html"},
            {"@type": "ListItem", "position": 3, "name": titre, "item": "https://efa.africa/%s.html" % slug}]}]}
    src = ''.join('<li><a class="lien-s" href="%s" target="_blank" rel="noopener">%s</a></li>' % (u, t) for t, u in sources)
    h = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" href="logo-efa-96.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#0B1220">
<title>{titre} · EFA</title>
<meta name="description" content="{desc} Leçon pilote réalisée avec l’aide de l’intelligence artificielle, vérifiée par l’équipe EFA.">
<link rel="canonical" href="https://efa.africa/{slug}.html">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Éducation Financière Afrique">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{titre}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="https://efa.africa/{slug}.html">
<meta property="og:image" content="https://efa.africa/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="author" content="EFA · Éducation Financière Afrique">
{HEAD_CSS}<script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=1)}
</script>
{STYLE}</head>
<body>

{HEADER}<main>
<section class="intro">
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <a href="parcours.html#{module}">L’école</a> › {crumb}</nav>
    <p class="kick">{kick} · Leçon pilote</p>
    <h1>{titre}</h1>
    <p class="signe">Éducation Financière Afrique · Mis à jour le 24 octobre 2026 · {minutes} minutes</p>
  </div>
</section>

<div class="wrap">
<article class="col">
{corps}
  <section id="qui" aria-labelledby="qui-t">
    <p class="bk">Qui a rédigé et vérifié cette page</p>
    <h2 id="qui-t">Transparence</h2>
    <dl class="qui">
      <dt>Rédaction</dt><dd>Équipe EFA, avec l’aide de l’intelligence artificielle</dd>
      <dt>Statut</dt><dd>Leçon pilote · relecture pédagogique en cours</dd>
      <dt>Sources</dt><dd><ul style="margin:0;padding-left:18px">{src}</ul></dd>
      <dt>Mise à jour</dt><dd>24 octobre 2026 · première version</dd>
      <dt>Corrections</dt><dd>Une erreur&nbsp;? Écrivez à newsletter@efa.africa.</dd>
      <dt>Liens d’intérêts</dt><dd>EFA ne vend aucun produit financier et ne recommande aucun établissement.</dd>
    </dl>
    <p class="mention">Éducation financière, pas conseil personnalisé. Personnages et montants fictifs, sauf mention d’une source.</p>
  </section>
</article>
</div>
</main>

{FOOTER}<script>
{script}
</script>
{FIN}'''
    (R / (slug + '.html')).write_text(h, encoding='utf-8')

F = lambda n: n
COMMUN_JS = T[T.index('<script>\nfunction efaCompte'):T.index('</script>', T.index('<script>\nfunction efaCompte'))].replace('<script>\n', '')

# ---------------------------------------------------------------- Module 11
page('renegocier-une-dette', 'Renégocier une dette : quoi demander, à qui',
     'Quand les mensualités ne passent plus : allonger, baisser le taux ou faire une pause, avec une proposition écrite. Le cas de Koffi et un calcul avec vos chiffres.',
     'M11', 'Sortir de la dette', 'Module 11', 7, '''
  <div class="reponse" id="reponse">
    <p class="bk">La réponse en 30 secondes</p>
    <h2>Allez voir le prêteur avant le premier retard, avec une proposition chiffrée.</h2>
    <ul>
      <li><strong>Trois demandes possibles</strong>&nbsp;: allonger la durée (la mensualité baisse, le coût total monte), baisser le taux, ou obtenir une pause de quelques mois.</li>
      <li><strong>Venez avec vos chiffres</strong>&nbsp;: ce que vous pouvez payer chaque mois, et pourquoi la situation a changé.</li>
      <li><strong>Exigez un accord écrit</strong>&nbsp;: un nouvel échéancier signé, jamais une promesse orale.</li>
    </ul>
  </div>

  <section id="cas" aria-labelledby="cas-t">
    <p class="bk">Le cas</p>
    <h2 id="cas-t">Koffi ne peut plus payer 55&nbsp;000&nbsp;F par mois</h2>
    <div class="cas">
      <figure><img src="certificat-pilote/koffi-inquiet.jpg" alt="" loading="lazy"><figcaption>Koffi, huit mensualités restantes</figcaption></figure>
      <div>
        <p>Koffi rembourse un crédit de consommation&nbsp;: il lui reste 8 mensualités de 55&nbsp;000&nbsp;F, soit 440&nbsp;000&nbsp;F. Ses primes ont baissé&nbsp;; son budget ne laisse plus que 40&nbsp;000&nbsp;F par mois pour ce crédit.</p>
        <p>Plutôt que d’attendre le retard, il demande un rendez-vous et propose d’étaler le reste sur 12 mois.</p>
      </div>
    </div>
    <div class="chiffres">
      <div><small>Avant</small><b>8 × 55&nbsp;000&nbsp;F</b></div>
      <div><small>Proposition acceptée</small><b>12 × 38&nbsp;500&nbsp;F</b></div>
      <div><small>Coût en plus</small><b>22&nbsp;000&nbsp;F</b></div>
    </div>
    <div class="decision">
      <h3>Ce que ça change</h3>
      <ul>
        <li><strong>La mensualité baisse de 16&nbsp;500&nbsp;F</strong> et tient dans son budget.</li>
        <li><strong>Il paiera 462&nbsp;000&nbsp;F au lieu de 440&nbsp;000&nbsp;F</strong>&nbsp;: allonger coûte presque toujours plus cher. C’est le prix de la sécurité.</li>
        <li><strong>Il évite les pénalités de retard et un fichage</strong>, qui lui auraient coûté bien plus.</li>
      </ul>
    </div>
  </section>

  <section id="verifier" aria-labelledby="ver-t">
    <p class="bk">La méthode EFA</p>
    <h2 id="ver-t">Six étapes pour renégocier</h2>
    <ol class="verif">
      <li><b>Listez toutes vos dettes, de la plus chère à la moins chère</b><span>Avec le module 6 et l’outil <a class="lien-s" href="cout-total-credit.html">coût total d’un crédit</a>. On renégocie d’abord la plus lourde.</span></li>
      <li><b>Calculez ce que vous pouvez vraiment payer</b><span>À partir de votre budget du mois, sans toucher à votre réserve.</span></li>
      <li><b>Choisissez votre demande</b><span>Allonger la durée, baisser le taux, ou une pause de un à trois mois. Une seule demande claire vaut mieux que trois vagues.</span></li>
      <li><b>Écrivez votre proposition</b><span>Le montant que vous pouvez payer, à partir de quand, et la raison. Le modèle est ci-dessous.</span></li>
      <li><b>Obtenez un accord écrit</b><span>Un nouvel échéancier ou un avenant signé. Vérifiez le TAEG&nbsp;: depuis le 1<sup>er</sup> juin 2026, il ne peut pas dépasser 14&nbsp;% pour une banque et 24&nbsp;% pour un établissement financier ou une microfinance (taux d’usure de l’UMOA).</span></li>
      <li><b>N’empruntez pas pour rembourser</b><span>Un nouveau crédit pour payer l’ancien repousse le problème et ajoute des frais.</span></li>
    </ol>
    <div class="decision">
      <h3>Le message à envoyer</h3>
      <p style="margin-top:8px">«&nbsp;Bonjour, je rembourse le crédit n°&nbsp;… Mes revenus ont baissé depuis …&nbsp;: je ne peux plus payer … F par mois sans être en retard. Je vous propose de payer … F par mois à partir du …, sur … mois. Je souhaite un rendez-vous pour signer un nouvel échéancier. Merci.&nbsp;»</p>
    </div>
  </section>

  <section id="calcul" aria-labelledby="calc-t">
    <p class="bk">Essayer avec mes chiffres</p>
    <h2 id="calc-t">Que donnerait un étalement&nbsp;?</h2>
    <div class="calc">
      <div class="champs">
        <label>Mensualité actuelle<input id="r-m" inputmode="numeric" autocomplete="off" placeholder="ex. 55 000"></label>
        <label>Mensualités restantes<input id="r-n" inputmode="numeric" autocomplete="off" placeholder="ex. 8"></label>
        <label>Nouvelle durée (mois)<input id="r-d" inputmode="numeric" autocomplete="off" placeholder="ex. 12"></label>
        <label>Frais ou intérêts en plus demandés<small>si le prêteur vous l’indique</small><input id="r-f" inputmode="numeric" autocomplete="off" placeholder="ex. 22 000"></label>
      </div>
      <div class="res" id="r-out" aria-live="polite" hidden>
        <div class="l">
          <div><small>Reste à payer aujourd’hui</small><b id="r-t">–</b></div>
          <div><small>Nouvelle mensualité</small><b id="r-nm">–</b></div>
          <div><small>Coût en plus</small><b id="r-c">–</b></div>
        </div>
        <p class="verdict" id="r-v"></p>
      </div>
      <p class="note" style="margin-top:12px">Calcul simplifié&nbsp;: le prêteur vous donnera le montant exact. Rien n’est enregistré ni envoyé.</p>
    </div>
  </section>

  <section id="aller" aria-labelledby="al-t">
    <p class="bk">Pour aller plus loin</p>
    <h2 id="al-t">Le coût réel d’un crédit</h2>
    <div class="aller">
      <a href="cout-total-credit.html"><small>Outil</small><b>Calculer le coût total d’un crédit</b><span>Comparer deux offres, lire le taux annuel.</span></a>
      <a href="parcours.html#P6"><small>Module 6</small><b>Reprendre la main sur mes dettes</b><span>Lister et classer ses dettes.</span></a>
    </div>
    <ul class="mots"><li><a href="outils.html#dico/teg-taeg">TEG / TAEG</a></li><li><a href="outils.html#dico/dette">Dette</a></li></ul>
  </section>
''', COMMUN_JS + '''
(function(){
  var vu=false, ids=['r-m','r-n','r-d','r-f'];
  function maj(){
    var m=EFA_NUM('r-m'), n=EFA_NUM('r-n'), d=EFA_NUM('r-d'), f=EFA_NUM('r-f')||0, out=document.getElementById('r-out');
    if(!m||!n||!d){out.hidden=true;return;}
    var t=m*n, nm=Math.ceil((t+f)/d/500)*500;
    document.getElementById('r-t').textContent=EFA_F(t);document.getElementById('r-nm').textContent=EFA_F(nm);document.getElementById('r-c').textContent=EFA_F(nm*d-t);
    var v = d<=n ? 'Une durée égale ou plus courte ne baisse pas la mensualité : demandez plutôt une pause ou une baisse de taux.'
      : '<b>Votre mensualité passerait de '+EFA_F(m)+' à '+EFA_F(nm)+'</b>, soit '+EFA_F(m-nm)+' de moins par mois, pour '+EFA_F(nm*d-t)+' de plus au total. Vérifiez qu’elle tient dans votre budget avant de proposer ce montant.';
    document.getElementById('r-v').innerHTML=v; out.hidden=false;
    if(!vu){vu=true;efaCompte('renegocier-calcul');}
  }
  efaChamps(ids,maj);
})();''', [('BCEAO · Avis n°007-12-2025 relatif au taux de l’usure', 'https://www.bceao.int/fr/reglementations/avis-no007-12-2025-aux-etablissements-de-credit-et-aux-institutions-de'),
          ('Droit Médias Finance · Taux d’usure à 14 % et 24 % à partir du 1er juin 2026', 'https://www.droitmediasfinance.com/index.php/actualites/droit-bancaire/1248-uemoa-credits-bancaires-le-taux-dusure-pour-les-banques-a-14-et-pour-les-etablissements-financiers-a-24-pour-a-partir-1er-juin-20266')])

# ---------------------------------------------------------------- Module 16
page('consommer-et-acheter', 'Consommer et acheter : inflation, crédit chez le commerçant, négocier',
     'Pourquoi les prix montent, combien coûte vraiment un achat payé en plusieurs fois, et comment négocier. Le cas de Tantie Affoué et un calcul avec vos chiffres.',
     'M16', 'Consommer et acheter', 'Module 16', 7, '''
  <div class="reponse" id="reponse">
    <p class="bk">La réponse en 30 secondes</p>
    <h2>Comparez toujours le prix comptant au total que vous paierez vraiment.</h2>
    <ul>
      <li><strong>L’inflation, c’est la hausse générale des prix.</strong> Dans l’UEMOA, elle a été faible en 2025 (la BCEAO prévoyait 0,2&nbsp;% sur l’année, pour un seuil de 3&nbsp;%), mais vos prix à vous, riz, transport, loyer, peuvent monter plus vite.</li>
      <li><strong>Payer en plusieurs fois a un prix</strong>&nbsp;: la différence entre le total des traites et le prix comptant, c’est un crédit.</li>
      <li><strong>Mettre de côté avant d’acheter</strong> coûte zéro, et donne souvent une remise au comptant.</li>
    </ul>
  </div>

  <section id="cas" aria-labelledby="cas-t">
    <p class="bk">Le cas</p>
    <h2 id="cas-t">Le congélateur de Tantie Affoué</h2>
    <div class="cas">
      <figure><img src="certificat-pilote/affoue-soucieuse.jpg" alt="" loading="lazy"><figcaption>Tantie Affoué, deux prix pour le même congélateur</figcaption></figure>
      <div>
        <p>Le commerçant propose le congélateur à 250&nbsp;000&nbsp;F comptant, ou «&nbsp;sans rien payer aujourd’hui&nbsp;» en 10 traites de 30&nbsp;000&nbsp;F.</p>
        <p>10 traites de 30&nbsp;000&nbsp;F font 300&nbsp;000&nbsp;F&nbsp;: elle paierait 50&nbsp;000&nbsp;F de plus, soit 20&nbsp;% du prix, pour dix mois. Sur un an, cela revient à un taux d’environ 50&nbsp;%.</p>
      </div>
    </div>
    <div class="chiffres">
      <div><small>Comptant</small><b>250&nbsp;000&nbsp;F</b></div>
      <div><small>En 10 traites</small><b>300&nbsp;000&nbsp;F</b></div>
      <div><small>Prix du crédit</small><b>50&nbsp;000&nbsp;F</b></div>
    </div>
    <div class="decision">
      <h3>Sa décision</h3>
      <ul>
        <li><strong>Elle met 30&nbsp;000&nbsp;F de côté par mois</strong>, comme une traite, sur une poche séparée.</li>
        <li><strong>En sept mois elle a 210&nbsp;000&nbsp;F</strong>&nbsp;; elle négocie et obtient le congélateur à 230&nbsp;000&nbsp;F comptant au huitième mois.</li>
        <li><strong>Elle économise 70&nbsp;000&nbsp;F</strong> par rapport aux traites.</li>
      </ul>
    </div>
  </section>

  <section id="verifier" aria-labelledby="ver-t">
    <p class="bk">La méthode EFA</p>
    <h2 id="ver-t">Cinq réflexes avant d’acheter</h2>
    <ol class="verif">
      <li><b>Suivez votre inflation à vous</b><span>Notez le prix de cinq achats fréquents chaque mois&nbsp;: c’est la hausse qui touche votre budget, pas la moyenne nationale.</span></li>
      <li><b>Demandez toujours deux prix</b><span>Le prix comptant et le total en plusieurs fois. La différence est le prix du crédit.</span></li>
      <li><b>Calculez le surcoût en pourcentage</b><span>Au-delà de quelques pourcents pour quelques mois, c’est un crédit cher. Utilisez le calcul ci-dessous.</span></li>
      <li><b>Comparez avec l’attente</b><span>Mettre la traite de côté chaque mois, puis payer comptant, ne coûte rien.</span></li>
      <li><b>Négociez</b><span>Paiement comptant, achat groupé avec votre tontine, fin de saison&nbsp;: chaque argument vaut une remise. Demandez «&nbsp;quel est votre meilleur prix comptant&nbsp;?&nbsp;».</span></li>
    </ol>
  </section>

  <section id="calcul" aria-labelledby="calc-t">
    <p class="bk">Essayer avec mes chiffres</p>
    <h2 id="calc-t">Combien coûte cet achat en plusieurs fois&nbsp;?</h2>
    <div class="calc">
      <div class="champs">
        <label>Prix comptant<input id="c-p" inputmode="numeric" autocomplete="off" placeholder="ex. 250 000"></label>
        <label>Montant d’une traite<input id="c-t" inputmode="numeric" autocomplete="off" placeholder="ex. 30 000"></label>
        <label>Nombre de traites (mois)<input id="c-n" inputmode="numeric" autocomplete="off" placeholder="ex. 10"></label>
        <label>Premier versement le jour de l’achat<small>0 si rien n’est payé</small><input id="c-a" inputmode="numeric" autocomplete="off" placeholder="ex. 0"></label>
      </div>
      <div class="res" id="c-out" aria-live="polite" hidden>
        <div class="l">
          <div><small>Total payé</small><b id="c-tot">–</b></div>
          <div><small>Prix du crédit</small><b id="c-sur">–</b></div>
          <div><small>Taux annuel équivalent</small><b id="c-tx">–</b></div>
        </div>
        <p class="verdict" id="c-v"></p>
      </div>
      <p class="note" style="margin-top:12px">Le taux annuel équivalent est une estimation EFA (versements mensuels). Rien n’est enregistré ni envoyé.</p>
    </div>
  </section>

  <section id="aller" aria-labelledby="al-t">
    <p class="bk">Pour aller plus loin</p>
    <h2 id="al-t">Mettre de côté avant d’acheter</h2>
    <div class="aller">
      <a href="cercle-spirale.html#argent"><small>Simulateur</small><b>Combien garder à chaque rentrée&nbsp;?</b><span>Ce que devient une petite part gardée.</span></a>
      <a href="cout-total-credit.html"><small>Outil</small><b>Le coût total d’un crédit</b><span>Comparer deux offres.</span></a>
    </div>
    <ul class="mots"><li><a href="outils.html#dico/teg-taeg">TEG / TAEG</a></li><li><a href="outils.html#dico/epargne">Épargne</a></li></ul>
  </section>
''', COMMUN_JS + '''
(function(){
  var vu=false, ids=['c-p','c-t','c-n','c-a'];
  function taux(p,a,t,n){ // taux mensuel i tel que p-a = somme t/(1+i)^k
    var c=p-a; if(c<=0) return null; if(t*n<=c) return 0;
    var lo=0, hi=1; for(var k=0;k<80;k++){ var i=(lo+hi)/2, v=0; for(var j=1;j<=n;j++) v+=t/Math.pow(1+i,j); if(v>c) lo=i; else hi=i; }
    return Math.pow(1+(lo+hi)/2,12)-1;
  }
  function maj(){
    var p=EFA_NUM('c-p'), t=EFA_NUM('c-t'), n=EFA_NUM('c-n'), a=EFA_NUM('c-a')||0, out=document.getElementById('c-out');
    if(!p||!t||!n){out.hidden=true;return;}
    var tot=a+t*n, sur=tot-p, tx=taux(p,a,t,n);
    document.getElementById('c-tot').textContent=EFA_F(tot);document.getElementById('c-sur').textContent=EFA_F(sur);
    document.getElementById('c-tx').textContent=tx==null?'–':'≈ '+(Math.round(tx*1000)/10).toLocaleString('fr-FR')+' %';
    var v = sur<=0 ? 'Payer en plusieurs fois ne vous coûte rien de plus ici : vérifiez qu’aucun frais n’est caché.'
      : '<b>Vous paieriez '+EFA_F(sur)+' de plus</b>, soit '+Math.round(sur/p*100)+' % du prix comptant. En mettant '+EFA_F(t)+' de côté par mois, vous auriez le prix comptant en '+Math.ceil(p/t)+' mois, sans frais.';
    document.getElementById('c-v').innerHTML=v; out.hidden=false;
    if(!vu){vu=true;efaCompte('consommer-calcul');}
  }
  efaChamps(ids,maj);
})();''', [('AllAfrica · Comité de politique monétaire de la BCEAO, décembre 2025 (inflation 2025 prévue à 0,2 %, seuil de 3 %)', 'https://fr.allafrica.com/stories/202512030576.html')])

# ---------------------------------------------------------------- Module 18
page('dat-emprunts-etat', 'DAT et emprunts d’État : comment ça marche',
     'Le dépôt à terme et l’emprunt obligataire d’État expliqués simplement : ce qu’on prête, ce qu’on reçoit, ce qu’on risque. Un calcul avec vos chiffres, sans aucun produit recommandé.',
     'M18', 'Les placements de l’UEMOA', 'Module 18', 8, '''
  <div class="reponse" id="reponse">
    <p class="bk">La réponse en 30 secondes</p>
    <h2>Dans les deux cas, vous prêtez votre argent pour une durée fixée, contre un intérêt connu à l’avance.</h2>
    <ul>
      <li><strong>Le DAT (dépôt à terme)</strong>&nbsp;: vous bloquez une somme à la banque pour 6, 12 ou 24 mois. Retirer avant la fin fait perdre tout ou partie des intérêts.</li>
      <li><strong>L’emprunt obligataire d’État</strong>&nbsp;: vous prêtez à un État de la zone. Il vous verse des intérêts réguliers puis rembourse à l’échéance. On souscrit pendant une période fixée, auprès d’une SGI ou d’une banque, souvent dès 10&nbsp;000&nbsp;F.</li>
      <li><strong>Seulement l’argent dont vous n’aurez pas besoin</strong> pendant toute la durée, et jamais votre réserve de sécurité.</li>
    </ul>
  </div>

  <section id="cas" aria-labelledby="cas-t">
    <p class="bk">Le cas</p>
    <h2 id="cas-t">Koffi a 500&nbsp;000&nbsp;F dont il n’aura pas besoin avant trois ans</h2>
    <div class="cas">
      <figure><img src="certificat-pilote/koffi-portrait.jpg" alt="" loading="lazy"><figcaption>Koffi, réserve faite, horizon trois ans</figcaption></figure>
      <div>
        <p>Sa réserve d’un mois de dépenses est déjà constituée (module 4). Il lui reste 500&nbsp;000&nbsp;F pour un projet dans trois ans.</p>
        <p>Il lit la note d’information d’un emprunt d’État de la zone&nbsp;: en 2025, l’État du Sénégal proposait par exemple 6,40&nbsp;% par an sur 3 ans, dès 10&nbsp;000&nbsp;F, avec des intérêts versés tous les six mois.</p>
      </div>
    </div>
    <div class="chiffres">
      <div><small>Prêté</small><b>50 obligations · 500&nbsp;000&nbsp;F</b></div>
      <div><small>Intérêts par an, à 6,40&nbsp;%</small><b>32&nbsp;000&nbsp;F</b></div>
      <div><small>Au bout de 3 ans</small><b>96&nbsp;000&nbsp;F + capital</b></div>
    </div>
    <div class="decision">
      <h3>Ce qu’il vérifie avant de signer</h3>
      <ul>
        <li><strong>L’émetteur, le taux, la durée, le calendrier des intérêts et du remboursement</strong>, dans la note d’information.</li>
        <li><strong>L’intermédiaire</strong>&nbsp;: une SGI agréée par l’AMF-UMOA ou sa banque, jamais un particulier.</li>
        <li><strong>La sortie</strong>&nbsp;: s’il a besoin de l’argent avant, il devra revendre ses obligations, peut-être en dessous de leur prix.</li>
      </ul>
    </div>
  </section>

  <section id="verifier" aria-labelledby="ver-t">
    <p class="bk">La méthode EFA</p>
    <h2 id="ver-t">Cinq questions avant de prêter son argent</h2>
    <ol class="verif">
      <li><b>Ma réserve est-elle faite&nbsp;?</b><span>Un mois de dépenses au moins, disponible tout de suite. Sinon, commencez par le module 4.</span></li>
      <li><b>Quand aurai-je besoin de cet argent&nbsp;?</b><span>La durée du placement doit être plus courte que votre horizon.</span></li>
      <li><b>Qu’est-ce que je reçois, et quand&nbsp;?</b><span>Taux annuel, versements (chaque mois, semestre ou année), remboursement du capital, frais et impôts éventuels&nbsp;: tout est dans la note d’information ou le contrat de DAT.</span></li>
      <li><b>Qui me doit l’argent&nbsp;?</b><span>Une banque pour le DAT, un État pour l’obligation. Le risque n’est jamais nul&nbsp;: un emprunteur peut rembourser en retard.</span></li>
      <li><b>À qui je confie l’ordre&nbsp;?</b><span>Une SGI agréée ou une banque. Voir <a class="lien-s" href="questions-a-poser-a-sa-sgi.html">dix questions à poser à sa SGI</a>.</span></li>
    </ol>
  </section>

  <section id="calcul" aria-labelledby="calc-t">
    <p class="bk">Essayer avec mes chiffres</p>
    <h2 id="calc-t">Combien rapporte un placement à taux fixe&nbsp;?</h2>
    <div class="calc">
      <div class="champs">
        <label>Montant placé<input id="p-m" inputmode="numeric" autocomplete="off" placeholder="ex. 500 000"></label>
        <label>Taux annuel (%)<input id="p-t" inputmode="decimal" autocomplete="off" placeholder="ex. 6,4"></label>
        <label>Durée (années)<input id="p-d" inputmode="numeric" autocomplete="off" placeholder="ex. 3"></label>
      </div>
      <div class="res" id="p-out" aria-live="polite" hidden>
        <div class="l">
          <div><small>Intérêts par an</small><b id="p-a">–</b></div>
          <div><small>Intérêts sur la durée</small><b id="p-i">–</b></div>
          <div><small>Total reçu</small><b id="p-tot">–</b></div>
        </div>
        <p class="verdict" id="p-v"></p>
      </div>
      <p class="note" style="margin-top:12px">Intérêts versés au fil de l’eau, avant impôts et frais éventuels. Aucun produit n’est recommandé. Rien n’est enregistré ni envoyé.</p>
    </div>
  </section>

  <section id="aller" aria-labelledby="al-t">
    <p class="bk">Pour aller plus loin</p>
    <h2 id="al-t">Les autres placements de la zone</h2>
    <div class="aller">
      <a href="opcvm-fcpe.html"><small>Module</small><b>OPCVM et FCPE expliqués</b><span>Placer à plusieurs, géré par un professionnel.</span></a>
      <a href="bourse-essentiel.html"><small>Formation</small><b>L’essentiel de la Bourse</b><span>Actions et obligations à la BRVM.</span></a>
    </div>
    <ul class="mots"><li><a href="outils.html#dico/obligation">Obligation</a></li><li><a href="outils.html#dico/rendement">Rendement</a></li><li><a href="outils.html#dico/risque">Risque</a></li></ul>
  </section>
''', COMMUN_JS.replace("String((document.getElementById(id)||{}).value||'').replace(/[^\\d]/g,'')", "String((document.getElementById(id)||{}).value||'').replace(/[^\\d]/g,'')") + '''
(function(){
  var vu=false, ids=['p-m','p-t','p-d'];
  function tx(){ var v=String(document.getElementById('p-t').value||'').replace(',','.').replace(/[^\\d.]/g,''); return v===''?null:parseFloat(v); }
  function maj(){
    var m=EFA_NUM('p-m'), t=tx(), d=EFA_NUM('p-d'), out=document.getElementById('p-out');
    if(!m||!t||!d){out.hidden=true;return;}
    var a=m*t/100, i=a*d;
    document.getElementById('p-a').textContent=EFA_F(a);document.getElementById('p-i').textContent=EFA_F(i);document.getElementById('p-tot').textContent=EFA_F(m+i);
    document.getElementById('p-v').innerHTML='<b>Vous recevriez '+EFA_F(i)+' d’intérêts en '+d+' an'+(d>1?'s':'')+'</b>, puis votre capital de '+EFA_F(m)+'. Pendant tout ce temps, cet argent n’est pas disponible : gardez votre réserve à part.';
    out.hidden=false; if(!vu){vu=true;efaCompte('placement-taux-fixe-calcul');}
  }
  ['p-m','p-d'].forEach(function(i){var el=document.getElementById(i);el.addEventListener('change',function(){var v=EFA_NUM(i);if(v!=null)el.value=v.toLocaleString('fr-FR').replace(/[  ]/g,' ');maj();});el.addEventListener('input',function(){clearTimeout(el._t);el._t=setTimeout(maj,400);});});
  document.getElementById('p-t').addEventListener('input',function(){clearTimeout(this._t);this._t=setTimeout(maj,400);});
})();''', [('Société Générale Côte d’Ivoire · Emprunt obligataire de l’État du Sénégal par appel public à l’épargne, 2025', 'https://business.abidjan.net/communique/8764-emission-demprunt-obligataire-par-appel-public-a-lepargne-pour-lannee-2025')])

# ---------------------------------------------------------------- Module 23
page('etudes-enfants-heritage', 'Les études des enfants et l’héritage',
     'Chiffrer les études des enfants et commencer tôt, puis préparer ce que la famille devra savoir et faire. Le cas de Koffi et un calcul avec vos chiffres.',
     'M23', 'Transmettre', 'Module 23', 7, '''
  <div class="reponse" id="reponse">
    <p class="bk">La réponse en 30 secondes</p>
    <h2>Transmettre se prépare de son vivant&nbsp;: un chiffre pour les études, des papiers en ordre pour l’héritage.</h2>
    <ul>
      <li><strong>Les études&nbsp;: chiffrez-les et commencez tôt.</strong> Une petite somme chaque mois pendant dix ans pèse moins qu’une grosse somme d’un coup.</li>
      <li><strong>L’héritage&nbsp;: les règles dépendent du pays</strong>, et parfois de la coutume ou de la religion. Sans papiers ni volonté écrite, les conflits arrivent vite.</li>
      <li><strong>Un notaire</strong> dit ce qui s’applique dans votre cas&nbsp;: EFA ne remplace pas un conseil juridique.</li>
    </ul>
  </div>

  <section id="cas" aria-labelledby="cas-t">
    <p class="bk">Le cas</p>
    <h2 id="cas-t">Koffi pense aux études de sa fille</h2>
    <div class="cas">
      <figure><img src="certificat-pilote/koffi-sourire.jpg" alt="" loading="lazy"><figcaption>Koffi, douze ans devant lui</figcaption></figure>
      <div>
        <p>Sa fille a six ans. Koffi estime trois années d’études supérieures, à 1&nbsp;500&nbsp;000&nbsp;F par an (inscription, logement, transport), dans douze ans.</p>
        <p>Il lui faudrait 4&nbsp;500&nbsp;000&nbsp;F. Mis de côté sur douze ans, cela fait environ 31&nbsp;250&nbsp;F par mois, avant tout rendement.</p>
      </div>
    </div>
    <div class="chiffres">
      <div><small>Besoin estimé</small><b>4&nbsp;500&nbsp;000&nbsp;F</b></div>
      <div><small>Années pour préparer</small><b>12 ans</b></div>
      <div><small>Par mois</small><b>≈ 31&nbsp;250&nbsp;F</b></div>
    </div>
    <div class="decision">
      <h3>Ce qu’il décide</h3>
      <ul>
        <li><strong>Une poche «&nbsp;études&nbsp;» séparée</strong>, alimentée à chaque rentrée, qu’il ne touche pas pour le reste.</li>
        <li><strong>Une révision chaque année</strong>&nbsp;: les prix montent, le chiffre aussi.</li>
        <li><strong>Une liste des papiers et des biens</strong>, rangée et connue de sa femme et d’une personne de confiance.</li>
      </ul>
    </div>
  </section>

  <section id="verifier" aria-labelledby="ver-t">
    <p class="bk">La méthode EFA</p>
    <h2 id="ver-t">Ce que la famille doit pouvoir retrouver</h2>
    <ol class="verif">
      <li><b>La liste des biens et des dettes</b><span>Terrain, maison, comptes, mobile money, parts de tontine, crédits en cours, argent prêté.</span></li>
      <li><b>Les papiers d’identité et d’état civil</b><span>Actes de naissance, acte de mariage et régime choisi, titres de propriété. Voir <a class="lien-s" href="papiers-famille.html">les papiers que ma famille doit pouvoir retrouver</a>.</span></li>
      <li><b>Les contacts utiles</b><span>Banque, SGI, assureur, employeur, caisse de retraite, notaire.</span></li>
      <li><b>Votre volonté, écrite</b><span>Ce que vous souhaitez pour vos enfants et vos biens. Un notaire vous dit quelle forme a une valeur dans votre pays.</span></li>
      <li><b>Une personne de confiance qui sait où tout se trouve</b><span>Et une mise à jour chaque année, à date fixe.</span></li>
    </ol>
  </section>

  <section id="calcul" aria-labelledby="calc-t">
    <p class="bk">Essayer avec mes chiffres</p>
    <h2 id="calc-t">Combien mettre de côté pour les études&nbsp;?</h2>
    <div class="calc">
      <div class="champs">
        <label>Coût estimé par année d’études<input id="e-c" inputmode="numeric" autocomplete="off" placeholder="ex. 1 500 000"></label>
        <label>Nombre d’années d’études<input id="e-n" inputmode="numeric" autocomplete="off" placeholder="ex. 3"></label>
        <label>Années avant le début<input id="e-a" inputmode="numeric" autocomplete="off" placeholder="ex. 12"></label>
        <label>Déjà de côté<input id="e-d" inputmode="numeric" autocomplete="off" placeholder="ex. 0"></label>
      </div>
      <div class="res" id="e-out" aria-live="polite" hidden>
        <div class="l">
          <div><small>Besoin total</small><b id="e-t">–</b></div>
          <div><small>Reste à réunir</small><b id="e-r">–</b></div>
          <div><small>Par mois</small><b id="e-m">–</b></div>
        </div>
        <p class="verdict" id="e-v"></p>
      </div>
      <p class="note" style="margin-top:12px">Sans rendement ni hausse des prix&nbsp;: revoyez le chiffre chaque année. Rien n’est enregistré ni envoyé.</p>
    </div>
  </section>

  <section id="aller" aria-labelledby="al-t">
    <p class="bk">Pour aller plus loin</p>
    <h2 id="al-t">Protéger et organiser</h2>
    <div class="aller">
      <a href="papiers-famille.html"><small>Méthode guidée</small><b>Les papiers que ma famille doit pouvoir retrouver</b><span>La liste à cocher.</span></a>
      <a href="apres-un-deces.html"><small>Leçon</small><b>Après le décès d’un proche</b><span>Les premières décisions d’argent.</span></a>
    </div>
  </section>
''', COMMUN_JS + '''
(function(){
  var vu=false, ids=['e-c','e-n','e-a','e-d'];
  function maj(){
    var c=EFA_NUM('e-c'), n=EFA_NUM('e-n'), a=EFA_NUM('e-a'), d=EFA_NUM('e-d')||0, out=document.getElementById('e-out');
    if(!c||!n||!a){out.hidden=true;return;}
    var t=c*n, r=Math.max(0,t-d), m=Math.ceil(r/(a*12)/500)*500;
    document.getElementById('e-t').textContent=EFA_F(t);document.getElementById('e-r').textContent=EFA_F(r);document.getElementById('e-m').textContent=EFA_F(m);
    document.getElementById('e-v').innerHTML = r===0 ? '<b>Vous avez déjà la somme estimée.</b> Revoyez-la chaque année : les prix montent.' : '<b>En mettant '+EFA_F(m)+' de côté chaque mois pendant '+a+' an'+(a>1?'s':'')+'</b>, vous réunissez '+EFA_F(r)+'. Une poche séparée, alimentée à chaque rentrée, et une révision chaque année.';
    out.hidden=false; if(!vu){vu=true;efaCompte('etudes-calcul');}
  }
  efaChamps(ids,maj);
})();''', [('EFA · Les papiers que ma famille doit pouvoir retrouver', 'https://efa.africa/papiers-famille.html')])
print('ok')
