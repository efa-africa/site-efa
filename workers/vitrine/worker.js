/* EFA · Worker « vitrine » (Cloudflare)
   POST /contact   : reçoit la demande « Contacter la SGI », ajoute la personne à la liste Brevo « Vitrine SGI · demandes »
                     (et à la newsletter si elle l'a coché), puis lui envoie l'e-mail « EFA · Coordonnées SGI ».
   POST /evenement : comptage anonyme (vues, clics) ; enregistré seulement si un espace KV « COMPTES » est relié.
   Secret à définir dans Cloudflare : BREVO_KEY (la clé « vitrine-sgi »). Aucune clé n'est écrite dans ce fichier.
   L'adresse du visiteur n'est jamais transmise à la SGI. */
const ORIGINES = ['https://efa.africa', 'https://www.efa.africa', 'https://efa-africa.github.io'];
const LISTE_VITRINE = 7, LISTE_NEWSLETTER = 4, MODELE = 21;
const DONNEES = 'https://efa.africa/data/sgi.json';

function cors(req) {
  const o = req.headers.get('Origin') || '';
  return { 'Access-Control-Allow-Origin': ORIGINES.includes(o) ? o : ORIGINES[0], 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
}
function rep(req, corps, statut = 200) { return new Response(JSON.stringify(corps), { status: statut, headers: { 'Content-Type': 'application/json', ...cors(req) } }); }
async function brevo(env, chemin, methode, corps) {
  const r = await fetch('https://api.brevo.com/v3' + chemin, { method: methode, headers: { 'api-key': env.BREVO_KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined });
  const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
  return { ok: r.ok, status: r.status, j };
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
    if (req.method !== 'POST') return rep(req, { message: 'EFA vitrine' }, 200);

    if (url.pathname === '/evenement') {
      try {
        const e = await req.json();
        if (env.COMPTES && e && e.type && e.sgi) {
          const mois = new Date().toISOString().slice(0, 7), cle = `${mois}:${e.sgi}:${e.type}`;
          const n = parseInt((await env.COMPTES.get(cle)) || '0', 10);
          await env.COMPTES.put(cle, String(n + 1));
        }
      } catch (x) {}
      return new Response(null, { status: 204, headers: cors(req) });
    }

    if (url.pathname !== '/contact') return rep(req, { message: 'Adresse inconnue.' }, 404);
    if (!env.BREVO_KEY) return rep(req, { message: 'Service en cours de configuration. Réessayez plus tard.' }, 503);

    let d; try { d = await req.json(); } catch (e) { return rep(req, { message: 'Demande illisible.' }, 400); }
    const email = String(d.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) return rep(req, { message: 'Indiquez une adresse e-mail valide.' }, 400);
    if (d.consentement !== true) return rep(req, { message: 'Cochez la case d’accord pour recevoir les coordonnées.' }, 400);

    // La SGI est lue dans les données publiées d'EFA, jamais dans ce qu'envoie le navigateur
    let sgi = null;
    try { const L = await (await fetch(DONNEES, { cf: { cacheTtl: 600 } })).json(); sgi = (L.sgi || []).find(x => x.id === d.sgi); } catch (e) {}
    if (!sgi) return rep(req, { message: 'SGI inconnue.' }, 400);

    // Limite simple : 5 demandes par adresse et par jour (si l'espace KV est relié)
    if (env.COMPTES) {
      const k = `lim:${new Date().toISOString().slice(0, 10)}:${email}`, n = parseInt((await env.COMPTES.get(k)) || '0', 10);
      if (n >= 5) return rep(req, { message: 'Vous avez déjà fait plusieurs demandes aujourd’hui. Réessayez demain.' }, 429);
      await env.COMPTES.put(k, String(n + 1), { expirationTtl: 90000 });
    }

    // Contact Brevo : on ajoute la SGI demandée à la liste de ses demandes
    let deja = '';
    const c = await brevo(env, '/contacts/' + encodeURIComponent(email), 'GET');
    if (c.ok && c.j && c.j.attributes) deja = String(c.j.attributes.EFA_SGI_DEMANDEES || '');
    const ids = deja.split(',').map(s => s.trim()).filter(Boolean); if (!ids.includes(sgi.id)) ids.push(sgi.id);
    const attributs = { EFA_SGI_DEMANDEES: ids.join(',') };
    if (d.prenom) attributs.PRENOM = String(d.prenom).slice(0, 60);
    if (d.pays) attributs.PAYS = String(d.pays).slice(0, 40);
    const listes = [LISTE_VITRINE]; if (d.newsletter === true) listes.push(LISTE_NEWSLETTER);
    const cr = await brevo(env, '/contacts', 'POST', { email, attributes: attributs, listIds: listes, updateEnabled: true });
    if (!cr.ok) return rep(req, { message: 'L’enregistrement n’a pas abouti. Réessayez dans un instant.' }, 502);

    // E-mail avec les coordonnées
    const ct = sgi.contact || {};
    const params = { NOM_SGI: sgi.nom, PRENOM: attributs.PRENOM || '', TELEPHONE: ct.telephone || '', EMAIL_SGI: ct.email || '', SITE: sgi.site || '', ADRESSE: ct.agence || '' };
    const env1 = await brevo(env, '/smtp/email', 'POST', { templateId: MODELE, to: [{ email }], params, tags: ['vitrine-sgi', sgi.id] });
    if (!env1.ok) return rep(req, { ok: true, mail: false });

    if (env.COMPTES) { const mois = new Date().toISOString().slice(0, 7), k = `${mois}:${sgi.id}:demande_contact`, n = parseInt((await env.COMPTES.get(k)) || '0', 10); await env.COMPTES.put(k, String(n + 1)); }
    return rep(req, { ok: true, mail: true });
  }
};
