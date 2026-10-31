-- EFA · Vitrine des SGI : table des événements facturables (vues et clics), sans donnée personnelle.
create table if not exists public.vitrine_evenements (
  id bigint generated always as identity primary key,
  cree_le timestamptz not null default now(),
  type text not null check (type in ('vue_carte','vue_fiche','demande_contact','clic_canal','ajout_comparer')),
  sgi text not null,
  position smallint,
  payee boolean not null default false,
  canal text check (canal is null or canal in ('formulaire','whatsapp','tel','email')),
  pays char(2),
  session text
);
create index if not exists vitrine_evt_sgi_date on public.vitrine_evenements (sgi, cree_le);
create index if not exists vitrine_evt_anti on public.vitrine_evenements (session, sgi, type, cree_le);
-- Même sécurité que ely_echanges : RLS activée, aucune politique publique (seul service_role lit et écrit).
alter table public.vitrine_evenements enable row level security;
revoke all on public.vitrine_evenements from anon, authenticated;
-- Effacement du champ session après 13 mois (à planifier avec pg_cron, une fois par jour).
-- select cron.schedule('vitrine-purge-session', '17 3 * * *', $$update public.vitrine_evenements set session = null where session is not null and cree_le < now() - interval '13 months'$$);

-- Si la table existe déjà (version précédente) : autoriser le type demande_contact.
alter table public.vitrine_evenements drop constraint if exists vitrine_evenements_type_check;
alter table public.vitrine_evenements add constraint vitrine_evenements_type_check check (type in ('vue_carte','vue_fiche','demande_contact','clic_canal','ajout_comparer'));

-- Limite de 5 demandes par adresse et par jour : on ne garde qu'une empreinte (SHA-256) de l'adresse, jamais l'adresse.
create table if not exists public.vitrine_quota (
  empreinte text not null,
  jour date not null default current_date,
  nb smallint not null default 0,
  primary key (empreinte, jour)
);
alter table public.vitrine_quota enable row level security;
revoke all on public.vitrine_quota from anon, authenticated;
