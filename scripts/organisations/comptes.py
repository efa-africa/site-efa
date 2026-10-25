#!/usr/bin/env python3
"""Pages des comptes de l'école pour les organisations (25/10/2026) :
rejoindre.html (participant), espace-organisation.html (tableau de bord), admin-ecole.html (clé maîtresse d'EFA)."""
from pathlib import Path
R = Path(__file__).resolve().parents[2]
T = (R / 'salaire-fixe-activite.html').read_text(encoding='utf-8')
HEADER = T[T.index('<header class="top">'):T.index('<main>')]
FOOTER = T[T.index('<footer class="efa-foot">'):T.index('<script>\nfunction efaCompte')]
NAVCSS = T[T.index('.top{position:sticky'):T.index('.intro{background:var(--nuit)')]
V = '2026102512'
CSS = '''
:root{--nuit:#0B1220;--creme:#F5EFE2;--papier:#FFFDF8;--bleu:#2188D6;--corail:#E44828;--soft-bleu:#6DB8F2;--soft-corail:#F09680;--ink:#2A3142;--ink2:#4E5566;--ink3:#7A8293;--line:#E2D8C4;--hausse:#3CCB7F;--erreur:#B3261E;
--f-display:"Libre Baskerville",Baskerville,"Baskerville Old Face",Georgia,"Times New Roman",serif;--f-body:"Source Sans 3","Source Sans Pro",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;--gut:max(16px,env(safe-area-inset-left,0px))}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--creme);color:var(--ink);font-family:var(--f-body);font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit}p{margin:0}h1,h2,h3{font-family:var(--f-display);font-weight:700;line-height:1.12;margin:0;text-wrap:balance;color:var(--nuit)}
:focus-visible{outline:3px solid var(--bleu);outline-offset:3px}
.wrap{max-width:1040px;margin:0 auto;padding-left:var(--gut);padding-right:max(16px,env(safe-area-inset-right,0px))}
''' + NAVCSS + '''
.hero{background:var(--nuit);color:#fff;padding-block:28px 32px}
.hero .crumbs{font-size:13px;color:#AEB6C6}.hero .crumbs a{color:#E8EDF5}
.sur{font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--corail)}
.hero .sur{display:block;margin-top:16px;color:var(--soft-corail)}
.hero h1{color:#fff;font-size:clamp(32px,5vw,54px);margin-top:10px;max-width:22ch}
.hero .chapo{margin-top:12px;font-size:clamp(16px,2vw,19px);color:#C9D1DE;max-width:40em}
#vue{margin:18px 0 40px;display:flex;flex-direction:column;gap:14px}
.carte{background:var(--papier);border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:14px}
.carte h2{font-size:clamp(22px,3vw,30px)}.aide{color:var(--ink2);font-size:15.5px}
.grille2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}@media (max-width:720px){.grille2{grid-template-columns:minmax(0,1fr)}}
.champ{display:grid;gap:6px;font-weight:700;font-size:15px}.champ small{font-weight:400;color:var(--ink3)}
.champ input,.champ select,.champ textarea{font:inherit;font-weight:400;font-size:17px;padding:11px 12px;border-radius:8px;border:0;background:var(--creme);color:var(--nuit);width:100%;min-width:0}
.cle-in{font-family:ui-monospace,Menlo,Consolas,monospace!important;letter-spacing:.06em;text-transform:uppercase}
.case{display:flex;gap:10px;align-items:flex-start;font-size:15px;color:var(--ink2)}.case input{width:20px;height:20px;margin-top:2px;accent-color:var(--corail);flex:none}
.acts{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.bt{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:11px 20px;border-radius:8px;border:0;background:var(--creme);color:var(--nuit);font:800 15.5px/1.2 var(--f-body);cursor:pointer;text-decoration:none}
.bt-p{background:var(--corail);color:#fff}.bt-n{background:var(--nuit);color:#fff}.bt-l{background:none;text-decoration:underline;text-decoration-color:var(--corail);text-decoration-thickness:2px;text-underline-offset:4px;padding-inline:4px}
.bt[disabled]{opacity:.45;cursor:not-allowed}
.msg{font-weight:700;min-height:1.3em}.msg.err{color:var(--erreur)}.msg.ok{color:#1D6B43}
.cle{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:clamp(16px,2.6vw,22px);font-weight:700;letter-spacing:.05em;background:var(--nuit);color:#fff;border-radius:10px;padding:14px 16px;word-break:break-all}
.alerte{background:#FFF4D6;border-radius:12px;padding:14px 16px;font-size:15px;color:var(--nuit)}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}@media (max-width:720px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
.stats div{background:var(--nuit);color:#fff;border-radius:12px;padding:12px 14px}.stats small{display:block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#AEB6C6}.stats b{font-family:var(--f-display);font-size:clamp(20px,3vw,28px)}
.tabw{overflow-x:auto}
table.t{width:100%;border-collapse:collapse;font-size:15px;min-width:640px}
.t th,.t td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--line);vertical-align:middle}
.t th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);cursor:pointer;white-space:nowrap}
.t td small{display:block;color:var(--ink3);font-size:13px}
.barre{height:8px;border-radius:999px;background:var(--creme);overflow:hidden;min-width:90px}.barre i{display:block;height:100%;background:var(--corail)}
.pill{font-size:12px;font-weight:800;padding:3px 10px;border-radius:999px;white-space:nowrap;display:inline-block}
.pill.ok{background:var(--hausse);color:var(--nuit)}.pill.enc{background:#E8F1FB;color:#1E5C99}.pill.zero{background:var(--line);color:var(--ink2)}.pill.dorm{background:#FBE3DD;color:#8A2A16}
.filtre{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.filtre input{font:inherit;font-size:16px;padding:9px 12px;border-radius:8px;border:0;background:var(--creme);min-width:0;flex:1 1 200px}
.mention{font-size:13.5px;color:var(--ink3)}
@media print{header,footer,.hero,.acts,.filtre,.efa-suite,#efa-ely,.no-print{display:none!important}}
'''

def page(slug, titre, sur, h1, chapo, corps_js, crumb, robots=''):
    html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" href="logo-efa-96.png"><link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#0B1220">
<title>{titre} · EFA</title>
<meta name="description" content="{chapo}">
{robots}<meta name="author" content="EFA · Éducation Financière Afrique">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap">
<link rel="stylesheet" href="footer.css">
<style>{CSS}</style>
</head>
<body>
{HEADER}<main>
<section class="hero"><div class="wrap">
  <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › {crumb}</nav>
  <span class="sur">{sur}</span>
  <h1>{h1}</h1>
  <p class="chapo">{chapo}</p>
</div></section>
<div class="wrap"><div id="vue" aria-live="polite"></div></div>
</main>
{FOOTER}<script>(function(){{var b=document.getElementById('menu'),n=document.getElementById('nav');if(b)b.addEventListener('click',function(){{var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'Fermer':'Menu';}});}})();</script>
<script src="parcours-efa.js?v={V}"></script>
<script src="efa-compte.js?v={V}"></script>
<script>
{corps_js}
</script>
<script data-goatcounter="https://efa-africa.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script src="efa-appli.js?v={V}" defer></script>
</body>
</html>
'''
    (R / (slug + '.html')).write_text(html, encoding='utf-8')

COMMUN = r'''
var $ = function (id) { return document.getElementById(id); }, E = window.EFA_ECOLE, D = window.EFA_PARCOURS, P = {};
if (D) D.parcours.forEach(function (p) { P[p.id] = p; });
function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function dateFr(iso, h) { if (!iso) return "jamais"; try { var d = new Date(iso); return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) + (h ? " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""); } catch (e) { return iso; } }
function msg(id, t, ok) { var m = $(id); if (!m) return; m.textContent = t; m.className = "msg " + (ok ? "ok" : "err"); }
function copier(t, id, m) { var ok = function () { msg(id, m, true); }; try { navigator.clipboard.writeText(t).then(ok, function () { window.prompt("Copiez :", t); }); } catch (e) { window.prompt("Copiez :", t); } }
function mesure(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
// Un module est validé quand ses étapes essentielles en ligne sont faites et sa fiche gardée (même règle que l'école)
function etatModule(id, pa) {
  var p = P[id]; if (!p) return { d: 0, n: 0, ok: false };
  var d = 0, n = 0; p.etapes.forEach(function (s, i) { if (s.ess && s.ok) { d++; if ((pa.faits || {})[id + "." + i]) n++; } });
  return { d: d, n: n, ok: d > 0 && n >= d && (pa.fiches || []).indexOf(id) >= 0 };
}
function bilan(pa, mods) {
  var v = 0, et = 0, etd = 0; mods.forEach(function (id) { var e = etatModule(id, pa); if (e.ok) v++; et += e.n; etd += e.d; });
  return { valides: v, total: mods.length, pct: etd ? Math.round(et / etd * 100) : 0, fini: mods.length > 0 && v === mods.length };
}
'''

# ------------------------------------------------------------------ rejoindre.html (participant)
page('rejoindre', 'Rejoindre le programme de mon organisation', 'Mon compte · Programme d’organisation',
     'Rejoindre le programme de mon organisation',
     'Entrez le code donné par votre entreprise, votre coopérative ou votre école. Vous obtenez un compte personnel : votre progression est enregistrée et vous la retrouvez sur n’importe quel téléphone.',
     COMMUN + r'''
function vueCompte(c, nouveau) {
  $("vue").innerHTML = '<section class="carte"><p class="sur">' + (nouveau ? "Compte créé" : "Mon compte") + '</p><h2>Bonjour ' + esc(c.nom) + '</h2>'
    + '<p class="aide">Vous suivez le programme <b>' + esc(c.programme.nom) + '</b>. Votre progression est enregistrée à chaque étape cochée.</p>'
    + (nouveau ? '<div class="alerte"><b>Gardez votre clé personnelle.</b> Elle vous permet de retrouver votre progression sur un autre téléphone. EFA ne peut pas la retrouver pour vous.</div><div class="cle" id="ma-cle">' + esc(c.cle) + '</div>'
      + '<div class="acts"><button type="button" class="bt" id="c-copier">Copier ma clé</button><button type="button" class="bt" id="c-wa">M’envoyer ma clé par WhatsApp</button></div><p class="msg" id="c-msg"></p>' : '')
    + '<div class="acts"><a class="bt bt-p" href="' + E.lienProgramme(c) + '">Ouvrir mon programme</a><a class="bt" href="parcours.html">L’école</a><button type="button" class="bt bt-l" id="c-out">Me déconnecter de ce téléphone</button></div></section>'
    + '<section class="carte"><h2>Ce que voit votre organisation</h2><ul class="aide"><li>Votre nom' + (c.email ? " et votre email" : "") + ', la date de votre inscription et de votre dernière visite.</li><li>Les étapes que vous cochez, les modules terminés, les fiches gardées (le titre, jamais leur contenu) et vos certificats.</li><li><b>Jamais</b> les montants que vous saisissez dans les outils : ils restent sur votre téléphone.</li></ul></section>';
  if ($("c-copier")) $("c-copier").onclick = function () { copier(c.cle, "c-msg", "Clé copiée."); };
  if ($("c-wa")) $("c-wa").onclick = function () { window.open("https://wa.me/?text=" + encodeURIComponent("Ma clé personnelle EFA (programme " + c.programme.nom + ") : " + c.cle + " · pour me reconnecter : https://efa.africa/rejoindre.html"), "_blank", "noopener"); };
  $("c-out").onclick = function () { if (!confirmerSortie()) return; E.deconnecter(); vueAccueil(); };
}
var sortie = false;
function confirmerSortie() { if (sortie) return true; sortie = true; msg("c-msg", "Avez-vous gardé votre clé ? Touchez à nouveau pour vous déconnecter.", false); if (!$("c-msg")) { var p = document.createElement("p"); p.id = "c-msg"; p.className = "msg err"; p.textContent = "Avez-vous gardé votre clé personnelle ? Touchez à nouveau pour vous déconnecter."; $("c-out").parentNode.after(p); } return false; }
function vueAccueil() {
  var code = (new URLSearchParams(location.search).get("code") || "").toUpperCase();
  $("vue").innerHTML = '<section class="carte"><p class="sur">Première fois</p><h2>J’ai un code de mon organisation</h2>'
    + '<div class="grille2"><label class="champ">Code du programme<input id="j-code" class="cle-in" autocomplete="off" placeholder="EFA-XXXX-XXXX" value="' + esc(code) + '"></label>'
    + '<label class="champ">Prénom et nom<input id="j-nom" autocomplete="name" maxlength="80"></label>'
    + '<label class="champ">Email <small>facultatif</small><input id="j-mail" type="email" autocomplete="email" maxlength="120"></label></div>'
    + '<label class="case"><input type="checkbox" id="j-ok"><span>J’accepte que mon organisation voie mon nom, mes visites et ma progression dans le programme (étapes, modules, certificats). Les montants que je saisis restent sur mon téléphone. <a href="confidentialite.html">Confidentialité</a></span></label>'
    + '<div class="acts"><button type="button" class="bt bt-p" id="j-go">Créer mon compte</button></div><p class="msg" id="j-msg" role="status"></p></section>'
    + '<section class="carte"><p class="sur">Déjà inscrit</p><h2>J’ai ma clé personnelle</h2><p class="aide">Pour retrouver votre progression sur ce téléphone.</p>'
    + '<label class="champ">Clé personnelle<input id="k-cle" class="cle-in" autocomplete="off" placeholder="EFA-XXXXXX-XXXXXX-XXXXXX-XXXXXX"></label>'
    + '<div class="acts"><button type="button" class="bt bt-n" id="k-go">Me connecter</button></div><p class="msg" id="k-msg" role="status"></p></section>';
  $("j-go").onclick = function () {
    var c = $("j-code").value.trim(), n = $("j-nom").value.trim(), m = $("j-mail").value.trim();
    if (!c) return msg("j-msg", "Entrez le code donné par votre organisation.");
    if (n.length < 2) return msg("j-msg", "Entrez votre prénom et votre nom.");
    if (!$("j-ok").checked) return msg("j-msg", "Cochez la case pour créer votre compte.");
    this.disabled = true; msg("j-msg", "Création du compte…", true);
    var b = this; E.rejoindre(c, n, m).then(function () { mesure("compte-cree"); var cc = E.compte(); cc.email = m; vueCompte(cc, true); }, function (e) { b.disabled = false; msg("j-msg", e.message); });
  };
  $("k-go").onclick = function () {
    var k = $("k-cle").value.trim(); if (k.length < 20) return msg("k-msg", "Collez votre clé personnelle complète.");
    this.disabled = true; var b = this; msg("k-msg", "Connexion…", true);
    E.connecter(k).then(function () { mesure("compte-connexion"); vueCompte(E.compte(), false); }, function (e) { b.disabled = false; msg("k-msg", e.message); });
  };
}
var c0 = E.compte(); if (c0 && c0.cle) vueCompte(c0, false); else vueAccueil();
''', 'Mon compte')

# ------------------------------------------------------------------ espace-organisation.html (tableau de bord)
page('espace-organisation', 'Espace organisation · tableau de bord', 'Pour les organisations · Tableau de bord',
     'Le tableau de bord de votre programme',
     'Qui s’est inscrit, qui s’est connecté, qui avance et qui a terminé. Vous y accédez avec la clé d’organisation remise par EFA.',
     COMMUN + r'''
var CLEO = null, DATA = null, tri = "nom", sens = 1;
try { CLEO = sessionStorage.getItem("efa_cle_orga"); } catch (e) {}
function connexion() {
  $("vue").innerHTML = '<section class="carte"><h2>Entrer votre clé d’organisation</h2><p class="aide">Elle commence par ORG- et vous a été remise par EFA. Ne la partagez qu’avec les personnes qui suivent le programme pour votre organisation.</p>'
    + '<label class="champ">Clé d’organisation<input id="o-cle" class="cle-in" autocomplete="off" placeholder="ORG-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"></label>'
    + '<label class="case"><input type="checkbox" id="o-garde"><span>Rester connecté sur cet appareil le temps de la session</span></label>'
    + '<div class="acts"><button type="button" class="bt bt-p" id="o-go">Ouvrir le tableau de bord</button><a class="bt bt-l" href="programme-organisation.html">Composer un programme</a></div><p class="msg" id="o-msg" role="status"></p></section>';
  $("o-go").onclick = function () { var k = $("o-cle").value.trim().toUpperCase(); if (!/^ORG-/.test(k)) return msg("o-msg", "La clé d’organisation commence par ORG-."); CLEO = k; charger(true); };
  $("o-cle").onkeydown = function (e) { if (e.key === "Enter") $("o-go").click(); };
}
function charger(premier) {
  if (premier) msg("o-msg", "Chargement…", true);
  E.appel("/orga", null, CLEO).then(function (j) {
    DATA = j; if (premier && $("o-garde") && $("o-garde").checked) try { sessionStorage.setItem("efa_cle_orga", CLEO); } catch (e) {}
    mesure("orga-tableau"); tableau();
  }, function (e) { CLEO = null; try { sessionStorage.removeItem("efa_cle_orga"); } catch (x) {} if (!$("o-msg")) connexion(); msg("o-msg", e.message); });
}
function lignes() {
  var mods = DATA.programme.programme.m, maintenant = Date.now();
  return DATA.participants.map(function (pa) {
    var b = bilan(pa, mods), jours = pa.vu_le ? (maintenant - new Date(pa.vu_le)) / 864e5 : 999;
    var etat = b.fini ? ["ok", "Terminé"] : b.pct > 0 ? (jours > 14 ? ["dorm", "En pause"] : ["enc", "En cours"]) : ["zero", "Pas commencé"];
    return { pa: pa, b: b, jours: jours, etat: etat, cert: Object.keys(pa.certificats || {}).map(function (k) { return pa.certificats[k]; }).join(", ") };
  });
}
function tableau() {
  var L = lignes(), pg = DATA.programme, f = (($("f-q") || {}).value || "").toLowerCase();
  var n = L.length, act = L.filter(function (l) { return l.jours <= 7; }).length, fin = L.filter(function (l) { return l.b.fini; }).length, cer = L.filter(function (l) { return l.cert; }).length;
  var lienJ = location.origin + "/rejoindre.html?code=" + encodeURIComponent(pg.code);
  L.sort(function (a, b) { var x = tri === "nom" ? a.pa.nom.localeCompare(b.pa.nom) : tri === "vu" ? (a.jours - b.jours) : tri === "prog" ? (b.b.pct - a.b.pct) : (new Date(b.pa.cree_le) - new Date(a.pa.cree_le)); return x * sens; });
  var V = L.filter(function (l) { return !f || (l.pa.nom + " " + (l.pa.email || "")).toLowerCase().indexOf(f) >= 0 || l.etat[1].toLowerCase().indexOf(f) >= 0; });
  $("vue").innerHTML = '<section class="carte"><p class="sur">Programme</p><h2>' + esc(pg.nom) + '</h2>'
    + '<p class="aide">' + pg.programme.m.length + ' modules · ' + pg.programme.s + ' semaines · ' + n + ' inscrit' + (n > 1 ? 's' : '') + ' sur ' + pg.places + ' places' + (pg.expire_le ? ' · ouvert jusqu’au ' + dateFr(pg.expire_le) : '') + (pg.actif ? '' : ' · <b>programme fermé</b>') + '</p>'
    + '<div class="stats"><div><small>Inscrits</small><b>' + n + '</b></div><div><small>Actifs cette semaine</small><b>' + act + '</b></div><div><small>Ont terminé</small><b>' + fin + '</b></div><div><small>Certificats</small><b>' + cer + '</b></div></div></section>'
    + '<section class="carte no-print"><h2>Inviter vos participants</h2><p class="aide">Chacun crée son compte avec ce code, depuis son téléphone. Il obtient une clé personnelle pour retrouver sa progression partout.</p>'
    + '<div class="grille2"><div><p class="sur">Code du programme</p><div class="cle">' + esc(pg.code) + '</div></div><div><p class="sur">Lien direct</p><div class="cle" style="font-size:14px">' + esc(lienJ) + '</div></div></div>'
    + '<div class="acts"><button type="button" class="bt bt-p" id="i-copier">Copier le message d’invitation</button><button type="button" class="bt" id="i-wa">Envoyer par WhatsApp</button><a class="bt bt-l" href="' + E.lienProgramme({ programme: pg }) .replace("&vue=participant", "") + '">Voir le programme</a></div><p class="msg" id="i-msg"></p></section>'
    + '<section class="carte"><h2>Les participants</h2><div class="filtre no-print"><input id="f-q" type="search" placeholder="Chercher un nom, un email, « terminé », « en pause »…" value="' + esc(f) + '"><button type="button" class="bt" id="f-csv">Exporter en CSV</button><button type="button" class="bt" id="f-maj">Actualiser</button><button type="button" class="bt bt-l" id="f-out">Fermer la session</button></div>'
    + (V.length ? '<div class="tabw"><table class="t"><thead><tr><th data-tri="nom">Participant</th><th data-tri="cree">Inscrit</th><th data-tri="vu">Dernière visite</th><th data-tri="prog">Progression</th><th>Modules</th><th>État</th><th>Certificat</th><th class="no-print"></th></tr></thead><tbody>'
      + V.map(function (l) { return '<tr><td><b>' + esc(l.pa.nom) + '</b>' + (l.pa.email ? '<small>' + esc(l.pa.email) + '</small>' : '') + '</td><td>' + dateFr(l.pa.cree_le) + '</td><td>' + dateFr(l.pa.vu_le, true) + '</td><td><div class="barre"><i style="width:' + l.b.pct + '%"></i></div><small>' + l.b.pct + ' % des étapes</small></td><td>' + l.b.valides + ' / ' + l.b.total + '</td><td><span class="pill ' + l.etat[0] + '">' + l.etat[1] + '</span></td><td>' + (l.cert ? esc(l.cert) : '<small>—</small>') + '</td><td class="no-print"><button type="button" class="bt bt-l" data-retirer="' + esc(l.pa.id) + '" data-nom="' + esc(l.pa.nom) + '">Retirer</button></td></tr>'; }).join("")
      + '</tbody></table></div>' : '<p class="aide">' + (n ? "Aucun participant ne correspond à la recherche." : "Personne ne s’est encore inscrit. Envoyez le code ci-dessus à vos participants.") + '</p>')
    + '<p class="msg" id="t-msg"></p><p class="mention">Un module est terminé quand ses étapes essentielles sont faites et sa fiche gardée. « En pause » : commencé, sans visite depuis plus de 14 jours. Les montants saisis par les participants ne sont jamais transmis.</p></section>';
  var inv = "Bonjour, notre programme d’éducation financière avec EFA est ouvert. Créez votre compte en 1 minute sur votre téléphone : " + lienJ + " (code : " + pg.code + "). Votre progression est enregistrée ; les montants que vous saisissez restent sur votre téléphone.";
  $("i-copier").onclick = function () { copier(inv, "i-msg", "Message copié : collez-le dans un email, WhatsApp ou l’intranet."); };
  $("i-wa").onclick = function () { window.open("https://wa.me/?text=" + encodeURIComponent(inv), "_blank", "noopener"); };
  $("f-q").oninput = function () { var p = this.selectionStart; tableau(); $("f-q").focus(); try { $("f-q").setSelectionRange(p, p); } catch (e) {} };
  $("f-maj").onclick = function () { charger(false); };
  $("f-out").onclick = function () { CLEO = null; DATA = null; try { sessionStorage.removeItem("efa_cle_orga"); } catch (e) {} connexion(); };
  $("f-csv").onclick = function () {
    var q = function (s) { return '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"'; };
    var csv = ["Nom;Email;Inscrit le;Dernière visite;Progression (%);Modules terminés;Modules du programme;État;Certificats"].concat(lignes().map(function (l) { return [l.pa.nom, l.pa.email || "", (l.pa.cree_le || "").slice(0, 10), (l.pa.vu_le || "").slice(0, 16).replace("T", " "), l.b.pct, l.b.valides, l.b.total, l.etat[1], l.cert].map(q).join(";"); })).join("\r\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })); a.download = "efa-programme-" + pg.nom.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + new Date().toISOString().slice(0, 10) + ".csv"; document.body.appendChild(a); a.click(); a.remove(); mesure("orga-export");
  };
  document.querySelectorAll("[data-tri]").forEach(function (th) { th.onclick = function () { var t = th.getAttribute("data-tri"); sens = tri === t ? -sens : 1; tri = t; tableau(); }; });
  var conf = null;
  document.querySelectorAll("[data-retirer]").forEach(function (b) { b.onclick = function () {
    var id = b.getAttribute("data-retirer");
    if (conf !== id) { conf = id; b.textContent = "Confirmer le retrait"; msg("t-msg", "Retirer " + b.getAttribute("data-nom") + " ? Son compte sera désactivé. Touchez à nouveau pour confirmer."); return; }
    E.appel("/orga/retirer", { id: id }, CLEO).then(function () { charger(false); }, function (e) { msg("t-msg", e.message); });
  }; });
}
if (CLEO) charger(false); else connexion();
''', '<a href="organisations.html">Pour les organisations</a> › Tableau de bord', '<meta name="robots" content="noindex">\n')

# ------------------------------------------------------------------ admin-ecole.html (clé maîtresse)
page('admin-ecole', 'Administration des programmes', 'Réservé à EFA',
     'Créer et gérer les programmes des organisations',
     'Avec la clé maîtresse : générer la clé d’une organisation et le code de ses participants, suivre les programmes ouverts, renouveler une clé, fermer un programme.',
     COMMUN + r'''
var ADM = null;
function decoder(t) { try { t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "="; return JSON.parse(decodeURIComponent(escape(atob(t)))); } catch (e) { return null; } }
function connexion() {
  $("vue").innerHTML = '<section class="carte"><h2>Clé maîtresse</h2><p class="aide">Elle n’est jamais enregistrée : vous la saisissez à chaque visite.</p><label class="champ">Clé maîtresse<input id="a-cle" type="password" autocomplete="off"></label><div class="acts"><button type="button" class="bt bt-n" id="a-go">Entrer</button><button type="button" class="bt bt-l" id="a-gen">Générer une nouvelle clé maîtresse</button></div><p class="msg" id="a-msg"></p><div id="a-new"></div></section>';
  $("a-go").onclick = function () { ADM = $("a-cle").value.trim(); liste(); };
  $("a-cle").onkeydown = function (e) { if (e.key === "Enter") $("a-go").click(); };
  // Générée dans ce navigateur, jamais envoyée : à coller dans Cloudflare (ADMIN_KEY) et dans un gestionnaire de mots de passe
  $("a-gen").onclick = function () { var A = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789", o = new Uint8Array(48), k = ""; crypto.getRandomValues(o); for (var i = 0; i < 48; i++) k += A[o[i] % A.length];
    $("a-new").innerHTML = '<p class="aide">Nouvelle clé maîtresse (48 caractères), créée sur ce téléphone et envoyée nulle part. Collez-la dans Cloudflare, secret <b>ADMIN_KEY</b> du Worker efa-ecole, et gardez-la dans un gestionnaire de mots de passe.</p><div class="cle">' + k + '</div>'; };
}
function liste(res) {
  E.appel("/admin/programmes", null, ADM).then(function (j) {
    var P0 = j.programmes || [];
    $("vue").innerHTML = (res ? res : '')
      + '<section class="carte"><p class="sur">Nouveau programme</p><h2>Générer les accès d’une organisation</h2>'
      + '<div class="grille2"><label class="champ">Organisation<input id="n-nom" maxlength="80" placeholder="ex. Coopérative Awa"></label><label class="champ">Lien du programme<small>copié depuis « Composer un programme »</small><input id="n-lien" placeholder="https://efa.africa/programme-organisation.html?p=…"></label>'
      + '<label class="champ">Places<input id="n-places" type="number" min="1" value="50"></label><label class="champ">Ouvert jusqu’au <small>facultatif</small><input id="n-fin" type="date"></label>'
      + '<label class="champ">Note interne <small>facultatif : contact, conditions</small><input id="n-note" maxlength="300"></label></div>'
      + '<div class="acts"><button type="button" class="bt bt-p" id="n-go">Générer la clé et le code</button><a class="bt bt-l" href="programme-organisation.html" target="_blank" rel="noopener">Composer un programme</a></div><p class="msg" id="n-msg"></p></section>'
      + '<section class="carte"><h2>Programmes (' + P0.length + ')</h2>' + (P0.length ? '<div class="tabw"><table class="t"><thead><tr><th>Organisation</th><th>Code</th><th>Inscrits</th><th>Actifs 7 j</th><th>Dernier accès</th><th>État</th><th></th></tr></thead><tbody>'
        + P0.map(function (p) { return '<tr><td><b>' + esc(p.nom) + '</b><small>créé le ' + dateFr(p.cree_le) + (p.note ? ' · ' + esc(p.note) : '') + '</small></td><td><code>' + esc(p.code) + '</code></td><td>' + p.participants + ' / ' + p.places + '</td><td>' + p.actifs_7j + '</td><td>' + dateFr(p.dernier_acces) + '</td><td><span class="pill ' + (p.actif ? 'ok">Ouvert' : 'zero">Fermé') + '</span></td><td><button class="bt bt-l" data-cle="' + p.id + '">Nouvelle clé</button><button class="bt bt-l" data-etat="' + p.id + '" data-actif="' + (p.actif ? 0 : 1) + '">' + (p.actif ? 'Fermer' : 'Rouvrir') + '</button></td></tr>'; }).join("")
        + '</tbody></table></div>' : '<p class="aide">Aucun programme pour l’instant.</p>') + '<p class="msg" id="l-msg"></p></section>';
    $("n-go").onclick = function () {
      var l = $("n-lien").value.trim(), m = /[?&]p=([A-Za-z0-9_-]+)/.exec(l), pr = m && decoder(m[1]), nom = $("n-nom").value.trim() || (pr && pr.n) || "";
      if (!pr || !pr.m) return msg("n-msg", "Collez le lien complet du programme composé en ligne.");
      if (nom.length < 2) return msg("n-msg", "Indiquez le nom de l’organisation.");
      E.appel("/admin/programmes", { nom: nom, programme: pr, places: +$("n-places").value, expire_le: $("n-fin").value || null, note: $("n-note").value.trim() }, ADM).then(function (r) { liste(remise(r)); }, function (e) { msg("n-msg", e.message); });
    };
    document.querySelectorAll("[data-cle]").forEach(function (b) { b.onclick = function () { if (b.textContent !== "Confirmer") { b.textContent = "Confirmer"; msg("l-msg", "L’ancienne clé de cette organisation cessera de fonctionner. Touchez « Confirmer »."); return; }
      E.appel("/admin/programme", { id: b.getAttribute("data-cle"), nouvelle_cle: true }, ADM).then(function (r) { var p = P0.filter(function (x) { return x.id === b.getAttribute("data-cle"); })[0]; liste(remise({ programme: p, cle_organisation: r.cle_organisation, code: p.code })); }, function (e) { msg("l-msg", e.message); }); }; });
    document.querySelectorAll("[data-etat]").forEach(function (b) { b.onclick = function () { E.appel("/admin/programme", { id: b.getAttribute("data-etat"), actif: b.getAttribute("data-actif") === "1" }, ADM).then(function () { liste(); }, function (e) { msg("l-msg", e.message); }); }; });
  }, function (e) { ADM = null; connexion(); msg("a-msg", e.message); });
}
function remise(r) {
  var org = location.origin, nom = r.programme.nom;
  var texte = "Bonjour,\n\nVoici les accès au programme d’éducation financière EFA de " + nom + ".\n\n1. Tableau de bord de l’organisation : " + org + "/espace-organisation.html\n   Clé d’organisation (confidentielle) : " + r.cle_organisation + "\n\n2. Pour vos participants : " + org + "/rejoindre.html?code=" + r.code + "\n   Code du programme : " + r.code + "\n\nLa clé d’organisation donne accès à la progression de vos participants : gardez-la pour les responsables du programme.\n\nL’équipe EFA";
  setTimeout(function () { var b = $("r-copier"); if (b) b.onclick = function () { copier(texte, "r-msg", "Message copié : envoyez-le au responsable de l’organisation."); }; }, 0);
  return '<section class="carte" style="background:#E3F5EA"><p class="sur">Accès générés · ' + esc(nom) + '</p><h2>Notez la clé maintenant : elle ne sera plus affichée</h2>'
    + '<p class="aide"><b>Clé d’organisation</b> (tableau de bord, confidentielle)</p><div class="cle">' + esc(r.cle_organisation) + '</div>'
    + '<p class="aide"><b>Code des participants</b></p><div class="cle">' + esc(r.code) + '</div>'
    + '<div class="acts"><button type="button" class="bt bt-p" id="r-copier">Copier le message pour l’organisation</button></div><p class="msg" id="r-msg"></p></section>';
}
connexion();
''', 'Administration', '<meta name="robots" content="noindex, nofollow">\n')
print('ok')
