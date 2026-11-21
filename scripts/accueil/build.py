# Maquette du nouvel accueil « Votre argent. Votre question. Votre prochain pas. »
# Fabrique : data/tout-efa.json (index de tout le site), accueil-v3.html, prochain-pas.html, puis les habille (menu et pied du site).
# Lancer : python3 scripts/accueil/build.py
import re, os, json, html, glob, subprocess
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
E = lambda t: html.escape(str(t), quote=True)
V = '20261121d'

FAMILLES = [
 ('argent', 'Comprendre et gérer mon argent', 'Budget, épargne, réserve, crédit, dettes, retraite',
  'diagnostic ou-est-passe-mon-argent outil-budget construire-son-budget budget-mobile-money engagements-et-exceptions separer-les-poches epargner cercle-spirale ou-garder-sa-reserve liberte-financiere cout-total-credit renegocier-une-dette consommer-et-acheter dat-emprunts-etat preparer-ma-retraite decider outils point-de-depart question'),
 ('activite', 'Lancer et faire grandir mon activité', 'Idées de business, business plan, valeur de l’entreprise',
  'generateur-de-projet avec-100000-je-lance-quoi mon-business-plan-tient-il mon-espace-business-plan valoriser-mon-entreprise salaire-fixe-activite investir-gagner-plus projets-a-suivre'),
 ('bourse', 'Investir et la Bourse (BRVM)', 'Ma BRVM, le marché du jour, les SGI, les cours pour débuter',
  'ma-brvm bourse premiers-pas-bourse marches semaine-bourse societes calendrier obligations acheter-des-actions sgi sgi-comparer questions-a-poser-a-sa-sgi questions-avant-d-investir acteurs coach-bourse ecole-de-la-bourse ecole-bourse bourse-essentiel bourse-marche bourse-pro bourse-projets investir investir-bourse investir-assurance-epargne investir-terrain-immobilier opcvm-fcpe club-investissement jeu-portefeuille-baisse personnalite etude-frais-bourse'),
 ('tontine', 'La tontine', 'Comprendre, choisir, cotiser sans se faire avoir',
  'tontine ecole-de-la-tontine avant-de-cotiser choisir-son-rang-tontine tontine-formations tontine-decider-avant-de-recevoir tontine-rentree cotiser-depuis-l-etranger etude-tontine-en-chiffres'),
 ('famille', 'Famille, maison et moments de vie', 'Terrain, chantier, enfants, décès, prêter à un proche, arnaques',
  'acheter-un-terrain budget-chantier arrivee-enfant etudes-enfants-heritage apres-un-deces papiers-famille preter-a-un-proche question-preter-a-ma-soeur solidarite-assureur-de-la-famille arnaques se-proteger-des-arnaques'),
 ('former', 'Me former', 'Les ateliers, les parcours, les certificats, les écoles EFA',
  'ateliers ateliers-budget ateliers-placer ateliers-bourse ateliers-credit ateliers-activite ateliers-famille ateliers-arnaques ateliers-elysee parcours certificat-pilote certificat-maitrise certificat-patrimoine certificat-cefa traders corporate ceo quiz minfin'),
 ('media', 'L’actu, les études, le média', 'EFA News, décryptages, tribunes, études, Africa 2075, podcast',
  'news decryptage decryptage-sir-brvm tribunes etudes-prospective methode africa-2075 africa-2075-fondateur africa-2075-n1 africa-2075-n2 africa-2075-dossier-1 podcast lettre bibliotheque musee balade-economie'),
 ('espaces', 'Cadres, dirigeants, étudiants, organisations', 'Les espaces par public et les programmes pour les organisations',
  'cadres dirigeants patrimoine etudiants organisations programme-organisation rejoindre espace-organisation academy-equipe ambassadeurs partenaires demo'),
 ('efa', 'EFA et moi', 'Mon espace, l’abonnement, Élysée, Ely, nous écrire',
  'mon-efa abonnement rendez-vous ely auteur enquete confidentialite'),
]
EXCLUES = set('index accueil-v1 accueil-v3 prochain-pas ateliers-cles comite merci-guide tableau-ely marches-labo sgi-fiche societe'.split())
TITRES = {'generateur-de-projet': 'Déclic · trouver mon idée de business', 'rendez-vous': 'Rendez-vous, contact et organisations', 'auteur': 'À propos d’EFA et d’Élysée Johnson',
          'ely': 'Ely, le guide d’EFA', 'methode': 'Études sur la tontine et l’argent', 'etudes-prospective': 'Études et prospective', 'africa-2075-dossier-1': 'Africa 2075 · dossier n° 1',
          'investir-bourse': 'Investir : la Bourse (BRVM)', 'investir-gagner-plus': 'Investir : gagner plus', 'abonnement': 'L’abonnement EFA', 'ecole-bourse': 'École de la Bourse (parcours)',
          'outils': 'Tous les outils et simulateurs', 'ateliers': 'Tous les ateliers, par thème', 'ateliers-elysee': 'Ateliers avec Élysée Johnson', 'news': 'EFA News', 'sgi': 'Les SGI de la Bourse (BRVM)',
          'ma-brvm': 'Ma BRVM · Et si j’avais investi ?', 'societes': 'Les sociétés cotées', 'marches': 'Le marché aujourd’hui', 'parcours': 'L’école EFA : les parcours', 'confidentialite': 'Vos données',
          'mon-efa': 'Mon EFA · ma progression', 'diagnostic': 'Mon diagnostic financier', 'ou-est-passe-mon-argent': 'Voir clair · Où est passé mon argent ?', 'question': 'Chercher dans les contenus gratuits'}

def texte(s):
    s = re.sub(r'<(script|style|header|footer|nav|template)\b.*?</\1>', ' ', s, flags=re.S)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()

def fiche(p, fam):
    s = open(p, encoding='utf-8', errors='ignore').read()
    nom = p[:-5]
    t = re.search(r'<title>([^<]*)</title>', s)
    t = html.unescape(t.group(1)).split(' · ')[0].strip() if t else nom
    if len(t) > 52 and ' : ' in t: t = t.split(' : ')[0]
    t = TITRES.get(nom, t)
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    hs = [texte(h) for h in re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', s, flags=re.S)][:10]
    return {'t': t, 'p': p, 'f': fam, 'd': (html.unescape(d.group(1)) if d else '')[:180], 'h': ' · '.join(h for h in hs if h)[:400]}

def redirection(p):
    s = open(p, encoding='utf-8', errors='ignore').read(2500)
    return 'location.replace' in s and os.path.getsize(p) < 2500

IDX, PAR = [], {}
for cle, nom, sous, pages in FAMILLES:
    PAR[cle] = []
    for n in pages.split():
        p = n + '.html'
        if not os.path.exists(p) or redirection(p): continue
        f = fiche(p, cle); IDX.append(f); PAR[cle].append(f)
ATELIERS = []
for p in sorted(glob.glob('atelier-*.html')):
    if redirection(p): continue
    f = fiche(p, 'atelier'); IDX.append(f); ATELIERS.append(f)
ATELIERS.sort(key=lambda f: f['t'].lower())
try:
    for a in json.load(open('news/news-data.json', encoding='utf-8'))['articles']:
        if a.get('statut') in ('publié', 'corrigé'):
            IDX.append({'t': a['titre'], 'p': 'news/%s.html' % a['id'], 'f': 'actu', 'd': a.get('resume', '')[:180], 'h': ' · '.join(a.get('notions', []) + a.get('pays', []))})
except Exception as e: print('news :', e)
json.dump(IDX, open('data/tout-efa.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

# Contrôle : toute page réelle du site doit être dans l'index (ou exclue volontairement)
vus = {f['p'] for f in IDX}
oubli = [p for p in sorted(glob.glob('*.html')) if p not in vus and p[:-5] not in EXCLUES and not redirection(p)
         and not p.startswith(('admin', 'merci', 'paiement', 'connexion'))]
print('index : %d contenus (%d pages, %d ateliers) · pages hors index : %s' % (len(IDX), sum(len(v) for v in PAR.values()), len(ATELIERS), ' '.join(oubli) or 'aucune'))

IC = {
 'wallet': '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v4"/><path d="M3 7.5V18a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5.5A2.5 2.5 0 0 1 3 7.5Z"/><circle cx="16.5" cy="14.5" r="1.2"/>',
 'bulb': '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z"/>',
 'bars': '<path d="M4 20V14M10 20V10M16 20V6M22 20H2"/><path d="m4 9 6-4 4 3 6-5"/>',
 'cap': '<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v6"/>'}
def ic(n): return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>' % IC[n]

TETE = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"><link rel="icon" type="image/png" href="clone/assets/efa-oiseau.png"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B1220"><meta name="robots" content="noindex">
<title>%s</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap">
<link rel="stylesheet" href="clone/prochain-pas.css?v=''' + V + '''">
<script src="clone/prochain-pas.js?v=''' + V + '''" defer></script>
</head>
<body>
<header class="top"></header>
<main id="contenu" class="pp" data-garde>
<p class="pp-maquette">Maquette du nouvel accueil · non publiée · à valider</p>
'''
FIN = '''</main>
</body>
</html>
'''
def champ(ph):
    return ('<form class="pp-q" action="prochain-pas.html" method="get" role="search"><label for="pp-q" class="pp-sr">Votre question</label>'
            '<input id="pp-q" name="q" autocomplete="off" enterkeyhint="search" placeholder="%s"><button class="pp-go" type="submit">Trouver mon prochain pas →</button></form>') % E(ph)
def q(t): return 'prochain-pas.html?q=' + __import__('urllib.parse').parse.quote(t)

PORTES = ''.join('<a class="pp-porte" href="%s"><span class="pp-ic">%s</span><span class="pp-pt"><b>%s</b><span>%s</span></span><i aria-hidden="true">→</i></a>' % (u, ic(i), t, s) for u, i, t, s in [
 ('ou-est-passe-mon-argent.html?src=accueil-portes', 'wallet', 'Voir clair', 'Comprendre mon argent'),
 ('generateur-de-projet.html?src=accueil-portes', 'bulb', 'Déclic', 'Trouver mon idée de business'),
 ('ma-brvm.html?src=accueil-portes', 'bars', 'Ma BRVM', 'Et si j’avais investi ?'),
 ('ateliers.html?src=accueil-portes', 'cap', 'Formation', 'Apprendre à mon rythme')])

def liste(L): return '<ul class="pp-liens">' + ''.join('<li><a href="%s">%s</a></li>' % (f['p'], E(f['t'])) for f in L) + '</ul>'
TOUT = ''
for cle, nom, sous, _ in FAMILLES:
    L = PAR[cle]; extra = ''
    if cle == 'former':
        extra = '<details class="pp-sousd"><summary>Les %d ateliers, de A à Z</summary>%s</details>' % (len(ATELIERS), liste(ATELIERS))
    if cle == 'efa':
        extra = '<ul class="pp-liens"><li><a href="app/">L’appli EFA</a></li><li><a href="https://chat.whatsapp.com/Dm1l569bAwlAa1honQiV3a" target="_blank" rel="noopener">EFA Community (WhatsApp)</a></li></ul>'
    n = len(L) + (len(ATELIERS) if cle == 'former' else 0)
    TOUT += '<details class="pp-fam" id="tout-%s"><summary><span><b>%s</b><small>%s</small></span><em>%d</em></summary>%s%s</details>' % (cle, E(nom), E(sous), n, liste(L), extra)

accueil = TETE % 'Votre argent, votre prochain pas · EFA' + '''
<section class="pp-hero"><div class="pp-hero-img" style="background-image:url('clone/assets/accueil-porte-bourse-tour-f.webp')"></div>
<div class="pp-in"><div class="pp-txt">
<button type="button" class="pp-pastille" data-video><img src="clone/assets/elysee-portrait-carre.jpg" alt="">Élysée vous accueille<span class="pp-play" aria-hidden="true"></span></button>
<h1 class="pp-h1"><span>Votre argent.</span><span>Votre question.</span><span class="pp-ciel">Votre prochain pas.</span></h1>
<p class="pp-sous">Dites-nous ce que vous cherchez à faire. EFA vous aide à trouver par où commencer.</p>
''' + champ('J’ai 500 000 F. Qu’est-ce que je peux lancer ?') + '''
<div class="pp-chips"><a href="''' + q('Où passe mon argent ?') + '''">Où passe mon argent ?</a><a href="''' + q('Je veux investir à la BRVM') + '''">Je veux investir à la BRVM</a><a href="''' + q('J’ai une idée de business') + '''">J’ai une idée de business</a></div>
<p class="pp-diag">Je ne sais pas par où commencer → <a href="diagnostic.html?src=accueil">Faire mon diagnostic</a> · 6 min, gratuit</p>
</div></div></section>

<section class="pp-portes"><div class="pp-in">
<h2>Je sais déjà ce que je cherche</h2><span class="pp-trait"></span>
<div class="pp-grille">''' + PORTES + '''</div>
<p class="pp-bas">Gratuit pour commencer · <b>La finance, avec nos réalités.</b></p>
</div></section>

<section class="pp-actu"><div class="pp-in">
<div class="pp-actu-t"><h2>L’actu qui vous concerne</h2><a class="pp-lien" href="news.html">Toutes les actualités →</a></div>
<div class="pp-actu-l" id="pp-actu"></div>
</div></section>

<section class="pp-tout" id="tout-efa"><div class="pp-in">
<h2>Tout EFA, par besoin</h2><span class="pp-trait"></span>
<p class="pp-tout-s">%d contenus : chaque outil, chaque guide, chaque atelier. Touchez un thème pour l’ouvrir.</p>
<div class="pp-fams">''' % (sum(len(v) for v in PAR.values()) + len(ATELIERS)) + TOUT + '''</div>
</div></section>

<div class="pp-video" id="pp-video" hidden><video id="pp-vid" src="clone/assets/elysee-bienvenue.mp4" poster="clone/assets/elysee-bienvenue.jpg" controls playsinline preload="none"></video><button type="button" id="pp-fermer" aria-label="Fermer la vidéo">×</button></div>
<script>
(function(){
  var v=document.getElementById('pp-video'),vid=document.getElementById('pp-vid');
  document.querySelectorAll('[data-video]').forEach(function(b){b.addEventListener('click',function(){v.hidden=false;try{vid.play()}catch(e){}})});
  document.getElementById('pp-fermer').addEventListener('click',function(){v.hidden=true;vid.pause()});
  document.querySelector('.pp-q').addEventListener('submit',function(){var i=document.getElementById('pp-q');if(!i.value.trim())i.value=i.placeholder;});
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  fetch('news/news-data.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){
    var C=d.categories||{},L=(d.articles||[]).filter(function(a){return a.statut==='publié'||a.statut==='corrigé'}).slice(0,3);
    document.getElementById('pp-actu').innerHTML=L.map(function(a){return '<a class="pp-art" href="news/'+a.id+'.html"><small>'+esc(C[a.categorie]||a.rubrique||'')+'</small><b>'+esc(a.titre)+'</b></a>'}).join('');
  }).catch(function(){document.querySelector('.pp-actu').hidden=true});
  if(location.hash.indexOf('#tout-')===0){var el=document.getElementById(location.hash.slice(1));if(el&&el.tagName==='DETAILS')el.open=true;}
})();
</script>
''' + FIN
open('accueil-v3.html', 'w', encoding='utf-8').write(accueil)

reponse = TETE % 'Mon prochain pas · EFA' + '''
<section class="pp-hero pp-hero-c"><div class="pp-in"><div class="pp-txt">
<p class="pp-fil"><a href="accueil-v3.html">Accueil</a> / Mon prochain pas</p>
<h1 class="pp-h1 pp-h1-c"><span>Une question.</span><span class="pp-ciel">Un prochain pas.</span></h1>
''' + champ('Posez votre question…') + '''
</div></div></section>
<section class="pp-rep"><div class="pp-in" id="pp-rep" aria-live="polite"></div></section>
<script>document.addEventListener('DOMContentLoaded',function(){window.EFA_PROCHAIN_PAS.page();});</script>
''' + FIN
open('prochain-pas.html', 'w', encoding='utf-8').write(reponse)
subprocess.run(['python3', 'scripts/clone/habiller.py'], check=True, stdout=subprocess.DEVNULL)
# habiller.py réécrit aussi d'autres pages (lignes vides) : on ne garde que les deux pages de la maquette
autres = [f for f in subprocess.run(['git', 'diff', '--name-only'], capture_output=True, text=True).stdout.split()
          if f not in ('accueil-v3.html', 'prochain-pas.html', 'data/tout-efa.json') and f.endswith('.html')]
if autres: subprocess.run(['git', 'checkout', '-q', '--'] + autres)
for p in ('accueil-v3.html', 'prochain-pas.html'):
    s = open(p, encoding='utf-8').read(); print(p, 'menu' if 'clone-haut' in s else 'SANS MENU', 'pied' if 'efa-foot' in s else 'SANS PIED')
