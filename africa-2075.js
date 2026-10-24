/* Africa 2075 · accès aux numéros contre une adresse email, et inscription depuis l'article fondateur.
   L'email part vers la liste Brevo « Newsletter EFA » (double confirmation), comme le guide de l'accueil.
   Une fois l'email donné, l'accès reste ouvert sur cet appareil (localStorage). */
(function(){
  var BREVO_URL='https://b46b1615.sibforms.com/serve/MUIFAKh7190-xVONttcMGx9z5uLhlcS3Knrj0HOrhpnsbgPHCoa1GSLsbsCmk1lvMWF8o_An6q6BYBz85koQiVVRpHhage71-PdxWrT1OFhCY5iidi-UIq-C34WPbWb-FGUjhGa5kXw3NytB242VM_LTd9sbakiFejMRUqseZNiyuN8LB_U_cvRkJ7v0E1SyaD-_RVTlQfAI7JLVRw==';
  var CLE='efa_a2075_acces';
  function compte(ev){try{if(window.efaCompte)window.efaCompte(ev);}catch(e){}}
  function lire(){try{return localStorage.getItem(CLE)==='1';}catch(e){return false;}}
  function noter(){try{localStorage.setItem(CLE,'1');}catch(e){}}
  // Lien envoyé aux abonnés par email : ?acces=lecteur ouvre directement les numéros
  try{if(/[?&]acces=lecteur\b/.test(location.search))noter();}catch(e){}
  function valide(em){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em);}
  function envoyer(em){
    var d=new FormData(); d.append('EMAIL',em); d.append('email_address_check',''); d.append('locale','fr');
    return fetch(BREVO_URL,{method:'POST',body:d,mode:'no-cors'});
  }
  function brancher(f,apres){
    var m=f.querySelector('.a2075-msg'), b=f.querySelector('button[type=submit]'), ok=f.querySelector('input[type=checkbox]');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var em=f.querySelector('input[type=email]').value.trim();
      if(!valide(em)){m.textContent='Saisissez une adresse email valide.';return;}
      if(ok&&!ok.checked){m.textContent='Cochez la case pour recevoir Africa 2075.';return;}
      if(f.email_address_check&&f.email_address_check.value) return;
      b.disabled=true; m.textContent='Envoi en cours…';
      envoyer(em).then(function(){apres(m,f);}).catch(function(){
        m.textContent='L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez.';
      }).then(function(){b.disabled=false;});
    });
  }
  // 1. Numéros : le début est en accès libre, la suite contre un email
  var suite=document.querySelector('[data-a2075-suite]'), porte=document.querySelector('[data-a2075-porte]');
  if(suite&&porte){
    var ouvrir=function(){suite.hidden=false;porte.hidden=true;document.documentElement.classList.add('a2075-ouvert');};
    if(lire()){ouvrir();}
    else{
      porte.hidden=false; compte('a2075-porte-vue');
      brancher(porte.querySelector('form'),function(){
        noter(); compte('a2075-porte-email'); ouvrir();
        var merci=document.getElementById('a2075-merci'); if(merci){merci.hidden=false;merci.scrollIntoView({block:'start'});}
      });
    }
  }
  // 2. Article fondateur : en accès libre, inscription pour être prévenu des prochains numéros
  document.querySelectorAll('[data-a2075-inscription]').forEach(function(f){
    brancher(f,function(m){
      noter(); compte('a2075-fondateur-email'); f.reset();
      m.textContent='C’est noté. Un email de confirmation arrive dans quelques minutes (regardez aussi Promotions et Spam). Les numéros d’Africa 2075 vous sont désormais ouverts sur cet appareil.';
    });
  });
})();
