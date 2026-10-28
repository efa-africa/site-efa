/* EFA · Quiz en format « statut » (comme la démo de l'école) : 5 questions, une par écran, plein écran sur téléphone.
   Chargé par efa-appli.js sur toutes les pages. Une carte « Quiz · 1 minute » s'insère dans chaque rubrique ;
   le lien ?quiz=efa (ou argent, etudes, orga, ecole) ouvre directement un quiz. Rien n'est envoyé : le meilleur score reste sur l'appareil. */
(function () {
  "use strict";
  try { if (window.self !== window.top) return; } catch (e) { return; }
  if (window.EFA_QUIZ) return;

  /* ---------- Les questions : [question, [3 réponses], indice de la bonne, explication] ---------- */
  var BANQUES = {
    efa: [
      ["Que veut dire EFA ?", ["Éducation Financière Afrique", "Épargne et Finance Africaine", "Entreprise de Financement Africain"], 0, "EFA, c’est Éducation Financière Afrique : l’école de la finance personnelle, ancrée dans les réalités africaines."],
      ["Combien de cycles compte L’école EFA ?", ["Deux", "Trois", "Cinq"], 1, "Trois cycles : I Fondations, II Maîtrise, III Patrimoine. Chacun se termine par son certificat local."],
      ["Combien de modules au total ?", ["12", "23", "40"], 1, "23 modules : 8 en Fondations, 8 en Maîtrise, 7 en Patrimoine."],
      ["Quel certificat couvre les trois cycles ?", ["Le certificat CEFA ★", "Un diplôme d’État", "Le badge Koffi"], 0, "Le certificat CEFA ★ réunit les trois certificats locaux. Ce n’est pas un diplôme d’État : il atteste ce que vous avez appris."],
      ["EFA vend-elle des produits financiers ?", ["Oui, des placements", "Seulement des assurances", "Non, jamais"], 2, "EFA fait de l’éducation financière : ni conseil en investissement, ni vente de produits financiers."],
      ["Combien coûtent les modules de L’école ?", ["Ils sont gratuits", "5 000 F par module", "Un abonnement mensuel"], 0, "Les modules, les outils et les certificats locaux sont gratuits."],
      ["Chez EFA, « le cercle », c’est…", ["Le groupe de tontine", "L’argent qui tourne et repart", "Le logo de l’école"], 1, "Le cercle, c’est l’argent qui arrive puis repart. EFA aide à passer du cercle à la spirale."],
      ["Et « la spirale » ?", ["Une dette qui grossit", "L’argent qui reste et grandit", "Un jeu de société"], 1, "La spirale, c’est l’argent qui reste : une part gardée à chaque tour, qui grandit."],
      ["Qui est Koffi ?", ["Le fondateur d’EFA", "Un conseiller bancaire", "Un personnage fictif qui apprend avec vous"], 2, "Koffi est un personnage fictif, salarié à Abidjan. Ses montants sont inventés pour l’exemple."],
      ["Comment s’appelle le guide qui répond à vos questions ?", ["Ely", "Awa", "Koffi"], 0, "Ely répond à vos questions sur l’argent, à toute heure, sur le site."],
      ["Min’Fin, c’est…", ["Un ministère", "Une série de vidéos courtes", "Une banque en ligne"], 1, "Min’Fin : des épisodes courts pour comprendre une notion d’argent en une minute."],
      ["Qui a fondé EFA ?", ["Élysée Johnson", "Une banque", "Une agence publique"], 0, "EFA a été fondée par Élysée Johnson, qui en est le président."],
      ["Africa 2075, c’est…", ["Un plan d’épargne", "Un concours de start-up", "De la prospective sur l’Afrique de demain"], 2, "Africa 2075 explore les frontières de croissance du continent, dans Études & prospective."],
      ["Pour valider le quiz d’un module, il faut…", ["3 bonnes réponses sur 5", "4 bonnes réponses sur 5", "5 sur 5"], 1, "4 bonnes réponses sur 5, puis la fiche du module gardée : le module est validé."],
      ["Les montants que vous tapez dans les outils EFA…", ["Restent sur votre téléphone", "Sont envoyés à EFA", "Sont partagés avec votre banque"], 0, "Vos montants restent sur votre téléphone. Même avec un compte, ils ne sont jamais transmis."]
    ],
    argent: [
      ["Votre salaire du mois est…", ["Un flux", "Un stock", "Une dette"], 0, "Un flux se mesure sur une période : ce qui entre ou sort pendant le mois."],
      ["Ce que vous possédez le 31 au soir, c’est…", ["Un flux", "Un stock", "Un budget"], 1, "Un stock se mesure à une date : ce que vous avez à un moment donné."],
      ["Votre patrimoine net, c’est…", ["Revenus moins dépenses", "Ce que vous possédez moins ce que vous devez", "Votre épargne plus vos crédits"], 1, "Patrimoine net = ce que vous possédez moins ce que vous devez."],
      ["Un retrait d’espèces au guichet est-il une dépense ?", ["Oui, toujours", "Non : la dépense, c’est ce que vous payez ensuite", "Seulement le week-end"], 1, "Retirer, c’est changer la forme de votre argent. La dépense arrive quand vous payez avec ces espèces."],
      ["500 F par jour, sur une année, cela fait environ…", ["50 000 F", "182 500 F", "1 000 000 F"], 1, "500 × 365 = 182 500 F. Les petites sommes ne sont petites qu’une par une."],
      ["Revenu irrégulier : sur quel mois bâtir son budget ?", ["Le meilleur mois", "La moyenne", "Le mois faible"], 2, "On construit sur le mois faible : les bons mois remplissent la réserve au lieu de créer des habitudes."],
      ["La réserve de sécurité sert d’abord à…", ["Faire face aux imprévus sans s’endetter", "Investir en Bourse", "Payer sa cotisation de tontine"], 0, "La réserve amortit les coups durs : maladie, panne, perte de revenu."],
      ["Avant d’investir en Bourse, mieux vaut…", ["Emprunter pour placer plus", "Avoir une réserve et pas de crédit cher", "Vider sa réserve"], 1, "Placer l’argent dont on aura besoin, ou en devant un crédit cher, fait perdre plus qu’il ne rapporte."],
      ["Recevoir le pot de la tontine en premier, c’est surtout…", ["Une épargne", "Un crédit sans intérêt accordé par le groupe", "Un cadeau"], 1, "Le premier reçoit tout de suite ce qu’il remboursera par ses cotisations : c’est une avance du groupe."],
      ["Le dernier à recevoir le pot de la tontine a…", ["Épargné tout au long du tour", "Emprunté au groupe", "Perdu de l’argent"], 0, "Le dernier a mis de côté à chaque tour : pour lui, la tontine a fonctionné comme une épargne."],
      ["Prêter à un proche : la bonne pratique, c’est…", ["Ne jamais en parler", "Décider dès le départ : prêt ou cadeau", "Prêter tout ce qu’on a"], 1, "Nommer la somme dès le départ, prêt ou cadeau, évite les malentendus et protège la relation."],
      ["Le coût total d’un crédit, c’est…", ["Le montant de chaque échéance", "Tout ce que vous paierez en plus de la somme empruntée", "Le taux affiché"], 1, "Intérêts, frais, assurance : tout ce que vous rembourserez au-delà de la somme empruntée."],
      ["Votre solde de mobile money vous rapporte-t-il des intérêts ?", ["Oui, chaque mois", "En général non", "Seulement au-delà de 100 000 F"], 1, "Le mobile money sert à payer et envoyer. Il n’est pas fait pour épargner."]
    ],
    etudes: [
      ["Enquête EFA « L’argent de la tontine » : 71 % des participants déclarent que leur tontine…", ["Garde une réserve commune", "Redistribue tout", "Prête à intérêt"], 1, "71 % déclarent que tout est redistribué : rien n’est gardé en commun. C’est un sondage déclaratif, non représentatif."],
      ["La BRVM, c’est…", ["La banque centrale", "La Bourse commune aux 8 pays de l’UEMOA", "Un fonds d’investissement"], 1, "La Bourse Régionale des Valeurs Mobilières sert les huit pays de l’UEMOA."],
      ["Où siège la BRVM ?", ["Abidjan", "Dakar", "Lomé"], 0, "La BRVM a son siège à Abidjan, en Côte d’Ivoire."],
      ["La BCEAO est…", ["Une banque commerciale", "La banque centrale des pays de l’UEMOA", "La Bourse de Dakar"], 1, "La BCEAO émet le franc CFA de l’UEMOA et fixe les taux directeurs."],
      ["Une obligation, c’est…", ["Une part d’entreprise", "Un prêt que vous faites à un émetteur", "Un compte d’épargne garanti"], 1, "L’émetteur vous verse un intérêt, puis vous rembourse. Ce n’est pas un compte garanti."],
      ["Une action divisée par dix (fractionnement) devient…", ["Dix fois moins chère", "Ni plus ni moins chère : l’entreprise vaut pareil", "Dix fois plus rentable"], 1, "Le prix par action baisse, le nombre d’actions augmente : la valeur détenue ne change pas."],
      ["Un taux d’intérêt élevé garantit-il la solidité de l’emprunteur ?", ["Oui", "Non", "Seulement pour un État"], 1, "Un taux annoncé ne dit rien de la solidité de l’emprunteur : souvent, un taux élevé paie un risque élevé."],
      ["La monnaie commune de l’UEMOA est…", ["Le franc CFA (XOF)", "Le cedi", "Le naira"], 0, "Le franc CFA de l’Afrique de l’Ouest (XOF), émis par la BCEAO."]
    ],
    orga: [
      ["Combien de temps pour composer un programme en ligne ?", ["Environ 5 minutes", "Une semaine", "Un mois"], 0, "Cycles ou sujets, rythme, format : le programme se compose en ligne, en quelques minutes."],
      ["Dans son tableau de bord, le responsable voit…", ["Les montants saisis par chacun", "Le nom, les visites et l’avancement de chacun", "Les réponses aux quiz"], 1, "Avancement, modules terminés, certificat. Jamais les montants, les fiches ni les réponses."],
      ["Comment un salarié rejoint-il le programme ?", ["Avec le code de son organisation", "Avec la clé du tableau de bord", "Par un email de sa banque"], 0, "Il crée son compte avec le code du programme ; la clé du tableau de bord reste aux responsables."],
      ["Qui garde la clé du tableau de bord ?", ["Tous les participants", "Les responsables désignés", "Personne"], 1, "La clé d’organisation est réservée aux responsables du programme (RH, formation, direction)."],
      ["Un programme peut-il mener à un certificat ?", ["Non", "Oui : un certificat local par cycle, et le CEFA ★", "Seulement payant"], 1, "Chaque cycle complet se termine par un certificat local ; les trois réunis donnent le CEFA ★."],
      ["Avant les modules de placement, EFA conseille…", ["Le socle : réserve et dettes", "D’emprunter pour investir", "De commencer par la Bourse"], 0, "On place mieux quand la réserve est en route et que le crédit cher est remboursé."]
    ]
  };
  var QUIZ = {
    efa: { titre: "À quel point connaissez-vous EFA ?", sous: "5 questions sur l’école, ses personnages et ses règles.", banques: ["efa", "efa", "efa", "efa", "efa"], cta: ["parcours.html?src=quiz", "Entrer dans l’école"] },
    moi: { titre: "Où en êtes-vous avec votre argent ?", sous: "5 questions sur les bases : flux, réserve, tontine, crédit. Votre score dit par où commencer.", banques: ["argent", "argent", "argent", "argent", "argent"], cta: ["point-de-depart.html?src=quiz", "Trouver mon point de départ"] },
    argent: { titre: "Les bases de l’argent", sous: "Flux, stock, tontine, réserve : 5 questions pour vous situer.", banques: ["argent", "argent", "argent", "argent", "argent"], cta: ["parcours.html?src=quiz#P1", "Commencer le module 1"] },
    ecole: { titre: "Testez-vous avant d’entrer", sous: "3 questions sur l’argent, 2 sur l’école.", banques: ["argent", "argent", "argent", "efa", "efa"], cta: ["parcours.html?src=quiz#P1", "Commencer le module 1"] },
    etudes: { titre: "Bourse, tontine, chiffres : testez-vous", sous: "5 questions sur ce que disent les études et les marchés.", banques: ["etudes", "etudes", "etudes", "etudes", "etudes"], cta: ["methode.html?src=quiz#sommaire", "Explorer les études"] },
    orga: { titre: "Former ses équipes avec EFA", sous: "5 questions pour comprendre le programme des organisations.", banques: ["orga", "orga", "orga", "orga", "orga"], cta: ["programme-organisation.html?src=quiz", "Composer un programme"] }
  };
  // Une carte par rubrique : page → [quiz, sélecteur après lequel s'insérer]
  var PAGES = {
    "index.html": ["moi", "#ecole"],
    "parcours.html": ["ecole", ".ch-trame, .hero"],
    "outils.html": ["argent", ".hero, header + main > section, main > section"],
    "methode.html": ["etudes", "#sommaire"],
    "organisations.html": ["orga", "main > section"],
    "auteur.html": ["efa", "main > section, .hero"],
    "news.html": ["etudes", "main > section, .hero"]
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function melange(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function compter(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function meilleur(id, v) { var k = "efa_quiz_" + id; try { if (v != null) { if (v > (+localStorage.getItem(k) || 0)) localStorage.setItem(k, v); } return +localStorage.getItem(k) || 0; } catch (e) { return 0; } }

  // 5 questions tirées des banques, réponses mélangées
  function tirer(q) {
    var pris = {}, out = [];
    q.banques.forEach(function (b) {
      var dispo = BANQUES[b].filter(function (x, i) { return !pris[b + i]; });
      var i0 = BANQUES[b].indexOf(dispo[Math.floor(Math.random() * dispo.length)]); pris[b + i0] = 1;
      var x = BANQUES[b][i0], ordre = melange([0, 1, 2]);
      out.push({ q: x[0], r: ordre.map(function (k) { return x[1][k]; }), ok: ordre.indexOf(x[2]), e: x[3] });
    });
    return melange(out);
  }

  var CSS = ".efq{position:fixed;inset:0;z-index:10000;background:#0B1220;color:#E8EDF5;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif;display:flex;flex-direction:column;-webkit-text-size-adjust:100%}"
    + ".efq *{box-sizing:border-box}.efq h2{font-family:'Libre Baskerville',Baskerville,Georgia,serif;font-weight:700;line-height:1.15;margin:0;color:#fff;text-wrap:balance}.efq p{margin:0}"
    + ".efq .bars{display:flex;gap:5px;padding:calc(12px + env(safe-area-inset-top,0px)) 16px 0}.efq .bars i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.22);overflow:hidden}.efq .bars i b{display:block;height:100%;width:0;background:#fff;transition:width .4s}.efq .bars i.done b{width:100%}"
    + ".efq .head{display:flex;align-items:center;justify-content:space-between;padding:12px 16px}.efq .brand{display:flex;align-items:center;gap:10px;color:#fff;font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.efq .brand img{width:30px;height:30px}"
    + ".efq .x{min-width:44px;min-height:40px;border:0;border-radius:999px;background:rgba(255,255,255,.1);color:#fff;font:700 14px 'Source Sans 3',system-ui,sans-serif;padding:0 16px;cursor:pointer}"
    + ".efq .stage{flex:1;overflow:auto;display:flex;justify-content:center;align-items:center;padding:12px 20px calc(28px + env(safe-area-inset-bottom,0px))}"
    + ".efq .in{width:100%;max-width:600px;display:grid;gap:18px;text-align:center;justify-items:center;animation:efqUp .45s both}@keyframes efqUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}"
    + ".efq .k{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#F09680}.efq .big{font-size:clamp(30px,7vw,52px)}.efq .mid{font-size:clamp(22px,4.6vw,34px)}"
    + ".efq .lead{font-size:clamp(16px,2.2vw,19px);line-height:1.5;color:#C9D1DE;max-width:520px}"
    + ".efq .opts{display:grid;gap:10px;width:100%;max-width:520px;margin-top:4px}.efq .opt{all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:12px;align-items:center;text-align:left;background:#111B2F;border-radius:14px;padding:14px 16px;min-height:56px;font-size:17px;font-weight:700;color:#fff;transition:background .2s}"
    + ".efq .opt .l{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.1);font-weight:800;font-size:14px}"
    + ".efq .opt:hover{background:#16233D}.efq .opt:focus-visible{outline:3px solid #6DB8F2;outline-offset:2px}.efq .opt.ok{background:#3CCB7F;color:#0B1220}.efq .opt.ok .l{background:rgba(11,18,32,.15)}.efq .opt.ko{background:#DA3C1B}.efq .opt[disabled]{cursor:default}"
    + ".efq .exp{background:#F5EFE2;color:#2A3142;border-radius:14px;padding:14px 16px;text-align:left;font-size:16px;line-height:1.5;width:100%;max-width:520px}.efq .exp b{color:#0B1220}"
    + ".efq .btn{display:flex;align-items:center;justify-content:center;min-height:54px;padding:12px 22px;border-radius:12px;font:800 17px 'Source Sans 3',system-ui,sans-serif;text-decoration:none;border:0;cursor:pointer;width:100%;max-width:420px}"
    + ".efq .btn-main{background:#DA3C1B;color:#fff}.efq .btn-clair{background:#F5EFE2;color:#0B1220}.efq .btn-ghost{background:transparent;color:#fff;text-decoration:underline;text-underline-offset:5px;min-height:44px}"
    + ".efq .anneau{width:clamp(110px,30vw,150px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font-family:'Libre Baskerville',Georgia,serif;font-weight:700;font-size:clamp(34px,9vw,48px);color:#fff;background:conic-gradient(#DA3C1B var(--p),rgba(255,255,255,.12) 0);position:relative}"
    + ".efq .anneau::before{content:'';position:absolute;inset:10px;border-radius:50%;background:#0B1220}.efq .anneau span{position:relative}"
    + ".efq .cta{display:grid;gap:10px;width:100%;justify-items:center}"
    /* la carte d'entrée, dans la page */
    + ".efq-carte{display:flex;align-items:center;gap:14px;margin:18px auto;max-width:1120px;width:calc(100% - 32px);background:#0B1220;color:#E8EDF5;border-radius:14px;padding:14px 16px;text-decoration:none;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif;cursor:pointer;border:0;text-align:left;box-sizing:border-box}"
    + ".efq-carte .rond{flex:none;width:52px;height:52px;border-radius:50%;padding:3px;background:conic-gradient(#DA3C1B,#EC6243,#6DB8F2,#DA3C1B)}.efq-carte .rond span{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:#111B2F;border:2px solid #111B2F;font:700 20px 'Libre Baskerville',Georgia,serif;color:#fff}"
    + ".efq-carte .t{flex:1;min-width:0}.efq-carte small{display:block;font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#F09680}.efq-carte b{display:block;font:700 clamp(16px,2vw,19px)/1.25 'Libre Baskerville',Georgia,serif;color:#fff;margin-top:2px}"
    + ".efq-carte em{flex:none;font-style:normal;font-weight:800;font-size:15px;background:#DA3C1B;color:#fff;border-radius:999px;padding:10px 16px}.efq-carte:hover{background:#16233D}"
    + "@media (max-width:480px){.efq-carte em{display:none}}";

  var el, Q, cle, liste, i, bonnes, choisi;
  function barres() {
    var n = liste.length + 2, fait = i + 1;
    return '<div class="bars">' + Array.apply(null, Array(n)).map(function (_, k) { return '<i class="' + (k < fait ? "done" : "") + '"><b></b></i>'; }).join("") + "</div>";
  }
  function cadre(corps) {
    el.innerHTML = barres() + '<div class="head"><span class="brand"><img src="logo-efa-96.png" alt="" width="30" height="30">EFA · Quiz</span><button type="button" class="x" data-q="fermer">Fermer</button></div>'
      + '<div class="stage"><div class="in">' + corps + "</div></div>";
  }
  function intro() {
    i = -1; bonnes = 0;
    var m = meilleur(cle);
    cadre('<p class="k">Quiz · 1 minute</p><h2 class="big">' + esc(Q.titre) + '</h2><p class="lead">' + esc(Q.sous) + (m ? " Votre meilleur score : " + m + " / 5." : "") + '</p>'
      + '<div class="cta"><button type="button" class="btn btn-main" data-q="go">Commencer</button></div>');
  }
  function question() {
    var x = liste[i]; choisi = null;
    cadre('<p class="k">Question ' + (i + 1) + " sur " + liste.length + '</p><h2 class="mid">' + esc(x.q) + '</h2><div class="opts">'
      + x.r.map(function (r, k) { return '<button type="button" class="opt" data-r="' + k + '"><span class="l">' + "ABC"[k] + "</span><span>" + esc(r) + "</span></button>"; }).join("") + "</div>");
  }
  function repondre(k) {
    if (choisi != null) return; choisi = k;
    var x = liste[i], bon = k === x.ok; if (bon) bonnes++; if (window.EFA_SONS) EFA_SONS.joue(bon ? "bon" : "faux");
    el.querySelectorAll(".opt").forEach(function (b, j) { b.disabled = true; if (j === x.ok) b.classList.add("ok"); else if (j === k) b.classList.add("ko"); });
    var d = document.createElement("div");
    d.innerHTML = '<p class="exp"><b>' + (bon ? "Bonne réponse." : "Pas tout à fait.") + "</b> " + esc(x.e) + '</p><div class="cta" style="margin-top:14px"><button type="button" class="btn btn-clair" data-q="suite">' + (i + 1 < liste.length ? "Question suivante" : "Voir mon score") + "</button></div>";
    el.querySelector(".in").appendChild(d);
    var s = d.querySelector("[data-q=suite]"); try { s.focus({ preventScroll: true }); s.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {}
  }
  function fin() {
    i = liste.length; if (window.EFA_SONS) EFA_SONS.joue(bonnes >= 3 ? "fin" : "clic"); meilleur(cle, bonnes); compter("quiz-fin-" + cle + "-" + bonnes);
    var mot = bonnes === 5 ? "Parfait. Vous connaissez votre sujet." : bonnes >= 3 ? "Belle base. Quelques points à consolider." : "C’est un bon début : l’école est faite pour ça.";
    var url = location.origin + "/" + (location.pathname.split("/").pop() || "") + "?quiz=" + cle;
    cadre('<p class="k">Votre score</p><div class="anneau" style="--p:' + (bonnes * 20) + '%"><span>' + bonnes + "/5</span></div><h2 class=\"mid\">" + mot + "</h2>"
      + '<div class="cta"><a class="btn btn-main" href="' + Q.cta[0] + '">' + esc(Q.cta[1]) + "</a>"
      + '<a class="btn btn-clair" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent("J’ai eu " + bonnes + "/5 au quiz EFA « " + Q.titre + " ». À vous : " + url) + '">Défier un proche sur WhatsApp</a>'
      + '<button type="button" class="btn btn-ghost" data-q="rejouer">Rejouer avec d’autres questions</button></div>');
  }
  function ouvrir(id) {
    Q = QUIZ[id]; if (!Q) return; cle = id; liste = tirer(Q);
    if (!document.getElementById("efq-css")) { var st = document.createElement("style"); st.id = "efq-css"; st.textContent = CSS; document.head.appendChild(st); }
    if (!el) {
      el = document.createElement("div"); el.className = "efq"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Quiz EFA");
      el.addEventListener("click", function (e) {
        var b = e.target.closest("[data-q],[data-r]"); if (!b) return;
        if (b.hasAttribute("data-r")) return repondre(+b.getAttribute("data-r"));
        var a = b.getAttribute("data-q");
        if (a === "fermer") fermer();
        else if (a === "go") { i = 0; question(); compter("quiz-debut-" + cle); }
        else if (a === "suite") { i++; if (i < liste.length) question(); else fin(); }
        else if (a === "rejouer") { liste = tirer(Q); intro(); }
      });
      document.addEventListener("keydown", function (e) { if (el && el.parentNode && e.key === "Escape") fermer(); });
    }
    document.body.appendChild(el); document.documentElement.style.overflow = "hidden";
    intro();
  }
  function fermer() { if (el && el.parentNode) el.parentNode.removeChild(el); document.documentElement.style.overflow = ""; }
  window.EFA_QUIZ = { ouvrir: ouvrir };

  function carte() {
    var pg = (location.pathname.split("/").pop() || "index").replace(/^([^.]+)$/, "$1.html"), conf = PAGES[pg];
    var q = new URLSearchParams(location.search).get("quiz");
    if (q && QUIZ[q]) ouvrir(q);
    if (!conf || document.querySelector(".efq-carte")) return;
    var ref = null; conf[1].split(",").some(function (s) { ref = document.querySelector(s.trim()); return !!ref; });
    if (!ref || !ref.parentNode) return;
    if (!document.getElementById("efq-css")) { var st = document.createElement("style"); st.id = "efq-css"; st.textContent = CSS; document.head.appendChild(st); }
    var Qc = QUIZ[conf[0]], b = document.createElement("button");
    b.type = "button"; b.className = "efq-carte"; b.setAttribute("data-goatcounter-click", "quiz-carte-" + conf[0]);
    b.innerHTML = '<span class="rond"><span>?</span></span><span class="t"><small>Quiz · 1 minute</small><b>' + esc(Qc.titre) + "</b></span><em>Jouer ▶</em>";
    b.onclick = function () { ouvrir(conf[0]); };
    ref.parentNode.insertBefore(b, ref.nextSibling);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", carte); else carte();
})();
