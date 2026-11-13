-- EFA · efa. abonnement · accès par prénom, nom et code à 6 chiffres · version 1.0 · 13 novembre 2026
-- À exécuter une fois dans Supabase > SQL Editor (même projet que l'école et Ely).
-- Accès réservé au Worker « efa-abonnement » (clé service_role) : sécurité au niveau des lignes activée, aucune politique publique.

create extension if not exists pgcrypto;

-- Un accès = une personne, une formule, une période
create table if not exists abo_acces (
  id             uuid primary key default gen_random_uuid(),
  cree_le        timestamptz not null default now(),
  prenom         text not null check (char_length(prenom) between 1 and 60),
  nom            text not null check (char_length(nom) between 1 and 60),
  nom_cle        text not null,                 -- « prenom nom » en minuscules, sans accent : sert à retrouver l'accès
  sel            text not null,                 -- sel propre à cet accès
  code_hash      text not null,                 -- empreinte SHA-256 du code (le code lui-même n'est jamais stocké)
  formule        text not null check (formule in ('essentiel','integral','cercle','privilege')),
  debut          date not null default current_date,
  fin            date not null,
  atelier        text,                          -- Essentiel : l'atelier choisi, une fois pour la période
  actif          boolean not null default true,
  essais         integer not null default 0,    -- codes faux d'affilée
  bloque_jusqua  timestamptz,                   -- après 5 codes faux : 15 minutes d'attente
  jetons         text[] not null default '{}',  -- empreintes des appareils connectés (3 au plus)
  vu_le          timestamptz,
  connexions     integer not null default 0,
  contact        text,                          -- numéro ou adresse, pour envoyer le code
  note           text
);

create index if not exists abo_acces_nom_cle on abo_acces (nom_cle);
create index if not exists abo_acces_jetons on abo_acces using gin (jetons);

alter table abo_acces enable row level security;
