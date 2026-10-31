# v16: «спидран» — бот проходит мир как можно быстрее, логируем голос: задержка старта реплики от события,
# реплики после конца уровня, наложение голосов. Использование: python3 tools/voicetest.py 1 2 3 4 5 6
import asyncio,sys,json,os
from playwright.async_api import async_playwright
URL='http://localhost:8765/index.html'
INIT='''(()=>{window.__va=0;window.__vmax=0;window.__vov=[];const pl=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(){if(!this.__h&&/assets\\/voice/.test(this.src)){this.__h=1;const on=()=>{if(this.__on)return;this.__on=1;window.__va++;if(window.__va>1)window.__vov.push([this.src.split('/').pop(),performance.now()]);window.__vmax=Math.max(window.__vmax,window.__va)};
const off=()=>{if(!this.__on)return;this.__on=0;window.__va--};this.addEventListener('playing',on);this.addEventListener('pause',off);this.addEventListener('ended',off)}return pl.call(this)}})()'''
async def world(pw,n):
    b=await pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg=await b.new_page(viewport={'width':915,'height':412},device_scale_factor=2,is_mobile=True,has_touch=True)
    await pg.add_init_script(INIT)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    last='B' if n<6 else 'B'
    q=f'?bot=1&seed=7&v=vt&all=1&level={n}-1&upto={n}-{last}'
    await pg.goto(URL+q);await pg.evaluate('localStorage.clear()');await pg.goto(URL+q)
    t=0
    while t<420:
        await asyncio.sleep(1);t+=1
        if await pg.evaluate('G.botDone'):break
    r=await pg.evaluate('({vlog:G.vlog,vmax:window.__vmax,vov:window.__vov,st:G.stats})')
    await b.close();return r,errs,t
import re
def vp(k):
    b=re.sub(r'^T(?=[a-z])','',k)
    if re.match(r'(n\d|c_|s_|r_good|r_star$|r_win|r_race|r_odd_ok|r_pat|r_asm|r_starf)',b):return 1
    return 2
def analyse(n,r):
    V=r['vlog'];played=[v for v in V if 'tsr' in v];drops=[v for v in V if 'drop' in v];cuts=[v for v in V if v.get('cut')]
    lat=[];late=[];waits=[];pend=-1e9
    for v in sorted(played,key=lambda v:v['tsr']):
        st=(v.get('tpr') or v['tsr']);w=max(0,(pend-v['tr'])/1000);pend=v.get('endr',st)
        if w>3 and v['p']==3:waits.append((v['k'],round(w,1)))
        if v.get('bi',0)!=0:continue  # следующая реплика той же пачки (интро/катсцена) — ждёт по сюжету
        d=(st-v['tr'])/1000-w  # задержка сверх ожидания конца предыдущей реплики
        lat.append(d)
        if d>.5:late.append((v['k'],round(d,2),v.get('wait')))
    # реплики уровня, начавшиеся после его конца (кроме финальной истории босса и r_win)
    stale=[];wins={};loads=[]
    for v in V:
        if v.get('ev')=='win':wins[v['lv']]=v['t']
        if v.get('ev')=='load':loads.append(v['t'])
    for v in played:
        tw=wins.get(v['lv'])
        if tw is not None and v['ts']>tw+.05 and v['p']!=2 and v['k'] not in('r_win',):stale.append(v['k'])
        nxt=[x for x in loads if x>v['te']]
        if nxt and v['ts']>min(nxt):stale.append('after-load:'+v['k'])
    lat.sort()
    p=lambda q:round(lat[min(len(lat)-1,int(q*len(lat)))],3) if lat else None
    return dict(world=n,played=len(played),events=len(lat),lat_med=p(.5),lat_p95=p(.95),lat_max=round(max(lat),3) if lat else None,
        late=late,dropped=len(drops),drop_kinds={k:sum(1 for d in drops if d['drop']==k) for k in set(d['drop'] for d in drops)},
        interrupted=[c['k']+'@'+str(c['at'])+'s:'+c['cut'] for c in cuts if 'at' in c],
        task_cuts=[c['k']+'@'+str(c['at'])+'s:'+c['cut'] for c in cuts if 'at' in c and c.get('p',vp(c['k']))>1],task_waits=waits,stale=stale,overlap_max=r['vmax'],overlaps=r['vov'][:5],levels=list(r['st']['levels'].keys()))
async def main():
    ws=[int(a) for a in sys.argv[1:]] or [1,2,3,4,5,6]
    async with async_playwright() as pw:
        for n in ws:
            r,errs,t=await world(pw,n);a=analyse(n,r);a['time']=t;a['errs']=errs[:3]
            os.makedirs('shots',exist_ok=True);json.dump(r['vlog'],open(f'shots/vlog_w{n}.json','w'))
            ok=a['lat_max'] is not None and a['lat_max']<.5 and not a['stale'] and a['overlap_max']<=1 and not a['task_cuts']
            print('PASS' if ok else 'FAIL',json.dumps(a,ensure_ascii=False),flush=True)
asyncio.run(main())
