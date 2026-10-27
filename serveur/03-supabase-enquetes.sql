-- EFA · Enquêtes anonymes des organisations · version 1.0 · 27 octobre 2026
-- À exécuter une fois dans Supabase > SQL Editor (même projet que les comptes de l'école), après 01-supabase-ecole.sql.
-- Une organisation interroge ses salariés ou ses membres avant de composer son programme.
-- Anonyme : ni nom, ni email, ni adresse IP, ni montant. Seules 15 réponses oui/non sont gardées, sous la forme "010010…".

create table if not exists ecole_enquetes (
  id        uuid primary key default gen_random_uuid(),
  cree_le   timestamptz not null default now(),
  nom       text not null check (char_length(nom) between 2 and 80),   -- nom de l'organisation, affiché aux répondants
  code      text not null unique,                                      -- code public du lien de l'enquête, ex. ENQ-7KQ4-M2XP
  cle_hash  text not null unique,                                      -- empreinte de la clé des résultats (jamais la clé)
  actif     boolean not null default true
);
create table if not exists ecole_enquete_reponses (
  id          bigint generated always as identity primary key,
  enquete_id  uuid not null references ecole_enquetes(id) on delete cascade,
  cree_le     date not null default current_date,                      -- le jour seulement, pas l'heure
  r           text not null check (r ~ '^[01]{15}$')
);
create index if not exists ecole_enquete_reponses_enquete on ecole_enquete_reponses(enquete_id);

alter table ecole_enquetes enable row level security;
alter table ecole_enquete_reponses enable row level security;
grant all on ecole_enquetes, ecole_enquete_reponses to service_role;
grant usage, select on all sequences in schema public to service_role;

-- 1.3 des comptes : la colonne « bilan » sert aussi à « Mon point » (oui/non au départ, à 30 et 90 jours)
alter table ecole_participants add column if not exists bilan jsonb not null default '{}'::jsonb;
