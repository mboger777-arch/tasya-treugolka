# бот проходит мир, проверяет ноги/ошибки/fps; листы скриншотов
import asyncio,sys,json,os
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8765/index.html'
SIZES=[tuple(map(int,s.split('x'))) for s in os.environ.get('SZ','844x390,667x375,932x430').split(',')]
async def run(pw,w,h,shots):
    b=await pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=2)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto(URL+'?bot=1&seed=7&v=t'+os.environ.get('LV',''));await pg.evaluate('localStorage.clear()')
    await pg.goto(URL+'?bot=1&seed=7&v=t'+os.environ.get('LV',''))
    t=0;k=0;lastlv=None
    while t<600:
        await asyncio.sleep(1);t+=1
        st=await pg.evaluate('({s:G.scene,l:G.level,done:G.botDone,x:typeof P!="undefined"&&P?P.x:0,st:G.stats,log:G.log.slice(-5),err:G.errors})')
        if shots and t%int(os.environ.get('SHOT','6'))==0 and st['s'] in('play','boss'):
            await pg.screenshot(path=f'shots/{w}_{k:03d}_{st["l"]}.png');k+=1
        if st['done']:break
    await b.close();return st,errs,t
async def main():
    os.makedirs('shots',exist_ok=True)
    async with async_playwright() as pw:
        for i,(w,h) in enumerate(SIZES):
            st,errs,t=await run(pw,w,h,True)
            print(w,h,'time',t,'done',st['done'],'levels',json.dumps(st['st']['levels']),'badFeet',st['st']['badFeet'],'ground',st['st']['ground'],'minFps',st['st']['minFps'],'errs',errs[:3]+st['err'][:3],'log',st['log'],flush=True)
asyncio.run(main())
