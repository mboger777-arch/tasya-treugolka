// v3 Мир 2: Треугольные горы — ломаная и углы, ветер вершин, «все треугольники», полёт сквозь треугольные дырочки
(function(){
const near=(x,d=700)=>Math.abs(x-P.x)<d;
const tapAt=(x,y)=>taps.push({x:(x-CAM.x)*Z,y:(y-CAM.y)*Z});
const pulse=(k=4)=>.5+.5*Math.sin(G.t*k);
const once=k=>{L.said=L.said||{};if(L.said[k])return false;L.said[k]=1;return true};
const showHand=(s,k,d)=>WX.showHand(s,k,d);
// рисуем «задник» (горы) до тайлов
WX.preTiles=function(){for(const o of ENTS){const x=EX[o.type];if(x&&x.back&&Math.abs(o.x-CAM.x-WV/2)<WV*1.6)x.back(o)}};
WX.STK.push(['sign','stk_sign','2-1'],['pizza','stk_pizza','2-2'],['hanger','stk_hanger','2-3'],['sail','stk_sail','2-4']);
function angAt(p0,p1,p2){const ax=p0.x-p1.x,ay=p0.y-p1.y,bx=p2.x-p1.x,by=p2.y-p1.y;return Math.acos(clamp((ax*bx+ay*by)/Math.hypot(ax,ay)/Math.hypot(bx,by),-1,1))*180/Math.PI}
function angArc(p0,p1,p2,an){const a1=Math.atan2(p0.y-p1.y,p0.x-p1.x),a2=Math.atan2(p2.y-p1.y,p2.x-p1.x);let d=a2-a1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
 X.save();const c=an<88?'#ff7a59':an>92?'#59c2ff':'#7bd66b';X.fillStyle=c;X.globalAlpha=.55;X.beginPath();X.moveTo(p1.x,p1.y);X.arc(p1.x,p1.y,40,a1,a1+d,d<0);X.closePath();X.fill();X.globalAlpha=1;X.strokeStyle='#fff';X.lineWidth=4;X.beginPath();X.arc(p1.x,p1.y,40,a1,a1+d,d<0);X.stroke();X.restore()}
// ===== ломаная: точки по порядку → ступеньки-склоны; close → треугольник и Камень Формы =====
const putT=(c,r,v)=>{if(r>=0&&r<12&&!tileAt(c,r))setT(c,r,v)};
function layPoly(a,b){const dx=b.c-a.c;if(dx<=0)return;const h=c=>Math.round(a.r+(b.r-a.r)*(c-a.c)/dx);
 for(let c=a.c;c<b.c;c++){const d=h(c+1)-h(c);if(d==0)putT(c,h(c),2);else if(d==-1)putT(c,h(c+1),5);else if(d==1)putT(c,h(c),6);else if(d<0)putT(c,h(c+1),2);else putT(c,h(c),2)}}
// поверхность ломаной: по построенным отрезкам можно ходить
WX.surf=function(p,oy,was){for(const o of ENTS){if(o.type!='poly'||o.close||!o.k)continue;for(let i=0;i<o.k&&i<o.ns;i++){const a=o.P[i],b=o.P[i+1];if(p.x<a.x-2||p.x>b.x+2)continue;const sl=(b.y-a.y)/(b.x-a.x),sy=a.y+sl*(clamp(p.x,a.x,b.x)-a.x);
  const tol=was?24+Math.abs(sl)*Math.abs(p.vx)*.04:0,syo=sy+(p.y-oy)*0;if(p.y>=sy-tol&&oy<=sy+6+Math.abs(sl)*Math.abs(p.vx)*.04){p.y=sy;return true}}}return false};
EX.poly={setup(o){o.P=o.pts.map(q=>({c:q[0],r:q[1],x:q[0]*T,y:q[1]*T-4}));o.ns=o.close?o.P.length:o.P.length-1;o.k=0;o.on=0;o.g=1;o.done=0;o.nc=1;o.ang=[];o.x0=Math.min(...o.P.map(q=>q.x));o.x1=Math.max(...o.P.map(q=>q.x))},
 nxt(o){return o.on?(o.k+1)%o.P.length:0},
 upd(o,dt){if(o.g<1)o.g=Math.min(1,o.g+dt*3);if(o.wob>0)o.wob-=dt;if(!o.intro&&!o.done&&P.x>o.x0-560&&P.x<o.x1){o.intro=1;EX.poly.hint(o,1)}},
 top(o){return o.done||!near(o.x0,900)?null:Math.min(...o.P.map(q=>q.y))-80},
 tap(o,wx,wy){if(o.done)return false;let best=-1,bd=110;o.P.forEach((q,i)=>{const d=Math.hypot(wx-q.x,wy-q.y);if(d<bd){bd=d;best=i}});if(best<0)return false;
  const n=EX.poly.nxt(o);if(best!=n){if(o.on&&best==o.k)return true;SFX.no();o.wob=.4;EX.poly.hint(o,1);return true}
  if(!o.on){o.on=1;SFX.light(1);part(o.P[0].x,o.P[0].y,12,'#fff3a0',240,.5,0);return true}
  EX.poly.build(o,o.k);return true},
 build(o,i){const n=o.P.length,a=o.P[i],b=o.P[(i+1)%n];o.k++;o.g=0;SFX.light(Math.min(3,o.k));part((a.x+b.x)/2,(a.y+b.y)/2,24,'#fff3a0',360,.8,0,8);HAND=null;
  let said=0;if(i>=1&&!o.close){const an=angAt(o.P[i-1],a,b);o.ang[i]=an;const k=an<88?'r_acute':an>92?'r_obtuse':0;if(k&&once(k)){say(k);said=1}}
  if(o.k>=o.ns){o.done=1;if(o.close){for(let j=0;j<n;j++)o.ang[j]=angAt(o.P[(j+n-1)%n],o.P[j],o.P[(j+1)%n]);SFX.win();say('n3');say('r_close');part((o.P[0].x+o.P[1].x+o.P[2].x)/3,(o.P[0].y+o.P[1].y+o.P[2].y)/3,40,'#ffe36b',480,1,0,10);
    if(o.stone){const s={type:'stone',x:o.stone*T+T/2,y:o.srow*T,shape:'tri',give:'kite'};setupStone(s);ENTS.push(s);part(s.x,s.y-200,40,'#c8a8ff',420,1,0,10)}}
   else if(!said&&once('poly'))say('r_poly')}
  else if(!said)say('n'+o.k)},
 hint(o,force){if(o.done||(!force&&!near(o.x0,800)))return;const n=EX.poly.nxt(o),q=o.P[n];const seq=o.on?[[o.P[o.k].x,o.P[o.k].y],[q.x,q.y]]:[[q.x,q.y],[o.P[1].x,o.P[1].y]];showHand(seq,o.close?'t_close':'t_poly');return true},
 draw(o){const n=o.P.length;X.save();X.lineCap='round';X.lineJoin='round';
  if(o.done&&o.close){X.fillStyle='rgba(255,220,90,'+(.22+pulse(3)*.1)+')';X.beginPath();o.P.forEach((q,i)=>i?X.lineTo(q.x,q.y):X.moveTo(q.x,q.y));X.closePath();X.fill()}
  for(let i=0;i<o.ns;i++){const a=o.P[i],b=o.P[(i+1)%n];if(i<o.k){const g=i==o.k-1?o.g:1;const ex=a.x+(b.x-a.x)*g,ey=a.y+(b.y-a.y)*g;if(!o.close){X.strokeStyle='#5a3a1c';X.lineWidth=26;X.beginPath();X.moveTo(a.x,a.y+10);X.lineTo(ex,ey+10);X.stroke();X.strokeStyle='#c98a3a';X.lineWidth=18;X.beginPath();X.moveTo(a.x,a.y+10);X.lineTo(ex,ey+10);X.stroke()}X.shadowColor='#ffe680';X.shadowBlur=20;X.strokeStyle='#ffcc33';X.lineWidth=14;X.beginPath();X.moveTo(a.x,a.y);X.lineTo(a.x+(b.x-a.x)*g,a.y+(b.y-a.y)*g);X.stroke();X.shadowBlur=0;X.strokeStyle='#fff8d0';X.lineWidth=4;X.beginPath();X.moveTo(a.x,a.y-2);X.lineTo(a.x+(b.x-a.x)*g,a.y+(b.y-a.y)*g-2);X.stroke()}
   else{X.setLineDash([6,18]);X.strokeStyle='rgba(255,243,160,'+(.22+pulse(3)*.25)+')';X.lineWidth=6;X.beginPath();X.moveTo(a.x,a.y);X.lineTo(b.x,b.y);X.stroke();X.setLineDash([])}}
  X.restore();for(let i=0;i<n;i++){const an=o.ang[i];if(an!=null)angArc(o.P[(i+n-1)%n],o.P[i],o.P[(i+1)%n],an)}
  const nx=o.done?-1:EX.poly.nxt(o);o.P.forEach((q,i)=>{const on=o.done||(o.on&&i<=o.k)||(o.close&&o.on&&i==0);WX.glowDot(q.x+(o.wob>0&&i==nx?Math.sin(o.wob*50)*5:0),q.y,i==nx?17:14,'#ffcc33',on);
   if(!o.done&&o.P.length>2)txt(''+(i+1),q.x,q.y-44,30,'#fff3a0')})},
 bot(o,dt){if(o.done||P.x<o.x0-650||P.x>o.x1)return;BOT.j=0;WX.go((o.stand!=null?o.stand*T:o.x0-60),16);G.bt3=(G.bt3||0)+dt;if(G.bt3<.55)return true;G.bt3=0;const q=o.P[EX.poly.nxt(o)];tapAt(q.x,q.y);return true}};
// ===== вершина-гора и её ветер: острая — узкий сильный, тупая — широкий тихий =====
EX.peak={setup(o){o.ay=o.y-(o.dy!=null?o.dy:3.5)*T;o.op=o.kind=='obtuse'?1:0;o.to=o.op;o.nc=1;o.ceil=o.ceil!=null?o.ceil*T:null},
 W(o){return {w:lerp(2.4*T,o.ww||12*T,o.op),top:lerp(o.atop!=null?o.atop:50,o.otop||4.5*T,o.op),acc:lerp(5600,4100,o.op),vm:lerp(860,330,o.op)}},
 upd(o,dt){o.op+=(o.to-o.op)*Math.min(1,dt*2.5);const p=P,w=EX.peak.W(o);
  if(!o.intro&&p.x>o.x-620&&p.x<o.x){o.intro=1;if(o.open)EX.peak.hint(o,1);else if(o.k)say(o.k)}
  if(p.form=='kite'&&Math.abs(p.x-o.x)<w.w/2+16&&p.y>w.top&&p.y<o.ay+520){p.vy=Math.max(-w.vm,p.vy-w.acc*dt);if(p.ground){p.ground=false;p.vy=-w.vm*.7}}
  if(o.ceil!=null&&Math.abs(p.x-o.x)<(o.cw||10*T)&&p.y-125<o.ceil+40&&p.vy<=0){p.vy=320;if(p.inv<=0){p.inv=.8;SFX.bump?SFX.bump():SFX.no();shake(4)}part(p.x,o.ceil+40,14,'#bfefff',300,.5,0);if(o.open&&o.to==0)EX.peak.hint(o,1)}},
 tap(o,wx,wy){if(!o.open||o.to==1)return false;if(Math.hypot(wx-o.x,wy-o.ay-40)<150){o.to=1;SFX.win();say('r_open');part(o.x,o.ay,36,'#bfefff',420,.9,0,9);HAND=null;return true}return false},
 hint(o,force){if(!force&&!near(o.x,800))return;if(o.open&&o.to==0){showHand([[o.x,o.ay+20]],'t_open');return true}
  if(P.form!='kite'&&L.forms.includes('kite')){HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say('t_wind');return true}},
 hw(o){return Math.tan(lerp(20,60,o.op)*Math.PI/180)},
 back(o){const hw=EX.peak.hw(o),H=1000,x0=o.x-hw*H,x1=o.x+hw*H,b=o.ay+H;X.save();
  const g=X.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#d9b48a');g.addColorStop(.49,'#b08560');g.addColorStop(.51,'#7c5a3e');g.addColorStop(1,'#5a3f2a');X.fillStyle=g;X.strokeStyle='#3e2a1a';X.lineWidth=8;X.lineJoin='round';
  X.beginPath();X.moveTo(x0,b);X.lineTo(o.x,o.ay);X.lineTo(x1,b);X.closePath();X.fill();X.stroke();
  // каменные прожилки (детерминированно)
  X.strokeStyle='rgba(62,42,26,.35)';X.lineWidth=5;for(let i=1;i<7;i++){const d=i*130,yy=o.ay+d;X.beginPath();X.moveTo(o.x-hw*d*.85,yy+((i*37)%20));X.lineTo(o.x-hw*d*.35,yy-18);X.moveTo(o.x+hw*d*.3,yy+12);X.lineTo(o.x+hw*d*.8,yy-((i*23)%18));X.stroke()}
  const k=150;X.fillStyle='#f6fbff';X.strokeStyle='#9cc7e0';X.lineWidth=4;X.beginPath();X.moveTo(o.x,o.ay);X.lineTo(o.x-hw*k,o.ay+k);for(let i=1;i<4;i++)X.lineTo(o.x-hw*k+i*hw*k*2/4,o.ay+k*(i%2?.72:1.08));X.lineTo(o.x+hw*k,o.ay+k);X.closePath();X.fill();X.stroke();X.restore()},
 draw(o){const w=EX.peak.W(o),hw=EX.peak.hw(o);X.save();
  // уголок у вершины
  const r=96,a0=Math.PI/2+Math.atan(hw);X.fillStyle=o.op<.5?'rgba(255,122,89,.7)':'rgba(89,194,255,.7)';X.beginPath();X.moveTo(o.x,o.ay);X.arc(o.x,o.ay,r,Math.PI-a0+Math.PI,a0+Math.PI,true);X.closePath();
  X.beginPath();X.moveTo(o.x,o.ay);X.arc(o.x,o.ay,r,Math.PI/2-Math.atan(hw),Math.PI/2+Math.atan(hw));X.closePath();X.fill();X.strokeStyle='#fff';X.lineWidth=4;X.beginPath();X.arc(o.x,o.ay,r,Math.PI/2-Math.atan(hw),Math.PI/2+Math.atan(hw));X.stroke();
  if(o.open&&o.to==0)WX.glowDot(o.x,o.ay+4,14,'#bfefff',0);
  // струи ветра
  const n=Math.round(lerp(5,16,o.op)),h=o.ay-w.top;for(let i=0;i<n;i++){const x=o.x-w.w/2+((i*37+11)%Math.max(1,w.w));const y=o.ay-((G.t*lerp(620,260,o.op)+i*97)%h);X.globalAlpha=.9*Math.sin(Math.PI*(o.ay-y)/h);X.strokeStyle='#ffffff';X.lineWidth=lerp(9,5,o.op);X.lineCap='round';X.lineJoin='round';const L2=lerp(130,60,o.op);X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+16*Math.sin(G.t*3+i),y-L2*.4,x,y-L2);X.stroke();const ah=lerp(16,10,o.op);X.beginPath();X.moveTo(x-ah,y-L2+ah);X.lineTo(x,y-L2);X.lineTo(x+ah,y-L2+ah);X.stroke()}
  X.globalAlpha=lerp(.34,.2,o.op);const gr=X.createLinearGradient(0,o.ay,0,w.top);gr.addColorStop(0,'#bfefff');gr.addColorStop(1,'rgba(191,239,255,0)');X.fillStyle=gr;X.fillRect(o.x-w.w/2,w.top,w.w,o.ay-w.top);X.restore();
  if(o.ceil!=null){X.save();for(let x=o.x-(o.cw||10*T);x<o.x+(o.cw||10*T);x+=46){const hh=26+((x*7)%23);X.fillStyle='#9fe3ff';X.strokeStyle='#3f7fb0';X.lineWidth=3;X.beginPath();X.moveTo(x,o.ceil);X.lineTo(x+14,o.ceil+hh+14);X.lineTo(x+28,o.ceil);X.closePath();X.fill();X.stroke()}X.restore()}},
 bot(o,dt){const p=P;if(p.x<Math.min(o.x-560,o.stand!=null&&o.to==0?o.stand*T-500:1e9)||p.x>o.lx*T+40)return;const w=EX.peak.W(o);
  if(o.open&&o.to==0){if(p.form!='kite'||p.ground)WX.go(o.stand!=null?o.stand*T:o.x-T*9,14);BOT.j=0;G.bt3=(G.bt3||0)+dt;if(G.bt3>.6&&p.ground){G.bt3=0;tapAt(o.x,o.ay+20)}return true}
  if(p.form!='kite'){BOT.r=0;if(p.ground&&(!G.bpf||G.t-G.bpf>.7)){G.bpf=G.t;BOT.f=1}return true}
  const ly=o.lrow*T;if(o.op>.5){BOT.r=1;BOT.j=!p.ground||p.x>o.x-w.w/2-90;return true}
  if(p.y>ly-40&&p.x<o.lx*T-20){WX.go(o.x,10);BOT.j=1;return true}BOT.r=1;BOT.j=1;return true}};
// ===== ворота «только треугольники» и карточки-фигуры =====
const SH={tri:[[0,-1],[.95,.7],[-.95,.7]],thin:[[0,-1.3],[.38,.9],[-.38,.9]],flat:[[-.3,-.42],[1.3,.5],[-1.3,.5]],inv:[[-.95,-.7],[.95,-.7],[0,1]],rot:[[-.95,-.75],[1,-.15],[-.25,1]],
 quad:[[-.8,-.8],[.8,-.8],[.8,.8],[-.8,.8]],gap:[[0,-1],[.95,.7],[-.95,.7]],curve:[[0,-1],[.95,.7],[-.95,.7]],circle:null};
const GOOD={tri:1,thin:1,flat:1,inv:1,rot:1};
function drawCard(kind,x,y,r,glow){X.save();X.translate(x,y);X.fillStyle='rgba(255,255,255,.18)';X.strokeStyle='rgba(255,243,160,'+(glow?.9:.45)+')';X.lineWidth=4;X.beginPath();X.arc(0,0,r*1.45,0,7);X.fill();X.stroke();
 const g=X.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#ffe58a');g.addColorStop(1,'#f0a830');X.fillStyle=g;X.strokeStyle='#7a4a12';X.lineWidth=7;X.lineJoin='round';X.lineCap='round';
 if(kind=='circle'){X.beginPath();X.arc(0,0,r*.9,0,7);X.fill();X.stroke();X.restore();return}
 const s=SH[kind];X.beginPath();
 if(kind=='curve'){X.moveTo(s[0][0]*r,s[0][1]*r);X.lineTo(s[1][0]*r,s[1][1]*r);X.lineTo(s[2][0]*r,s[2][1]*r);X.quadraticCurveTo(-1.05*r,-.5*r,s[0][0]*r,s[0][1]*r);X.fill();X.stroke()}
 else if(kind=='gap'){X.moveTo(-.16*r,-.78*r);X.lineTo(s[2][0]*r,s[2][1]*r);X.lineTo(s[1][0]*r,s[1][1]*r);X.lineTo(.16*r,-.78*r);X.fillStyle='rgba(255,229,138,.55)';X.fill();X.stroke()}
 else{s.forEach((q,i)=>i?X.lineTo(q[0]*r,q[1]*r):X.moveTo(q[0]*r,q[1]*r));X.closePath();X.fill();X.stroke()}
 X.restore()}
EX.tgate={setup(o){o.gx=Math.round(o.x/T-.5);o.top=o.top!=null?o.top:0;for(let y=o.top;y<10;y++)setT(o.gx,y,1);o.got=0;o.lift=0;o.open=0;o.nc=1;
  const n=o.cards.length;o.C=o.cards.map((k,i)=>({k,x0:o.gx*T-150-(n-1-i)*128,y0:o.cy||330,x:0,y:0,f:-1,wob:0,ph:i*1.3}));o.C.forEach(c=>{c.x=c.x0;c.y=c.y0})},
 upd(o,dt){if(!o.intro&&P.x>o.gx*T-760&&P.x<o.gx*T){o.intro=1;EX.tgate.hint(o,1)}
  for(const c of o.C){if(c.wob>0)c.wob-=dt;if(c.f>=0&&c.f<1){c.f=Math.min(1,c.f+dt*1.8);const e=c.f*c.f*(3-2*c.f),tx=o.gx*T+T/2,ty=o.top*T+Math.min(200,(10-o.top)*T*.35);c.x=lerp(c.x0,tx,e);c.y=lerp(c.y0,ty,e)-Math.sin(c.f*Math.PI)*120;
    if(c.f>=1){o.got++;SFX.light(o.got);part(c.x,c.y,22,'#fff3a0',360,.7,0);if(o.got>=o.need){o.open=1;SFX.win();shake(6);say('r_tg')}else{const sp=c.k=='inv'?'r_inv':(c.k!='tri'?'r_odd3':0);if(sp&&once(sp))say(sp);else say('n'+o.got)}}}}
  if(o.open&&o.lift<1){o.lift=Math.min(1,o.lift+dt*1.2);if(o.lift>=1)for(let y=o.top;y<10;y++)setT(o.gx,y,0)}},
 tap(o,wx,wy){if(o.open)return false;for(const c of o.C){if(c.f>=0)continue;const bob=Math.sin(G.t*2+c.ph)*8;if(Math.hypot(wx-c.x,wy-c.y-bob)<88){
   if(GOOD[c.k]&&o.got+o.C.filter(q=>q.f>=0&&q.f<1).length<o.need){c.f=0;SFX.light(2);HAND=null}else if(GOOD[c.k]){c.wob=.3}else{c.wob=.6;SFX.no();say(c.k=='curve'?'t_ncurve':c.k=='gap'?'t_ngap':c.k=='quad'?'t_nquad':'c_circ')}return true}}return false},
 hint(o,force){if(o.open||(!force&&!near(o.gx*T,900)))return;const c=o.C.find(c=>c.f<0&&GOOD[c.k]);if(!c)return;showHand([[c.x,c.y],[o.gx*T+T/2,o.top*T+150]],o.k||'t_tg',1);return true},
 top(o){return o.open||!near(o.gx*T,1000)?null:(o.cy||330)-110},
 draw(o){const gx=o.gx*T,top=o.top*T,h=600-top,lift=o.lift*h*.95;X.save();X.beginPath();X.rect(gx-40,-400,T+80,1000);X.clip();
  const g=X.createLinearGradient(gx-14,0,gx+T+14,0);g.addColorStop(0,'#b9a58c');g.addColorStop(.5,'#9a8670');g.addColorStop(1,'#6e5d4b');X.fillStyle=g;X.strokeStyle='#4a3a2a';X.lineWidth=6;X.fillRect(gx-14,top-lift,T+28,h);X.strokeRect(gx-14,top-lift,T+28,h);
  // эмблема-треугольник с огоньками
  const ey=top-lift+Math.min(200,h*.35);X.save();X.translate(gx+T/2,ey);X.strokeStyle='#fff3a0';X.lineWidth=5;X.shadowColor='#fff3a0';X.shadowBlur=o.open?24:8;X.beginPath();X.moveTo(0,-36);X.lineTo(32,24);X.lineTo(-32,24);X.closePath();X.stroke();X.restore();
  for(let i=0;i<o.need;i++){const lit=i<o.got;X.fillStyle=lit?'#ffe36b':'rgba(60,40,30,.6)';X.beginPath();X.arc(gx+T/2,ey+64+i*40,12,0,7);X.fill();X.strokeStyle='#fff';X.lineWidth=3;X.stroke()}X.restore();
  if(!o.open)for(const c of o.C){if(c.f>=1)continue;const bob=c.f<0?Math.sin(G.t*2+c.ph)*8:0,wx=c.wob>0?Math.sin(c.wob*40)*10:0;drawCard(c.k,c.x+wx,c.y+bob,46,c.f>=0)}},
 bot(o,dt){if(o.open||P.x>o.gx*T||P.x<o.gx*T-900)return;BOT.j=0;WX.go(o.gx*T-200,20);G.bt3=(G.bt3||0)+dt;if(G.bt3<.7)return true;G.bt3=0;
  let c=null;if(!o.bw){o.bw=1;c=o.C.find(c=>!GOOD[c.k])}if(!c)c=o.C.find(c=>c.f<0&&GOOD[c.k]);if(c)tapAt(c.x,c.y+Math.sin(G.t*2+c.ph)*8);return true}};
// ===== полёт: треугольные дырочки в скалах; змей поворачивается носиком вверх/вниз =====
EX.kctl={setup(o){G.kd=1;G.kf=0;o.nc=1},upd(o,dt){G.kf+=((G.kd<0?1:0)-G.kf)*Math.min(1,dt*12)},
 tap(o,wx,wy){if(!G.fly)return false;const d=(wy-CAM.y)<HV*.5?1:-1;if(d!=G.kd){G.kd=d;SFX.light(1)}return true},
 bot(o,dt){if(!G.fly)return;const p=P;let s=null;for(const q of ENTS)if(q.type=='twin'&&!q.passed&&(!s||q.x<s.x))s=q;const tgt=s?s.gc:400;const err=tgt-(p.y-85);const want=clamp(err*3.2,-360,330);BOT.r=0;BOT.j=want<p.vy;
  if(s&&s.x-p.x<320&&EX.twin.dir(s)!=G.kd&&G.t-(G.kbt||0)>.35){G.kbt=G.t;tapAt(CAM.x+WV*.5,CAM.y+(EX.twin.dir(s)>0?HV*.2:HV*.8))}return true}};
EX.twin={setup(o){o.dir=o.dir||1;o.a=o.dir>0?0:Math.PI;o.s=o.s||150;o.nc=0},
 dir(o){return Math.cos(o.a)>0?1:-1},
 upd(o,dt){if(o.rot){o.rt=(o.rt||0)+dt;const tgt=Math.floor(o.rt/(o.per||2.6))%2?Math.PI:0;const want=(o.dir>0?0:Math.PI)+tgt;o.a+=(want-o.a)*Math.min(1,dt*6)}
  if(!G.fly)return;const p=P,kx=p.x,ky=p.y-85;
  if(!o.intro&&o.x-kx<900){o.intro=1;if(o.k)say(o.k);if(o.k=='t_kflip')showHand([[CAM.x+WV*.5,CAM.y+HV*.22],[CAM.x+WV*.5,CAM.y+HV*.78]])}
  if(!o.passed&&kx>o.x-40){o.passed=1;const ok=Math.abs(ky-o.gc)<o.s*.62&&EX.twin.dir(o)==G.kd;
   if(ok){SFX.coin();part(o.x,o.gc,22,'#fff3a0',320,.6,0);if(once('kfit'))say('r_kfit')}
   else if(p.inv<=0){HUD.hearts=Math.max(1,HUD.hearts-1);p.inv=1.2;p.hurt=.3;SFX.hurt();shake(8);part(kx,ky,14,'#fff',300,.5,0);say(EX.twin.dir(o)!=G.kd?'t_kflip':'t_fly')}}},
 draw(o){const s=o.s,hw=s*1.25;X.save();X.translate(o.x,o.gc);X.beginPath();X.rect(-hw,-o.gc-200,hw*2,1100);X.save();X.rotate(o.a);const tp=[[0,-s],[s*.95,s*.72],[-s*.95,s*.72]];X.moveTo(tp[0][0],tp[0][1]);X.lineTo(tp[2][0],tp[2][1]);X.lineTo(tp[1][0],tp[1][1]);X.closePath();X.restore();
  const g=X.createLinearGradient(-hw,0,hw,0);g.addColorStop(0,'#c49a6c');g.addColorStop(.5,'#9b7350');g.addColorStop(1,'#5e432c');X.fillStyle=g;X.fill('evenodd');
  X.strokeStyle='#4a3220';X.lineWidth=5;X.strokeRect(-hw,-o.gc-200,hw*2,1100);
  X.rotate(o.a);X.shadowColor='#fff3a0';X.shadowBlur=o.passed?0:18;X.strokeStyle=o.passed?'rgba(255,243,160,.5)':'#fff3a0';X.lineWidth=8;X.lineJoin='round';X.beginPath();X.moveTo(tp[0][0],tp[0][1]);X.lineTo(tp[1][0],tp[1][1]);X.lineTo(tp[2][0],tp[2][1]);X.closePath();X.stroke();
  X.shadowBlur=0;X.fillStyle='#fff3a0';X.beginPath();X.arc(0,-s-26,10,0,7);X.fill();X.restore()}};
const _fc=WX.flyCamY;WX.flyCamY=function(){const p=P;let s=null;for(const o of ENTS)if(o.type=='twin'&&o.x+120>p.x&&(!s||o.x<s.x))s=o;if(!s)return _fc();const py=p.y-85,k=clamp(1-(s.x-p.x)/700,0,.6);return clamp(py*(1-k)+s.gc*k-HV*.5,-90,600-HV*L.gf)};
// ===== босс: Пирамида — камни, верни верхушку (выбери треугольник), зажги 3 вершины =====
const P0=EX.pyr;
EX.pyr=Object.assign({},P0,{
 setup(o){P0.setup(o);o.tip='pieces';o.pc=[{k:'quad',ok:0},{k:'inv',ok:1},{k:'curve',ok:0}].map((q,i)=>Object.assign(q,{wob:0,ph:i*1.7}))},
 pcPos(o,i){const w=P0.dims(o),x1=o.x-w*.62;return [170+i*(x1-170)/2,385]},
 vpts(o){const b=P0.pts(o),h=P0.tipHome(o);return [b[0],b[1],[h[0],h[1]+6]]},
 upd(o,dt){const p=P,w=P0.dims(o);o.t+=dt;for(const q of o.pc)if(q.wob>0)q.wob-=dt;
  if(p.x>o.x-w*.4){p.x=o.x-w*.4;p.vx=Math.min(0,p.vx)}
  if(o.st=='intro'&&o.t>3){o.st='stomp';o.t=0;o.stomps=0;o.ph=0}
  if(o.st=='stomp'){const per=1.25;const ph=(o.t%per)/per;o.hy=-Math.sin(ph*Math.PI)*75;const k=Math.floor(o.t/per);if(k>o.ph){o.ph=k;shake(12);SFX.crash();part(o.x,600,24,'#d9b07a',420,.7,900,10);o.stomps++;
    const j=o.stomps+o.lit*3,xs=[p.x,clamp(p.x+((j%2)?-1:1)*(180+(j*53)%120),90,o.x-w*.6),90+((j*137)%Math.max(1,o.x-w*.6-90))];for(const x of xs)o.rocks.push({x,y:-200,t:0});
    if(o.stomps>=2){o.st='tired';o.t=0;o.hy=0;o.ph=0;hush();say(o.tip=='on'?'b2v':'b2p')}}}
  else o.hy=lerp(o.hy,0,1-Math.pow(.001,dt));
  if(o.st=='tired'&&o.t>9&&o.tip!='fly'&&o.lit<3){o.st='stomp';o.t=0;o.ph=0;o.stomps=0}
  for(const r of o.rocks){r.t+=dt;if(r.t>.95){r.y+=1500*dt;if(r.y>p.y-150&&r.y<p.y&&Math.abs(r.x-p.x)<55)hurt(p,r.x);if(r.y>585){r.dead=1;part(r.x,590,10,'#a88a68',300,.6,900,9);SFX.land()}}}o.rocks=o.rocks.filter(r=>!r.dead);
  if(o.tip=='fly'){o.tf+=dt*1.1;if(o.tf>=1){o.tip='on';SFX.win();shake(10);const q=P0.tipHome(o);part(q[0],q[1],50,'#ffe36b',520,1.2,0,10);o.st='intro';o.t=0.6;o.rocks=[]}}
  if(o.st=='calm'){o.hy=Math.sin(o.t*3)*4;if(o.t>1.5&&!speaking()&&!G.won)win();if(((o.t*60)|0)%9==0)part(o.x+Math.sin(o.t*7)*w*.5,600-o.h*(.3+.3*Math.sin(o.t*3)),1,'#ffd1e8',60,1,-60,7)}},
 tap(o,wx,wy){if(o.st=='calm'||o.tip=='fly')return o.st!='calm';
  if(o.tip=='pieces'){for(let i=0;i<3;i++){const q=o.pc[i],c=EX.pyr.pcPos(o,i);if(Math.hypot(wx-c[0],wy-c[1])<95){if(o.st!='tired'){SFX.no();say('b2t');return true}
     if(q.ok){throwBoom(c[0],c[1],()=>{if(o.tip!='pieces')return;o.tip='fly';o.tf=0;o.fs=c;SFX.form('kite');say('r_inv')})}else{q.wob=.6;SFX.no();say(q.k=='curve'?'t_ncurve':'t_nquad')}return true}}}
  if(o.tip=='on'){const v=EX.pyr.vpts(o);for(let i=0;i<3;i++){const q=v[i];if(Math.hypot(wx-q[0],wy-q[1])<85){if(o.st!='tired'){throwBoom(q[0],q[1],()=>{SFX.no()});say('b2t');return true}if(o.lit>i)return true;if(i!=o.lit){say('b2v');return true}
     throwBoom(q[0],q[1],()=>{if(o.lit!=i)return;o.lit++;SFX.light(o.lit);say('n'+o.lit);part(q[0],q[1],20,'#fff3a0',300,.7,0);if(o.lit==3){o.st='calm';o.t=0;o.rocks=[];SFX.win();hush();say('n3');say('b2c');say('rule2')}});return true}}}
  return false},
 hint(o){if(o.st=='calm'||o.tip=='fly')return true;if(o.st=='tired'){if(o.tip=='pieces'){const c=EX.pyr.pcPos(o,1);showHand([[c[0],c[1]]],'b2p')}else{const q=EX.pyr.vpts(o)[o.lit];showHand([[q[0],q[1]]],'b2v')}}else say('b2t');return true},
 bot(o,dt){const p=P;G.bt=(G.bt||0)+dt;let tx=Math.min(o.x-P0.dims(o)*.6,3*T);for(const r of o.rocks)if(Math.abs(r.x-tx)<110)tx=r.x<o.x-500?r.x+230:r.x-230;tx=clamp(tx,60,o.x-P0.dims(o)*.5);WX.go(tx,20);BOT.j=0;
  if(o.st=='tired'&&G.bt>.9&&!BOOM.length){G.bt=0;if(o.tip=='pieces'){const i=o.bw?1:0;o.bw=1;const c=EX.pyr.pcPos(o,i);WX.bt(c[0],c[1])}else if(o.tip=='on'){const q=EX.pyr.vpts(o)[o.lit];if(q)WX.bt(q[0],q[1])}}return true},
 draw(o){const w=P0.dims(o);for(const r of o.rocks){const k=clamp(r.t/.95,0,1);X.save();X.fillStyle='rgba(40,20,10,'+(.18+.3*k)+')';X.beginPath();X.ellipse(r.x,598,18+40*k,7+6*k,0,0,7);X.fill();X.restore();if(r.t>.95){X.save();X.translate(r.x,r.y);X.rotate(r.t*6);X.fillStyle='#8f7454';X.strokeStyle='#4f3a26';X.lineWidth=5;X.beginPath();for(let k=0;k<7;k++){const a=k/7*6.283,rr=34*(.8+.25*Math.sin(k*2.3));X.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}X.closePath();X.fill();X.stroke();X.restore()}}
  X.save();if(o.st=='tired'){X.translate(o.x,600);X.rotate(Math.sin(o.t*1.5)*.025);X.translate(-o.x,-600)}img('lineup_1',o.x,600+o.hy,o.h);X.restore();
  const th=.30*o.h,hw=.12*w;
  const tipAt=(x,y,rot,gl)=>{X.save();X.translate(x,y);X.rotate(rot);X.shadowColor='#fff3a0';X.shadowBlur=gl?30+10*Math.sin(G.t*6):0;const gr=X.createLinearGradient(0,-th*.6,0,th*.4);gr.addColorStop(0,'#f1cf7c');gr.addColorStop(1,'#b8842f');X.fillStyle=gr;X.strokeStyle='#6d4a17';X.lineWidth=4;X.beginPath();X.moveTo(0,-th*.62);X.lineTo(hw,th*.38);X.lineTo(-hw,th*.38);X.closePath();X.fill();X.stroke();X.restore()};
  if(o.tip=='pieces'){const S=1.7;o.pc.forEach((q,i)=>{const c=EX.pyr.pcPos(o,i),b=Math.sin(G.t*2+q.ph)*8,wx=q.wob>0?Math.sin(q.wob*40)*10:0,gl=o.st=='tired';X.save();X.translate(c[0]+wx,c[1]+b);
    X.fillStyle='rgba(255,255,255,'+(gl?.2:.08)+')';X.strokeStyle='rgba(255,243,160,'+(gl?.5+.4*pulse(5):.3)+')';X.lineWidth=4;X.beginPath();X.arc(0,0,78,0,7);X.fill();X.stroke();X.scale(S,S);
    if(q.k=='inv')tipAt(0,4,Math.PI,gl);else{const gr=X.createLinearGradient(0,-30,0,30);gr.addColorStop(0,'#f1cf7c');gr.addColorStop(1,'#b8842f');X.fillStyle=gr;X.strokeStyle='#6d4a17';X.lineWidth=4;X.beginPath();
     if(q.k=='quad'){X.rect(-24,-24,48,48)}else{X.moveTo(0,-th*.62);X.lineTo(hw,th*.38);X.lineTo(-hw,th*.38);X.quadraticCurveTo(-hw*1.6,-th*.2,0,-th*.62)}X.fill();X.stroke()}X.restore()})}
  else{const h=P0.tipHome(o);let x=h[0],y=h[1]-26+o.hy,rot=0;if(o.tip=='fly'){const s=o.fs||[h[0],300],a=o.tf;x=lerp(s[0],h[0],a);y=lerp(s[1],h[1]-26,a)-Math.sin(a*Math.PI)*160;rot=Math.PI*(1-a)}tipAt(x,y,rot,0)}
  if(o.tip=='on'&&o.st!='calm'){EX.pyr.vpts(o).forEach((q,i)=>{const lit=o.lit>i;X.save();X.shadowColor='#fff3a0';X.shadowBlur=lit?30:o.st=='tired'?18:0;X.fillStyle=lit?'#ffe36b':o.st=='tired'?'rgba(150,110,220,'+(.6+.3*Math.sin(G.t*6+i))+')':'rgba(120,100,140,.35)';X.beginPath();X.arc(q[0],q[1]+(i==2?o.hy:0),lit?26:o.st=='tired'?24:16,0,7);X.fill();X.lineWidth=4;X.strokeStyle='#fff';X.stroke();X.restore()});txt(o.lit+' из 3',o.x-w*.5-60,600-o.h*.62,46,'#fff3a0')}
  if(o.st=='tired'){for(let i=0;i<3;i++){const a=(G.t*1.4+i/3)%1;X.save();X.globalAlpha=1-a;X.fillStyle='#9fdcff';X.beginPath();X.ellipse(o.x-w*.25+i*w*.25,600-o.h*.7+a*60,6,10,0,0,7);X.fill();X.restore()}}}});

WX.add(()=>{
const deco=(b,xs,row)=>xs.forEach((x,i)=>b.d(i%2?'bush':'sign',x,row&&row(x)||10,.9));
LV['2-1']=()=>{const b=new LB(170,'2-1');b.meta={name:'2-1 Ломаная тропа',intro:['w2','l21'],forms:[]};
 // 1) знакомство: два огонька — склон на утёс
 b.g(0,21).e('poly',21,10,{pts:[[21,10],[27,5]]}).g(27,40,5);
 // 2) развитие: тупой угол — мост через пропасть
 b.e('poly',40,5,{pts:[[40,5],[46,3],[52,5]]}).g(52,58,5).g(58,60,6).g(60,62,7).g(62,66,8);
 // 3) острый угол — крутая горка
 b.e('poly',66,8,{pts:[[66,8],[71,2],[76,8]]}).g(76,86,8);
 // 4) поворот: замкни ломаную — треугольник даёт Камень Формы (змей)
 b.g(86,112,8).e('poly',88,8,{pts:[[88,8],[96,8],[92,3]],close:1,stone:101,srow:8,stand:86});
 // 5) финал: полёт змея и ветер на высокий уступ
 b.g(120,138,8).e('wind',136,8,{w:2,k:'t_wind'}).g(138,152,3).g(152,170,8);
 b.coins(13,8,5,'coin_tri',1).coins(30,3,6,'coin_tri',1).coins(78,6,5,'coin_tri',1).coins(112,6,8,'coin_tri',2).coins(155,6,8,'coin_tri',1);
 b.e('enemy',12,10).e('enemy',34,5).e('enemy',82,8).e('enemy',106,8).e('enemy',130,8).e('enemy',160,8);
 b.e('star',46,1.6).e('star',130,5).e('star',150,1.3).e('stk',145,3,{id:'sign',k:'s_sign'}).e('goal',166,8);
 deco(b,[5,30,56,80,108,128,158],x=>x>=27&&x<58?5:x>=58?8:10);return b};
LV['2-2']=()=>{const b=new LB(170,'2-2');b.meta={name:'2-2 Острые и тупые',intro:['l22','t_acw'],forms:['kite'],startForm:'kite'};
 // 1) знакомство: острая вершина — узкий сильный ветер вверх
 b.g(0,27).e('peak',31,9.5,{kind:'acute',lx:35,lrow:3}).g(35,54,3);
 // 2) тупая вершина — широкий мягкий ветер далеко
 b.e('peak',63,9.5,{kind:'obtuse',ww:16*T,otop:4.4*T,lx:72,lrow:5,k:'t_obw'}).g(72,96,5);
 // 3) снова острая — на высокий уступ
 b.e('peak',98,9.5,{kind:'acute',lx:100,lrow:2}).g(100,112,2);
 // 4) поворот: кристаллический потолок — острую вершину надо раскрыть в тупую
 b.g(112,122,7).e('peak',132,10,{dy:2.2,kind:'acute',open:1,stand:119,ww:20*T,otop:6.7*T,ceil:2,cw:14*T,lx:142,lrow:7});
 // 5) финал
 b.g(142,152,7).e('peak',154,9.5,{kind:'acute',lx:156,lrow:2}).g(156,170,2);
 b.coins(8,8,5,'coin_tri',1).coins(40,1,6,'coin_tri',1).coins(58,4,10,'coin_tri',2).coins(103,0,5,'coin_tri',1).coins(126,6,10,'coin_tri',1).coins(159,0,6,'coin_tri',1);
 b.e('enemy',16,10).e('enemy',86,5).e('enemy',164,2);// v3: не у мест приземления
 b.e('star',63,3.4).e('star',108,1).e('star',137,5.5).e('stk',105,2,{id:'pizza',k:'s_pizza'}).e('goal',165,2);
 deco(b,[5,22,40,76,90,115,145,160],x=>x>=34&&x<54?3:x>=72&&x<96?5:x>=112&&x<152?7:x>=156?2:10);return b};
LV['2-3']=()=>{const b=new LB(180,'2-3');b.meta={name:'2-3 Треугольные ворота',intro:['l23'],forms:['kite']};
 b.g(0,126).g(138,180);
 b.e('tgate',34,10,{cards:['tri','quad','tri'],need:2});
 b.e('tgate',70,10,{cards:['thin','circle','flat','gap','tri'],need:3});
 b.pl(90,7,3).e('stk',92,7,{id:'hanger',k:'s_hanger'});
 b.e('tgate',110,10,{cards:['inv','curve','rot','gap','thin'],need:3,k:'t_tg3'});
 b.e('peak',132,10,{kind:'obtuse',ww:12*T,otop:5*T,lx:138,lrow:10});
 b.e('tgate',160,10,{cards:['flat','curve','inv'],need:2});
 b.coins(8,8,5,'coin_tri',1).coins(44,8,6,'coin_tri',1).coins(80,8,6,'coin_tri',1).coins(127,6,10,'coin_tri',2).coins(146,8,6,'coin_tri',1);
 b.e('enemy',20,10).e('enemy',52,10).e('enemy',86,10).e('enemy',120,10).e('enemy',150,10).e('enemy',170,10);
 b.e('star',50,6).e('star',116,8.5).e('star',132,5).e('goal',174,10);
 deco(b,[6,26,58,96,122,144,166]);return b};
LV['2-4']=()=>{const N=12,w=18+N*12+14;const b=new LB(w,'2-4');b.zoom=1.65;b.gf=.9;b.meta={name:'2-4 Полёт сквозь горы',intro:['l24','t_fly'],forms:[],fly:300,noFM:1};
 b.g(0,w);b.start={x:3,y:9};b.e('kctl',1,10);
 const GC=[340,420,300,450,360,270,430,330,400,290,440,350],DIR=[1,-1,1,1,-1,1,-1,-1,1,-1,1,-1];
 GC.forEach((gc,i)=>{const x=18+i*12;b.e('twin',x,10,{gc,dir:DIR[i],rot:i>=8?1:0,per:2.6,k:i==1?'t_kflip':i==8?'t_krot':0});b.ents[b.ents.length-1].x=x*T;
  b.coins(x,0,1,'coin_tri');b.ents[b.ents.length-1].y=gc+20;
  if(i==2||i==6||i==10){b.e('star',x+6,0);b.ents[b.ents.length-1].y=(gc+GC[i+1])/2+10}
  if(i==4){b.e('stk',x+6,0,{id:'sail',k:'s_sail'});b.ents[b.ents.length-1].y=(gc+GC[i+1])/2+40}});
 b.e('goal',w-8,10);return b};
LV['2-B']=()=>{const n=Math.max(14,Math.ceil(W/1.6/T)+1);const b=new LB(n,'2-B');b.zoom=1.6;b.gf=.78;b.meta={name:'Босс: Пирамида',intro:['b2a','b2t'],forms:[],boss:'pyr'};b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('pyr',n-4,10);return b};
});
})();
