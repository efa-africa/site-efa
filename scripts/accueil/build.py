# Accueil d'efa.africa depuis le 21 novembre 2026 : « Votre argent. Votre question. Votre prochain pas. »
# Fabrique : data/tout-efa.json (index de tout le site), index.html, prochain-pas.html, puis les habille (menu et pied du site).
# L'accueil précédent est conservé : sauvegarde-plateforme-2026-11-21.html (modèle clone/_index.html) et branche git du même nom.
# Lancer : python3 scripts/accueil/build.py
import sys, re, os, json, html, glob, subprocess
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
E = lambda t: html.escape(str(t), quote=True)
def q(t): return 'prochain-pas.html?q=' + __import__('urllib.parse').parse.quote(t)
V = '20261121z'

FAMILLES = [
 ('argent', 'Reprendre la main sur mon argent', 'Budget, épargne, réserve, crédit, dettes, retraite',
  'diagnostic ou-est-passe-mon-argent outil-budget construire-son-budget budget-mobile-money engagements-et-exceptions separer-les-poches epargner cercle-spirale ou-garder-sa-reserve liberte-financiere cout-total-credit renegocier-une-dette consommer-et-acheter dat-emprunts-etat preparer-ma-retraite decider outils point-de-depart cent-outils mon-vrai-reste mes-dettes puis-je-aider mon-patrimoine promesse-credible journal-decisions mon-annee'),
 ('activite', 'Bâtir et faire grandir mon activité', 'Idées de business, business plan, valeur de l’entreprise',
  'generateur-de-projet avec-100000-je-lance-quoi mon-business-plan-tient-il mon-espace-business-plan valoriser-mon-entreprise salaire-fixe-activite investir-gagner-plus projets-a-suivre mon-idee-test'),
 ('bourse', 'Faire grandir mon argent : investir, la Bourse (BRVM)', 'Ma BRVM, le marché du jour, les SGI, les cours pour débuter',
  'ma-brvm bourse premiers-pas-bourse marches semaine-bourse societes calendrier obligations acheter-des-actions sgi sgi-comparer questions-a-poser-a-sa-sgi questions-avant-d-investir acteurs coach-bourse ecole-de-la-bourse ecole-bourse bourse-essentiel bourse-marche bourse-pro bourse-projets investir investir-bourse investir-assurance-epargne investir-terrain-immobilier opcvm-fcpe club-investissement jeu-portefeuille-baisse personnalite etude-frais-bourse'),
 ('tontine', 'La tontine', 'Comprendre, choisir, cotiser sans se faire avoir',
  'tontine ecole-de-la-tontine avant-de-cotiser choisir-son-rang-tontine tontine-formations tontine-decider-avant-de-recevoir tontine-rentree cotiser-depuis-l-etranger etude-tontine-en-chiffres'),
 ('famille', 'Famille, maison et moments de vie', 'Terrain, chantier, enfants, décès, prêter à un proche, arnaques',
  'acheter-un-terrain budget-chantier arrivee-enfant etudes-enfants-heritage apres-un-deces papiers-famille preter-a-un-proche question-preter-a-ma-soeur solidarite-assureur-de-la-famille arnaques se-proteger-des-arnaques'),
 ('former', 'Me former', 'Les ateliers, les parcours, les certificats, les écoles EFA',
  'apprendre questions ateliers ateliers-budget ateliers-placer ateliers-bourse ateliers-credit ateliers-activite ateliers-famille ateliers-arnaques ateliers-elysee parcours certificat-pilote certificat-maitrise certificat-patrimoine certificat-cefa traders corporate ceo quiz minfin'),
 ('media', 'L’actu, les études, le média', 'EFA News, décryptages, tribunes, études, Africa 2075, podcast',
  'news decryptage decryptage-sir-brvm tribunes etudes-prospective methode africa-2075 africa-2075-fondateur africa-2075-n1 africa-2075-n2 africa-2075-dossier-1 podcast lettre bibliotheque musee balade-economie'),
 ('espaces', 'Cadres, dirigeants, étudiants, organisations', 'Les espaces par public et les programmes pour les organisations',
  'cadres dirigeants patrimoine etudiants organisations programme-organisation rejoindre espace-organisation academy-equipe ambassadeurs partenaires demo'),
 ('efa', 'EFA et moi', 'Mon espace, l’abonnement, Élysée, Ely, nous écrire',
  'mon-efa abonnement rendez-vous ely auteur enquete confidentialite'),
]
EXCLUES = set('index accueil-v1 accueil-v3 prochain-pas sauvegarde-plateforme-2026-11-21 question ateliers-cles comite merci-guide tableau-ely marches-labo sgi-fiche societe'.split())
TITRES = {'cent-outils': 'Les 100 outils EFA', 'mon-vrai-reste': 'Mon vrai reste', 'mes-dettes': 'Mes dettes classées', 'puis-je-aider': 'Puis-je aider ce mois-ci ?', 'mon-idee-test': 'Mon idée vaut-elle un test ?', 'mon-patrimoine': 'Mon patrimoine, aujourd’hui et dans dix ans', 'promesse-credible': 'Cette promesse est-elle crédible ?', 'journal-decisions': 'Mon journal de décisions', 'mon-annee': 'Mon année EFA', 'questions': 'Les 100 questions sur l’argent, et leurs réponses', 'apprendre': 'Apprendre : seul ou accompagné', 'generateur-de-projet': 'Déclic · trouver mon idée de business', 'rendez-vous': 'Rendez-vous, contact et organisations', 'auteur': 'À propos d’EFA et d’Élysée Johnson',
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
<meta name="theme-color" content="#0B1220">
%s
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap">
<link rel="stylesheet" href="clone/prochain-pas.css?v=''' + V + '''">
<script src="clone/prochain-pas.js?v=''' + V + '''" defer></script>
</head>
<body>
<header class="top"></header>
<main id="contenu" class="pp" data-garde>
'''
FIN = '''</main>
<script data-goatcounter="https://efa-africa.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script src="efa-appli.js?v=20261116a" defer></script>
<script src="/clone/ambassadeur.js?v=20261103a" defer></script>
<script src="/clone/mesure.js?v=20261104a" defer></script>
</body>
</html>
'''
v1 = open('accueil-v1.html', encoding='utf-8').read(); v1 = v1[:v1.find('</head>')]
META_ACCUEIL = '\n'.join(re.findall(r'<title>.*?</title>|<meta (?:name="description"|property="og:[^"]+"|name="twitter:[^"]+")[^>]*>'
                          r'|<link rel="(?:canonical|apple-touch-icon)"[^>]*>|<script type="application/ld\+json">.*?</script>', v1, re.S))
META_REPONSE = ('<title>Mon prochain pas · EFA</title>\n<link rel="canonical" href="https://efa.africa/prochain-pas">\n'
                '<meta name="description" content="Posez votre question d’argent : EFA vous répond en bref, vous propose l’outil pour l’appliquer à votre cas et les contenus pour aller plus loin.">')
AFF = [('atelier-ou-passe-mon-argent.html', 'ou-passe-mon-argent', '', 'Où est passé mon argent ?', 'Voir son mois, trouver les fuites'),
       ('atelier-budget-zero.html', 'budget-zero', 'sv/', 'Mon budget à zéro', 'Une mission pour chaque franc'),
       ('coach-bourse.html', 'premier-ordre-brvm', 'sv/', 'Mon premier ordre à la Bourse (BRVM)', 'Du compte à l’achat, pas à pas'),
       ('atelier-activite-gagne-t-elle.html', 'activite-gagne-t-elle', 'sv/', 'Mon activité gagne-t-elle de l’argent ?', 'Ce qui reste vraiment')]
FORMER = ''.join('<a class="pp-aff" href="%s?src=accueil-former"><img src="clone/assets/affiches/%s%s.webp" alt="" loading="lazy" decoding="async"><b>%s</b><span>%s</span></a>' % (u, d, i, E(t), E(x)) for u, i, d, t, x in AFF)
# Icônes au trait des questions (carré de couleur, tracé blanc)
IC_Q = {
  'credit': '<rect x="5" y="3" width="14" height="18" rx="2.5"/><rect x="8" y="6.5" width="8" height="3.5" rx="1"/><path d="M8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01"/>',
  'placement': '<path d="M12 3l7 2.6v5.6c0 4.6-2.9 8.1-7 9.8-4.1-1.700-7-5.200-7-9.800V5.600L12 3z"/><path d="M12 8v5M12 16h.01"/>',
  'famille': '<circle cx="9" cy="8.500" r="3"/><path d="M3.500 19c0-3 2.500-5 5.500-5s5.500 2 5.500 5"/><circle cx="16.500" cy="9.500" r="2.300"/><path d="M16 14.200c2.600.100 4.500 1.800 4.500 4.300"/>',
  'terrain': '<path d="M12 12.500s3.500-3.300 3.500-6a3.500 3.500 0 0 0-7 0c0 2.700 3.500 6 3.500 6z"/><circle cx="12" cy="6.500" r="1"/><path d="M8 13.500H6.500L3.500 20h17l-3-6.500H16"/>',
  'tontine': '<circle cx="12" cy="12" r="6.500"/><circle cx="12" cy="5.500" r="2" fill="currentColor"/><circle cx="6.300" cy="15.300" r="2" fill="currentColor"/><circle cx="17.700" cy="15.300" r="2" fill="currentColor"/>',
  'epargne': '<rect x="8" y="3" width="8" height="3" rx="1"/><path d="M7 8.500c0-1.400 1.100-2.500 2.500-2.500h5c1.400 0 2.500 1.100 2.500 2.500v9.500a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V8.500z"/><ellipse cx="12" cy="13" rx="2.500" ry="1.200"/><path d="M9.500 13v3c0 .700 1.100 1.200 2.500 1.200s2.500-.500 2.500-1.200v-3"/>',
}
IC_Q = {k: v.replace('00"', '"').replace('00 ', ' ').replace('00-', '-').replace('00c', 'c').replace('00V', 'V').replace('00L', 'L').replace('00H', 'H').replace('00h', 'h') for k, v in IC_Q.items()}
FLECHE = '<svg class="pp-fl" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path d="M8 12h8M12.500 8.500 16 12l-3.500 3.500"/></svg>'.replace('500', '5')
EXPRESS = ''.join('<a class="pp-exp pp-t-%s" href="%s"><span class="pp-exp-t"><svg class="pp-exp-ic" viewBox="0 0 24 24" aria-hidden="true">%s</svg><small>%s</small></span><b>%s</b><span class="pp-lire">Lire la réponse %s</span></a>' % (c, q(t), IC_Q[c], k, E(t).replace(' ?', '&nbsp;?'), FLECHE) for c, k, t in [
  ('credit', 'Crédit', 'Combien me coûte vraiment un crédit ?'), ('placement', 'Placement', 'On me promet 30 % par mois, est-ce sérieux ?'), ('famille', 'Famille', 'Ma sœur me demande un prêt, que faire ?'),
  ('terrain', 'Terrain', 'Que vérifier avant d’acheter un terrain ?'), ('tontine', 'Tontine', 'Faut-il entrer dans une tontine ?'), ('epargne', 'Épargne', 'Comment épargner quand on gagne peu ?')])

def champ(ph):
    return ('<form class="pp-q" action="prochain-pas.html" method="get" role="search"><label for="pp-q" class="pp-sr">Votre question</label>'
            '<textarea id="pp-q" name="q" rows="1" autocomplete="off" enterkeyhint="search" placeholder="%s"></textarea><button class="pp-go" type="submit">Trouver mon prochain pas →</button></form>') % E(ph)

PORTES = ''.join('<a class="pp-porte" href="%s"><span class="pp-ic">%s</span><span class="pp-pt"><b>%s</b><span>%s</span></span><i aria-hidden="true">→</i></a>' % (u, ic(i), t, s) for u, i, t, s in [
 ('ou-est-passe-mon-argent.html?src=accueil-portes', 'wallet', 'Voir clair', 'Reprendre la main sur mon argent'),
 ('generateur-de-projet.html?src=accueil-portes', 'bulb', 'Déclic', 'Bâtir mon activité'),
 ('ma-brvm.html?src=accueil-portes', 'bars', 'Ma BRVM', 'Faire grandir mon argent'),
 ('apprendre.html?src=accueil-portes', 'cap', 'Apprendre', 'Seul ou accompagné')])

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

accueil = TETE % META_ACCUEIL + '''
<section class="pp-hero"><div class="pp-hero-img" style="background-image:url('clone/assets/accueil-porte-bourse-tour-f.webp')"></div>
<div class="pp-in"><div class="pp-txt">
<button type="button" class="pp-pastille" data-video><img src="clone/assets/elysee-portrait-carre.jpg" alt="">Élysée vous accueille<span class="pp-play" aria-hidden="true"></span></button>
<p class="pp-devise">Apprendre. Bâtir. S’enrichir.</p>
<h1 class="pp-h1"><span>Votre argent.</span><span>Votre question.</span><span class="pp-ciel">Votre prochain pas.</span></h1>
<p class="pp-sous">Dites-nous ce que vous voulez bâtir. EFA vous montre par où commencer.</p>
''' + champ('J’ai 500 000 F. Qu’est-ce que je peux lancer ?') + '''
<div class="pp-chips"><a class="pp-chip-1" href="''' + q('Avec l’argent que j’ai aujourd’hui, par où commencer pour devenir riche ?') + '''">Avec l’argent que j’ai aujourd’hui, par où commencer pour devenir riche ?</a><a href="''' + q('Où passe mon argent ?') + '''">Où passe mon argent ?</a><a href="''' + q('Je veux investir à la BRVM') + '''">Je veux investir à la BRVM</a><a href="''' + q('J’ai une idée de business') + '''">J’ai une idée de business</a></div>
<p class="pp-diag">Je ne sais pas par où commencer → <a href="diagnostic.html?src=accueil">Faire mon diagnostic</a> · 6 min, gratuit</p>
</div></div></section>

<section class="pp-portes"><div class="pp-in">
<h2>Je sais déjà ce que je cherche</h2><span class="pp-trait"></span>
<div class="pp-grille">''' + PORTES + '''</div>
<p class="pp-bas"><b>L’Afrique sera riche de ceux qui savent faire grandir leur argent.</b><br>Gratuit pour commencer · La finance, avec nos réalités.</p>
</div></section>

<section class="pp-express"><div class="pp-in">
<p class="pp-guide">EFA vous guide</p>
<h2>Une question. Un premier pas.</h2><span class="pp-trait-g"></span>
<p class="pp-exp-s">Une réponse courte, puis un outil pour avancer.</p>
<div class="pp-exps">''' + EXPRESS + '''</div>
<p class="pp-voir100"><a href="cent-outils.html">Voir les 100 outils ''' + FLECHE + '''</a> &nbsp; <a href="questions.html">Lire les 100 questions et leurs réponses ''' + FLECHE + '''</a></p>
</div></section>

<section class="pp-former"><div class="pp-in">
<div class="pp-actu-t"><h2>Apprendre, seul ou accompagné</h2><a class="pp-lien" href="apprendre.html">Tout pour apprendre →</a></div>
<div class="pp-voies"><a class="pp-voie" href="apprendre.html#seul"><small>Ma bibliothèque</small><b>J’apprends seul</b><span>L’école EFA, les cours gratuits, les livres, le podcast.</span></a><a class="pp-voie pp-voie-c" href="apprendre.html#accompagne"><small>Être accompagné</small><b>Je me fais coacher</b><span>Les 57 ateliers, les ateliers avec Élysée Johnson, le rendez-vous.</span></a></div>
<div class="pp-affs">''' + FORMER + '''</div>
<p class="pp-former-b">Des situations d’ici, des exercices concrets. Vous préférez un parcours complet ? <a href="parcours.html">L’école EFA</a> · <a href="ateliers-elysee.html">Les ateliers avec Élysée Johnson</a></p>
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
  /* Anciennes ancres de l'accueil (menu, pied de page, liens déjà partagés) : on ouvre le thème correspondant */
  var ANC={benefices:'tout-argent',portes:'tout-argent',calculateur:'tout-argent',certificats:'tout-former',
    'pilier-agir':'tout-activite',marches:'tout-bourse','avant-de-signer':'tout-bourse',solutions:'tout-bourse','pilier-media':'tout-media','etudes-prospective':'tout-media',
    organisation:'tout-espaces',espaces:'tout-espaces',contact:'tout-efa-moi',auteur:'tout-efa-moi'};
  function ancre(){var h=location.hash.slice(1);if(!h)return;if(h==='seul'){location.replace('apprendre.html#seul');return;}if(h==='pilier-progresser'){location.replace('apprendre.html#accompagne');return;}var id=ANC[h]||h;if(id==='tout-efa-moi')id='tout-efa';var el=document.getElementById(id);if(!el)return;
    if(el.tagName==='DETAILS')el.open=true;setTimeout(function(){el.scrollIntoView({block:'start'})},60);}
  ancre();window.addEventListener('hashchange',ancre);
})();
</script>
''' + FIN
open('index.html', 'w', encoding='utf-8').write(accueil)

def carte(u, k, t, d, cta='Ouvrir'): return '<a class="pp-carte" href="%s"><p class="pp-k">%s</p><h3>%s</h3><p>%s</p><span class="pp-lien">%s →</span></a>' % (u, k, E(t), E(d), cta)
SEUL = ''.join([
 carte('cent-outils.html', 'Pratiquer', 'Les 100 outils EFA', 'Une question d’argent, un outil : vos chiffres, votre décision.', 'Voir les outils'),
 carte('questions.html', 'Questions et réponses', 'Les 100 questions sur l’argent', 'Budget, épargne, dettes, business, Bourse, patrimoine : une réponse courte et un outil pour chacune.', 'Lire les réponses'),
 carte('parcours.html', 'Le parcours complet', 'L’école EFA', 'Trois cycles, du diagnostic au patrimoine : Fondations, Maîtrise, Patrimoine. Un certificat local à la fin de chacun.', 'Commencer le parcours'),
 carte('diagnostic.html', 'Avant de commencer', 'Mon diagnostic', 'Six minutes pour savoir où vous en êtes et par quel module commencer.', 'Faire le point'),
 carte('ecole-de-la-bourse.html', 'Cours gratuit', 'École de la Bourse', 'Comprendre la Bourse (BRVM) pas à pas, avant d’acheter.'),
 carte('ecole-de-la-tontine.html', 'Cours gratuit', 'École de la tontine', 'Comment marche une tontine, et comment cotiser sans se faire avoir.'),
 carte('bibliotheque.html', 'Lire et s’inspirer', 'La bibliothèque EFA', 'Les livres résumés par EFA, le musée de l’économie, les parcours qui inspirent.'),
 carte('podcast.html', 'À écouter', 'Le podcast EFA', 'Des épisodes de quelques minutes pour comprendre l’argent.'),
 carte('quiz.html', 'S’entraîner', 'Le quiz de la semaine', 'Quelques questions pour vérifier ce que vous avez retenu.'),
 carte('minfin.html', 'En histoires', 'Min’Fin, la série', 'L’éducation financière racontée en épisodes courts.'),
 carte('outils.html', 'Pratiquer', 'Tous les outils et simulateurs', 'Budget, épargne, crédit, retraite, Bourse : appliquer à vos chiffres.')])
THEMES_AT = ''.join('<a href="%s.html">%s</a>' % (f['p'][:-5], E(f['t'])) for f in PAR['former'] if f['p'].startswith('ateliers-') and f['p'] != 'ateliers-elysee.html')
ACC = ''.join([
 carte('ateliers.html', 'Les 57 ateliers', 'Tous les ateliers, par thème', 'Trois essentiels par thème, puis le reste pour aller plus loin. Des situations d’ici, des exercices concrets.', 'Choisir un atelier'),
 carte('ateliers-elysee.html', 'Coaching', 'Ateliers avec Élysée Johnson', 'Être coaché par le fondateur d’EFA, sur votre situation.', 'Voir les ateliers'),
 carte('rendez-vous.html', 'En direct', 'Rendez-vous avec Élysée', 'Un échange sur votre question, ou le besoin de votre organisation.', 'Prendre rendez-vous'),
 carte('abonnement.html', 'Les formules', 'L’abonnement EFA', 'L’accès aux ateliers, mois par mois.', 'Voir les formules'),
 carte('ely.html', 'À toute heure', 'Ely, le guide d’EFA', 'Posez votre question, Ely vous oriente et explique.', 'Parler à Ely'),
 carte('organisations.html', 'En groupe', 'Pour les organisations', 'Former les salariés, les membres ou les étudiants de votre organisation.', 'Voir les programmes')])
META_APP = ('<title>Apprendre : seul ou accompagné · EFA</title>\n<link rel="canonical" href="https://efa.africa/apprendre">\n'
            '<meta name="description" content="Apprendre l’argent avec EFA : seul, avec l’école EFA, les cours gratuits et la bibliothèque ; ou accompagné, avec les ateliers et le coaching d’Élysée Johnson.">')
apprendre = TETE % META_APP + '''
<section class="pp-hero pp-hero-c"><div class="pp-in"><div class="pp-txt">
<p class="pp-fil"><a href="index.html">Accueil</a> / Apprendre</p>
<h1 class="pp-h1 pp-h1-c"><span>Apprendre.</span><span class="pp-ciel">Seul, ou accompagné.</span></h1>
<p class="pp-sous">On ne bâtit pas ce que l’on ne comprend pas. Choisissez votre façon d’avancer ; vous pouvez passer de l’une à l’autre à tout moment.</p>
<div class="pp-voies"><a class="pp-voie" href="#seul"><small>Ma bibliothèque</small><b>J’apprends seul</b><span>L’école EFA, les cours gratuits, les livres, le podcast.</span></a><a class="pp-voie pp-voie-c" href="#accompagne"><small>Être accompagné</small><b>Je me fais coacher</b><span>Les ateliers, le coaching d’Élysée Johnson, le rendez-vous.</span></a></div>
</div></div></section>

<section class="pp-app" id="seul"><div class="pp-in">
<p class="pp-k">Ma bibliothèque</p><h2>J’apprends seul, à mon rythme</h2>
<p class="pp-app-s">Gratuit pour commencer. Suivez le parcours dans l’ordre, ou piochez ce dont vous avez besoin aujourd’hui.</p>
<div class="pp-cartes">''' + SEUL + '''</div>
</div></section>

<section class="pp-app pp-app-g" id="accompagne"><div class="pp-in">
<p class="pp-k">Être accompagné</p><h2>Je me fais coacher</h2>
<p class="pp-app-s">Un atelier pour chaque décision, avec vos chiffres. Et quelqu’un pour vous répondre.</p>
<div class="pp-affs">''' + FORMER + '''</div>
<div class="pp-chips pp-chips-c">''' + THEMES_AT + '''</div>
<div class="pp-cartes">''' + ACC + '''</div>
</div></section>

<section class="pp-app" id="progression"><div class="pp-in">
<div class="pp-cartes pp-cartes-2">''' + carte('mon-efa.html', 'Mon EFA', 'Ma progression', 'Vos ateliers, vos parcours, vos fiches et vos certificats, au même endroit.', 'Ouvrir Mon EFA') + carte('certificat-cefa.html', 'Valider', 'Les certificats EFA', 'Un certificat local à la fin de chaque cycle, puis le CEFA.', 'Voir les certificats') + '''</div>
</div></section>
''' + FIN
open('apprendre.html', 'w', encoding='utf-8').write(apprendre)

reponse = TETE % META_REPONSE + '''
<section class="pp-hero pp-hero-c"><div class="pp-in"><div class="pp-txt">
<p class="pp-fil"><a href="index.html">Accueil</a> / Mon prochain pas</p>
<h1 class="pp-h1 pp-h1-c"><span>Une question.</span><span class="pp-ciel">Un prochain pas.</span></h1>
''' + champ('Posez votre question…') + '''
</div></div></section>
<section class="pp-rep"><div class="pp-in" id="pp-rep" aria-live="polite"></div></section>
<script>document.addEventListener('DOMContentLoaded',function(){window.EFA_PROCHAIN_PAS.page();});</script>
''' + FIN
open('prochain-pas.html', 'w', encoding='utf-8').write(reponse)

# ---- Les 100 questions : le catalogue (scripts/question/catalogue.py) rangé par thème ----
sys.path.insert(0, 'scripts/question')
import catalogue as _cat
CAT = _cat.main()
INTROS = ['Savoir où va l’argent, et reprendre la main.', 'Mettre de côté, même avec peu, et se protéger des coups durs.', 'Emprunter sans se noyer, prêter sans se fâcher.',
          'Un revenu de plus, une activité qui gagne vraiment.', 'Faire grandir son argent avec les entreprises d’Afrique.', 'Bâtir ce qui dure, et le transmettre.']
blocs = ''
for k, th in enumerate(CAT['themes']):
    L = [x for x in CAT['questions'] if x['th'] == th]
    blocs += ('<section class="pp-cent-t pp-c%d" id="theme-%d"><h2>%s</h2><p>%s</p><div class="pp-qr">' % (k + 1, k + 1, E(th), INTROS[k]) +
              ''.join('<details id="q%d"><summary><i>%d</i><span>%s</span></summary><div class="pp-qr-r"><p>%s</p><p class="pp-qr-a" data-garde><a class="pp-qr-o" href="%s" data-goatcounter-click="qr-outil-%d">%s →</a><a class="pp-qr-l" href="%s">Réponse complète et pages à lire</a></p></div></details>'
                      % (x['n'], x['n'], E(x['q']).replace(' ?', '&nbsp;?'), re.sub(r'(\d) (\d{3})', r'\1&nbsp;\2', E(x['r'])).replace(' F ', '&nbsp;F ').replace(' %', '&nbsp;%'), CAT['outils'][x['o']]['u'], x['n'], E(CAT['outils'][x['o']]['cta']), q(x['q'])) for x in L) + '</div></section>\n')
FAQ = json.dumps({'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': x['q'], 'acceptedAnswer': {'@type': 'Answer', 'text': x['r']}} for x in CAT['questions']]}, ensure_ascii=False)
META_Q = ('<title>Les 100 questions sur l’argent que l’on nous pose · EFA</title>\n<link rel="canonical" href="https://efa.africa/questions">\n'
          '<meta name="description" content="Budget, épargne, dettes, business, Bourse (BRVM), patrimoine : 100 questions sur l’argent, chacune avec une réponse courte et l’outil pour l’appliquer à votre cas.">\n<script type="application/ld+json">' + FAQ + '</script>')
questions = TETE % META_Q + '''
<section class="pp-hero pp-hero-c"><div class="pp-in"><div class="pp-txt">
<p class="pp-fil"><a href="index.html">Accueil</a> / Les 100 questions</p>
<h1 class="pp-h1 pp-h1-c"><span>100 questions.</span><span class="pp-ciel">100 réponses.</span></h1>
<p class="pp-sous">Les questions que l’on se pose sur l’argent, avec nos réalités. Touchez une question : la réponse s’ouvre, avec l’outil pour l’appliquer à vos chiffres.</p>
''' + champ('Ou posez la vôtre…') + '''
</div></div></section>
<section class="pp-cent"><div class="pp-in">
<nav class="pp-cent-nav" aria-label="Thèmes">''' + ''.join('<a class="pp-c%d" href="#theme-%d">%s</a>' % (k + 1, k + 1, E(th)) for k, th in enumerate(CAT['themes'])) + '''</nav>
''' + blocs + '''</div></section>
''' + FIN
open('questions.html', 'w', encoding='utf-8').write(questions)

# ---- Les outils EFA du 21 novembre 2026 (scripts/outils/specs.py, calcul dans clone/outils-efa.js) et la carte des 100 outils ----
sys.path.insert(0, 'scripts/outils')
import specs as _sp
V_OT = '20261121c'
LIENS_OT = '<link rel="stylesheet" href="clone/outils-efa.css?v=%s"><script src="clone/outils-efa.js?v=%s" defer></script>' % (V_OT, V_OT)
NOMS_OT = {x['f']: x['t'] for x in _sp.PAGES}
for k, x in enumerate(_sp.PAGES):
    autres = [y for y in _sp.PAGES if y['f'] != x['f']]
    autres = (autres[k:] + autres[:k])[:3]
    meta = ('<title>%s · EFA</title>\n<link rel="canonical" href="https://efa.africa/%s">\n<meta name="description" content="%s">\n%s' % (E(x['t']), x['f'], E(x['d']), LIENS_OT))
    page = TETE % meta + """
<section class="pp-hero pp-hero-c"><div class="pp-in"><div class="pp-txt">
<p class="pp-fil"><a href="index.html">Accueil</a> / <a href="cent-outils.html">Les outils</a> / %s</p>
<h1 class="pp-h1 pp-h1-c"><span>%s</span><span class="pp-ciel">%s</span></h1>
<p class="pp-sous">%s</p>
</div></div></section>
<section class="ot" data-outil-efa="%s" data-garde><div class="pp-in">
%s
<div class="ot-suite"><h2>Continuer</h2><div class="pp-cartes">%s</div></div>
</div></section>
""" % (E(x['k']), E(x['h'][0]), E(x['h'][1]), E(x['s']), x['js'], x['form'],
       ''.join(carte(y['f'] + '.html', y['k'], y['t'], y['s'], 'Ouvrir') for y in autres) + carte('cent-outils.html', 'Tout voir', 'Les 100 outils EFA', 'Chaque question d’argent a son outil.', 'Voir les outils')) + FIN
    open(x['f'] + '.html', 'w', encoding='utf-8').write(page)
manque = [c for c in _sp.CENT if not os.path.exists(re.split(r'[?#]', c[3])[0])]
if manque: print('100 outils : pages absentes', [(c[0], c[3]) for c in manque]); sys.exit(1)
sec = ''
for i, fam in enumerate(_sp.FAMILLES):
    L = _sp.CENT[i * 10:(i + 1) * 10]
    sec += '<section class="c%d" id="f%d"><h2>%s</h2><ol>%s</ol></section>\n' % (i + 1, i + 1, E(fam), ''.join(
        '<li><a href="%s"><i>%d</i><b>%s%s</b><span>%s</span>%s</a></li>' % (c[3], c[0], E(c[1]), '<em>Nouveau</em>' if c[4] == _sp.N else '', E(c[2]).replace(' ?', '&nbsp;?'), '<small>Dans : %s</small>' % E(c[4]) if c[4] and c[4] != _sp.N else '') for c in L))
META_C = ('<title>Les 100 outils EFA : une question d’argent, un outil · EFA</title>\n<link rel="canonical" href="https://efa.africa/cent-outils">\n'
          '<meta name="description" content="Budget, épargne, dettes, famille, business, Bourse (BRVM), patrimoine, arnaques : 100 outils EFA pour passer de la question à la décision, avec vos chiffres.">\n' + LIENS_OT)
cent = TETE % META_C + """
<section class="pp-hero pp-hero-c"><div class="pp-in"><div class="pp-txt">
<p class="pp-fil"><a href="index.html">Accueil</a> / Les 100 outils</p>
<h1 class="pp-h1 pp-h1-c"><span>100 outils.</span><span class="pp-ciel">Vos chiffres, votre décision.</span></h1>
<p class="pp-sous">Chaque outil part d’une question, prend vos chiffres et vous rend une décision ou une fiche à garder. La finance, avec nos réalités.</p>
</div></div></section>
<section class="ot ot-cent" data-garde><div class="pp-in">
<nav class="ot-cent-nav" aria-label="Familles d’outils">%s</nav>
%s</div></section>
""" % (''.join('<a href="#f%d">%s</a>' % (i + 1, E(f)) for i, f in enumerate(_sp.FAMILLES)), sec) + FIN
open('cent-outils.html', 'w', encoding='utf-8').write(cent)
PAGES_OT = [x['f'] + '.html' for x in _sp.PAGES] + ['cent-outils.html']

for p in ['index.html', 'prochain-pas.html', 'apprendre.html', 'questions.html'] + PAGES_OT:
    subprocess.run(['python3', 'scripts/clone/habiller.py', '--page', p], check=True, stdout=subprocess.DEVNULL)
RENVOI = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="https://efa.africa/%s"><title>EFA</title><script>location.replace("%s"+location.search+location.hash)</script><meta http-equiv="refresh" content="0; url=%s"></head><body><p><a href="%s">Éducation Financière Afrique</a></p></body></html>\n'
open('accueil-v3.html', 'w', encoding='utf-8').write(RENVOI % ('', './', './', './'))
open('question.html', 'w', encoding='utf-8').write(RENVOI % ('prochain-pas', 'prochain-pas.html', 'prochain-pas.html', 'prochain-pas.html'))
for p in ('index.html', 'prochain-pas.html'):
    s = open(p, encoding='utf-8').read(); print(p, 'menu' if 'clone-haut' in s else 'SANS MENU', 'pied' if 'efa-foot' in s else 'SANS PIED')
