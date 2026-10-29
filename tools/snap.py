import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':844,'height':390},device_scale_factor=2)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        for i,q in enumerate(sys.argv[1:]):
            await pg.goto('http://localhost:8765/index.html?'+q);await asyncio.sleep(float(q.split('wait=')[1]) if 'wait=' in q else 3)
            await pg.screenshot(path=f'/tmp/t59s_{i}.png')
            print(q,await pg.evaluate('JSON.stringify({s:G.scene,log:G.log.slice(-4),err:G.errors,x:P&&P.x,y:P&&P.y,g:P&&P.ground})'))
        print(errs);await b.close()
asyncio.run(main())
