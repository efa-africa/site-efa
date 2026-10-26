#!/usr/bin/env bash
# EFA · préparation du site de TEST (bac à sable).
# Lancé par Cloudflare Pages à chaque mise à jour de la branche « test ».
# Le site en ligne (efa.africa, GitHub Pages, branche « main ») n'exécute jamais ce script.
#
# Ce que fait le script, sur une copie du site (dossier _test) :
#   1. marque chaque page « noindex » pour que Google ne référence jamais le site de test ;
#   2. ajoute un bandeau « VERSION DE TEST » en haut de chaque page, impossible à confondre avec le vrai site ;
#   3. bloque tous les robots (robots.txt) et ajoute l'en-tête X-Robots-Tag: noindex.
set -euo pipefail
cd "$(dirname "$0")/../.."

OUT=_test
rm -rf "$OUT"
mkdir -p "$OUT"
# Copie du site, sans l'historique git ni les fichiers de travail
tar --exclude=./.git --exclude=./.github --exclude="./$OUT" --exclude=./scripts --exclude=./serveur -cf - . | tar -xf - -C "$OUT"

BANDEAU='<div id="efa-test-bandeau" style="position:fixed;z-index:2147483647;left:0;right:0;bottom:0;background:#F2B84B;color:#0B1220;font:800 13px/1.3 system-ui,Arial,sans-serif;letter-spacing:.06em;text-align:center;padding:8px 12px;box-shadow:0 -2px 8px rgba(0,0,0,.2)">VERSION DE TEST · pas le site public · <a href="https://efa.africa" style="color:#0B1220">efa.africa</a> <button type="button" onclick="this.parentNode.remove()" aria-label="Masquer le bandeau" style="margin-left:8px;border:0;background:#0B1220;color:#fff;border-radius:999px;padding:2px 10px;font:700 12px system-ui;cursor:pointer">masquer</button></div>'

find "$OUT" -name '*.html' -print0 | while IFS= read -r -d '' f; do
  python3 - "$f" "$BANDEAU" <<'PY'
import sys, re
path, bandeau = sys.argv[1], sys.argv[2]
s = open(path, encoding="utf-8").read()
if 'name="robots"' in s:
    s = re.sub(r'<meta name="robots"[^>]*>', '<meta name="robots" content="noindex, nofollow">', s)
else:
    s = s.replace('<head>', '<head>\n<meta name="robots" content="noindex, nofollow">', 1)
s = re.sub(r'(<body[^>]*>)', r'\1\n' + bandeau.replace('\\', '\\\\'), s, count=1)
open(path, "w", encoding="utf-8").write(s)
PY
done

printf 'User-agent: *\nDisallow: /\n' > "$OUT/robots.txt"
rm -f "$OUT/CNAME" "$OUT/sitemap.xml"
printf '/*\n  X-Robots-Tag: noindex, nofollow\n' > "$OUT/_headers"
echo "Site de test prêt dans $OUT"
