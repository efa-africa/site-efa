const menuButton=document.querySelector('.menu-button');
const menu=document.querySelector('#study-menu');
function closeMenu(){menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu')}
menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu')});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
document.addEventListener('click',event=>{if(!document.querySelector('.topbar').contains(event.target))closeMenu()});

const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab,focus=false){tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected});if(focus)tab.focus()}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();selectTab(tabs[next],true)})});

const futures={
  epargne:{title:'Comment transformer de petits flux en capital durable ?',signal:'Les paiements du quotidien circulent vite. Une partie pourrait-elle financer des projets suivis dans le temps ?',action:'Imaginer des outils lisibles pour épargner, comparer les risques et suivre l’usage des fonds.'},
  entreprises:{title:'Comment financer davantage d’entreprises qui produisent ?',signal:'De nombreux projets ont des clients, mais leurs besoins de trésorerie et de croissance ne ressemblent pas à ceux d’un ménage.',action:'Décrire les besoins réels des entreprises, puis tester des formes de financement adaptées à leur durée.'},
  institutions:{title:'Quelles règles permettent de faire durer la confiance ?',signal:'Une communauté peut mobiliser des ressources. Sa solidité dépend aussi de règles compréhensibles et appliquées.',action:'Mettre à l’épreuve la transparence, la gouvernance et la reddition de comptes avant de changer d’échelle.'}
};
document.querySelectorAll('.future-choice').forEach(button=>button.addEventListener('click',()=>{const item=futures[button.dataset.angle];document.querySelectorAll('.future-choice').forEach(choice=>{const active=choice===button;choice.classList.toggle('active',active);choice.setAttribute('aria-pressed',String(active))});document.getElementById('future-title').textContent=item.title;document.getElementById('future-signal').textContent=item.signal;document.getElementById('future-action').textContent=item.action}));
