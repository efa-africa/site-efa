# Pour un clip publié : liste des morceaux de la source réellement utilisés (retrouve silences raccourcis et reprises retirées)
import sys, json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfiltfilt, resample_poly, fftconvolve
SR=8000
def prep(x,sr): x=resample_poly(x,1,sr//SR); return sosfiltfilt(butter(4,[250,3000],'bandpass',fs=SR,output='sos'),x)
def dec(p):
    raw=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','48000','-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw,dtype=np.float32).astype(np.float64)
_S={}
def src(n):
    if n not in _S: x,sr=sf.read(f'src/{n}.wav'); _S[n]=prep(x,sr)
    return _S[n]
def segmap(path,n,t0,t1):
    c=prep(dec(path),48000); s=src(n); a=max(0,int((t0-1)*SR)); b=min(len(s),int((t1+1)*SR)); s=s[a:b]
    W=int(0.6*SR); H=int(0.05*SR); pts=[]
    for i in range(0,len(c)-W-int(0.25*SR),H):
        w=c[i:i+W]
        if np.sqrt((w**2).mean())<0.004: continue
        cc=fftconvolve(s,w[::-1],'valid'); e=np.sqrt(np.maximum(fftconvolve(s*s,np.ones(W),'valid'),1e-12)); cc=cc/(e*np.linalg.norm(w)+1e-12)
        j=int(np.argmax(cc))
        if cc[j]>0.75: pts.append((i/SR,(a+j)/SR,(a+j)/SR-i/SR))
    segs=[]
    for ct,st,off in pts:
        if segs and abs(off-segs[-1]['off'])<0.03: segs[-1]['c1']=ct+0.6
        else: segs.append(dict(off=off,c0=ct,c1=ct+0.6))
    segs=[g for g in segs if g['c1']-g['c0']>=0.7]   # ignore les faux accords isolés
    return [dict(s0=round(g['c0']+g['off'],3),s1=round(g['c1']+g['off'],3),off=round(g['off'],3)) for g in segs]
if __name__=='__main__':
    cuts=json.load(open(sys.argv[1])); d=sys.argv[2]
    for k,v in cuts.items():
        if v['c0']<0.6: continue
        g=segmap(f'{d}/{k}.mp3',v['src'],v['t0'],v['t1']); v['segs']=g
        if len(g)!=1: print(k,v['t0'],v['t1'],g)
    json.dump(cuts,open(sys.argv[1],'w'),indent=1)
