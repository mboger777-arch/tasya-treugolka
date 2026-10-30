// Миры 2–6: общие помощники, оформление, карта, сцены, полёт, бот-путь
var EX={},WX={};
(function(){
const INITS=[];WX.add=f=>INITS.push(f);
const wn=WX.wn=()=>L?+L.id[0]:1;
WX.bt=(x,y)=>taps.push({x:(x-CAM.x)*Z,y:(y-CAM.y)*Z});
WX.hexA=(c,a)=>{const n=parseInt(c.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
WX.once=(o,k,line)=>{if(!o['_'+k]){o['_'+k]=1;say(line)}};
WX.go=(tx,tol=12)=>{BOT.r=P.x<tx-tol;BOT.l=P.x>tx+tol;return Math.abs(P.x-tx)<=tol};
WX.botJump=(dt)=>{G.bj=(G.bj||0)-dt;BOT.j=G.bj>0};
// ---- оформление миров
const TH={1:{grass:'#5fae2e',h1:'rgba(120,190,90,.55)',h2:'rgba(90,160,70,.6)'},
 2:{grass:'#c9a46a',top:['#e0b45c',.75,0],dirt:['#b98a5a',.45,0],h1:'rgba(178,146,118,.5)',h2:'rgba(140,110,90,.62)'},
 3:{grass:'#e6b8d0',top:['#f29ccc',.7,.1],dirt:['#a493b0',.5,0],h1:'rgba(205,160,195,.45)',h2:'rgba(165,120,165,.55)'},
 4:{grass:'#ead39a',top:['#f2cf8a',.75,.1],dirt:['#d9b98a',.5,.05],h1:'rgba(60,130,180,.45)',h2:'rgba(40,100,150,.55)'},
 5:{grass:'#ece6ff',top:['#ece4ff',.8,.45],dirt:['#e6def8',.7,.35],h1:'rgba(255,255,255,.45)',h2:'rgba(228,222,255,.55)'},
 6:{grass:'#d77ae0',top:['#cf6ee8',.8,0],dirt:['#6a3a8a',.6,0],h1:'rgba(120,60,140,.5)',h2:'rgba(80,40,110,.6)'}};
const BASE={},TC={};
function recolor(im,[col,k,light]){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');
 x.drawImage(im,0,0);const c2=document.createElement('canvas');c2.width=im.width;c2.height=im.height;const y=c2.getContext('2d');y.drawImage(im,0,0);y.globalCompositeOperation='color';y.fillStyle=col;y.fillRect(0,0,c.width,c.height);
 if(light){y.globalCompositeOperation='screen';y.globalAlpha=light;y.fillStyle='#ffffff';y.fillRect(0,0,c.width,c.height);y.globalAlpha=1}
 y.globalCompositeOperation='destination-in';y.drawImage(im,0,0);x.globalAlpha=k;x.drawImage(c2,0,0);return c}
WX.theme=function(n){if(self.TERR)TERR.load(n);if(!BASE.top){BASE.top=IMG.tile_top;BASE.dirt=IMG.tile_dirt}const th=TH[n]||TH[1];WX.grass=th.grass;
 if(n==1||!th.top){IMG.tile_top=BASE.top;IMG.tile_dirt=BASE.dirt;return}
 try{IMG.tile_top=TC['t'+n]||(TC['t'+n]=recolor(BASE.top,th.top));IMG.tile_dirt=TC['d'+n]||(TC['d'+n]=recolor(BASE.dirt,th.dirt))}catch(e){IMG.tile_top=BASE.top;IMG.tile_dirt=BASE.dirt}};
WX.water=p=>{const w=L&&L.meta.water;if(!w)return false;return w===true||p.x<w*T};
WX.eimg=e=>{const n=wn();if(n<2)return null;const i=IMG['e_w'+n];if(!i||!i.width)return null;return ['e_w'+n,n==4?96:100,0]};
WX.onLoad=function(b){const n=wn();WX.theme(n);WX.path=b.meta.path?b.meta.path.map(q=>q.slice()):null;L.seen={};
 for(const e of ENTS)if(e.type=='enemy'&&(n==4||n==5||e.float)){e.gy=e.y;e.y0=e.y-34;e.fl=14}
 ENTS.push({type:'wx',x:-1e6,y:0});WX.boss=ENTS.find(e=>e.boss);
 if(b.meta.fly){G.fly={cx:0,cy:-10,s:b.meta.fly,lo:235,hi:560};P.form='kite';P.y=420;P.x=WV*.3;L.forms=[];HAND={k:'screen',bx:'jump',t:0}}
 if(L.meta.boss)G.mapW=n};
EX.wx={upd(o,dt){const p=P;
 if(WX.water(p)&&p.form!='bubble'&&p.y<230){p.y=230;p.vy=Math.max(0,p.vy)}
 if(p.spring>0)p.spring-=dt;
 if(p.ground){const [w]=dims(p);for(const x of [Math.floor((p.x-w/2+3)/T),Math.floor((p.x+w/2-3)/T)]){const ty=Math.round(p.y/T);if(tileAt(x,ty)==17&&!L.seen[ty*L.w+x]){L.seen[ty*L.w+x]=1;SFX.light(3);part(x*T+30,ty*T,10,'#cfefff',200,.6,0,6)}}}}};
// ---- фон
WX.init=function(){for(const f of INITS)f();
 MAPN.length=0;ORDER.length=0;for(let w=1;w<=6;w++){const ids=w==6?['6-1','6-2','6-B']:[w+'-1',w+'-2',w+'-3',w+'-4',w+'-B'];const ps=w==6?[[.2,.76],[.48,.64],[.78,.74]]:POS;ids.forEach((id,i)=>{ORDER.push(id);MAPN.push({id,w,x:ps[i][0],y:ps[i][1]})})}
 drawBG=function(){const n=wn();let bg=IMG['bg_w'+n]&&IMG['bg_w'+n].width?IMG['bg_w'+n]:IMG.bg_w1;if(bg.width&&self.FX&&FX.gbg)bg=FX.gbg(n,bg)||bg;const dy=(CAM.y-600+HV*L.gf);
  if(bg.width){const h=H*1.05,w=bg.width*h/bg.height;const off=CAM.x*.12,k0=Math.floor(off/w);for(let k=k0;k<k0+3;k++){const x=k*w-off;X.save();X.translate(x+(k%2?w:0),-dy*.05-20);if(k%2)X.scale(-1,1);X.drawImage(bg,0,0,w,h);X.restore()}}
  const th=TH[n]||TH[1];
  if(n==4){X.fillStyle='rgba(20,110,190,.32)';X.fillRect(0,0,W,H);X.save();X.globalAlpha=.16;X.fillStyle='#e8fbff';for(let i=0;i<5;i++){const x=((i*311-CAM.x*.2)%(W+300)+W+300)%(W+300)-150;X.beginPath();X.moveTo(x,0);X.lineTo(x+70,0);X.lineTo(x+220,H);X.lineTo(x+120,H);X.fill()}X.restore()}
  if(!(G.lowFx>=2))FX.back();
  X.fillStyle=th.h1;X.beginPath();X.moveTo(0,H);for(let x=0;x<=W+20;x+=20){const wx=x+CAM.x*.4;X.lineTo(x,H*.72-dy*.3+Math.sin(wx*.004)*40+Math.sin(wx*.011)*18)}X.lineTo(W,H);X.fill();
  X.fillStyle=th.h2;X.beginPath();X.moveTo(0,H);for(let x=0;x<=W+20;x+=20){const wx=x+CAM.x*.6;X.lineTo(x,H*.8-dy*.5+Math.sin(wx*.006+1)*30)}X.lineTo(W,H);X.fill();
  if(n==6&&WX.bg6)WX.bg6(dy);
  if(n==4){X.fillStyle='rgba(230,250,255,.55)';for(let i=0;i<14;i++){const x=((i*173-CAM.x*.3)%W+W)%W,y=H-((G.t*60+i*97)%H);X.beginPath();X.arc(x+Math.sin(G.t*2+i)*8,y,3+i%4,0,7);X.fill()}}};
 drawMap=WX.drawMap;mapTap=WX.mapTap};
// ---- тайлы 10..19
WX.drawTile=function(v,tx,ty){const x=tx*T,y=ty*T;
 if(v>=10&&v<=14){if(ty>0&&tileAt(tx,ty-1)==v)return;let n=0;while(tileAt(tx,ty+n)==v)n++;const sh=GATES[v],col=FORMS[GATEF[v]].col,cx=x+T/2,hh=n*T/2-6,cy=y+n*T/2;
  X.save();X.globalAlpha=.9;X.lineWidth=10;X.strokeStyle=col;X.fillStyle=WX.hexA(col,.26);X.shadowColor=col;X.shadowBlur=14;X.beginPath();
  if(sh=='tri'){X.moveTo(cx,cy-hh);X.lineTo(cx+hh*.95,cy+hh);X.lineTo(cx-hh*.95,cy+hh);X.closePath()}else if(sh=='sq')X.rect(cx-hh,cy-hh,hh*2,hh*2);else if(sh=='rect')X.rect(cx-hh*1.5,cy-hh*.8,hh*3,hh*1.6);else pathShape(sh,cx,cy,hh);
  X.fill();X.stroke();X.shadowBlur=0;X.globalAlpha=.5;X.fillStyle='#fff';for(let i=0;i<4;i++){const yy=cy-hh+((G.t*60+i*hh*.5)%(hh*2));X.fillRect(cx-6,yy,12,4)}X.globalAlpha=1;
  paintShape(sh,cx,y-34,28,col,0,false,20);X.restore();return}
 if(v==16){if(ty>0&&tileAt(tx,ty-1)==16)return;let n=0;while(tileAt(tx,ty+n)==16)n++;const h=n*T;X.save();const g=X.createLinearGradient(x,0,x+T,0);g.addColorStop(0,'#5b6f9a');g.addColorStop(.5,'#8ea3cf');g.addColorStop(1,'#46577e');X.fillStyle=g;X.beginPath();X.roundRect(x+2,y,T-4,h,8);X.fill();X.strokeStyle='#2d3756';X.lineWidth=4;X.stroke();
  X.fillStyle='#d7e4ff';for(let k=0;k<n*2;k++){X.beginPath();X.arc(x+10,y+15+k*T/2,4,0,7);X.arc(x+T-10,y+15+k*T/2,4,0,7);X.fill()}
  paintShape('sq',x+T/2,y+h/2,22,'#35c46a',0,false,12);X.restore();return}
 if(v==17){if(!L.seen[ty*L.w+tx])return;X.save();X.globalAlpha=.75;img('plank',x+T/2,y+46,46,0,1,.5,1);X.globalCompositeOperation='source-atop';X.fillStyle='rgba(170,220,255,.5)';X.fillRect(x,y,T,46);X.restore();return}
 if(v==18){X.save();const g=X.createLinearGradient(x,y,x,y+T);g.addColorStop(0,'#7ff0a2');g.addColorStop(1,'#1f8f4a');X.fillStyle=g;X.shadowColor='#7ff0a2';X.shadowBlur=12;X.beginPath();X.roundRect(x+1,y+1,T-2,T-2,8);X.fill();X.shadowBlur=0;X.strokeStyle='#145c30';X.lineWidth=3;X.stroke();X.fillStyle='rgba(255,255,255,.35)';X.fillRect(x+6,y+5,T-12,6);X.restore();return}
 if(v==19){X.save();const g=X.createLinearGradient(x,y,x+T,y+T);g.addColorStop(0,'#ffd35a');g.addColorStop(1,'#d98a0c');X.fillStyle=g;X.fillRect(x,y,T,T+.5);X.strokeStyle='rgba(140,70,0,.55)';X.lineWidth=3;
  for(const [hx,hy] of [[18,18],[44,34],[18,50]]){X.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;X.lineTo(x+hx+Math.cos(a)*12,y+hy+Math.sin(a)*12)}X.closePath();X.stroke()}
  if(tileAt(tx,ty-1)!=19){X.fillStyle='#ffe08a';X.beginPath();X.roundRect(x-2,y-6,T+4,14,6);X.fill();X.fillStyle='#f0a21a';X.beginPath();X.ellipse(x+20,y+12+Math.sin(G.t*2+tx)*3,5,9,0,0,7);X.fill()}X.restore();return}};
// ---- карта по мирам
const WNAME=['','Долина Колёс','Треугольные горы','Квадратный город','Подводный риф','Небесный храм','Замок Осколка'];
const WCOL=['','#ff8a1f','#5ec8ff','#35c46a','#2fc6b5','#c58cff','#e0448a'];
const POS=[[.14,.78],[.3,.66],[.46,.78],[.62,.66],[.8,.74]];
function curW(){const n=MAPN.find(n=>unlocked(n.id)&&!SAVE.done[n.id]&&LV[n.id]);let m=1;for(let w=1;w<=6;w++)if(LV[w+'-1'])m=w;return n?n.w:m}
function pageW(){if(!G.mapW)G.mapW=curW();return G.mapW}
function canW(w){return w>=1&&w<=6&&unlocked(w+'-1')&&!!LV[w+'-1']}
WX.drawMap=function(){const w=pageW();const m=w==1?IMG.map:IMG['bg_w'+w];if(m&&m.width){const s=Math.max(W/m.width,H/m.height);X.drawImage(m,(W-m.width*s)/2,(H-m.height*s)/2,m.width*s,m.height*s)}
 X.fillStyle=w==1?'rgba(20,10,40,.25)':'rgba(20,10,40,.38)';X.fillRect(0,0,W,H);txt('Мир '+w,W/2,40,40,'#fff');txt(WNAME[w],W/2,98,64,'#fff3a0');
 const ns=MAPN.filter(n=>n.w==w);X.strokeStyle='rgba(255,243,160,.8)';X.lineWidth=10;X.setLineDash([4,22]);X.lineCap='round';X.beginPath();ns.forEach((n,i)=>i?X.lineTo(n.x*W,n.y*H):X.moveTo(n.x*W,n.y*H));X.stroke();X.setLineDash([]);
 ns.forEach(n=>{const u=unlocked(n.id),d=SAVE.done[n.id],B=n.id.endsWith('B');const r=B?62:52;X.save();X.globalAlpha=u?1:.5;paintShape('circle',n.x*W,n.y*H,r+(u&&!d?Math.sin(G.t*4)*4:0),d?'#ffcc33':u?WCOL[w]:'#888888',0,false,u?20:0);
  txt(B?'Босс':n.id,n.x*W,n.y*H,B?34:40,'#fff');for(let s=0;s<3;s++)img('star',n.x*W-36+s*36,n.y*H+r+26,30,0,s<(SAVE.stars[n.id]||0)?1:.25,.5,.5);X.restore()});
 const cur=ns.find(n=>unlocked(n.id)&&!SAVE.done[n.id])||ns[ns.length-1];{const cx=cur.x*W,cy=cur.y*H,pr=.5+.5*Math.sin(G.t*3);X.save();X.strokeStyle='rgba(255,243,160,'+(.75-pr*.5)+')';X.lineWidth=5;X.beginPath();X.arc(cx,cy,62+pr*22,0,7);X.stroke();for(let i=0;i<5;i++){const a=G.t*1.4+i*1.2566;X.fillStyle='rgba(255,250,210,.85)';X.beginPath();X.arc(cx+Math.cos(a)*80,cy+Math.sin(a)*36-10,3.5,0,7);X.fill()}X.restore()}img('t_idle',cur.x*W,cur.y*H-50,150*(1+Math.sin(G.t*2.6)*.012));
 for(const [d,ax] of [[-1,70],[1,W-70]]){if(!canW(w+d))continue;X.save();const pr=1+Math.sin(G.t*4)*.06;X.translate(ax,H/2);X.scale(pr*d,pr);X.fillStyle='rgba(255,138,31,.95)';X.strokeStyle='#fff';X.lineWidth=6;X.beginPath();X.arc(0,0,52,0,7);X.fill();X.stroke();X.fillStyle='#fff';X.beginPath();X.moveTo(-14,-24);X.lineTo(22,0);X.lineTo(-14,24);X.closePath();X.fill();X.restore()}
 img('coin_circ',W-230,H-40,44,0,1,.5,.5);txt('× '+SAVE.shards,W-200,H-40,38,'#fff','left');
 if(IDLE>6){const nx=canW(w+1)&&cur==ns[ns.length-1]&&SAVE.done[cur.id];if(nx)hand(W-60,H/2+30,G.t,(G.t%1)>.6?(G.t%1-.6)/.4:0);else hand(cur.x*W+20,cur.y*H+30,G.t,(G.t%1)>.6?(G.t%1-.6)/.4:0)}};
WX.mapTap=function(p){IDLE=0;const w=pageW();for(const [d,ax] of [[-1,70],[1,W-70]])if(canW(w+d)&&Math.hypot(p.x-ax,p.y-H/2)<80){G.mapW=w+d;SFX.coin();return}
 for(const n of MAPN){if(n.w==w&&Math.hypot(p.x-n.x*W,p.y-n.y*H)<80&&unlocked(n.id)&&LV[n.id]){SFX.coin();loadLevel(n.id);return}}};
// ---- сцены-картинки
WX.cut=null;
WX.startCut=function(im,lines,next,fin){WX.cut={im,lines,next,fin,t:0};G.scene='cut';for(const k of lines)say(k)};
WX.afterWin=function(id){const w=+id[0];G.mapW=id.endsWith('B')&&w<6?w+1:w;if(id=='3-B')WX.startCut('kidnap',['tw1','tw2','tw3'],4);if(id=='6-B')WX.startCut('ending',['f4','end1','cr1'],6,1)};
WX.drawCut=function(){const c=WX.cut;if(!c)return;const m=IMG[c.im];if(m&&m.width){const s=Math.max(W/m.width,H/m.height),k=1+c.t*.006;X.save();X.translate(W/2,H/2);X.scale(k,k);X.drawImage(m,-m.width*s/2,-m.height*s/2,m.width*s,m.height*s);X.restore()}
 if(c.fin&&WX.drawFin)WX.drawFin(c);else if(c.fin&&c.t>3){X.save();X.globalAlpha=Math.min(1,(c.t-3)/1.5);txt('Конец',W/2,H*.2,120,'#fff3a0','center','#5b2a8a');X.restore()}
 if(WX.cutReady())txt(c.fin?'Нажми, чтобы вернуться на карту':'Нажми, чтобы продолжить',W/2,H*.08+10,36,'#fff')};
WX.cutReady=()=>{const c=WX.cut;return c&&c.t>2.5&&!speaking()&&!(SUB&&G.t<SUB.end-0.3)};
WX.updCut=function(dt){const c=WX.cut;if(!c){G.scene='map';return}c.t+=dt;const tp=taps.splice(0);if(WX.cutReady()&&(tp.length||G.bot&&c.t>(c.fin?16:3))){G.scene='map';G.mapW=c.next;WX.cut=null}};
// ---- камера в бою: и герой, и босс в кадре
WX.camX=function(cx){const o=WX.boss;if(!o||G.scene!='boss')return cx;return clamp((P.x+o.x)/2-WV/2,0,Math.max(0,L.w*T-WV))};
// ---- полёт (2-4)
WX.moveFly=function(p,dt){const F=G.fly,I=G.inputLock?{}:inp();p.form='kite';F.cx+=F.s*dt;p.x=F.cx+WV*.3;
 if(I.j)p.vy-=1800*dt;else p.vy+=1250*dt;p.vy=clamp(p.vy,-380,330);p.y+=p.vy*dt;if(p.y<F.lo){p.y=F.lo;p.vy=Math.max(0,p.vy)}if(p.y>F.hi){p.y=F.hi;p.vy=Math.min(0,p.vy)}
 p.ground=false;p.face=1;p.air=1;if(I.j)IDLE=0;if(p.x>L.w*T-WV*.75&&!G.won)win()};
// камера полёта: крупно, по вертикали между героем и следующим просветом
WX.flyCamY=function(){const p=P;let s=null;for(const o of ENTS)if(o.type=='spire'&&o.x+60>p.x&&(!s||o.x<s.x))s=o;const py=p.y-85,g=s?s.gc:py;const k=s?clamp(1-(s.x-p.x)/700,0,.6):0;const c=py*(1-k)+g*k;return clamp(c-HV*.5,-90,600-HV*L.gf)};
// ---- бот
WX.botPre=function(dt){const p=P;
 if(G.fly){let s=null;for(const o of ENTS)if(o.type=='spire'&&o.x+110>p.x&&(!s||o.x<s.x))s=o;const tgt=s?s.gc:400;const err=tgt-(p.y-85);const want=clamp(err*3.2,-360,330);BOT.r=0;BOT.j=want<p.vy;return true}
 if(WX.path&&WX.path.length){const q=WX.path[0];const tx=q[0]*T,ty=q[1]*T;
  if(tx-p.x<520&&tx-p.x>-200){if(q[2]&&!q[2]()){BOT.r=0;BOT.l=0;BOT.j=0;return true}if(p.ground&&Math.abs(p.y-ty)<3&&Math.abs(p.x-tx)<45){WX.path.shift();return true}
   if(p.ground){const up=ty<p.y-5;const d=Math.abs(tx-p.x);BOT.r=tx>p.x+8;BOT.l=tx<p.x-8;let gap=0;for(let x=Math.floor(Math.min(p.x,tx)/T);x<=Math.floor(Math.max(p.x,tx)/T);x++)if(!tileAt(x,Math.round(p.y/T))||tileAt(x,Math.round(p.y/T))==17&&!L.seen[Math.round(p.y/T)*L.w+x])gap=1;
    if((up&&d<(ty<p.y-150?120:170))||(gap&&!up&&ty<=p.y+5&&d<300&&d>60))G.bj=.4}
   else{BOT.r=tx>p.x+15;BOT.l=tx<p.x-15}
   G.bj=(G.bj||0)-dt;BOT.j=G.bj>0||(!p.ground&&p.vy<0);return true}}
 if(p.form=='kite'&&!G.inputLock){const gap=x=>{const tx=Math.floor(x/T);for(let y=Math.max(0,Math.ceil(p.y/T-.05));y<12;y++){const v=tileAt(tx,y);if(v&&v!=15&&v!=17)return false}return true};
  if(!p.ground){BOT.r=1;BOT.l=0;BOT.j=p.vy<-120||gap(p.x-20)||gap(p.x+40)||gap(p.x+90);return true}
  if(gap(p.x+60)||gap(p.x+110)){BOT.r=1;BOT.l=0;BOT.j=1;return true}}
 return false};
WX.gateAt=function(tx){for(let y=0;y<11;y++){const v=tileAt(tx,y);if(v>=10&&v<=14)return GATEF[v]}return null};
WX.botWant=function(want,fx,fy){const n=wn();if(want!=P.form)return want;
 if(L.forms.includes('kite')){let run=0,best=0;for(let k=0;k<9;k++){if(!tileAt(fx+k,10)&&!tileAt(fx+k,11)){run++;best=Math.max(best,run)}else run=0}if(best>=5)return 'kite'}
 if(WX.wantF)return WX.wantF(want,fx,fy)||want;return want};
})();
