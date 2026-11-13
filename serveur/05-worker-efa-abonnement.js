/* EFA · Worker « efa-abonnement » · version 1.0 · 13 novembre 2026
   efa. abonnement : un accès par personne, ouvert avec son prénom, son nom et un code à 6 chiffres.

   Réglages (Cloudflare > Workers > efa-abonnement > Settings > Variables and Secrets) :
     SUPABASE_URL          (texte)  même projet que l'école
     SUPABASE_SERVICE_KEY  (secret) clé service_role, jamais dans le site
     ADMIN_KEY             (secret) clé maîtresse d'Élysée Johnson, au moins 32 caractères (la même que pour l'école convient)

   Deux niveaux :
     - clé maîtresse (ADMIN_KEY) : créer un accès (le code est montré une seule fois), prolonger, fermer, donner un nouveau code ;
     - abonné : prénom + nom + code à 6 chiffres, puis un jeton gardé sur son appareil (3 appareils au plus).
   Le code n'est jamais stocké : seule son empreinte SHA-256, avec un sel propre à chaque accès, l'est.
   Après 5 codes faux d'affilée pour un même nom : 15 minutes d'attente. */

const ORIGINES = ["https://efa.africa", "https://www.efa.africa", "https://efa-test.pages.dev"];
const VERSION = "1.0";
const FORMULES = ["essentiel", "integral", "cercle", "privilege"];
const ESSAIS_MAX = 5, ATTENTE_MIN = 15, APPAREILS = 3;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/* ---------- Clés ---------- */
function aleatoire(n) {
  const o = new Uint8Array(n); crypto.getRandomValues(o);
  let s = ""; for (const x of o) s += ALPHABET[x % 32];
  return s;
}
function codeSix() { // 6 chiffres, tirage sans biais
  const o = new Uint32Array(1); let v;
  do { crypto.getRandomValues(o); v = o[0]; } while (v >= 4294000000);
  return String(v % 1000000).padStart(6, "0");
}
async function sha(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("");
}
const empreinteCode = (sel, nomCle, code) => sha("efa-abonnement|" + sel + "|" + nomCle + "|" + code);
const empreinteJeton = j => sha("jeton|" + String(j).trim());
function egal(a, b) { // comparaison à temps constant
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0;
}
const norme = (p, n) => (p + " " + n).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/* ---------- HTTP ---------- */
function cors(origine) {
  return { "Access-Control-Allow-Origin": ORIGINES.includes(origine) ? origine : ORIGINES[0], "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
}
const json = (o, s, c) => new Response(JSON.stringify(o), { status: s || 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...c } });
const porteur = r => ((r.headers.get("Authorization") || "").match(/^Bearer\s+(.+)$/) || [])[1] || "";
async function lire(r) { try { return await r.json(); } catch { return null; } }
const texte = (v, n) => typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, n) : "";
const jour = d => d.toISOString().slice(0, 10);
const plus = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return jour(d); };

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
  const tous = async chemin => await (await req(chemin)).json();
  return {
    parNom: cle => tous("/abo_acces?nom_cle=eq." + encodeURIComponent(cle) + "&select=*&order=fin.desc"),
    parJeton: async h => (await tous("/abo_acces?jetons=cs.%7B" + h + "%7D&select=*"))[0] || null,
    parId: async id => (await tous("/abo_acces?id=eq." + encodeURIComponent(id) + "&select=*"))[0] || null,
    liste: () => tous("/abo_acces?select=id,cree_le,prenom,nom,formule,debut,fin,atelier,actif,vu_le,connexions,contact,note&order=cree_le.desc&limit=500"),
    async creer(l) { return (await (await req("/abo_acces", { method: "POST", headers: { "Prefer": "return=representation" }, body: JSON.stringify(l) })).json())[0]; },
    async maj(id, l) { await req("/abo_acces?id=eq." + encodeURIComponent(id), { method: "PATCH", headers: { "Prefer": "return=minimal" }, body: JSON.stringify(l) }); }
  };
}

/* ---------- Abonné ---------- */
const etat = a => ({ f: a.formule, deb: a.debut, fin: a.fin, n: a.prenom, at: a.atelier || null });
function ouvert(a, auj) { return a.actif && a.debut <= auj && a.fin >= auj; }

async function entrer(request, db, c) {
  const b = await lire(request); if (!b) return json({ erreur: "Demande illisible." }, 400, c);
  const prenom = texte(b.prenom, 60), nom = texte(b.nom, 60), code = String(b.code || "").replace(/\D/g, "");
  if (!prenom || !nom || code.length !== 6) return json({ erreur: "Indiquez votre prénom, votre nom et votre code à 6 chiffres." }, 400, c);
  const cle = norme(prenom, nom), lignes = await db.parNom(cle), maintenant = new Date(), auj = jour(maintenant);
  const refus = "Ce code ne correspond pas à ce prénom et à ce nom. Vérifiez l’orthographe et les 6 chiffres.";
  if (!lignes.length) return json({ erreur: refus, inconnu: true }, 401, c);
  const bloque = lignes.map(a => a.bloque_jusqua).filter(Boolean).sort().pop();
  if (bloque && new Date(bloque) > maintenant) return json({ erreur: "Trop d’essais. Réessayez dans " + ATTENTE_MIN + " minutes." }, 429, c);
  let trouve = null;
  for (const a of lignes) if (egal(await empreinteCode(a.sel, cle, code), a.code_hash)) { trouve = a; break; }
  if (!trouve) {
    const essais = Math.max(...lignes.map(a => a.essais || 0)) + 1, stop = essais >= ESSAIS_MAX;
    for (const a of lignes) await db.maj(a.id, { essais: stop ? 0 : essais, bloque_jusqua: stop ? new Date(maintenant.getTime() + ATTENTE_MIN * 60000).toISOString() : null });
    return json({ erreur: stop ? "Trop d’essais. Réessayez dans " + ATTENTE_MIN + " minutes." : refus }, stop ? 429 : 401, c);
  }
  if (!trouve.actif) return json({ erreur: "Cet accès a été fermé. Écrivez-nous si c’est une erreur." }, 403, c);
  if (trouve.fin < auj) return json({ erreur: "Cet accès est terminé depuis le " + trouve.fin.split("-").reverse().join("/") + ". Vous pouvez le renouveler quand vous voulez.", fin: trouve.fin }, 403, c);
  if (trouve.debut > auj) return json({ erreur: "Cet accès commence le " + trouve.debut.split("-").reverse().join("/") + ".", deb: trouve.debut }, 403, c);
  const jeton = aleatoire(32), jetons = [...(trouve.jetons || []), await empreinteJeton(jeton)].slice(-APPAREILS);
  await db.maj(trouve.id, { jetons, essais: 0, bloque_jusqua: null, vu_le: maintenant.toISOString(), connexions: (trouve.connexions || 0) + 1 });
  return json({ jeton, ...etat(trouve) }, 200, c);
}

async function membre(request, db, chemin, c) {
  const j = porteur(request); if (j.length < 20) return json({ erreur: "Accès à rouvrir." }, 401, c);
  const a = await db.parJeton(await empreinteJeton(j));
  if (!a || !ouvert(a, jour(new Date()))) return json({ erreur: "Cet accès n’est plus ouvert.", ferme: true }, 401, c);
  if (chemin === "/moi") return json(etat(a), 200, c);
  if (chemin === "/choisir") {
    const b = await lire(request), at = texte(b && b.at, 80);
    if (a.formule !== "essentiel") return json({ erreur: "Votre formule ouvre déjà tous les ateliers." }, 400, c);
    if (a.atelier) return json({ erreur: "Votre atelier est déjà choisi pour cette période.", ...etat(a) }, 409, c);
    if (!/^[a-z0-9-]{3,70}\.html$/.test(at)) return json({ erreur: "Atelier inconnu." }, 400, c);
    await db.maj(a.id, { atelier: at });
    return json({ ...etat(a), at }, 200, c);
  }
  if (chemin === "/sortir") {
    const h = await empreinteJeton(j);
    await db.maj(a.id, { jetons: (a.jetons || []).filter(x => x !== h) });
    return json({ ok: true }, 200, c);
  }
  return json({ erreur: "Route inconnue." }, 404, c);
}

/* ---------- Clé maîtresse ---------- */
async function admin(request, env, db, chemin, c) {
  if (!env.ADMIN_KEY || env.ADMIN_KEY.length < 32 || !egal(porteur(request), env.ADMIN_KEY)) return json({ erreur: "Clé maîtresse refusée." }, 401, c);
  if (request.method === "GET" && chemin === "/admin/liste") return json({ acces: await db.liste(), aujourdhui: jour(new Date()) }, 200, c);
  if (request.method !== "POST") return json({ erreur: "Route inconnue." }, 404, c);
  const b = await lire(request); if (!b) return json({ erreur: "Demande illisible." }, 400, c);
  if (chemin === "/admin/creer") {
    const prenom = texte(b.prenom, 60), nom = texte(b.nom, 60), formule = texte(b.formule, 20);
    const jours = Math.round(Number(b.jours) || 30), debut = /^\d{4}-\d{2}-\d{2}$/.test(b.debut || "") ? b.debut : jour(new Date());
    if (!prenom || !nom) return json({ erreur: "Prénom et nom obligatoires." }, 400, c);
    if (!FORMULES.includes(formule)) return json({ erreur: "Formule inconnue." }, 400, c);
    if (jours < 1 || jours > 400) return json({ erreur: "Durée : de 1 à 400 jours." }, 400, c);
    const cle = norme(prenom, nom), sel = aleatoire(16), code = codeSix();
    const a = await db.creer({ prenom, nom, nom_cle: cle, sel, code_hash: await empreinteCode(sel, cle, code), formule, debut, fin: plus(debut, jours),
      contact: texte(b.contact, 120) || null, note: texte(b.note, 300) || null });
    return json({ id: a.id, code, prenom, nom, formule, debut, fin: a.fin }, 200, c);
  }
  const a = await db.parId(texte(b.id, 40)); if (!a) return json({ erreur: "Accès introuvable." }, 404, c);
  if (chemin === "/admin/nouveau-code") { // code oublié : l'ancien ne marche plus, les appareils sont déconnectés
    const sel = aleatoire(16), code = codeSix();
    await db.maj(a.id, { sel, code_hash: await empreinteCode(sel, a.nom_cle, code), jetons: [], essais: 0, bloque_jusqua: null });
    return json({ id: a.id, code, prenom: a.prenom, nom: a.nom, formule: a.formule, fin: a.fin }, 200, c);
  }
  if (chemin === "/admin/maj") {
    const l = {};
    if (typeof b.actif === "boolean") { l.actif = b.actif; if (!b.actif) l.jetons = []; }
    if (b.jours_en_plus) { const n = Math.round(Number(b.jours_en_plus)); if (!(n >= 1 && n <= 400)) return json({ erreur: "Durée : de 1 à 400 jours." }, 400, c);
      const auj = jour(new Date()); l.fin = plus(a.fin > auj ? a.fin : auj, n); l.actif = true; }
    if (FORMULES.includes(b.formule)) l.formule = b.formule;
    if (b.atelier === null) l.atelier = null;
    if (!Object.keys(l).length) return json({ erreur: "Rien à modifier." }, 400, c);
    await db.maj(a.id, l);
    return json({ ok: true, id: a.id, ...l, jetons: undefined }, 200, c);
  }
  return json({ erreur: "Route inconnue." }, 404, c);
}

export async function traiter(request, env, db) {
  const c = cors(request.headers.get("Origin") || "");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: c });
  const chemin = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
  if (request.method === "GET" && chemin === "/") return json({ service: "efa. abonnement", version: VERSION, base: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) }, 200, c);
  if (request.method === "POST" && !ORIGINES.includes(request.headers.get("Origin") || "")) return json({ erreur: "Origine non autorisée." }, 403, c);
  if (!(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY)) return json({ erreur: "Service en cours d'installation." }, 503, c);
  try {
    if (chemin.startsWith("/admin/")) return await admin(request, env, db, chemin, c);
    if (request.method === "POST" && chemin === "/entrer") return await entrer(request, db, c);
    if (request.method === "POST" && (chemin === "/moi" || chemin === "/choisir" || chemin === "/sortir")) return await membre(request, db, chemin, c);
    return json({ erreur: "Route inconnue." }, 404, c);
  } catch (e) {
    return json({ erreur: "Service momentanément indisponible." }, 502, c);
  }
}

export default { fetch: (request, env) => traiter(request, env, base(env)) };
