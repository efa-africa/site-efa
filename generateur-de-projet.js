(function(){
"use strict";
var PAS=[10000,25000,50000,100000,150000,200000,300000,500000,750000,1000000,1500000,2000000,3000000,5000000,7500000,10000000,15000000,20000000,30000000,50000000];
var RAPIDES=[100000,500000,1000000,5000000];
var SECTEURS={num:["Numérique","projet-numerique.webp",1],commerce:["Commerce","projet-numerique.webp",1.1],alim:["Alimentation","projet-repas.webp",1.2],elevage:["Élevage","",1.2],agri:["Agriculture","",1.2],services:["Services","coach-entreprise.webp",1.1],artisanat:["Artisanat","projet-textile.webp",1.1],mobilite:["Transport","",1.1],immo:["Immobilier","univers-terrain.webp",1.2],educ:["Formation","benefice-collectif.webp",1]};
var SAVOIR=[["","Je découvre"],["num","Créer avec le numérique"],["vente","Vendre, convaincre"],["cuisine","Cuisiner, transformer"],["agri","Élever, cultiver"],["tech","Réparer, fabriquer"],["gestion","Organiser, enseigner"],["zero","Je pars de zéro"]];
var TEMPS=[["","À définir"],["1","Quelques heures : soirs et week-ends"],["2","À mi-temps"],["3","À plein temps"]];
var LIEU=[["","Je suis ouvert"],["salon","Chez moi"],["ville","En ville, au contact"],["terrain","Sur un terrain"]];
var LIEUX_TXT={salon:"depuis chez vous",ville:"en ville",terrain:"sur un terrain"};
function lieux(x){var t=x[5].map(function(l){return LIEUX_TXT[l];}).join(" ou ");return t.charAt(0).toUpperCase()+t.slice(1);}
var TEMPS_TXT={1:"Soirs et week-ends",2:"Mi-temps",3:"Plein temps"};
var CLE_W3F="426191fb-4812-4de4-b602-5857464c5916";
var I=window.GEN_IDEES||[],PAYS=window.GEN_PAYS||{},PLACER=window.GEN_PLACER||[];
var K="efa_gen_v2";
var etat={budget:300000,libre:false,savoir:"",temps:"",lieu:"",pays:"ci",decal:0,vus:3,ouverte:null,onglet:"idee",cmp:[],gardees:[],precedent:null,analyse:false,perime:false};
try{var s=JSON.parse(localStorage.getItem(K)||"{}");["budget","libre","savoir","temps","lieu","pays","gardees"].forEach(function(k){if(s[k]!=null)etat[k]=s[k];});}catch(e){}
function sv(){try{localStorage.setItem(K,JSON.stringify({budget:etat.budget,libre:etat.libre,savoir:etat.savoir,temps:etat.temps,lieu:etat.lieu,pays:etat.pays,gardees:etat.gardees}));}catch(e){}}
var $=function(id){return document.getElementById(id);};
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function F(n){return Math.round(n).toLocaleString("fr-FR").replace(/[\s ]/g," ")+" F";}
function FC(n){if(n>=1e6){return (Math.round(n/1e5)/10).toString().replace(".",",")+" M F";}return F(n);}
function idee(id){for(var i=0;i<I.length;i++)if(I[i][0]===id)return I[i];return null;}
function sec(x){return SECTEURS[x[2]]||["Activité","benefice-entreprise.webp",1.1];}
function img(x){return sec(x)[1]?"clone/assets/"+sec(x)[1]:"";}
function visuel(x,cls){var u=img(x);return u?'<img src="'+u+'" alt="" loading="lazy">':'<div class="sans-photo" aria-hidden="true"><span>'+esc(sec(x)[0])+'</span></div>';}
function varier(L){var out=[],reste=L.slice();while(reste.length){var vus={},lot=[];for(var i=0;i<reste.length&&lot.length<3;i++){if(!vus[reste[i][2]]){vus[reste[i][2]]=1;lot.push(reste[i]);}}if(lot.length<3)for(var j=0;j<reste.length&&lot.length<3;j++){if(lot.indexOf(reste[j])<0)lot.push(reste[j]);}lot.forEach(function(x){out.push(x);reste.splice(reste.indexOf(x),1);});}return out;}
function B(){return etat.libre?Infinity:etat.budget;}

function score(x){var s=0,sav=x[7],P=PAYS[etat.pays];
  if(etat.savoir){if(sav.indexOf(etat.savoir)>-1)s+=5;}
  if(etat.lieu){s+=x[5].indexOf(etat.lieu)>-1?2:-2;}
  if(etat.temps){s+=x[6]<=+etat.temps?2:-3;}
  if(P){if(P.ids.indexOf(x[0])>-1)s+=1.5;else if(P.s.indexOf(x[2])>-1)s+=.7;}
  if(!etat.libre){var r=x[3]/etat.budget;s+=r>=.25?1.5:r>=.05?.6:0;}
  return s;}
function criteres(x){var c=[];
  if(etat.savoir&&x[7].indexOf(etat.savoir)>-1)c.push("ce que vous aimez faire");
  if(etat.temps&&x[6]<=+etat.temps)c.push("votre temps");
  if(etat.lieu&&x[5].indexOf(etat.lieu)>-1)c.push("votre lieu");
  return c;}
function echelle(x){return etat.libre?(x[4]||x[3]):Math.min(x[4]||x[3],etat.budget);}
function rang(x){if(etat.libre)return 0;var f=echelle(x)/etat.budget;return f>=.5?0:f>=.15?1:2;}
function liste(){var b=B();return I.filter(function(x){return x[3]<=b;}).map(function(x){return [rang(x),score(x),echelle(x),x];}).sort(function(a,c){return a[0]-c[0]||c[1]-a[1]||c[2]-a[2];}).map(function(a){return a[3];});}
function hauteur(x){if(etat.libre)return "De "+(x[3]?FC(x[3]):"0 F")+" à "+FC(x[4]||x[3]);var e=echelle(x);return e>=etat.budget?"Peut employer tout votre budget":"Emploie jusqu’à "+FC(e)+" de votre budget";}
function listeVue(){return varier(liste());}

function carte(x,n){var g=etat.gardees.indexOf(x[0])>-1,c=criteres(x),S=sec(x);
  var lieu=lieux(x);
  return '<article class="carte" style="animation-delay:'+(n*50)+'ms"><div class="img">'+visuel(x)+'<span class="tag">'+esc(S[0])+'</span></div><div class="corps"><span class="meta">'+esc(lieu)+' · '+TEMPS_TXT[x[6]]+'</span><h3>'+esc(x[1])+'</h3><span class="prix">'+hauteur(x)+'<small>Ticket indicatif : '+(x[3]?FC(x[3]):"0 F")+' à '+FC(x[4]||x[3])+', à vérifier</small></span><p class="pas">«&nbsp;'+esc(x[9])+'&nbsp;»</p>'+(c.length?'<p class="match">Correspond à vos choix : '+c.join(", ")+'</p>':'')+'<div class="act"><button type="button" class="ouvrir" data-o="'+x[0]+'">Explorer →</button><button type="button" class="coeur" data-g="'+x[0]+'" aria-pressed="'+g+'" aria-label="'+(g?"Retirer":"Garder")+' cette idée">'+(g?"♥":"♡")+'</button></div></div></article>';}

function proposition(L){if(etat.libre||!L.length)return "";var b=etat.budget,res=Math.round(b*.1/1000)*1000,dispo=b-res,P1=L[0],m1=Math.min(P1[4]||P1[3],dispo);if(m1<P1[3])m1=Math.min(P1[3],b);
  var reste=Math.max(0,b-res-m1),lignes=[[P1[1],m1,"Projet principal","p1"]],P2=null;
  if(reste>=b*.15){for(var i=1;i<L.length;i++){if(L[i][2]!==P1[2]&&L[i][3]<=reste){P2=L[i];break;}}
    if(P2){var m2=Math.min(P2[4]||P2[3],reste);lignes.push([P2[1],m2,"Deuxième projet","p2"]);reste-=m2;}}
  if(reste>=1000)lignes.push(["Placer ce qui reste, sans risque inutile",reste,"Placement","pl"]);
  if(res>0)lignes.push(["Réserve de précaution, à ne pas toucher",res,"Réserve","rs"]);
  return '<div class="propo"><span class="sur">Notre proposition pour '+FC(b)+'</span><h3>Voici comment votre budget pourrait travailler</h3>'+lignes.map(function(l){var pc=Math.round(l[1]/b*100);return '<div class="pl-l"><div class="pl-t"><small>'+l[2]+'</small><b>'+esc(l[0])+'</b></div><strong>'+FC(l[1])+'</strong><span class="pl-barre"><i class="'+l[3]+'" style="width:'+Math.max(3,pc)+'%"></i></span></div>';}).join("")+'<p class="md-note">Répartition indicative : chaque montant se confirme par des devis et un premier test.</p></div>';}
function vedette(x){var c=criteres(x);
  return '<article class="vedette" id="vedette-c"><div class="v-img">'+visuel(x)+'<span class="ici">Commencez ici</span></div><div class="v-corps"><span class="sur">Votre meilleure piste · '+esc(sec(x)[0])+'</span><h3>'+esc(x[1])+'</h3><p class="v-h">'+hauteur(x)+'</p><p>'+esc(x[8])+'</p><p class="pas">Premier pas : «&nbsp;'+esc(x[9])+'&nbsp;»</p>'+(c.length?'<p class="match">Correspond à vos choix : '+c.join(", ")+'</p>':'')+'<div class="act"><button type="button" class="ouvrir brille" data-o="'+x[0]+'">Voir cette piste en détail →</button><button type="button" class="coeur" data-g="'+x[0]+'" aria-pressed="'+(etat.gardees.indexOf(x[0])>-1)+'" aria-label="Garder cette idée">'+(etat.gardees.indexOf(x[0])>-1?"♥":"♡")+'</button></div></div></article>';}
function rendre(){$("gardees-n").textContent=etat.gardees.length;placer();if(!etat.analyse)return;
  var L=liste(),n=L.length,P=PAYS[etat.pays];
  $("recap").textContent=[etat.libre?"Sans limite de budget":"Budget : "+F(etat.budget)].concat([[SAVOIR,etat.savoir],[TEMPS,etat.temps],[LIEU,etat.lieu]].filter(function(a){return a[1];}).map(function(a){for(var i=0;i<a[0].length;i++)if(a[0][i][0]===a[1])return a[0][i][1];})).concat(P?[P.n]:[]).join(" · ");
  if(!n){$("proposition").innerHTML="";$("vedette").innerHTML='<div class="vide">Avec ce montant, commencez par une réserve et un premier test sans dépense. Essayez à partir de 25 000 F pour voir des pistes.</div>';$("cartes").innerHTML="";$("autres").hidden=true;return;}
  $("vedette").innerHTML=vedette(L[0]);$("proposition").innerHTML=proposition(L);
  var A=varier(L.slice(1)),m=A.length;$("autres").hidden=!m;
  $("statut").innerHTML=m+" autre"+(m>1?"s":"")+" piste"+(m>1?"s":"")+(etat.libre?"":", de la plus proche de votre budget à la plus petite");
  $("surprise").hidden=m<=etat.vus;
  var v=[];for(var i=0;i<Math.min(etat.vus,m);i++)v.push(A[(etat.decal+i)%m]);
  $("cartes").innerHTML=v.map(carte).join("");
  var reste=m-etat.vus;$("voir-plus").hidden=reste<=0;$("voir-plus").textContent=etat.vus===3?"Voir d’autres pistes ("+(m-3)+")":"Voir encore "+Math.min(6,reste)+" pistes";}
function change(){etat.decal=0;etat.vus=3;sv();if(etat.analyse){etat.perime=true;$("perime").hidden=false;$("resultats").classList.add("est-perime");}$("lancer").classList.add("brille");placer();}
var T=[];
function analyser(){T.forEach(clearTimeout);T=[];etat.perime=false;$("perime").hidden=true;$("resultats").classList.remove("est-perime");$("lancer").classList.remove("brille");
  var b=etat.libre?"sans limite":FC(etat.budget),n=I.filter(function(x){return x[3]<=B();}).length,red=matchMedia("(prefers-reduced-motion:reduce)").matches,pas=red?150:1500;
  var E=["Je passe en revue les "+I.length+" idées du catalogue…","J’en garde "+n+" qui tiennent dans votre budget ("+b+")…","Je place en tête celles qui sont à la hauteur de votre budget…","Je tiens compte de ce que vous aimez faire, de votre temps et de votre lieu…","Je compose une proposition : projet, réserve, placement…","Je choisis votre meilleure piste."];
  $("guide").hidden=true;$("resultats").hidden=true;var A=$("analyse");A.hidden=false;$("an-l").innerHTML=E.map(function(t){return "<li>"+esc(t)+"</li>";}).join("");var li=[].slice.call($("an-l").children);$("an-barre").style.width="0%";
  $("lancer").disabled=true;$("lancer").textContent="Analyse en cours…";
  if(window.innerWidth<960)A.scrollIntoView({behavior:red?"auto":"smooth",block:"start"});
  li.forEach(function(x,k){T.push(setTimeout(function(){li.forEach(function(y,j){y.className=j<k?"ok":j===k?"en":"";});$("an-barre").style.width=Math.round((k+1)/E.length*100)+"%";},k*pas));});
  T.push(setTimeout(function(){li.forEach(function(y){y.className="ok";});A.hidden=true;etat.analyse=true;$("resultats").hidden=false;$("lancer").disabled=false;$("lancer").textContent="Relancer l’analyse";rendre();
    var v=$("vedette-c");if(v){v.classList.add("eclat");v.scrollIntoView({behavior:red?"auto":"smooth",block:"start"});}
    try{if(window.goatcounter&&goatcounter.count)goatcounter.count({path:"generateur-analyse",title:"Analyse générateur",event:true});}catch(e){}},E.length*pas+300));}
function placer(){var b=B(),P=PAYS[etat.pays],cemac=P&&P.z==="cemac";
  $("placer-titre").textContent=etat.libre?"Placer plutôt que lancer":"Avec "+FC(b).replace(" F"," F")+", placer plutôt que lancer";
  $("marches").innerHTML=PLACER.map(function(p,j){var m=p[0],t=p[1],d=p[2];
    if(t==="La Bourse"){t=cemac?"La Bourse régionale d’Afrique centrale (BVMAC)":"La Bourse (BRVM)";if(cemac)d="Un compte-titres s’ouvre chez un intermédiaire agréé. Les montants de départ et les frais varient : demandez-les avant d’ouvrir.";}
    var ok=m<=b;return '<div class="marche'+(ok?"":" verrou")+'"><small>'+(m===0?"Pour tous les montants":ok?"Accessible dès "+FC(m):"À partir de "+FC(m))+'</small><b>'+esc(t)+'</b><p>'+esc(d)+'</p></div>';}).join("");}

function majMontant(){$("montant").textContent=etat.libre?"Sans limite":F(etat.budget);
  var k=0;PAS.forEach(function(p,i){if(Math.abs(p-etat.budget)<Math.abs(PAS[k]-etat.budget))k=i;});$("budget").value=etat.libre?19:k;
  [].forEach.call($("raccourcis").children,function(b){b.setAttribute("aria-pressed",!etat.libre&&+b.dataset.v===etat.budget);});
  $("sans-budget").textContent=etat.libre?"Revenir à mon budget":"Je préfère explorer sans budget";}
function setBudget(v,garderExact){etat.libre=false;etat.budget=Math.min(50000000,Math.max(10000,Math.round(+v||10000)));if(!garderExact)$("exact").value="";majMontant();change();}

/* Panneau */
var dernierFocus=null;
function ouvrir(id){var x=idee(id);if(!x)return;dernierFocus=document.activeElement;etat.ouverte=id;etat.onglet="idee";$("panneau").hidden=false;$("voile").hidden=false;document.body.classList.add("fige");panneau();$("pn-fermer").focus();
  try{if(window.goatcounter&&goatcounter.count)goatcounter.count({path:"generateur-idee-"+id,title:x[1],event:true});}catch(e){}}
function fermer(){etat.ouverte=null;$("panneau").hidden=true;$("voile").hidden=true;document.body.classList.remove("fige");if(dernierFocus)try{dernierFocus.focus();}catch(e){}}
function prix(x){var base=Math.min(Math.max(etat.libre?x[3]:etat.budget,x[3]),x[4]||x[3]);return Math.min(25000,Math.max(5000,Math.round(base*.01*sec(x)[2]/1000)*1000));}
function panneau(){var x=idee(etat.ouverte);if(!x)return;var S=sec(x),L=liste(),k=L.indexOf(x);
  $("pn-imgw").innerHTML=visuel(x);$("pn-sec").textContent=S[0];$("pn-titre").textContent=x[1];$("pn-num").textContent=k===0?"Votre meilleure piste":k>-1?"Piste "+(k+1)+" sur "+L.length:"Explorer une idée";
  $("pn-meta").innerHTML=["Dès "+(x[3]?FC(x[3]):"0 F"),lieux(x),TEMPS_TXT[x[6]]].map(function(t){return "<span>"+esc(t)+"</span>";}).join("");
  [].forEach.call(document.querySelectorAll(".onglets button"),function(b){b.setAttribute("aria-selected",b.dataset.o===etat.onglet);});
  var C={idee:'<h3>À quoi ressemble cette activité&nbsp;?</h3><p>'+esc(x[8])+'</p><div class="encart"><b>Budget de départ indicatif</b>'+(x[3]?FC(x[3]):"0 F")+(x[4]?" à "+FC(x[4]):"")+'. Il dépend du lieu, de l’équipement et des prix autour de vous.</div>',
    test:'<h3>Un premier test cette semaine</h3><p>'+esc(x[9])+'</p><div class="encart"><b>Votre but</b>Obtenir une réaction réelle, d’un client ou d’un fournisseur, avant de dépenser tout le budget.</div>',
    verif:'<h3>Deux choses à regarder de près</h3><div class="encart"><b>À vérifier</b>'+esc(x[10])+'</div><div class="encart"><b>Le piège courant</b>'+esc(x[11])+'</div>',
    plan:'<h3>Et si l’idée tient la route&nbsp;?</h3><p>Un business plan de démarrage met vos hypothèses à plat&nbsp;: le client, l’offre, les dépenses de départ, trois scénarios de trésorerie et les 30 premiers jours.</p><div class="encart"><b>Prix de lancement</b><s style="color:#B8341A">'+F(prixN(x))+'</s> → <strong>'+(prixF(x)?F(prixF(x)):"Offert")+'</strong>'+cleTxt()+', paiement unique. Le document arrive dans votre espace, ouvert par votre code.</div>'};
  $("onglet").innerHTML=C[etat.onglet];
  var g=etat.gardees.indexOf(x[0])>-1;$("pn-garder").setAttribute("aria-pressed",g);$("pn-garder").textContent=g?"♥ Gardée":"♡ Garder";
  var c=etat.cmp.indexOf(x[0])>-1;$("pn-comparer").setAttribute("aria-pressed",c);$("pn-comparer").textContent=c?"✓ À comparer":"⇄ Comparer";}
function garder(id){var i=etat.gardees.indexOf(id);if(i>-1)etat.gardees.splice(i,1);else etat.gardees.push(id);sv();rendre();if(etat.ouverte)panneau();}
function comparer(id){var i=etat.cmp.indexOf(id);if(i>-1)etat.cmp.splice(i,1);else{if(etat.cmp.length===2)etat.cmp.shift();etat.cmp.push(id);}
  $("bande").hidden=!etat.cmp.length;$("bande-t").textContent=etat.cmp.length===2?"Deux idées à comparer":"Ouvrez une deuxième idée à comparer";$("bande-go").hidden=etat.cmp.length<2;if(etat.ouverte)panneau();}
function autre(){var L=liste();if(!L.length)return;var k=L.indexOf(idee(etat.ouverte));ouvrir(L[(k+1)%L.length][0]);}

/* Modale */
function modale(h){$("md-corps").innerHTML=h;$("modale").hidden=false;document.body.classList.add("fige");$("md-fermer").focus();}
function fermerModale(){$("modale").hidden=true;if(!etat.ouverte)document.body.classList.remove("fige");else $("pn-fermer").focus();}
var CHAP=["Le client et son problème","L’offre et le prix test","Le test terrain","Les dépenses de départ","Les coûts de chaque mois","Les hypothèses de ventes","La trésorerie en trois scénarios","Les risques","Les 30 premiers jours","Ce qu’il reste à vérifier"];
function prixN(x){return prix(x)*2;}
var KC="efa_cle_bp";function cleBP(){try{return JSON.parse(localStorage.getItem(KC)||"null");}catch(e){return null;}}
function prixF(x){var c=cleBP(),r=c&&c.r?c.r:0;return r>=1?0:Math.round(prix(x)*(1-r)/500)*500;}
function cleTxt(){var c=cleBP();if(!c||!c.r)return "";return '<span class="cle-ok">🔑 Votre clé '+(c.r>=1?"« plan offert »":"−"+Math.round(c.r*100)+" %")+' est appliquée</span>';}
function flou(){return '<div class="flou-w"><table class="flou-t"><tr><th>Hypothèse</th><th>Prudent</th><th>Central</th><th>Favorable</th></tr><tr><td>Ventes par mois</td><td><i>88 888 F</i></td><td><i>888 888 F</i></td><td><i>888 888 F</i></td></tr><tr><td>Coût de chaque vente</td><td><i>88 %</i></td><td><i>88 %</i></td><td><i>88 %</i></td></tr><tr><td>Charges fixes du mois</td><td><i>88 888 F</i></td><td><i>88 888 F</i></td><td><i>88 888 F</i></td></tr><tr><td>Mois pour couvrir la mise</td><td><i>88</i></td><td><i>88</i></td><td><i>88</i></td></tr><tr><td>Reste en caisse à 6 mois</td><td><i>888 888 F</i></td><td><i>888 888 F</i></td><td><i>888 888 F</i></td></tr></table><div class="flou-msg">🔒 Vos hypothèses et vos chiffres arrivent dans votre espace</div></div>';}
function apercu(){var x=idee(etat.ouverte);if(!x)return;var p=prix(x);
  modale('<span class="sur">Aperçu · '+esc(sec(x)[0])+'</span><h2>Votre business plan de démarrage</h2><p>Pour «&nbsp;'+esc(x[1])+'&nbsp;», calculé avec vos réponses et livré dans votre espace.</p>'
  +'<p style="margin:12px 0 6px;font-weight:800;color:#0B1220">Votre trésorerie en trois scénarios</p>'+flou()
  +cleTxt()+EFACommande.prixBloc({produit:"Business plan de démarrage",detail:"Paiement unique · livré dans votre espace EFA",prix:prixF(x),prixNormal:prixN(x),etiquette:cleBP()&&cleBP().r?"Avec votre clé":"Prix de lancement"})
  +'<div class="md-act"><button type="button" class="bouton" id="md-cmd">Commander et recevoir mon code</button><a class="bouton second" href="mon-espace-business-plan.html?demo=1">Voir un plan complet d’exemple</a></div>'
  +'<p style="margin:16px 0 6px;font-weight:800;color:#0B1220">Les 10 chapitres du document</p><div class="chapitres">'+CHAP.map(function(c,i){return '<div><b>'+(i+1)+'</b>'+c+'</div>';}).join("")+'</div>');
  $("md-cmd").onclick=commande;}
function commande(){var x=idee(etat.ouverte);if(!x)return;var p=prix(x);
  modale('<span class="sur">Commande</span><h2>Recevez votre code</h2><p>Laissez votre email ou votre numéro WhatsApp. Votre code personnel s’affiche aussitôt.</p><div id="cm-box"></div>');
  var C=cleBP()||{};EFACommande.ouvrir($("cm-box"),{produit:"Business plan de démarrage",titre:x[1],cle:"business-plan",prix:prixF(x),prixNormal:prixN(x),etiquette:C.r?"Avec votre clé":"Prix de lancement",champs:[["client","Votre client principal, en une phrase","ex. les employés de bureau du Plateau"]],extra:{cle_gagnee:C.k?C.k+" ("+(C.r>=1?"offert":"-"+Math.round(C.r*100)+" %")+")":"",secteur:sec(x)[0],budget:etat.libre?"sans limite":String(etat.budget),pays:(PAYS[etat.pays]||{}).n||""}});}
function vueComparer(){var S=etat.cmp.map(idee).filter(Boolean);if(S.length<2)return;
  modale('<span class="sur">Comparer</span><h2>Deux pistes, deux premiers pas</h2><div class="cmp">'+S.map(function(x){return '<div><h3>'+esc(x[1])+'</h3><b>Dès '+(x[3]?FC(x[3]):"0 F")+'</b><br><small>'+TEMPS_TXT[x[6]]+' · '+lieux(x)+'</small><p><strong>Premier test</strong><br>'+esc(x[9])+'</p><p><strong>À vérifier</strong><br>'+esc(x[10])+'</p><p><strong>Le piège</strong><br>'+esc(x[11])+'</p></div>';}).join("")+'</div><p class="md-note">Le budget de départ est une estimation de travail&nbsp;: il ne dit pas quelle idée rapportera le plus.</p>');}
function vueGardees(){var L=etat.gardees.map(idee).filter(Boolean);
  modale('<span class="sur">Mes pistes</span><h2>Vos idées gardées</h2>'+(L.length?L.map(function(x){return '<button type="button" class="gardee" data-o="'+x[0]+'">'+esc(x[1])+' →</button>';}).join(""):'<p>Ouvrez une idée et touchez «&nbsp;Garder&nbsp;» pour la retrouver ici.</p>')+'<p class="md-note">Elles restent sur ce téléphone, sans compte.</p>');
  [].forEach.call(document.querySelectorAll("#md-corps [data-o]"),function(b){b.onclick=function(){fermerModale();ouvrir(b.dataset.o);};});}

/* Démarrage */
function remplir(id,L,val){var s=$(id);s.innerHTML=L.map(function(o){return '<option value="'+o[0]+'">'+esc(o[1])+'</option>';}).join("");s.value=val;s.onchange=function(){etat[id]=s.value;change();};}
remplir("savoir",SAVOIR,etat.savoir);remplir("temps",TEMPS,etat.temps);remplir("lieu",LIEU,etat.lieu);
remplir("pays",Object.keys(PAYS).map(function(k){return [k,PAYS[k].n];}),etat.pays);
RAPIDES.forEach(function(v){var b=document.createElement("button");b.type="button";b.dataset.v=v;b.textContent=v>=1e6?(v/1e6)+" M F":(v/1000)+" 000 F";b.onclick=function(){setBudget(v);};$("raccourcis").appendChild(b);});
$("budget").addEventListener("input",function(e){setBudget(PAS[+e.target.value]);});
$("exact").addEventListener("input",function(e){var v=+String(e.target.value).replace(/\D/g,"");if(v>=1000)setBudget(v,true);});
$("sans-budget").onclick=function(){etat.libre=!etat.libre;majMontant();change();};
$("affiner").onclick=function(){var o=$("affinage").hidden;$("affinage").hidden=!o;$("affiner").setAttribute("aria-expanded",o);$("affiner-s").textContent=o?"−":"＋";};
if(etat.savoir||etat.temps||etat.lieu){$("affinage").hidden=false;$("affiner").setAttribute("aria-expanded","true");$("affiner-s").textContent="−";}
$("surprise").onclick=function(){etat.decal+=etat.vus;rendre();};
$("voir-plus").onclick=function(){etat.vus+=etat.vus===3?3:6;rendre();};
$("lancer").onclick=analyser;$("perime-b").onclick=analyser;
$("vedette").addEventListener("click",function(e){var o=e.target.closest("[data-o]"),g=e.target.closest("[data-g]");if(o)ouvrir(o.dataset.o);if(g)garder(g.dataset.g);});
$("cartes").addEventListener("click",function(e){var o=e.target.closest("[data-o]"),g=e.target.closest("[data-g]");if(o)ouvrir(o.dataset.o);if(g)garder(g.dataset.g);});
[].forEach.call(document.querySelectorAll(".onglets button"),function(b){b.onclick=function(){etat.onglet=b.dataset.o;panneau();};});
$("pn-fermer").onclick=fermer;$("voile").onclick=fermer;
$("pn-garder").onclick=function(){garder(etat.ouverte);};$("pn-comparer").onclick=function(){comparer(etat.ouverte);};$("pn-autre").onclick=autre;$("pn-planb").onclick=apercu;
$("md-fermer").onclick=fermerModale;$("modale").addEventListener("click",function(e){if(e.target===$("modale"))fermerModale();});
$("bande-go").onclick=vueComparer;$("bande-x").onclick=function(){etat.cmp=[];$("bande").hidden=true;if(etat.ouverte)panneau();};
$("gardees-b").onclick=vueGardees;
document.addEventListener("keydown",function(e){if(e.key==="Escape"){if(!$("modale").hidden)fermerModale();else if(!$("panneau").hidden)fermer();}});
majMontant();rendre();
/* Carte à gratter : une carte par jour, environ une sur trois donne une clé (−20 %, −50 % ou plan offert), une seule clé par personne. */
(function(){var cv=$("jx-c"),res=$("jx-res"),gm=$("jx-msg");if(!cv)return;var KJ="efa_jeu_bp",auj=new Date().toISOString().slice(0,10),J={};try{J=JSON.parse(localStorage.getItem(KJ)||"{}")||{};}catch(e){}
  function sJ(){try{localStorage.setItem(KJ,JSON.stringify(J));}catch(e){}}
  function nom(r){return r>=1?"Votre business plan offert":"−"+Math.round(r*100)+" % sur votre business plan";}
  function gagne(c,eclat){res.className="jx-res gagne"+(eclat?" eclat":"");res.innerHTML='<small>Votre clé</small><b>'+(c.r>=1?"Plan offert":"−"+Math.round(c.r*100)+" %")+'</b><span>'+esc(nom(c.r))+'</span>';
    gm.innerHTML='Votre clé <span class="jx-cle">'+c.k+'</span> est gardée sur ce téléphone et s’applique d’elle-même à votre commande.<br><a href="#explorer">Choisir mon idée et commander →</a>';}
  var C=cleBP();if(C&&C.r){cv.hidden=true;gagne(C,false);return;}
  if(J.jour===auj){cv.hidden=true;res.className="jx-res";res.innerHTML='<small>Carte du jour</small><b>Pas cette fois</b><span>Une nouvelle carte vous attend demain.</span>';gm.textContent="Le prix de lancement reste valable en attendant.";return;}
  var tire=null;function tirer(){if(tire!==null)return;var r=Math.random();tire=r<1/3?(r<.2?.2:r<.3?.5:1):0;J.jour=auj;sJ();
    if(tire){var o=new Uint8Array(8),A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",k="";crypto.getRandomValues(o);for(var i=0;i<8;i++)k+=A[o[i]%32];var c={r:tire,k:"CLE-"+k.slice(0,4)+"-"+k.slice(4),d:auj};try{localStorage.setItem(KC,JSON.stringify(c));}catch(e){}}
    try{if(window.goatcounter&&goatcounter.count)goatcounter.count({path:"cle-bp-"+(tire?"gagne-"+Math.round(tire*100):"perdu"),title:"Carte à gratter business plan",event:true});}catch(e){}
    if(tire){res.className="jx-res gagne";res.innerHTML='<small>Gagné</small><b>'+(tire>=1?"Plan offert":"−"+Math.round(tire*100)+" %")+'</b><span>'+esc(nom(tire))+'</span>';}else{res.className="jx-res";res.innerHTML='<small>Carte du jour</small><b>Pas cette fois</b><span>Revenez demain.</span>';}}
  res.className="jx-res";res.innerHTML="<small>Carte du jour</small><b>…</b>";
  var ctx=cv.getContext("2d"),fini=false,bas=false,dpr=window.devicePixelRatio||1;
  function peindre(){var r=cv.getBoundingClientRect();cv.width=r.width*dpr;cv.height=r.height*dpr;ctx.scale(dpr,dpr);var g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,"#DA3C1B");g.addColorStop(.5,"#F2B84B");g.addColorStop(1,"#3CCB7F");ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);
    ctx.fillStyle="#0B1220";ctx.textAlign="center";ctx.textBaseline="middle";ctx.font='800 24px "Source Sans 3",system-ui,sans-serif';ctx.fillText("Grattez ici",r.width/2,r.height/2-12);ctx.font='700 14px "Source Sans 3",system-ui,sans-serif';ctx.fillText("avec le doigt ou la souris",r.width/2,r.height/2+16);ctx.globalCompositeOperation="destination-out";}
  peindre();
  function pt(e){var r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}
  function gratter(e){if(!bas||fini)return;tirer();var p=pt(e);ctx.beginPath();ctx.arc(p[0],p[1],24,0,Math.PI*2);ctx.fill();}
  function part(){var d=ctx.getImageData(0,0,cv.width,cv.height).data,n=0,t=0;for(var i=3;i<d.length;i+=64){t++;if(d[i]===0)n++;}return n/t;}
  function verifier(){if(fini||tire===null)return;if(part()>.45){fini=true;cv.style.transition="opacity .5s";cv.style.opacity="0";setTimeout(function(){cv.hidden=true;},520);
    if(tire){gagne(cleBP(),true);if(etat.ouverte)panneau();}else gm.textContent="Pas de clé aujourd’hui. Le prix de lancement reste valable, et une nouvelle carte vous attend demain.";}}
  cv.addEventListener("pointerdown",function(e){bas=true;cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);gratter(e);});
  cv.addEventListener("pointermove",gratter);cv.addEventListener("pointerup",function(){bas=false;verifier();});cv.addEventListener("pointercancel",function(){bas=false;verifier();});
  cv.tabIndex=0;cv.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();tirer();ctx.fillRect(0,0,cv.width,cv.height);verifier();}});
})();
try{$("gp-maj").textContent="Idées mises à jour en "+window.GEN_MAJ+" · tickets d’entrée indicatifs, en francs CFA, à vérifier sur votre marché.";}catch(e){}
})();
