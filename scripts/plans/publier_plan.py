"""EFA · Publier un business plan dans l'espace « Mon espace business plan ».

Usage :
  python3 scripts/plans/publier_plan.py plan.json                 → nouveau plan, nouveau code
  python3 scripts/plans/publier_plan.py plan.json --code BP-…      → mise à jour du même plan (même code)

Le plan en clair (plan.json) et le registre des codes ne doivent JAMAIS entrer dans le dépôt :
gardez-les dans un dossier privé (par défaut ~/efa-plans-prives/registre.json).
Seul le fichier chiffré plans/<empreinte>.json est publié.

Chiffrement : AES-256-GCM, clé dérivée du code par PBKDF2-SHA256 (250 000 tours, sel aléatoire).
Le nom du fichier est une empreinte SHA-256 du code : impossible d'en déduire le code.
Code : « BP- » + 20 caractères tirés au hasard (100 bits), sans logique de génération.
"""
import json, os, sys, hashlib, secrets, base64, argparse, datetime
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # sans 0/O ni 1/I
ITER = 250000
RACINE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def nouveau_code():
    s = "".join(secrets.choice(ALPHABET) for _ in range(20))
    return "BP-" + "-".join(s[i:i + 4] for i in range(0, 20, 4))

def normaliser(code):
    c = "".join(ch for ch in code.upper() if ch.isalnum())
    if not c.startswith("BP") or len(c) != 22: raise SystemExit("Code invalide : " + code)
    return c

def empreinte(code):
    return hashlib.sha256(("efa-bp|" + normaliser(code)).encode()).hexdigest()[:40]

def chiffrer(code, donnees):
    sel, iv = os.urandom(16), os.urandom(12)
    cle = hashlib.pbkdf2_hmac("sha256", normaliser(code).encode(), sel, ITER, 32)
    ct = AESGCM(cle).encrypt(iv, json.dumps(donnees, ensure_ascii=False).encode(), None)
    b = lambda x: base64.b64encode(x).decode()
    return {"f": 1, "it": ITER, "sel": b(sel), "iv": b(iv), "ct": b(ct)}

def main():
    a = argparse.ArgumentParser()
    a.add_argument("plan"); a.add_argument("--code"); a.add_argument("--registre", default=os.path.expanduser("~/efa-plans-prives/registre.json"))
    o = a.parse_args()
    plan = json.load(open(o.plan))
    code = o.code or nouveau_code()
    fichier = os.path.join(RACINE, "plans", empreinte(code) + ".json")
    if not o.code and os.path.exists(fichier): raise SystemExit("Collision improbable : relancez.")
    if o.code and not os.path.exists(fichier): print("Attention : aucun plan existant pour ce code, il sera créé.")
    os.makedirs(os.path.dirname(fichier), exist_ok=True)
    json.dump(chiffrer(code, plan), open(fichier, "w"))
    os.makedirs(os.path.dirname(o.registre), exist_ok=True)
    reg = json.load(open(o.registre)) if os.path.exists(o.registre) else []
    reg = [r for r in reg if r["code"] != code]
    reg.append({"code": code, "titre": plan.get("titre"), "porteur": plan.get("porteur"), "fichier": os.path.relpath(fichier, RACINE),
                "version": len(plan.get("versions", [])) or 1, "maj": datetime.date.today().isoformat(), "source": os.path.abspath(o.plan)})
    json.dump(reg, open(o.registre, "w"), ensure_ascii=False, indent=1)
    print(code); print(os.path.relpath(fichier, RACINE))

if __name__ == "__main__":
    main()
