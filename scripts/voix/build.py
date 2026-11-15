# Reconstruit chaque clip depuis la source nettoyée : mêmes bornes, pauses régulières, timbre, compression douce, niveau identique
import sys, json, os, subprocess, numpy as np, soundfile as sf, pyloudnorm as pyln
cuts=json.load(open(sys.argv[1])); outdir=sys.argv[2]; os.makedirs(outdir,exist_ok=True); os.makedirs('w/clips',exist_ok=True)
E={}
def enh(n):
    if n not in E: E[n]=sf.read(f'w/enh/{n}.dr.wav')
    return E[n]
def env_db(x,sr,h):
    n=len(x)//h; return 10*np.log10(np.maximum((x[:n*h].reshape(n,h)**2).mean(1),1e-14))
LEAD,TAIL,PMAX,PKEEP=0.12,0.32,1.10,0.80
rep={}
for k,v in cuts.items():
    if 'segs' not in v: continue
    x,sr=enh(v['src']); y=x[int(v['t0']*sr):int(v['t1']*sr)].copy(); h=int(0.01*sr)
    e=env_db(y,sr,h); ref=np.percentile(e,95); act=e>ref-38
    # comble les trous de moins de 60 ms, retire les îlots de moins de 30 ms
    def islands(m,minlen):
        m=m.copy(); j=0
        while j<len(m):
            if m[j]:
                q=j
                while q<len(m) and m[q]: q+=1
                if q-j<minlen: m[j:q]=False
                j=q
            else: j+=1
        return m
    act=islands(act,6)                        # un clic ou un bruit de bouche de moins de 60 ms n'est pas de la parole
    strong=islands(e>ref-32,12); idx=np.flatnonzero(strong); first=idx[0]
    while first>0 and act[first-1]: first-=1  # remonte jusqu'au vrai début du mot
    idx=np.flatnonzero(act); last=idx[-1]
    # pauses internes
    out=[]; i=first; cur=first; pauses=0
    runs=[]; j=first
    while j<=last:
        if not act[j]:
            q=j
            while q<=last and not act[q]: q+=1
            runs.append((j,q)); j=q
        else: j+=1
    pos=max(0,first*h-int(LEAD*sr)); parts=[]; 
    for (a,b) in runs:
        d=(b-a)*0.01
        if d>PMAX:
            cut=int((d-PKEEP)*sr); mid=(a+b)//2*h
            parts.append((pos,mid-cut//2)); pos=mid+cut-cut//2; pauses+=1
    parts.append((pos,min(len(y),(last+1)*h+int(TAIL*sr))))
    f=int(0.02*sr); z=None
    for (a,b) in parts:
        s=y[a:b].copy()
        if z is None: z=s
        else:
            r=np.linspace(0,1,f); z[-f:]=z[-f:]*(1-r)+s[:f]*r; z=np.concatenate([z,s[f:]])
    lead=first*h-max(0,first*h-int(LEAD*sr))
    if lead<int(LEAD*sr): z=np.concatenate([np.zeros(int(LEAD*sr)-lead),z])
    tail_have=min(len(y),(last+1)*h+int(TAIL*sr))-(last+1)*h
    if tail_have<int(TAIL*sr): z=np.concatenate([z,np.zeros(int(TAIL*sr)-tail_have)])
    fi=int(0.03*sr); z[:fi]*=np.linspace(0,1,fi); fo=int(0.18*sr); z[-fo:]*=np.linspace(1,0,fo)**2
    sf.write(f'w/clips/{k}.a.wav',z,sr,subtype='PCM_24')
    # timbre + compression douce (identiques pour tous les clips)
    af="highpass=f=85,equalizer=f=300:t=q:w=1.0:g=-1.5,acompressor=threshold=-22dB:ratio=2:attack=8:release=160:knee=6:makeup=1,highshelf=f=5000:g=-1.5"
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'w/clips/{k}.a.wav','-af',af,'-c:a','pcm_s24le',f'w/clips/{k}.b.wav'],check=True)
    b,sr=sf.read(f'w/clips/{k}.b.wav'); L=pyln.Meter(sr).integrated_loudness(b); g=-16.0-L
    for _ in range(7):
        af2=f"volume={g:.2f}dB,alimiter=limit=0.80:attack=3:release=60:level=disabled,aresample=44100"
        subprocess.run(['ffmpeg','-v','error','-y','-i',f'w/clips/{k}.b.wav','-af',af2,'-ac','1','-c:a','libmp3lame','-b:a','112k',f'{outdir}/{k}.mp3'],check=True)
        raw=subprocess.run(['ffmpeg','-v','error','-i',f'{outdir}/{k}.mp3','-f','f32le','-ac','1','-'],capture_output=True).stdout; m=np.frombuffer(raw,dtype=np.float32).astype(np.float64)
        L2=pyln.Meter(44100).integrated_loudness(m); pk=20*np.log10(np.abs(m).max())
        if abs(L2+16.0)<0.08: break
        g+=(-16.0-L2)
    rep[k]=dict(dur=round(len(m)/44100,2),old=v['clip'],lufs=round(L2,1),peak=round(pk,1),pauses=pauses,gain=round(g,1))
    print(f"{k:20s} {len(m)/44100:6.2f}s (avant {v['clip']:6.2f}s)  {L2:6.1f} LUFS  crête {pk:5.1f} dB  pauses raccourcies {pauses}  gain {g:5.1f}")
json.dump(rep,open(sys.argv[3],'w'),indent=1)
