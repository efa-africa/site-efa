/* Le musée de l'économie EFA · visite en format statut (v2, 28/10/2026)
   Fil conducteur : qui crée la richesse en Afrique, qui la finance, et qui en garde la valeur ?
   Douze salles, dans l’ordre du temps. Aucun appel à l’action pendant la visite : jeux, leçons, quiz et avis viennent à la sortie. Idées reformulées ; seule citation : Koné Dossongui, sourcée.
   Pour ajouter une étape : copier un bloc { … } dans la bonne salle. Types : o (objet), f (personnage), n (salle sombre, sans image), d (décision). */
(function () {
  var V = "?v=2810";
  /* Douze salles, dans l'ordre du temps. y = année (pour « il y a … ans ») ; c = le chiffre clé de l'étape.
     a = les prolongements de la salle, proposés seulement à la sortie (jamais pendant la visite). */
  var SALLES = [
    { t: "Produire, compter, conserver", per: "−8500 → −3300", i: "h-nil", h: 1,
      p: "Toute économie commence par se nourrir, organiser le travail et garder des réserves pour la mauvaise saison.",
      a: [["Où garder sa réserve", "ou-garder-sa-reserve.html?src=musee"], ["Jouer à Troc ou monnaie", "#borne-troc"]],
      e: [
        { k: "o", d: "−8500", y: -8500, l: "Vallée du Nil, Croissant fertile", t: "On produit plus qu’on ne mange", i: "h-surplus", h: 1,
          c: ["1", "surplus : la première richesse"],
          p: "Avec l’agriculture et l’élevage apparaît le <b>surplus</b> : ce qui n’est pas consommé peut se garder, se partager ou s’échanger." },
        { k: "o", d: "Depuis le Néolithique", l: "Sahel, greniers de mil", t: "Conserver entre deux récoltes", i: "h-grenier", h: 1,
          c: ["12", "mois à tenir entre deux récoltes"],
          p: "Le grenier est la première assurance : il protège la famille contre une mauvaise année. Garder, c’est déjà épargner." },
        { k: "o", d: "Partout, depuis toujours", l: "Une idée reçue", t: "Pas forcément le troc d’abord", i: "h-credit", h: 2,
          p: "Les historiens le rappellent : crédit, dons, monnaies et échanges ont souvent coexisté. Ce qui fait la monnaie, ce n’est pas l’objet, c’est <b>la confiance</b>." },
        { k: "o", d: "−3300", y: -3300, l: "Mésopotamie", t: "Écrire qui doit quoi à qui", i: "h-tablettes", h: 1,
          c: ["1re", "comptabilité écrite connue"],
          p: "Sur des tablettes d’argile, les scribes notent récoltes, dettes et paiements. La comptabilité naît avec les premières villes.",
          q: "Des milliers d’années plus tard, le registre d’une succursale de banque fait exactement la même chose." }
      ] },
    { t: "Routes lointaines et premières pièces", per: "−1470 → −600", i: "h-routes", h: 1,
      p: "Le commerce relie très tôt la mer Rouge, la Méditerranée et l’intérieur du continent, de l’Égypte à Carthage. Puis le métal devient monnaie.",
      a: [["Jouer au Vrai ou faux sur la monnaie", "#borne-vf"]],
      e: [
        { k: "f", ini: "H", i: "h-hatchepsout", h: 1, nom: "Hatchepsout", d: "Vers −1470", y: -1470, l: "Égypte", role: "Reine-pharaon",
          p: "Elle envoie une expédition au pays de Pount, au sud de la mer Rouge, chercher encens, ébène et or. Les reliefs de son temple racontent ce voyage : l’un des plus anciens récits de commerce lointain." },
        { k: "o", d: "Vers −814", l: "Carthage, Tunisie actuelle", t: "Carthage, le grand comptoir", i: "h-carthage", h: 1,
          p: "Fondée selon la tradition par des marchands phéniciens, Carthage devient une puissance commerçante de la Méditerranée. Ses navires relient l’Afrique du Nord, la Sicile et l’Espagne, et ses caravanes vont vers l’intérieur du continent. Elle frappera plus tard ses propres pièces.",
          q: "Une ville peut devenir riche sans grandes terres : en organisant les échanges des autres." },
        { k: "o", d: "−600", y: -600, l: "Lydie", t: "Les premières pièces", i: "h-lydie", h: 1,
          c: ["1", "poids garanti par une autorité"],
          p: "Un morceau de métal au poids garanti par une autorité. Plus besoin de peser l’or à chaque achat : on compte." }
      ] },
    { t: "L’or du Sahel", per: "1324 → XVIe siècle", i: "h-monnaie", h: 2,
      p: "Pendant des siècles, l’or ouest-africain et le sel du désert font tourner le commerce entre le Sahel et la Méditerranée.",
      a: [["Jouer à L’entrepreneur stratège", "#borne-strat"]],
      e: [
        { k: "f", ini: "MM", i: "h-mansa-moussa", h: 1, nom: "Mansa Moussa", d: "1324", y: 1324, l: "Empire du Mali", role: "Empereur du Mali",
          p: "En route vers La Mecque, il dépense et distribue tant d’or au Caire que, selon les chroniqueurs, son cours y baisse pendant des années. <b>Trop d’or d’un coup, et l’or vaut moins</b> : c’est déjà de l’inflation." },
        { k: "f", ini: "IB", i: "h-ibn-battuta", h: 1, nom: "Ibn Battuta", d: "1352", y: 1352, l: "Empire du Mali", role: "Voyageur, né à Tanger",
          p: "Il traverse le Sahara et décrit les marchés du Mali, où l’on paie avec des cauris, ces coquillages venus de l’océan Indien : rares, solides, impossibles à contrefaire." },
        { k: "f", ini: "IK", i: "h-ibn-khaldoun", h: 2, nom: "Ibn Khaldoun", d: "1377", y: 1377, l: "Tunis, puis Le Caire", role: "Historien et penseur, né à Tunis",
          p: "Dans sa <i>Muqaddima</i>, il observe que des impôts modérés encouragent le travail et le commerce, alors que des impôts trop lourds les découragent : <b>à trop prélever, l’État finit par recevoir moins</b>. Une idée que les économistes discutent encore. On ne connaît aucun portrait d’époque d’Ibn Khaldoun&nbsp;: l’image est une évocation." },
        { k: "o", d: "XIIIe–XVIe s.", l: "Tombouctou, Gao, Djenné", t: "Or contre sel", i: "h-or-sel", h: 1,
          c: ["≈ 2 000 km", "de Sahara entre l’or et le sel"],
          p: "Les caravanes traversent le désert : l’or et les tissus d’un côté, le sel de l’autre. Chaque étape a ses péages, ses risques et ses intermédiaires : <b>le prix d’arrivée n’est pas le prix de départ</b>." }
      ] },
    { t: "Les traites esclavagistes", per: "VIIe → XIXe siècle", i: "", sombre: 1,
      p: "Une salle à part. On y parle d’économie, mais d’abord des femmes et des hommes qui en ont été les victimes.",
      a: [],
      e: [
        { k: "n", d: "VIIe → XIXe siècle", l: "Trois routes, treize siècles", t: "Des millions de vies arrachées",
          p: "Par le Sahara, par l’océan Indien, puis par l’Atlantique, des millions de femmes et d’hommes ont été capturés, déportés et vendus. Une tragédie humaine d’abord, qui a aussi privé des régions entières de leurs forces vives pendant des siècles." },
        { k: "o", d: "VIIe → XIXe s.", l: "Sahara", t: "La traite transsaharienne", i: "h-traite-sahara", h: 1,
          c: ["13 siècles", "de caravanes vers le nord"],
          p: "Des captifs, attachés les uns aux autres, traversent le désert à pied avec les caravanes, vers l’Afrique du Nord et le Proche-Orient. Les historiens en estiment les victimes à plusieurs millions." },
        { k: "o", d: "VIIe → XIXe s.", l: "Côte orientale, océan Indien", t: "La traite de l’océan Indien", i: "h-traite-ocean-indien", h: 1,
          c: ["3 continents", "Afrique, Arabie, Asie"],
          p: "Depuis les ports de la côte orientale, des captifs sont embarqués vers l’Arabie, le golfe Persique et l’Inde, puis vers les plantations des îles de l’océan Indien." },
        { k: "o", d: "XVe → XIXe s.", l: "Golfe de Guinée, Atlantique", t: "La traite atlantique", i: "h-traite-atlantique", h: 1,
          c: ["≈ 12,5 millions", "de personnes embarquées vers les Amériques"],
          p: "Depuis les forts de la côte, des captifs enchaînés sont embarqués vers les plantations des Amériques. Selon les recensements des historiens des navires négriers, environ 12,5 millions de personnes ont été embarquées, et près de 2 millions sont mortes pendant la traversée.",
          q: "Une économie peut produire beaucoup de richesse et détruire des vies en même temps. Toute question d’argent est aussi une question de dignité." }
      ] },
    { t: "Les économies coloniales", per: "1880 → 1945", i: "",
      p: "Mines, plantations, ports : l’économie est organisée pour exporter. Les Africains résistent, s’adaptent, inventent.",
      a: [],
      e: [
        { k: "o", d: "Fin XIXe → XXe s.", l: "Mines, plantations, ports", t: "Le rail va au port", i: "h-rail-port", h: 1,
          c: ["1 sens", "de la mine vers le port"],
          p: "Travail forcé, impôt par tête, cultures imposées : beaucoup de voies ferrées relient les mines et les plantations aux ports, plutôt que les villes africaines entre elles.",
          q: "Une infrastructure peut développer la production et organiser l’extraction en même temps. Qui choisit le tracé, et qui en profite ?" },
        { k: "f", ini: "FA", i: "h-femmes-aba", h: 1, nom: "Les femmes d’Aba", d: "1929", y: 1929, l: "Sud-Est du Nigeria", role: "Une résistance économique",
          p: "Des milliers de femmes se soulèvent contre un impôt colonial qu’elles jugent injuste et contre les chefs nommés par l’administration. L’une des grandes résistances de l’époque coloniale." },
        { k: "o", d: "26 décembre 1945", y: 1945, l: "Afrique de l’Ouest et centrale", t: "Naissance du franc CFA", i: "h-cfa-1945", h: 2,
          c: ["2", "monnaies aujourd’hui : BCEAO et BEAC"],
          p: "Aujourd’hui, deux monnaies distinctes : celle de la BCEAO pour huit pays d’Afrique de l’Ouest, celle de la BEAC pour six pays d’Afrique centrale, toutes deux liées à l’euro : <b>1 € = 655,957 F</b>." }
      ] },
    { t: "Les indépendances", per: "1956 → 1960", i: "h-independances", h: 2,
      p: "Un pays neuf doit tout choisir à la fois, avec un budget limité, dans un monde où le commerce s’accélère.",
      a: [["Jouer à Public ou privé", "#borne-pp"]],
      e: [
        { k: "o", d: "1956", y: 1956, l: "États-Unis, puis le monde", t: "La boîte qui change le commerce", i: "h-conteneur-1956", h: 1,
          c: ["× 6", "le commerce par la mer entre 1965 et 2015"],
          p: "Le conteneur passe du camion au train et au bateau sans être déchargé. Les coûts chutent, les volumes explosent : Abidjan, Lomé, Tema et Dakar deviennent des portes du monde." },
        { k: "o", d: "1959", y: 1959, l: "Dakar", t: "La BCEAO", i: "h-bceao", h: 2,
          c: ["1 à 3 %", "d’inflation visée chaque année"],
          p: "La banque centrale commune des États d’Afrique de l’Ouest. Sa mission première : garder la valeur de la monnaie." },
        { k: "o", d: "1960", y: 1960, l: "Afrique", t: "L’année des indépendances", i: "h-1960", h: 2,
          c: ["17", "pays indépendants en une seule année"],
          p: "Écoles ou routes ? Usines ou importations ? Entreprises publiques, privées ou coopératives ? Chaque pays trace sa trajectoire, avec ses réussites et ses difficultés." },
        { k: "o", d: "Depuis", l: "Le budget de l’État", t: "Prélever pour investir", i: "h-investir", h: 2,
          p: "Impôts, taxes, emprunts : l’argent public devient route, école, centre de santé. Et la dette d’aujourd’hui se rembourse avec les impôts de demain." }
      ] },
    { t: "Marchés et familles", per: "Années 1960 → aujourd’hui", i: "h-famille", h: 2,
      p: "Le cœur de l’économie africaine bat au marché, dans la tontine et dans les transferts de la famille.",
      a: [["Comprendre la tontine", "tontine.html?src=musee"], ["Séparer les poches", "separer-les-poches.html?src=musee"], ["Ce que vaut votre temps", "#borne-temps"]],
      e: [
        { k: "f", ini: "NB", i: "h-nana-benz", h: 1, nom: "Les Nana Benz", d: "Années 1960–1970", l: "Lomé", role: "Commerçantes de pagnes wax",
          p: "Des femmes du grand marché de Lomé bâtissent de véritables maisons de commerce. Si prospères qu’on les surnomme d’après leurs Mercedes-Benz, elles font crédit, financent et forment toute une génération de revendeuses." },
        { k: "o", d: "Chaque mois", l: "Le cercle de confiance", t: "La tontine", i: "h-tontine", h: 2,
          c: ["n × cotisation", "ce que chacun reçoit à son tour"],
          p: "Elle peut lisser les dépenses, financer un projet ou constituer une réserve : tout dépend de ses règles. Elle tient, comme la monnaie, sur la confiance du groupe." },
        { k: "o", d: "Chaque soir", l: "Au marché", t: "Séparer les poches", i: "h-poches", h: 2,
          c: ["3", "poches : l’activité, le confié, le mien"],
          p: "Revenus irréguliers, argent de la maison mêlé à celui de l’activité : un simple cahier de recettes change tout. Et le travail fait à la maison, lui, n’est compté nulle part." },
        { k: "o", d: "Chaque mois", l: "Paris, Montréal, Abidjan", t: "La diaspora", i: "h-diaspora", h: 2,
          p: "Les transferts des parents installés à l’étranger pèsent lourd dans le revenu de nombreuses familles. Bien utilisés, ils construisent ; mal organisés, ils s’évaporent." }
      ] },
    { t: "Les bâtisseurs", per: "1978 →", i: "h-batisseurs", h: 2,
      p: "Derrière chaque grande entreprise : un besoin, un premier financement, des salariés, des fournisseurs, des règles.",
      a: [["Voir les capitaines d’industrie", "bibliotheque.html?src=musee#capitaines"]],
      e: [
        { k: "f", ini: "KD", i: "h-dossongui", h: 3, nom: "Koné Dossongui", d: "1978", y: 1978, l: "Abidjan", role: "Banquier et industriel ivoirien",
          p: "Il prend 1 % du capital de ce qui deviendra la Banque Atlantique, puis bâtit un groupe de la banque aux mines.",
          q: "« Si tu t’y mets, les 1 % deviennent 90 %. » — Entretien avec Forbes Afrique, 2026" },
        { k: "o", d: "Douze parcours", l: "De Lagos à Addis-Abeba", t: "Les capitaines d’industrie", i: "h-usine-equipe", h: 2,
          c: ["12", "portraits dans la bibliothèque EFA"],
          p: "Dangote, Elumelu, Dossongui, Mwangi, Masiyiwa, Alemu… Leur pensée et ce qu’ils ont apporté : des modèles et des parcours dont on peut s’inspirer." }
      ] },
    { t: "Dette et crises", per: "1980 → 1994", i: "h-monnaies-crises", h: 2,
      p: "Matières premières en baisse, dettes en devises, monnaie dévaluée : la salle qui explique les journaux.",
      a: [["Jouer à S’endetter jusqu’où", "#borne-dette"], ["Le coût total d’un crédit", "cout-total-credit.html?src=musee"]],
      e: [
        { k: "o", d: "Années 1980", l: "Le continent", t: "La dette et l’ajustement", i: "h-ajustement", h: 2,
          p: "Prix des matières premières en baisse, dettes en devises qui pèsent : beaucoup d’États réduisent leurs dépenses, privatisent et réforment, avec des effets durs sur les salaires et les services." },
        { k: "o", d: "12 janvier 1994", y: 1994, l: "Zone franc", t: "La dévaluation", i: "h-devaluation", h: 2,
          c: ["− 50 %", "de valeur en une nuit"],
          p: "Le franc CFA perd la moitié de sa valeur face au franc français. Les produits importés coûtent soudain deux fois plus cher : <b>le même panier se vide</b>." }
      ] },
    { t: "De l’épargne au capital", per: "1998 →", i: "h-conseil", h: 2,
      p: "Autofinancement, prêt, obligation, action : quatre façons de financer, quatre façons de partager le risque.",
      a: [["Jouer au banquier", "#borne-banquier"], ["Suis-je prêt à investir ?", "bourse-essentiel.html?src=musee#A1"]],
      e: [
        { k: "o", d: "1998", y: 1998, l: "Abidjan", t: "La BRVM ouvre", i: "h-brvm-1998", h: 2,
          c: ["8", "pays, une seule Bourse"],
          p: "La Bourse régionale des huit pays de l’UEMOA. Chacun peut devenir copropriétaire d’entreprises de la région, et recevoir une part de leurs bénéfices." },
        { k: "o", d: "La différence clé", l: "Marché primaire, marché secondaire", t: "Qui reçoit votre argent ?", i: "musee-coffret",
          p: "Acheter une action <b>nouvellement émise</b> finance l’entreprise. Acheter une action <b>existante</b> paie celui qui la vend. Dividende, plus-value, perte : l’actionnaire partage le risque." }
      ] },
    { t: "Le téléphone, outil économique", per: "2007 →", i: "h-antenne", h: 2,
      p: "Réseaux, agents, paiements : en vingt ans, le téléphone est devenu une banque de poche.",
      a: [["Budget et mobile money", "budget-mobile-money.html?src=musee"]],
      e: [
        { k: "o", d: "Mars 2007", y: 2007, l: "Kenya", t: "Le téléphone devient un porte-monnaie", i: "h-agent-mm", h: 2,
          p: "Le mobile money se lance au Kenya, puis gagne le continent. Un solde sur un téléphone est, lui aussi, de la monnaie." },
        { k: "o", d: "Chaque jour", l: "Dans votre poche", t: "Frais, agents, fraudes", i: "h-frais", h: 2,
          c: ["4", "étapes, et à chacune un frais possible"],
          p: "Chaque transfert passe par un expéditeur, un réseau, un agent et un bénéficiaire. À chaque étape : un frais possible, un risque possible." }
      ] },
    { t: "Transformer, puis ouvrir le capital", per: "2010 → 2026", i: "h-dangote-plans", h: 2,
      p: "Transformer sur place ce que le continent produit, puis proposer au public une part de l’entreprise : toute la balade en un cas.",
      a: [["Suivre l’actualité dans EFA News", "news.html?src=musee"], ["Les capitaines d’industrie", "bibliotheque.html?src=musee#capitaines"]],
      e: [
        { k: "o", d: "Aujourd’hui", l: "Côte d’Ivoire et Ghana", t: "La fève et la tablette", i: "h-cacao", h: 2,
          c: ["> 50 %", "du cacao mondial, dans deux pays"],
          p: "Mais l’essentiel du prix d’une tablette se crée après la fève : broyage, chocolaterie, marque, distribution." },
        { k: "o", d: "Pour réussir", l: "L’atelier, l’usine", t: "Transformer exige", i: "h-atelier", h: 2,
          c: ["Prix − coûts", "= bénéfice, jamais le prix seul"],
          p: "Des compétences, de l’énergie, des machines, des clients et un prix compétitif. Et le prix de vente n’est pas le bénéfice : il faut d’abord payer tout le reste." },
        { k: "o", d: "2010", y: 2010, l: "Lagos", t: "Le ciment entre en Bourse", i: "h-cimenterie", h: 2,
          p: "Dangote Cement est cotée à la Bourse de Lagos depuis 2010. Le groupe a d’abord grandi en produisant au Nigeria ce que le pays importait." },
        { k: "o", d: "2023", y: 2023, l: "Lekki, Lagos", t: "La raffinerie démarre", i: "h-raffinerie", h: 2,
          c: ["650 000", "barils par jour prévus"],
          p: "Ses résultats dépendent du prix du pétrole brut, de l’énergie, de la maintenance et de ses clients." },
        { k: "o", d: "14 sept. → 27 oct. 2026", y: 2026, l: "Lagos", t: "L’offre au public", i: "h-offre", h: 2,
          c: ["4,1 Md × 525 ₦", "≈ 2 150 milliards de nairas"],
          p: "4,1 milliards d’actions proposées à 525 nairas. L’offre, prolongée de deux semaines, a fermé le 27 octobre. Au 28 octobre, l’attribution et la cotation restent à venir.",
          q: "Le prix d’une action n’est pas la valeur de toute l’entreprise. Aucun rendement n’est garanti." }
      ] }
  ];
  var ACCUEIL = { t: "Le musée de l’économie", i: "h-accueil",
    p: "Qui crée la richesse en Afrique, qui la finance, et qui en garde la valeur ? Dix mille ans, douze salles, dans l’ordre du temps : de la vallée du Nil à la Bourse de Lagos." };
  var SORTIE = { d: "Et demain ?", l: "Le continent", t: "Du cercle à la spirale", i: "h-equipe", h: 2,
    p: "Commerce continental, ouvert depuis janvier 2021 avec la ZLECAf, énergie, villes, emploi : la salle suivante reste à écrire. Que change le fait que davantage d’Africains possèdent une part des entreprises qui transforment leur continent ?" };
  /* Les quatre époques : la barre du haut et le choix d'un parcours à l'entrée. a, b = première et dernière salle (0 à 11). */
  var EPOQUES = [
    { t: "Les origines", per: "−8500 → XVIe s.", a: 0, b: 2 },
    { t: "Traites et colonies", per: "VIIe s. → 1945", a: 3, b: 4 },
    { t: "Indépendances et crises", per: "1956 → 1994", a: 5, b: 8 },
    { t: "L’Afrique qui investit", per: "1998 → 2026", a: 9, b: 11 }
  ];
  var QUIZ = [
    ["Que permet d’abord l’agriculture, vers −8500 ?", ["Le surplus", "La monnaie", "La Bourse"], 0, "Ce qui n’est pas consommé peut se garder ou s’échanger : c’est le surplus."],
    ["Pourquoi l’or de Mansa Moussa a-t-il perdu de sa valeur au Caire ?", ["Il était faux", "Trop d’or est arrivé d’un coup", "Le sel valait plus"], 1, "Plus une chose est abondante, moins elle vaut : c’est le mécanisme de l’inflation."],
    ["Combien de personnes ont été embarquées par la traite atlantique, selon les historiens ?", ["Environ 1,2 million", "Environ 12,5 millions", "Environ 125 millions"], 1, "Environ 12,5 millions de personnes, dont près de 2 millions sont mortes pendant la traversée."],
    ["En 1994, de combien le franc CFA a-t-il été dévalué ?", ["De 10 %", "De moitié", "Des trois quarts"], 1, "Le 12 janvier 1994, il perd 50 % de sa valeur face au franc français."],
    ["Acheter une action existante à la Bourse…", ["Finance directement l’entreprise", "Paie celui qui la vend", "Garantit un rendement"], 1, "Seule une action nouvellement émise finance l’entreprise. Aucun rendement n’est garanti."]
  ];

  /* ---------- la liste des étapes ---------- */
  var E = [{ k: "a", s: -1 }];
  SALLES.forEach(function (S, si) { E.push({ k: "s", s: si }); S.e.forEach(function (x) { x.s = si; E.push(x); }); });
  E.push({ k: "z", s: SALLES.length }, { k: "lv", s: SALLES.length }, { k: "pp", s: SALLES.length }, { k: "qz", s: SALLES.length }, { k: "av", s: SALLES.length });
  var KPP = E.length - 3, KAV = E.length - 1, KZ = E.length - 5, AN = 2026;
  var partie = -1, finS = 11, mode = "guide";
  function epoque(s) { for (var i = 0; i < EPOQUES.length; i++) if (s >= EPOQUES[i].a && s <= EPOQUES[i].b) return i; return -1; }
  function kSalle(s) { for (var k = 0; k < E.length; k++) if (E[k].k === "s" && E[k].s === s) return k; return 0; }

  var M, SC, cur = 0, vus = {}, au = null, son = true, avant = null, dejaIndice = false, auto = false, minuteur = null, indic = null;
  /* Défilement : le temps d'une lecture tranquille (environ 170 mots par minute), plus le temps de regarder l'image */
  var INTERACTIF = { a: 1, d: 1, pp: 1, qz: 1, av: 1, z: 1 };
  function duree(el) { var t = (el && el.querySelector(".mu-txt") || {}).textContent || "", mots = t.split(/\s+/).filter(Boolean).length, im = el && el.querySelector(".mu-cadre") ? 3 : 0; return Math.min(60, Math.max(8, Math.round(mots / 2.8) + im + 2)) * 1000; }
  function arreter() { clearTimeout(minuteur); minuteur = null; var b = document.getElementById("mu-temps"); if (b) { b.style.transition = "none"; b.style.width = "0"; } }
  function programmer() {
    arreter(); if (!auto || !M || M.hidden || document.hidden) return; var x = E[cur]; if (!x || INTERACTIF[x.k] || cur >= E.length - 1) return;
    var el = SC.querySelector('.mu-etape[data-k="' + cur + '"]'), ms = x.k === "lv" ? 5000 : duree(el), b = document.getElementById("mu-temps");
    if (b) { void b.offsetWidth; b.style.transition = "width " + ms + "ms linear"; b.style.width = "100%"; }
    minuteur = setTimeout(function () { aller(cur + 1); }, ms);
  }
  function majAuto() { var b = document.getElementById("mu-auto"); if (!b) return; b.setAttribute("aria-pressed", auto ? "true" : "false"); b.setAttribute("aria-label", auto ? "Lecture auto : activée. Mettre en pause" : "Lecture auto : désactivée. Lancer la lecture"); b.innerHTML = auto ? '‖<span class="t"> Lecture auto : oui</span>' : '▶<span class="t"> Lecture auto : non</span>'; }
  /* Les bords s'allument quelques secondes à chaque étape au début, puis de temps en temps */
  function indiquer() { if (!M) return; clearTimeout(indic); M.classList.add("mu-montre"); indic = setTimeout(function () { M.classList.remove("mu-montre"); }, 2600); }
  function esc(t) { return String(t == null ? "" : t).replace(/ ([?!:;»%])/g, "\u00a0$1").replace(/« /g, "«\u00a0").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function nb(t) { return String(t).replace(/ ([?!:;»%])/g, "\u00a0$1"); }
  function img(n) { return n ? "illus/" + n + ".webp" + V : ""; }
  function compte(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function cadre(n, port, h) { return '<div class="mu-cadre' + (port ? " port" : "") + '"><img data-src="' + img(n) + '" alt="" decoding="async">' + '' + '</div>'; }
  function actions(a) { return a ? '<div class="mu-act">' + a.map(function (x, j) { return '<a href="' + x[1] + '"' + (j ? ' class="l"' : "") + ' data-mu-lien>' + esc(x[0]) + "</a>"; }).join("") + "</div>" : ""; }
  function chiffre(x) { return (x.c ? '<p class="mu-c"><b>' + esc(x.c[0]) + '</b><span>' + esc(x.c[1]) + '</span></p>' : '') + (typeof x.y === 'number' ? '<p class="mu-ilya">' + (AN - x.y < 1 ? 'Cette année' : AN - x.y === 1 ? 'L’an dernier' : 'Il y a ' + (AN - x.y).toLocaleString('fr-FR').replace(/[\u202f\u00a0 ]/g, '\u00a0') + ' ans') + '</p>' : ''); }
  function q(x) { return x ? '<p class="mu-q"><small>À méditer</small>' + esc(x) + "</p>" : ""; }

  function etapeHtml(x) {
    if (x.k === "a") return '<div class="mu-etape s">' + cadre(ACCUEIL.i) + '<p class="mu-merci">Ce musée est né des idées de M.&nbsp;Pacôme Kipré, dit Peck Peckisblackman. Merci à lui.</p><div class="mu-txt"><p class="mu-lieu" style="background:#DA3C1B">Musée EFA · 12 salles</p><h2>' + esc(ACCUEIL.t) + "</h2><p>" + esc(ACCUEIL.p) + '</p>'
      + '<p class="mu-et">Visite guidée</p><p class="mu-aide">On vous emmène dans les douze salles, dans l’ordre du temps, au rythme d’une lecture&nbsp;: <span data-min="-1"></span>. Touchez «&nbsp;Visite guidée&nbsp;» en bas.</p>'
      + '<p class="mu-et">Ou visitez librement une partie</p><div class="mu-parts" id="mu-parts" aria-label="Partie de l’histoire"><button type="button" data-p="-1"><b>Depuis le début</b><small>12 salles · <span data-min="-1"></span></small></button>'
      + EPOQUES.map(function (P, i) { return '<button type="button" data-p="' + i + '"><b>' + esc(P.t) + '</b><small>Salles ' + (P.a + 1) + ' à ' + (P.b + 1) + ' · <span data-min="' + i + '"></span></small></button>'; }).join("")
      + '</div><p class="mu-aide">Vous passez quand vous voulez. En haut, touchez une époque pour y aller.</p></div></div>';
    if (x.k === "z") {
      var t = SALLES.map(function (S, i) { return '<i class="' + (vus[i] ? "ok" : "") + '" title="' + esc(S.t) + '">' + (i + 1) + "</i>"; }).join("");
      return '<div class="mu-etape z">' + cadre(SORTIE.i, 0, SORTIE.h) + '<div class="mu-txt"><div class="mu-date">' + esc(SORTIE.d) + '</div><span class="mu-lieu">📍 ' + esc(SORTIE.l) + "</span><h2>" + esc(SORTIE.t) + "</h2><p>" + esc(SORTIE.p) + '</p><p class="mu-bilan" id="mu-bilan"></p><div class="mu-sortie"><a href="index.html#benefices" data-mu-lien>Explorer un jeu ou une leçon</a><button type="button" data-mu-revoir>Revoir une salle</button></div></div></div>';
    }
    if (x.k === "lv") return '<div class="mu-etape s lv"><div class="mu-livre"><img src="livre-couverture.jpg" alt="Couverture du livre « Le Cercle et la Spirale », d’Élysée Johnson" width="900" height="1350" loading="lazy"></div><div class="mu-txt"><p class="mu-lieu" style="background:#DA3C1B">En cours d’écriture</p><h2>Le Cercle et la Spirale</h2><span class="mu-role" style="font-size:16px">Élysée Johnson, fondateur d’EFA</span><p>Le livre qui prolonge cette visite&nbsp;: comment l’argent qui tourne devient l’argent qui reste.</p></div></div>';
    if (x.k === "pp") return '<div class="mu-etape s dz pp"><div class="mu-txt" style="align-self:center"><p class="mu-lieu" style="background:#DA3C1B">Votre passeport du musée</p><h2>Douze salles, douze portes</h2><p>Touchez le numéro d’une salle pour prolonger la visite par un jeu ou une leçon. Vous revenez ensuite au musée, ici même.</p><div class="mu-tampons" id="mu-tampons"></div><div id="mu-pro" class="mu-pro" aria-live="polite"></div><div class="mu-act" style="justify-content:center"><button type="button" class="l" data-mu-salles>Voir la balade en six salles</button><button type="button" class="l" data-mu-debut>Revoir le musée</button></div></div></div>';
    if (x.k === "qz") return '<div class="mu-etape s dz"><div class="mu-txt" style="align-self:center"><p class="mu-lieu" style="background:#DA3C1B">Le quiz du musée · 5 questions</p><div id="mu-quiz"></div></div></div>';
    if (x.k === "av") return '<div class="mu-etape s dz"><div class="mu-txt" style="align-self:center"><p class="mu-lieu" style="background:#DA3C1B">Votre avis</p><h2>Qu’avez-vous ressenti ?</h2><p>Une salle qui vous a marqué, une erreur à corriger, une salle à ajouter : vos mots aident à faire grandir le musée.</p><form id="mu-avis" class="mu-form"><label>Votre message<textarea id="mu-av-t" rows="4" maxlength="1500" required></textarea></label><label>Votre email <small>(facultatif, pour une réponse)</small><input id="mu-av-m" type="email" maxlength="120"></label><input type="checkbox" name="botcheck" class="mu-bot" tabindex="-1" aria-hidden="true"><div class="mu-act" style="justify-content:center"><button type="submit">Envoyer mon avis</button><a class="l" href="rendez-vous.html?src=musee#contact" data-mu-lien>Nous écrire</a></div><p id="mu-av-r" class="mu-ilya" role="status"></p></form></div></div>';
    var S = SALLES[x.s];
    if (x.k === "s") return '<div class="mu-etape s">' + (!S.i ? "" : cadre(S.i, 0, S.h)) + '<div class="mu-txt"' + (!S.i ? ' style="align-self:center"' : "") + '><span class="mu-num">' + (x.s + 1) + '</span><h2>' + esc(S.t) + '</h2><span class="mu-role" style="font-size:16px">' + esc(S.per) + "</span><p>" + esc(S.p) + "</p></div></div>";
    if (x.k === "f") return '<div class="mu-etape' + (x.i ? ' fi' : ' f') + '">' + (x.i ? cadre(x.i, 0, x.h) : '<div class="mu-med" aria-hidden="true"><span>' + esc(x.ini) + "</span><em>" + esc(x.d) + '</em></div>') + '<div class="mu-txt">' + (x.i ? '<div class="mu-date">' + esc(x.d) + '</div>' + chiffre(x) : '') + '<span class="mu-lieu">📍 ' + esc(x.l) + "</span><h2>" + esc(x.nom) + '</h2><span class="mu-role">' + esc(x.role) + "</span><p>" + nb(x.p) + "</p>" + q(x.q) + "</div></div>";
    if (x.k === "n") return '<div class="mu-etape n"><div class="mu-txt"><div class="mu-date">' + esc(x.d) + '</div><span class="mu-lieu">📍 ' + esc(x.l) + "</span><h2>" + esc(x.t) + "</h2><p>" + nb(x.p) + "</p>" + q(x.q) + "</div></div>";
    if (x.k === "d") return '<div class="mu-etape s dz"><div class="mu-txt" style="align-self:center"><span class="mu-num" style="width:auto;padding:0 18px;border-radius:999px;font:800 13px/40px Source Sans\\ 3,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;height:40px">À vous de décider</span><h2>' + esc(x.t) + "</h2><p>" + esc(x.p) + "</p>" + actions(x.a) + "</div></div>";
    return '<div class="mu-etape">' + cadre(x.i, x.port, x.h) + '<div class="mu-txt"><div class="mu-date">' + esc(x.d) + '</div>' + chiffre(x) + '<span class="mu-lieu">📍 ' + esc(x.l) + "</span><h2>" + esc(x.t) + "</h2><p>" + nb(x.p) + "</p>" + q(x.q) + "</div></div>";
  }

  function construire() {
    M = document.createElement("div"); M.id = "musee"; M.hidden = true;
    M.setAttribute("role", "dialog"); M.setAttribute("aria-modal", "true"); M.setAttribute("aria-label", "Le musée de l’économie EFA");
    M.innerHTML = '<div class="mu-haut"><div class="mu-prog" id="mu-prog" aria-hidden="true">' + SALLES.map(function () { return "<i><b></b></i>"; }).join("") + '</div>'
      + '<div class="mu-epo" id="mu-epo" aria-label="Les époques">' + EPOQUES.map(function (P, i) { return '<button type="button" data-e="' + i + '"><b>' + esc(P.t) + '</b><small>' + esc(P.per) + '</small></button>'; }).join("") + '</div>'
      + '<div class="mu-barre"><span class="mu-salle" id="mu-salle"></span><div class="mu-cmd"><button type="button" id="mu-plan-b" aria-label="Plan du musée">☰<span class="t"> Plan</span></button><button type="button" id="mu-auto" aria-pressed="false" aria-label="Lecture auto : désactivée. Lancer la lecture">▶<span class="t"> Lecture auto : non</span></button><button type="button" id="mu-son" aria-pressed="true">♪</button><button type="button" id="mu-x" aria-label="Fermer le musée">✕</button></div></div></div>'
      + '<div class="mu-scene" id="mu-scene" aria-live="polite"><button type="button" class="mu-bord g" id="mu-g" aria-label="Étape précédente"></button><button type="button" class="mu-bord d" id="mu-d" aria-label="Étape suivante"></button><span class="mu-indice" id="mu-indice">Touchez les bords pour avancer ou revenir</span><div class="mu-temps" aria-hidden="true"><i id="mu-temps"></i></div></div>'
      + '<div class="mu-bas"><button type="button" class="mu-prec" id="mu-prec" aria-label="Revenir">‹</button><button type="button" class="mu-passe" id="mu-passe">Passer la salle »</button><button type="button" class="mu-suiv" id="mu-suiv">Suivant ›</button></div>'
      + '<div class="mu-plan" id="mu-plan" hidden><div class="mu-plan-t"><h2 style="font-size:24px">Le plan du musée</h2><button type="button" class="mu-prec" id="mu-plan-x" aria-label="Fermer le plan" style="min-height:44px;border-radius:999px;border:0;background:rgba(255,255,255,.12);color:#fff;font:800 14px Source Sans\\ 3,sans-serif;padding:0 14px">✕</button></div><ol id="mu-plan-l"></ol></div>';
    document.body.appendChild(M);
    SC = document.getElementById("mu-scene");
    var h = ""; E.forEach(function (x, k) { var t = etapeHtml(x), lat = /^<div class="mu-etape[^"]*"><div class="mu-(cadre|livre|med)/.test(t) && k > 0; h += t.replace('<div class="mu-etape', '<div data-k="' + k + '" class="mu-etape' + (lat ? " lat" : "")); });
    SC.insertAdjacentHTML("beforeend", h);
    avis();
    // le cadre prend la proportion exacte de son image : rien n’est rogné, pas de bandes
    SC.querySelectorAll(".mu-cadre img").forEach(function (im) { var f = function () { if (!im.getAttribute("src")) return; if (im.naturalWidth) { im.parentNode.classList.add("pret"); var c = im.parentNode, r = im.naturalWidth / im.naturalHeight; c.style.aspectRatio = im.naturalWidth + " / " + im.naturalHeight; if (!c.classList.contains("port")) c.style.width = "min(100%, calc(46svh * " + r.toFixed(3) + "), 980px)"; } }; im.addEventListener("load", f); im.addEventListener("error", function () { im.parentNode.classList.add("pret"); }); if (im.complete) f(); });
    // le plan
    document.getElementById("mu-plan-l").innerHTML = SALLES.map(function (S, i) { var P = null; EPOQUES.forEach(function (Q) { if (Q.a === i) P = Q; }); return (P ? '<li class="mu-plan-ep" aria-hidden="true">' + esc(P.t) + '<small>' + esc(P.per) + '</small></li>' : '') + '<li data-s="' + i + '"><i>' + (i + 1) + '</i><button type="button" class="go" data-s="' + i + '"><b>' + esc(S.t) + "</b><small>" + esc(S.per) + " · " + S.e.length + " étapes</small></button></li>"; }).join("");
    // commandes
    var $ = function (id) { return document.getElementById(id); };
    $("mu-g").onclick = function () { aller(cur - 1); }; $("mu-d").onclick = function () { aller(cur + 1); };
    $("mu-prec").onclick = function () { aller(cur - 1); }; $("mu-suiv").onclick = function () { if (cur === E.length - 1) fermer(); else if (cur === 0) demarrer(mode); else aller(cur + 1); };
    $("mu-passe").onclick = function () { if (cur === 0) { partie = -1; demarrer("libre"); return; } var s = E[cur].s; for (var k = cur + 1; k < E.length; k++) if (E[k].k === "s" || E[k].k === "z") { aller(k); return; } };
    $("mu-x").onclick = function () { fermer(); };
    $("mu-epo").onclick = function (e) { var b = e.target.closest("button[data-e]"); if (!b) return; var P = EPOQUES[+b.dataset.e]; if (P.b > finS) finS = P.b; aller(kSalle(P.a), true); compte("musee-epoque-" + (+b.dataset.e + 1)); };
    $("mu-parts").onclick = function (e) { var b = e.target.closest("button[data-p]"); if (!b) return; partie = +b.dataset.p; demarrer("libre"); };
    if (SC.querySelector(".mu-modes")) SC.querySelector(".mu-modes").onclick = function (e) { var b = e.target.closest("[data-mu-mode]"); if (b) demarrer(b.dataset.muMode); };
    /* durée estimée de chaque partie, au rythme de la visite guidée */
    (function () { var tot = {}; SC.querySelectorAll(".mu-etape").forEach(function (el) { var x = E[+el.dataset.k]; if (!x || x.s < 0 || x.s >= SALLES.length) return; var d = duree(el), ep = epoque(x.s); tot[-1] = (tot[-1] || 0) + d; tot[ep] = (tot[ep] || 0) + d; });
      SC.querySelectorAll("[data-min]").forEach(function (sp) { var m = Math.max(1, Math.round((tot[sp.dataset.min] || 0) / 60000)); sp.textContent = "environ " + m + " min"; }); })();
    $("mu-auto").onclick = function () { auto = !auto; majAuto(); if (auto) programmer(); else arreter(); compte("musee-auto-" + (auto ? "on" : "off")); };
    document.addEventListener("visibilitychange", function () { if (M && !M.hidden) { if (document.hidden && auto) { auto = false; majAuto(); } arreter(); } });
    // un formulaire ou un lien touché : la visite attend
    SC.addEventListener("focusin", function (e) { if (e.target.closest("textarea,input,select")) arreter(); });
    $("mu-plan-b").onclick = function () { arreter(); if (auto) { auto = false; majAuto(); } majPlan(); $("mu-plan").hidden = false; $("mu-plan-x").focus(); };
    $("mu-plan-x").onclick = function () { $("mu-plan").hidden = true; var b = $("mu-plan-b"); if (b) b.focus(); };
    $("mu-plan-l").onclick = function (e) { var b = e.target.closest("button.go"); if (!b) return; $("mu-plan").hidden = true; var s = +b.dataset.s; for (var k = 0; k < E.length; k++) if (E[k].k === "s" && E[k].s === s) { aller(k); return; } };
    try { son = localStorage.getItem("efa_musee_son") !== "0"; } catch (e) {}
    majSon();
    /* Le bouton suit ce qu'on entend vraiment : si la musique joue, il la coupe ; sinon, il la lance */
    $("mu-son").onclick = function () { var joue = au && !au.paused; son = !joue; try { localStorage.setItem("efa_musee_son", son ? "1" : "0"); } catch (e) {} if (son) jouer(); else if (au) au.pause(); majSon(); };
    /* Le navigateur bloque souvent le son avant un premier geste : le premier toucher dans le musée le lance */
    M.addEventListener("pointerdown", function (e) { if (son && (!au || au.paused) && !e.target.closest("#mu-son")) jouer(); }, true);
    SC.addEventListener("click", function (e) {
      if (e.target.closest("[data-mu-revoir]")) { var pb = document.getElementById("mu-plan-b"); if (pb) pb.click(); return; }
      var a = e.target.closest("[data-mu-lien]"), sa = e.target.closest("[data-mu-salles]"), de = e.target.closest("[data-mu-debut]");
      if (de) { aller(0); return; }
      if (sa) { fermer(); setTimeout(function () { var x = document.getElementById("echanger"); if (x) x.scrollIntoView({ behavior: "smooth" }); }, 60); return; }
      var tb = e.target.closest("[data-sal]");
      if (tb) { var S2 = SALLES[+tb.dataset.sal]; document.querySelectorAll("#mu-tampons button").forEach(function (b) { b.classList.toggle("c", b === tb); });
        document.getElementById("mu-pro").innerHTML = '<p class="mu-pro-t">Salle ' + (+tb.dataset.sal + 1) + ' · ' + esc(S2.t) + ' · ' + esc(S2.per) + '</p>' + (S2.a && S2.a.length ? '<div class="mu-act" style="justify-content:center">' + S2.a.map(function (y) { return '<a href="' + y[1] + '" data-mu-lien>' + esc(y[0]) + ' ›</a>'; }).join("") + "</div>" : '<p>Une salle de mémoire : elle se visite, elle ne se joue pas.</p>'); compte("musee-passeport-" + (+tb.dataset.sal + 1)); return; }
      if (a) { try { sessionStorage.setItem("efa_musee_retour", "1"); } catch (z) {} var hr = a.getAttribute("href"); compte("musee-lien-" + hr.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)); if (hr.charAt(0) === "#") { e.preventDefault(); fermer(); retourVisible(); setTimeout(function () { var x = document.querySelector(hr); if (x) x.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); } else if (au) au.pause(); }
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
  function quiz() {
    var Z = document.getElementById("mu-quiz"), i = 0, bon = 0;
    function poser() {
      if (i >= QUIZ.length) { Z.innerHTML = '<h2>' + bon + ' sur ' + QUIZ.length + '</h2><p>' + (bon >= 4 ? 'Vous avez retenu l’essentiel des dix mille ans du musée.' : 'Revoyez une salle depuis le plan, puis retentez votre chance.') + '</p><div class="mu-act" style="justify-content:center"><button type="button" class="l" id="mu-qz-r">Recommencer</button></div>'; document.getElementById("mu-qz-r").onclick = function () { i = 0; bon = 0; poser(); }; compte("musee-quiz-" + bon); return; }
      var Q = QUIZ[i];
      Z.innerHTML = '<p class="mu-ilya">Question ' + (i + 1) + ' sur ' + QUIZ.length + '</p><h2 class="mu-qq">' + esc(Q[0]) + '</h2><div class="mu-choix">' + Q[1].map(function (o, j) { return '<button type="button" data-j="' + j + '">' + esc(o) + '</button>'; }).join("") + '</div><div id="mu-qz-o"></div>';
      Z.querySelectorAll(".mu-choix button").forEach(function (b) { b.onclick = function () { var ok = +b.dataset.j === Q[2]; if (ok) bon++;
        Z.querySelectorAll(".mu-choix button").forEach(function (c) { c.disabled = true; if (+c.dataset.j === Q[2]) c.classList.add("ok"); else if (c === b) c.classList.add("ko"); });
        document.getElementById("mu-qz-o").innerHTML = '<p>' + esc(Q[3]) + '</p><div class="mu-act" style="justify-content:center"><button type="button" id="mu-qz-n">' + (i + 1 < QUIZ.length ? "Question suivante" : "Voir mon score") + '</button></div>';
        document.getElementById("mu-qz-n").onclick = function () { i++; poser(); }; }; });
    }
    poser();
  }
  function avis() {
    var f = document.getElementById("mu-avis"); if (!f) return;
    f.onsubmit = function (e) { e.preventDefault(); var t = document.getElementById("mu-av-t").value.trim(), m = document.getElementById("mu-av-m").value.trim(), r = document.getElementById("mu-av-r");
      if (t.length < 3) { r.textContent = "Écrivez quelques mots."; return; } if (f.querySelector(".mu-bot").checked) return;
      r.textContent = "Envoi…";
      fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ access_key: "426191fb-4812-4de4-b602-5857464c5916", subject: "efa.africa · Avis sur le musée de l’économie", from_name: "Musée EFA", email: m || "musee@efa.africa", message: t }) })
        .then(function (x) { return x.json(); }).then(function (j) { if (j && j.success) { r.textContent = "Merci, votre avis est bien arrivé."; f.reset(); compte("musee-avis-envoye"); } else r.textContent = "L’envoi n’a pas abouti. Réessayez, ou écrivez à newsletter@efa.africa."; }, function () { r.textContent = "L’envoi n’a pas abouti. Réessayez, ou écrivez à newsletter@efa.africa."; });
    };
  }
  function retourVisible() { var f = document.getElementById("musee-flot"); if (f) { f.innerHTML = "<i>◀</i> Revenir au musée"; f.classList.add("vu"); f.dataset.retour = "1"; } }
  function majSon() { var b = document.getElementById("mu-son"); if (!b) return; var joue = !!(au && !au.paused);
    b.innerHTML = joue ? "♪<span class=\"t\"> Son</span>" : "<s>♪</s><span class=\"t\"> " + (son ? "Activer le son" : "Muet") + "</span>";
    b.setAttribute("aria-pressed", joue ? "true" : "false"); b.setAttribute("aria-label", joue ? "Couper la musique" : "Lancer la musique"); }
  function jouer() { if (!son) return; try { if (!au) { au = new Audio("demo-musique.mp3"); au.loop = true; au.volume = 0.5; au.addEventListener("play", majSon); au.addEventListener("pause", majSon); } var p = au.play(); if (p && p.then) p.then(majSon, majSon); } catch (e) {} majSon(); }
  function majPlan() { setTimeout(function () { var c = document.querySelector("#mu-plan-l li.c"); if (c && c.scrollIntoView) c.scrollIntoView({ block: "center" }); }, 30); document.querySelectorAll("#mu-plan-l li[data-s]").forEach(function (li) { var s = +li.dataset.s; li.classList.toggle("ok", !!vus[s]); li.classList.toggle("c", E[cur].s === s); }); }
  function demarrer(m) {
    if (m !== "libre") partie = -1;
    mode = m === "libre" ? "libre" : "guide"; auto = mode === "guide"; majAuto();
    finS = partie < 0 ? SALLES.length - 1 : EPOQUES[partie].b;
    compte("musee-depart-" + mode + "-" + (partie < 0 ? "tout" : "e" + (partie + 1)));
    aller(kSalle(partie < 0 ? 0 : EPOQUES[partie].a), true);
  }
  function aller(k, force) {
    if (k < 0 || k >= E.length) return;
    /* fin de la partie choisie : on rejoint directement « Du cercle à la spirale » */
    if (!force && k > cur && E[k].k === "s" && E[k].s > finS) k = KZ;
    if (!force && cur === 0 && k === 1) { demarrer(mode); return; }
    var prec = cur; cur = k;
    SC.querySelectorAll(".mu-etape").forEach(function (el) { var j = +el.dataset.k; el.classList.toggle("ici", j === k); el.classList.toggle("avant", j < k); el.setAttribute("aria-hidden", j === k ? "false" : "true"); if (j === k) { var t = el.querySelector(".mu-txt"); if (t) t.scrollTop = 0; } });
    var x = E[k], s = x.s;
    if (s >= 0 && s < SALLES.length) { vus[s] = 1; try { localStorage.setItem("efa_musee_vus", JSON.stringify(vus)); } catch (e) {} }
    // progression : une barre par salle, remplie selon l'étape
    document.querySelectorAll("#mu-prog i").forEach(function (b, i) {
      var w = 0; if (i < s || s >= SALLES.length) w = 100; else if (i === s) { var tot = SALLES[i].e.length + 1, pos = x.k === "s" ? 1 : SALLES[i].e.indexOf(x) + 2; w = Math.round(100 * pos / tot); }
      b.firstChild.style.width = w + "%"; b.classList.toggle("c", i === s);
    });
    var ep = s >= 0 && s < SALLES.length ? epoque(s) : -1;
    document.querySelectorAll("#mu-epo button").forEach(function (b, i) { var P = EPOQUES[i], tous = true; for (var z = P.a; z <= P.b; z++) if (!vus[z]) tous = false; b.classList.toggle("c", i === ep); b.classList.toggle("ok", tous); if (i === ep && b.scrollIntoView && b.parentNode.scrollWidth > b.parentNode.clientWidth) b.parentNode.scrollLeft = b.offsetLeft - 14; });
    var etp = "", nEt = 0; if (s >= 0 && s < SALLES.length) { nEt = SALLES[s].e.length + 1; etp = " · étape " + (x.k === "s" ? 1 : SALLES[s].e.indexOf(x) + 2) + " sur " + nEt; }
    document.getElementById("mu-salle").innerHTML = x.k === "a" ? "<b>Bienvenue</b> · Musée de l’économie" : s >= SALLES.length ? "<b>Sortie</b> · " + ({ z: "Et demain ?", lv: "En cours d’écriture", pp: "Votre passeport", qz: "Le quiz du musée", av: "Votre avis" })[x.k] : "<b>Salle " + (s + 1) + " sur 12</b>" + etp + " · " + esc(SALLES[s].t);
    M.dataset.era = s < 0 || s >= SALLES.length ? (s < 0 ? "accueil" : "sortie") : s <= 2 ? "origines" : s === 3 ? "traites" : s === 4 ? "colonies" : s <= 8 ? "independances" : "investir"; M.dataset.room = s >= 0 && s < SALLES.length ? String(s + 1) : "";
    document.getElementById("mu-prec").disabled = k === 0;
    var dm = SC.querySelector('[data-min="-1"]'), dmt = dm && /(\d+)/.test(dm.textContent) ? " · " + RegExp.$1 + " min" : "";
    document.getElementById("mu-suiv").textContent = k === E.length - 1 ? "Terminer ✓" : k === 0 ? "Visite guidée" + dmt + " ›" : "Suivant ›";
    document.getElementById("mu-passe").textContent = k === 0 ? "Visite libre" : "Passer la salle »";
    document.getElementById("mu-passe").style.visibility = (s >= SALLES.length) ? "hidden" : "visible";
    if (x.k === "z") { compte("musee-fin"); var nv = 0; for (var z2 = 0; z2 < SALLES.length; z2++) if (vus[z2]) nv++; var bl = document.getElementById("mu-bilan"); if (bl) bl.textContent = nv >= SALLES.length ? "12 salles traversées" : nv + (nv > 1 ? " salles traversées" : " salle traversée") + " sur 12"; }
    if (x.k === "pp") { var tp = document.getElementById("mu-tampons"); if (tp) tp.innerHTML = SALLES.map(function (S, i) { return '<button type="button" class="' + (vus[i] ? "ok" : "") + '" data-sal="' + i + '" aria-label="Salle ' + (i + 1) + ' : ' + esc(S.t) + '">' + (i + 1) + "</button>"; }).join(""); }
    if (x.k === "qz") quiz();
    if (k > 0 && !dejaIndice) { dejaIndice = true; var ind = document.getElementById("mu-indice"); if (ind) ind.style.opacity = 0; }
    M.classList.toggle("mu-debut", k === 0); M.classList.toggle("mu-fin", k === E.length - 1); M.classList.toggle("mu-inter", !!({ a: 1, d: 1, pp: 1, qz: 1, av: 1 })[x.k]);
    if ((k < 4 || k % 5 === 0) && !({ d: 1, pp: 1, qz: 1, av: 1 })[x.k]) indiquer();
    programmer();
    // précharger l'image suivante
    [k, k + 1, k + 2, k + 3, k - 1].forEach(function (j) { var el = SC.querySelector('.mu-etape[data-k="' + j + '"]'); if (el) el.querySelectorAll("img[data-src]").forEach(function (im) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); }); });
    var nx = null; if (nx && (nx.i || (nx.k === "s" && SALLES[nx.s] && SALLES[nx.s].i))) { var im = new Image(); im.src = img(nx.i || SALLES[nx.s].i); }
  }
  function ouvrir(depuis, k0) {
    if (!M) construire();
    try { vus = JSON.parse(localStorage.getItem("efa_musee_vus") || "{}") || {}; } catch (e) { vus = {}; }
    avant = document.activeElement; M.hidden = false; document.documentElement.classList.add("musee-ouvert");
    aller(k0 || 0); jouer();
    if (location.hash !== "#musee") history.pushState({ musee: 1 }, "", location.pathname + location.search + "#musee");
    M.setAttribute("tabindex", "-1"); try { M.focus({ preventScroll: true }); } catch (e) {}
    compte("balade-musee-ouvert-" + (depuis || "lien"));
  }
  function fermer(retour) {
    if (!M) return; arreter(); M.hidden = true; document.documentElement.classList.remove("musee-ouvert"); if (au) au.pause();
    if (!retour && location.hash === "#musee") history.replaceState(null, "", location.pathname + location.search);
    if (avant && avant.focus) try { avant.focus({ preventScroll: true }); } catch (e) {}
  }
  window.EFA_MUSEE = ouvrir;
  function init() {
    document.querySelectorAll("[data-musee]").forEach(function (b) { b.addEventListener("click", function () { ouvrir(b.dataset.musee); }); });
    var flot = document.getElementById("musee-flot"), ref = document.querySelector(".btn-musee");
    if (flot) { flot.addEventListener("click", function () { if (flot.dataset.retour) { ouvrir("retour", KPP); } else ouvrir("flottant"); }); if ("IntersectionObserver" in window && ref) new IntersectionObserver(function (es) { flot.classList.toggle("vu", !es[0].isIntersecting); }).observe(ref); }
    var ret = false; try { ret = sessionStorage.getItem("efa_musee_retour") === "1"; sessionStorage.removeItem("efa_musee_retour"); } catch (z) {}
    if (location.hash === "#musee-fin" || (location.hash === "#musee" && ret)) ouvrir("retour", KPP);
    else if (location.hash === "#musee") ouvrir("lien-direct");
    document.documentElement.classList.remove("musee-arrivee");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
