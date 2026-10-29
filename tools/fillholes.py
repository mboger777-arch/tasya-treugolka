# заполнить дыры внутри замкнутого контура исходным цветом: python3 fillholes.py raw.jpg cut.png x0 y0
import sys,numpy as np
from PIL import Image
from scipy import ndimage
raw=np.asarray(Image.open(sys.argv[1]).convert('RGB'));c=np.asarray(Image.open(sys.argv[2])).copy()
x0,y0=int(sys.argv[3]),int(sys.argv[4]);h,w=c.shape[:2];r=raw[y0:y0+h,x0:x0+w].astype(int)
m=c[...,3]>128;f=ndimage.binary_fill_holes(m);hole=ndimage.binary_dilation(f&~m,iterations=2)&f
# немного затемнить зелень, чтобы не было «хромакейного» цвета
rr=r.copy();rr[...,1]=np.minimum(rr[...,1],(rr[...,0]+rr[...,2])//2+70)
c[...,:3]=np.where(hole[...,None],rr,c[...,:3]);c[...,3]=np.where(hole,255,c[...,3])
Image.fromarray(c).save(sys.argv[2]);print('filled',hole.sum())
