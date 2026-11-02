/* Atelier guidé · Où est passé mon argent ? */
window.ATELIER = {
  id: "ou-passe-mon-argent",
  titre: "Où est passé mon argent ?",
  h1: "Votre argent ne disparaît pas. Il change de main sans que vous le voyiez.",
  voix: false,
  question: {
    t: "Le 20 du mois, il ne vous reste presque rien. Quelle est la première chose à faire ?",
    r: [
      ["a", "Chercher à gagner plus.", "Gagner plus aide, mais si vous ne voyez pas où part l’argent, la hausse part au même endroit. On regarde d’abord.", false],
      ["b", "Noter où part chaque franc pendant quelques jours.", "C’est le bon réflexe : on ne corrige que ce qu’on voit. C’est le chapitre 1 et le chapitre 2.", true],
      ["c", "Couper toutes les dépenses plaisir.", "Trop dur pour tenir. On classe d’abord, puis on réduit une seule dépense bien choisie. C’est le chapitre 3.", false],
      ["d", "Emprunter jusqu’à la fin du mois.", "C’est repousser le problème au mois suivant, avec un coût en plus. On cherche d’abord la fuite.", false]
    ]
  },
  chapitres: [
    { t: "Mon point de départ", acq: "Je vois mon mois", desc: "Ce qui entre, ce qui sort à coup sûr, ce qui reste.", e: [
      { t: "Ce qui entre vraiment", c: "La tontine que vous recevez n’est pas un revenu : c’est votre propre argent qui revient. Comptez seulement ce que vous gagnez.",
        w: { k: "Vos revenus d’un mois normal", champs: [ {id:"rv_fixe", l:"Salaire ou revenu fixe (F)", ph:"250 000"}, {id:"rv_var", l:"Revenus variables (F)", ph:"commerce, primes"} ],
          v: function(D,H){ var t=H.N(D.rv_fixe)+H.N(D.rv_var); return t?'<div class="gros"><small>Votre revenu du mois</small><b>'+H.F(t)+'</b><p>C’est la base de tout le reste de l’atelier.</p></div>':''; } },
        p: "J’ai écrit mon revenu réel du mois." },
      { t: "Ce qui sort à coup sûr", c: "Les dépenses fixes reviennent chaque mois, au même montant. On les connaît : on les écrit en premier.",
        w: { k: "Vos dépenses fixes d’un mois", c3: 1, champs: [ {id:"df_log", l:"Logement"}, {id:"df_tra", l:"Transport"}, {id:"df_eco", l:"École"}, {id:"df_eau", l:"Eau, électricité"}, {id:"df_cre", l:"Crédit en cours"}, {id:"df_ton", l:"Cotisation tontine"} ],
          v: function(D,H){ var t=["df_log","df_tra","df_eco","df_eau","df_cre","df_ton"].reduce(function(s,k){return s+H.N(D[k]);},0); return t?'<div class="gros"><small>Vos dépenses fixes</small><b>'+H.F(t)+'</b></div>':''; } },
        p: "Mes dépenses fixes sont écrites." },
      { t: "Ce qui reste pour vivre", c: "Ce reste, c’est l’argent qui disparaît sans bruit. C’est là que nous allons chercher.",
        w: { v: function(D,H){ var r=H.N(D.rv_fixe)+H.N(D.rv_var), f=["df_log","df_tra","df_eco","df_eau","df_cre","df_ton"].reduce(function(s,k){return s+H.N(D[k]);},0); if(!r) return '<div class="verdict v-mid">Écrivez d’abord votre revenu, à l’écran précédent.</div>'; var x=r-f; D.reste=x; return '<div class="gros"><small>Votre reste à vivre</small><b>'+H.F(x)+'</b><p>'+(x<0?'Vos dépenses fixes dépassent votre revenu : la priorité est là, avant tout le reste.':'Soit '+Math.round(x/r*100)+' % de votre revenu, pour la nourriture, les sorties, la famille et l’imprévu.')+'</p></div>'; } },
        p: "Je connais mon reste à vivre." }
    ]},
    { t: "Les fuites", acq: "Je trouve les fuites", desc: "Les petites dépenses, les frais invisibles, les demandes de la famille.", e: [
      { t: "Les petites dépenses du quotidien", c: "Une petite somme chaque jour devient une grosse somme chaque mois. Personne ne la voit, parce qu’elle ne fait jamais mal.",
        w: { k: "En moyenne, chaque jour", c3: 1, champs: [ {id:"fq_tra", l:"Taxi, moto, gbaka"}, {id:"fq_rep", l:"Repas et boissons dehors"}, {id:"fq_tel", l:"Crédit et data"} ],
          v: function(D,H){ var j=H.N(D.fq_tra)+H.N(D.fq_rep)+H.N(D.fq_tel); return j?'<div class="gros"><small>Sur un mois de 30 jours</small><b>'+H.F(j*30)+'</b><p>'+H.F(j)+' par jour. Regardez ce chiffre une seconde fois.</p></div>':''; } },
        p: "J’ai chiffré mes petites dépenses du quotidien." },
      { t: "Les frais que l’on ne voit pas", c: "Un frais de retrait ou de transfert paraît minuscule. Additionnés sur un mois, ils paient parfois un repas de famille.",
        w: { puces: { id:"fi_l", k:"Ce que vous payez sans y penser", m:1, l:["Frais de retrait mobile money","Frais de transfert","Frais de tenue de compte","Abonnements oubliés","Pénalités de retard"] },
          champs: [ {id:"fi_m", l:"Estimation par mois (F)"} ] },
        p: "J’ai repéré mes frais invisibles." },
      { t: "Les demandes de la famille", c: "Aider la famille n’est pas une fuite. C’est une dépense qui mérite d’être prévue, au lieu de tomber chaque fois par surprise.",
        w: { champs: [ {id:"fa_m", l:"Donné à la famille le mois dernier (F)"}, {id:"fa_n", l:"Nombre de demandes"} ],
          v: function(D,H){ var m=H.N(D.fa_m); return m?'<div class="verdict v-mid">'+H.F(m)+' le mois dernier. Au chapitre 4, cette somme deviendra une enveloppe prévue, et non plus une surprise.</div>':''; } },
        p: "J’ai écrit ce que je donne à la famille." }
    ]},
    { t: "Classer", acq: "Je classe mes dépenses", desc: "Essentiel, utile, envie : savoir où couper sans souffrir.", e: [
      { t: "Essentiel, utile ou envie ?", c: "On ne coupe pas tout. On sait seulement ce qui est essentiel, ce qui est utile, et ce qui est une envie.",
        w: { quiz: [ ["Le loyer", ["Essentiel","Envie"], 0, "Sans logement, tout s’arrête."], ["Le troisième pagne du mois", ["Essentiel","Envie"], 1, "Une envie peut être légitime. Elle vient après le reste."], ["Le taxi quand le bus suffit", ["Utile","Essentiel"], 0, "Utile, parfois. Mais c’est souvent la première dépense à réduire."], ["La cotisation de tontine", ["Essentiel","Envie"], 0, "C’est un engagement pris devant le groupe : on le prévoit en premier."] ] },
        p: "Je sais classer mes dépenses." },
      { t: "Ma dépense de trop", c: "Choisissez une seule dépense à réduire ce mois-ci. Une seule. C’est celle-là qui changera le mois.",
        w: { champs: [ {id:"dt_q", l:"La dépense que je réduis", type:"txt", ph:"ex. taxi le matin"}, {id:"dt_m", l:"Ce que j’économise par mois (F)"} ],
          v: function(D,H){ var m=H.N(D.dt_m); return m?'<div class="verdict v-ok">'+H.F(m)+' par mois, soit '+H.F(m*12)+' sur un an.</div>':''; } },
        p: "J’ai choisi ma dépense de trop." }
    ]},
    { t: "Mon plan", acq: "Je décide avant que l’argent arrive", desc: "Se payer en premier, puis des enveloppes pour le reste.", e: [
      { t: "Se payer en premier", c: "Le jour de la paie, la première dépense, c’est vous. Ce qui n’est pas mis de côté ce jour-là ne le sera jamais.",
        w: { champs: [ {id:"sp_m", l:"Ce que je mets de côté le jour de la paie (F)", ph:"10 000"} ],
          v: function(D,H){ var m=H.N(D.sp_m), r=H.N(D.rv_fixe)+H.N(D.rv_var); return m?'<div class="verdict v-ok">'+H.F(m)+' par mois'+(r?', soit '+Math.round(m/r*100)+' % de votre revenu':'')+'. Commencer petit vaut mieux que ne pas commencer.</div>':''; } },
        p: "Mon montant du jour de paie est fixé." },
      { t: "Une enveloppe pour chaque usage", c: "Une enveloppe vide, c’est une décision, pas un échec : ce mois-là, on ne dépense plus dans cette catégorie.",
        w: { k: "Votre reste à vivre, réparti", champs: [ {id:"en_vie", l:"Vie courante"}, {id:"en_fam", l:"Famille"}, {id:"en_pla", l:"Plaisir"}, {id:"en_imp", l:"Imprévus"} ],
          v: function(D,H){ var t=["en_vie","en_fam","en_pla","en_imp"].reduce(function(s,k){return s+H.N(D[k]);},0), r=H.N(D.reste)-H.N(D.sp_m); if(!t) return ''; return '<div class="verdict '+(r&&t>r?'v-ko':'v-ok')+'">Enveloppes : '+H.F(t)+(r?' pour '+H.F(r)+' disponibles.'+(t>r?' Vous dépassez : réduisez une enveloppe.':' Le compte est bon.'):'.')+'</div>'; } },
        p: "Mes enveloppes sont fixées." },
      { t: "Le jour de la paie", f: ["Je mets de côté mon montant, avant toute autre dépense.", "Je paie mes dépenses fixes.", "Je répartis le reste dans mes enveloppes, en espèces ou sur des comptes séparés.", "Je note la date : je ferai le point dans une semaine."], c: "Dix minutes le jour de la paie valent mieux que dix jours de regrets à la fin du mois.",
        p: "Je sais ce que je fais le jour de la paie." }
    ]},
    { t: "Tenir", acq: "Je tiens sur la durée", desc: "Un défi simple, un point chaque semaine, un plan quand le mois déraille.", e: [
      { t: "Mon défi de sept jours", c: "Un seul défi, tenu sept jours. C’est comme cela qu’une habitude commence.",
        w: { puces: { id:"df_c", k:"Choisissez votre défi", l:["Noter chaque dépense","Zéro taxi quand le bus suffit","Zéro repas dehors en semaine","Retirer une seule fois par semaine"] } },
        p: "Mon défi est choisi." },
      { t: "Le point du dimanche", f: ["Je compte ce qui reste dans chaque enveloppe.", "Je regarde ma dépense de trop : ai-je tenu ?", "Je note une chose apprise cette semaine."], c: "Cinq minutes, une fois par semaine. Vous verrez votre argent avant qu’il ne disparaisse.",
        p: "Mon point du dimanche est prévu." },
      { t: "Quand le mois déraille", c: "Une urgence arrive toujours. Ce n’est pas un échec : on prend dans l’enveloppe imprévus, puis on reprend le plan le mois suivant.",
        w: { champs: [ {id:"dr_p", l:"Mon plan si une urgence arrive", type:"area", ph:"Je prends d’abord dans… puis…"} ] },
        p: "J’ai écrit mon plan pour les mois difficiles." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Où est passé mon argent ? »", titre: "Vous voyez votre argent",
    fiche: [
      ["Revenu du mois", function(D,H){ var t=H.N(D.rv_fixe)+H.N(D.rv_var); return t?H.F(t):''; }],
      ["Reste à vivre", function(D,H){ return D.reste!=null&&D.reste!==''?H.F(D.reste):''; }],
      ["Petites dépenses par mois", function(D,H){ var j=H.N(D.fq_tra)+H.N(D.fq_rep)+H.N(D.fq_tel); return j?H.F(j*30):''; }],
      ["Frais invisibles par mois", function(D,H){ return H.N(D.fi_m)?H.F(H.N(D.fi_m)):''; }],
      ["Famille le mois dernier", function(D,H){ return H.N(D.fa_m)?H.F(H.N(D.fa_m)):''; }],
      ["Ma dépense de trop", function(D,H){ return D.dt_q?D.dt_q+(H.N(D.dt_m)?' · '+H.F(H.N(D.dt_m))+' par mois':''):''; }],
      ["Jour de paie : je me paie", function(D,H){ return H.N(D.sp_m)?H.F(H.N(D.sp_m)):''; }],
      ["Mon défi", function(D){ return D.df_c||''; }]
    ],
    suite: { t: "Le diagnostic « Où est passé mon argent ? »", p: "Cinq questions pour mesurer où vous en êtes, avec la méthode et le défi de la semaine. Gratuit.", lien: "ou-est-passe-mon-argent.html", b: "Faire le diagnostic" }
  }
};
