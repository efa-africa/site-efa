/* EFA · Publications à venir et bouton « Me prévenir à la sortie »
   Une carte s'affiche partout où la page contient : <div data-prevenir="kit-tontine"></div>

   RÉGLAGE À FAIRE UNE FOIS DANS BREVO
   1. Contacts › Listes › Créer une liste : « Intéressés EFA ».
   2. Contacts › Paramètres › Attributs : créer un attribut texte OFFRE.
   3. Contacts › Formulaires › Créer un formulaire d'inscription relié à la liste « Intéressés EFA »,
      avec les champs EMAIL et OFFRE (double confirmation conseillée).
   4. Partager › code HTML : copier l'adresse « action » du formulaire et la coller ci-dessous.
   Tant que PREVENIR_BREVO_URL est vide, chaque demande arrive par email sur newsletter@efa.africa (Web3Forms).

   AJOUTER OU MODIFIER UNE PUBLICATION : modifier la liste PUBLICATIONS.
   prix : "" tant qu'il n'est pas fixé ; ensuite par exemple "5 000 FCFA".
   lien_achat : "" tant que la vente n'est pas ouverte ; une fois rempli, le bouton devient « Obtenir ». */
var PREVENIR_BREVO_URL = '';
var PREVENIR_WEB3_CLE = '426191fb-4812-4de4-b602-5857464c5916';

var PUBLICATIONS = {
  "kit-tontine": {
    etiquette: "Kit EFA",
    titre: "Organiser sa tontine",
    gratuit: 'Les principes restent gratuits : <a href="cercle-spirale.html">Cercle &amp; Spirale, avec mon groupe</a>.',
    ajoute: ["Un guide pour animer les réunions", "Une présentation pédagogique à projeter ou partager", "Un tableau de suivi des cotisations", "Des fiches pour discuter des règles, des responsabilités et de la sortie d’un membre", "Des exemples remplis et un mode d’emploi"],
    pour: "Responsables de tontine, d’association ou d’atelier.",
    format: "Supports modifiables : tableur, présentation, fiches à imprimer.",
    prix: "",
    limite: "Les modèles de règlement seront à adapter au droit de votre pays.",
    lien_achat: ""
  },
  "dossier-tontine": {
    etiquette: "Dossier EFA",
    titre: "Ce que devient l’argent de la tontine",
    gratuit: 'La synthèse et les résultats restent gratuits : <a href="methode.html#etudes">l’étude en ligne</a>.',
    ajoute: ["Les cas détaillés et les trajectoires contrastées", "Les tableaux d’analyse complets", "Des extraits d’entretiens", "Des ressources pratiques pour en parler dans votre groupe"],
    pour: "Lecteurs curieux, responsables de groupes, chercheurs, partenaires.",
    format: "Document PDF.",
    prix: "",
    limite: "Enquête exploratoire : 251 répondants, surtout en Côte d’Ivoire. Elle ne représente pas toute la population.",
    lien_achat: ""
  }
};

(function(){
  var css = '.pv{display:grid;gap:14px;padding:24px;border-radius:14px;border:1px solid rgba(128,140,160,.35);background:rgba(128,140,160,.07);min-width:0;text-align:left}'
  + '.pv-k{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}'
  + '.pv-k .pv-e{background:#E44828;color:#fff;padding:4px 9px;border-radius:2px}'
  + '.pv-k .pv-s{opacity:.75}'
  + '.pv h3{margin:0;font-family:"Libre Baskerville",Georgia,serif;font-weight:700;font-size:clamp(21px,2.4vw,26px);line-height:1.2;text-wrap:balance}'
  + '.pv p{margin:0;font-size:15px;line-height:1.55}'
  + '.pv a{color:inherit;text-decoration:underline;text-underline-offset:3px}'
  + '.pv ul{margin:0;padding-left:20px;display:grid;gap:4px;font-size:15px;line-height:1.5}'
  + '.pv dl{margin:0;display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 14px;font-size:14px;line-height:1.5}'
  + '.pv dt{font-weight:700}.pv dd{margin:0;opacity:.85}'
  + '.pv-lim{font-size:13.5px!important;opacity:.8;font-style:italic}'
  + '.pv-b{justify-self:start;display:inline-flex;align-items:center;min-height:46px;padding:0 20px;border-radius:8px;border:0;background:#E44828;color:#fff!important;font:700 15px "Source Sans 3",system-ui,sans-serif;cursor:pointer;text-decoration:none!important}'
  + '.pv-b:focus-visible{outline:3px solid #6DB8F2;outline-offset:2px}'
  + '.pv form{display:grid;gap:10px}'
  + '.pv input[type=email]{width:100%;box-sizing:border-box;min-height:48px;padding:0 14px;border-radius:8px;border:1px solid rgba(128,140,160,.5);background:#fff;color:#0B1220;font:600 16px "Source Sans 3",system-ui,sans-serif}'
  + '.pv label.pv-ok{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.5}'
  + '.pv label.pv-ok input{margin-top:3px;width:18px;height:18px;flex:none}'
  + '.pv .pv-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}'
  + '.pv .pv-m{font-size:14px;min-height:1em}'
  + '@media (max-width:560px){.pv{padding:20px}.pv-b{justify-self:stretch;justify-content:center}.pv dl{grid-template-columns:minmax(0,1fr)}.pv dd{margin-bottom:6px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function compte(ev){ try{ if(window.goatcounter&&window.goatcounter.count) window.goatcounter.count({path:ev,title:ev,event:true}); }catch(e){} }

  function carte(id, P){
    var ouvert = !!P.lien_achat;
    return '<p class="pv-k"><span class="pv-e">'+esc(P.etiquette)+'</span><span class="pv-s">'+(ouvert?esc(P.prix||''):'Bientôt')+'</span></p>'
      + '<h3>'+esc(P.titre)+'</h3>'
      + '<p>'+P.gratuit+'</p>'
      + '<div><p><b>Ce que '+(P.etiquette.indexOf('Kit')===0?'le kit':'le dossier')+' ajoute</b></p><ul>'+P.ajoute.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>'
      + '<dl><dt>Pour qui</dt><dd>'+esc(P.pour)+'</dd><dt>Format</dt><dd>'+esc(P.format)+'</dd><dt>Prix</dt><dd>'+(P.prix?esc(P.prix):'Annoncé à l’ouverture')+'</dd></dl>'
      + (P.limite?'<p class="pv-lim">'+esc(P.limite)+'</p>':'')
      + (ouvert
          ? '<a class="pv-b" href="'+esc(P.lien_achat)+'" target="_blank" rel="noopener" data-goatcounter-click="achat-'+esc(id)+'">Obtenir · '+esc(P.prix)+'</a>'
          : '<button type="button" class="pv-b" aria-expanded="false">Me prévenir à la sortie</button>'
            + '<form hidden novalidate><input type="email" autocomplete="email" inputmode="email" placeholder="Adresse email" aria-label="Adresse email" maxlength="120" required>'
            + '<input class="pv-hp" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">'
            + '<label class="pv-ok"><input type="checkbox" required><span>J’accepte qu’EFA m’écrive pour annoncer la sortie de cette publication. Mon email ne sert à rien d’autre. <a href="confidentialite.html">Vos données</a></span></label>'
            + '<button type="submit" class="pv-b">Me prévenir</button><p class="pv-m" role="status" aria-live="polite"></p></form>');
  }

  function brancher(el, id, P){
    var b = el.querySelector('button.pv-b[aria-expanded]'), f = el.querySelector('form'); if(!b||!f) return;
    var m = f.querySelector('.pv-m'), mail = f.querySelector('input[type=email]'), ok = f.querySelector('input[type=checkbox]'), hp = f.querySelector('.pv-hp'), s = f.querySelector('button[type=submit]');
    b.addEventListener('click', function(){ b.hidden = true; f.hidden = false; b.setAttribute('aria-expanded','true'); mail.focus(); compte('prevenir-'+id); });
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var em = mail.value.trim();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(em)){ m.textContent = 'Saisissez une adresse email valide.'; return; }
      if(!ok.checked){ m.textContent = 'Cochez la case pour être prévenu.'; return; }
      if(hp.value) return;
      s.disabled = true; m.textContent = 'Envoi en cours…';
      var envoi;
      if(PREVENIR_BREVO_URL){
        var d = new FormData(); d.append('EMAIL', em); d.append('OFFRE', id); d.append('email_address_check',''); d.append('locale','fr');
        envoi = fetch(PREVENIR_BREVO_URL, {method:'POST', body:d, mode:'no-cors'}).then(function(){ return true; });
      } else {
        envoi = fetch('https://api.web3forms.com/submit', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
          body: JSON.stringify({access_key:PREVENIR_WEB3_CLE, subject:'efa.africa · Me prévenir · '+P.etiquette+' « '+P.titre+' »', from_name:'Site efa.africa', email:em, replyto:em, offre:id, message:'Demande « me prévenir à la sortie » : '+P.etiquette+' « '+P.titre+' »'})
        }).then(function(r){ return r.json(); }).then(function(j){ return !!(j&&j.success); });
      }
      envoi.then(function(r){
        if(r){ f.reset(); compte('prevenir-envoi-'+id);
          m.textContent = PREVENIR_BREVO_URL ? 'C’est noté. Confirmez votre adresse dans l’email qui arrive (regardez aussi Promotions et Spam).' : 'C’est noté. Nous vous écrirons à la sortie.'; }
        else m.textContent = 'La demande n’a pas pu partir. Réessayez dans un instant.';
      }).catch(function(){ m.textContent = 'La demande n’a pas pu partir (connexion ?). Réessayez.'; })
      .then(function(){ s.disabled = false; });
    });
  }

  function init(){
    document.querySelectorAll('[data-prevenir]').forEach(function(el){
      var id = el.getAttribute('data-prevenir'), P = PUBLICATIONS[id]; if(!P) return;
      el.classList.add('pv'); el.setAttribute('aria-label', P.etiquette+' : '+P.titre); el.setAttribute('role','region');
      el.innerHTML = carte(id, P); brancher(el, id, P);
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.EFA_PREVENIR_INIT = init;
})();
