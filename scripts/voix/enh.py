import sys, numpy as np, soundfile as sf, subprocess
sys.path.insert(0,'bin'); from derev import derev
from scipy.signal import butter, sosfiltfilt
for n in sys.argv[1:]:
    x,sr=sf.read(f'src/{n}.wav'); x=sosfiltfilt(butter(2,75,'highpass',fs=sr,output='sos'),x)
    B=60*sr; O=3*sr; y=np.zeros(len(x)); p=0
    while p<len(x):
        a=max(0,p-O); b=min(len(x),p+B+O); z=derev(x[a:b],sr,t60=0.38,beta=1.6,floor_db=-12)
        seg=z[p-a:p-a+min(B,len(x)-p)]
        if p>0:   # fondu de 50 ms sur la jointure
            f=int(0.05*sr); r=np.linspace(0,1,f); prev=zprev[pprev_off:pprev_off+f]; seg=seg.copy(); seg[:f]=prev*(1-r)+seg[:f]*r
        y[p:p+len(seg)]=seg; zprev=z; pprev_off=(p-a)+B; p+=B
    g=10**(-3/20)/np.abs(y).max(); sf.write(f'w/{n}.dr.wav',y*g,sr,subtype='PCM_16')
    r=subprocess.run(['bin/deep-filter','-D','-a','40','-o','w/enh',f'w/{n}.dr.wav'],capture_output=True,text=True); print(n,'gain',round(20*np.log10(g),1),'dB',[l for l in r.stderr.splitlines() if 'WARN' in l or 'rror' in l])
