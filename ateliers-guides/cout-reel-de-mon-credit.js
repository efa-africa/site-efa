/* Atelier guidé · Ce que mon crédit coûte vraiment (univers Emprunter, 3/8, gratuit) */
function crP(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR')+' %'; }
function crCalc(D,H){ var c=H.N(D.cr_mt), n=Math.round(H.N(D.cr_dur)), t=H.N(D.cr_tx)/100, deg=D.cr_mode==='Sur ce qui reste dû'; if(!c||!n||!D.cr_tx) return null;
  var mens=deg?(t?c*t/(1-Math.pow(1+t,-n)):c/n):(c+c*t*n)/n, int=mens*n-c, fr=H.N(D.cr_fr), ep=H.N(D.cr_ep);
  /* taux réel : ce que je reçois vraiment (montant − frais − épargne bloquée), ce que je paie, épargne rendue à la fin */
  var recu=c-fr-ep, f=function(r){ var v=recu; for(var i=1;i<=n;i++) v-=mens/Math.pow(1+r,i); v+=ep/Math.pow(1+r,n); return v; };
  var lo=0, hi=1; if(recu<=0) return {mens:mens,int:int,fr:fr,ep:ep,recu:recu,tot:int+fr,reel:null,n:n,c:c};
  for(var k=0;k<60;k++){ var mid=(lo+hi)/2; if(f(mid)>0) hi=mid; else lo=mid; }
  return {mens:mens,int:int,fr:fr,ep:ep,recu:recu,tot:int+fr,reel:(lo+hi)/2*12*100,n:n,c:c,aff:t*12*100}; }
window.ATELIER = {
  id: "cout-reel-de-mon-credit", titre: "Ce que mon crédit coûte vraiment", h1: "Le taux qu’on vous annonce n’est presque jamais le taux que vous payez.", voix: "auto",
  question: { t: "« 2 % par mois », dit l’agent. Combien cela fait-il par an, en réalité ?", r: [
    ["a", "24 % par an : 2 fois 12.", "C’est le calcul naturel, mais il oublie deux choses : la base du calcul et les frais. Si les 2 % portent sur le capital de départ pendant toute la durée, le coût réel approche le double.", false],
    ["b", "Cela dépend de la base du calcul et des frais.", "Exactement. Vous allez calculer votre mensualité, le coût total en francs et le taux réel, frais et épargne bloquée compris.", true] ] },
  chapitres: [
    { t: "Deux façons de compter", acq: "Je distingue les deux modes de calcul", desc: "Sur le capital de départ, ou sur ce qui reste dû.", e: [
      { t: "Même taux, deux prix", f: ["Sur le capital de départ : on vous compte l’intérêt sur toute la somme, tous les mois, même quand vous en avez déjà remboursé la moitié.", "Sur ce qui reste dû : l’intérêt baisse à mesure que vous remboursez. C’est le calcul le plus juste.", "À taux affiché égal, le premier coûte presque deux fois plus cher que le second."], c: "Demandez toujours : « Le taux se calcule sur quoi ? » La réponse change le prix du simple au double.", p: "Je connais les deux modes de calcul." },
      { t: "Vérifiez votre intuition", w: { quiz: [
        ["100 000 F sur 10 mois à 2 % par mois sur le capital de départ : combien d’intérêts ?", ["20 000 F","Environ 11 300 F"], 0, "2 000 F par mois pendant 10 mois, même le dernier mois, où vous ne devez presque plus rien."],
        ["Le même crédit à 2 % par mois sur ce qui reste dû : combien d’intérêts ?", ["20 000 F","Environ 11 300 F"], 1, "L’intérêt baisse chaque mois avec le capital restant."],
        ["Pour comparer deux crédits, le mieux est de regarder…", ["Le taux par mois","Le total à rembourser, en francs"], 1, "Le total en francs contient tout : mode de calcul, durée et frais."] ] }, p: "J’ai répondu aux trois questions." } ]},
    { t: "Mon crédit, au franc près", acq: "Je calcule ma mensualité et mon coût total", desc: "Mensualité, intérêts, frais.", e: [
      { t: "Ma mensualité et mon coût", c: "Reprenez les conditions exactes de votre offre.",
        w: { ex: "Koffi (exemple fictif) : 300 000 F sur 12 mois, 2 % par mois sur le capital de départ. Mensualité : 31 000 F. Intérêts : 72 000 F.", k: "Votre crédit · vos chiffres restent sur votre téléphone, EFA ne les garde pas. Vous pouvez mettre des chiffres fictifs.", champs: [ {id:"cr_mt", l:"Montant emprunté (F)", ph:"300 000"}, {id:"cr_dur", l:"Durée (mois)", ph:"12"}, {id:"cr_tx", l:"Taux par mois (%)", ph:"2"} ], puces: { id:"cr_mode", k:"Le taux se calcule…", l:["Sur le capital de départ","Sur ce qui reste dû"] },
          v: function(D,H){ var R=crCalc(D,H); if(!R||!D.cr_mode) return '';
            return '<div class="gros"><small>Votre mensualité</small><b>'+H.F(R.mens)+'</b><p>Total remboursé : '+H.F(R.mens*R.n)+', dont '+H.F(R.int)+' d’intérêts.</p></div>'; } }, p: "J’ai calculé ma mensualité." },
      { t: "Ce qui s’ajoute au taux", c: "Frais de dossier, assurance, carnet, adhésion : ils se paient souvent au départ, donc vous recevez moins que la somme empruntée. Et si l’on vous demande de bloquer une épargne, vous payez des intérêts sur de l’argent que vous n’utilisez pas.",
        w: { ex: "Koffi (fictif) : 9 000 F de frais et 30 000 F d’épargne bloquée. Il emprunte 300 000 F mais ne dispose que de 261 000 F. Son coût : 81 000 F. Son taux réel : environ 57 % par an, pour 24 % affichés.", k: "Les à-côtés", champs: [ {id:"cr_fr", l:"Frais payés au départ : dossier, assurance, adhésion (F)", ph:"9 000"}, {id:"cr_ep", l:"Épargne à bloquer, rendue à la fin (F)", ph:"30 000"} ],
          v: function(D,H){ var R=crCalc(D,H); if(!R||!D.cr_mode) return '<div class="verdict v-mid">Remplissez d’abord l’écran précédent.</div>';
            if(R.reel===null) return '<div class="verdict v-ko">Les frais et l’épargne bloquée dépassent la somme empruntée : vérifiez vos chiffres.</div>';
            var h='<div class="gros"><small>Votre taux réel, par an</small><b>environ '+crP(R.reel)+'</b><p>Taux affiché : '+crP(R.aff)+' par an. Vous disposez vraiment de '+H.F(R.recu)+' sur '+H.F(R.c)+' empruntés. Coût total : '+H.F(R.tot)+'.</p></div>';
            return h+(R.reel>R.aff*1.6?'<div class="verdict v-mid">Votre taux réel dépasse largement le taux affiché. C’est fréquent, et ce n’est pas forcément un abus : mais c’est ce chiffre qu’il faut comparer entre deux offres. Un plafond légal existe : demandez-le à l’institution ou à la structure de suivi de la microfinance.</div>':'<div class="verdict v-ok">Votre taux réel reste proche du taux affiché. Gardez ce calcul pour comparer avec une autre offre.</div>'); } }, p: "J’ai calculé mon taux réel." } ]},
    { t: "Comparer avec les autres sources", acq: "Je compare le crédit à la tontine et au prêteur", desc: "Ce que coûtent les autres solutions.", e: [
      { t: "Tontine, collecteur, prêteur", f: ["La tontine : recevoir son tour tôt, c’est emprunter au groupe sans intérêt ; le recevoir tard, c’est épargner sans intérêt. Elle ne coûte rien en francs, mais elle a une date.", "Le collecteur : il garde votre épargne et prélève en général une mise par mois. C’est un service payant, pas un crédit.", "Le prêteur privé : « tu me rends 120 pour 100 dans un mois », cela fait 20 % par mois. Aucun commerce ne gagne cela durablement."], c: "Avant de signer un crédit, regardez si votre tour de tontine ou votre épargne ne couvre pas le besoin, même en partie.",
        w: { consignes: 1, k: "Testez une offre de prêteur", champs: [ {id:"cr_p1", l:"Somme reçue (F)", ph:"100 000"}, {id:"cr_p2", l:"Somme à rendre (F)", ph:"120 000"}, {id:"cr_p3", l:"Dans combien de jours", ph:"30"} ],
          v: function(D,H){ var a=H.N(D.cr_p1), b=H.N(D.cr_p2), j=H.N(D.cr_p3); if(!a||!b||!j) return ''; var m=(b-a)/a*30/j*100;
            return '<div class="gros"><small>Cela fait</small><b>'+crP(m)+' par mois</b><p>Soit environ '+crP(m*12)+' par an, en calcul simple.</p></div>'+(m>5?'<div class="verdict v-ko">C’est un prix que presque aucune activité ne peut payer. Ce type de prêt se rembourse le plus souvent avec un autre prêt.</div>':'<div class="verdict v-mid">Comparez ce taux à votre taux réel de l’écran précédent, et au gain que l’argent vous apporte.</div>'); } }, p: "J’ai comparé avec les autres sources." },
      { t: "Lire l’échéancier", c: "L’échéancier est le tableau qui fait foi : chaque date, chaque montant, la part de capital et la part d’intérêts. Avant de signer, vérifiez trois choses.",
        f: ["Le total des échéances correspond à votre calcul.", "La date de la première échéance vous laisse le temps de vendre.", "Les pénalités de retard et leur mode de calcul sont écrits."], w: { consignes: 1, puces: { id:"cr_ech", k:"Mon échéancier…", l:["Je l’ai, et il correspond","Je l’ai, il y a un écart","Je ne l’ai pas encore"] }, v: function(D){ return D.cr_ech==='Je l’ai, il y a un écart'?'<div class="verdict v-mid">Demandez l’explication de l’écart avant de signer : un frais non annoncé s’y cache souvent.</div>':D.cr_ech==='Je ne l’ai pas encore'?'<div class="verdict v-mid">Demandez-le. On ne signe pas un crédit sans son échéancier.</div>':D.cr_ech?'<div class="verdict v-ok">Vous signez en connaissant le prix. C’est tout l’enjeu.</div>':''; } }, p: "J’ai vérifié mon échéancier." } ]}
  ],
  fin: { k: "Ma fiche « le vrai prix de mon crédit »", titre: "Vous connaissez le vrai prix de votre crédit",
    fiche: [ ["Mon crédit", function(D,H){ var R=crCalc(D,H); return R?H.F(R.c)+' sur '+R.n+' mois · '+(D.cr_mode||''):''; }],
      ["Mensualité", function(D,H){ var R=crCalc(D,H); return R&&D.cr_mode?H.F(R.mens):''; }],
      ["Coût total, frais compris", function(D,H){ var R=crCalc(D,H); return R&&D.cr_mode?H.F(R.tot):''; }],
      ["Taux réel par an", function(D,H){ var R=crCalc(D,H); return R&&D.cr_mode&&R.reel!==null?'environ '+crP(R.reel)+' (affiché : '+crP(R.aff)+')':''; }],
      ["Échéancier", function(D){ return D.cr_ech||''; }] ],
    suite: { t: "Bien utiliser mon crédit", p: "Vous connaissez le prix. L’atelier suivant vous aide à faire travailler cet argent pour qu’il rapporte plus qu’il ne coûte.", lien: "atelier-bien-utiliser-mon-credit.html", b: "Atelier suivant" } }
};
