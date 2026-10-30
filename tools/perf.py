# fps на «телефоне» (CPU-троттлинг через CDP), с адаптивным качеством и без
import asyncio,os,json
from playwright.async_api import async_playwright
URL=os.environ.get('URL','http://localhost:8765/index.html')
async def run(b,lv,extra,thr,w=915,h=412,d=2.625,secs=12):
    ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=d,is_mobile=True,has_touch=True);pg=await ctx.new_page()
    cdp=await ctx.new_cdp_session(pg)
    if thr>1:await cdp.send('Emulation.setCPUThrottlingRate',{'rate':thr})
    await pg.goto(URL+f'?bot=1&seed=7&all=1&level={lv}&upto={lv}'+extra);fp=[]
    for i in range(secs):
        await asyncio.sleep(1);fp.append(round(await pg.evaluate('G.scene=="play"||G.scene=="boss"?G.fps:0')))
    v=await pg.evaluate('({dpr:DPR,low:G.lowFx,bw:C.width})');await ctx.close();return fp,v
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch()
        for cfg in os.environ.get('CFG','6-1|&fx=0|1,6-1||1').split(','):
            lv,ex,thr=cfg.split('|');fp,v=await run(b,lv,ex,float(thr));print(cfg,fp,v,flush=True)
        await b.close()
asyncio.run(main())
