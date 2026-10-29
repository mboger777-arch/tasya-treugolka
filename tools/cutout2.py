# хромакей для зелёного фона, сохраняющий мятную тунику: python3 cutout2.py src pre
import sys,numpy as np
from PIL import Image
from scipy import ndimage
src,pre=sys.argv[1],sys.argv[2]
im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
r,g,b=im[...,0],im[...,1],im[...,2]
d=g-np.maximum(r,b)
a=1-np.clip((d-95)/(150-95),0,1)
a=np.where((g>200)&(r<60)&(b<70),0,a)
edge=(a<0.97)
gl=np.maximum(r,b)+12;im[...,1]=np.where(edge,np.minimum(g,gl),g)
m=a>0.5;lab,n=ndimage.label(m);sz=ndimage.sum(m,lab,range(1,n+1))
keep=np.isin(lab,1+np.where(sz>400)[0]);keep=ndimage.binary_dilation(keep,iterations=3);a=a*keep
a=np.minimum(a,ndimage.grey_erosion(a,size=(2,2)))
rgba=np.dstack([im,a*255]).clip(0,255).astype(np.uint8)
lab,n=ndimage.label(a>0.25);objs=ndimage.find_objects(lab);sz=ndimage.sum(np.ones_like(a),lab,range(1,n+1))
big=[k for k in range(n) if sz[k]>6000];big.sort(key=lambda k:objs[k][1].start)
own={k:[k] for k in big}
for k in range(n):
  if k in big or sz[k]<30:continue
  sy,sx=objs[k];cx=(sx.start+sx.stop)/2;cy=(sy.start+sy.stop)/2
  def dist(q):
    by,bx=objs[q];return max(bx.start-cx,0,cx-bx.stop)+max(by.start-cy,0,cy-by.stop)
  own[min(big,key=dist)].append(k)
print('views',len(big))
for i,q in enumerate(big):
  mm=np.isin(lab,[t+1 for t in own[q]]);mm=ndimage.binary_dilation(mm,iterations=2)
  ys,xs=np.where(mm&(a>0.1));y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
  out=rgba[y0:y1,x0:x1].copy();out[...,3]=(out[...,3]*mm[y0:y1,x0:x1]).astype(np.uint8)
  Image.fromarray(out).save(f'{pre}_{i}.png');print(i,x1-x0,y1-y0,y0,y1,'x0',x0)
