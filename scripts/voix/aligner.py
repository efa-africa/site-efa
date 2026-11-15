# Retrouve, pour chaque clip publié, le segment exact de l'enregistrement source
import sys, json, glob, os, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfiltfilt, resample_poly, fftconvolve
SR=8000
def prep(x,sr):
    x=resample_poly(x,1,sr//SR); sos=butter(4,[250,3000],'bandpass',fs=SR,output='sos'); return sosfiltfilt(sos,x)
def dec(p):
    raw=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','48000','-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw,dtype=np.float32).astype(np.float64)
SRC={}
for n in sys.argv[2].split(','):
    x,sr=sf.read(f'src/{n}.wav'); SRC[n]=prep(x,sr)
def ncc(s,w):
    c=fftconvolve(s,w[::-1],'valid'); e=np.sqrt(np.maximum(fftconvolve(s*s,np.ones(len(w)),'valid'),1e-12))
    c=c/(e*np.linalg.norm(w)+1e-12); i=int(np.argmax(c)); return i,float(c[i])
out={}
for p in sorted(glob.glob(sys.argv[1])):
    c=prep(dec(p),48000); L=len(c)/SR; W=int(1.5*SR)
    a0=int(0.15*SR); b1=len(c)-int(0.55*SR); b0=b1-W
    if b0<a0: W=int(0.8*SR); b0=b1-W
    best=None
    for n,s in SRC.items():
        i,ci=ncc(s,c[a0:a0+W]); j,cj=ncc(s,c[b0:b1])
        if best is None or ci+cj>best[0]: best=(ci+cj,n,i,ci,j,cj)
    _,n,i,ci,j,cj=best
    t0=i/SR-0.15; t1=j/SR+(L-0.25-b0/SR)
    k=os.path.basename(p)[:-4]; out[k]=dict(src=n,t0=round(t0,3),t1=round(t1,3),clip=round(L,2),c0=round(ci,2),c1=round(cj,2))
    flag='' if min(ci,cj)>0.6 and t1>t0 else '  <<<<'
    print(f"{k:22s} {n:8s} {t0:8.2f} → {t1:8.2f}  src {t1-t0:6.2f}s clip {L:6.2f}s  corr {ci:.2f}/{cj:.2f}{flag}")
json.dump(out,open(sys.argv[3],'w'),indent=1)
