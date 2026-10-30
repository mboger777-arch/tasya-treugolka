# трасса бота: python3 tools/trace.py 2-1 60  -> x,y,form каждые 0.5с
import asyncio,sys,os
from playwright.async_api import async_playwright
lv=sys.argv[1];dur=float(sys.argv[2]);sz=os.environ.get('SZ','844x390').split('x')
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':int(sz[0]),'height':int(sz[1])})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(f'http://localhost:8765/index.html?bot=1&seed=7&v=t&level={lv}&upto={lv}');t=0
    while t<dur:
      await asyncio.sleep(.5);t+=.5
      s=await pg.evaluate('P?[G.scene,(P.x/60).toFixed(1),(P.y/60).toFixed(1),P.form,P.ground?1:0,HUD.hearts,(G.log||[]).slice(-1)[0]||"",'+os.environ.get('EXP','0')+']:[G.scene]')
      print(t,*s,flush=True)
      if s[0]=='map':break
    if os.environ.get('SH'):await pg.screenshot(path=os.environ['SH'])
    print('errs',errs[:3]);await b.close()
asyncio.run(main())
