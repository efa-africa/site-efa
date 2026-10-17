/* Référentiel commun au simulateur public et à la version administrateur :
   questionnaire, barème, calculs et radar. Toute modification ici vaut pour les deux. */

const DIMS = [
  {k:"savoir", n:"Savoir", conseil:"Reprenez les quatre bases : inflation, intérêt, intérêts composés, diversification."},
  {k:"habitudes", n:"Habitudes", conseil:"Installez une seule règle : épargner le jour où le revenu arrive."},
  {k:"projection", n:"Projection", conseil:"Écrivez un objectif avec un montant et une date."},
  {k:"resilience", n:"Résilience", conseil:"Visez d'abord un mois de dépenses en réserve, puis trois."},
  {k:"rapport", n:"Rapport à l'argent", conseil:"Attendez 72 heures avant tout achat non prévu."},
  {k:"flux", n:"Flux communautaires", conseil:"Fixez un montant mensuel pour les proches et annoncez-le."}
];
// o : [libellé, points]. Savoir : 1 point par bonne réponse. Autres dimensions : 0 à 2.
const Q = [
 {d:"savoir",id:"S1",q:"Vous avez de l'argent à placer. Qu'est-ce qui est le plus sûr ?",o:[["Le mettre dans une seule activité ou un seul placement",0],["Le répartir entre plusieurs activités ou placements",1],["Je ne sais pas",0]]},
 {d:"savoir",id:"S2",q:"Dans les dix ans qui viennent, les prix de ce que vous achetez doublent. Si votre revenu double aussi, vous pourrez acheter…",o:[["Moins qu'aujourd'hui",0],["Autant qu'aujourd'hui",1],["Plus qu'aujourd'hui",0],["Je ne sais pas",0]]},
 {d:"savoir",id:"S3",q:"Vous devez emprunter 100 000 F. Quel remboursement est le plus faible ?",o:[["105 000 F",0],["100 000 F plus 3 %",1],["Je ne sais pas",0]]},
 {d:"savoir",id:"S4",q:"Vous placez de l'argent à la banque pendant deux ans. La banque ajoute 15 % par an. La deuxième année, elle ajoutera…",o:[["Plus d'argent que la première année",1],["Le même montant que la première année",0],["Je ne sais pas",0]]},
 {d:"habitudes",id:"H1",q:"Savez-vous combien vous avez dépensé le mois dernier ?",o:[["Oui, je le note",2],["À peu près",1],["Non",0]]},
 {d:"habitudes",id:"H2",q:"Quand un revenu arrive, votre épargne…",o:[["Je la mets de côté en premier",2],["J'épargne ce qui reste à la fin",1],["J'épargne rarement",0]]},
 {d:"habitudes",id:"H3",q:"Vos factures et vos engagements (loyer, scolarité, cotisations)…",o:[["Je les paie toujours à temps",2],["Il m'arrive d'être en retard",1],["Je suis souvent en retard",0]]},
 {d:"projection",id:"P1",q:"Avez-vous un objectif financier avec un montant et une date ?",o:[["Oui, il est écrit",2],["Oui, dans ma tête",1],["Non",0]]},
 {d:"projection",id:"P2",q:"Quand vous organisez votre argent, vous regardez surtout…",o:[["L'année et au-delà",2],["Le mois",1],["La semaine ou le jour",0]]},
 {d:"projection",id:"P3",q:"Pour vos vieux jours…",o:[["J'ai commencé à mettre de côté ou à investir",2],["J'y pense, sans avoir commencé",1],["Je n'y ai pas pensé",0]]},
 {d:"resilience",id:"R1",q:"En cas d'urgence, pourriez-vous réunir en trente jours l'équivalent d'un mois de vos dépenses ?",o:[["Oui, sans difficulté",2],["Oui, mais ce serait difficile",1],["Non",0]]},
 {d:"resilience",id:"R2",q:"Sans aucun revenu, combien de temps tiendriez-vous avec votre épargne ?",o:[["Trois mois ou plus",2],["Entre un et trois mois",1],["Moins d'un mois",0]]},
 {d:"resilience",id:"R3",q:"Vos revenus viennent de…",o:[["Deux sources ou plus",2],["Une seule source, régulière",1],["Une seule source, irrégulière",0]]},
 {d:"rapport",id:"A1",q:"Un achat non prévu vous fait envie. Vous…",o:[["J'attends quelques jours avant de décider",2],["J'achète si j'ai l'argent",1],["J'achète, quitte à emprunter",0]]},
 {d:"rapport",id:"A2",q:"Parler d'argent avec vos proches (conjoint, famille)…",o:[["Nous en parlons ouvertement",2],["Seulement quand il y a un problème",1],["Jamais",0]]},
 {d:"rapport",id:"A3",q:"Avant une décision financière importante…",o:[["Je compare plusieurs options",2],["Je suis l'avis d'un proche",1],["Je décide vite, sans comparer",0]]},
 {d:"flux",id:"F1",q:"Un proche vous demande de l'argent. Le plus souvent…",o:[["J'ai un montant prévu pour cela chaque mois",2],["Je donne selon ce que j'ai ce jour-là",1],["Je donne, même si cela me met en difficulté",0]]},
 {d:"flux",id:"F2",q:"Votre rapport à la tontine ?",o:[["Je cotise et je sais déjà à quoi servira ma levée",2],["Je ne participe à aucune tontine",1],["Je cotise, je déciderai le moment venu",0]]},
 {d:"flux",id:"F3",q:"Funérailles, mariages, cotisations de village : ces dépenses…",o:[["J'ai une provision pour cela",2],["Je me débrouille quand elles arrivent",1],["Je dois souvent emprunter pour y faire face",0]]}
];
const PROFIL_Q = [
 {k:"sexe",q:"Vous êtes…",o:["Une femme","Un homme","Je préfère ne pas répondre"]},
 {k:"age",q:"Votre tranche d'âge ?",o:["18-24 ans","25-34 ans","35-49 ans","50 ans et plus"]},
 {k:"pays",q:"Votre pays de résidence ?",o:["Côte d'Ivoire","Sénégal","Bénin","Burkina Faso","Mali","Togo","Cameroun","France","Autre"]},
 {k:"statut",q:"Votre activité principale ?",o:["Salarié","Indépendant ou commerçant","Étudiant","Sans emploi","Autre"]}
];
const PROFILS = {
 stratege:{n:"Le Stratège",t:"Vous comprenez les mécanismes et votre pratique suit."},
 averti:{n:"L'Averti",t:"Vous savez ce qu'il faut faire. Votre pratique ne suit pas encore."},
 discipline:{n:"Le Discipliné",t:"Vous êtes rigoureux, mais les bases théoriques vous manquent."},
 explorateur:{n:"L'Explorateur",t:"Vous démarrez. Chaque habitude installée maintenant comptera double."}
};
const CIBLE = 70;
const KEY = "efa_barometre_v1";   // stockage local des réponses, partagé avec la version administrateur

/* ---------- Outils ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const fcfa = n => Math.round(n).toLocaleString("fr-FR") + " F";
const clamp = x => Math.max(0, Math.min(1, x));
const pct = x => Math.round(x * 100) + " %";
const qi = id => Q.findIndex(q => q.id === id);
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const share = (rs, f) => rs.length ? Math.round(rs.filter(f).length / rs.length * 100) : 0;

/* ---------- Parcours 0 : scores ---------- */
function scores(ans) {
  const s = {}; DIMS.forEach(d => s[d.k] = [0, 0]);
  Q.forEach((q, i) => { const mx = Math.max(...q.o.map(o => o[1])); s[q.d][0] += q.o[ans[i]][1]; s[q.d][1] += mx; });
  const out = {}; DIMS.forEach(d => out[d.k] = Math.round(s[d.k][0] / s[d.k][1] * 100));
  out.global = Math.round(DIMS.reduce((a, d) => a + out[d.k], 0) / DIMS.length);
  out.bonnes = s.savoir[0];
  const pratique = (out.habitudes + out.projection + out.resilience) / 3;
  const hk = out.bonnes >= 3, hp = pratique >= 50;
  out.profil = hk && hp ? "stratege" : hk ? "averti" : hp ? "discipline" : "explorateur";
  out.palier = out.global >= CIBLE ? "Maîtrise" : out.global >= 40 ? "En construction" : "Fragile";
  return out;
}

/* ---------- Parcours 1 : score de stabilité ----------
   v : {rev, dep, det, fam, ton, epa, src} en francs CFA par mois (src = nombre de sources de revenus) */
function calcP1(v) {
  const marge = v.rev - v.dep - v.det - v.fam;            // la tontine compte comme épargne
  const s = marge / v.rev, d = v.det / v.rev, f = v.fam / v.rev;
  const charges = v.dep + v.det + v.fam;
  const mois = charges > 0 ? v.epa / charges : 3;
  const P = [
    {k:"Marge mensuelle", pts:25 * clamp(s / 0.20), d:"Épargne possible : " + pct(Math.max(s, 0)) + " du revenu"},
    {k:"Poids des dettes", pts:25 * clamp(1 - d / 0.5), d:"Remboursements : " + pct(d) + " du revenu"},
    {k:"Résistance aux chocs", pts:20 * clamp(mois / 3) + (v.src >= 2 ? 5 : 0), d:"Réserve : " + mois.toFixed(1).replace(".", ",") + " mois de charges"},
    {k:"Flux communautaires", pts:25 * clamp(1 - (f - 0.10) / 0.30), d:"Soutien aux proches : " + pct(f) + " du revenu"}
  ];
  const score = Math.round(P.reduce((a, p) => a + p.pts, 0));
  const niveau = score >= 75 ? "Solide" : score >= 50 ? "En équilibre" : score >= 25 ? "Fragile" : "En alerte";
  const plans = [
    () => "Dégager " + fcfa(Math.max(0, 0.2 * v.rev - marge)) + " de plus par mois pour atteindre 20 % d'épargne. Commencez par la plus grosse dépense variable.",
    () => d > 1 / 3 ? "Ramener vos remboursements de " + fcfa(v.det) + " à " + fcfa(v.rev / 3) + " par mois (un tiers du revenu). Soldez d'abord la dette la plus chère, n'en ouvrez aucune nouvelle." : "Vos remboursements restent sous un tiers du revenu. Soldez la dette la plus chère en premier.",
    () => "Constituer une réserve de trois mois de charges : cible " + fcfa(3 * charges) + ", il manque " + fcfa(Math.max(0, 3 * charges - v.epa)) + "." + (v.src < 2 ? " Ouvrez une deuxième source de revenu, même petite." : ""),
    () => "Fixer une enveloppe mensuelle pour les proches. Repère : 10 % du revenu, soit " + fcfa(0.1 * v.rev) + ". Aujourd'hui : " + fcfa(v.fam) + ". Annoncez ce montant, il protège la relation autant que votre budget."
  ];
  const ordre = P.map((p, i) => ({i, pts: p.pts})).sort((a, b) => a.pts - b.pts).filter(x => x.pts < 20).slice(0, 3);
  const actions = ordre.map(x => plans[x.i]());
  if (!actions.length) actions.push("Vos quatre piliers tiennent. La suite logique est de donner un objectif à votre épargne.");
  const tontine = v.ton > 0 ? "Votre tontine représente " + pct(v.ton / v.rev) + " du revenu. Décidez maintenant de l'usage de votre levée : c'est elle qui fait de la cotisation une épargne." : "";
  return {score, niveau, piliers: P.map(p => ({k: p.k, pts: Math.round(p.pts), d: p.d})), actions, tontine, reste: marge - v.ton,
          ratios: {epargne: +s.toFixed(3), dette: +d.toFixed(3), famille: +f.toFixed(3), tontine: +(v.ton / v.rev).toFixed(3), mois: +mois.toFixed(2), sources: v.src}};
}

/* ---------- Radar ----------
   series : [{n: nom, c: couleur, v: {savoir: 0-100, ...}, fill: bool}] */
function radar(series, label) {
  const W = 460, H = 400, cx = W / 2, cy = H / 2, R = 130, n = DIMS.length;
  const pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * R * v / 100, cy + Math.sin(a) * R * v / 100]; };
  const poly = f => DIMS.map((d, i) => pt(i, f(d)).map(x => x.toFixed(1)).join(",")).join(" ");
  let s = `<svg viewBox="-34 0 ${W + 68} ${H}" role="img" aria-label="${label}">`;
  [25, 50, 75, 100].forEach(r => s += `<polygon points="${poly(() => r)}" fill="none" stroke="var(--line)"/>`);
  DIMS.forEach((d, i) => { const [x, y] = pt(i, 100); s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--line)"/>`; });
  s += `<polygon points="${poly(() => CIBLE)}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 5"/>`;
  series.forEach(se => {
    s += `<polygon points="${poly(d => se.v[d.k])}" fill="${se.fill ? se.c : "none"}" fill-opacity=".16" stroke="${se.c}" stroke-width="2" stroke-linejoin="round"/>`;
    DIMS.forEach((d, i) => { const [x, y] = pt(i, se.v[d.k]); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${se.c}" stroke="var(--surface)" stroke-width="2"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="transparent" data-tip="${se.n} · ${d.n} : ${Math.round(se.v[d.k])} / 100"/>`; });
  });
  DIMS.forEach((d, i) => {
    const [lx, ly] = pt(i, 118), anchor = Math.abs(lx - cx) < 8 ? "middle" : lx > cx ? "start" : "end", w = d.n.split(" ");
    if (w.length > 1 && anchor !== "middle") s += `<text x="${lx.toFixed(1)}" y="${(ly - 3).toFixed(1)}" text-anchor="${anchor}">${w[0]}<tspan x="${lx.toFixed(1)}" dy="15">${w.slice(1).join(" ")}</tspan></text>`;
    else s += `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${anchor}">${d.n}</text>`;
  });
  return s + "</svg>";
}
