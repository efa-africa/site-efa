/* Atelier guidé · Vente en réseau : combien ça rapporte vraiment ? */
function vrCalc(D,H){
  var n=function(k){ return H.N(D[k]); };
  var entree=n("vr_kit")+n("vr_form")+n("vr_mat");
  var achm=n("vr_achm"), autres=n("vr_tel")+n("vr_dep")+n("vr_reu"), mois=achm+autres;
  var rep=Math.max(0,Math.min(100,n("vr_rep"))), perte=n("vr_stock")*(1-rep/100);
  var cout12=entree+12*mois+perte;
  var ventes=n("vr_vmois"), pv=n("vr_pv"), pa=n("vr_pa");
  var sup=Math.max(0,ventes*pa-achm), ventes12=12*(ventes*pv-sup);
  var com=n("vr_com"), fil=n("vr_fil"), bonus=n("vr_bonus");
  var gain12=ventes12+12*com+bonus, net=gain12-cout12;
  var part=(com+ventes*pv)>0?com/(com+ventes*pv):0;
  /* ventes par mois pour couvrir tous les frais, sans commissions */
  var fixe=entree/12+autres+perte/12, vnec=0;
  if(pv>0){ var v1=Math.ceil((fixe+achm)/pv); if(v1*pa<=achm) vnec=v1; else if(pv>pa) vnec=Math.ceil(fixe/(pv-pa)); else vnec=-1; }
  /* filleuls actifs nécessaires, en plus des ventes actuelles */
  var cpf=fil>0?com/fil:0, manque=Math.max(0,cout12-ventes12-bonus), fnec=cpf>0?Math.ceil(manque/12/cpf):0;
  return {entree:entree,mois:mois,perte:perte,cout12:cout12,ventes12:ventes12,com:com,gain12:gain12,net:net,part:part,vnec:vnec,cpf:cpf,fnec:fnec,aCout:cout12>0,aGain:(ventes*pv+com+bonus)>0};
}
window.ATELIER = {
  id: "vente-en-reseau",
  titre: "Vente en réseau : combien ça rapporte vraiment ?",
  h1: "Ce qui compte, c’est ce qui reste une fois tout payé.",
  voix: "auto",
  question: {
    t: "On vous dit : « Avec ce business, tu gagneras 300 000 F par mois. » Que demandez-vous d’abord ?",
    r: [
      ["a", "Combien gagnent ceux qui ont réussi.", "C’est ce qu’on montre en premier, et c’est normal d’être curieux. Mais quelques réussites ne disent rien de ce que gagne un membre ordinaire. On va chercher ce chiffre-là.", false],
      ["b", "Combien je vais dépenser, et ce que gagne un membre ordinaire.", "C’est la bonne question. On va la transformer en calcul : vos frais, vos vraies rentrées, puis votre décision.", true]
    ]
  },
  chapitres: [
    { t: "Comprendre le modèle", acq: "Je sais d’où vient l’argent", desc: "Vendre à des clients ou recruter des filleuls : deux métiers très différents.", e: [
      { t: "Deux façons de gagner", f: ["Vendre : un client hors du réseau achète un produit parce qu’il en a besoin. Vous gardez la marge.", "Recruter : vous touchez une part de ce que vos filleuls achètent ou paient pour entrer."], c: "Dans une vente en réseau, l’argent arrive par deux portes. La question est de savoir laquelle fait vraiment vivre l’affaire.",
        w: { consignes: 1, puces: [ { id:"vr_sit", k:"Votre situation", l:["On me propose d’entrer","J’y suis déjà"] }, { id:"vr_pres", k:"Quand on vous a présenté l’affaire, on a surtout parlé…", l:["Des produits et des clients","Du recrutement et des revenus"] } ],
          v: function(D){ if(!D.vr_pres) return ''; return D.vr_pres==="Des produits et des clients"?'<div class="verdict v-ok">Bon point de départ : une affaire qui tient repose sur des clients qui rachètent. On va vérifier que les chiffres suivent.</div>':'<div class="verdict v-mid">À noter : quand on parle d’abord de recrutement, il faut vérifier de près d’où vient l’argent. C’est l’objet des écrans suivants.</div>'; } },
        p: "Je sais par quelle porte l’argent doit arriver." },
      { t: "Vente réelle ou pyramide ?", c: "Une vente en réseau légale vit de clients qui achètent. Un système pyramidal vit surtout de nouveaux membres qui paient. Dans beaucoup de pays, ce second modèle est interdit.",
        w: { quiz: [ ["Awa gagne surtout la marge sur les savons qu’elle vend à ses voisines et collègues.", ["Vente réelle","Plutôt pyramidal"], 0, "L’argent vient de clients hors du réseau qui utilisent le produit."], ["Pour garder son rang, Moussa doit acheter 60 000 F de produits chaque mois, même s’il ne les vend pas.", ["Vente réelle","Plutôt pyramidal"], 1, "Ces achats servent à rester dans le système, pas à servir des clients."], ["Le revenu de Fatou vient surtout des kits de départ payés par ses filleuls.", ["Vente réelle","Plutôt pyramidal"], 1, "Elle gagne quand quelqu’un entre, pas quand un client achète."] ] },
        p: "Je sais distinguer une vente réelle d’un système pyramidal." },
      { t: "L’offre en clair", c: "Avant de calculer, on écrit l’offre telle qu’on l’a reçue. Noir sur blanc, la promesse devient un chiffre à vérifier.",
        w: { ex: "Le cousin d’Affoué lui propose : « Kit de départ à 150 000 F, produits de santé. Tu peux gagner 300 000 F par mois d’ici trois mois. »", k: "L’offre que vous avez reçue", champs: [ {id:"vr_qui", l:"Qui vous la propose (lien avec vous)", type:"txt", ph:"Un cousin, une collègue…"}, {id:"vr_prod", l:"Les produits vendus", type:"txt", ph:"Santé, beauté, boissons…"}, {id:"vr_prom", l:"Revenu promis par mois (F)", ph:"300 000"} ] },
        p: "L’offre et la promesse sont écrites." }
    ]},
    { t: "Ce que je dépense", acq: "Je connais mes vrais frais", desc: "Le kit, les achats de chaque mois, les à-côtés et le stock qui dort.", e: [
      { t: "Le ticket d’entrée", c: "On commence par ce qu’il faut payer avant d’avoir vendu quoi que ce soit.",
        w: { ex: "Koffi paie un kit de 150 000 F et un séminaire de démarrage de 50 000 F. Il entre avec 200 000 F de frais.", k: "Vos frais d’entrée", c3: 1, champs: [ {id:"vr_kit", l:"Kit de départ (F)"}, {id:"vr_form", l:"Formation, séminaire (F)"}, {id:"vr_mat", l:"Matériel, présentoir (F)"} ],
          v: function(D,H){ var R=vrCalc(D,H); return R.entree?'<div class="gros"><small>Votre ticket d’entrée</small><b>'+H.F(R.entree)+'</b><p>Dépensé avant la première vente.</p></div>':''; } },
        p: "Mes frais d’entrée sont écrits." },
      { t: "Ce qui sort chaque mois", c: "Les achats « pour garder son rang » sont des dépenses, même si vous gardez les produits. On compte aussi le téléphone, les déplacements et les réunions.",
        w: { ex: "Koffi achète 40 000 F de produits par mois pour rester actif, et dépense 20 000 F en crédit téléphone, transport et réunions. Soit 60 000 F par mois, 720 000 F sur un an.", k: "Vos dépenses de chaque mois", champs: [ {id:"vr_achm", l:"Achats obligatoires ou pour garder son rang (F)"}, {id:"vr_tel", l:"Téléphone et internet (F)"}, {id:"vr_dep", l:"Déplacements, livraisons (F)"}, {id:"vr_reu", l:"Réunions, formations du mois (F)"} ],
          v: function(D,H){ var R=vrCalc(D,H); if(!R.mois) return ''; return '<div class="gros"><small>Vos dépenses du mois</small><b>'+H.F(R.mois)+' par mois</b><p>Sur 12 mois, avec l’entrée : '+H.F(R.entree+12*R.mois)+'.</p></div>'; } },
        p: "Mes dépenses mensuelles sont écrites." },
      { t: "Le stock qui dort", c: "Un produit qui n’est pas vendu n’est pas de l’argent : c’est une dépense en attente. Estimez ce que vous pourriez vraiment en récupérer.",
        w: { ex: "Koffi a 100 000 F de produits invendus. S’il ne peut en revendre que 30 %, il perd 70 000 F. Son coût total sur 12 mois monte à 990 000 F.", champs: [ {id:"vr_stock", l:"Valeur du stock invendu (F)"}, {id:"vr_rep", l:"Part que je pourrais revendre ou rendre (%)", ph:"30"} ],
          v: function(D,H){ var R=vrCalc(D,H); if(!R.aCout) return ''; return '<div class="gros"><small>Votre coût total sur 12 mois</small><b>'+H.F(R.cout12)+'</b><p>'+(R.perte?'Dont '+H.F(R.perte)+' de stock probablement perdu.':'Entrée et dépenses mensuelles comprises.')+'</p></div>'; } },
        p: "Mon coût total sur 12 mois est écrit." }
    ]},
    { t: "Ce que je gagne vraiment", acq: "Je connais mon résultat net", desc: "Les ventes à de vrais clients, les commissions, puis ce qui reste.", e: [
      { t: "Mes ventes à de vrais clients", c: "Ne comptez que ce que des clients hors du réseau vous paient. Ce que vous consommez vous-même, ou ce que la famille prend sans payer, n’est pas une vente.",
        w: { ex: "Koffi vend 4 produits par mois à 12 000 F à des clients. Il les a payés 9 000 F chacun, déjà compris dans ses 40 000 F d’achats du mois. Il encaisse 48 000 F par mois.", k: "Vos ventes d’un mois normal", c3: 1, champs: [ {id:"vr_vmois", l:"Produits vendus par mois"}, {id:"vr_pv", l:"Prix de vente moyen (F)"}, {id:"vr_pa", l:"Prix d’achat moyen (F)"} ],
          v: function(D,H){ var n=H.N(D.vr_vmois), pv=H.N(D.vr_pv); if(!n||!pv) return ''; var pa=H.N(D.vr_pa), m=pv-pa; return '<div class="gros"><small>Ce que vos clients vous paient</small><b>'+H.F(n*pv)+' par mois</b><p>'+(pa?'Marge par produit : '+H.F(m)+'.'+(m<=0?' Vous vendez sans marge.':''):'')+'</p></div>'; } },
        p: "Mes ventes réelles sont écrites." },
      { t: "Mes commissions", c: "Les commissions viennent des achats de vos filleuls. Regardez quelle part de vos rentrées elles représentent : c’est le chiffre qui dit d’où vient l’argent.",
        w: { ex: "Koffi touche 15 000 F de commissions par mois grâce à 3 filleuls actifs, soit 5 000 F par filleul.", c3: 1, champs: [ {id:"vr_com", l:"Commissions par mois (F)"}, {id:"vr_fil", l:"Filleuls actifs"}, {id:"vr_bonus", l:"Primes reçues sur 12 mois (F)"} ],
          v: function(D,H){ var R=vrCalc(D,H); if(!R.com) return ''; var p=Math.round(R.part*100); return '<div class="gros"><small>Part de vos rentrées qui vient des commissions</small><b>'+p+' %</b><p>'+(R.cpf?'Environ '+H.F(R.cpf)+' par filleul et par mois.':'')+'</p></div>'+(p>=50?'<div class="verdict v-ko">Vous gagnez surtout grâce au recrutement. C’est le point à surveiller de plus près.</div>':'<div class="verdict v-ok">L’essentiel de vos rentrées vient de vraies ventes.</div>'); } },
        p: "Mes commissions sont écrites." },
      { t: "Ce qui reste vraiment", c: "Voici le vrai calcul : tout ce qui rentre, moins tout ce qui sort, sur 12 mois. Ajoutez le temps passé : il compte aussi.",
        w: { ex: "Koffi encaisse 756 000 F sur un an et dépense 990 000 F. Il perd 234 000 F. Pour rentrer dans ses frais sans commissions, il lui faudrait 15 ventes par mois, au lieu de 4.", champs: [ {id:"vr_h", l:"Heures passées par semaine"} ],
          v: function(D,H){ var R=vrCalc(D,H); if(!R.aCout||!R.aGain) return ''; var h=H.N(D.vr_h), pr=H.N(D.vr_prom), s='<div class="gros"><small>Votre résultat net sur 12 mois</small><b>'+(R.net<0?'− ':'')+H.F(Math.abs(R.net))+'</b><p>Rentrées '+H.F(R.gain12)+' · dépenses '+H.F(R.cout12)+'.'+(h&&R.net>0?' Environ '+H.F(R.net/(h*52))+' par heure.':'')+(pr?' Promis : '+H.F(pr)+' par mois. Calculé : '+H.F(R.net/12)+' par mois.':'')+'</p></div>';
            var l=[]; if(R.vnec>0) l.push(R.vnec+' ventes par mois, sans commissions'); if(R.vnec<0) l.push('aucun nombre de ventes, car vous vendez sans marge'); if(R.fnec>0) l.push(R.fnec+' filleuls actifs, avec vos ventes actuelles');
            if(R.net<0&&l.length) s+='<div class="verdict v-mid">Pour rentrer dans vos frais, il faudrait : '+l.join(', ou ')+'.</div>'; else if(R.net>=0) s+='<div class="verdict v-ok">Vos rentrées couvrent vos frais. Vérifiez que ce rythme est tenable sans recruter vos proches.</div>';
            return s; } },
        p: "Mon résultat net est écrit." }
    ]},
    { t: "Les signaux d’alerte", acq: "Je repère les signaux d’alerte", desc: "Ce qui doit faire ralentir, et les chiffres à demander.", e: [
      { t: "Ce que je constate", c: "Un signal seul ne prouve rien. Plusieurs ensemble disent qu’il faut ralentir et demander des preuves.",
        w: { puces: { id:"vr_sig", k:"Cochez ce que vous constatez", m:1, l:["On gagne surtout en recrutant","Achats obligatoires pour garder son rang","Stock qu’on ne peut ni revendre ni rendre","Pression pour recruter la famille, les amis, l’église","Revenus des « leaders » montrés sans preuve","Revenus moyens des membres jamais publiés","Il faut payer pour monter de niveau"] },
          v: function(D){ var n=(D.vr_sig||[]).length; if(!n) return ''; return '<div class="verdict '+(n>=3?'v-ko':n===2?'v-mid':'v-ok')+'">'+n+' signal'+(n>1?'s':'')+' sur 7. '+(n>=3?'C’est beaucoup : ne versez plus rien avant d’avoir des réponses écrites.':n===2?'Prudence : demandez les chiffres de l’écran suivant.':'Un signal isolé : gardez l’œil ouvert.')+'</div>'; } },
        p: "J’ai fait le point sur les signaux d’alerte." },
      { t: "Demander les vrais chiffres", f: ["Quel est le revenu médian des membres : celui du membre du milieu, pas des meilleurs ?", "Quelle part des membres gagne plus que ce qu’elle dépense ?", "Le stock invendu peut-il être repris, à quel prix, et dans quel délai ?", "Où est-ce écrit dans le contrat ?"], c: "Une affaire sérieuse connaît ces chiffres et les donne par écrit. Le revenu médian dit ce que gagne un membre ordinaire.",
        w: { consignes: 1, puces: { id:"vr_med", k:"Le revenu médian des membres…", l:["M’a été donné par écrit","Ne m’a pas été donné clairement"] }, champs: [ {id:"vr_repo", l:"Ce qu’on m’a répondu", type:"area", ph:"On m’a dit que…"} ] },
        p: "J’ai posé les questions et noté les réponses." }
    ]},
    { t: "Décider", acq: "Ma décision est écrite", desc: "Un verdict chiffré, une décision, et la suite si vous sortez.", e: [
      { t: "Mon verdict", c: "On réunit tout : votre résultat net, la part des commissions et les signaux. Puis vous décidez, en une phrase.",
        w: { puces: { id:"vr_dec", k:"Ma décision", l:["J’entre","J’attends","Je sors"] }, champs: [ {id:"vr_pq", l:"Pourquoi, en une phrase", type:"area", ph:"Je décide de… parce que…"} ],
          v: function(D,H){ var R=vrCalc(D,H), s=(D.vr_sig||[]).length+(D.vr_med==="Ne m’a pas été donné clairement"?1:0); if(!R.aCout||!R.aGain) return ''; var ko=R.net<0&&(s>=3||R.part>=0.5), ok=R.net>0&&s<=1&&R.part<0.5;
            return '<div class="verdict '+(ok?'v-ok':ko?'v-ko':'v-mid')+'">'+(ok?'Les chiffres tiennent et les signaux sont rares. Si vous continuez, refaites ce calcul tous les trois mois.':ko?'Vous perdez de l’argent et l’affaire repose surtout sur le recrutement ou sur des signaux d’alerte. Les chiffres plaident pour sortir.':'Les chiffres ne sont pas assez clairs. Attendre, demander les réponses écrites et ne plus rien acheter d’ici là est une décision raisonnable.')+'</div>'; } },
        p: "Ma décision est écrite." },
      { t: "Si je sors, et après", f: ["J’arrête les achats mensuels dès ce mois-ci, même si on me parle de perdre mon rang.", "Je demande par écrit la reprise du stock ou un remboursement, selon ce que prévoit mon contrat.", "Je ne recrute pas mes proches pour rattraper ce que j’ai dépensé.", "Je compare avec une activité à moi, avec l’outil « Avec 100 000 F, je lance quoi ? »."], c: "Sortir n’est pas un échec : c’est arrêter une perte. La même somme peut servir une activité dont vous êtes le seul patron.",
        w: { consignes: 1, champs: [ {id:"vr_alt", l:"Une activité à moi que je pourrais lancer avec la même somme", type:"txt", large:1, ph:"Vente de jus, couture, petit commerce…"} ] },
        p: "Mes prochaines étapes sont écrites." }
    ]}
  ],
  fin: {
    k: "Ma fiche vente en réseau", titre: "Votre décision repose sur un vrai calcul",
    fiche: [
      ["Ma situation", function(D){ return D.vr_sit||''; }],
      ["Coût total sur 12 mois", function(D,H){ var R=vrCalc(D,H); return R.aCout?H.F(R.cout12):''; }],
      ["Rentrées sur 12 mois", function(D,H){ var R=vrCalc(D,H); return R.aGain?H.F(R.gain12):''; }],
      ["Résultat net sur 12 mois", function(D,H){ var R=vrCalc(D,H); return R.aCout&&R.aGain?(R.net<0?'− ':'')+H.F(Math.abs(R.net)):''; }],
      ["Ventes nécessaires pour rentrer dans mes frais", function(D,H){ var R=vrCalc(D,H); return R.vnec>0?R.vnec+' par mois':R.vnec<0?'impossible sans marge':''; }],
      ["Part des commissions dans mes rentrées", function(D,H){ var R=vrCalc(D,H); return R.com?Math.round(R.part*100)+' %':''; }],
      ["Signaux d’alerte repérés", function(D){ var n=(D.vr_sig||[]).length; return n?n+' sur 7':''; }],
      ["Ma décision", function(D){ return D.vr_dec?D.vr_dec+(D.vr_pq?' : '+D.vr_pq:''):''; }]
    ],
    suite: { t: "Investir dans une activité : est-ce que ça rapporte ?", p: "Vous avez une autre idée pour la même somme ? Le prochain atelier fait le même calcul honnête pour une activité à vous.", lien: "atelier-investir-activite.html", b: "Ouvrir l’atelier" }
  }
};
