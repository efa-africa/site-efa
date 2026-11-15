# Traitement des voix enregistrées

Chaîne utilisée pour les clips de `audio/accueil`, `audio/premiers-pas-bourse` et `audio/bourse`.

1. `enh.py` : filtre passe-haut 75 Hz, suppression de la réverbération tardive (`derev.py`), puis débruitage DeepFilterNet 3 (binaire `deep-filter`, atténuation limitée à 40 dB).
2. `build.py` : découpe selon `cuts-*.json` (source, début, fin en secondes), pauses de plus de 1,1 s ramenées à 0,8 s, 0,12 s avant la voix, 0,32 s après, égalisation légère, compression 2:1, niveau −16 LUFS, limiteur, mp3 mono 112 kb/s.
3. Contrôle : re-transcription de chaque clip et comparaison avec le texte attendu.

Ne jamais utiliser `loudnorm` en une passe sur un enregistrement bruité : il remonte le bruit de salle dans les silences.
