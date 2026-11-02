/* Atelier guidé · Mobile money et frais */
window.ATELIER = {
  id: "mobile-money-frais",
  titre: "Mobile money et frais : ce que coûtent les petits transferts",
  h1: "Un petit frais ne fait pas mal. Trente petits frais par mois, si.",
  voix: "auto",
  question: {
    t: "Votre salaire arrive sur votre mobile money. Vous le retirez en espèces au fil du mois. Est-ce que cela vous coûte quelque chose ?",
    r: [
      ["a", "Non, c’est mon argent, je le retire.", "C’est ce que pensent beaucoup d’entre nous. Pourtant, chaque retrait a souvent un prix. On va le chiffrer ensemble, sans jugement.", false],
      ["b", "Oui, chaque retrait a un prix.", "Exactement. Et ce prix, répété tout le mois, finit par faire une vraie somme. Cet atelier vous aide à la voir, puis à la réduire.", true]
    ]
  },
  chapitres: [
    { t: "Où se cachent les frais", acq: "Je sais où se cachent les frais", desc: "Les opérations qui coûtent, celles qui coûtent peu, et les frais qu’on ne voit pas.", e: [
      { t: "Payant ou souvent gratuit ?", c: "Toutes les opérations ne coûtent pas la même chose. Les grilles changent d’un opérateur à l’autre, mais les grandes tendances se ressemblent.",
        w: { quiz: [
          ["Retirer de l’argent chez un agent", ["Souvent payant","Souvent gratuit"], 0, "Le retrait est l’une des opérations qui coûtent le plus souvent, et il revient plusieurs fois par mois."],
          ["Payer un commerçant directement avec son téléphone", ["Souvent payant","Souvent gratuit"], 1, "Pour celui qui paie, le paiement marchand est souvent gratuit. Vérifiez la grille de votre opérateur."],
          ["Envoyer de l’argent vers un numéro d’un autre réseau", ["Souvent payant","Souvent gratuit"], 0, "Le transfert entre réseaux a souvent un coût, parfois plus élevé que sur le même réseau."],
          ["Envoyer de l’argent à un proche à l’étranger", ["Le seul coût est le frais affiché","Il y a aussi le taux de change"], 1, "Le taux de change peut coûter plus que le frais affiché. On compare toujours la somme reçue."]
        ] },
        p: "Je sais quelles opérations coûtent souvent." },
      { t: "Mes opérations habituelles", c: "Commencez par ce que vous faites vraiment. Cochez tout ce qui revient dans un mois normal.",
        w: { puces: { id:"mm_ops", k:"Ce que je fais chaque mois", m:1, l:["Retraits chez un agent","Envois sur le même réseau","Envois vers un autre réseau","Envois ou réceptions à l’étranger","Paiements chez les commerçants","Factures (eau, électricité, télé)","Achat de crédit ou forfait","Cotisation de tontine"] },
          v: function(D){ var n=(D.mm_ops||[]).length; if(!n) return ''; return '<div class="gros"><small>Vos opérations habituelles</small><b>'+n+' type'+(n>1?'s':'')+' d’opérations</b><p>Au chapitre 2, on retrouve leurs frais dans votre historique.</p></div>'; } },
        p: "J’ai coché mes opérations habituelles." },
      { t: "Lire la grille de son opérateur", f: ["J’ouvre la grille tarifaire de mon opérateur : dans l’appli, sur son site ou chez un agent.", "Je repère les paliers : le frais change souvent selon le montant envoyé ou retiré.", "Je note la date de la grille : les tarifs changent, je la relis de temps en temps."], c: "Orange Money, Wave, MTN MoMo, Moov Money : chacun publie sa grille. C’est elle qui fait foi, pas ce qu’on entend autour de soi.",
        p: "Je sais où lire la grille de mon opérateur." }
    ]},
    { t: "Relever mon mois", acq: "Je connais mes opérations du mois", desc: "L’historique de votre téléphone dit tout : il suffit de le lire.", e: [
      { t: "Ouvrir l’historique", f: ["J’ouvre l’historique dans l’appli, ou je le demande par le code de mon opérateur.", "Je choisis le dernier mois complet, du 1er au dernier jour.", "Pour chaque opération, je note le frais affiché, ligne par ligne, par type."], c: "Un mois suffit pour voir clair. Prenez un mois normal, sans fête ni funérailles exceptionnelles.",
        p: "J’ai ouvert l’historique de mon dernier mois." },
      { t: "Mes frais, type par type", c: "Additionnez les frais de chaque type d’opération. Pas les montants envoyés : seulement ce que vous avez payé en plus.",
        w: { ex: "Koffi relève son mois : 3 600 F de frais sur ses retraits, 1 200 F sur ses envois au même réseau, 1 000 F vers un autre réseau, 2 500 F pour un envoi à l’étranger. Total : 8 300 F. Ces chiffres sont un exemple, pas un tarif.", k: "Les frais payés le mois dernier (F)", c3: 1, champs: [ {id:"mm_ret", l:"Retraits"}, {id:"mm_res", l:"Envois même réseau"}, {id:"mm_aut", l:"Envois autre réseau"}, {id:"mm_int", l:"International (frais et change)"}, {id:"mm_fac", l:"Factures et autres"} ],
          v: function(D,H){ var t=["mm_ret","mm_res","mm_aut","mm_int","mm_fac"].reduce(function(s,k){return s+H.N(D[k]);},0); return t?'<div class="gros"><small>Vos frais du mois</small><b>'+H.F(t)+'</b><p>C’est ce que vos transferts vous ont coûté, en plus de l’argent envoyé.</p></div>':''; } },
        p: "Mes frais du mois sont écrits, type par type." },
      { t: "Combien d’opérations ?", c: "Le nombre compte autant que le prix. Avec des frais par paliers, dix petits retraits peuvent coûter plus que deux gros.",
        w: { ex: "Koffi a fait 8 retraits et 9 envois dans le mois : 17 opérations payantes. Avec 8 300 F de frais, chaque opération lui coûte en moyenne près de 490 F.", champs: [ {id:"mm_nret", l:"Nombre de retraits"}, {id:"mm_nenv", l:"Nombre d’envois"} ],
          v: function(D,H){ var n=H.N(D.mm_nret)+H.N(D.mm_nenv), t=["mm_ret","mm_res","mm_aut","mm_int","mm_fac"].reduce(function(s,k){return s+H.N(D[k]);},0); if(!n) return ''; return '<div class="gros"><small>Vos opérations payantes</small><b>'+n+' dans le mois</b><p>'+(t?'En moyenne '+H.F(t/n)+' par opération.':'Écrivez vos frais à l’écran précédent pour voir le coût moyen.')+'</p></div>'; } },
        p: "Je connais le nombre de mes opérations du mois." }
    ]},
    { t: "Mon coût réel", acq: "Je connais le coût de mes frais", desc: "Le mois, l’année, et la part de votre revenu.", e: [
      { t: "Sur le mois et sur l’année", c: "Un frais du mois se répète douze fois. C’est sur l’année qu’on voit vraiment ce qu’il coûte.",
        w: { ex: "8 300 F par mois, c’est 99 600 F par an pour Koffi : presque une rentrée scolaire.", champs: [ {id:"mm_rev", l:"Votre revenu du mois (F)", ph:"250 000"} ],
          v: function(D,H){ var t=["mm_ret","mm_res","mm_aut","mm_int","mm_fac"].reduce(function(s,k){return s+H.N(D[k]);},0), r=H.N(D.mm_rev); if(!t) return '<div class="verdict v-mid">Écrivez d’abord vos frais du mois, au chapitre 2.</div>'; var p=r?t/r*100:0; var h='<div class="gros"><small>Vos frais sur l’année</small><b>'+H.F(t*12)+'</b><p>Soit '+H.F(t)+' par mois'+(r?', '+p.toLocaleString('fr-FR',{maximumFractionDigits:1})+' % de votre revenu':'')+'.</p></div>'; if(r) h+=p<1?'<div class="verdict v-ok">Vos frais restent faibles. L’atelier vous aide à les garder ainsi.</div>':p<3?'<div class="verdict v-mid">Vos frais pèsent. Quelques gestes simples peuvent les faire baisser.</div>':'<div class="verdict v-ko">Vos frais pèsent lourd. La bonne nouvelle : c’est là qu’on gagne le plus vite.</div>'; return h; } },
        p: "Je connais mes frais sur l’année." },
      { t: "Ma plus grosse fuite", c: "On ne corrige pas tout d’un coup. On commence par le type d’opération qui coûte le plus.",
        w: { puces: { id:"mm_fuite", k:"Ce qui me coûte le plus", l:["Retraits","Envois même réseau","Envois autre réseau","International","Factures et autres"] },
          v: function(D,H){ var m={"Retraits":"mm_ret","Envois même réseau":"mm_res","Envois autre réseau":"mm_aut","International":"mm_int","Factures et autres":"mm_fac"}[D.mm_fuite]; if(!m) return ''; var x=H.N(D[m]); return x?'<div class="gros"><small>'+H.esc(D.mm_fuite)+'</small><b>'+H.F(x*12)+' par an</b><p>C’est votre première cible. Le chapitre 4 vous donne les gestes.</p></div>':'<div class="verdict v-mid">Écrivez le frais de ce type au chapitre 2 pour voir son coût sur l’année.</div>'; } },
        p: "J’ai repéré ma plus grosse fuite." }
    ]},
    { t: "Les gestes qui réduisent", acq: "Je connais les gestes qui réduisent mes frais", desc: "Payer plutôt que retirer, regrouper, choisir le bon canal, comparer.", e: [
      { t: "Le bon réflexe", c: "Souvent, le geste le moins cher est aussi le plus simple. Choisissez, puis lisez l’explication.",
        w: { quiz: [
          ["Awa fait ses courses au marché chez une vendeuse qui accepte le mobile money", ["Retirer puis payer en espèces","Payer directement avec son téléphone"], 1, "Le paiement marchand évite le frais de retrait. Pour celui qui paie, il est souvent gratuit."],
          ["Moussa envoie de l’argent à sa mère cinq fois dans le mois", ["Continuer par petits envois","Regrouper en un ou deux envois"], 1, "Avec des grilles par paliers, plusieurs petits envois coûtent souvent plus qu’un envoi groupé. Vérifiez sur votre grille."],
          ["Fatou envoie de l’argent à son frère qui a le même opérateur qu’elle", ["Envoyer sur le même réseau","Passer par un autre canal"], 0, "Sur le même réseau, le frais est souvent plus bas. Quand ce n’est pas possible, l’interopérabilité entre réseaux permet d’envoyer quand même : comparez son coût."],
          ["Ibrahim doit envoyer 100 000 F à un proche à l’étranger", ["Choisir le frais affiché le plus bas","Comparer la somme qui arrive"], 1, "Un frais bas peut cacher un taux de change défavorable. Ce qui compte, c’est la somme reçue au bout."]
        ] },
        p: "Je connais les gestes qui coûtent moins." },
      { t: "Mes gestes à moi", c: "Choisissez deux ou trois gestes, pas plus. Ceux que vous tiendrez vraiment.",
        w: { puces: { id:"mm_gestes", k:"Les gestes que je retiens", m:1, l:["Payer plutôt que retirer","Regrouper mes envois","Retirer moins souvent, en une fois","Envoyer sur le même réseau quand c’est possible","Comparer avant d’envoyer entre réseaux ou vers la banque","Comparer la somme reçue avant d’envoyer à l’étranger","Relire la grille de mon opérateur"] },
          v: function(D){ var n=(D.mm_gestes||[]).length; if(!n) return ''; return n>3?'<div class="verdict v-mid">'+n+' gestes, c’est beaucoup. Gardez les deux ou trois qui touchent votre plus grosse fuite.</div>':'<div class="verdict v-ok">'+n+' geste'+(n>1?'s':'')+' choisi'+(n>1?'s':'')+'. C’est assez pour voir la différence dès le mois prochain.</div>'; } },
        p: "J’ai choisi mes gestes." },
      { t: "Mon objectif d’économie", c: "Fixez une baisse réaliste. Même un tiers de frais en moins, sur l’année, change beaucoup.",
        w: { ex: "Koffi vise 3 000 F de frais en moins par mois. Sur l’année, cela fait 36 000 F gardés pour lui.", champs: [ {id:"mm_eco", l:"Frais en moins visés chaque mois (F)", ph:"3 000"} ],
          v: function(D,H){ var e=H.N(D.mm_eco), t=["mm_ret","mm_res","mm_aut","mm_int","mm_fac"].reduce(function(s,k){return s+H.N(D[k]);},0); if(!e) return ''; if(t&&e>t) return '<div class="verdict v-mid">Cet objectif dépasse vos frais du mois ('+H.F(t)+'). Choisissez un montant plus bas.</div>'; return '<div class="gros"><small>Ce que vous gardez sur l’année</small><b>'+H.F(e*12)+'</b><p>'+(t?'Vos frais passeraient de '+H.F(t)+' à '+H.F(t-e)+' par mois.':'Écrivez vos frais au chapitre 2 pour voir la baisse.')+'</p></div>'; } },
        p: "Mon objectif d’économie est fixé." }
    ]},
    { t: "Ma règle et ma sécurité", acq: "J’ai ma règle et je protège mon argent", desc: "Une règle écrite, et les bons réflexes contre les arnaques.", e: [
      { t: "Ma règle écrite", c: "Une règle courte, écrite, se tient mieux qu’une bonne intention. Une ou deux phrases suffisent.",
        w: { ex: "La règle d’Affoué : « Je retire une seule fois par semaine. Je paie chez le marchand avec mon téléphone. Avant d’envoyer à l’étranger, je compare la somme reçue. »", champs: [ {id:"mm_regle", l:"Ma règle mobile money", type:"area", ph:"Je retire au plus … fois par mois. Je …"} ] },
        p: "Ma règle est écrite." },
      { t: "Vrai dépôt ou arnaque ?", c: "Les arnaques au mobile money jouent sur la surprise et la gentillesse. Un réflexe simple les déjoue presque toutes.",
        w: { quiz: [
          ["Vous recevez un SMS « Vous avez reçu 50 000 F », puis un appel : « Je me suis trompé, renvoyez-les-moi »", ["Je renvoie tout de suite","Je vérifie mon solde dans l’appli"], 1, "Un SMS peut être faux. Seul le solde, vu dans l’appli ou par le code officiel, fait foi."],
          ["Une personne se présente comme agent de votre opérateur et demande votre code secret", ["Je le donne, c’est l’opérateur","Je ne le donne jamais"], 1, "Personne, jamais, n’a besoin de votre code secret. Pas même l’opérateur."],
          ["Un inconnu vous demande de taper un code sur votre téléphone pour « débloquer un gain »", ["Je raccroche","Je tape le code"], 0, "Ce code peut lancer un transfert depuis votre compte. On raccroche et on vérifie auprès du service client officiel."]
        ] },
        p: "Je sais reconnaître les arnaques courantes." },
      { t: "Mes réflexes de sécurité", f: ["Mon code secret reste dans ma tête : ni écrit sur le téléphone, ni donné à un proche, ni à un agent.", "Je vérifie mon solde dans l’appli avant de renvoyer de l’argent à qui que ce soit.", "En cas de doute, j’appelle le service client officiel de mon opérateur, pas un numéro reçu par SMS."], c: "Économiser des frais ne sert à rien si une arnaque emporte tout. Ces trois réflexes protègent votre argent.",
        p: "Mes réflexes de sécurité sont en place." }
    ]}
  ],
  fin: {
    k: "Ma fiche mobile money", titre: "Vos frais ont un plan",
    fiche: [
      ["Frais du mois", function(D,H){ var t=["mm_ret","mm_res","mm_aut","mm_int","mm_fac"].reduce(function(s,k){return s+H.N(D[k]);},0); return t?H.F(t):''; }],
      ["Frais sur l’année", function(D,H){ var t=["mm_ret","mm_res","mm_aut","mm_int","mm_fac"].reduce(function(s,k){return s+H.N(D[k]);},0); return t?H.F(t*12):''; }],
      ["Opérations payantes du mois", function(D,H){ var n=H.N(D.mm_nret)+H.N(D.mm_nenv); return n?String(n):''; }],
      ["Ma plus grosse fuite", function(D){ return D.mm_fuite||''; }],
      ["Mes gestes", function(D){ return (D.mm_gestes||[]).join(', '); }],
      ["Économie visée", function(D,H){ var e=H.N(D.mm_eco); return e?H.F(e)+' par mois, '+H.F(e*12)+' par an':''; }],
      ["Ma règle", function(D){ return D.mm_regle||''; }]
    ],
    suite: { t: "Où est passé mon argent ?", p: "Vos frais sont sous contrôle ? Regardez maintenant tout votre mois, pour trouver les autres fuites.", lien: "atelier-ou-passe-mon-argent.html", b: "Ouvrir l’atelier" }
  }
};
