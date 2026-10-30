
/* Photo d'Ely : remplacer "" par l'image (data:image/...) quand elle sera fournie. */
const PHOTO_ELY = window.ELY_PHOTO || "assets/ely.jpg";

const ICONE_ENVOI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICONE_STOP = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>';

const CONVICTIONS = [
  "Ce qui circule n'est pas ce qui reste.",
  "La tontine organise la confiance. Décider avant son tour aide à garder l'argent.",
  "Recevoir son tour, c'est aussi l'argent des autres : décidez avant de le recevoir.",
  "En Afrique, l'aîné est un assureur non déclaré.",
  "La confiance précède le capital.",
  "Avec nos téléphones, nous pouvons construire des usines."
];


const PISTES = [
  "Mon argent est-il un cercle ou une spirale ?",
  "La tontine, c'est de l'épargne ?",
  "Je gagne 200 000 FCFA et il ne me reste rien.",
  "Un proche me demande de l'argent. Prêt ou cadeau ?",
  "Pourquoi l'aîné paie pour toute la famille ?",
  "Je reçois mon tour de tontine bientôt. J'en fais quoi ?"
];

const fil=document.getElementById("fil"), defile=document.getElementById("defile");
const form=document.getElementById("form"), saisie=document.getElementById("saisie"), btn=document.getElementById("envoyer");
const ELY_API="https://ely.elysees-johnson.workers.dev";
let tours=[], ctl=null, enCours=false, sample=true;
function lire(k){try{return sessionStorage.getItem(k)}catch{return null}}
function ecrire(k,v){try{sessionStorage.setItem(k,v)}catch{}}
function nouvelId(){try{return crypto.randomUUID()}catch{return Date.now().toString(36)+Math.random().toString(36).slice(2)}}
let SESSION=lire("efa-ely-session");if(!SESSION){SESSION=nouvelId();ecrire("efa-ely-session",SESSION)}
const SOURCE=(new URLSearchParams(location.search).get("src")||(document.referrer?(function(){try{const h=new URL(document.referrer).hostname;return h.endsWith("efa.africa")?"site":h}catch{return "direct"}})():"direct")).slice(0,40);
function nePasConserver(){try{return localStorage.getItem("efa-ely-nepas")==="1"}catch{return false}}
function boutonsAvis(b,ref){
  if(nePasConserver()||new URLSearchParams(location.search).has('preview'))return;
  const d=document.createElement("div");d.className="avis";d.innerHTML='<span>Cette réponse vous aide ?</span><button type="button" data-v="1" aria-pressed="false">Oui</button><button type="button" data-v="-1" aria-pressed="false">Non</button>';
  d.querySelectorAll("button").forEach(x=>x.onclick=()=>{
    d.querySelectorAll("button").forEach(y=>y.setAttribute("aria-pressed",y===x?"true":"false"));
    fetch(ELY_API+"/avis",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ref,avis:Number(x.dataset.v)})}).catch(()=>{});
    d.querySelector("span").textContent="Merci.";
  });
  b.closest(".msg").after(d);
}

function remplirAvatar(el){
  const statut=el.querySelector(".statut");
  el.textContent="";
  if(PHOTO_ELY){const i=document.createElement("img");i.src=PHOTO_ELY;i.alt="Ely";el.append(i)} else el.append("E");
  if(statut) el.append(statut);
}
function avatar(){const d=document.createElement("div");d.className="avatar";remplirAvatar(d);return d}
remplirAvatar(document.querySelector("[data-avatar]"));

function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function inline(s){
  s=esc(s);
  s=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g,"$1<em>$2</em>");
  s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  s=s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g,'$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  return s;
}
function md(t){
  const out=[];let liste=null;const ferme=()=>{if(liste){out.push(`</${liste}>`);liste=null}};
  for(const l of t.split("\n")){
    const ul=l.match(/^\s*[-•*]\s+(.*)/),ol=l.match(/^\s*\d+[.)]\s+(.*)/),h=l.match(/^#{1,4}\s+(.*)/);
    if(ul||ol){const k=ul?"ul":"ol";if(liste!==k){ferme();out.push(`<${k}>`);liste=k}out.push(`<li>${inline((ul||ol)[1])}</li>`)}
    else if(h){ferme();out.push(`<h3>${inline(h[1])}</h3>`)}
    else if(!l.trim())ferme();
    else{ferme();out.push(`<p>${inline(l)}</p>`)}
  }
  ferme();return out.join("");
}
function enBas(){defile.scrollTop=defile.scrollHeight}
function bulle(role,html){
  const m=document.createElement("div");m.className="msg "+role;
  if(role==="ely")m.append(avatar());
  const b=document.createElement("div");b.className="bulle";b.innerHTML=html;m.append(b);
  fil.append(m);enBas();return b;
}

function accueil(){
 fil.innerHTML="";
 const h=document.createElement("section");h.className="hero";const idee=CONVICTIONS[Math.floor(Math.random()*CONVICTIONS.length)];
 h.innerHTML=`<div class="eyebrow">UN ESPACE POUR COMPRENDRE</div><h1>Parlons de votre argent.<br><em>Simplement.</em></h1><p>Une question, une situation, un projet. On prend le temps de comprendre, puis de trouver votre prochain pas.</p><div class="titre-pistes">Par où souhaitez-vous commencer ?</div><div class="pistes"></div><div class="idee"><div><small>LE REGARD EFA</small><q></q><p>Et si l’on regardait ensemble ce que votre argent devient ?</p></div><button type="button">Explorer cette idée <span>↗</span></button></div>`;
 const labels=[['01 · MON BUDGET','Je gagne 200 000 FCFA et il ne me reste rien.'],['02 · MA TONTINE','Je reçois mon tour de tontine bientôt. J’en fais quoi ?'],['03 · MES PROCHES','Un proche me demande de l’argent. Prêt ou cadeau ?'],['04 · MES PROJETS','Comment préparer une réserve avant de commencer à investir ?']];
 labels.forEach(([title,q])=>{const b=document.createElement('button');b.type='button';b.className='piste';const t=document.createElement('small');t.textContent=title;const x=document.createElement('span');x.textContent=q;const a=document.createElement('i');a.textContent='↗';b.append(t,x,a);b.onclick=()=>envoyer(q);h.querySelector('.pistes').append(b)});
 h.querySelector('.idee q').textContent=idee;h.querySelector('.idee button').onclick=()=>envoyer(`Expliquez-moi cette idée : « ${idee} »`);fil.append(h);document.body.classList.remove('conversation');
}

function etat(occupe){
  enCours=occupe;btn.innerHTML=occupe?ICONE_STOP:ICONE_ENVOI;btn.classList.toggle("stop",occupe);
  btn.setAttribute("aria-label",occupe?"Arrêter":"Envoyer");
  document.querySelectorAll(".piste,.idee button").forEach(b=>b.disabled=occupe);
}

const MESSAGES={
  not_granted:"Ely n'a pas l'autorisation de répondre dans cette vue.",
  sampling_disabled:"Ely n'est pas disponible pour ce compte.",
  rate_limited:"Beaucoup de questions d'un coup. Patientez un instant puis réessayez.",
  session_expired:"Votre session a expiré : reconnectez-vous puis réessayez.",
  refused:"Je ne peux pas répondre à cette demande. Essayez de la formuler autrement.",
  empty_completion:"Pas de réponse cette fois. Reformulez votre question.",
  prompt_too_large:"La conversation est trop longue : touchez « + » pour en ouvrir une nouvelle."
};

async function envoyer(texte){
  texte=(texte||"").trim();if(!texte||enCours)return;document.body.classList.add("conversation");fil.querySelector(".hero")?.remove();
  if(!sample){bulle("ely",'<span class="erreur">Ely est momentanément indisponible. Réessayez dans quelques minutes, ou écrivez-nous à newsletter@efa.africa.</span>');return}
  bulle("moi",esc(texte).replace(/\n/g,"<br>"));
  tours.push({role:"user",content:texte});
  saisie.value="";ajuste();
  const b=bulle("ely",'<span class="points" aria-label="Ely écrit"><i></i><i></i><i></i></span>');
  etat(true);ctl=new AbortController();
  const recents=tours.slice(-16);while(recents.length&&recents[0].role!=="user")recents.shift();
  const ref=nouvelId();
  try{
    const {text,truncated}=await demander(recents,ctl.signal,t=>{b.innerHTML=md(t);enBas()},ref);
    b.innerHTML=md(text)+(truncated?'<div class="erreur">Réponse coupée : demandez la suite.</div>':"");
    tours.push({role:"assistant",content:text});
    boutonsAvis(b,ref);
  }catch(e){
    const partiel=e&&e.code!=="refused"&&e.text?e.text:"";
    b.innerHTML=partiel?md(partiel):"";
    if(partiel)tours.push({role:"assistant",content:partiel});else tours.pop();
    if(e&&e.code!=="cancelled")b.insertAdjacentHTML("beforeend",`<div class="erreur">${MESSAGES[e.code]||"Connexion interrompue. Réessayez."}</div>`);
    else if(!partiel)b.closest(".msg").remove();
    if(e&&["not_granted","sampling_disabled","not_declared","capability_disabled"].includes(e.code))indispo();
  }finally{etat(false);ctl=null;enBas()}
}

async function demander(messages,signal,onText,ref){
  if(new URLSearchParams(location.search).has('preview')){onText('Aperçu du design : votre question a bien été saisie. La connexion à Ely est désactivée dans cette prévisualisation.');return {text:'Aperçu du design : votre question a bien été saisie. La connexion à Ely est désactivée dans cette prévisualisation.',truncated:false};}
  let r;
  try{r=await fetch(ELY_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages,session:SESSION,ref,source:SOURCE,ne_pas_conserver:nePasConserver()}),signal})}
  catch(e){throw{code:signal.aborted?"cancelled":"upstream_error"}}
  if(!r.ok){let m="";try{m=(await r.json()).erreur}catch{}throw{code:r.status===429?"rate_limited":"upstream_error",message:m}}
  const lecteur=r.body.getReader(),dec=new TextDecoder();let tampon="",texte="",coupe=false;
  try{
    while(true){
      const {value,done}=await lecteur.read();if(done)break;
      tampon+=dec.decode(value,{stream:true});
      const lignes=tampon.split("\n");tampon=lignes.pop();
      for(const l of lignes){
        if(!l.startsWith("data:"))continue;
        let ev;try{ev=JSON.parse(l.slice(5))}catch{continue}
        if(ev.type==="content_block_delta"&&ev.delta&&ev.delta.text){texte+=ev.delta.text;onText(texte)}
        if(ev.type==="message_delta"&&ev.delta&&ev.delta.stop_reason==="max_tokens")coupe=true;
        if(ev.type==="error")throw{code:"upstream_error",text:texte};
      }
    }
  }catch(e){throw{code:signal.aborted?"cancelled":(e.code||"upstream_error"),text:texte}}
  if(!texte.trim())throw{code:"empty_completion"};
  return{text:texte,truncated:coupe};
}
function indispo(){sample=null;saisie.disabled=true;btn.disabled=true;saisie.placeholder="Ely est indisponible dans cette vue"}
function ajuste(){saisie.style.height="auto";saisie.style.height=Math.min(saisie.scrollHeight,140)+"px"}
saisie.addEventListener("input",ajuste);
saisie.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
form.addEventListener("submit",e=>{e.preventDefault();if(enCours){ctl?.abort();return}envoyer(saisie.value)});
document.getElementById("nouveau").onclick=()=>{ctl?.abort();tours=[];SESSION=nouvelId();ecrire("efa-ely-session",SESSION);accueil();saisie.focus()};

etat(false);accueil();

document.querySelectorAll('[data-question]').forEach(b=>b.onclick=()=>{saisie.value=b.dataset.question;saisie.focus();ajuste()});
if(new URLSearchParams(location.search).has('preview'))document.getElementById('preview-note').hidden=false;
