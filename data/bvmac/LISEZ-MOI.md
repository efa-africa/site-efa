# BVMAC · archive du bulletin officiel de la cote

Décision d'Élysée du 21 novembre 2026 : EFA ouvre une porte d'entrée sur la Bourse d'Afrique centrale (`bvmac.html`, sans données de marché)
et **archive** chaque jour le bulletin officiel de la cote, sans rien afficher. On « habitera » ces données (onglet Marchés CEMAC, obligations,
dividendes, liquidité) quand le trafic d'Afrique centrale le justifiera.

- `scripts/bvmac/archiver.py` : télécharge le bulletin de chaque séance sur bvm-ac.org et en garde le texte dans `boc/AAAA/BOC-AAAAMMJJ.txt`.
- `journal.json` : la liste des bulletins archivés, avec leur adresse d'origine.
- `.github/workflows/bvmac-archive.yml` : passage quotidien en semaine ; lancement manuel avec une date de départ pour rattraper le passé.
- Avant tout affichage de cours : vérifier le droit de réutilisation auprès de la BVMAC (convention), comme pour la BRVM.
