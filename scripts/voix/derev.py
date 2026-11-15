# Suppression de la réverbération tardive (modèle de Lebart / Habets) : la queue de salle est estimée
# comme une copie retardée et atténuée de l'énergie passée, puis retirée par un gain spectral borné.
import sys, numpy as np, soundfile as sf
from scipy.signal import stft, istft
from scipy.ndimage import uniform_filter1d
def derev(x, sr, t60=0.35, td=0.048, beta=1.0, floor_db=-9.0, n=1024, hop=256):
    f,t,X=stft(x,sr,nperseg=n,noverlap=n-hop,window='hann'); P=np.abs(X)**2
    dt=hop/sr; a=np.exp(-dt/0.04)                      # lissage temporel ~40 ms
    S=np.empty_like(P); S[:,0]=P[:,0]
    for k in range(1,P.shape[1]): S[:,k]=a*S[:,k-1]+(1-a)*P[:,k]
    # T60 dépendant de la fréquence : plus long dans le grave/médium, plus court dans l'aigu
    fr=np.clip(f,100,8000); T=t60*np.interp(np.log10(fr),[2,2.7,3.3,3.9],[1.15,1.0,0.9,0.7])
    delta=3*np.log(10)/T; d=int(round(td/dt)); att=np.exp(-2*delta*d*dt)[:,None]
    L=np.zeros_like(S); L[:,d:]=att*S[:,:-d]
    snr=np.maximum(P/np.maximum(beta*L,1e-16)-1,0)       # rapport direct / tardif a posteriori
    G=snr/(snr+1); G=np.maximum(G,10**(floor_db/20))
    G=uniform_filter1d(G,3,axis=0)                        # lissage en fréquence, évite le bruit musical
    b=np.exp(-dt/0.012); Gs=np.empty_like(G); Gs[:,0]=G[:,0]
    for k in range(1,G.shape[1]): Gs[:,k]=np.where(G[:,k]>Gs[:,k-1],G[:,k],b*Gs[:,k-1]+(1-b)*G[:,k])  # attaque immédiate, relâchement doux
    _,y=istft(X*Gs,sr,nperseg=n,noverlap=n-hop,window='hann'); return y[:len(x)]
if __name__=='__main__':
    x,sr=sf.read(sys.argv[1]); kw=dict(a.split('=') for a in sys.argv[3:]); kw={k:float(v) for k,v in kw.items()}
    sf.write(sys.argv[2],derev(x,sr,**kw),sr,subtype='PCM_24')
