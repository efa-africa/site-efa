/* EFA · Worker « efa-ecole » · version 1.2 · 25 octobre 2026
   Comptes de l'école pour les organisations : clés d'accès, comptes participants, tableau de bord.

   Réglages (Cloudflare > Workers > efa-ecole > Settings > Variables and Secrets) :
     SUPABASE_URL          (texte)  même projet que la collecte d'Ely
     SUPABASE_SERVICE_KEY  (secret) clé service_role, jamais dans le site
     ADMIN_KEY             (secret) clé maîtresse d'Élysée Johnson, au moins 32 caractères

   Trois niveaux de clé :
     - clé maîtresse (ADMIN_KEY)       : créer un programme, générer la clé d'une organisation, désactiver ;
     - clé d'organisation (32 caract.) : voir son tableau de bord (participants, connexions, progression) ;
     - clé personnelle (24 caract.)    : un compte par participant, pour retrouver sa progression partout.
   Version 1.1 : une organisation crée elle-même ses accès depuis « Composer un programme » (route /organisations),
   sans attendre EFA : 500 places au plus, ouvert un an, au plus 3 créations par email et par jour et 30 par heure au total.
   Version 1.2 : /programme?code=… présente le programme (organisation, modules, rythme) avant la création du compte.
   Les clés ne sont jamais stockées : seule leur empreinte SHA-256 l'est. Aucune somme saisie dans les outils n'est reçue. */

const ORIGINES = ["https://efa.africa", "https://www.efa.africa"];
const VERSION = "1.2";
const AUTO_PLACES = 500, AUTO_PAR_EMAIL = 3, AUTO_PAR_HEURE = 30;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O ni 1/I, pour la lecture et la dictée

/* ---------- Clés ---------- */
function aleatoire(n) {
  const o = new Uint8Array(n); crypto.getRandomValues(o);
  let s = ""; for (const x of o) s += ALPHABET[x % 32]; // 32 symboles : chaque caractère porte 5 bits
  return s;
}
const cleOrganisation = () => "ORG-" + aleatoire(32).match(/.{8}/g).join("-");   // 160 bits
const clePersonnelle = () => "EFA-" + aleatoire(24).match(/.{6}/g).join("-");    // 120 bits
const codeInvitation = () => "EFA-" + aleatoire(4) + "-" + aleatoire(4);         // 40 bits, limité par les places et la date
async function empreinte(cle) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(cle).trim().toUpperCase()));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function egal(a, b) { // comparaison à temps constant
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0;
}

/* ---------- HTTP ---------- */
function cors(origine) {
  return { "Access-Control-Allow-Origin": ORIGINES.includes(origine) ? origine : ORIGINES[0], "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
}
const json = (o, s, c) => new Response(JSON.stringify(o), { status: s || 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...c } });
const porteur = r => ((r.headers.get("Authorization") || "").match(/^Bearer\s+(.+)$/) || [])[1] || "";
async function lire(r) { try { return await r.json(); } catch { return null; } }
const texte = (v, n) => typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, n) : "";

/* ---------- Base de données (Supabase, API REST) ---------- */
function base(env) {
  async function req(chemin, options) {
    const r = await fetch(env.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1" + chemin, {
      ...options,
      headers: { "apikey": env.SUPABASE_SERVICE_KEY, ...(String(env.SUPABASE_SERVICE_KEY).startsWith("sb_") ? {} : { "Authorization": "Bearer " + env.SUPABASE_SERVICE_KEY }),
        "Content-Type": "application/json", ...(options && options.headers) }
    });
    if (!r.ok) throw new Error("base " + r.status);
    return r;
  }
  const un = async (chemin) => (await (await req(chemin)).json())[0] || null;
  return {
    programmeParCle: h => un("/ecole_programmes?cle_hash=eq." + h + "&select=*"),
    programmeParCode: c => un("/ecole_programmes?code=eq." + encodeURIComponent(c) + "&select=*"),
    programmeParId: id => un("/ecole_programmes?id=eq." + encodeURIComponent(id) + "&select=*"),
    participantParCle: h => un("/ecole_participants?cle_hash=eq." + h + "&select=*"),
    async nbParticipants(pid) {
      const r = await req("/ecole_participants?programme_id=eq." + encodeURIComponent(pid) + "&actif=is.true&select=id", { headers: { "Prefer": "count=exact", "Range": "0-0" } });
      return parseInt((r.headers.get("content-range") || "*/0").split("/")[1], 10) || 0;
    },
    async participants(pid) { return (await req("/ecole_participants?programme_id=eq." + encodeURIComponent(pid) + "&select=id,cree_le,nom,email,vu_le,connexions,faits,fiches,certificats,actif&order=nom.asc")).json(); },
    async creerProgramme(l) { return (await (await req("/ecole_programmes", { method: "POST", headers: { "Prefer": "return=representation" }, body: JSON.stringify(l) })).json())[0]; },
    async majProgramme(id, l) { await req("/ecole_programmes?id=eq." + encodeURIComponent(id), { method: "PATCH", headers: { "Prefer": "return=minimal" }, body: JSON.stringify(l) }); },
    async creerParticipant(l) { return (await (await req("/ecole_participants", { method: "POST", headers: { "Prefer": "return=representation" }, body: JSON.stringify(l) })).json())[0]; },
    async majParticipant(id, l) { await req("/ecole_participants?id=eq." + encodeURIComponent(id), { method: "PATCH", headers: { "Prefer": "return=minimal" }, body: JSON.stringify(l) }); },
    async compter(filtre) {
      const r = await req("/ecole_programmes?" + filtre + "&select=id", { headers: { "Prefer": "count=exact", "Range": "0-0" } });
      return parseInt((r.headers.get("content-range") || "*/0").split("/")[1], 10) || 0;
    },
    async stats() { return (await req("/ecole_programmes_stats?select=*&order=cree_le.desc")).json(); }
  };
}

/* ---------- Règles ---------- */
const MODULE = /^[PM]\d{1,2}$/, ETAPE = /^[PM]\d{1,2}\.\d{1,2}$/;
function programmeValide(p) {
  if (!p || !Array.isArray(p.m) || !p.m.length || p.m.length > 30 || !p.m.every(x => MODULE.test(x))) return null;
  return { m: p.m, s: Math.min(52, Math.max(1, +p.s || 8)), mi: Math.min(600, Math.max(15, +p.mi || 45)), f: ["0", "1", "2"].includes(String(p.f)) ? String(p.f) : "0", c: ["F", "M", "P"].filter(l => String(p.c || "").includes(l)).join("") };
}
function ouvert(pg) { return pg && pg.actif && (!pg.expire_le || new Date(pg.expire_le + "T23:59:59Z") >= new Date()); }
const publicProgramme = pg => ({ id: pg.id, nom: pg.nom, programme: pg.programme, expire_le: pg.expire_le, actif: pg.actif });
const publicParticipant = pa => ({ id: pa.id, nom: pa.nom, email: pa.email, cree_le: pa.cree_le, vu_le: pa.vu_le, faits: pa.faits, fiches: pa.fiches, certificats: pa.certificats });

/* ---------- Routes ---------- */
async function admin(request, env, db, chemin, c) {
  if (!env.ADMIN_KEY || env.ADMIN_KEY.length < 32 || !egal(porteur(request), env.ADMIN_KEY)) return json({ erreur: "Clé maîtresse incorrecte." }, 401, c);
  if (request.method === "GET" && chemin === "/admin/programmes") return json({ programmes: await db.stats() }, 200, c);
  const b = await lire(request) || {};
  if (request.method === "POST" && chemin === "/admin/programmes") {
    const nom = texte(b.nom, 80), prog = programmeValide(b.programme);
    if (nom.length < 2) return json({ erreur: "Indiquez le nom de l'organisation." }, 400, c);
    if (!prog) return json({ erreur: "Programme illisible : collez le lien du programme composé en ligne." }, 400, c);
    const cle = cleOrganisation();
    let code = codeInvitation();
    for (let k = 0; k < 5 && await db.programmeParCode(code); k++) code = codeInvitation();
    const pg = await db.creerProgramme({ nom, programme: prog, cle_hash: await empreinte(cle), code,
      places: Math.min(100000, Math.max(1, parseInt(b.places, 10) || 100)), expire_le: /^\d{4}-\d{2}-\d{2}$/.test(b.expire_le || "") ? b.expire_le : null, note: texte(b.note, 300) || null });
    return json({ programme: publicProgramme(pg), cle_organisation: cle, code: pg.code }, 201, c); // la clé n'est montrée qu'une fois
  }
  if (request.method === "POST" && chemin === "/admin/programme") {
    const pg = await db.programmeParId(texte(b.id, 40)); if (!pg) return json({ erreur: "Programme introuvable." }, 404, c);
    const maj = {}, rep = {};
    if (typeof b.actif === "boolean") maj.actif = b.actif;
    if (b.places) maj.places = Math.min(100000, Math.max(1, parseInt(b.places, 10) || pg.places));
    if (b.expire_le === null || /^\d{4}-\d{2}-\d{2}$/.test(b.expire_le || "")) maj.expire_le = b.expire_le || null;
    if (b.nouvelle_cle === true) { rep.cle_organisation = cleOrganisation(); maj.cle_hash = await empreinte(rep.cle_organisation); }
    if (b.nouveau_code === true) { rep.code = maj.code = codeInvitation(); }
    if (Object.keys(maj).length) await db.majProgramme(pg.id, maj);
    return json({ ok: true, ...rep }, 200, c);
  }
  return json({ erreur: "Route inconnue." }, 404, c);
}

async function organisation(request, env, db, chemin, c) {
  const cle = porteur(request); if (!/^ORG-/.test(cle)) return json({ erreur: "Clé d'organisation incorrecte." }, 401, c);
  const pg = await db.programmeParCle(await empreinte(cle));
  if (!pg) return json({ erreur: "Clé d'organisation incorrecte." }, 401, c);
  if (request.method === "GET" && chemin === "/orga") {
    const pas = await db.participants(pg.id);
    return json({ programme: { ...publicProgramme(pg), code: pg.code, places: pg.places }, participants: pas.filter(p => p.actif).map(publicParticipant) }, 200, c);
  }
  if (request.method === "POST" && chemin === "/orga/retirer") {
    const b = await lire(request) || {}; const pas = await db.participants(pg.id);
    if (!pas.some(p => p.id === b.id)) return json({ erreur: "Participant introuvable." }, 404, c);
    await db.majParticipant(b.id, { actif: false }); return json({ ok: true }, 200, c);
  }
  return json({ erreur: "Route inconnue." }, 404, c);
}

// Création des accès par l'organisation elle-même, à la fin de « Composer un programme »
async function inscrireOrganisation(request, env, db, c) {
  const b = await lire(request) || {};
  const nom = texte(b.nom, 80), prog = programmeValide(b.programme), r = b.responsable || {};
  const rNom = texte(r.nom, 80), rFonction = texte(r.fonction, 80), rEmail = texte(r.email, 120).toLowerCase();
  if (b.accord !== true) return json({ erreur: "Cochez la case pour accepter les conditions des accès." }, 400, c);
  if (nom.length < 2) return json({ erreur: "Indiquez le nom de l'organisation." }, 400, c);
  if (!prog) return json({ erreur: "Programme illisible : recomposez-le, puis réessayez." }, 400, c);
  if (rNom.length < 2) return json({ erreur: "Indiquez le nom du responsable du programme." }, 400, c);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(rEmail)) return json({ erreur: "Indiquez une adresse email valide pour le responsable." }, 400, c);
  const jour = new Date(Date.now() - 864e5).toISOString(), heure = new Date(Date.now() - 36e5).toISOString();
  if (await db.compter("note=ilike." + encodeURIComponent("*" + rEmail + "*") + "&cree_le=gte." + jour) >= AUTO_PAR_EMAIL) return json({ erreur: "Vous avez déjà créé plusieurs programmes aujourd'hui. Écrivez à EFA pour en ouvrir un autre." }, 429, c);
  if (await db.compter("note=like.auto*&cree_le=gte." + heure) >= AUTO_PAR_HEURE) return json({ erreur: "Beaucoup de demandes en ce moment : réessayez dans une heure, ou écrivez à EFA." }, 429, c);
  const demande = Math.max(1, parseInt(b.places, 10) || 50), places = Math.min(AUTO_PLACES, demande);
  const fin = new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10);
  const cle = cleOrganisation();
  let code = codeInvitation();
  for (let k = 0; k < 5 && await db.programmeParCode(code); k++) code = codeInvitation();
  const pg = await db.creerProgramme({ nom, programme: prog, cle_hash: await empreinte(cle), code, places, expire_le: fin,
    note: ("auto · " + rNom + (rFonction ? " (" + rFonction + ")" : "") + " · " + rEmail + (demande > places ? " · demande " + demande + " places" : "")).slice(0, 300) });
  return json({ programme: { ...publicProgramme(pg), code: pg.code, places: pg.places }, cle_organisation: cle, code: pg.code, places_demandees: demande }, 201, c);
}

// Ce que le participant voit avant de créer son compte : le programme de son organisation (jamais la liste des inscrits)
async function apercu(request, env, db, c) {
  const code = texte(new URL(request.url).searchParams.get("code"), 20).toUpperCase();
  const pg = /^EFA-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code) && await db.programmeParCode(code);
  if (!ouvert(pg)) return json({ erreur: "Ce code n’est pas reconnu ou n’est plus actif." }, 404, c);
  const complet = await db.nbParticipants(pg.id) >= pg.places;
  return json({ programme: { id: pg.id, nom: pg.nom, programme: pg.programme, expire_le: pg.expire_le }, complet }, 200, c);
}

async function rejoindre(request, env, db, c) {
  const b = await lire(request) || {};
  const code = texte(b.code, 20).toUpperCase(), nom = texte(b.nom, 80), email = texte(b.email, 120).toLowerCase() || null;
  if (b.accord !== true) return json({ erreur: "Merci d'accepter les conditions du compte." }, 400, c);
  if (nom.length < 2) return json({ erreur: "Indiquez votre prénom et votre nom." }, 400, c);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return json({ erreur: "Adresse email invalide." }, 400, c);
  const pg = code && await db.programmeParCode(code);
  if (!ouvert(pg)) return json({ erreur: "Code inconnu ou programme fermé. Vérifiez le code donné par votre organisation." }, 404, c);
  if (await db.nbParticipants(pg.id) >= pg.places) return json({ erreur: "Toutes les places de ce programme sont prises. Prévenez votre organisation." }, 409, c);
  const cle = clePersonnelle();
  const pa = await db.creerParticipant({ programme_id: pg.id, nom, email, cle_hash: await empreinte(cle), vu_le: new Date().toISOString(), connexions: 1 });
  return json({ cle_personnelle: cle, participant: publicParticipant(pa), programme: publicProgramme(pg) }, 201, c);
}

function nettoyerProgression(b) {
  const faits = {}; if (b && b.faits && typeof b.faits === "object") Object.keys(b.faits).slice(0, 600).forEach(k => { if (ETAPE.test(k) && b.faits[k]) faits[k] = 1; });
  const fiches = Array.isArray(b && b.fiches) ? [...new Set(b.fiches.filter(x => typeof x === "string" && MODULE.test(x)))].slice(0, 40) : [];
  const certificats = {}; if (b && b.certificats && typeof b.certificats === "object") ["fondations", "maitrise", "patrimoine", "cefa"].forEach(k => { const v = texte(b.certificats[k], 30); if (/^(EFA-[FMP]|CEFA)-\d{4}-\d{6}$/.test(v)) certificats[k] = v; });
  return { faits, fiches, certificats };
}
async function moi(request, env, db, chemin, c) {
  const cle = porteur(request); if (!/^EFA-/.test(cle)) return json({ erreur: "Clé personnelle incorrecte." }, 401, c);
  const pa = await db.participantParCle(await empreinte(cle));
  if (!pa || !pa.actif) return json({ erreur: "Clé personnelle incorrecte ou compte retiré." }, 401, c);
  const pg = await db.programmeParId(pa.programme_id);
  const b = await lire(request) || {};
  const maj = { vu_le: new Date().toISOString() };
  if (b.connexion === true) maj.connexions = (pa.connexions || 0) + 1;
  if (chemin === "/moi/sync") { // on additionne : une étape cochée sur un téléphone le reste partout
    const n = nettoyerProgression(b);
    maj.faits = { ...(pa.faits || {}), ...n.faits };
    maj.fiches = [...new Set([...(pa.fiches || []), ...n.fiches])];
    maj.certificats = { ...(pa.certificats || {}), ...n.certificats };
  }
  await db.majParticipant(pa.id, maj);
  return json({ participant: publicParticipant({ ...pa, ...maj }), programme: publicProgramme(pg), ouvert: ouvert(pg) }, 200, c);
}

export async function traiter(request, env, db) {
  const c = cors(request.headers.get("Origin") || "");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: c });
  const chemin = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
  if (request.method === "GET" && chemin === "/") return json({ service: "École EFA · organisations", version: VERSION, base: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) }, 200, c);
  if (request.method === "POST" && !ORIGINES.includes(request.headers.get("Origin") || "")) return json({ erreur: "Origine non autorisée." }, 403, c);
  if (!(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY)) return json({ erreur: "Service en cours d'installation." }, 503, c);
  try {
    if (chemin.startsWith("/admin/")) return await admin(request, env, db, chemin, c);
    if (chemin === "/orga" || chemin.startsWith("/orga/")) return await organisation(request, env, db, chemin, c);
    if (request.method === "GET" && chemin === "/programme") return await apercu(request, env, db, c);
    if (request.method === "POST" && chemin === "/organisations") return await inscrireOrganisation(request, env, db, c);
    if (request.method === "POST" && chemin === "/rejoindre") return await rejoindre(request, env, db, c);
    if (request.method === "POST" && (chemin === "/moi" || chemin === "/moi/sync")) return await moi(request, env, db, chemin, c);
    return json({ erreur: "Route inconnue." }, 404, c);
  } catch (e) {
    return json({ erreur: "Service momentanément indisponible." }, 502, c);
  }
}

export default { fetch: (request, env) => traiter(request, env, base(env)) };
