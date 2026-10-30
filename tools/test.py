# бот проходит мир, проверяет ноги/ошибки/fps; листы скриншотов
import asyncio,sys,json,os
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8765/index.html'
SIZES=[tuple(map(int,s.split('x'))) for s in os.environ.get('SZ','844x390,667x375,932x430').split(',')]
async def run(pw,w,h,shots):
    b=await pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=float(os.environ.get('DPR','3')),is_mobile=os.environ.get('MOB','1')=='1',has_touch=os.environ.get('MOB','1')=='1')
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto(URL+'?bot=1&seed=7&v=t'+os.environ.get('LV',''));await pg.evaluate('localStorage.clear()')
    await pg.goto(URL+'?bot=1&seed=7&v=t'+os.environ.get('LV',''))
    t=0;k=0;lastlv=None;wins=set()
    while t<600:
        await asyncio.sleep(1);t+=1
        st=await pg.evaluate('({s:G.scene,l:G.level,done:G.botDone,x:typeof P!="undefined"&&P?P.x:0,st:G.stats,log:G.log.slice(-5),err:G.errors,won:G.won,wt:G.winT||0,ct:WX.cut?WX.cut.t:0,ci:WX.cut?WX.cut.im:""})')
        if shots and t%int(os.environ.get('SHOT','6'))==0 and st['s'] in('play','boss'):
            await pg.screenshot(path=f'shots/{w}_{k:03d}_{st["l"]}.png');k+=1
        if st['won'] and st['wt']>2.6 and st['l'] not in wins and st['s'] in('play','boss'):
            wins.add(st['l']);await pg.screenshot(path=f'shots/win_{w}_{st["l"]}.png')
        if st['s']=='cut' and st['ct']>3 and ('cut'+st['ci']) not in wins:
            wins.add('cut'+st['ci']);await pg.screenshot(path=f'shots/win_{w}_cut_{st["ci"]}.png')
        if st['s']=='cut' and st['ct']>9 and ('cut2'+st['ci']) not in wins:
            wins.add('cut2'+st['ci']);await pg.screenshot(path=f'shots/win_{w}_cut2_{st["ci"]}.png')
        if st['done']:break
    await b.close();return st,errs,t
async def main():
    os.makedirs('shots',exist_ok=True)
    async with async_playwright() as pw:
        for i,(w,h) in enumerate(SIZES):
            st,errs,t=await run(pw,w,h,True)
            print(w,h,'time',t,'done',st['done'],'levels',json.dumps(st['st']['levels']),'badFeet',st['st']['badFeet'],'ground',st['st']['ground'],'minFps',st['st']['minFps'],'errs',errs[:3]+st['err'][:3],'log',st['log'],flush=True)
asyncio.run(main())
