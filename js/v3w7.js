// v3 Мир 7: Храм Мозаики — фигуры собираются из других фигур (между Небесным храмом и Замком)
(function(){
const near=(x,d=700)=>Math.abs(x-P.x)<d;
const tapAt=(x,y)=>taps.push({x:(x-CAM.x)*Z,y:(y-CAM.y)*Z});
const pulse=(k=4)=>.5+.5*Math.sin(G.t*k);
const sm=k=>{k=clamp(k,0,1);return k*k*(3-2*k)};
const big=()=>Math.max(52,58/Z);
const wall=(gx,v)=>{for(let y=0;y<=9;y++)setT(gx,y,v)};
const R3=Math.sqrt(3);
function path(v){X.beginPath();v.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath()}
const ell=(rx,ry,n=20)=>{const a=[];for(let i=0;i<n;i++){const t=i/n*Math.PI*2;a.push([Math.cos(t)*rx,Math.sin(t)*ry])}return a};
// кусочки (центр в 0,0), sym — поворот, после которого фигура та же
const PC={tri:{v:[[0,-69],[60,35],[-60,35]],sym:120},          // равносторонний (сторона 120)
 sq:{v:[[-60,-60],[60,-60],[60,60],[-60,60]],sym:90},
 ssq:{v:[[-30,-30],[30,-30],[30,30],[-30,30]],sym:90},          // маленький квадрат
 rt:{v:[[-60,-60],[60,60],[-60,60]],sym:360},                   // половинка квадрата
 rect:{v:[[-40,-70],[40,-70],[40,70],[-40,70]],sym:180},        // «почти квадрат»
 circ:{v:ell(34,34),sym:1},oval:{v:ell(48,30),sym:180},
 hex:{v:[0,1,2,3,4,5].map(k=>{const a=k*Math.PI/3;return[Math.cos(a)*60,Math.sin(a)*60]}),sym:60},
 stri:{v:[[0,-39],[34,20],[-34,20]],sym:120}};                  // маленький треугольник
const COL={hex:'#ffd34a',tri:'#ff8a5c',sq:'#5ec8ff',ssq:'#7ad97a',rt:'#ffc94a',rect:'#c58cff',circ:'#ff6fae',oval:'#ff6fae',stri:'#ffb04a'};
function shp(k,x,y,r,s,fill,a){const v=PC[k].v,c=Math.cos(r*Math.PI/180),n=Math.sin(r*Math.PI/180);
 path(v.map(q=>[x+(q[0]*c-q[1]*n)*s,y+(q[0]*n+q[1]*c)*s]));if(fill){X.globalAlpha=a??1;X.fillStyle=fill;X.fill();X.globalAlpha=1}}
const rmatch=(k,a,b)=>{const s=PC[k].sym;return s==1||((a-b)%s+s*9)%s==0};
// ===== мозаика: силуэт из слотов + лоток кусочков; тап по кусочку = повернуть/вставить =====
// o.S=[[k,dx,dy,r]...] слоты; o.C=[[k,r0]...] карточки; o.name; o.bridge=[x0,x1] — тайлы моста ряда 10 по мере сборки
EX.mosaic={setup(o){o.gx=o.bridge?o.bridge[0]:Math.floor(o.x/T)+(o.open||4);if(!o.boss)wall(o.gx,15);o.cx=o.cx||o.gx*T-170-(o.dx||0);o.cy=o.cy||250;o.fill=o.S.map(()=>-1);o.cr=o.C.map(c=>c[1]);o.used=o.C.map(()=>0);
  o.done=0;o.fly=[];o.sh=0;o.shi=-1;o.ft=0;o.rt=o.C.map(()=>0)},
 cards(o){const n=o.C.length,w=Math.min(190,760/n);return o.C.map((c,i)=>({k:c[0],x:o.cx-(n-1)*w/2+i*w,y:o.cy+250,i}))},
 top(o){return o.done?null:o.cy-150},
 free(o,k,r){return o.S.findIndex((s,j)=>o.fill[j]<0&&!o.fly.some(f=>f.j==j)&&s[0]==k&&(r==null||rmatch(k,s[3],r)))},
 upd(o,dt){if(o.sh>0)o.sh-=dt;o.rt=o.rt.map(v=>Math.max(0,v-dt*4));
  if(o.done){o.ft+=dt;return}
  if(!o.said&&near(o.cx,780)&&P.x<o.gx*T){o.said=1;if(o.k)say(o.k)}
  for(const f of o.fly){f.t+=dt*2.2;if(f.t>=1&&!f.ok){f.ok=1;o.fill[f.j]=f.i;SFX.light(2);part(o.cx+o.S[f.j][1],o.cy+o.S[f.j][2],12,'#fff3a0',260,.6,0,6)}}
  o.fly=o.fly.filter(f=>!f.ok);
  if(o.bridge){const n=o.fill.filter(v=>v>=0).length,[a,b]=o.bridge,m=Math.round((b-a+1)*n/o.S.length);for(let x=a;x<a+m;x++)if(!o.bt||!o.bt[x]){(o.bt=o.bt||{})[x]=1;setT(x,10,15);setT(x,11,15)}}
  if(o.fill.every(v=>v>=0)){o.done=1;o.ft=0;if(!o.boss)wall(o.gx,0);SFX.win();shake(6);hush();say(o.rk||'r_mos');part(o.cx,o.cy,40,'#fff3a0',520,1,0,10);HUD.got=(HUD.got||0)+1;if(o.cb)o.cb(o)}
  if(!o.boss&&P.x>o.gx*T-40){P.x=o.gx*T-40;P.vx=Math.min(P.vx,0)}},
 tap(o,wx,wy){if(o.done||!near(o.cx,WV))return false;const C=EX.mosaic.cards(o);for(const c of C){if(o.used[c.i]||Math.abs(wx-c.x)>85||Math.abs(wy-c.y)>85)continue;
   HAND=null;const k=c.k;if(EX.mosaic.free(o,k)<0){o.sh=.6;o.shi=c.i;SFX.no();hush();say(o.no||'r_mosno');return true}
   const j=EX.mosaic.free(o,k,o.cr[c.i]);if(j>=0){o.used[c.i]=1;o.fly.push({i:c.i,j,t:0,x:c.x,y:c.y})}
   else{o.cr[c.i]+=o.step||90;o.rt[c.i]=1;SFX.light(1);if(!o.rsaid){o.rsaid=1;say('r_mosrot')}
    const j2=EX.mosaic.free(o,k,o.cr[c.i]);if(j2>=0){o.used[c.i]=1;o.fly.push({i:c.i,j:j2,t:-.25,x:c.x,y:c.y})}}
   return true}return false},
 nextCard(o){const C=EX.mosaic.cards(o);return C.find(c=>!o.used[c.i]&&EX.mosaic.free(o,c.k)>=0)},
 hint(o){if(o.done||!near(o.cx,780)||(!o.boss&&P.x>o.gx*T))return;const c=EX.mosaic.nextCard(o);if(!c)return;const j=EX.mosaic.free(o,c.k);
  showHand([[c.x,c.y],[o.cx+o.S[j][1],o.cy+o.S[j][2]]],o.k||'t_mos',1);return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>560||P.x>o.gx*T+20)return;if(!o.boss)WX.go(o.cx-330,30);G.bt=(G.bt||0)+dt;
  if(G.bt>.9&&!o.fly.length&&!speaking()&&(o.boss||Math.abs(P.x-(o.cx-330))<90)){G.bt=0;const c=EX.mosaic.nextCard(o);if(c)tapAt(c.x,c.y)}return true},
 draw(o){if(o.cx<CAM.x-600||o.cx>CAM.x+WV+600)return;X.save();X.lineJoin='round';
  if(!o.done&&!o.bridge){const x=o.gx*T;X.fillStyle='rgba(150,210,255,.35)';X.fillRect(x+8,0,T-16,600);X.strokeStyle='rgba(255,255,255,.7)';X.lineWidth=3;for(let y=20;y<600;y+=60){X.beginPath();X.moveTo(x+8,y);X.lineTo(x+T-8,y+30);X.stroke()}}
  // силуэт: общий контур-тень, слоты пунктиром
  const sx=o.sh>0&&o.shi<0?Math.sin(o.sh*40)*6:0;
  o.S.forEach((s,j)=>{X.save();shp(s[0],o.cx+s[1]+sx,o.cy+s[2],s[3],o.sc||1,o.fill[j]<0?'rgba(40,20,70,.38)':null);X.restore()});
  if(!o.done&&o.lines!==0)o.S.forEach((s,j)=>{if(o.fill[j]>=0)return;X.save();X.setLineDash([10,8]);X.strokeStyle='rgba(255,255,255,'+(.55+.4*pulse(3))+')';X.lineWidth=4;shp(s[0],o.cx+s[1],o.cy+s[2],s[3],o.sc||1);X.stroke();X.restore()});
  o.S.forEach((s,j)=>{if(o.fill[j]<0)return;X.save();if(o.done){X.shadowColor='#fff3a0';X.shadowBlur=24}shp(s[0],o.cx+s[1],o.cy+s[2],s[3],o.sc||1,COL[s[0]]);X.strokeStyle='#3a1d55';X.lineWidth=5;X.stroke();X.restore()});
  if(o.done&&o.ft<2.5&&o.name)txt(o.name,o.cx,o.cy-170,big()*.8,'#fff3a0');
  if(!o.done){const C=EX.mosaic.cards(o);
   for(const f of o.fly){const s=o.S[f.j],k=sm(Math.max(0,f.t)),x=f.x+(o.cx+s[1]-f.x)*k,y=f.y+(o.cy+s[2]-f.y)*k-Math.sin(k*Math.PI)*80;X.save();shp(s[0],x,y,s[3],(.6+.4*k)*(o.sc||1),COL[s[0]]);X.strokeStyle='#3a1d55';X.lineWidth=5;X.stroke();X.restore()}
   C.forEach(c=>{if(o.used[c.i])return;let x=c.x;if(o.sh>0&&o.shi==c.i)x+=Math.sin(o.sh*40)*8;
    X.save();X.fillStyle='rgba(255,255,255,.88)';X.strokeStyle='#5a7ac8';X.lineWidth=5;X.beginPath();X.roundRect(x-78,c.y-78,156,156,22);X.fill();X.stroke();X.restore();
    const r=o.cr[c.i]-(o.rt[c.i]>0?(o.step||90)*o.rt[c.i]:0);X.save();shp(c.k,x,c.y,r,.6*(o.sc||1),COL[c.k]);X.strokeStyle='#3a1d55';X.lineWidth=4;X.stroke();X.restore();
    if(!rmatch(c.k,o.cr[c.i],o.cr[c.i])||PC[c.k].sym<360&&o.S.some(s=>s[0]==c.k)&&!o.S.some((s,j)=>s[0]==c.k&&o.fill[j]<0&&rmatch(c.k,s[3],o.cr[c.i]))){
     X.save();X.strokeStyle='#ffd34a';X.lineWidth=5;X.beginPath();X.arc(x+52,c.y-52,16,-2.6,1.6);X.stroke();X.restore()}});
   panelHide(o.cx-400,o.cy-160,800)}
  X.restore()}};
// ===== лампы-вещи: тёмная вещь, на панели Формика выбрать её фигуру =====
const THING={clock:['circ'],book:['rect'],pizza:['tri'],honey:['hex'],egg:['oval'],house:['sq','tri']};
function thing(k,x,y,lit){X.save();X.translate(x,y);X.lineJoin='round';X.lineWidth=6;X.strokeStyle='#3a1d55';
 const f=c=>lit?c:'#4a4560';if(lit){X.shadowColor='#fff3a0';X.shadowBlur=40}
 if(k=='clock'){X.beginPath();X.arc(0,0,70,0,7);X.fillStyle=f('#ffe7a8');X.fill();X.stroke();X.shadowBlur=0;X.beginPath();X.moveTo(0,0);X.lineTo(0,-48);X.moveTo(0,0);X.lineTo(34,10);X.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;X.beginPath();X.arc(Math.cos(a)*56,Math.sin(a)*56,4,0,7);X.fillStyle='#3a1d55';X.fill()}}
 else if(k=='book'){X.beginPath();X.roundRect(-50,-70,100,140,8);X.fillStyle=f('#ff7a6b');X.fill();X.stroke();X.shadowBlur=0;X.fillStyle=f('#fff3d6');X.fillRect(-32,-46,64,22)}
 else if(k=='pizza'){path([[0,70],[-62,-62],[62,-62]]);X.fillStyle=f('#ffc94a');X.fill();X.stroke();X.shadowBlur=0;X.fillStyle=f('#e0443e');for(const q of [[-20,-30],[18,-36],[0,10]]){X.beginPath();X.arc(q[0],q[1],11,0,7);X.fill()}X.fillStyle=f('#c9853a');X.fillRect(-64,-72,128,16)}
 else if(k=='honey'){shp('hex',0,0,0,1.1,f('#ffb300'));X.stroke();X.shadowBlur=0;shp('hex',0,0,0,.55,f('#ffd34a'));X.stroke()}
 else if(k=='egg'){X.beginPath();X.ellipse(0,0,50,72,0,0,7);X.fillStyle=f('#fff6e8');X.fill();X.stroke()}
 else if(k=='house'){shp('sq',0,25,0,1,f('#ff9a6b'));X.stroke();shp('tri',0,-70,0,1,f('#e0443e'));X.stroke();X.shadowBlur=0;X.fillStyle=f('#7fd3ff');X.fillRect(-18,10,36,36)}
 X.restore()}
EX.lamp={setup(o){o.gx=Math.floor(o.x/T)+4;wall(o.gx,15);o.cx=o.gx*T-170;o.cy=o.cy||240;o.need=THING[o.th].slice();o.got=[];o.done=0;o.sh=0;o.shi=-1;o.ft=0},
 cards(o){const n=o.B.length,w=170;return o.B.map((k,i)=>({k,x:o.cx-(n-1)*w/2+i*w,y:o.cy+260,i}))},
 top(o){return o.done?null:o.cy-150},
 upd(o,dt){if(o.sh>0)o.sh-=dt;if(o.done){o.ft+=dt;return}
  if(!o.said&&near(o.cx,780)&&P.x<o.gx*T){o.said=1;say(o.k||'t_lamp')}
  if(P.x>o.gx*T-40){P.x=o.gx*T-40;P.vx=Math.min(P.vx,0)}},
 tap(o,wx,wy){if(o.done||!near(o.cx,WV))return false;for(const c of EX.lamp.cards(o)){if(Math.abs(wx-c.x)>80||Math.abs(wy-c.y)>80)continue;HAND=null;
   if(o.need.includes(c.k)&&!o.got.includes(c.k)){o.got.push(c.k);SFX.light(2);part(c.x,c.y,14,'#fff3a0',300,.6,0,6);
    if(o.got.length>=o.need.length){o.done=1;o.ft=0;wall(o.gx,0);SFX.win();shake(5);hush();say(o.rk||'r_lamp');HUD.got=(HUD.got||0)+1}else{hush();say('r_lamp1')}}
   else if(!o.got.includes(c.k)){o.sh=.6;o.shi=c.i;SFX.no();hush();say('r_lampno')}return true}return false},
 hint(o){if(o.done||!near(o.cx,780)||P.x>o.gx*T)return;const c=EX.lamp.cards(o).find(c=>o.need.includes(c.k)&&!o.got.includes(c.k));showHand([[o.cx,o.cy],[c.x,c.y]],o.k||'t_lamp',1);return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>560||P.x>o.gx*T+20)return;WX.go(o.cx-330,30);G.bt=(G.bt||0)+dt;
  if(G.bt>1&&!speaking()&&Math.abs(P.x-(o.cx-330))<90){G.bt=0;const c=EX.lamp.cards(o).find(c=>o.need.includes(c.k)&&!o.got.includes(c.k));if(c)tapAt(c.x,c.y)}return true},
 draw(o){if(o.cx<CAM.x-900||o.cx>CAM.x+WV+600)return;X.save();
  if(!o.done){{const x0=o.gx*T-1100,g=X.createLinearGradient(x0,0,x0+260,0);g.addColorStop(0,'rgba(20,10,40,0)');g.addColorStop(1,'rgba(20,10,40,.5)');X.fillStyle=g;X.fillRect(x0,0,1100+T,600)}const x=o.gx*T;X.fillStyle='rgba(60,40,90,.8)';X.fillRect(x+8,0,T-16,600)}
  thing(o.th,o.cx,o.cy,o.done);
  if(o.done&&o.ft<2.5&&o.name)txt(o.name,o.cx,o.cy-130,big()*.75,'#fff3a0');
  if(!o.done){EX.lamp.cards(o).forEach(c=>{let x=c.x;if(o.sh>0&&o.shi==c.i)x+=Math.sin(o.sh*40)*8;const g=o.got.includes(c.k);
    X.save();X.fillStyle=g?'#fff3a0':'rgba(255,255,255,.9)';X.strokeStyle='#5a7ac8';X.lineWidth=5;X.beginPath();X.roundRect(x-72,c.y-72,144,144,22);X.fill();X.stroke();X.restore();
    X.save();shp(c.k,x,c.y,0,.55,COL[c.k]||'#7fd3ff');X.strokeStyle='#3a1d55';X.lineWidth=4;X.stroke();X.restore()});
   panelHide(o.cx-360,o.cy-150,720)}
  X.restore()}};
// ===== облака-фигуры: Сова называет фигуру; верное облако ложится мостом, другие лопаются =====
function cloud(x,y,w,a){X.save();X.globalAlpha=a;X.fillStyle='#fff';X.shadowColor='rgba(120,90,200,.35)';X.shadowBlur=14;for(const q of [[-.32,.1,.32],[0,-.1,.4],[.32,.1,.32]]){X.beginPath();X.arc(x+q[0]*w,y+q[1]*w,q[2]*w,0,7);X.fill()}X.restore()}
EX.scloud={setup(o){o.gx=o.br[0];wall(o.gx,15);o.cx=(o.br[0]+o.br[1]+1)*T/2;o.cy=o.cy||200;o.pop=o.O.map(()=>0);o.done=0;o.ft=0;o.sh=0;o.shi=-1;o.fl=0},
 pos(o){const n=o.O.length,w=Math.min(200,820/n);return o.O.map((c,i)=>({k:c[0],r:c[1],s:c[2],x:o.cx-(n-1)*w/2+i*w,y:o.cy+(i%2?60:0)+Math.sin(G.t*1.3+i)*8,i}))},
 top(o){return o.done?null:o.cy-110},
 upd(o,dt){if(o.sh>0)o.sh-=dt;o.pop=o.pop.map(v=>v>0&&v<1?Math.min(1,v+dt*3):v);
  if(o.fl>0&&o.fl<1){o.fl=Math.min(1,o.fl+dt*1.6);if(o.fl>=1){for(let x=o.br[0];x<=o.br[1];x++){setT(x,10,15);setT(x,11,15)}wall(o.gx,0);o.done=1;o.ft=0;SFX.win();hush();say(o.rk||'r_cloud');HUD.got=(HUD.got||0)+1}}
  if(o.done){o.ft+=dt;return}
  if(!o.said&&near(o.cx,820)&&P.x<o.gx*T){o.said=1;say(o.k)}
  if(P.x>o.gx*T-40){P.x=o.gx*T-40;P.vx=Math.min(P.vx,0)}},
 tap(o,wx,wy){if(o.done||o.fl>0||!near(o.cx,WV))return false;for(const c of EX.scloud.pos(o)){if(o.pop[c.i]||Math.hypot(wx-c.x,wy-c.y)>85)continue;HAND=null;
   if(c.i==o.want){o.fl=.01;SFX.light(3)}else{o.pop[c.i]=.01;SFX.no();part(c.x,c.y,16,'#ffffff',300,.6,0,8);hush();say('r_cloudno')}return true}return false},
 hint(o){if(o.done||o.fl>0||!near(o.cx,820)||P.x>o.gx*T)return;const c=EX.scloud.pos(o)[o.want];showHand([[c.x,c.y],[o.cx,600]],o.k,1);return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>700||P.x>o.gx*T+20)return;WX.go(o.gx*T-200,30);G.bt=(G.bt||0)+dt;
  if(G.bt>1.2&&!speaking()&&o.fl==0&&Math.abs(P.x-(o.gx*T-200))<90){G.bt=0;const c=EX.scloud.pos(o)[o.want];tapAt(c.x,c.y)}return true},
 draw(o){if(o.cx<CAM.x-700||o.cx>CAM.x+WV+700)return;X.save();X.lineJoin='round';
  EX.scloud.pos(o).forEach(c=>{let x=c.x,y=c.y,a=1-o.pop[c.i],sc=c.s;if(o.done){if(c.i==o.want)return;a*=Math.max(0,1-o.ft*1.5)}if(a<=0)return;if(c.i==o.want&&o.fl>0){const k=sm(o.fl);x+=(o.cx-x)*k;y+=(615-y)*k;sc=c.s+(1.6-c.s)*k}
   const w=150*sc*(1+o.pop[c.i]*.6);cloud(x,y,w,a);X.globalAlpha=a;shp(c.k,x,y,c.r,.55*sc,COL[c.k]||'#7fd3ff');X.strokeStyle='#3a1d55';X.lineWidth=4;X.stroke();X.globalAlpha=1});
  if(o.done)cloud(o.cx,615,(o.br[1]-o.br[0]+1)*T*.75,1);
  if(o.done&&o.ft<2.5&&o.name)txt(o.name,o.cx,o.cy-120,big()*.75,'#fff3a0');
  if(!o.done)panelHide(o.cx-420,o.cy-110,840);X.restore()}};
const HEX=[0,1,2,3,4,5].map(k=>{const a=(-90+60*k)*Math.PI/180;return['tri',Math.cos(a)*69.3,Math.sin(a)*69.3,k%2?0:180]});
const M={house:[['tri',0,-55,0],['sq',0,40,0]],rocket:[['tri',0,-95,0],['rect',0,10,0],['stri',-62,60,0],['stri',62,60,0]],
 tree:[['tri',0,-125,0],['tri',0,-60,0],['tri',0,5,0],['ssq',0,70,0]],sq2:[['rt',0,0,0],['rt',0,0,180]],sq4:[['ssq',-30,-30,0],['ssq',30,-30,0],['ssq',-30,30,0],['ssq',30,30,0]]};
WX.mos=M;
WX.add(()=>{
LV['7-1']=()=>{const b=new LB(160,'7-1');b.meta={name:'7-1 Домик из фигур',intro:['w7','l71'],forms:[]};b.g(0,160);
 b.e('mosaic',40,10,{S:M.house,C:[['rect',0],['sq',0],['tri',0]],name:'Домик!',k:'t_mos',rk:'r_house'});
 b.e('mosaic',85,10,{S:M.rocket,C:[['stri',0],['tri',0],['sq',0],['rect',0],['stri',0]],name:'Ракета!',k:'t_mos2',rk:'r_rocket'});
 b.e('mosaic',130,10,{S:M.tree,C:[['tri',0],['ssq',0],['tri',180],['tri',0]],step:60,name:'Ёлка!',k:'t_mosrot',rk:'r_tree'});
 b.coins(8,7,6,'coin_tri',2).coins(52,7,8,'coin_sq',2).coins(96,7,8,'coin_tri',2).coins(142,7,6,'coin_sq',2);
 b.e('enemy',20,10).e('enemy',62,10).e('enemy',110,10);
 b.e('star',30,6).e('star',75,5).e('star',118,6).e('goal',154,10);return b};
LV['7-3']=()=>{const b=new LB(176,'7-3');b.meta={name:'7-3 Облачный храм',intro:['l73'],forms:[]};
 b.g(0,40);b.g(46,84);b.g(90,128);b.g(134,176);
 b.e('scloud',40,10,{br:[40,45],O:[['sq',0,1],['tri',0,1],['circ',0,1]],want:1,k:'t_cl_tri',name:'Треугольник!'});
 b.e('scloud',84,10,{br:[84,89],O:[['tri',180,.8],['sq',45,1.1],['rect',0,.9],['circ',0,1]],want:1,k:'t_cl_sq',name:'Квадрат!'});
 b.e('scloud',128,10,{br:[128,133],O:[['circ',0,1],['oval',20,1],['hex',0,.9],['tri',90,1.2]],want:1,k:'t_cl_oval',name:'Овал!'});
 b.coins(8,7,6,'coin_tri',2).coins(52,7,8,'coin_sq',2).coins(96,7,8,'coin_circ',2).coins(140,7,8,'coin_circ',2);
 b.e('enemy',22,10).e('enemy',66,10).e('enemy',110,10).e('enemy',156,10);
 b.e('star',30,6).e('star',72,5).e('star',118,6).e('goal',170,10);return b};
LV['7-4']=()=>{const b=new LB(190,'7-4');b.meta={name:'7-4 Найди в вещах',intro:['l74'],forms:[]};b.g(0,190);
 b.e('lamp',36,10,{th:'clock',B:['sq','circ','tri'],name:'Часы — круг!',k:'t_lamp',rk:'r_clock'});
 b.e('lamp',72,10,{th:'pizza',B:['tri','sq','oval'],name:'Пицца — треугольник!',rk:'r_pizza'});
 b.e('lamp',108,10,{th:'book',B:['circ','rect','tri'],name:'Книга — прямоугольник!',rk:'r_book'});
 b.e('lamp',144,10,{th:'honey',B:['hex','circ','sq'],name:'Соты — шестиугольник!',rk:'r_honey'});
 b.e('lamp',176,10,{th:'house',B:['circ','sq','tri'],name:'Домик — квадрат и треугольник!',k:'t_lamp2',rk:'r_lhouse'});
 b.coins(8,7,6,'coin_circ',2).coins(48,7,8,'coin_tri',2).coins(118,7,8,'coin_sq',2);
 b.e('enemy',20,10).e('enemy',90,10).e('enemy',160,10);
 b.e('star',28,6).e('star',96,5).e('star',150,6).e('goal',186,10);return b};
LV['7-2']=()=>{const b=new LB(170,'7-2');b.meta={name:'7-2 Мозаика-мост',intro:['l72'],forms:[]};
 b.g(0,40);b.g(47,85);b.g(92,130);b.g(137,170);
 b.e('mosaic',40,10,{bridge:[40,46],S:HEX,C:[['tri',0],['tri',60],['tri',0],['tri',180],['tri',60],['tri',0]],step:60,cy:230,sc:.85,name:'Шестиугольник!',k:'t_hex',rk:'r_hex'});
 b.e('mosaic',85,10,{bridge:[85,91],S:M.sq2,C:[['rt',90],['rect',0],['rt',0]],cy:260,name:'Квадрат!',k:'t_sq2',rk:'r_sq2'});
 b.e('mosaic',130,10,{bridge:[130,136],S:M.sq4,C:[['ssq',0],['ssq',0],['stri',0],['ssq',0],['ssq',0]],lines:0,cy:260,name:'Тоже квадрат!',k:'t_sq4',rk:'r_sq4'});
 b.coins(8,7,6,'coin_tri',2).coins(55,7,8,'coin_sq',2).coins(100,7,8,'coin_tri',2).coins(145,7,8,'coin_sq',2);
 b.e('enemy',22,10).e('enemy',68,10).e('enemy',112,10).e('enemy',150,10);
 b.e('star',30,6).e('star',75,5).e('star',120,6).e('goal',164,10);return b};
});
})();
