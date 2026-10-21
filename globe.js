/* globe.js · EFA — globe terrestre réaliste, rendu léger sur canvas 2D, sans bibliothèque.
   Image de la Terre : NASA Blue Marble (domaine public, NASA Visible Earth), fichiers terre-2048.jpg et terre-1024.jpg.
   Un tour complet en 100 s, Afrique visible au départ. L'animation s'arrête hors de l'écran, quand l'onglet est masqué,
   si l'utilisateur réduit les animations, ou sur demande (bouton pause). Sans rendu possible, l'image fixe globe.webp reste affichée.
   Chargement différé : rien n'est calculé ni téléchargé avant que la section approche de l'écran ; texture 1024 sur téléphone et tablette. */
(function(){
  function init(){
    var cv=document.getElementById("globe"); if(!cv||!cv.getContext) return;
    var sec=cv.closest("section"), btn=sec&&sec.querySelector(".g-pause"), img=sec&&sec.querySelector(".g-img");
    var ctx=cv.getContext("2d"), reduit=matchMedia("(prefers-reduced-motion: reduce)");
    var pause=false, visible=true, raf=0, t0=null, lon0=20, off=lon0, last=0, pret=false;
    var TILT=-10*Math.PI/180, LUM=[-0.55,-0.45,0.70];
    var tex=null, TW=0, TH=0, N=0, idx=null, lat=null, lon=null, sh=null, out=null, data=null, frame=null;
    var nl=Math.hypot(LUM[0],LUM[1],LUM[2]); LUM=LUM.map(function(v){return v/nl;});
    function prepare(){
      var r=cv.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio||1,1.6);
      N=Math.max(64,Math.min(900,Math.round(r.width*dpr))); cv.width=N; cv.height=N;
      frame=ctx.createImageData(N,N); data=new Uint32Array(frame.data.buffer);
      var R=N/2*0.94, c=N/2, list=[], la=[], lo=[], s=[], ct=Math.cos(TILT), st=Math.sin(TILT);
      for(var y=0;y<N;y++) for(var x=0;x<N;x++){
        var nx=(x+.5-c)/R, ny=(y+.5-c)/R, d=nx*nx+ny*ny; if(d>1) continue;
        var nz=Math.sqrt(1-d);
        // inclinaison de l'axe vers l'observateur
        var Y=-ny*ct+nz*st, Z=ny*st+nz*ct;
        la.push(Math.asin(Y)); lo.push(Math.atan2(nx,Z));
        var l=nx*LUM[0]+ny*LUM[1]+nz*LUM[2], lam=Math.max(0,l), edge=Math.pow(nz,.35);
        s.push(Math.min(1.25,(0.22+0.95*lam)*edge+0.06)); list.push(y*N+x);
      }
      idx=new Uint32Array(list); lat=new Float32Array(la); lon=new Float32Array(lo); sh=new Float32Array(s);
      pret=!!tex; if(pret) dessine();
    }
    function charge(){
      var src=N>=760&&!matchMedia("(pointer:coarse)").matches?"terre-2048.jpg":"terre-1024.jpg", im=new Image(); im.decoding="async";
      im.onload=function(){ try{ var oc=document.createElement("canvas"); TW=oc.width=im.naturalWidth; TH=oc.height=im.naturalHeight; var ox=oc.getContext("2d"); ox.drawImage(im,0,0);
          tex=new Uint32Array(ox.getImageData(0,0,TW,TH).data.buffer); pret=true; dessine(); cv.classList.add("on"); if(img) img.classList.add("off"); relance(); }catch(e){ /* image fixe conservée */ } };
      im.src=src;
    }
    function dessine(){
      if(!pret||!idx) return;
      var o=off*Math.PI/180, n=idx.length, tw=TW, th=TH, k=tw/(2*Math.PI);
      data.fill(0);
      for(var i=0;i<n;i++){
        var L=lon[i]+o; L=L-Math.floor((L+Math.PI)/(2*Math.PI))*2*Math.PI;
        var u=((L+Math.PI)*k)|0, v=((Math.PI/2-lat[i])/Math.PI*th)|0; if(u>=tw)u=tw-1; if(v>=th)v=th-1;
        var p=tex[v*tw+u], s=sh[i];
        var r=(p&255)*s*0.94, g=((p>>8)&255)*s*0.98, b=((p>>16)&255)*s*1.06+6;
        data[idx[i]]=0xFF000000|((b>255?255:b)<<16)|((g>255?255:g)<<8)|(r>255?255:r);
      }
      ctx.putImageData(frame,0,0);
      // atmosphère : liseré bleu et halo doux
      var c=N/2, R=N/2*0.94, h=ctx.createRadialGradient(c,c,R*0.9,c,c,R*1.06);
      h.addColorStop(0,"rgba(109,184,242,0)"); h.addColorStop(.62,"rgba(109,184,242,.22)"); h.addColorStop(.7,"rgba(150,205,255,.18)"); h.addColorStop(1,"rgba(109,184,242,0)");
      ctx.fillStyle=h; ctx.beginPath(); ctx.arc(c,c,R*1.06,0,7); ctx.fill();
    }
    function boucle(ts){ raf=0; if(!actif()) return; if(t0===null) t0=ts-((lon0-off)/360)*100000;
      if(ts-last>=66){ last=ts; off=lon0-((ts-t0)/100000)*360; dessine(); } raf=requestAnimationFrame(boucle); }
    function actif(){ return pret&&!pause&&visible&&!document.hidden&&!reduit.matches; }
    function relance(){ if(actif()&&!raf){ t0=null; raf=requestAnimationFrame(boucle); } }
    var lance=false;
    var attend=false;
    // Le globe passe après le premier écran : on attend la fin du chargement de la page, puis un temps libre
    function demarre(){ if(lance||reduit.matches) return;
      if(document.readyState!=="complete"){ if(!attend){ attend=true; addEventListener("load",function(){ setTimeout(demarre,400); },{once:true}); } return; }
      lance=true; (window.requestIdleCallback||function(f){ setTimeout(f,1); })(function(){ prepare(); charge(); }); }
    addEventListener("resize",function(){ if(!lance) return; clearTimeout(prepare.t); prepare.t=setTimeout(prepare,200); });
    if("IntersectionObserver" in window){
      new IntersectionObserver(function(e){ visible=e[0].isIntersecting; if(visible) demarre(); relance(); }).observe(sec);
      new IntersectionObserver(function(e){ if(e[0].isIntersecting) demarre(); },{rootMargin:"400px 0px"}).observe(sec);
    } else demarre();
    document.addEventListener("visibilitychange",relance);
    if(reduit.addEventListener) reduit.addEventListener("change",function(){ if(btn) btn.hidden=reduit.matches; if(!reduit.matches&&visible) demarre(); relance(); });
    if(btn){ btn.hidden=reduit.matches; btn.addEventListener("click",function(){ pause=!pause; btn.setAttribute("aria-pressed",String(pause)); btn.textContent=pause?"Reprendre l’animation":"Mettre l’animation en pause"; relance(); }); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
