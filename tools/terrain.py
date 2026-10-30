# v14: нарисованный рельеф по мирам. plat{N}.jpg (нейросеть) -> хромакей -> ESRGAN x2 -> [левый край | бесшовная середина | правый край]
#      fill{N}.jpg -> бесшовная (quilting min-cut) заливка тела земли
import sys,os,json,numpy as np
sys.path.insert(0,os.path.dirname(__file__))
from PIL import Image
from key import key
from upscale import esr
G='/workspace/lesson59m/gen';O='/workspace/lesson59m/game/assets/img'
def seam_dp(cost):
    h,w=cost.shape;M=cost.copy();B=np.zeros((h,w),int)
    for y in range(1,h):
        p=np.pad(M[y-1],1,constant_values=1e18);c=np.stack([p[:-2],p[1:-1],p[2:]]);i=c.argmin(0);M[y]+=c[i,np.arange(w)];B[y]=i-1
    s=np.zeros(h,int);s[-1]=M[-1].argmin()
    for y in range(h-1,0,-1):s[y-1]=np.clip(s[y]+B[y,s[y]],0,w-1)
    return s
def wrapx(a,ov):
    h,w,c=a.shape;L=a[:,:ov];R=a[:,w-ov:]
    wt=(np.maximum(L[...,3:],R[...,3:])/255.+.05) if c==4 else 1
    cost=(((L-R)**2)*wt).sum(2);s=seam_dp(cost)
    xs=np.arange(ov)[None,:];m=np.clip((xs-s[:,None])/6.+.5,0,1)[...,None]  # 0 -> R, 1 -> L, мягкий шов
    out=a[:,:w-ov].copy();out[:,:ov]=R*(1-m)+L*m;return out
def rgbaup(im):
    rgb=im.convert('RGB');a=im.getchannel('A')
    r=esr(rgb).resize((im.width*2,im.height*2),Image.LANCZOS)
    aa=esr(Image.merge('RGB',(a,a,a))).getchannel('G').resize((im.width*2,im.height*2),Image.LANCZOS)
    r.putalpha(aa);return r
# доля ширины на края (кораллы/кристаллы шире), низ полосы для земли (доля высоты платформы)
CFG={1:dict(e=.085,cut=.80),2:dict(e=.07,cut=.85),3:dict(e=.06,cut=.80),4:dict(e=.17,cut=.62),5:dict(e=.085,cut=.42),6:dict(e=.16,cut=.62)}
meta={}
for n in [int(x) for x in (sys.argv[1:] or '123456')]:
    cf=CFG[n];im,bg=key(f'{G}/plat{n}.jpg');bb=im.getbbox();im=im.crop(bb)
    up=f'{G}/up{n}.png'
    if not os.path.exists(up):rgbaup(im).save(up)
    u=Image.open(up);a=np.asarray(u).astype(np.float32);h,w,_=a.shape;al=a[...,3]
    cols=(al>128);top=np.where(cols.any(0),cols.argmax(0),h);bot=np.where(cols.any(0),h-1-cols[::-1].argmax(0),0)
    xl=int(np.argmax(cols.any(0)));xr=int(w-np.argmax(cols.any(0)[::-1]))
    ew=int(cf['e']*w);m0,m1=xl+ew,xr-ew
    mid=a[:,m0:m1];ov=min(160,(m1-m0)//5);midw=wrapx(mid,ov)
    surf=int(np.percentile(top[m0:m1],55));pb=int(np.percentile(bot[m0:m1],50))
    Lp=a[:,xl:m0];Rp=a[:,m1:xr]
    atlas=np.concatenate([Lp,midw,Rp],1)
    Image.fromarray(np.clip(atlas,0,255).astype(np.uint8),'RGBA').save(f'{O}/terr_w{n}.png',optimize=True)
    Image.fromarray(np.clip(atlas,0,255).astype(np.uint8),'RGBA').save(f'{O}/terr_w{n}.webp',quality=90,method=6)
    meta[n]=dict(l=int(m0-xl),p=int(midw.shape[1]),r=int(xr-m1),h=h,s=surf,b=pb,cut=int(surf+(pb-surf)*cf['cut']),top=int(top[m0:m1].min()))
    # заливка
    f=np.asarray(Image.open(f'{G}/fill{n}.jpg').convert('RGB')).astype(np.float32)[40:-40,40:-40]
    from scipy.ndimage import gaussian_filter as gf
    lo=np.stack([gf(f[...,c],40,mode='reflect') for c in range(3)],2);f=f/np.maximum(lo,1)*lo.mean((0,1))  # убрать виньетку/перепады света
    f=wrapx(f,110);f=wrapx(f.transpose(1,0,2),110).transpose(1,0,2)
    fi=Image.fromarray(np.clip(f,0,255).astype(np.uint8)).resize((768,768),Image.LANCZOS)
    fi.save(f'{O}/fill_w{n}.webp',quality=86,method=6);fi.save(f'{O}/fill_w{n}.png',optimize=True)
    print(n,meta[n],flush=True)
json.dump(meta,open(f'{G}/terr_meta.json','w'))
print('TERR=',json.dumps(meta,separators=(',',':')))
