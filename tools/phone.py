# Проверка на «телефоне»: isMobile+hasTouch+DPR, скриншоты уровней, проверка пропорций (canvas CSS vs bitmap, drawImage src vs dest)
import asyncio,sys,json,os
from playwright.async_api import async_playwright
URL=os.environ.get('URL','http://localhost:8765/index.html')
OUT=os.environ.get('OUT','shots/phone');os.makedirs(OUT,exist_ok=True)
DEV=[tuple(s.split(':')) for s in os.environ.get('DEV','915x412:2.625').split(',')]
LVS=os.environ.get('LVS','1-1,2-2,3-3,4-2,5-3,6-1').split(',')
WAIT=float(os.environ.get('WAIT','7'))
PROBE="""(()=>{const r=C.getBoundingClientRect();const a1=r.width/r.height,a2=C.width/C.height;const A=window.__AN||{n:0,bad:0,worst:0,ex:[]};
return {css:[r.width,r.height],bmp:[C.width,C.height],inner:[innerWidth,innerHeight],dpr:devicePixelRatio,gdpr:typeof DPR!='undefined'?DPR:0,aniso:+(a1/a2).toFixed(4),draw:A,fps:G.fps,scene:G.scene,lvl:G.level,err:G.errors.slice(0,3)}})()"""
HOOK="""(()=>{const A=window.__AN={n:0,bad:0,worst:0,ex:[]};const P=CanvasRenderingContext2D.prototype,o=P.drawImage;
P.drawImage=function(im,...a){try{if(this.canvas.id=='c'){let sw,sh,dw,dh;if(a.length==4){sw=im.width;sh=im.height;dw=a[2];dh=a[3]}else if(a.length==8){sw=a[2];sh=a[3];dw=a[6];dh=a[7]}
 if(dw&&dh&&sw&&sh){const m=this.getTransform();const sx=Math.hypot(m.a,m.b),sy=Math.hypot(m.c,m.d);const r=(Math.abs(dw*sx)/sw)/(Math.abs(dh*sy)/sh);A.n++;const d=Math.abs(Math.log(r));if(d>0.03){A.bad++;if(d>A.worst){A.worst=+d.toFixed(3)};const k=(im.src||('cv'+im.width+'x'+im.height)).split('/').pop().split('?')[0]+(a.length==8?'@'+a[0]+','+a[1]+','+a[2]+'x'+a[3]:'');A.m=A.m||{};if(!A.m[k])A.m[k]=+r.toFixed(2)}}}}catch(e){}return o.call(this,im,...a)}})()"""
async def main():
    res=[]
    async with async_playwright() as pw:
        b=await pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        for sz,dpr in DEV:
            w,h=map(int,sz.split('x'))
            ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=float(dpr),is_mobile=True,has_touch=True)
            pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            for lv in LVS:
                await pg.goto(URL+f'?bot=1&seed=7&all=1&level={lv}&upto={lv}'+os.environ.get('EXTRA',''))
                if os.environ.get('HOOK','1')=='1':await pg.evaluate(HOOK)
                await asyncio.sleep(WAIT)
                p=await pg.evaluate(PROBE);p['dev']=f'{w}x{h}@{dpr}';p['lv']=lv
                await pg.screenshot(path=f'{OUT}/{w}x{h}_{lv}.png');res.append(p);print(json.dumps(p),flush=True)
            await ctx.close()
        await b.close()
    print('ERRS',errs)
asyncio.run(main())
