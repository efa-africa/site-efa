"""EFA · Décryptage : des dossiers qui relient plusieurs actualités EFA News autour d'une question.
Le contenu (faits, mécanisme, conséquences, sources) vient de news/news-data.json, déjà vérifié.
Lancer : python3 scripts/decryptage/build.py  → écrit decryptage.html"""
import json, html, re
D = {a['id']: a for a in json.load(open('news/news-data.json', encoding='utf8'))['articles']}
E = lambda t: html.escape(str(t), quote=True)
DOSSIERS = [
 dict(slug='dette', k='Dossier 1 · Les États et leur dette', t='La dette des États africains : <em>qui paie, et combien&nbsp;?</em>',
  chapo='Quand un État emprunte trop, ce sont ses recettes, ses prêteurs et parfois ses habitants qui paient. Les chiffres de ces dernières semaines montrent comment.',
  ids=['2026-10-12-senegal-dette','2026-10-18-senegal-budget-interets-dette','2026-10-23-senegal-obligation-49-centimes','2026-10-23-gabon-audit-dette','2026-10-13-tchad-fmi','2026-10-13-moodys-afrique-perspective'],
  meca=['2026-10-12-senegal-dette'], change=['2026-10-12-senegal-dette','2026-10-23-senegal-obligation-49-centimes'],
  form=[('Leçon','DAT et emprunts d’État','Ce qu’on prête à un État, ce qu’on récupère.','dat-emprunts-etat.html?src=decryptage'),('Formation','Emprunts obligataires et introductions en Bourse','Lire une offre avant d’y souscrire.','bourse-pro.html?src=decryptage#B7')]),
 dict(slug='taux', k='Dossier 2 · Le prix de l’argent', t='Du taux de la banque centrale <em>au taux de votre crédit.</em>',
  chapo='Le prix de l’argent part de la banque centrale, passe par les banques et arrive dans votre contrat de crédit ou dans le rendement de votre épargne.',
  ids=['2026-10-18-bceao-prix-de-l-argent','2026-10-19-ouganda-taux-12-pourcent','2026-10-17-senegal-emprunt-prime-de-duree','2026-10-13-guinee-bissau-obligation','2026-10-14-ghana-creances-en-souffrance'],
  meca=['2026-10-18-bceao-prix-de-l-argent'], change=['2026-10-18-bceao-prix-de-l-argent','2026-10-17-senegal-emprunt-prime-de-duree'],
  form=[('Calcul','Le coût total d’un crédit','Ce que vous rembourserez vraiment.','cout-total-credit.html?src=decryptage'),('Leçon','DAT et emprunts d’État','Ce que rapporte l’argent prêté.','dat-emprunts-etat.html?src=decryptage')]),
 dict(slug='bourse', k='Dossier 3 · Entrer en Bourse', t='Ce que vaut une entreprise, <em>et ce qu’elle lève vraiment.</em>',
  chapo='Une entrée en Bourse fait les gros titres. Mais la valeur annoncée, l’argent levé et ce que reçoit l’entreprise sont trois chiffres différents.',
  ids=['2026-10-24-opay-introduction-bourse','2026-10-13-airtel-money-bourse','2026-10-19-kenya-pipeline-premier-dividende','2026-10-13-dangote-benefice-9-mois'],
  meca=['2026-10-13-airtel-money-bourse','2026-10-24-opay-introduction-bourse'], change=['2026-10-13-airtel-money-bourse','2026-10-24-opay-introduction-bourse'],
  form=[('Formation','Emprunts obligataires et introductions en Bourse','Lire une offre : qui vend, combien, à quel prix.','bourse-pro.html?src=decryptage#B7'),('Formation','Une entreprise sous la loupe','Lire les chiffres d’une société cotée.','bourse-marche.html?src=decryptage#C6')]),
]
# Actus décryptées publiées sur Substack (les plus récentes en premier)
ACTUS = [
 dict(date='1er novembre 2026', titre='Ce que Yan Diomandé, Aliko Dangote et Koné Dossongui enseignent à notre argent',
  sous='« Le talent ne suffit pas. La méthode, si. »',
  resume='Du parcours de Yan Diomandé au Real Madrid à ceux de deux capitaines d’industrie africains : six leçons pour gérer son argent, se fixer des objectifs, accepter d’être conseillé, passer de la consommation à la production et investir avec patience.',
  img='illus/cap-dossongui.webp', url='https://educationfinanciereafrique.substack.com/p/actu-decryptee-ce-que-yan-diomande'),
]
def lien(a): return 'news/%s.html' % a['id']
sec = []
for d in DOSSIERS:
    arts = [D[i] for i in d['ids'] if i in D]
    faits = ''.join('<li><a href="%s"><span class="dc-date">%s</span><b>%s</b><span>%s</span></a></li>' % (lien(a), E(a.get('evenement_label') or a['publication']), E(a['titre']), E(a['resume'])) for a in arts)
    meca = []
    for i in d['meca']: meca += D[i]['mecanisme']
    chg = ''.join('<blockquote><p>%s</p><cite>D’après <a href="%s">%s</a></cite></blockquote>' % (E(D[i]['change']), lien(D[i]), E(D[i]['titre'])) for i in d['change'])
    ret = []
    for a in arts:
        r = a.get('retenir')
        if r and r not in ret: ret.append(r)
    form = ''.join('<a href="%s"><small>%s</small><b>%s</b><span>%s</span></a>' % (u, E(ty), E(ti), E(tx)) for ty, ti, tx, u in d['form'])
    sec.append('''<section class="dc-dos" id="%s" aria-labelledby="t-%s"><div class="dc-in">
<p class="dc-k">%s</p><h2 id="t-%s">%s</h2><p class="dc-chapo">%s</p>
<div class="dc-g"><div><h3>Les faits</h3><ol class="dc-faits">%s</ol></div>
<div><h3>Le mécanisme</h3><ol class="dc-meca">%s</ol><h3>Ce que ça change pour vous</h3>%s</div></div>
<div class="dc-ret"><h3>À retenir</h3><ul>%s</ul></div>
<div class="dc-form"><p class="dc-k">Vous avez des questions&nbsp;? Se former</p><div>%s</div></div>
</div></section>''' % (d['slug'], d['slug'], E(d['k']), d['slug'], d['t'], E(d['chapo']), faits, ''.join('<li>%s</li>' % E(m) for m in meca), chg, ''.join('<li>%s</li>' % E(r) for r in ret[:4]), form))
src = open('personnalite.html', encoding='utf8').read()
hdr = src[src.index('<header class="header clone-head"'):src.index('</header>', src.index('<header class="header clone-head"')) + 9]
pv = src[src.index('<section class="efa-pourvous"'):src.index('</section>', src.index('<section class="efa-pourvous"')) + 10]
actus = ''.join('<a class="dc-actu" href="%s" target="_blank" rel="noopener"><img src="%s" alt="" loading="lazy" decoding="async"><span class="dc-actu-t"><small>Actu décryptée · %s</small><b>%s</b><em>%s</em><span>%s</span><i>Lire l’actu décryptée →</i></span></a>' % (E(a['url']), E(a['img']), E(a['date']), E(a['titre']), E(a['sous']), E(a['resume'])) for a in ACTUS)
sommaire = ''.join('<a href="#%s"><small>%s</small><b>%s</b></a>' % (d['slug'], E(d['k']), re.sub('<[^>]+>', '', d['t']).replace('&nbsp;', ' ')) for d in DOSSIERS)
page = '''<!doctype html>
<html data-clone data-clone-plein lang="fr">
<head>
<meta charset="utf-8"><link rel="icon" type="image/png" href="clone/assets/efa-oiseau.png"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Décryptage · EFA News</title>
<meta name="description" content="EFA Décryptage : derrière l’actualité, le mécanisme. Dette des États, prix de l’argent, entrées en Bourse : ce que ça change pour votre argent, sources à l’appui.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600;700;800&display=swap">
<style>
body{margin:0;background:#fff}
.dc{--n:#0B1220;--t:#465062;--t3:#5F6676;--b:#1B71B2;--c:#147f9b;--pale:#EEF5FC;--pale2:#F7FAFD;font-family:"Source Sans 3",system-ui,sans-serif;font-size:17px;line-height:1.6;color:#2A3142}
.dc *{box-sizing:border-box}
.dc-in{max-width:1080px;margin:0 auto;padding:0 max(18px,env(safe-area-inset-left,0px))}
.dc h1,.dc h2,.dc h3{font-family:"Libre Baskerville",Georgia,serif;font-weight:700;line-height:1.15;color:var(--n);margin:0;text-wrap:balance}
.dc h1 em,.dc h2 em{font-style:normal;color:var(--c)}
.dc-tete{position:relative;min-height:min(560px,calc(100svh - 82px));display:flex;align-items:flex-end;color:#fff;background:#041226;overflow:hidden}
.dc-tete img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.dc-tete::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(4,18,38,.92) 0%,rgba(4,18,38,.45) 55%,rgba(4,18,38,.15) 100%)}
.dc-tete .dc-in{position:relative;z-index:1;padding-bottom:clamp(36px,6vh,64px);width:100%}
.dc-tete .dc-k{color:#ffb4a3}
.dc-tete h1{color:#fff;font-size:clamp(38px,6vw,72px);margin-top:12px}
.dc-tete h1 em{color:#7fd3ea}
.dc-tete p.dc-chapo{color:rgba(255,255,255,.88);max-width:56ch}
.dc-k{margin:0;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--b)}
.dc-chapo{margin:14px 0 0;font-size:clamp(17px,1.8vw,19.5px);color:var(--t);max-width:66ch}
.dc-som{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:-34px 0 0;position:relative;z-index:2}
.dc-som a{display:flex;flex-direction:column;gap:4px;background:#fff;border-radius:16px;padding:16px 18px;text-decoration:none;color:var(--n);box-shadow:0 14px 34px rgba(11,18,32,.1)}
.dc-som small{font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--b)}
.dc-som b{font-family:"Libre Baskerville",Georgia,serif;font-size:17px;line-height:1.25}
.dc-dos{padding:clamp(48px,7vw,84px) 0;border-bottom:1px solid #DCE6F0}
.dc-dos:nth-of-type(even){background:var(--pale2)}
.dc-dos h2{font-size:clamp(28px,3.8vw,44px);margin-top:10px}
.dc-g{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(24px,4vw,48px);margin-top:30px}
.dc h3{font-size:20px;margin:0 0 12px}
.dc-g h3+ol{margin-bottom:26px}
.dc-faits{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.dc-faits a{display:flex;flex-direction:column;gap:3px;background:#fff;border-radius:14px;padding:14px 16px;text-decoration:none;color:var(--n);box-shadow:0 6px 18px rgba(11,18,32,.05)}
.dc-faits a:hover{box-shadow:0 10px 26px rgba(11,18,32,.1)}
.dc-date{font-size:12.5px;font-weight:800;color:var(--b);letter-spacing:.04em}
.dc-faits b{font-size:16.5px;line-height:1.3}
.dc-faits span:last-child{font-size:15px;color:var(--t)}
.dc-meca{margin:0;padding:0;list-style:none;counter-reset:m}
.dc-meca li{counter-increment:m;position:relative;padding:0 0 12px 40px}
.dc-meca li::before{content:counter(m);position:absolute;left:0;top:0;width:28px;height:28px;border-radius:50%;background:var(--n);color:#fff;display:grid;place-items:center;font-weight:800;font-size:14px}
.dc blockquote{margin:0 0 12px;background:var(--pale);border-radius:14px;padding:14px 16px}
.dc blockquote p{margin:0;color:var(--n)}
.dc cite{display:block;margin-top:6px;font-style:normal;font-size:13.5px;color:var(--t3)}
.dc cite a{color:var(--b)}
.dc-ret{margin-top:26px;background:var(--n);color:#fff;border-radius:16px;padding:20px 22px}
.dc-ret h3{color:#fff}
.dc-ret ul{margin:0;padding-left:20px}.dc-ret li{margin:4px 0}
.dc-form{margin-top:26px}
.dc-form>div{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}
.dc-form a{display:flex;flex-direction:column;gap:2px;background:#fff;border-radius:14px;padding:16px;text-decoration:none;color:var(--n);box-shadow:0 6px 18px rgba(11,18,32,.05)}
.dc-form small{font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#DA3C1B}
.dc-form span{font-size:15px;color:var(--t)}
.dc-actus{padding:clamp(40px,6vw,64px) 0 0}.dc-actus h2{font-size:clamp(26px,3.4vw,38px);margin-top:8px}.dc-actus-g{margin-top:20px}
.dc-actu{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:0;border-radius:18px;overflow:hidden;background:#fff;text-decoration:none;color:var(--n);box-shadow:0 14px 34px rgba(11,18,32,.09)}
.dc-actu img{width:100%;height:100%;min-height:220px;object-fit:cover}
.dc-actu-t{display:flex;flex-direction:column;gap:6px;padding:22px 24px}
.dc-actu small{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#DA3C1B}
.dc-actu b{font-family:"Libre Baskerville",Georgia,serif;font-size:clamp(20px,2.2vw,26px);line-height:1.2}
.dc-actu em{color:var(--c);font-style:italic}
.dc-actu span span,.dc-actu-t>span{color:var(--t);font-size:15.5px}
.dc-actu i{font-style:normal;font-weight:800;color:var(--b);margin-top:4px}
@media(max-width:820px){.dc-actu{grid-template-columns:1fr}.dc-actu img{min-height:180px;aspect-ratio:16/9}}
.dc-pied{padding:36px 0 60px;font-size:15px;color:var(--t3)}
.dc-pied a{color:var(--b);font-weight:700}
@media(max-width:820px){.dc-som,.dc-g,.dc-form>div{grid-template-columns:1fr}.dc-som{margin-top:18px}}
</style>
<link rel="stylesheet" href="clone/habillage.css?v=20261031y">
</head>
<body>
''' + hdr + '''
<main id="contenu" class="dc" data-garde>
<header class="dc-tete"><img src="clone/assets/accueil-tribunes.webp" alt="" fetchpriority="high" decoding="async"><div class="dc-in"><p class="dc-k">EFA News · Décryptage</p><h1>Derrière l’actualité, <em>le mécanisme.</em></h1><p class="dc-chapo">Plusieurs actualités, une même question. Les faits, comment ça marche, et ce que ça change pour votre argent.</p></div></header>
<div class="dc-in"><nav class="dc-som" aria-label="Les dossiers">''' + sommaire + '''</nav></div>
<section class="dc-actus" id="actus" aria-labelledby="t-actus"><div class="dc-in"><p class="dc-k">La dernière</p><h2 id="t-actus">L’actu décryptée</h2><div class="dc-actus-g">''' + actus + '''</div></div></section>
''' + '\n'.join(sec) + '''
<div class="dc-in dc-pied"><p>Chaque fait renvoie à son article EFA News, avec ses sources, sa date et ses réserves. <a href="news.html">Toute l’actualité EFA News</a> · <a href="methode.html">Notre méthode</a></p><p>Éducation financière, pas conseil en investissement.</p></div>
</main>
''' + pv + '''
<script data-goatcounter="https://efa-africa.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script src="clone/habillage.js?v=20261031y" defer></script>
</body>
</html>
'''
open('decryptage.html', 'w', encoding='utf8').write(page)
print('decryptage.html', len(page))
