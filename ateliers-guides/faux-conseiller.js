/* Atelier guidé · Faux conseiller, faux placement : repérer la manipulation */
window.ATELIER = {
  id: "faux-conseiller",
  titre: "Faux conseiller, faux placement : repérer la manipulation",
  h1: "Quand l’offre vient vers vous, c’est à vous de vérifier.",
  voix: "auto",
  question: {
    t: "Un « coach » vous écrit sur WhatsApp : 20 % par mois, places limitées jusqu’à ce soir. Que faites-vous ?",
    r: [
      ["a", "Je demande les détails, pour ne pas rater l’occasion.", "C’est un réflexe très humain : la peur de rater quelque chose. C’est justement sur elle que comptent les faux conseillers. Cet atelier vous aide à la reconnaître.", false],
      ["b", "Je ne donne pas suite, et je vérifie moi-même, plus tard.", "C’est le bon réflexe. Une vraie occasion supporte d’attendre et d’être vérifiée. Cet atelier vous donne les mots et les gestes pour le faire à chaque fois.", true]
    ]
  },
  chapitres: [
    { t: "Le premier contact", acq: "Je reconnais un premier contact suspect", desc: "Inconnu aimable, faux profil, groupe qui affiche des gains, nom d’une vraie banque.", e: [
      { t: "Ce que j’ai déjà reçu", c: "Le premier message est presque toujours aimable et inattendu. C’est lui qui vient vers vous, pas l’inverse.",
        w: { puces: { id:"fc_recu", k:"Ce que vous ou un proche avez déjà reçu", m:1, l:["Un inconnu très aimable sur WhatsApp","Un groupe Telegram ou Facebook qui affiche des gains","Un « coach en investissement »","Un message au nom d’une vraie banque ou SGI","Un proche qui « gagne déjà » et vous invite","Un appel d’un numéro inconnu","Une vidéo où une personnalité « recommande »"] } },
        p: "J’ai repéré les premiers contacts que j’ai déjà reçus." },
      { t: "Vrai ou faux profil ?", c: "Un logo, un nom connu ou une photo en costume ne prouvent rien : tout cela se copie en une minute.",
        w: { quiz: [
          ["Le profil porte le logo d’une vraie banque, mais vous écrit depuis un numéro personnel.", ["Rassurant","Signal d’alarme"], 1, "Une banque ou une SGI ne démarche pas ses clients depuis un numéro personnel. Le logo a pu être copié."],
          ["La personne vous écrit la première, alors que vous n’aviez rien demandé.", ["Rassurant","Signal d’alarme"], 1, "Un placement sérieux, c’est vous qui allez le chercher. Pas l’inverse."],
          ["Vous avez appelé vous-même l’agence, sur le numéro trouvé sur son site officiel.", ["Rassurant","Signal d’alarme"], 0, "Oui : c’est vous qui avez choisi le canal. C’est la base d’une vérification."],
          ["Une personnalité connue « recommande » la plateforme dans une vidéo partagée.", ["Rassurant","Signal d’alarme"], 1, "Les noms et les visages de personnalités sont souvent utilisés sans leur accord, y compris dans de fausses vidéos."]
        ] },
        p: "Je sais qu’un logo ou un nom connu ne prouvent rien." }
    ]},
    { t: "Les leviers", acq: "Je connais les leviers de manipulation", desc: "Urgence, rareté, preuve sociale, autorité, réciprocité, confiance, religion.", e: [
      { t: "Les sept leviers", c: "Une arnaque ne vous convainc pas avec des chiffres. Elle joue sur des émotions : la peur de rater, la confiance, la gratitude.",
        w: { puces: { id:"fc_lev", k:"Ceux que vous avez déjà vus", m:1, l:["Urgence : « ce soir seulement »","Rareté : « plus que 3 places »","Preuve sociale : captures de gains","Autorité : faux titres, faux logos","Réciprocité : un petit gain versé au début","Confiance : « on est entre nous »","Religion : « c’est une bénédiction »"] },
          v: function(D){ var n=(D.fc_lev||[]).length; if(!n) return '<div class="verdict v-mid">Aucun coché pour l’instant. Gardez cette liste en tête : vous les reconnaîtrez au prochain message.</div>'; return '<div class="gros"><small>Leviers déjà rencontrés</small><b>'+n+' sur 7</b><p>Les nommer, c’est déjà les désarmer. Une offre honnête n’a besoin d’aucun d’eux.</p></div>'; } },
        p: "J’ai repéré les leviers que j’ai déjà vus." },
      { t: "Manipulation ou information ?", c: "L’information vous laisse du temps et parle aussi des risques. La manipulation vous presse et ne parle que des gains.",
        w: { quiz: [
          ["« Il ne reste que 2 places, je ferme le groupe à minuit. »", ["Manipulation","Information"], 0, "Urgence et rareté : on vous empêche de réfléchir."],
          ["« Voici le contrat. Prenez le temps de le lire et de le montrer à quelqu’un. »", ["Manipulation","Information"], 1, "On vous laisse du temps et un écrit : c’est le contraire d’une pression."],
          ["« Regarde les captures : Fatou a doublé sa mise en une semaine. »", ["Manipulation","Information"], 0, "Preuve sociale : une capture se fabrique facilement, et elle ne dit rien des retraits."],
          ["« Ce placement peut baisser : vous pouvez perdre une partie de votre argent. »", ["Manipulation","Information"], 1, "Parler du risque, c’est le signe d’une information honnête."],
          ["« Mon frère, on prie ensemble, tu peux me faire confiance. »", ["Manipulation","Information"], 0, "La foi et l’affection sont respectables. Elles ne remplacent ni un contrat, ni un agrément."]
        ] },
        p: "Je sais distinguer manipulation et information." }
    ]},
    { t: "Le faux placement", acq: "Je reconnais un faux placement", desc: "Des gains à l’écran, des retraits bloqués, des frais qui ne finissent jamais.", e: [
      { t: "Ce que vous voyez à l’écran", f: ["Un tableau de bord où les gains montent vite, chaque jour.", "Parfois un premier petit retrait accepté, pour gagner votre confiance.", "Puis le retrait bloqué : « compte en vérification », « seuil non atteint ».", "Des « frais de déblocage », une « taxe » ou une « assurance » à payer avant de retirer.", "Des paiements à envoyer sur un numéro personnel, pas au nom d’une société."], c: "Sur un faux placement, les gains n’existent qu’à l’écran. Le seul vrai test, c’est le retrait.",
        p: "Je connais les signes d’un faux placement." },
      { t: "Ce que coûtent les « frais »", c: "Chaque frais payé est présenté comme le dernier. Il ne l’est jamais. Calculez ce qu’on finit par perdre en continuant.",
        w: { ex: "Moussa a déposé 150 000 F. Pour retirer, on lui demande 25 000 F de « frais », puis une « taxe », puis une « assurance ». Après 4 demandes : 150 000 + 4 × 25 000 = 250 000 F perdus, et toujours aucun retrait.", k: "Votre situation, réelle ou proposée", champs: [ {id:"fc_dep", l:"Somme déposée ou proposée (F)"}, {id:"fc_frais", l:"Frais demandés à chaque fois (F)"}, {id:"fc_nb", l:"Nombre de demandes de frais", ph:"4"}, {id:"fc_rev", l:"Votre revenu mensuel (F, facultatif)"} ],
          v: function(D,H){ var d=H.N(D.fc_dep), f=H.N(D.fc_frais); if(!d&&!f) return ''; var n=H.N(D.fc_nb)||4, t=d+f*n, r=H.N(D.fc_rev); D.fc_total=t; var m=r?Math.round(t/r*10)/10:0;
            return '<div class="gros"><small>Ce que vous auriez perdu après '+n+' demande'+(n>1?'s':'')+'</small><b>'+H.F(t)+'</b><p>'+(m?'Soit environ '+String(m).replace('.',',')+' mois de revenu. ':'')+'Et le retrait n’arrive toujours pas.</p></div><div class="verdict v-ko">Chaque nouveau frais sert à « débloquer » le précédent. La seule façon de limiter la perte, c’est d’arrêter de payer.</div>'; } },
        p: "J’ai calculé ce que coûtent les frais qui ne finissent jamais." },
      { t: "Code, accès, numéro personnel", c: "Certaines demandes ne sont jamais normales, même venant d’une personne très gentille.",
        w: { quiz: [
          ["On vous demande le code reçu par SMS, « pour valider votre compte ».", ["Normal","Signal d’alarme"], 1, "Un code reçu par SMS ne se donne à personne. Ni votre banque, ni votre opérateur ne vous le demanderont."],
          ["On vous demande d’installer une application pour « vous aider à distance ».", ["Normal","Signal d’alarme"], 1, "Elle peut donner accès à votre téléphone, donc à votre mobile money et à vos comptes."],
          ["On vous demande de payer sur le numéro personnel d’un « conseiller ».", ["Normal","Signal d’alarme"], 1, "Un établissement encaisse à son nom, jamais sur le numéro d’un employé."],
          ["Un établissement vous remet un contrat à son nom et vous laisse le temps de réfléchir.", ["Normal","Signal d’alarme"], 0, "Oui : un écrit, une société identifiée, et du temps. C’est ce qu’on attend."]
        ] },
        p: "Je sais ce qu’on ne me demandera jamais honnêtement." }
    ]},
    { t: "Vérifier sans se fâcher", acq: "Je vérifie sans me fâcher", desc: "Le numéro officiel, l’agrément, le contrat, 48 heures et un proche de confiance.", e: [
      { t: "Les cinq réflexes", f: ["Je rappelle l’établissement sur son numéro officiel, trouvé moi-même (site, agence, application). Jamais celui donné dans le message.", "Je vérifie l’agrément sur la liste officielle de l’autorité qui contrôle ce métier.", "Je demande un contrat écrit, au nom de la société, avec ses coordonnées.", "Je m’accorde 48 heures avant toute décision. Une vraie occasion attend.", "J’en parle à un proche de confiance avant de payer quoi que ce soit."], c: "Vérifier n’est pas accuser. C’est ce que font les gens sérieux, et une offre honnête l’accepte sans problème.",
        p: "Je connais les cinq réflexes." },
      { t: "Tester une offre reçue", c: "Prenez une offre que vous avez reçue, ou celle d’un proche. Cochez seulement ce qui y figure vraiment.",
        w: { puces: { id:"fc_sig", k:"Ce que contient l’offre", m:1, l:["Rendement très élevé ou « garanti »","Il faut décider vite","Le contact est venu vers moi","Paiement sur un numéro personnel","Pas de contrat écrit","Des captures de gains comme preuve","On me demande un code ou un accès","Des frais à payer pour retirer"] },
          v: function(D){ var s=D.fc_sig||[], n=s.length, grave=s.indexOf("On me demande un code ou un accès")>=0||s.indexOf("Des frais à payer pour retirer")>=0;
            if(!n) return '<div class="verdict v-mid">Aucun signal coché. Faites quand même les cinq réflexes avant de payer.</div>';
            if(n>=3||grave) return '<div class="gros"><small>Signaux d’alarme</small><b>'+n+' sur 8</b></div><div class="verdict v-ko">Tout indique une manipulation. Ne payez rien, ne donnez aucun code, et parlez-en à un proche.</div>';
            return '<div class="gros"><small>Signaux d’alarme</small><b>'+n+' sur 8</b></div><div class="verdict v-mid">Prudence : n’envoyez rien avant d’avoir vérifié l’établissement vous-même, sur son numéro officiel.</div>'; } },
        p: "J’ai testé une offre avec la liste des signaux." },
      { t: "Mon proche de confiance", c: "On se fait piéger seul, rarement à deux. Choisissez maintenant la personne que vous appellerez avant de payer.",
        w: { ex: "Affoué a choisi sa grande sœur Awa, calme et de bon conseil. Sa règle : avant tout paiement à un inconnu, elle l’appelle et lui lit le message.", champs: [ {id:"fc_proche", l:"La personne que j’appelle avant de payer", type:"txt", ph:"Prénom, lien"}, {id:"fc_tel", l:"Son numéro", type:"txt", ph:"07 …"} ],
          v: function(D,H){ var p=String(D.fc_proche||'').trim(); if(!p) return ''; return '<div class="gros"><small>Avant de payer, j’appelle</small><b>'+H.esc(p)+'</b><p>Et j’attends 48 heures avant toute décision.</p></div>'; } },
        p: "Mon proche de confiance est choisi." }
    ]},
    { t: "Ma règle et mon script", acq: "J’ai ma règle et mon script", desc: "Une règle écrite, une phrase pour couper court, et quoi faire si on a déjà payé.", e: [
      { t: "Ma règle écrite", c: "Une règle décidée au calme vous protège le jour où l’on vous presse. Écrivez-la avec vos mots.",
        w: { ex: "La règle de Koffi : « Je n’investis jamais sur une offre reçue par message. C’est moi qui choisis l’établissement, et c’est moi qui l’appelle. »", champs: [ {id:"fc_regle", l:"Ma règle", type:"area", ph:"Je n’investis jamais sur une offre reçue par message. …"} ],
          v: function(D,H){ var r=String(D.fc_regle||'').trim(); if(!r) return ''; return '<div class="gros"><small>Ma règle, à garder en vue</small><p>« '+H.esc(r)+' »</p></div>'; } },
        p: "Ma règle est écrite." },
      { t: "Mon script pour couper court", c: "Pas besoin de débattre ni de se justifier. Une phrase polie, puis on s’arrête là.",
        w: { ex: "« Merci, mais je n’investis jamais sur une offre reçue par message. Je ne donnerai pas suite. Bonne journée. » Puis Ibrahim bloque le contact et le signale.", champs: [ {id:"fc_script", l:"Mon message pour couper court", type:"area", ph:"Merci, mais je ne donne pas suite aux offres reçues par message. …"} ] },
        p: "Mon script est prêt." },
      { t: "Si j’ai déjà payé", f: ["J’arrête de payer, même si l’on promet de tout débloquer au prochain versement, et je me méfie de qui propose de « récupérer » mon argent contre paiement.", "Je garde les preuves : captures, numéros, reçus de transfert, noms des profils.", "Je préviens tout de suite mon opérateur ou ma banque, sur leur numéro officiel.", "Je signale les faits. En Côte d’Ivoire : la Plateforme de lutte contre la cybercriminalité (PLCC).", "Je préviens mes proches, pour qu’ils ne soient pas contactés à leur tour."], c: "Ce n’est pas une honte : ces techniques sont faites pour tromper les plus prudents. Ce qui compte, c’est d’agir vite.",
        w: { consignes: 1, ex: "Fatou a envoyé 50 000 F. Elle arrête tout, fait des captures, appelle son opérateur sur le numéro de l’application officielle, puis signale les faits.", champs: [ {id:"fc_num", l:"Service client de mon opérateur ou de ma banque (numéro trouvé moi-même)", type:"txt", large:1} ] },
        p: "Je sais quoi faire si j’ai déjà payé." }
    ]}
  ],
  fin: {
    k: "Ma fiche anti-manipulation", titre: "Vous savez repérer la manipulation",
    fiche: [
      ["Premiers contacts déjà reçus", function(D){ return (D.fc_recu||[]).join(', '); }],
      ["Leviers repérés", function(D){ return (D.fc_lev||[]).join(', '); }],
      ["Ce qu’un faux placement m’aurait coûté", function(D,H){ var d=H.N(D.fc_dep), f=H.N(D.fc_frais); if(!d&&!f) return ''; return H.F(d+f*(H.N(D.fc_nb)||4)); }],
      ["Signaux sur l’offre testée", function(D){ var n=(D.fc_sig||[]).length; return n?n+' sur 8':''; }],
      ["Mon proche de confiance", function(D){ var p=String(D.fc_proche||'').trim(), t=String(D.fc_tel||'').trim(); return p?(t?p+' · '+t:p):''; }],
      ["Ma règle", function(D){ return String(D.fc_regle||'').trim(); }],
      ["Mon script", function(D){ return String(D.fc_script||'').trim(); }],
      ["Si j’ai déjà payé, j’appelle", function(D){ return String(D.fc_num||'').trim(); }]
    ],
    suite: { t: "Rendement garanti : que vérifier avant de payer ?", p: "Vous savez repérer la manipulation. L’atelier suivant vous apprend à examiner l’offre elle-même : le rendement, le contrat, l’agrément.", lien: "atelier-rendement-garanti.html", b: "Ouvrir l’atelier" }
  }
};
