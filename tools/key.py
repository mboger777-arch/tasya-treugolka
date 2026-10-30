# Универсальный хромакей: фон = медиана рамки; альфа по расстоянию до фона; деспилл; крупнейшая компонента
import sys,numpy as np
from PIL import Image
from scipy import ndimage as nd
def key(src,t0=40,t1=90,keepn=1,minfrac=0.002):
    a=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
    h,w,_=a.shape;b=np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3),a[:,:6].reshape(-1,3),a[:,-6:].reshape(-1,3)])
    bg=np.median(b,0)
    d=np.sqrt(((a-bg)**2).sum(2))
    al=np.clip((d-t0)/(t1-t0),0,1)
    m=al>0.5;lab,n=nd.label(m);
    if n:
        sz=nd.sum(m,lab,range(1,n+1));keep=np.zeros(n+1,bool)
        order=np.argsort(-sz)
        for i in order[:keepn]:keep[i+1]=True
        for i in order:  # also keep sizeable pieces (hanging crystals etc.)
            if sz[i]>minfrac*h*w:keep[i+1]=True
        km=keep[lab];km=nd.binary_dilation(km,iterations=3)
        al=al*km;al[nd.binary_fill_holes(al>0.5)]=np.maximum(al[nd.binary_fill_holes(al>0.5)],1)
    # despill: убрать примесь фона по краям
    f=al[...,None];bgc=bg[None,None,:]
    with np.errstate(divide='ignore',invalid='ignore'):
        rgb=np.where(f>0.02,(a-(1-f)*bgc)/np.maximum(f,0.02),a)
    rgb=np.clip(rgb,0,255)
    out=np.dstack([rgb,al*255]).astype(np.uint8)
    return Image.fromarray(out,'RGBA'),bg
if __name__=='__main__':
    im,bg=key(sys.argv[1]);im.save(sys.argv[2]);print(sys.argv[1],'bg',bg.round(),'bbox',im.getbbox())
