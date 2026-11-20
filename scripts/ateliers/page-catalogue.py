#!/usr/bin/env python3
"""EFA · Fabrique ateliers.html : tous les ateliers rangés par thème.
Chaque thème : un parcours principal (dans l'ordre) puis les ateliers à la carte, en rangées qu'on fait glisser.
Source : data/mon-efa-ateliers.json (node scripts/mon-efa/catalogue.js) + THEMES ci-dessous.
Usage : python3 scripts/ateliers/page-catalogue.py  puis  python3 scripts/clone/habiller.py --page ateliers.html
Un atelier absent de THEMES est signalé : l'ajouter dans un thème."""
import os, json, os, re, html
os.chdir(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
D = json.load(open('data/mon-efa-ateliers.json', encoding='utf-8'))
D['jeu-portefeuille-baisse'] = {'t': 'Jeu : mon portefeuille face à la baisse', 'n': 0, 'page': 'jeu-portefeuille-baisse.html', 'prix': 0, 'jeu': 1}
verrou = open('efa-verrou.js', encoding='utf-8').read()
UNITE = set(re.findall(r"'atelier-[^']+': \['([^']+)', \d+, '[^']*', \d, \d, 'unite'\]", verrou))

THEMES = [
  # (clé, titre, chapo, image, 3 essentiels, parcours complet, à la carte)
  ('budget', 'Mon budget au quotidien', 'Savoir où part l’argent, tenir un budget et se constituer une réserve.', 'theme-budget-900.webp',
   ['ou-passe-mon-argent', 'budget-zero', 'reserve-securite'],
   ['ou-passe-mon-argent', 'budget-qui-tient', 'reserve-securite', 'mobile-money-frais'], ['budget-zero', 'finances-personnelles', 'epargner-ne-suffit-pas', 'grosse-somme', 'preter-ou-donner']),
  ('placer', 'Épargner et placer', 'Choisir un placement selon la date de vos projets, et le comprendre avant de signer.', 'theme-placer-900.webp',
   ['placer-selon-horizon', 'placements-expliques', 'fonds-commun'],
   ['epargner-ne-suffit-pas', 'placer-selon-horizon', 'placements-expliques', 'revenu-fixe', 'fonds-commun', 'strategie-investissement'], ['court-terme', 'bons-du-tresor', 'economie-pour-investir', 'inflation', 'crypto-reseaux', 'assurance-vie', 'tontine-spirale']),
  ('bourse', 'Investir en Bourse (BRVM)', 'De zéro à votre portefeuille : comprendre, choisir une action, construire, encaisser des dividendes.', 'theme-bourse-900.webp',
   ['premiers-pas-bourse', 'premiere-action', 'construire-son-portefeuille'],
   ['premiers-pas-bourse', 'premiere-action', 'lire-societe-cotee', 'construire-son-portefeuille', 'portefeuille-factures'], ['tontine-bourse', 'investir-dividendes', 'etats-financiers', 'marche-emergent', 'premier-ordre-brvm', 'economie-pour-investir', 'jeu-portefeuille-baisse']),
  ('credit', 'Crédit et dettes', 'Emprunter quand c’est utile, en connaître le vrai coût, et sortir des dettes.', 'theme-credit-900.webp',
   ['cout-reel-de-mon-credit', 'credit-fait-pour-moi', 'sortir-dettes'],
   ['credit-fait-pour-moi', 'cout-reel-de-mon-credit', 'ma-banque-va-t-elle-me-preter', 'bien-utiliser-mon-credit', 'rembourser-sans-se-noyer'],
   ['eviter-le-surendettement', 'sortir-dettes', 'quand-le-credit-va-mal', 'grandir-avec-le-credit', 'choisir-sa-microfinance']),
  ('activite', 'Mon activité', 'Séparer la caisse de la maison, savoir si l’on gagne vraiment, investir au bon moment.', 'theme-activite-900.webp',
   ['ou-est-l-argent-de-mon-activite', 'activite-gagne-t-elle', 'investir-activite'],
   ['ou-est-l-argent-de-mon-activite', 'commerce-sans-comptabilite', 'activite-gagne-t-elle', 'investir-activite'], ['inflation', 'lire-business-plan']),
  ('famille', 'Famille et retraite', 'Préparer sa retraite, financer les études, faire face aux grands moments.', 'atelier-pilier-famille.webp',
   ['retraite-droits', 'retraite-sans-pension', 'etudes-enfant'],
   ['retraite-droits', 'retraite-sans-pension', 'assurance-vie'], ['etudes-enfant', 'deces-parent', 'preter-ou-donner']),
  ('terrain', 'Terrain et logement', 'Savoir ce que vos revenus permettent, et acheter un lot sans se faire avoir.', 'univers-terrain.webp',
   ['acheter-construire-attendre', 'acheter-un-lot'],
   ['acheter-construire-attendre', 'acheter-un-lot'], []),
  ('arnaques', 'Éviter les arnaques', 'Reconnaître la promesse trop belle et le faux conseiller, avant de payer.', 'theme-arnaques-900.webp',
   ['rendement-garanti', 'faux-conseiller', 'avant-de-confier-ou-d-investir'],
   ['avant-de-confier-ou-d-investir', 'rendement-garanti', 'faux-conseiller'], ['crypto-reseaux', 'vente-en-reseau']),
]
vus = {i for th in THEMES for i in th[4] + th[5] + th[6]}
manque = [k for k in D if k not in vus]
if manque: print('À ranger dans un thème :', manque)
for th in THEMES:
    assert len(th[4]) <= 3, th[0]
    for i in th[4] + th[5] + th[6]: assert i in D, i
def suite(th):
    top, parc, cl = th[4], th[5], th[6]
    return [i for i in parc if i not in top], [i for i in dict.fromkeys(cl) if i not in top and i not in parc]

e = lambda s: html.escape(s, quote=True)
def prix(i, a):
    if a.get('jeu'): return '<span class="px g">Jeu gratuit</span>'
    if not a['prix']: return '<span class="px g">Gratuit</span>'
    if i in UNITE: return '<span class="px">Abonnés</span><span class="px2">ou 5 000 F à l’unité</span>'
    return '<span class="px">Abonnés</span>' + ('<span class="px2">chapitre 1 offert</span>' if a.get('offerts') else '')
def carte(i, k=None, lab=None, visage=False):
    a = D[i]; n = a.get('n') or 0
    meta = 'Jeu · 5 minutes' if a.get('jeu') else ('%d activités' % n if n else 'Avec Élysée Johnson')
    if os.path.exists('clone/assets/affiches/%s.webp' % i):
        return ('<a class="ca ca-aff" href="%s" data-id="%s"><img class="ca-img" src="clone/assets/affiches/%s%s.webp?v=1" alt="Affiche de l’atelier « %s »" width="720" height="900" loading="lazy" decoding="async">'
                '<span class="ca-pied"><span class="ca-n">%s</span><h3 class="ca-t">%s</h3><span class="ca-m">%s</span>'
                '<span class="ca-pr" hidden><i></i></span><span class="ca-b">%s</span></span></a>') % (
            e(a['page']), e(i), '' if visage else 'sv/', i, e(a['t']), lab or (('Étape %d' % k) if k else 'À la carte'), e(a['t']), meta, prix(i, a))
    return ('<a class="ca" href="%s" data-id="%s"><span class="ca-n">%s</span><h3>%s</h3><span class="ca-m">%s</span>'
            '<span class="ca-pr" hidden><i></i></span><span class="ca-b">%s</span></a>') % (
        e(a['page']), e(i), lab or (('Étape %d' % k) if k else 'À la carte'), e(a['t']), meta, prix(i, a))
FL = '<span class="fl"><button type="button" data-d="-1" aria-label="Précédents">‹</button><button type="button" data-d="1" aria-label="Suivants">›</button></span>'
blocs, puces = [], []
def plus_lien(th):
    p, c = suite(th); n = len(p) + len(c)
    if not n: return ''
    return ('<a class="plus" href="ateliers-%s.html"><span class="plus-s">+</span><span><b>Pour aller plus loin</b>'
            '<small>%d autre%s atelier%s sur ce thème</small></span><span class="plus-f">→</span></a>') % (th[0], n, 's' if n > 1 else '', 's' if n > 1 else '')
for th in THEMES:
    cle, titre, chapo, img, top = th[:5]
    p, c = suite(th); nb = len(top) + len(p) + len(c)
    puces.append('<a href="#%s">%s</a>' % (cle, e(titre)))
    s = ('<section class="th" id="%s" aria-labelledby="t-%s"><div class="th-tete"><img src="clone/assets/%s" alt="" loading="lazy" width="900" height="506">'
         '<div><p class="th-k">%s · %d atelier%s</p><h2 id="t-%s">%s</h2><p>%s</p></div></div>') % (
        cle, cle, img, 'Les essentiels' if len(top) > 1 else 'L’essentiel', nb, 's' if nb > 1 else '', cle, e(titre), e(chapo))
    s += '<div class="grille ess">%s</div>' % ''.join(carte(i, lab='Essentiel %d' % (k + 1), visage=(k == THEMES.index(th) % len(top))) for k, i in enumerate(top))
    s += plus_lien(th)
    blocs.append(s + '</section>')
TOUS = '<template id="tous">%s</template>' % ''.join(carte(i) for i in D)
total = len(D)
import subprocess
IDX = json.loads(subprocess.check_output(['node', 'scripts/ateliers/index-recherche.js']))
EXTRA = {'premiers-pas-bourse': 'débuter en Bourse BRVM action SGI compte-titres premier pas cotation marché indice prêt à investir',
         'premier-ordre-brvm': 'passer un ordre de Bourse BRVM SGI ordre limité au marché carnet acheter vendre action frais courtage',
         'jeu-portefeuille-baisse': 'jeu portefeuille baisse Bourse krach panique vendre garder diversification simulation'}
THEME_DE = {}
for th in THEMES:
    for i in th[4] + th[5]: THEME_DE.setdefault(i, []).append(th[1])
REC = []
for i, a in D.items():
    ix = IDX.get(i, {})
    REC.append({'id': i, 't': a['t'], 'p': a['page'], 'n': a.get('n') or 0, 'th': THEME_DE.get(i, []), 'h': ix.get('h1', ''), 'ch': ix.get('ch', []),
                'x': (ix.get('x', '') + ' ' + EXTRA.get(i, '')).strip(),
                'acc': 'Jeu gratuit' if a.get('jeu') else ('Gratuit' if not a['prix'] else ('Abonnés ou 5 000 F' if i in UNITE else 'Abonnés'))})
json.dump(REC, open('data/ateliers-recherche.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

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
.grille{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-top:18px}
.grille .ca{flex:none;min-height:190px}
.ess .ca{background:#0B1220!important;color:#fff!important}.ess .ca h3{color:#fff!important}.ess .ca-n{color:#F09680}.ess .ca-m{color:#C9D1DE}
.ess .px{background:#1B2B47;color:#6DB8F2}.ess .px.g{background:#173B2B;color:#3CCB7F}.ess .px2{color:#C9D1DE}.ess .ca-ok{color:#3CCB7F}
.plus{display:flex;align-items:center;gap:14px;margin-top:12px;background:#FFFFFF!important;border-radius:14px;padding:14px 18px;color:#0B1220!important;transition:background .15s}
.plus:hover{background:#E6F2FC!important}
.plus-s{flex:0 0 auto;width:38px;height:38px;border-radius:999px;background:#DA3C1B;color:#fff;display:grid;place-items:center;font-size:24px;font-weight:800;line-height:1}
.plus b{display:block;font-size:17px}.plus small{display:block;font-size:14.5px;color:#5F6676}
.plus-f{margin-left:auto;font-size:22px;font-weight:800;color:#DA3C1B}
.retour{display:inline-flex;font-weight:700;font-size:15px;color:#1B71B2!important;margin-bottom:14px}
.sp-hero{width:100%!important;height:auto!important;aspect-ratio:21/8!important;object-fit:cover;border-radius:14px;display:block;margin:18px 0 0;background:#DCE8ED}
.bloc{margin-top:40px}.bloc h2{font-size:clamp(24px,3.2vw,32px)}.bloc>p{color:#4E5566;margin-top:6px!important;max-width:60ch}
.bloc h3.sous{font-family:"Source Sans 3",system-ui,sans-serif;font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#1B71B2;margin-top:24px}
.autres{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.autres a{font-size:15px;font-weight:700;padding:9px 14px;border-radius:999px;background:#FFFFFF;color:#0B1220!important}
.autres a:hover{background:#E6F2FC}
.ca-aff{position:relative;padding:0!important;gap:0!important;overflow:hidden;min-height:0!important;background:#0B1220!important}
.ca-img{display:block;width:100%!important;height:auto!important;aspect-ratio:4/5;object-fit:contain;background:#06182E}
.ca-pied{display:flex;flex-direction:column;gap:6px;padding:12px 14px 14px;background:#0B1220;color:#fff;flex:1}
.ca-aff .ca-n{color:#F09680}.ca-aff .ca-m{color:#C9D1DE}.ca-aff .ca-ok{color:#3CCB7F}
.ca-aff .ca-t{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ca-aff .px{background:#1B2B47;color:#6DB8F2}.ca-aff .px.g{background:#173B2B;color:#3CCB7F}.ca-aff .px2{color:#C9D1DE}
.grille .ca-aff{min-height:0}
.grille.suite{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
@media(max-width:640px){.grille.ess{display:grid;grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:min(76vw,320px);overflow-x:auto;max-width:100%;min-width:0;scroll-snap-type:x mandatory;padding-bottom:8px;scrollbar-width:none}.grille.ess::-webkit-scrollbar{display:none}.grille.ess .ca{scroll-snap-align:start}.grille.suite{grid-template-columns:1fr 1fr;gap:10px}.grille.suite .ca-pied{padding:10px}}
.ca-maison{display:flex;flex-direction:column;gap:8px;background:#EAF3FB!important;border-radius:14px;padding:18px 16px;color:#2A3142!important;text-decoration:none!important;min-height:220px;transition:background .15s}
.ca-maison:hover{background:#DCEBF8!important}
.cm-k{font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5F6676}
.ca-maison b{font-family:"Libre Baskerville",Georgia,serif;font-size:18px;line-height:1.22;color:#0B1220}
.cm-p{font-size:14.5px;color:#4E5566;line-height:1.4}.cm-f{margin-top:auto;font-weight:800;color:#1B71B2;font-size:15px}
@media(max-width:640px){.ca-maison{padding:12px}.ca-maison b{font-size:15.5px}.cm-p{font-size:13.5px}}
.aide{margin-top:52px;background:#EEF5FC;border-radius:14px;padding:22px;display:flex;flex-wrap:wrap;gap:14px 24px;align-items:center;justify-content:space-between}
.aide p{max-width:60ch;color:var(--ink2)}.aide b{color:#0B1220}
.bouton{display:inline-flex;align-items:center;font-weight:800;font-size:16px;min-height:46px;padding:12px 22px;border-radius:8px;background:var(--corail);color:#fff!important}
.eli{margin-top:52px;background:#0B1220;color:#fff;border-radius:14px;padding:22px;display:grid;grid-template-columns:140px 1fr;gap:22px;align-items:center}
.eli img{width:140px!important;height:175px!important;max-width:none!important;object-fit:cover!important;object-position:50% 12%;border-radius:12px!important;display:block}
.cat .eli h2{color:#fff;font-size:clamp(24px,3vw,32px);margin-top:6px}.eli p:not(.th-k){color:#C9D1DE;margin-top:8px!important;max-width:56ch}
.eli-b{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.bouton.b2{background:#FFFFFF;color:#0B1220!important}
.rech{margin-top:22px;position:relative}
.rech-b{display:flex;align-items:center;gap:10px;background:#EEF5FC;border-radius:14px;padding:6px 6px 6px 16px}
.rech-b svg{flex:0 0 auto;width:22px;height:22px;stroke:#0B1220;fill:none;stroke-width:2}
.rech-b input{flex:1;min-width:0;border:0!important;background:transparent!important;box-shadow:none!important;font:600 18px/1.3 "Source Sans 3",system-ui,sans-serif;color:#0B1220;padding:12px 0!important;outline:none;min-height:0!important;height:auto!important}
.rech-b button{border:0;background:#0B1220;color:#fff;font:800 15px "Source Sans 3",sans-serif;border-radius:10px;padding:12px 16px;cursor:pointer}
.rech-b:focus-within{box-shadow:0 0 0 3px #1B71B2}
html[data-clone] .cat .rech-b input,html[data-clone] .cat .rech-b input:hover,html[data-clone] .cat .rech-b input:focus{border:0!important;box-shadow:none!important;background:transparent!important;border-radius:0!important;padding:12px 0!important;min-height:0!important;outline:none!important}
.mots{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.mots span{font-size:14px;color:#5F6676;align-self:center;margin-right:2px}
.mots button{border:0;background:#fff;box-shadow:inset 0 0 0 1.5px #DCE8ED;color:#0B1220;font:700 14.5px "Source Sans 3",sans-serif;border-radius:999px;padding:7px 13px;cursor:pointer}
.mots button:hover{box-shadow:inset 0 0 0 1.5px #1B71B2}
.res{margin-top:22px}.res h2{font-size:clamp(22px,3vw,28px)}
.res-n{color:#5F6676;margin-top:6px!important}
.res-l{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-top:14px}
.res-c{display:flex;flex-direction:column;gap:6px;background:#EEF5FC;border-radius:14px;padding:16px 18px}
.res-c .rk{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#1B71B2}
.res-c h3{font-size:18px;line-height:1.25}
.res-c p{font-size:15px;color:#4E5566;line-height:1.45}
.res-c mark{background:#FDE3B8;color:inherit;border-radius:3px;padding:0 2px}
.res-c .rb{margin-top:auto;padding-top:6px;display:flex;gap:8px;align-items:center;font-size:14px;color:#5F6676}
.res-c .rb b{font-size:13px;font-weight:800;padding:3px 10px;border-radius:999px;background:#fff;color:#1B71B2}
.res-vide{background:#EEF5FC;border-radius:14px;padding:18px;margin-top:14px}
body.cherche .th,body.cherche .reprise,body.cherche .puces{display:none!important}
@media (max-width:640px){.eli{grid-template-columns:1fr;gap:14px}.eli img{width:88px!important;height:88px!important;border-radius:999px!important}.th-tete{grid-template-columns:1fr}.th-tete img{aspect-ratio:21/9!important}}
"""
JS = r"""
(function(){
  function lire(k){ try{ return JSON.parse(localStorage.getItem(k)||'null'); }catch(e){ return null; } }
  function prog(c){ var n=+(c.querySelector('.ca-m').textContent.match(/\d+/)||[0])[0], s=lire('efa-at-'+c.dataset.id); if(!s||!s.etat||!n) return 0;
    var f=Object.keys(s.etat).filter(function(k){return s.etat[k];}).length; if(!f) return 0;
    var pr=c.querySelector('.ca-pr'); pr.hidden=false; pr.firstChild.style.width=Math.min(100,f/n*100)+'%';
    c.querySelector('.ca-b').insertAdjacentHTML('afterbegin','<span class="ca-ok">'+(f>=n?'Terminé ✓':f+' sur '+n)+'</span>'); return f<n?1:2; }
  document.querySelectorAll('.ca[data-id]').forEach(prog);
  var z=document.getElementById('reprise'), T=document.getElementById('tous');
  if(z&&T){ var r=z.querySelector('.rail'), vu={};
    [].forEach.call(T.content.querySelectorAll('.ca'),function(c0){ if(vu[c0.dataset.id]) return; var c=c0.cloneNode(true); if(prog(c)===1){ vu[c.dataset.id]=1; c.querySelector('.ca-n').textContent='Je continue'; r.appendChild(c); } });
    if(r.children.length) z.hidden=false; }
  document.addEventListener('click',function(ev){ var b=ev.target.closest&&ev.target.closest('.fl button'); if(!b) return; var r=b.closest('.rg').querySelector('.rail'); r.scrollBy({left:+b.dataset.d*r.clientWidth*.8,behavior:'smooth'}); });
%%RECHERCHE%%
  /*fin-recherche*/
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
<title>Les ateliers EFA · les essentiels par thème</title>
<link rel="canonical" href="https://efa.africa/ateliers">

<meta name="description" content="Tous les ateliers EFA rangés par thème : budget, épargne, Bourse (BRVM), crédit, activité, famille et retraite, terrain, arnaques. Pour chaque thème, les 3 ateliers essentiels, puis les autres pour aller plus loin.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap">
<style>%s</style>
</head>
<body>
%s
<main class="cat" id="ateliers" data-garde>
  <p class="cat-k">Les ateliers EFA · %d ateliers</p>
  <h1>Choisissez un thème. Commencez par l’essentiel.</h1>
  <p class="cat-chapo">Pour chaque thème, nous avons retenu les 3 ateliers qui vous apportent le plus. Les autres vous attendent sur la page du thème, pour aller plus loin. Vos ateliers commencés restent dans Mon EFA.</p>
  <form class="rech" role="search" id="rech" action="ateliers.html"><label class="rech-b"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><span style="position:absolute;left:-9999px">Chercher un atelier</span><input type="search" name="q" id="q" placeholder="Chercher : dividende, tontine, CNPS, crédit…" autocomplete="off" enterkeyhint="search"><button type="submit">Chercher</button></label>
  <div class="mots" aria-label="Mots clés"><span>Mots clés :</span><button type="button" data-m="Budget">Budget</button><button type="button" data-m="Épargne">Épargne</button><button type="button" data-m="Tontine">Tontine</button><button type="button" data-m="BRVM">BRVM</button><button type="button" data-m="Dividendes">Dividendes</button><button type="button" data-m="Crédit">Crédit</button><button type="button" data-m="Dettes">Dettes</button><button type="button" data-m="Retraite">Retraite</button><button type="button" data-m="Terrain">Terrain</button><button type="button" data-m="Mon activité">Mon activité</button><button type="button" data-m="Arnaques">Arnaques</button><button type="button" data-m="Bons du Trésor">Bons du Trésor</button><button type="button" data-m="Crypto">Crypto</button><button type="button" data-m="Inflation">Inflation</button></div></form>
  <section class="res" id="res" hidden aria-live="polite"></section>
  <nav class="puces" aria-label="Thèmes">%s</nav>
  <section class="reprise" id="reprise" hidden aria-label="Je continue"><div class="rg-t"><h3>Je continue</h3><span>là où je me suis arrêté</span></div><div class="rail"></div></section>
  %s
  %s
  <section class="eli" aria-labelledby="eli-t"><img src="elysee-portrait.jpg" alt="Portrait d’Élysée Johnson" width="606" height="909" loading="lazy"><div><p class="th-k" style="color:#6DB8F2">Avec Élysée Johnson</p><h2 id="eli-t">Votre cas, avec le fondateur d’EFA.</h2><p>Des ateliers approfondis où il répond personnellement à votre question, et des rendez-vous pour décider.</p><div class="eli-b"><a class="bouton" href="ateliers-elysee.html#coaching-elysee">Les ateliers avec Élysée</a><a class="bouton b2" href="ateliers-elysee.html#rendez-vous-elysee">Réserver un rendez-vous</a></div></div></section>
  <div class="aide"><p><b>Vous ne savez pas par où commencer ?</b> Le diagnostic vous indique le thème qui compte le plus pour vous aujourd’hui, en 3 minutes.</p><a class="bouton" href="diagnostic.html">Faire mon diagnostic</a></div>
</main>
<script>%s</script>
%s</body>
</html>
""" % (CSS, entete, total, ''.join(puces), '\n'.join(blocs), TOUS, JS, pied)
page = page.replace('%%RECHERCHE%%', open('scripts/ateliers/recherche.js', encoding='utf-8').read())
open('ateliers.html', 'w', encoding='utf-8').write(page)
print('ateliers.html : %d ateliers, %d thèmes' % (total, len(THEMES)))

MAISON = {
  'budget': ('Outil gratuit', 'Construire mon budget en 10 minutes', 'Chaque franc reçoit une mission, et vous gardez votre budget en PDF.', 'Ouvrir l’outil', 'outil-budget.html'),
  'placer': ('Atelier accompagné', 'Un atelier avec Élysée Johnson', 'En petit groupe, sur votre situation.', 'Choisir mon atelier', 'ateliers-elysee.html'),
  'bourse': ('Parcours accompagné', 'Mon premier ordre à la Bourse', 'Ouvrir son compte et passer son premier ordre, sans rester seul.', 'Découvrir le parcours', 'coach-bourse.html'),
  'credit': ('Gratuit · 3 minutes', 'Par où commencer avec votre argent ?', 'Le diagnostic vous indique votre priorité.', 'Faire mon diagnostic', 'diagnostic.html'),
  'activite': ('Gratuit · dès 1 minute', 'Trouver mon idée de business, à partir de mon budget', 'Des idées adaptées à votre budget, avec le premier pas.', 'Essayer Déclic', 'generateur-de-projet.html'),
  'famille': ('Outil gratuit', 'Préparer ma retraite : où en êtes-vous ?', 'Ce qu’il vous manquera chaque mois, et combien mettre de côté.', 'Faire le calcul', 'preparer-ma-retraite.html'),
  'arnaques': ('Gratuit', 'Une question d’argent ? Posez-la', 'Nous vous montrons les contenus qui y répondent.', 'Poser ma question', 'question.html'),
}
def maison(cle):
    m = MAISON.get(cle)
    if not m: return ''
    return ('<a class="ca-maison" href="%s?src=carte"><span class="cm-k">EFA vous propose · %s</span><b>%s</b><span class="cm-p">%s</span><span class="cm-f">%s →</span></a>') % (
        e(m[4]), e(m[0]), e(m[1]), e(m[2]), e(m[3]))
def avec_maison(cartes, cle, pos=3):
    m = maison(cle)
    if not m: return ''.join(cartes)
    cartes = list(cartes); cartes.insert(min(pos, len(cartes)), m); return ''.join(cartes)

# ---------------------------------------------------------------- une page par thème : les essentiels, puis pour aller plus loin
JS_T = JS.split('%%RECHERCHE%%')[0] + JS.split('/*fin-recherche*/')[1]
JS_T = JS_T.replace("  var P=[].slice.call(document.querySelectorAll('.puces a'))", "  var P=[]").replace("T.forEach(function(t){io.observe(t);});", "")
ELI = page[page.index('<section class="eli"'):page.index('</main>')]
for th in THEMES:
    cle, titre, chapo, img, top = th[:5]
    p, c = suite(th)
    if not (p or c): continue
    corps = ('<a class="retour" href="ateliers.html#%s">← Tous les thèmes</a><p class="cat-k">Les ateliers EFA · %d ateliers</p><h1>%s</h1><p class="cat-chapo">%s</p>'
             '<img class="sp-hero" src="clone/assets/%s" alt="" width="900" height="506">') % (cle, len(top) + len(p) + len(c), e(titre), e(chapo), img)
    corps += ('<section class="bloc"><h2>Les %d essentiels</h2><p>Si vous ne deviez en suivre que trois sur ce thème, ce sont ceux-là.</p><div class="grille ess">%s</div></section>') % (
        len(top), ''.join(carte(i, lab='Essentiel %d' % (k + 1), visage=(k == 0)) for k, i in enumerate(top)))
    corps += '<section class="bloc"><h2>Pour aller plus loin</h2><p>Quand les essentiels sont acquis, ou si votre situation le demande.</p>'
    if p: corps += '<h3 class="sous">La suite du parcours</h3><div class="grille suite">%s</div>' % (''.join(carte(i, lab='Suite %d' % (k + 1)) for k, i in enumerate(p)) if c else avec_maison([carte(i, lab='Suite %d' % (k + 1)) for k, i in enumerate(p)], cle))
    if c: corps += '<h3 class="sous">Selon votre situation</h3><div class="grille suite">%s</div>' % avec_maison([carte(i) for i in c], cle)
    corps += '</section>'
    corps += '<section class="bloc"><h2>Les autres thèmes</h2><div class="autres">%s</div></section>' % ''.join(
        '<a href="%s">%s</a>' % (('ateliers-%s.html' % t[0]) if any(suite(t)) else 'ateliers.html#%s' % t[0], e(t[1])) for t in THEMES if t[0] != cle)
    sp = page
    sp = sp[:sp.index('<main class="cat"')] + '<main class="cat" id="ateliers" data-garde>\n' + corps + '\n' + ELI + '</main>\n<script>' + JS_T + '</script>\n' + pied + '</body>\n</html>\n'
    sp = sp.replace('<title>Les ateliers EFA · les essentiels par thème</title>', '<title>%s · les ateliers EFA</title>' % e(titre))
    sp = sp.replace('<link rel="canonical" href="https://efa.africa/ateliers">', '<link rel="canonical" href="https://efa.africa/ateliers-%s">' % cle)
    sp = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s Les 3 ateliers essentiels, puis tous les autres pour aller plus loin.">' % e(chapo), sp, count=1)
    open('ateliers-%s.html' % cle, 'w', encoding='utf-8').write(sp)
    print('ateliers-%s.html : %d essentiels + %d' % (cle, len(top), len(p) + len(c)))

# Habillage automatique (en-tête, menu, pied) de toutes les pages fabriquées : sans lui, le menu s'affiche brut.
for _p in ['ateliers.html'] + ['ateliers-%s.html' % t[0] for t in THEMES if any(suite(t))]:
    subprocess.check_call(['python3', 'scripts/clone/habiller.py', '--page', _p], stdout=subprocess.DEVNULL)
print('habillage : fait')
