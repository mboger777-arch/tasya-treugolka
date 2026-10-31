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
 stri:{v:[[0,-39],[34,20],[-34,20]],sym:120}};                  // маленький треугольник
const COL={tri:'#ff8a5c',sq:'#5ec8ff',ssq:'#7ad97a',rt:'#ffc94a',rect:'#c58cff',circ:'#ff6fae',oval:'#ff6fae',stri:'#ffb04a'};
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
