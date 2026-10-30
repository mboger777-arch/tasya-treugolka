# Поворот телефона и смена размера посреди игры: проверка, что картинка НЕ растягивается (aniso≈1, искажение спрайтов≈0)
# BLOCK=1 — имитация мобильных браузеров, которые не присылают resize (или присылают поздно) после поворота/скрытия адресной строки
import asyncio,json,os,sys
sys.path.insert(0,os.path.dirname(__file__))
from playwright.async_api import async_playwright
import importlib.util
spec=importlib.util.spec_from_file_location('ph',os.path.join(os.path.dirname(__file__),'phone.py'))
src=open(spec.origin).read();HOOK=src.split('HOOK="""')[1].split('"""')[0];PROBE=src.split('PROBE="""')[1].split('"""')[0]
URL=os.environ.get('URL','http://localhost:8765/index.html');OUT=os.environ.get('OUT','shots/rotate');os.makedirs(OUT,exist_ok=True)
TAG=os.environ.get('TAG','new');DPR=float(os.environ.get('DPR','3'));LV=os.environ.get('LV','1-1')
BLOCKJS="""(()=>{const b=e=>e.stopImmediatePropagation();addEventListener('resize',b,true);addEventListener('orientationchange',b,true);
if(window.visualViewport){visualViewport.addEventListener=()=>{}}})()"""
SCEN=[('rotate',[(412,915),(915,412)]),('midgame',[(915,412),(844,390),(932,430),(740,360),(1024,768)]),('addrbar',[(915,356),(915,412)]),('back',[(915,412),(412,915),(844,390)])]
async def main():
    fails=0
    async with async_playwright() as pw:
        b=await pw.chromium.launch()
        for block in (0,1):
            for name,seq in SCEN:
                w,h=seq[0]
                ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=DPR,is_mobile=True,has_touch=True)
                pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
                if block:await pg.add_init_script(BLOCKJS)
                await pg.goto(URL+f'?bot=1&seed=7&all=1&level={LV}&upto={LV}');await pg.evaluate(HOOK);await asyncio.sleep(3)
                for i,(w,h) in enumerate(seq[1:]):
                    await pg.set_viewport_size({'width':w,'height':h});await asyncio.sleep(1.5)
                    await pg.evaluate("window.__AN&&(__AN.cat={hero:0,sprite:0,tile:0},__AN.m={},__AN.worst=0)");await asyncio.sleep(1.5)
                    p=await pg.evaluate(PROBE);ok=abs(p['aniso']-1)<0.01 and p['css']==[w,h] and max(p['draw']['cat'].values())<0.02 and not errs
                    fails+=not ok
                    fn=f"{OUT}/{TAG}_{'blk_' if block else ''}{name}{i}_{w}x{h}.png";await pg.screenshot(path=fn)
                    print(json.dumps({'tag':TAG,'block':block,'scen':name,'to':f'{w}x{h}','css':p['css'],'bmp':p['bmp'],'aniso':p['aniso'],'cat':p['draw']['cat'],'ok':ok,'err':errs[:2],'shot':fn}),flush=True)
                await ctx.close()
        await b.close()
    print('FAILS',fails)
asyncio.run(main())
