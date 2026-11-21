#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Archive le bulletin officiel de la cote (BOC) de la Bourse d'Afrique centrale (BVMAC), séance après séance.

Décision du 21 novembre 2026 : EFA n'affiche pas encore ces données. On les garde, parce qu'un historique
ne se rattrape pas. Le jour où le trafic d'Afrique centrale le justifie, l'onglet Marchés CEMAC partira de là.

Le bulletin est un PDF publié à l'adresse https://www.bvm-ac.org/wp-content/uploads/AAAA/MM/BOC-AAAAMMJJ.pdf.
On en garde le texte (pdftotext -layout), pas le PDF : quelques kilo-octets par séance.

  python3 scripts/bvmac/archiver.py            les 10 derniers jours ouvrés qui manquent
  python3 scripts/bvmac/archiver.py 2026-01-01 depuis cette date
Il faut « pdftotext » (paquet poppler-utils). Aucun bulletin déjà archivé n'est retéléchargé.
"""
import datetime, json, os, subprocess, sys, tempfile, time, urllib.request, urllib.error

RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOSSIER = os.path.join(RACINE, 'data', 'bvmac', 'boc')
JOURNAL = os.path.join(RACINE, 'data', 'bvmac', 'journal.json')
URL = 'https://www.bvm-ac.org/wp-content/uploads/%04d/%02d/BOC-%04d%02d%02d.pdf'
AGENT = 'Mozilla/5.0 (compatible; EFA-archive/1.0; +https://efa.africa)'


def chemin(d): return os.path.join(DOSSIER, '%04d' % d.year, 'BOC-%s.txt' % d.strftime('%Y%m%d'))


def telecharger(d):
    """Le bulletin d'une séance est rangé dans le dossier du mois de sa mise en ligne : on essaie le mois de la séance, puis le suivant."""
    suivant = (d.replace(day=1) + datetime.timedelta(days=32)).replace(day=1)
    for a, m in ((d.year, d.month), (suivant.year, suivant.month)):
        u = URL % (a, m, d.year, d.month, d.day)
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': AGENT}), timeout=40) as r:
                data = r.read()
            if data[:4] == b'%PDF': return u, data
        except urllib.error.HTTPError as e:
            if e.code != 404: print('  %s : erreur %s' % (u, e.code))
        except Exception as e:
            print('  %s : %s' % (u, e))
    return None, None


def texte(pdf):
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as f:
        f.write(pdf); nom = f.name
    try:
        return subprocess.run(['pdftotext', '-layout', nom, '-'], capture_output=True, check=True).stdout.decode('utf-8', 'replace')
    finally:
        os.unlink(nom)


def main():
    auj = datetime.date.today()
    if len(sys.argv) > 1:
        debut = datetime.date.fromisoformat(sys.argv[1])
    else:
        debut = auj - datetime.timedelta(days=14)
    journal = json.load(open(JOURNAL, encoding='utf-8')) if os.path.exists(JOURNAL) else {'source': 'https://www.bvm-ac.org', 'bulletins': {}}
    neufs = 0; d = debut
    while d <= auj:
        if d.weekday() < 5 and not os.path.exists(chemin(d)):
            u, pdf = telecharger(d)
            if pdf:
                t = texte(pdf)
                if len(t.strip()) < 200:
                    print('%s : bulletin illisible (%d caractères), non archivé' % (d, len(t)))
                else:
                    os.makedirs(os.path.dirname(chemin(d)), exist_ok=True)
                    open(chemin(d), 'w', encoding='utf-8').write(t)
                    journal['bulletins'][d.isoformat()] = {'url': u, 'octets_pdf': len(pdf), 'archive_le': auj.isoformat()}
                    neufs += 1; print('%s : archivé (%d caractères)' % (d, len(t)))
            time.sleep(1)
        d += datetime.timedelta(days=1)
    journal['bulletins'] = dict(sorted(journal['bulletins'].items()))
    journal['dernier_passage'] = auj.isoformat(); journal['nombre'] = len(journal['bulletins'])
    os.makedirs(os.path.dirname(JOURNAL), exist_ok=True)
    json.dump(journal, open(JOURNAL, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('BVMAC : %d bulletin(s) archivé(s) ce passage, %d au total' % (neufs, journal['nombre']))


if __name__ == '__main__':
    main()
