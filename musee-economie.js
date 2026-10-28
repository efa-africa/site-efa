/* Le musée de l'économie EFA · visite en format statut (v2, 28/10/2026)
   Fil conducteur : qui crée la richesse en Afrique, qui la finance, et qui en garde la valeur ?
   Douze salles. Chaque étape : un objet (date, lieu, image entière), un personnage (médaillon, jamais de faux portrait),
   ou une décision (renvoi vers un jeu de la balade ou une leçon EFA). Idées reformulées ; seule citation : Koné Dossongui, sourcée.
   Pour ajouter une étape : copier un bloc { … } dans la bonne salle. Types : o (objet), f (personnage), n (salle sombre, sans image), d (décision). */
(function () {
  var V = "?v=2810";
  var SALLES = [
    { t: "Avant les billets", st: "Produire, compter, conserver", i: "p-specialiser",
      p: "Toute économie commence par se nourrir, organiser le travail et garder des réserves pour la mauvaise saison.",
      e: [
        { k: "o", d: "−8500", l: "Vallée du Nil, Croissant fertile", t: "On produit plus qu’on ne mange", i: "p-cacao",
          p: "Avec l’agriculture et l’élevage apparaît le <b>surplus</b> : ce qui n’est pas consommé peut se garder, se partager ou s’échanger." },
        { k: "o", d: "Sahel", l: "Greniers et saisons", t: "Conserver entre deux récoltes", i: "h-grenier", h: 1,
          p: "Le grenier de mil est la première assurance : il protège la famille contre une mauvaise année. Garder, c’est déjà épargner." },
        { k: "o", d: "−3300", l: "Mésopotamie", t: "Écrire qui doit quoi à qui", i: "h-tablettes", h: 1,
          p: "Sur des tablettes d’argile, les scribes notent récoltes, dettes et paiements. La comptabilité naît avec les premières villes.",
          q: "Des milliers d’années plus tard, le registre d’une succursale de banque fait exactement la même chose." },
        { k: "d", t: "À vous : vos réserves", p: "Entre deux rentrées d’argent, que gardez-vous de côté, et où ? C’est le grenier d’aujourd’hui.",
          a: [["Où garder sa réserve", "ou-garder-sa-reserve.html?src=musee"]] }
      ] },
    { t: "L’Afrique des routes et des marchés", st: "Or, sel, tissus, caravanes", i: "s1-echanger",
      p: "Bien avant les ports à conteneurs, des routes reliaient le Sahel à la Méditerranée, la mer Rouge à l’océan Indien.",
      e: [
        { k: "f", ini: "H", nom: "Hatchepsout", d: "Vers −1470", l: "Égypte", role: "Reine-pharaon",
          p: "Elle envoie une expédition au pays de Pount, au sud de la mer Rouge, chercher encens, ébène et or. Les reliefs de son temple racontent ce voyage : l’un des plus anciens récits de commerce lointain." },
        { k: "f", ini: "MM", nom: "Mansa Moussa", d: "1324", l: "Empire du Mali", role: "Empereur du Mali",
          p: "En route vers La Mecque, il dépense et distribue tant d’or au Caire que, selon les chroniqueurs, son cours y baisse pendant des années. L’or du Sahel fait alors tourner le commerce de la Méditerranée." },
        { k: "o", d: "XIIIe–XVIe s.", l: "Tombouctou, Gao, Djenné", t: "Or contre sel", i: "h-or-sel", h: 1,
          p: "Les caravanes traversent le Sahara : l’or et les tissus d’un côté, le sel du désert de l’autre. Chaque étape a ses péages, ses risques et ses intermédiaires : <b>le prix d’arrivée n’est pas le prix de départ</b>." },
        { k: "d", t: "À vous : troc ou monnaie ?", p: "Essayez d’obtenir du poisson avec un régime de plantain, sans argent. Puis refaites-le avec.",
          a: [["Jouer à Troc ou monnaie", "#borne-troc"]] }
      ] },
    { t: "Qu’est-ce qui fait monnaie ?", st: "Cauris, pièces, billets, soldes", i: "p-monnaies",
      p: "Une monnaie sert à compter, à payer et à garder. Elle ne tient que si chacun l’accepte.",
      e: [
        { k: "o", d: "−600", l: "Lydie", t: "Les premières pièces", i: "h-lydie", h: 1,
          p: "Un morceau de métal au poids garanti par une autorité. Plus besoin de peser l’or à chaque achat : on compte." },
        { k: "f", ini: "IB", nom: "Ibn Battuta", d: "1352", l: "Empire du Mali", role: "Voyageur, né à Tanger",
          p: "Il traverse le Sahara et décrit les marchés du Mali, où l’on paie avec des cauris, ces coquillages venus de l’océan Indien : rares, solides, impossibles à contrefaire." },
        { k: "o", d: "Partout", l: "Une idée reçue", t: "Pas forcément le troc d’abord", i: "p-fonctions",
          p: "Les historiens le rappellent : crédit, dons, monnaies et échanges ont souvent coexisté. Ce qui fait la monnaie, ce n’est pas l’objet, c’est <b>la confiance</b>." },
        { k: "d", t: "À vous : vrai ou faux ?", p: "Six affirmations entendues au marché sur la monnaie. Démêlez le vrai du faux.",
          a: [["Jouer au Vrai ou faux", "#borne-vf"]] }
      ] },
    { t: "Traites, conquêtes et économies coloniales", st: "Les personnes d’abord", i: "", sombre: 1,
      p: "Une salle à part. On y parle d’économie, mais d’abord des femmes et des hommes.",
      e: [
        { k: "n", d: "XVe–XIXe s.", l: "Atlantique, Sahara, océan Indien", t: "Les traites esclavagistes",
          p: "Des millions de femmes et d’hommes arrachés à leur terre, transportés et vendus. Une tragédie humaine d’abord, qui a aussi privé des régions entières de leurs forces vives pendant des siècles." },
        { k: "o", d: "Fin XIXe–XXe s.", l: "Mines, plantations, ports", t: "Le rail va au port", i: "cap-jonah",
          p: "Travail forcé, impôt par tête, cultures imposées : beaucoup de voies ferrées relient les mines et les plantations aux ports, plutôt que les villes africaines entre elles.",
          q: "Une infrastructure peut développer la production et organiser l’extraction en même temps. Qui choisit le tracé, et qui en profite ?" },
        { k: "f", ini: "FA", nom: "Les femmes d’Aba", d: "1929", l: "Sud-Est du Nigeria", role: "Une résistance économique",
          p: "Des milliers de femmes se soulèvent contre un impôt colonial qu’elles jugent injuste et contre les chefs nommés par l’administration. L’une des grandes résistances de l’époque coloniale." }
      ] },
    { t: "Les indépendances", st: "Construire une économie nationale", i: "s4-etat",
      p: "Un pays neuf doit tout choisir à la fois, avec un budget limité.",
      e: [
        { k: "o", d: "1960", l: "Afrique", t: "L’année des indépendances", i: "p-etat-trois",
          p: "Dix-sept pays africains deviennent indépendants cette année-là. Écoles ou routes ? Usines ou importations ? Entreprises publiques, privées ou coopératives ? Chaque pays trace sa trajectoire, avec ses réussites et ses difficultés." },
        { k: "o", d: "Toujours", l: "Le budget de l’État", t: "Prélever pour investir", i: "p-impots",
          p: "Impôts, taxes, emprunts : l’argent public devient route, école, centre de santé. Et la dette d’aujourd’hui se rembourse avec les impôts de demain." },
        { k: "d", t: "À vous : public ou privé ?", p: "Huit services du quotidien. Qui les produit : l’État, une entreprise, ou les deux ?",
          a: [["Jouer à Public ou privé", "#borne-pp"]] }
      ] },
    { t: "Monnaies, dette et crises", st: "Ce qui fait l’actualité", i: "p-banque-centrale",
      p: "Banques centrales, change, inflation, dette en devises : la salle qui explique les journaux.",
      e: [
        { k: "o", d: "1945", l: "Afrique de l’Ouest et centrale", t: "Naissance du franc CFA", i: "p-cfa",
          p: "Le 26 décembre 1945. Aujourd’hui, deux monnaies distinctes : celle de la BCEAO pour huit pays d’Afrique de l’Ouest, celle de la BEAC pour six pays d’Afrique centrale." },
        { k: "o", d: "1959", l: "Dakar", t: "La BCEAO", i: "s5-banques",
          p: "La banque centrale commune des États d’Afrique de l’Ouest. Sa mission première : garder la valeur de la monnaie, en visant une inflation entre 1 et 3 % par an." },
        { k: "o", d: "Années 1980", l: "Le continent", t: "La dette et l’ajustement", i: "p-reguler",
          p: "Prix des matières premières en baisse, dettes en devises qui pèsent : beaucoup d’États réduisent leurs dépenses, privatisent et réforment, avec des effets durs sur les salaires et les services." },
        { k: "o", d: "1994", l: "Zone franc", t: "La dévaluation", i: "p-inflation",
          p: "Le 12 janvier, le franc CFA perd la moitié de sa valeur face au franc français. Les produits importés coûtent soudain deux fois plus cher : <b>le même panier se vide</b>." },
        { k: "d", t: "À vous : s’endetter jusqu’où ?", p: "Six mois du budget de Mariam. Chaque mois, une décision : moto à crédit, prêt facile, rentrée scolaire.",
          a: [["Jouer à S’endetter jusqu’où", "#borne-dette"]] }
      ] },
    { t: "L’économie qui fait vivre les familles", st: "Marchés, tontines, diaspora", i: "p-confiance",
      p: "Le cœur de l’économie africaine bat au marché, dans la tontine et dans les transferts de la famille.",
      e: [
        { k: "f", ini: "NB", i: "h-nana-benz", h: 1, nom: "Les Nana Benz", d: "Années 1960–1970", l: "Lomé", role: "Commerçantes de pagnes wax",
          p: "Des femmes du grand marché de Lomé bâtissent de véritables maisons de commerce. Si prospères qu’on les surnomme d’après leurs Mercedes-Benz, elles font crédit, financent et forment toute une génération de revendeuses." },
        { k: "o", d: "Chez nous", l: "Le cercle de confiance", t: "La tontine", i: "cap-fokam",
          p: "Elle peut lisser les dépenses, financer un projet ou constituer une réserve : tout dépend de ses règles. Elle tient, comme la monnaie, sur la confiance du groupe." },
        { k: "o", d: "Chaque soir", l: "Au marché", t: "Séparer les poches", i: "p-informel",
          p: "Revenus irréguliers, argent de la maison mêlé à celui de l’activité : un simple cahier de recettes change tout. Et le travail fait à la maison, lui, n’est compté nulle part." },
        { k: "o", d: "Chaque mois", l: "Paris, Montréal, Abidjan", t: "La diaspora", i: "s3-acteurs",
          p: "Les transferts des parents installés à l’étranger pèsent lourd dans le revenu de nombreuses familles. Bien utilisés, ils construisent ; mal organisés, ils s’évaporent." },
        { k: "d", t: "À vous : votre tontine", p: "Comment elle marche, ce qu’elle rapporte, et comment en garder une part.",
          a: [["Comprendre la tontine", "tontine.html?src=musee"], ["Ce que vaut votre temps", "#borne-temps"]] }
      ] },
    { t: "Transformer sur place", st: "Où se crée la valeur ?", i: "s6-croissance",
      p: "Posséder une ressource ne suffit pas : la valeur se crée surtout en la transformant.",
      e: [
        { k: "o", d: "Aujourd’hui", l: "Côte d’Ivoire et Ghana", t: "La fève et la tablette", i: "p-cacao",
          p: "Les deux pays produisent ensemble plus de la moitié du cacao mondial. Mais l’essentiel du prix d’une tablette se crée après la fève : broyage, chocolaterie, marque, distribution." },
        { k: "o", d: "Pour réussir", l: "L’atelier, l’usine", t: "Transformer exige", i: "p-entreprise",
          p: "Des compétences, de l’énergie, des machines, des clients et un prix compétitif. Et le prix de vente n’est pas le bénéfice : il faut d’abord payer tout le reste." },
        { k: "d", t: "À vous : l’entrepreneur stratège", p: "Six semaines face à un concurrent : baisser les prix ou améliorer la qualité ?",
          a: [["Jouer à L’entrepreneur stratège", "#borne-strat"]] }
      ] },
    { t: "Les bâtisseurs", st: "Leurs équipes et leurs institutions", i: "cap-elumelu",
      p: "Derrière chaque grande entreprise : un besoin, un premier financement, des salariés, des fournisseurs, des règles.",
      e: [
        { k: "f", ini: "KD", nom: "Koné Dossongui", d: "1978", l: "Abidjan", role: "Banquier et industriel ivoirien",
          p: "Il prend 1 % du capital de ce qui deviendra la Banque Atlantique, puis bâtit un groupe de la banque aux mines.",
          q: "« Si tu t’y mets, les 1 % deviennent 90 %. » — Entretien avec Forbes Afrique, 2026" },
        { k: "o", d: "Douze parcours", l: "De Lagos à Addis-Abeba", t: "Les capitaines d’industrie", i: "cap-dangote",
          p: "Dangote, Elumelu, Dossongui, Mwangi, Masiyiwa, Alemu… Leur pensée, ce qu’ils ont apporté, et ce qu’on en retient pour son argent : des modèles et des parcours dont on peut s’inspirer." },
        { k: "d", t: "À vous : leurs parcours", p: "Douze portraits dans la bibliothèque EFA.",
          a: [["Voir les capitaines d’industrie", "bibliotheque.html?src=musee#capitaines"]] }
      ] },
    { t: "Le téléphone, outil économique", st: "Payer, envoyer, épargner", i: "cap-masiyiwa",
      p: "Réseaux, agents, paiements : en vingt ans, le téléphone est devenu une banque de poche.",
      e: [
        { k: "o", d: "2007", l: "Kenya", t: "Le téléphone devient un porte-monnaie", i: "cap-ibrahim",
          p: "Le mobile money se lance au Kenya en mars 2007, puis gagne le continent. Un solde sur un téléphone est, lui aussi, de la monnaie." },
        { k: "o", d: "Chaque jour", l: "Dans votre poche", t: "Frais, agents, fraudes", i: "cap-mwangi",
          p: "Chaque transfert passe par un expéditeur, un réseau, un agent et un bénéficiaire. À chaque étape : un frais possible, un risque possible." },
        { k: "d", t: "À vous : votre budget mobile", p: "Combien vous coûtent vraiment vos transferts, et comment éviter les arnaques.",
          a: [["Budget et mobile money", "budget-mobile-money.html?src=musee"]] }
      ] },
    { t: "De l’épargne au capital", st: "Comment financer une grande entreprise ?", i: "p-financiers",
      p: "Autofinancement, prêt, obligation, action : quatre façons de financer, quatre façons de partager le risque.",
      e: [
        { k: "o", d: "1998", l: "Abidjan", t: "La BRVM ouvre", i: "p-esperance",
          p: "La Bourse régionale des huit pays de l’UEMOA. Chacun peut devenir copropriétaire d’entreprises de la région, et recevoir une part de leurs bénéfices." },
        { k: "o", d: "La différence clé", l: "Marché primaire, marché secondaire", t: "Qui reçoit votre argent ?", i: "musee-coffret",
          p: "Acheter une action <b>nouvellement émise</b> finance l’entreprise. Acheter une action <b>existante</b> paie celui qui la vend. Dividende, plus-value, perte : l’actionnaire partage le risque." },
        { k: "d", t: "À vous : dans la peau d’un banquier", p: "Huit demandes de prêt, 100 millions de fonds propres : financer sans mettre la banque en danger.",
          a: [["Jouer au banquier", "#borne-banquier"], ["Suis-je prêt à investir ?", "bourse-essentiel.html?src=musee#A1"]] }
      ] },
    { t: "Dangote, du projet industriel à l’ouverture du capital", st: "La grande étude de cas", i: "cap-dangote",
      p: "Une raffinerie pour arrêter d’importer l’essence, puis des actions proposées au public : toute la balade en un cas.",
      e: [
        { k: "o", d: "2010", l: "Lagos", t: "Le ciment entre en Bourse", i: "p-entreprise",
          p: "Dangote Cement est cotée à la Bourse de Lagos depuis 2010. Le groupe a d’abord grandi en produisant au Nigeria ce que le pays importait." },
        { k: "o", d: "2023", l: "Lekki, Lagos", t: "La raffinerie démarre", i: "p-externalite",
          p: "Une raffinerie prévue pour 650 000 barils par jour. Ses résultats dépendent du prix du pétrole brut, de l’énergie, de la maintenance et de ses clients." },
        { k: "o", d: "14 sept.–27 oct. 2026", l: "Lagos", t: "L’offre au public", i: "p-esperance",
          p: "4,1 milliards d’actions proposées à 525 nairas, soit environ 2 150 milliards de nairas si tout est souscrit. L’offre, prolongée de deux semaines, a fermé le 27 octobre. Au 28 octobre, l’attribution et la cotation restent à venir.",
          q: "Le prix d’une action n’est pas la valeur de toute l’entreprise. Aucun rendement n’est garanti." },
        { k: "d", t: "La question de sortie", p: "Que change le fait que davantage d’Africains puissent posséder une part des entreprises qui transforment leur continent ?",
          a: [["Suivre l’actualité dans EFA News", "news.html?src=musee"]] }
      ] }
  ];
  var ACCUEIL = { t: "Le musée de l’économie", i: "h-accueil",
    p: "Qui crée la richesse en Afrique, qui la finance, et qui en garde la valeur ? Douze salles, de la vallée du Nil à la Bourse de Lagos." };
  var SORTIE = { d: "Et demain ?", l: "Le continent", t: "Du cercle à la spirale", i: "p-confiance",
    p: "Commerce continental, ouvert depuis janvier 2021 avec la ZLECAf, énergie, villes, emploi : la salle suivante reste à écrire." };

  /* ---------- la liste des étapes ---------- */
  var E = [{ k: "a", s: -1 }];
  SALLES.forEach(function (S, si) { E.push({ k: "s", s: si }); S.e.forEach(function (x) { x.s = si; E.push(x); }); });
  E.push({ k: "z", s: SALLES.length });

  var M, SC, cur = 0, vus = {}, au = null, son = true, avant = null, dejaIndice = false;
  function esc(t) { return String(t == null ? "" : t).replace(/ ([?!:;»%])/g, "\u00a0$1").replace(/« /g, "«\u00a0").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function nb(t) { return String(t).replace(/ ([?!:;»%])/g, "\u00a0$1"); }
  function img(n) { return n ? "illus/" + n + ".webp" + V : ""; }
  function compte(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function cadre(n, port, h) { return '<div class="mu-cadre' + (port ? " port" : "") + '"><img src="' + img(n) + '" alt="" decoding="async">' + (h ? '<span class="mu-recon">Reconstitution illustrative, réalisée avec l’aide de l’IA</span>' : '') + '</div>'; }
  function actions(a) { return a ? '<div class="mu-act">' + a.map(function (x, j) { return '<a href="' + x[1] + '"' + (j ? ' class="l"' : "") + ' data-mu-lien>' + esc(x[0]) + "</a>"; }).join("") + "</div>" : ""; }
  function q(x) { return x ? '<p class="mu-q"><small>À méditer</small>' + esc(x) + "</p>" : ""; }

  function etapeHtml(x) {
    if (x.k === "a") return '<div class="mu-etape s">' + cadre(ACCUEIL.i) + '<div class="mu-txt"><p class="mu-lieu" style="background:#DA3C1B">Musée EFA · 12 salles</p><h2>' + esc(ACCUEIL.t) + "</h2><p>" + esc(ACCUEIL.p) + '</p><p style="font-size:15px">Touchez le <b>bord droit</b> pour avancer, le <b>bord gauche</b> pour revenir, ou ouvrez le <b>plan</b> en haut.</p><p style="font-size:14px">Une idée de Pacôme Kipré, dit Peck Peckisblackman.</p></div></div>';
    if (x.k === "z") {
      var t = SALLES.map(function (S, i) { return '<i class="' + (vus[i] ? "ok" : "") + '" title="' + esc(S.t) + '">' + (i + 1) + "</i>"; }).join("");
      return '<div class="mu-etape z">' + cadre(SORTIE.i) + '<div class="mu-txt"><div class="mu-date">' + esc(SORTIE.d) + '</div><span class="mu-lieu">📍 ' + esc(SORTIE.l) + "</span><h2>" + esc(SORTIE.t) + "</h2><p>" + esc(SORTIE.p) + '</p><p class="mu-q"><small>Votre passeport du musée</small><span class="mu-tampons" id="mu-tampons">' + t + '</span></p><div class="mu-act"><button type="button" data-mu-salles>Entrer dans les six salles de la balade</button><button type="button" class="l" data-mu-debut>Revoir le musée</button></div><p style="font-size:13.5px">Une idée de Pacôme Kipré, dit Peck Peckisblackman. Merci à lui. Offre Dangote : annonces publiques de septembre et octobre 2026.</p></div></div>';
    }
    var S = SALLES[x.s];
    if (x.k === "s") return '<div class="mu-etape s">' + (S.sombre ? "" : cadre(S.i)) + '<div class="mu-txt"' + (S.sombre ? ' style="align-self:center"' : "") + '><span class="mu-num">' + (x.s + 1) + '</span><h2>' + esc(S.t) + '</h2><span class="mu-role" style="font-size:16px">' + esc(S.st) + "</span><p>" + esc(S.p) + "</p></div></div>";
    if (x.k === "f") return '<div class="mu-etape f' + (x.i ? ' fi' : '') + '">' + (x.i ? cadre(x.i, 0, x.h) : '<div class="mu-med" aria-hidden="true"><span>' + esc(x.ini) + "</span><em>" + esc(x.d) + '</em></div>') + '<div class="mu-txt">' + (x.i ? '<div class="mu-date">' + esc(x.d) + '</div>' : '') + '<span class="mu-lieu">📍 ' + esc(x.l) + "</span><h2>" + esc(x.nom) + '</h2><span class="mu-role">' + esc(x.role) + "</span><p>" + nb(x.p) + "</p>" + q(x.q) + "</div></div>";
    if (x.k === "n") return '<div class="mu-etape n"><div class="mu-txt"><div class="mu-date">' + esc(x.d) + '</div><span class="mu-lieu">📍 ' + esc(x.l) + "</span><h2>" + esc(x.t) + "</h2><p>" + x.p + "</p></div></div>";
    if (x.k === "d") return '<div class="mu-etape s dz"><div class="mu-txt" style="align-self:center"><span class="mu-num" style="width:auto;padding:0 18px;border-radius:999px;font:800 13px/40px Source Sans\\ 3,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;height:40px">À vous de décider</span><h2>' + esc(x.t) + "</h2><p>" + esc(x.p) + "</p>" + actions(x.a) + "</div></div>";
    return '<div class="mu-etape">' + cadre(x.i, x.port, x.h) + '<div class="mu-txt"><div class="mu-date">' + esc(x.d) + '</div><span class="mu-lieu">📍 ' + esc(x.l) + "</span><h2>" + esc(x.t) + "</h2><p>" + nb(x.p) + "</p>" + q(x.q) + "</div></div>";
  }

  function construire() {
    M = document.createElement("div"); M.id = "musee"; M.hidden = true;
    M.setAttribute("role", "dialog"); M.setAttribute("aria-modal", "true"); M.setAttribute("aria-label", "Le musée de l’économie EFA");
    M.innerHTML = '<div class="mu-haut"><div class="mu-prog" id="mu-prog">' + SALLES.map(function () { return "<i><b></b></i>"; }).join("") + '</div>'
      + '<div class="mu-barre"><span class="mu-salle" id="mu-salle"></span><div class="mu-cmd"><button type="button" id="mu-plan-b" aria-label="Plan du musée">☰<span class="t"> Plan</span></button><button type="button" id="mu-son" aria-pressed="true">♪</button><button type="button" id="mu-x" aria-label="Fermer le musée">✕</button></div></div></div>'
      + '<div class="mu-scene" id="mu-scene" aria-live="polite"><button type="button" class="mu-bord g" id="mu-g" aria-label="Étape précédente"></button><button type="button" class="mu-bord d" id="mu-d" aria-label="Étape suivante"></button><span class="mu-indice" id="mu-indice">Touchez les bords pour avancer ou revenir</span></div>'
      + '<div class="mu-bas"><button type="button" class="mu-prec" id="mu-prec" aria-label="Revenir">‹</button><button type="button" class="mu-passe" id="mu-passe">Passer la salle »</button><button type="button" class="mu-suiv" id="mu-suiv">Suivant ›</button></div>'
      + '<div class="mu-plan" id="mu-plan" hidden><div class="mu-plan-t"><h2 style="font-size:24px">Le plan du musée</h2><button type="button" class="mu-prec" id="mu-plan-x" aria-label="Fermer le plan" style="min-height:44px;border-radius:999px;border:0;background:rgba(255,255,255,.12);color:#fff;font:800 14px Source Sans\\ 3,sans-serif;padding:0 14px">✕</button></div><ol id="mu-plan-l"></ol></div>';
    document.body.appendChild(M);
    SC = document.getElementById("mu-scene");
    var h = ""; E.forEach(function (x, k) { h += etapeHtml(x).replace('<div class="mu-etape', '<div data-k="' + k + '" class="mu-etape'); });
    SC.insertAdjacentHTML("beforeend", h);
    // le cadre prend la proportion exacte de son image : rien n’est rogné, pas de bandes
    SC.querySelectorAll(".mu-cadre img").forEach(function (im) { var f = function () { if (im.naturalWidth) { var c = im.parentNode, r = im.naturalWidth / im.naturalHeight; c.style.aspectRatio = im.naturalWidth + " / " + im.naturalHeight; if (!c.classList.contains("port")) c.style.width = "min(100%, calc(46svh * " + r.toFixed(3) + "), 980px)"; } }; if (im.complete) f(); else im.addEventListener("load", f); });
    // le plan
    document.getElementById("mu-plan-l").innerHTML = SALLES.map(function (S, i) { return '<li data-s="' + i + '"><i>' + (i + 1) + '</i><button type="button" class="go" data-s="' + i + '"><b>' + esc(S.t) + "</b><small>" + esc(S.st) + " · " + S.e.length + " étapes</small></button></li>"; }).join("");
    // commandes
    var $ = function (id) { return document.getElementById(id); };
    $("mu-g").onclick = function () { aller(cur - 1); }; $("mu-d").onclick = function () { aller(cur + 1); };
    $("mu-prec").onclick = function () { aller(cur - 1); }; $("mu-suiv").onclick = function () { if (cur === E.length - 1) fermer(); else aller(cur + 1); };
    $("mu-passe").onclick = function () { var s = E[cur].s; for (var k = cur + 1; k < E.length; k++) if (E[k].k === "s" || E[k].k === "z") { aller(k); return; } };
    $("mu-x").onclick = function () { fermer(); };
    $("mu-plan-b").onclick = function () { majPlan(); $("mu-plan").hidden = false; $("mu-plan-x").focus(); };
    $("mu-plan-x").onclick = function () { $("mu-plan").hidden = true; };
    $("mu-plan-l").onclick = function (e) { var b = e.target.closest("button.go"); if (!b) return; $("mu-plan").hidden = true; var s = +b.dataset.s; for (var k = 0; k < E.length; k++) if (E[k].k === "s" && E[k].s === s) { aller(k); return; } };
    try { son = localStorage.getItem("efa_musee_son") !== "0"; } catch (e) {}
    majSon();
    $("mu-son").onclick = function () { son = !son; try { localStorage.setItem("efa_musee_son", son ? "1" : "0"); } catch (e) {} majSon(); if (son) jouer(); else if (au) au.pause(); };
    SC.addEventListener("click", function (e) {
      var a = e.target.closest("[data-mu-lien]"), sa = e.target.closest("[data-mu-salles]"), de = e.target.closest("[data-mu-debut]");
      if (de) { aller(0); return; }
      if (sa) { fermer(); setTimeout(function () { var x = document.getElementById("echanger"); if (x) x.scrollIntoView({ behavior: "smooth" }); }, 60); return; }
      if (a) { var hr = a.getAttribute("href"); compte("musee-lien-" + hr.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)); if (hr.charAt(0) === "#") { e.preventDefault(); fermer(); setTimeout(function () { var x = document.querySelector(hr); if (x) x.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); } else if (au) au.pause(); }
    });
    // glisser : à gauche ou vers le haut pour avancer
    var x0 = null, y0 = null;
    SC.addEventListener("touchstart", function (e) { var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
    SC.addEventListener("touchend", function (e) { if (x0 == null) return; var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
      if (e.target.closest(".mu-txt") && Math.abs(dy) > Math.abs(dx)) return; // le texte défile
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return;
      if (Math.abs(dx) > Math.abs(dy)) aller(cur + (dx < 0 ? 1 : -1)); else aller(cur + (dy < 0 ? 1 : -1)); }, { passive: true });
    document.addEventListener("keydown", function (e) {
      if (M.hidden) return;
      if (e.key === "Escape") { if (!$("mu-plan").hidden) $("mu-plan").hidden = true; else fermer(); }
      else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); aller(cur + 1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); aller(cur - 1); }
    });
    window.addEventListener("popstate", function () { if (!M.hidden && location.hash !== "#musee") fermer(true); });
  }
  function majSon() { var b = document.getElementById("mu-son"); b.innerHTML = son ? "♪<span class=\"t\"> Son</span>" : "<s>♪</s><span class=\"t\"> Muet</span>"; b.setAttribute("aria-pressed", son); b.setAttribute("aria-label", son ? "Couper la musique" : "Remettre la musique"); }
  function jouer() { if (!son) return; try { if (!au) { au = new Audio("demo-musique.mp3"); au.loop = true; au.volume = 0.5; } var p = au.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  function majPlan() { document.querySelectorAll("#mu-plan-l li").forEach(function (li) { var s = +li.dataset.s; li.classList.toggle("ok", !!vus[s]); li.classList.toggle("c", E[cur].s === s); }); }
  function aller(k) {
    if (k < 0 || k >= E.length) return;
    var prec = cur; cur = k;
    SC.querySelectorAll(".mu-etape").forEach(function (el) { var j = +el.dataset.k; el.classList.toggle("ici", j === k); el.classList.toggle("avant", j < k); el.setAttribute("aria-hidden", j === k ? "false" : "true"); if (j === k) { var t = el.querySelector(".mu-txt"); if (t) t.scrollTop = 0; } });
    var x = E[k], s = x.s;
    if (s >= 0 && s < SALLES.length) { vus[s] = 1; try { localStorage.setItem("efa_musee_vus", JSON.stringify(vus)); } catch (e) {} }
    // progression : une barre par salle, remplie selon l'étape
    document.querySelectorAll("#mu-prog i").forEach(function (b, i) {
      var w = 0; if (i < s || x.k === "z") w = 100; else if (i === s) { var tot = SALLES[i].e.length + 1, pos = x.k === "s" ? 1 : SALLES[i].e.indexOf(x) + 2; w = Math.round(100 * pos / tot); }
      b.firstChild.style.width = w + "%"; b.classList.toggle("c", i === s);
    });
    document.getElementById("mu-salle").innerHTML = x.k === "a" ? "<b>Bienvenue</b> · Musée de l’économie" : x.k === "z" ? "<b>Sortie</b> · Votre passeport" : "<b>Salle " + (s + 1) + "/12</b> · " + esc(SALLES[s].t);
    document.getElementById("mu-prec").disabled = k === 0;
    document.getElementById("mu-suiv").textContent = k === E.length - 1 ? "Terminer ✓" : k === 0 ? "Commencer la visite ›" : "Suivant ›";
    document.getElementById("mu-passe").style.visibility = (x.k === "a" || x.k === "z" || s === SALLES.length - 1 && x.k !== "s" && false) ? "hidden" : "visible";
    if (x.k === "z") { var tp = document.getElementById("mu-tampons"); if (tp) tp.innerHTML = SALLES.map(function (S, i) { return '<i class="' + (vus[i] ? "ok" : "") + '" title="' + esc(S.t) + '">' + (i + 1) + "</i>"; }).join(""); compte("musee-fin"); }
    if (k > 0 && !dejaIndice) { dejaIndice = true; var ind = document.getElementById("mu-indice"); if (ind) ind.style.opacity = 0; }
    // précharger l'image suivante
    var nx = E[k + 1]; if (nx && (nx.i || (nx.k === "s" && SALLES[nx.s] && SALLES[nx.s].i))) { var im = new Image(); im.src = img(nx.i || SALLES[nx.s].i); }
  }
  function ouvrir(depuis) {
    if (!M) construire();
    try { vus = JSON.parse(localStorage.getItem("efa_musee_vus") || "{}") || {}; } catch (e) { vus = {}; }
    avant = document.activeElement; M.hidden = false; document.documentElement.classList.add("musee-ouvert");
    aller(0); jouer();
    if (location.hash !== "#musee") history.pushState({ musee: 1 }, "", location.pathname + location.search + "#musee");
    M.setAttribute("tabindex", "-1"); try { M.focus({ preventScroll: true }); } catch (e) {}
    compte("balade-musee-ouvert-" + (depuis || "lien"));
  }
  function fermer(retour) {
    if (!M) return; M.hidden = true; document.documentElement.classList.remove("musee-ouvert"); if (au) au.pause();
    if (!retour && location.hash === "#musee") history.replaceState(null, "", location.pathname + location.search);
    if (avant && avant.focus) try { avant.focus({ preventScroll: true }); } catch (e) {}
  }
  window.EFA_MUSEE = ouvrir;
  function init() {
    document.querySelectorAll("[data-musee]").forEach(function (b) { b.addEventListener("click", function () { ouvrir(b.dataset.musee); }); });
    var flot = document.getElementById("musee-flot"), ref = document.querySelector(".btn-musee");
    if (flot) { flot.addEventListener("click", function () { ouvrir("flottant"); }); if ("IntersectionObserver" in window && ref) new IntersectionObserver(function (es) { flot.classList.toggle("vu", !es[0].isIntersecting); }).observe(ref); }
    if (location.hash === "#musee") setTimeout(function () { ouvrir("lien-direct"); }, 60);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
