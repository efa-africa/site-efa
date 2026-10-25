-- EFA · Comptes de l'école pour les organisations · version 1.0 · 25 octobre 2026
-- À exécuter une fois dans Supabase > SQL Editor (même projet que la collecte d'Ely).
-- Accès réservé au Worker « efa-ecole » (clé service_role) : sécurité au niveau des lignes activée, aucune politique publique.

create extension if not exists pgcrypto;

-- Un programme acheté ou offert à une organisation
create table if not exists ecole_programmes (
  id          uuid primary key default gen_random_uuid(),
  cree_le     timestamptz not null default now(),
  nom         text not null check (char_length(nom) between 2 and 80),
  programme   jsonb not null,                 -- { m: [modules], s: semaines, mi: minutes/semaine, f: sessions, c: certificat }
  cle_hash    text not null unique,           -- empreinte SHA-256 de la clé de l'organisation (la clé elle-même n'est jamais stockée)
  code        text not null unique,           -- code d'invitation des participants, ex. EFA-7KQ4-M2XP
  places      integer not null default 100 check (places between 1 and 100000),
  expire_le   date,
  actif       boolean not null default true,
  note        text
);

-- Un compte par participant (salarié, membre…)
create table if not exists ecole_participants (
  id            uuid primary key default gen_random_uuid(),
  programme_id  uuid not null references ecole_programmes(id) on delete cascade,
  cree_le       timestamptz not null default now(),
  nom           text not null check (char_length(nom) between 2 and 80),
  email         text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  cle_hash      text not null unique,         -- empreinte de la clé personnelle
  vu_le         timestamptz,
  connexions    integer not null default 0,
  faits         jsonb not null default '{}'::jsonb,   -- étapes cochées : {"P1.0":1, …} (jamais de montant)
  fiches        jsonb not null default '[]'::jsonb,   -- modules dont la fiche est gardée : ["P1", …] (jamais le contenu)
  certificats   jsonb not null default '{}'::jsonb,   -- {"fondations":"EFA-F-2026-…"}
  actif         boolean not null default true
);
create index if not exists ecole_participants_programme on ecole_participants(programme_id);

alter table ecole_programmes enable row level security;
alter table ecole_participants enable row level security;

-- Vue pour la page d'administration d'EFA : un programme, ses participants, son activité
create or replace view ecole_programmes_stats as
select p.id, p.cree_le, p.nom, p.code, p.places, p.expire_le, p.actif, p.note, p.programme,
       count(pa.id) filter (where pa.actif)                                            as participants,
       count(pa.id) filter (where pa.actif and pa.vu_le > now() - interval '7 days')   as actifs_7j,
       max(pa.vu_le)                                                                   as dernier_acces
from ecole_programmes p
left join ecole_participants pa on pa.programme_id = p.id
group by p.id;

revoke all on ecole_programmes_stats from anon, authenticated;
