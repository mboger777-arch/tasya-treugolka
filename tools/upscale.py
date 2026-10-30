# Real-ESRGAN anime6b (onnx, CPU) апскейл: RGB нейросетью, альфа — Lanczos. usage: upscale.py src dst factor
import sys,numpy as np,onnxruntime as ort
from PIL import Image
S=ort.InferenceSession('/home/box/esr/anime6b.onnx',providers=['CPUExecutionProvider'])
def esr(rgb,tile=192,pad=12):
    a=np.asarray(rgb).astype(np.float32)/255.;h,w,_=a.shape;out=np.zeros((h*4,w*4,3),np.float32)
    for y in range(0,h,tile):
        for x in range(0,w,tile):
            y0,x0=max(0,y-pad),max(0,x-pad);y1,x1=min(h,y+tile+pad),min(w,x+tile+pad)
            t=a[y0:y1,x0:x1].transpose(2,0,1)[None]
            r=S.run(None,{'input':t})[0][0].transpose(1,2,0)
            ty,tx=(y-y0)*4,(x-x0)*4;hh,ww=min(tile,h-y)*4,min(tile,w-x)*4
            out[y*4:y*4+hh,x*4:x*4+ww]=r[ty:ty+hh,tx:tx+ww]
    return Image.fromarray((np.clip(out,0,1)*255+.5).astype(np.uint8))
def up(src,dst,f):
    im=Image.open(src);has_a=im.mode in('RGBA','LA','P');im=im.convert('RGBA' if has_a else 'RGB')
    W,H=round(im.width*f),round(im.height*f)
    if has_a:
        a=im.getchannel('A');rgb=Image.new('RGB',im.size);
        # залить прозрачные пиксели ближайшим цветом, чтобы не было тёмного ореола
        arr=np.asarray(im).astype(np.float32);al=arr[...,3:]/255.
        from PIL import ImageFilter
        base=Image.fromarray(arr[...,:3].astype(np.uint8));blur=base.filter(ImageFilter.GaussianBlur(6))
        ab=np.asarray(a.filter(ImageFilter.GaussianBlur(6))).astype(np.float32)[...,None]/255.+1e-4
        fill=np.asarray(blur).astype(np.float32)/ab
        # премультипликация: blur(rgb*a)/blur(a)
        pm=Image.fromarray(np.clip(arr[...,:3]*al,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
        fill=np.clip(np.asarray(pm).astype(np.float32)/ab,0,255)
        rgbf=arr[...,:3]*al+fill*(1-al);rgb=Image.fromarray(rgbf.astype(np.uint8))
        r=esr(rgb).resize((W,H),Image.LANCZOS);aa=esr(Image.merge('RGB',(a,a,a))).getchannel('G').resize((W,H),Image.LANCZOS)
        r.putalpha(aa);r.save(dst,optimize=True)
    else:
        r=esr(im).resize((W,H),Image.LANCZOS)
        r.save(dst,quality=88,optimize=True) if dst.endswith('.jpg') else r.save(dst)
if __name__=='__main__':up(sys.argv[1],sys.argv[2],float(sys.argv[3]))
