#!/usr/bin/env python3
"""EFA · Génère un code Pass Étudiant (EFAE-XXXX-YYYY) à remettre à une école. Usage : python3 scripts/code-ecole.py [nombre]"""
import sys, subprocess, os
n = int(sys.argv[1]) if len(sys.argv) > 1 else 1
js = "global.window={};require('vm').runInThisContext(require('fs').readFileSync('clone/ateliers-data.js','utf8'));for(let i=0;i<%d;i++)console.log(window.EFA_ATELIERS.codeEcole());" % n
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
print(subprocess.run(['node', '-e', js], capture_output=True, text=True).stdout.strip())
