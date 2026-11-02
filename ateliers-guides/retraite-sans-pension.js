/* Atelier guidé · Préparer sa retraite quand on n’a pas de pension */
window.ATELIER = {
  id: "retraite-sans-pension",
  titre: "Préparer ma retraite sans pension",
  h1: "Votre retraite, c’est vous qui la financez. Autant commencer maintenant.",
  voix: false,
  question: {
    t: "Vous n’avez pas de pension prévue. Quelle est la meilleure première étape ?",
    r: [
      ["a", "Compter sur les enfants.", "Les enfants aident souvent, et c’est une belle chose. Mais c’est un espoir, pas un plan : ils auront aussi leurs charges. C’est le chapitre 1.", false],
      ["b", "Acheter un terrain, et voir après.", "Un terrain peut être utile, mais il ne paie pas les courses du mois. On commence par le chiffre dont vous aurez besoin. C’est le chapitre 2.", false],
      ["c", "Calculer ce dont j’aurai besoin chaque mois.", "C’est le bon point de départ : un chiffre clair permet de choisir les bons outils. C’est le chapitre 2.", true],
      ["d", "Attendre de gagner plus.", "Le temps est votre meilleur allié. Chaque année d’attente rend l’effort mensuel plus lourd. C’est le chapitre 2.", false]
    ]
  },
  chapitres: [
    { t: "Regarder en face", acq: "Je regarde ma retraite en face", desc: "Combien d’années il reste, et sur quoi vous comptez vraiment.", e: [
      { t: "Le temps qu’il me reste", c: "Le temps est l’ingrédient le plus précieux. Chaque année compte, et elle ne se rattrape pas.",
        w: { champs: [ {id:"rt_age", l:"Votre âge"}, {id:"rt_fin", l:"L’âge où vous voulez ralentir"} ],
          v: function(D,H){ var a=H.N(D.rt_age), f=H.N(D.rt_fin); if(!a||!f) return ''; var n=f-a; return n>0?'<div class="gros"><small>Années pour préparer</small><b>'+n+' ans</b><p>Soit '+(n*12)+' paies avant de ralentir.</p></div>':'<div class="verdict v-mid">Vous y êtes déjà : l’atelier vous aide à organiser ce que vous avez.</div>'; } },
        p: "Je connais le nombre d’années qu’il me reste." },
      { t: "Sur quoi je compte", c: "Si vous cotisez à une caisse de retraite, comme la CNPS ou la CGRAE, demandez votre relevé : c’est la base de votre calcul.",
        w: { puces: { id:"rt_src", k:"Vos sources de revenu à la retraite", m:1, l:["Une pension de caisse de retraite","Les enfants","Des loyers","Un commerce qui continue","Mon épargne","Un terrain à vendre"] } },
        p: "J’ai listé mes sources de demain." },
      { t: "Compter sur les enfants ?", c: "Être aidé par ses enfants est une chance. Être une charge pour eux est un poids. Votre plan doit tenir même sans eux.",
        w: { quiz: [ ["Mon plan de retraite doit tenir…", ["Grâce aux enfants","Même sans les enfants"], 1, "L’aide des enfants devient un plus, pas la fondation."] ] },
        p: "Mon plan tiendra même sans l’aide des enfants." }
    ]},
    { t: "Le chiffre", acq: "J’ai un chiffre", desc: "Ce dont vous aurez besoin chaque mois, et ce qu’il faut mettre de côté.", e: [
      { t: "Mon besoin chaque mois", c: "À la retraite, certaines dépenses baissent, comme le transport du travail. D’autres montent, comme la santé.",
        w: { champs: [ {id:"rt_bes", l:"Dépenses par mois à la retraite (F)", ph:"200 000"}, {id:"rt_pen", l:"Pension ou revenus sûrs par mois (F)", ph:"0"} ],
          v: function(D,H){ var b=H.N(D.rt_bes), p=H.N(D.rt_pen); if(!b) return ''; D.rt_trou=Math.max(0,b-p); return '<div class="gros"><small>Ce qui manque chaque mois</small><b>'+H.F(D.rt_trou)+'</b><p>C’est ce que votre épargne devra financer.</p></div>'; } },
        p: "Je connais ce qui manquera chaque mois." },
      { t: "La somme à réunir", c: "Ce calcul simple ne compte ni les intérêts ni la hausse des prix. C’est un ordre de grandeur, pour savoir où l’on va.",
        w: { champs: [ {id:"rt_dur", l:"Années de retraite à financer", ph:"20"} ],
          v: function(D,H){ var t=H.N(D.rt_trou), d=H.N(D.rt_dur); if(!t||!d) return ''; D.rt_cap=t*12*d; return '<div class="gros"><small>Somme à réunir, environ</small><b>'+H.F(D.rt_cap)+'</b><p>'+H.F(t)+' × 12 mois × '+d+' ans.</p></div>'; } },
        p: "Je connais la somme à réunir." },
      { t: "L’effort de chaque mois", c: "Le chiffre fait peur ? C’est normal. Divisé par le nombre de mois qu’il vous reste, il redevient un effort possible.",
        w: { v: function(D,H){ var c=H.N(D.rt_cap), n=(H.N(D.rt_fin)-H.N(D.rt_age))*12; if(!c||n<=0) return '<div class="verdict v-mid">Complétez votre âge au chapitre 1 et votre besoin aux écrans précédents.</div>'; D.rt_eff=Math.ceil(c/n); return '<div class="gros"><small>À mettre de côté chaque mois</small><b>'+H.F(D.rt_eff)+'</b><p>Sans compter ce que vos placements rapporteront : avec un rendement, l’effort sera plus léger.</p></div>'; } },
        p: "Je connais mon effort mensuel." }
    ]},
    { t: "Les outils", acq: "Je connais les outils", desc: "Épargner, placer, posséder : ce que fait chaque outil.", e: [
      { t: "Épargner sans risque", f: ["Le compte d’épargne : disponible, rapporte peu.", "Le dépôt à terme : bloqué une durée fixée, rapporte un peu plus.", "Les emprunts d’État : un prêt à l’État, avec un intérêt fixé et une date de remboursement."], c: "Ces outils protègent ce que vous avez. Ils servent surtout dans les dernières années avant la retraite.",
        p: "Je connais les outils sans risque." },
      { t: "Faire grandir sur le long terme", f: ["Le FCPE de l’employeur, quand il existe.", "Les OPCVM : des fonds gérés par des professionnels agréés.", "Les actions à la BRVM, pour une partie seulement, sur plus de cinq ans."], c: "Sur le long terme, une partie de l’argent doit travailler. Mais seulement l’argent dont vous n’aurez pas besoin avant longtemps.",
        p: "Je connais les outils de long terme." },
      { t: "Posséder", c: "Un logement qui vous évite un loyer à la retraite est une vraie économie. Un terrain non bâti ne rapporte rien tant qu’il n’est pas vendu.",
        w: { quiz: [ ["Un studio loué chaque mois", ["Rapporte un revenu","Ne rapporte rien"], 0, "C’est un revenu, à condition qu’il soit entretenu et loué."], ["Un terrain nu au village", ["Rapporte un revenu","Ne rapporte rien"], 1, "Il peut prendre de la valeur, mais il ne paie pas les dépenses du mois."] ] },
        p: "Je sais ce que rapporte chaque bien." }
    ]},
    { t: "Mon plan", acq: "J’ai un plan", desc: "Répartir, automatiser, protéger.", e: [
      { t: "Répartir", c: "Plus la retraite est loin, plus la part de long terme peut être grande. Plus elle approche, plus on sécurise.",
        w: { puces: { id:"rt_rep", k:"Votre répartition de départ", l:["Surtout sans risque","Moitié, moitié","Surtout long terme"] } },
        p: "Ma répartition est choisie." },
      { t: "Automatiser", f: ["Je fixe mon versement retraite le jour de la paie.", "Je l’envoie sur un compte que je ne touche pas.", "Je l’augmente à chaque hausse de salaire."], c: "La retraite se prépare comme on monte un mur : une brique chaque mois, sans y penser.",
        w: { champs: [ {id:"rt_vers", l:"Mon versement retraite par mois (F)"} ] },
        p: "Mon versement est fixé." },
      { t: "Protéger", c: "Une maladie grave peut vider en un mois l’épargne de dix ans. Une couverture santé protège votre retraite.",
        w: { puces: { id:"rt_pro", k:"Ce que vous avez déjà", m:1, l:["Assurance santé","Mutuelle","Réserve de sécurité","Rien pour l’instant"] } },
        p: "Je sais comment protéger mon épargne retraite." }
    ]},
    { t: "Les pièges", acq: "J’évite les pièges", desc: "Les erreurs qui ruinent une retraite bien préparée.", e: [
      { t: "Les promesses miracles", c: "Personne ne peut promettre un rendement élevé sans risque. Un rendement promis trop beau est un signal d’alerte.",
        w: { quiz: [ ["On vous promet 10 % par mois, garanti", ["Bonne affaire","Signal d’alerte"], 1, "C’est le profil des arnaques. Vérifiez toujours l’agrément."] ] },
        p: "Je sais reconnaître une promesse miracle." },
      { t: "Tout mettre au même endroit", c: "Tout dans un terrain, tout dans une seule action, tout chez une seule personne : le jour où cela tourne mal, tout part.",
        p: "Je répartis mon épargne." , f: ["Je garde une part disponible.", "Je répartis le reste entre plusieurs outils.", "Je vérifie chaque intermédiaire avant de confier de l’argent."] },
      { t: "Tout donner en chemin", c: "Aider la famille, oui. Mais l’argent de la retraite n’est pas une caisse d’urgence pour tous. Décidez à l’avance ce qui est intouchable.",
        w: { champs: [ {id:"rt_int", l:"Ce qui est intouchable pour moi", type:"area", ph:"Mon versement retraite de chaque mois, même quand…"} ] },
        p: "J’ai écrit ce qui est intouchable." }
    ]}
  ],
  fin: {
    k: "Ma fiche retraite", titre: "Votre retraite a un plan",
    fiche: [
      ["Années pour préparer", function(D,H){ var n=H.N(D.rt_fin)-H.N(D.rt_age); return n>0?n+' ans':''; }],
      ["Besoin manquant par mois", function(D,H){ return D.rt_trou!=null&&D.rt_trou!==''?H.F(D.rt_trou):''; }],
      ["Somme à réunir", function(D,H){ return H.N(D.rt_cap)?H.F(H.N(D.rt_cap)):''; }],
      ["Effort mensuel calculé", function(D,H){ return H.N(D.rt_eff)?H.F(H.N(D.rt_eff)):''; }],
      ["Mon versement", function(D,H){ return H.N(D.rt_vers)?H.F(H.N(D.rt_vers)):''; }],
      ["Ma répartition", function(D){ return D.rt_rep||''; }],
      ["Mes sources demain", function(D){ return (D.rt_src||[]).join(', '); }]
    ],
    suite: { t: "L’outil « Préparer ma retraite »", p: "Le simulateur pour affiner votre chiffre, avec un rendement et la hausse des prix. Gratuit.", lien: "preparer-ma-retraite.html", b: "Ouvrir le simulateur" }
  }
};
