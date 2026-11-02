/* Atelier guidé · On vous promet un rendement garanti : que vérifier avant de payer ? */
window.ATELIER = {
  id: "rendement-garanti",
  titre: "On vous promet un rendement garanti : que vérifier avant de payer ?",
  h1: "Un gain élevé et sûr, ça se vérifie avant de payer.",
  voix: "auto",
  question: {
    t: "On vous promet 30 % en 6 mois, « garanti ». Quelle est votre première réaction ?",
    r: [
      ["a", "Je verse vite, avant que l’offre ne parte.", "C’est exactement la réaction que la pression cherche à provoquer. Une vraie offre attend que vous ayez vérifié. Cet atelier vous donne le temps et la méthode.", false],
      ["b", "Je vérifie d’abord d’où vient le gain et qui est derrière.", "C’est le bon réflexe. On va le transformer en méthode : la promesse, l’origine du gain, la société, le contrat, puis la décision.", true]
    ]
  },
  chapitres: [
    { t: "Lire la promesse", acq: "Je sais lire une promesse de gain", desc: "Traduire l’offre en rendement par an et la comparer aux vrais placements.", e: [
      { t: "L’offre en clair", c: "Avant de juger, on écrit l’offre telle qu’on l’a reçue. Noir sur blanc, elle impressionne déjà moins.",
        w: { ex: "Moussa reçoit sur WhatsApp : « Mettez 500 000 F dans notre projet d’élevage, recevez 650 000 F dans 6 mois. Garanti. »", k: "L’offre que vous avez reçue", champs: [ {id:"rg_nom", l:"Ce qu’on vous propose, en une phrase", type:"area", ph:"Mettre … F dans … pour recevoir … F dans … mois"} ],
          puces: { id:"rg_type", k:"Le type d’offre", l:["Projet agricole","Immobilier","Trading ou crypto","« Tontine » en ligne","Placement d’un proche","Autre"] } },
        p: "L’offre est écrite en une phrase." },
      { t: "Le rendement par an", c: "« 30 % en 6 mois » paraît modeste. Ramené à un an, avec les gains replacés, c’est environ 69 %.",
        w: { ex: "Moussa : 500 000 F deviennent 650 000 F en 6 mois, soit 30 %. Sur un an, en replaçant le gain : 1,3 × 1,3 = 1,69, soit environ 69 % par an.", k: "Les chiffres de l’offre", c3: 1, champs: [ {id:"rg_mise", l:"Je verse (F)", ph:"500 000"}, {id:"rg_recu", l:"On me promet (F)", ph:"650 000"}, {id:"rg_mois", l:"Au bout de (mois)", ph:"6"} ],
          v: function(D,H){ var m=H.N(D.rg_mise), r=H.N(D.rg_recu), n=H.N(D.rg_mois); if(!m||!r||!n||r<=m) return ''; var p=(r-m)/m, an=Math.pow(1+p,12/n)-1; D.rg_an=Math.round(an*1000)/10; return '<div class="gros"><small>Rendement annuel équivalent de l’offre</small><b>environ '+(Math.round(an*1000)/10).toLocaleString('fr-FR')+' % par an</b><p>Gain promis : '+H.F(r-m)+' en '+n+' mois, soit '+(Math.round(p*1000)/10).toLocaleString('fr-FR')+' % sur la période.</p></div>'; } },
        p: "Je connais le rendement par an de l’offre." },
      { t: "Comparer aux vrais placements", f: ["Compte d’épargne : de l’ordre de 3 à 4 % par an (exemple).", "Dépôt à terme : de l’ordre de 4 à 6 % par an selon la durée (exemple).", "Emprunt d’État de la zone : de l’ordre de 6 à 7 % par an (exemple)."], c: "Ces placements sont encadrés, et aucun ne promet des dizaines de pour cent par an. Plus l’écart est grand, plus il faut de preuves.",
        w: { consignes: 1,
          v: function(D,H){ var a=H.N(D.rg_an); if(!a) return '<div class="verdict v-mid">Remplissez l’écran précédent pour voir l’écart avec ces ordres de grandeur.</div>'; var x=Math.round(a/6.5*10)/10; if(a<=8) return '<div class="verdict v-mid">Environ '+a.toLocaleString('fr-FR')+' % par an : proche des placements connus. Le mot « garanti » reste à vérifier dans le contrat.</div>'; if(a<=15) return '<div class="verdict v-mid">Environ '+a.toLocaleString('fr-FR')+' % par an : nettement au-dessus d’un emprunt d’État. Demandez d’où vient la différence.</div>'; return '<div class="verdict v-ko">Environ '+a.toLocaleString('fr-FR')+' % par an : à peu près '+x.toLocaleString('fr-FR')+' fois un emprunt d’État. Un gain aussi élevé ne peut pas être sûr en même temps.</div>'; } },
        p: "J’ai comparé l’offre aux vrais placements." }
    ]},
    { t: "D’où vient le gain ?", acq: "Je sais d’où vient l’argent promis", desc: "Une activité réelle, ou l’argent des nouveaux venus.", e: [
      { t: "L’activité qui paie", c: "Un gain vient toujours de quelque part : une récolte vendue, un loyer encaissé, un intérêt payé. Si personne ne peut le montrer, c’est une alerte.",
        w: { ex: "Affoué demande à voir l’élevage promis. On lui répond : « Ce n’est pas nécessaire, regardez les témoignages des membres. »", champs: [ {id:"rg_src", l:"D’où vient le gain, selon l’offre ?", type:"area", ph:"La vente de… / Le loyer de… / On ne m’a pas dit"} ],
          puces: { id:"rg_act", k:"Pouvez-vous voir cette activité ?", l:["Je peux la voir et la vérifier","On me la décrit seulement","Personne ne sait l’expliquer"] },
          v: function(D){ var R={"Je peux la voir et la vérifier":["v-ok","Bon signe. Vérifiez aussi que le gain promis correspond à ce que l’activité peut vraiment rapporter."],"On me la décrit seulement":["v-mid","Une description ne prouve rien. Demandez à voir : le lieu, les factures, les comptes."],"Personne ne sait l’expliquer":["v-ko","Alerte forte : un gain que personne ne sait expliquer vient souvent de l’argent des nouveaux."]}[D.rg_act]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai écrit d’où vient le gain." },
      { t: "Le schéma de Ponzi, simplement", f: ["Les premiers versent leur argent.", "On les paie avec l’argent de ceux qui arrivent après.", "Il faut donc toujours plus de nouveaux, souvent recrutés par les anciens.", "Quand les entrées ralentissent, les paiements s’arrêtent. Les derniers arrivés perdent tout."], c: "Les premiers gains sont souvent bien réels : c’est ce qui rend le système convaincant, et ce qui pousse à recruter ses proches.",
        p: "Je sais reconnaître un schéma de Ponzi." },
      { t: "Activité réelle ou argent des nouveaux ?", c: "Trois situations. Pour chacune, demandez-vous qui paie vraiment le gain.",
        w: { quiz: [ ["Ibrahim loue un magasin et reçoit chaque mois le loyer prévu au contrat.", ["Activité réelle","Argent des nouveaux"], 0, "Le gain vient d’un locataire, pour un bien qui existe et un contrat écrit."], ["Un groupe en ligne paie 20 % par mois et vous offre un bonus pour chaque personne recrutée.", ["Activité réelle","Argent des nouveaux"], 1, "Le bonus de recrutement montre que le système vit des entrées d’argent."], ["On vous paie le premier mois, puis on vous propose de « réinvestir » pour gagner plus.", ["Activité réelle","Argent des nouveaux"], 1, "Le premier paiement sert souvent à gagner la confiance et à garder l’argent dans le système."] ] },
        p: "Je sais distinguer un vrai gain de l’argent des nouveaux." }
    ]},
    { t: "Qui est derrière ?", acq: "Je sais vérifier qui collecte mon argent", desc: "Le nom légal, l’adresse, et l’agrément auprès de la bonne autorité.", e: [
      { t: "L’identité de la société", c: "Un nom commercial ou un numéro WhatsApp ne suffit pas. On veut le nom légal, une adresse qu’on peut visiter et un numéro au registre du commerce.",
        w: { ex: "Fatou demande ces trois éléments. On lui donne un nom, mais ni adresse ni numéro au registre du commerce : elle note « à vérifier ».", champs: [ {id:"rg_soc", l:"Nom légal de la société", type:"txt", ph:"Tel qu’écrit sur les documents"}, {id:"rg_adr", l:"Adresse physique", type:"txt", ph:"Ville, quartier, rue"}, {id:"rg_rccm", l:"Numéro au registre du commerce (RCCM)", type:"txt", ph:"CI-ABJ-…"} ],
          v: function(D){ var n=["rg_soc","rg_adr","rg_rccm"].filter(function(k){ return String(D[k]||'').trim(); }).length; if(!n) return ''; if(n===3) return '<div class="verdict v-ok">Les trois éléments sont notés. Vérifiez maintenant qu’ils existent vraiment, et l’agrément à l’écran suivant.</div>'; return '<div class="verdict v-mid">'+n+' élément'+(n>1?'s':'')+' sur 3. Ce qui manque, demandez-le par écrit. Un refus de répondre est déjà une réponse.</div>'; } },
        p: "L’identité de la société est notée." },
      { t: "La bonne autorité", c: "Chaque métier qui touche à votre épargne a son autorité. C’est elle qui publie la liste des sociétés agréées : vérifiez-y le nom légal.",
        w: { puces: [ { id:"rg_aut", k:"Ce que la société vous propose", l:["Actions, obligations ou fonds","Épargne, dépôt ou crédit","Assurance ou épargne-retraite","Un projet ou un commerce privé"] }, { id:"rg_ver", k:"Résultat de votre vérification", l:["Trouvée sur la liste officielle","Introuvable","Pas encore vérifié"] } ],
          v: function(D){ var A={"Actions, obligations ou fonds":"l’AMF-UMOA, qui agrée les SGI, les SGO et les OPCVM.","Épargne, dépôt ou crédit":"la BCEAO pour les banques et les microfinances, et le ministère des Finances pour les microfinances.","Assurance ou épargne-retraite":"la CIMA et la direction des assurances du pays.","Un projet ou un commerce privé":"aucune liste ne le couvre en général. Mais une société qui collecte l’argent du public en promettant un gain doit en principe y être autorisée : demandez par quelle autorité."}[D.rg_aut]; var V={"Trouvée sur la liste officielle":["v-ok","Bon signe. Vérifiez que le nom, l’adresse et l’activité correspondent exactement."],"Introuvable":["v-ko","Alerte forte : une société introuvable sur la liste n’a pas le droit de collecter cette épargne."],"Pas encore vérifié":["v-mid","Ne versez rien tant que ce n’est pas vérifié."]}[D.rg_ver]; return (A?'<div class="gros"><small>L’autorité à consulter</small><p>'+A+'</p></div>':'')+(V?'<div class="verdict '+V[0]+'">'+V[1]+'</div>':''); } },
        p: "J’ai vérifié l’agrément auprès de la bonne autorité." }
    ]},
    { t: "Le contrat et le circuit de l’argent", acq: "Je sais lire le contrat et suivre mon argent", desc: "Ce qui doit être écrit, et où l’argent doit aller.", e: [
      { t: "Le contrat écrit", c: "Une promesse orale ne vous protège pas. Ce qui compte, c’est ce qui est écrit et signé, surtout la façon de récupérer votre argent.",
        w: { puces: { id:"rg_ctr", k:"Ce que vous avez vraiment entre les mains", m:1, l:["Un contrat écrit et signé","Le nom légal de la société sur le contrat","Les conditions de sortie : quand et comment je récupère mon argent","Les risques écrits noir sur blanc","Tous les frais écrits"] },
          v: function(D){ var n=(D.rg_ctr||[]).length; if(!n) return '<div class="verdict v-ko">Rien d’écrit pour l’instant : demandez le contrat avant tout versement.</div>'; return '<div class="gros"><small>Votre contrat</small><b>'+n+' point'+(n>1?'s':'')+' sur 5</b><p>'+(n===5?'Le contrat couvre l’essentiel. Lisez-le en entier avant de signer.':'Demandez par écrit ce qui manque. Une offre sérieuse n’a rien à cacher.')+'</p></div>'; } },
        p: "J’ai vérifié ce que dit le contrat." },
      { t: "Le circuit de l’argent", c: "L’argent doit aller sur un compte au nom de la société, contre un reçu. Payer des frais pour récupérer son propre argent est une alerte majeure.",
        w: { ex: "Koffi doit envoyer 300 000 F sur le numéro mobile money d’un « conseiller ». Plus tard, on lui demande 50 000 F de « frais de déblocage » pour retirer ses gains.",
          puces: [ { id:"rg_cpt", k:"Où devez-vous verser l’argent ?", l:["Sur un compte au nom de la société, avec un reçu","Sur le compte ou le numéro d’une personne","En espèces, sans reçu"] }, { id:"rg_alr", k:"Ce que vous avez constaté", m:1, l:["Des frais pour récupérer mon argent","Une pression pour payer vite","On me demande de recruter","Mes gains ne se voient que sur une appli ou dans un groupe"] } ],
          v: function(D){ var C={"Sur un compte au nom de la société, avec un reçu":["v-ok","C’est le bon circuit. Gardez chaque reçu."],"Sur le compte ou le numéro d’une personne":["v-ko","Alerte : si la personne disparaît, rien ne relie votre argent à la société."],"En espèces, sans reçu":["v-ko","Alerte : sans reçu, vous ne pourrez rien prouver."]}[D.rg_cpt], a=(D.rg_alr||[]).length; return (C?'<div class="verdict '+C[0]+'">'+C[1]+'</div>':'')+(a?'<div class="verdict v-ko">'+a+' alerte'+(a>1?'s':'')+' constatée'+(a>1?'s':'')+'. Chacune, seule, suffit pour ne pas verser davantage.</div>':''); } },
        p: "Je sais où va mon argent." }
    ]},
    { t: "Décider", acq: "Je décide par écrit, et je sais dire non", desc: "Compter les signaux, écrire sa décision, savoir quoi faire si l’on a déjà versé.", e: [
      { t: "Mon score d’alerte", c: "Cochez honnêtement ce que vous avez vu. Ce n’est pas un jugement sur la personne qui vous a proposé l’offre, c’est un bilan des faits.",
        w: { puces: { id:"rg_sig", k:"Les signaux présents dans votre offre", m:1, l:["Le gain est dit « garanti »","Bien au-dessus des placements connus","Le gain vient surtout des nouveaux","Société ou agrément introuvable","Pas de contrat écrit","Argent versé à une personne","Frais pour récupérer l’argent","Pression pour payer vite","Recrutement demandé"] },
          v: function(D){ var n=(D.rg_sig||[]).length; D.rg_score=n; var k=n===0?['v-ok','Aucun signal coché. Gardez la prudence : ne versez qu’après avoir tout obtenu par écrit.']:n<=2?['v-mid','Des points restent à éclaircir. Attendez d’avoir des réponses écrites avant de verser.']:['v-ko','Trop de signaux réunis. La décision la plus sûre est de refuser.']; return '<div class="gros"><small>Votre score</small><b>'+n+' signal'+(n>1?'s':'')+' sur 9</b></div><div class="verdict '+k[0]+'">'+k[1]+'</div>'; } },
        p: "Mon score d’alerte est calculé." },
      { t: "Ma décision écrite", c: "Une décision écrite résiste mieux à la pression qu’une hésitation. Écrivez ce qui pèse le plus, puis choisissez.",
        w: { ex: "Moussa a coché 5 signaux. Il écrit : « Je refuse : 69 % par an, pas d’agrément, et l’argent va sur le numéro d’une personne. »",
          puces: { id:"rg_dec", k:"Ma décision", l:["Je verse","J’attends","Je refuse"] }, champs: [ {id:"rg_pq", l:"Ce qui pèse le plus, en une phrase", type:"area", ph:"Le rendement, l’agrément, le contrat, le circuit de l’argent…"} ],
          v: function(D,H){ var n=H.N(D.rg_score), d=D.rg_dec; if(!d) return ''; if(d==="Je verse"&&n>=3) return '<div class="verdict v-ko">Votre score montre '+n+' signaux. Relisez-les avant de verser : la décision vous appartient, mais elle doit tenir face aux faits.</div>'; if(d==="Je verse") return '<div class="verdict v-mid">Ne versez que ce que vous pouvez perdre sans mettre la famille en difficulté, et gardez chaque preuve.</div>'; if(d==="J’attends") return '<div class="verdict v-mid">Fixez-vous ce que vous attendez : contrat, agrément, réponses écrites. Sans réponse, la décision devient un refus.</div>'; return '<div class="verdict v-ok">Décision claire. Refuser une offre douteuse, c’est protéger votre argent et vos proches.</div>'; } },
        p: "Ma décision est écrite." },
      { t: "Dire non, ou agir si j’ai déjà versé", c: "Dire non à un proche qui recrute, c’est aussi le protéger. Et si vous avez déjà versé, il n’y a pas de honte : il y a des gestes à faire vite.",
        w: { champs: [ {id:"rg_non", l:"Ma phrase pour dire non", type:"area", ph:"Je te fais confiance, mais je ne verse jamais sans contrat ni agrément. Si tu veux, on vérifie ensemble."} ],
          puces: { id:"rg_deja", k:"Votre situation", l:["Je n’ai rien versé","J’ai déjà versé"] },
          v: function(D){ if(D.rg_deja==="J’ai déjà versé") return '<div class="gros"><small>Ce que vous faites maintenant</small><p>1. J’arrête de payer, y compris les « frais » pour récupérer mon argent.<br>2. Je garde toutes les preuves : captures, reçus, numéros, noms, messages.<br>3. Je signale : en Côte d’Ivoire, la PLCC pour les arnaques en ligne, et l’autorité du métier concerné.<br>4. Je préviens mes proches qui ont été approchés.</p></div>'; if(D.rg_deja) return '<div class="verdict v-ok">Gardez votre phrase sous la main : elle servira la prochaine fois qu’on vous relancera.</div>'; return ''; } },
        p: "Ma phrase est prête et je sais quoi faire si j’ai versé." }
    ]}
  ],
  fin: {
    k: "Ma fiche offre vérifiée", titre: "Votre offre est passée au crible",
    fiche: [
      ["L’offre", function(D){ return [D.rg_type||'', String(D.rg_nom||'').trim()].filter(Boolean).join(' : '); }],
      ["Rendement annuel équivalent", function(D,H){ return H.N(D.rg_an)?'environ '+H.N(D.rg_an).toLocaleString('fr-FR')+' % par an':''; }],
      ["Origine du gain", function(D){ return D.rg_act||''; }],
      ["Société et agrément", function(D){ return [String(D.rg_soc||'').trim(), D.rg_ver||''].filter(Boolean).join(' · '); }],
      ["Contrat", function(D){ return (D.rg_ctr||[]).length?(D.rg_ctr||[]).length+' point'+((D.rg_ctr||[]).length>1?'s':'')+' sur 5':''; }],
      ["Circuit de l’argent", function(D){ return D.rg_cpt||''; }],
      ["Signaux d’alerte", function(D){ return D.rg_sig?(D.rg_sig.length+' sur 9'):''; }],
      ["Ma décision", function(D){ return [D.rg_dec||'', String(D.rg_pq||'').trim()].filter(Boolean).join(' : '); }]
    ],
    suite: { t: "Les placements expliqués", p: "Vous savez repérer une fausse promesse. L’atelier suivant compare les vrais placements : ce qu’ils rapportent, ce qu’ils risquent, et quand vous récupérez votre argent.", lien: "atelier-placements-expliques.html", b: "Ouvrir l’atelier" }
  }
};
