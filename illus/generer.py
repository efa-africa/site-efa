"""Illustrations EFA (balade de l'économie, capitaines d'industrie, bibliothèque).
Style : aplats, palette de la charte, sans texte ni logo. Usage : python3 illus/generer.py
Chaque fonction renvoie le contenu d'un SVG 480 × 300 (bannière) ; les fichiers sont écrits dans illus/."""
import os, math
N = "#0B1220"; C = "#DA3C1B"; CS = "#F09680"; B = "#1B71B2"; BS = "#6DB8F2"; CR = "#F5EFE2"; P = "#FFFDF8"
L = "#E2D8C4"; S = "#E9DCC2"; G = "#1E7A4C"; GS = "#7CC49A"; Y = "#F2B84B"; BR = "#7A4A2A"; GR = "#AEB6C6"
W, H = 480, 300
D = os.path.dirname(os.path.abspath(__file__))

def svg(body, bg=CR, w=W, h=H, titre=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{titre}">'
            f'<rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>')

def r(x, y, w, h, f, rx=0, extra=""): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{f}" {extra}/>'
def c(x, y, rad, f, extra=""): return f'<circle cx="{x}" cy="{y}" r="{rad}" fill="{f}" {extra}/>'
def e(x, y, rx, ry, f, extra=""): return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{f}" {extra}/>'
def p(d, f, extra=""): return f'<path d="{d}" fill="{f}" {extra}/>'
def ln(d, s, w=4, extra=""): return f'<path d="{d}" fill="none" stroke="{s}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'
def poly(pts, f): return f'<polygon points="{pts}" fill="{f}"/>'

def sol(y=238, f=S): return r(0, y, W, H - y, f)
def soleil(x=410, y=62, rad=30, f=Y): return c(x, y, rad, f)
def nuage(x, y, s=1, f=P):
    return (e(x, y, 34*s, 14*s, f) + e(x+22*s, y-8*s, 22*s, 14*s, f) + e(x-18*s, y-4*s, 18*s, 11*s, f))

def perso(x, y, corps=C, tete=BR, s=1, foulard=None):
    """Silhouette simple : tête ronde, buste trapèze."""
    o = p(f"M{x-22*s},{y+60*s} Q{x-20*s},{y+14*s} {x},{y+12*s} Q{x+20*s},{y+14*s} {x+22*s},{y+60*s} Z", corps)
    o += c(x, y, 13*s, tete)
    if foulard: o += p(f"M{x-14*s},{y-4*s} Q{x},{y-26*s} {x+14*s},{y-4*s} Q{x},{y-10*s} {x-14*s},{y-4*s}Z", foulard)
    return o

def fleche(x1, y1, x2, y2, col=N, w=4):
    a = math.atan2(y2 - y1, x2 - x1); hx, hy = x2 - 12*math.cos(a), y2 - 12*math.sin(a)
    l1 = (hx + 7*math.sin(a), hy - 7*math.cos(a)); l2 = (hx - 7*math.sin(a), hy + 7*math.cos(a))
    return ln(f"M{x1},{y1} L{hx:.1f},{hy:.1f}", col, w) + poly(f"{x2},{y2} {l1[0]:.1f},{l1[1]:.1f} {l2[0]:.1f},{l2[1]:.1f}", col)

def batiment(x, y, w, h, f=P, fen=BS, toit=None, nfx=3, nfy=3):
    o = r(x, y, w, h, f)
    if toit: o += poly(f"{x-8},{y} {x+w/2},{y-34} {x+w+8},{y}", toit)
    fw, fh = w/(nfx*2+1), h/(nfy*2+1.5)
    for i in range(nfx):
        for j in range(nfy):
            o += r(x + fw*(1+2*i), y + fh*(1+2*j), fw, fh, fen, 2)
    return o

def colonnes(x, y, w, h, f=P, n=5):
    o = poly(f"{x-12},{y} {x+w/2},{y-40} {x+w+12},{y}", f) + r(x-12, y, w+24, 10, L)
    cw = w/(n*2-1)
    for i in range(n): o += r(x + cw*2*i, y+10, cw, h-20, f)
    o += r(x-16, y+h-10, w+32, 12, L)
    return o

def cauri(x, y, s=1, f=P):
    return (e(x, y, 16*s, 11*s, f, f'stroke="{L}" stroke-width="2"') +
            ln(f"M{x-10*s},{y} Q{x},{y+3*s} {x+10*s},{y}", BR, 2) +
            "".join(ln(f"M{x+k*s},{y-2*s} L{x+k*s},{y+2*s}", BR, 1.5) for k in (-6, -2, 2, 6)))

def piece(x, y, rad=18, f=Y, bord=BR):
    return c(x, y, rad, f, f'stroke="{bord}" stroke-width="3"') + c(x, y, rad*0.55, "none", f'stroke="{bord}" stroke-width="2"')

def billet(x, y, w=110, h=56, f=GS, rot=0):
    g = f'<g transform="rotate({rot} {x+w/2} {y+h/2})">'
    g += r(x, y, w, h, f, 6) + r(x+8, y+8, w-16, h-16, "none", 4, f'stroke="{G}" stroke-width="2"')
    g += c(x+w*0.3, y+h/2, h*0.22, G) + r(x+w*0.55, y+h*0.35, w*0.3, 5, G, 2) + r(x+w*0.55, y+h*0.55, w*0.2, 5, G, 2)
    return g + '</g>'

def telephone(x, y, w=70, h=124, ecran=BS):
    o = r(x, y, w, h, N, 12) + r(x+6, y+14, w-12, h-30, ecran, 4) + c(x+w/2, y+h-9, 4, GR)
    return o

def maison(x, y, w=90, f=P, toit=C):
    return (r(x, y, w, w*0.7, f) + poly(f"{x-10},{y} {x+w/2},{y-w*0.45} {x+w+10},{y}", toit) +
            r(x+w*0.4, y+w*0.32, w*0.22, w*0.38, BR, 2) + r(x+w*0.1, y+w*0.15, w*0.18, w*0.16, BS, 2))

def usine(x, y, w=140, f=P, fumee=True):
    o = r(x, y, w, 70, f) + poly(f"{x},{y} {x+w/3},{y-26} {x+w/3},{y} {x+2*w/3},{y-26} {x+2*w/3},{y} {x+w},{y-26} {x+w},{y}", f)
    o += r(x+w-30, y-80, 18, 80, L)
    if fumee: o += e(x+w-16, y-96, 18, 10, GR) + e(x+w+4, y-112, 14, 8, GR)
    for i in range(4): o += r(x+12+i*(w-24)/4, y+22, (w-24)/4-10, 22, BS, 2)
    return o

def plante_cacao(x, y, s=1):
    o = r(x-5*s, y-90*s, 10*s, 90*s, BR)
    o += e(x-34*s, y-110*s, 40*s, 24*s, G) + e(x+30*s, y-122*s, 44*s, 26*s, G) + e(x, y-142*s, 36*s, 22*s, GS)
    for dx, dy in ((-10, -60), (12, -48), (-14, -30)):
        o += e(x+dx*s, y+dy*s, 9*s, 16*s, Y, f'stroke="{BR}" stroke-width="2"')
    return o

def conteneurs(x, y, cols, rows, w=46, h=24):
    cs = [C, B, Y, G, N, CS]
    o = ""
    for j in range(rows):
        for i in range(cols):
            o += r(x+i*(w+3), y-j*(h+3), w, h, cs[(i*3+j*2) % len(cs)], 2)
    return o

def grue(x, y, f=C):
    return (r(x, y-140, 10, 140, f) + r(x-30, y-150, 120, 10, f) + ln(f"M{x+70},{y-140} L{x+70},{y-96}", N, 2) + r(x+60, y-96, 20, 12, N))

def bateau(x, y, w=300):
    return p(f"M{x},{y} L{x+w},{y} L{x+w-30},{y+40} L{x+24},{y+40} Z", N) + r(x+w-60, y-40, 40, 40, P)

def livre(x, y, w, h, f, bande=None):
    o = r(x, y, w, h, f, 3)
    if bande: o += r(x, y+h*0.18, w, 6, bande) + r(x, y+h*0.75, w, 6, bande)
    return o

# ---------------------------------------------------------------- les scènes
S_ = {}

def scene(nom, titre, bg=CR):
    def deco(fn):
        S_[nom] = (fn, titre, bg); return fn
    return deco

@scene("s1-echanger", "Deux marchands échangent un pagne contre un sac de riz")
def _():
    o = soleil() + nuage(110, 60) + sol()
    # étal de gauche : la couturière
    o += r(40, 150, 150, 14, BR) + r(48, 164, 8, 74, BR) + r(174, 164, 8, 74, BR) + p("M30,150 L200,150 L180,112 L50,112 Z", C)
    o += perso(115, 172, corps=B, foulard=C)
    o += r(52, 128, 34, 22, Y, 3) + r(140, 128, 40, 22, CS, 3)
    # étal de droite : le riziculteur
    o += r(290, 150, 150, 14, BR) + r(298, 164, 8, 74, BR) + r(424, 164, 8, 74, BR) + p("M280,150 L450,150 L430,112 L300,112 Z", B)
    o += perso(365, 172, corps=G)
    o += p("M310,150 Q306,120 322,116 L340,116 Q356,120 352,150 Z", P) + p("M392,150 Q388,124 402,120 L418,120 Q432,124 428,150 Z", S)
    o += fleche(205, 96, 275, 96, N) + fleche(275, 120, 205, 120, C)
    return o

@scene("s2-monnaie", "Du cauri au téléphone : les formes de la monnaie")
def _():
    o = sol(250, L)
    o += cauri(70, 200, 1.4) + cauri(100, 222, 1.2) + cauri(52, 228, 1.1)
    o += fleche(130, 200, 160, 200, GR, 3)
    o += piece(195, 196, 24) + piece(222, 218, 20) + piece(180, 228, 16)
    o += fleche(255, 200, 285, 200, GR, 3)
    o += billet(290, 160, 100, 52, GS, -8) + billet(296, 182, 100, 52, BS, 4)
    o += fleche(400, 120, 418, 104, GR, 3)
    o += telephone(392, 30, 66, 118) + r(404, 60, 42, 8, P, 3) + r(404, 76, 30, 8, P, 3) + c(425, 112, 10, C)
    return o

@scene("s3-acteurs", "Le circuit économique entre ménages, entreprises, État et banques")
def _():
    o = c(240, 150, 92, "none", f'stroke="{L}" stroke-width="16"')
    o += ln("M240,58 A92,92 0 0 1 332,150", C, 6) + poly("332,160 322,142 342,142", C)
    o += ln("M332,150 A92,92 0 0 1 240,242", B, 6) + poly("230,242 248,232 248,252", B)
    o += ln("M240,242 A92,92 0 0 1 148,150", C, 6) + poly("148,140 138,158 158,158", C)
    o += ln("M148,150 A92,92 0 0 1 240,58", B, 6) + poly("250,58 232,48 232,68", B)
    o += maison(212, 36, 56)                     # ménages, en haut
    o += usine(296, 140, 84, fumee=False)        # entreprises, à droite
    o += colonnes(206, 238, 68, 50, P, 4)        # État, en bas
    o += r(98, 120, 64, 56, N, 4) + r(108, 132, 44, 32, Y, 3) + c(130, 148, 8, N)  # banque, à gauche (coffre)
    o += c(420, 60, 28, BS) + ln("M396,60 L444,60 M420,34 Q404,60 420,88 M420,34 Q436,60 420,88", P, 3)  # reste du monde
    o += fleche(400, 82, 352, 118, GR, 3)
    return o

@scene("s4-etat", "L’État : routes, écoles et centres de santé")
def _():
    o = soleil(70, 60, 26) + sol(230)
    o += colonnes(170, 120, 140, 110, P, 5)
    o += r(30, 150, 100, 80, P) + poly("22,150 80,118 138,150", C) + r(66, 186, 28, 44, BR) + r(42, 164, 18, 16, BS) + r(100, 164, 18, 16, BS)
    o += r(350, 140, 100, 90, P) + r(392, 154, 16, 44, C) + r(378, 168, 44, 16, C)
    o += p("M0,262 L480,262 L480,300 L0,300 Z", N) + "".join(r(20+i*60, 279, 30, 5, P) for i in range(8))
    return o

@scene("s5-banques", "Une banque, son coffre et la balance des risques")
def _():
    o = sol(240, L)
    o += colonnes(60, 110, 170, 130, P, 6)
    o += r(300, 120, 120, 120, N, 8) + c(360, 180, 34, Y) + c(360, 180, 20, N) + ln("M360,160 L360,200 M340,180 L380,180", Y, 4)
    o += r(312, 132, 12, 12, GR, 2) + r(396, 132, 12, 12, GR, 2)
    # étiquette de prix qui monte
    o += p("M420,40 L466,40 L466,80 L420,80 L404,60 Z", C) + c(416, 60, 4, P) + fleche(436, 100, 452, 92, C, 3)
    return o

@scene("s6-croissance", "Un port à conteneurs et une courbe qui monte")
def _():
    o = soleil(80, 56, 26) + r(0, 210, W, 90, B) + "".join(ln(f"M{20+i*70},{250+(i%2)*14} q12,-6 24,0", BS, 3) for i in range(7))
    o += r(300, 150, 180, 60, L) + grue(320, 150) + grue(420, 150, Y)
    o += bateau(40, 186, 250) + conteneurs(70, 162, 4, 2, 40, 20)
    o += ln("M300,110 L340,92 L370,98 L420,58 L460,40", G, 5) + poly("468,34 450,36 460,52", G)
    return o

# panneaux
@scene("p-specialiser", "Une machine à coudre et un bol de riz")
def _():
    o = sol(220)
    o += r(70, 150, 150, 70, N, 8) + p("M90,150 L90,96 Q90,80 106,80 L196,80 Q210,80 210,96 L210,118 L180,118 L180,150 Z", C)
    o += r(120, 118, 6, 32, P) + c(200, 100, 10, Y)
    o += e(340, 190, 80, 30, B) + e(340, 170, 70, 26, P) + "".join(e(300+i*14, 166-(i%3)*5, 6, 3, S) for i in range(7))
    return o

@scene("p-valeur", "L’eau et le diamant sur une balance")
def _():
    o = sol(250, L) + r(234, 80, 12, 170, N) + r(200, 240, 80, 12, N) + r(120, 80, 240, 8, N)
    o += ln("M130,88 L110,150 M130,88 L150,150", N, 2) + ln("M350,88 L330,130 M350,88 L370,130", N, 2)
    o += e(130, 152, 46, 8, GR) + e(350, 132, 46, 8, GR)
    o += p("M112,148 Q130,104 148,148 Z", BS) + p("M330,128 L350,108 L370,128 L350,150 Z", P, f'stroke="{B}" stroke-width="3"')
    return o

@scene("p-confiance", "Un cercle de tontine : chacun verse, chacun reçoit")
def _():
    o = c(240, 150, 60, Y) + c(240, 150, 40, CR)
    for k in range(6):
        a = k*math.pi/3 - math.pi/2; x, y = 240+110*math.cos(a), 150+95*math.sin(a)
        o += perso(x, y-26, corps=[C, B, G, N, CS, BS][k], s=0.7)
    o += piece(240, 150, 18)
    return o

@scene("p-fonctions", "Compter, payer, garder : une étiquette, un portefeuille, une tirelire")
def _():
    o = sol(230)
    o += p("M40,120 L120,120 L120,180 L40,180 L16,150 Z", C) + c(32, 150, 6, P) + r(56, 140, 46, 8, P, 3) + r(56, 156, 30, 8, P, 3)
    o += r(180, 120, 120, 80, N, 10) + r(250, 140, 56, 40, B, 8) + c(272, 160, 6, Y)
    o += e(400, 170, 52, 40, CS) + c(420, 140, 6, N) + r(392, 128, 20, 6, N, 2) + r(370, 202, 12, 20, CS) + r(418, 202, 12, 20, CS)
    return o

@scene("p-cfa", "Deux billets de francs CFA et une pièce")
def _():
    o = billet(70, 90, 200, 100, GS, -6) + billet(170, 120, 200, 100, BS, 5) + piece(390, 210, 34) + piece(340, 236, 22)
    return o

@scene("p-cauri", "Des cauris, ancienne monnaie d’Afrique de l’Ouest", N)
def _():
    o = ""
    for i, (x, y, s) in enumerate([(120, 120, 2), (230, 100, 1.6), (330, 140, 2.2), (180, 200, 1.8), (300, 220, 1.5), (400, 200, 1.4), (80, 220, 1.3)]):
        o += cauri(x, y, s)
    return o

@scene("p-entreprise", "Un atelier : du travail et des machines")
def _():
    o = sol(236) + usine(60, 150, 200) + perso(320, 170, corps=B) + perso(390, 176, corps=C, foulard=Y)
    o += r(300, 226, 120, 10, BR)
    return o

@scene("p-marche", "Des tomates au marché : quand elles abondent, le prix baisse")
def _():
    o = sol(230)
    for i in range(10):
        o += c(80+(i%5)*30, 200-(i//5)*26, 15, C)
    o += c(140, 148, 15, C)
    o += c(330, 210, 15, C) + c(360, 210, 15, C)
    o += fleche(150, 80, 150, 120, G, 5) + fleche(345, 160, 345, 110, C, 5)
    o += r(40, 220, 220, 14, BR) + r(290, 230, 110, 14, BR)
    return o

@scene("p-circuit", "Du poisson acheté au pêcheur payé")
def _():
    o = r(0, 200, W, 100, B) + p("M40,200 Q100,178 170,200 Z", BR)
    o += p("M220,120 q40,-30 80,0 q-40,30 -80,0 Z", BS) + poly("300,120 320,104 320,136", BS) + c(236, 116, 4, N)
    o += perso(90, 120, corps=C, foulard=Y) + perso(400, 120, corps=G)
    o += fleche(130, 100, 200, 100, N) + fleche(330, 140, 370, 140, N) + piece(170, 150, 14) + piece(350, 170, 14)
    return o

@scene("p-externalite", "Une usine au bord de la lagune, et des pêcheurs")
def _():
    o = r(0, 200, W, 100, B) + usine(40, 130, 160) + r(40, 200, 160, 6, L)
    o += p("M200,200 Q240,214 220,240 Q200,262 260,270", "none", f'stroke="{BR}" stroke-width="10" stroke-linecap="round"')
    o += p("M330,226 L430,226 L414,246 L346,246 Z", N) + perso(380, 176, corps=C, s=0.8)
    return o

@scene("p-informel", "Une vendeuse et son cahier de recettes")
def _():
    o = sol(230) + r(60, 170, 220, 14, BR) + p("M50,170 L290,170 L270,120 L70,120 Z", Y)
    o += perso(170, 186, corps=C, foulard=B)
    o += e(110, 166, 34, 12, P) + e(230, 166, 34, 12, P)
    o += r(330, 120, 100, 120, P, 6) + "".join(r(346, 140+i*18, 68, 4, L) for i in range(5)) + r(330, 120, 14, 120, C, 0)
    return o

@scene("p-solvable", "Un terrain, des pièces et une horloge")
def _():
    o = sol(230, GS) + r(40, 200, 200, 30, G) + "".join(r(50+i*45, 180, 6, 30, BR) for i in range(5)) + ln("M50,190 L230,190", BR, 3)
    o += c(380, 120, 56, P, f'stroke="{N}" stroke-width="8"') + ln("M380,120 L380,84 M380,120 L404,132", N, 6)
    o += piece(330, 214, 18) + piece(370, 220, 18) + piece(410, 212, 18)
    return o

@scene("p-banque-centrale", "La banque centrale garde la valeur de la monnaie")
def _():
    o = sol(240, L) + colonnes(100, 120, 200, 120, P, 6)
    o += c(380, 100, 52, P) + c(380, 100, 36, CS) + c(380, 100, 18, C) + fleche(450, 40, 386, 98, N, 4)
    return o

@scene("p-inflation", "Le même panier, de moins en moins rempli")
def _():
    def panier(x, rempli):
        o = p(f"M{x},{150} L{x+110},{150} L{x+96},{220} L{x+14},{220} Z", BR) + ln(f"M{x+14},{150} Q{x+55},{90} {x+96},{150}", BR, 6)
        for i in range(rempli):
            o += c(x+22+(i%4)*22, 140-(i//4)*20, 11, [C, Y, G, BS][i % 4])
        return o
    return sol(220, L) + panier(30, 12) + panier(185, 7) + panier(340, 3)

@scene("p-cacao", "Un cacaoyer et des barres qui montent")
def _():
    o = sol(250, S) + plante_cacao(150, 250, 1.1)
    for i, hh in enumerate((40, 64, 96, 130)):
        o += r(290+i*40, 240-hh, 28, hh, [L, CS, C, C][i], 3)
    return o

@scene("p-esperance", "Une vie plus longue : la courbe de deux siècles")
def _():
    o = r(60, 40, 4, 200, N) + r(60, 236, 380, 4, N)
    o += ln("M70,210 L150,206 L220,198 L280,170 L330,120 L380,90 L430,76", C, 6)
    o += c(70, 210, 8, C) + c(430, 76, 8, C)
    return o

@scene("p-conteneur", "Un conteneur passe du camion au bateau")
def _():
    o = sol(230) + r(60, 150, 180, 70, C, 4) + "".join(r(72+i*20, 160, 8, 50, "#B8341A") for i in range(8))
    o += r(250, 180, 70, 40, N, 6) + c(100, 232, 16, N) + c(200, 232, 16, N) + c(290, 232, 16, N)
    o += fleche(340, 180, 400, 150, N) + p("M380,120 L470,120 L456,146 L394,146 Z", B)
    return o

# capitaines
@scene("c-dangote", "Une cimenterie et une raffinerie")
def _():
    o = sol(236) + r(40, 120, 60, 116, P) + p("M40,120 L70,90 L100,120 Z", L) + r(110, 150, 90, 86, P) + r(124, 70, 20, 80, L)
    o += r(250, 140, 50, 96, L) + e(275, 140, 25, 8, GR) + r(310, 120, 50, 116, L) + e(335, 120, 25, 8, GR)
    o += r(370, 90, 14, 146, N) + r(400, 160, 60, 76, P) + ln("M384,180 L400,180 M300,200 L310,200", N, 4)
    o += e(377, 74, 16, 10, CS) + soleil(430, 50, 22)
    return o

@scene("c-elumelu", "Une tour de banque et une poignée de main")
def _():
    o = sol(240, L) + batiment(70, 40, 120, 200, P, BS, None, 3, 6)
    o += p("M250,180 L310,150 L350,170 L400,140 L440,160 L440,200 L400,210 L350,200 L310,214 L250,210 Z", CS)
    o += p("M310,150 L350,170 L330,190 L300,176 Z", C) + p("M400,140 L440,160 L420,180 L390,162 Z", B)
    return o

@scene("c-dossongui", "D’un champ de coton à une mine d’or")
def _():
    o = sol(230, GS)
    for i in range(6):
        x = 40+i*30
        o += r(x, 160, 4, 70, G) + c(x+2, 154, 10, P) + c(x-6, 176, 7, P) + c(x+10, 190, 7, P)
    o += fleche(240, 170, 290, 170, N)
    o += p("M300,230 L360,130 L420,230 Z", BR) + p("M340,230 L360,190 L380,230 Z", N)
    o += p("M400,220 L420,200 L450,206 L440,228 Z", Y) + p("M420,224 L436,212 L458,218 L450,232 Z", Y)
    return o

@scene("c-awuah", "Une université et des diplômés")
def _():
    o = sol(236) + colonnes(110, 120, 180, 116, P, 6) + soleil(420, 60, 24)
    o += p("M330,180 L380,160 L430,180 L380,200 Z", N) + r(376, 200, 8, 26, N) + c(430, 186, 5, Y)
    return o

@scene("c-jonah", "Un chevalement de mine d’or")
def _():
    o = sol(230, BR) + ln("M160,230 L200,60 L240,230 M180,150 L220,150 M170,190 L230,190", N, 8) + c(200, 60, 22, N) + c(200, 60, 10, Y)
    o += r(280, 170, 140, 60, L) + p("M290,170 L300,150 L410,150 L420,170 Z", C)
    o += r(120, 236, 260, 20, N) + p("M300,250 L330,240 L360,252 L340,262 Z", Y)
    return o

@scene("c-fokam", "Une caisse de village : on épargne ensemble")
def _():
    o = sol(236) + maison(70, 130, 110, P, BR) + r(250, 160, 140, 76, Y, 6) + r(300, 150, 40, 14, N, 3)
    o += piece(320, 120, 16) + piece(350, 100, 14) + piece(290, 98, 12)
    o += perso(430, 176, corps=C, s=0.8) + perso(220, 180, corps=B, s=0.8)
    return o

@scene("c-mwangi", "Beaucoup de petits comptes, une grande banque")
def _():
    o = sol(240, L) + colonnes(170, 110, 140, 130, P, 5)
    for i in range(6):
        o += perso(40+i*80 if i < 3 else 40+i*80, 210, corps=[C, B, G, Y, CS, N][i], s=0.5)
    return o

@scene("c-masiyiwa", "Une antenne relais et des téléphones")
def _():
    o = sol(236) + ln("M240,236 L270,60 L300,236 M252,170 L288,170 M258,120 L282,120", N, 7)
    o += "".join(ln(f"M{250-k},{56} Q270,{30-k} {290+k},{56}", C, 5) for k in (0, 18, 36))
    o += telephone(80, 120, 60, 106) + telephone(360, 110, 60, 106, CS)
    return o

@scene("c-ibrahim", "Une balance et des barres : la gouvernance mesurée")
def _():
    o = sol(250, L)
    for i, hh in enumerate((60, 100, 80, 140, 120)):
        o += r(50+i*44, 240-hh, 30, hh, [BS, B, BS, B, C][i], 3)
    o += r(350, 90, 8, 150, N) + r(310, 236, 88, 10, N) + r(290, 90, 128, 6, N)
    o += e(300, 140, 28, 6, GR) + e(408, 140, 28, 6, GR) + ln("M300,96 L290,138 M300,96 L310,138 M408,96 L398,138 M408,96 L418,138", N, 2)
    return o

@scene("c-dewji", "Une usine de boissons et d’huiles")
def _():
    o = sol(236) + usine(40, 160, 190)
    for i in range(5):
        x = 280+i*36
        o += r(x, 170, 22, 66, [C, B, Y, G, CS][i], 6) + r(x+6, 158, 10, 14, N, 2)
    return o

@scene("c-alemu", "Une chaussure faite main")
def _():
    o = sol(230) + p("M90,200 Q100,140 160,138 L210,138 Q230,170 300,176 Q380,184 390,214 L390,226 L90,226 Z", C)
    o += r(90, 218, 300, 14, N, 6) + "".join(r(180+i*22, 150+i*4, 12, 6, Y, 2) for i in range(4))
    o += "".join(r(120+i*30, 190, 18, 6, P, 2) for i in range(8))
    return o

@scene("c-motsepe", "Des puits de mine remis en marche")
def _():
    o = sol(230, BR)
    for x in (80, 220, 360):
        o += ln(f"M{x},230 L{x+30},110 L{x+60},230 M{x+12},180 L{x+48},180", N, 6) + c(x+30, 110, 12, Y)
    o += fleche(140, 80, 340, 80, G, 5)
    return o

@scene("livres", "Une étagère de livres et une lampe")
def _():
    o = r(40, 230, 400, 14, BR) + r(40, 130, 400, 10, BR)
    x = 56
    for w_, h_, f in ((26, 86, C), (20, 72, B), (30, 90, N), (22, 80, Y), (28, 70, G), (24, 88, CS), (20, 76, B), (34, 84, C), (22, 68, N), (26, 90, BS)):
        o += livre(x, 230-h_, w_, h_, f, P if f in (N, C, B, G) else None); x += w_+4
    o += livre(340, 150, 70, 18, C) + livre(346, 168, 64, 18, B) + livre(338, 186, 72, 18, Y) + livre(342, 204, 66, 26, N)
    o += r(70, 60, 6, 70, N) + p("M48,60 L100,60 L88,30 L60,30 Z", C) + e(74, 64, 30, 6, Y, 'opacity=".5"')
    x = 120
    for w_, h_, f in ((24, 70, B), (20, 60, Y), (28, 80, C), (22, 64, G)):
        o += livre(x, 130-h_, w_, h_, f); x += w_+4
    return o

@scene("p-etat-trois", "Le ministère, la mairie et la caisse de retraite")
def _():
    o = sol(236) + colonnes(40, 130, 130, 106, P, 5) + batiment(200, 120, 100, 116, P, BS, C, 2, 3) + r(330, 140, 120, 96, P) + r(330, 140, 120, 18, B) + c(390, 196, 20, Y, f'stroke="{BR}" stroke-width="3"')
    return o

@scene("p-impots", "Les impôts deviennent une route et une école")
def _():
    o = sol(230) + piece(60, 120, 18) + piece(96, 100, 16) + piece(80, 150, 14)
    o += fleche(130, 120, 190, 120, N) + colonnes(210, 110, 80, 90, P, 4) + fleche(320, 120, 370, 120, N)
    o += r(380, 150, 80, 60, P) + poly("374,150 420,124 466,150", C) + p("M0,262 L480,262 L480,300 L0,300 Z", N) + "".join(r(20+i*60, 279, 30, 5, P) for i in range(8))
    return o

@scene("p-reguler", "Trois objectifs : orienter, stabiliser, partager")
def _():
    o = sol(250, L) + fleche(60, 200, 140, 120, G, 6) + r(190, 140, 100, 12, N, 6) + c(240, 120, 20, B)
    o += ln("M200,200 Q240,170 280,200", C, 6)
    for i, hh in enumerate((70, 50, 60)):
        o += r(330+i*40, 230-hh, 28, hh, [C, Y, B][i], 3)
    return o

@scene("p-inegalites", "Des piles de pièces de hauteurs différentes")
def _():
    o = sol(240, L)
    for i, n in enumerate((2, 4, 7, 11)):
        x = 80+i*100
        for k in range(n): o += e(x, 230-k*14, 32, 9, Y, f'stroke="{BR}" stroke-width="2"')
        o += perso(x, 230-n*14-60, corps=[C, B, G, N][i], s=0.6)
    return o

if __name__ == "__main__":
    for nom, (fn, titre, bg) in S_.items():
        open(os.path.join(D, nom + ".svg"), "w").write(svg(fn(), bg, titre=titre))
    print(len(S_), "illustrations")
