/* EFA · Worker Cloudflare « vitrine » : comptage anonyme et facturable de la vitrine des SGI.
   Variables : SUPABASE_URL, SUPABASE_SERVICE_KEY (secret), ADMIN_KEY (secret), SITE_ORIGIN (https://efa.africa).
   Routes : POST /evenement · GET /rapport?sgi=&du=&au= · GET /rapport.csv?du=&au=  (rapports : en-tête x-admin-key) */
const TYPES = ['vue_carte', 'vue_fiche', 'clic_canal', 'ajout_comparer'];
const CANAUX = ['formulaire', 'whatsapp', 'tel', 'email'];
const ROBOTS = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|curl|wget|python|axios/i;
let SGI_CACHE = { t: 0, ids: null };

function cors(env) { return { 'Access-Control-Allow-Origin': env.SITE_ORIGIN || 'https://efa.africa', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, x-admin-key' }; }
function json(o, s, env) { return new Response(JSON.stringify(o), { status: s || 200, headers: Object.assign({ 'Content-Type': 'application/json' }, cors(env)) }); }
async function sb(env, path, init) {
  return fetch(env.SUPABASE_URL + '/rest/v1/' + path, Object.assign({}, init, { headers: Object.assign({ apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json' }, (init && init.headers) || {}) }));
}
async function idsSGI(env) {
  if (SGI_CACHE.ids && Date.now() - SGI_CACHE.t < 600000) return SGI_CACHE.ids;
  const r = await fetch((env.SITE_ORIGIN || 'https://efa.africa') + '/data/sgi.json', { cf: { cacheTtl: 300 } });
  const d = await r.json(); SGI_CACHE = { t: Date.now(), ids: new Set(d.sgi.map(s => s.id)) }; return SGI_CACHE.ids;
}
async function evenement(req, env) {
  if (ROBOTS.test(req.headers.get('user-agent') || '')) return json({ ok: true, ignore: 'robot' }, 202, env);
  let b; try { b = await req.json(); } catch (e) { return json({ erreur: 'json' }, 400, env); }
  const type = String(b.type || ''), sgi = String(b.sgi || ''), session = String(b.session || '').slice(0, 64);
  if (!TYPES.includes(type)) return json({ erreur: 'type' }, 400, env);
  if (!(await idsSGI(env)).has(sgi)) return json({ erreur: 'sgi' }, 400, env);
  const pos = b.position == null ? null : parseInt(b.position, 10);
  if (pos !== null && !(pos >= 1 && pos <= 200)) return json({ erreur: 'position' }, 400, env);
  const canal = type === 'clic_canal' ? String(b.canal || '') : null;
  if (type === 'clic_canal' && !CANAUX.includes(canal)) return json({ erreur: 'canal' }, 400, env);
  if (!session) return json({ erreur: 'session' }, 400, env);
  // Anti-doublon : même session + SGI + type compté une fois par 30 minutes
  const depuis = new Date(Date.now() - 30 * 60000).toISOString();
  const q = await sb(env, 'vitrine_evenements?select=id&limit=1&session=eq.' + encodeURIComponent(session) + '&sgi=eq.' + encodeURIComponent(sgi) + '&type=eq.' + type + '&cree_le=gte.' + depuis);
  if (q.ok && (await q.json()).length) return json({ ok: true, doublon: true }, 202, env);
  const pays = (req.cf && req.cf.country) ? String(req.cf.country).slice(0, 2) : null; // pays fourni par Cloudflare, aucune adresse IP enregistrée
  const r = await sb(env, 'vitrine_evenements', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ type, sgi, position: pos, payee: !!b.payee, canal, pays, session }) });
  return r.ok ? json({ ok: true }, 201, env) : json({ erreur: 'enregistrement' }, 500, env);
}
function autorise(req, env) { return env.ADMIN_KEY && req.headers.get('x-admin-key') === env.ADMIN_KEY; }
async function lignes(env, u) {
  const p = ['select=cree_le,type,sgi,position,payee,canal,pays', 'order=cree_le.asc', 'limit=100000'];
  if (u.searchParams.get('sgi')) p.push('sgi=eq.' + encodeURIComponent(u.searchParams.get('sgi')));
  if (u.searchParams.get('du')) p.push('cree_le=gte.' + encodeURIComponent(u.searchParams.get('du')));
  if (u.searchParams.get('au')) p.push('cree_le=lt.' + encodeURIComponent(u.searchParams.get('au') + 'T23:59:59Z'));
  const r = await sb(env, 'vitrine_evenements?' + p.join('&')); return r.ok ? r.json() : [];
}
function semaine(d) { const x = new Date(d); const j = (x.getUTCDay() + 6) % 7; x.setUTCDate(x.getUTCDate() - j); return x.toISOString().slice(0, 10); }
export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(env) });
    if (req.method === 'POST' && u.pathname === '/evenement') return evenement(req, env);
    if (req.method === 'GET' && (u.pathname === '/rapport' || u.pathname === '/rapport.csv')) {
      if (!autorise(req, env)) return json({ erreur: 'accès refusé' }, 401, env);
      const L = await lignes(env, u);
      if (u.pathname === '/rapport.csv') {
        const csv = ['date;type;sgi;position;payee;canal;pays'].concat(L.map(l => [l.cree_le, l.type, l.sgi, l.position ?? '', l.payee, l.canal ?? '', l.pays ?? ''].join(';'))).join('\n');
        return new Response(csv, { headers: Object.assign({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="vitrine.csv"' }, cors(env)) });
      }
      const t = { par_type: {}, par_position: {}, par_semaine: {} };
      L.forEach(l => { t.par_type[l.type] = (t.par_type[l.type] || 0) + 1; const k = (l.position || '-') + (l.payee ? ' (payée)' : ''); t.par_position[k] = t.par_position[k] || {}; t.par_position[k][l.type] = (t.par_position[k][l.type] || 0) + 1; const s = semaine(l.cree_le); t.par_semaine[s] = t.par_semaine[s] || {}; t.par_semaine[s][l.type] = (t.par_semaine[s][l.type] || 0) + 1; });
      return json(Object.assign({ sgi: u.searchParams.get('sgi') || 'toutes', du: u.searchParams.get('du'), au: u.searchParams.get('au'), total: L.length }, t), 200, env);
    }
    return json({ erreur: 'introuvable' }, 404, env);
  }
};
