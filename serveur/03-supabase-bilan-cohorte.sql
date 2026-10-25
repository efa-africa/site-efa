-- EFA · École · version 1.3 · 25 octobre 2026
-- Bilan de cohorte : à exécuter une fois dans Supabase > SQL Editor, AVANT de déployer le Worker efa-ecole 1.3.
-- Ajoute une colonne qui garde, pour chaque participant, les simulations terminées (D1…D5, A1…B8)
-- et les totaux de son suivi à 7 et 30 jours (essayé, en partie, pas encore). Jamais de texte ni de montant.
alter table ecole_participants add column if not exists bilan jsonb not null default '{}'::jsonb;
