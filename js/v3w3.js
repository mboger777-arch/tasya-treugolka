// v3 Мир 3: Квадратный город — прямой угол (уголок-выпрямитель), равные стороны, мосты-прямоугольники, квадрат тоже прямоугольник
(function(){
const near=(x,d=700)=>Math.abs(x-P.x)<d;
const tapAt=(x,y)=>taps.push({x:(x-CAM.x)*Z,y:(y-CAM.y)*Z});
const pulse=(k=4)=>.5+.5*Math.sin(G.t*k);
const once=k=>{L.said=L.said||{};if(L.said[k])return false;L.said[k]=1;return true};
const showHand=(s,k,d)=>WX.showHand(s,k,d);
const sm=k=>{k=clamp(k,0,1);return k*k*(3-2*k)};
WX.STK.push(['window','stk_window','3-1'],['grid','stk_grid','3-2'],['door','stk_door','3-3'],['phone','stk_phone','3-4']);
// ---- уголок (угольник): жёлтая буква «L» с прямым углом
function ugol(x,y,rot,s,gl){X.save();X.translate(x,y);X.rotate(rot);X.scale(s,s);X.shadowColor='#ffe36b';X.shadowBlur=gl?26:10;
 const g=X.createLinearGradient(0,-120,0,0);g.addColorStop(0,'#ffe36b');g.addColorStop(1,'#f0a21a');X.fillStyle=g;X.strokeStyle='#8a4b00';X.lineWidth=5;X.lineJoin='round';
 X.beginPath();X.moveTo(-6,6);X.lineTo(-6,-130);X.lineTo(16,-130);X.lineTo(16,-16);X.lineTo(130,-16);X.lineTo(130,6);X.closePath();X.fill();X.stroke();X.shadowBlur=0;
 X.strokeStyle='#8a4b00';X.lineWidth=3;X.strokeRect(16,-34,18,18);for(let i=1;i<6;i++){X.beginPath();X.moveTo(-6,-i*20);X.lineTo(4,-i*20);X.stroke();X.beginPath();X.moveTo(i*20+16,6);X.lineTo(i*20+16,-4);X.stroke()}X.restore()}
WX.ugol=ugol;
// ---- нарисованный домик (локально: низ-лево = 0,0; вверх = -y)
const PAL=[['#f2b880','#d98a52','#8a4b2a'],['#9fd0ff','#5d97d6','#2f527f'],['#f7a8c4','#d86a95','#7d2f52'],['#b8e08a','#7fb24f','#3f6a22'],['#ffe08a','#e0a93a','#7d5a12']];
function house(w,h,pi,lit){const [c1,c2,c3]=PAL[pi%PAL.length];const g=X.createLinearGradient(0,-h,w,0);g.addColorStop(0,c1);g.addColorStop(1,c2);
 X.fillStyle=g;X.strokeStyle=c3;X.lineWidth=6;X.lineJoin='round';X.beginPath();X.rect(0,-h,w,h);X.fill();X.stroke();
 X.fillStyle=c3;X.beginPath();X.roundRect(-10,-h-14,w+20,20,6);X.fill();X.fillStyle='rgba(255,255,255,.25)';X.fillRect(-6,-h-12,w+12,5);
 X.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<h/22;i++)X.fillRect(0,-h+10+i*22,w,3);
 const nw=Math.max(1,Math.round(w/70)),nh=Math.max(1,Math.round((h-40)/80));for(let i=0;i<nw;i++)for(let j=0;j<nh;j++){const cx=(i+.5)*w/nw,cy=-h+44+j*(h-70)/Math.max(1,nh)+((h-70)/Math.max(1,nh)-44)/2;
  if(j==nh-1&&i==nw-1&&h>110)continue;X.fillStyle=c3;X.fillRect(cx-21,cy-21,42,42);X.fillStyle=lit?'#fff3a0':'#bfe7ff';X.fillRect(cx-16,cy-16,32,32);X.fillStyle=c3;X.fillRect(cx-2,cy-16,4,32);X.fillRect(cx-16,cy-2,32,4)}
 if(h>110){const dx=w-(w/nw)/2;X.fillStyle=c3;X.beginPath();X.roundRect(dx-20,-62,40,62,[14,14,0,0]);X.fill();X.fillStyle='#ffd35a';X.beginPath();X.arc(dx+10,-30,4,0,7);X.fill()}}
// ===== 3-1: кривой дом → уголок → прямой дом-ступенька =====
EX.house={setup(o){o.c=Math.round((o.x-T/2)/T);o.r=Math.round(o.y/T);o.W=o.w*T;o.Hh=o.h*T;o.b=o.bend||0;o.b0=o.b;o.rt=o.rot?Math.PI/4:0;o.st='bent';o.t=0;o.nc=1;o.pi=o.pi||0;
  o.lift=o.rot?(o.lift||2.5)*T:0},
 cx(o){return o.c*T+o.W/2},cy(o){return o.r*T-o.Hh/2-o.lift},
 upd(o,dt){if(o.st=='ok')return;if(!o.intro&&o.st=='bent'&&near(EX.house.cx(o),640)&&P.x<EX.house.cx(o)){o.intro=1;say(o.k||'t_ugol')}
  if(o.st=='chk'){o.t+=dt;const t=o.t;
   if(o.rot){if(t>1.3){const k=sm((t-1.3)/.9);o.rt=Math.PI/4*(1-k);o.lift=o.lift0*(1-k*k)}}
   else if(t>1.3)o.b=o.b0*(1-sm((t-1.3)/.6));
   if(t>=2.3){o.st='ok';o.b=0;o.rt=0;o.lift=0;for(let x=o.c;x<o.c+o.w;x++)for(let y=o.r-o.h;y<o.r;y++)if(!tileAt(x,y))setT(x,y,15);
    SFX.crash();shake(7);SFX.win();part(EX.house.cx(o),o.r*T-o.Hh,26,'#fff3a0',380,.8,600,9);
    if(o.rot)say('r_rot45');else{if(o.b0>0&&o.b0<10)say('r_gap');say('r_ugol')}}
   if(t>.5&&!o.clk){o.clk=1;SFX.light(3)}}},
 tap(o,wx,wy){if(o.st!='bent')return false;const cx=EX.house.cx(o),cy=EX.house.cy(o);if(Math.abs(wx-cx)<o.W/2+70&&Math.abs(wy-cy)<o.Hh/2+80){o.st='chk';o.t=0;o.lift0=o.lift;SFX.boom();HAND=null;return true}return false},
 hint(o){if(o.st!='bent'||!near(EX.house.cx(o),700)||P.x>EX.house.cx(o)+o.W)return;const q=EX.house.corner(o);showHand([[q[0]+20,q[1]-20]],o.k||'t_ugol');return true},
 corner(o){if(o.rot){const cx=EX.house.cx(o),cy=EX.house.cy(o),r=o.Hh/2*Math.SQRT2;return [cx,cy+r]}return [o.c*T,o.r*T]},
 top(o){return o.st=='ok'||!near(EX.house.cx(o),900)?null:EX.house.cy(o)-o.Hh/2*(o.rot?1.45:1)-60},
 bot(o,dt){const cx=EX.house.cx(o);if(o.st=='ok'||P.x>cx||cx-P.x>760)return;if(o.st=='chk'){WX.go(o.c*T-2.2*T,20);BOT.j=0;return true}
  WX.go(o.c*T-2.6*T,20);BOT.j=0;G.bt3=(G.bt3||0)+dt;if(G.bt3>.8&&Math.abs(P.x-(o.c*T-2.6*T))<60){G.bt3=0;const q=EX.house.corner(o);tapAt(q[0]+20,q[1]-30)}return true},
 draw(o){const x0=o.c*T,y0=o.r*T;X.save();
  if(o.rot){const cx=EX.house.cx(o),cy=EX.house.cy(o);X.translate(cx,cy);X.rotate(o.rt);X.translate(-o.W/2,o.Hh/2);house(o.W,o.Hh,o.pi,o.st=='ok');
   if(o.st=='bent'){X.restore();X.save();X.globalAlpha=.4+.3*pulse(3);X.strokeStyle='#fff';X.setLineDash([10,10]);X.lineWidth=4;X.beginPath();X.moveTo(cx,cy+o.Hh/2*Math.SQRT2+10);X.lineTo(cx,y0);X.stroke()}}
  else{const sk=Math.tan(o.b*Math.PI/180);X.translate(x0,y0);X.transform(1,0,-sk,1,0,0);house(o.W,o.Hh,o.pi,o.st=='ok')}
  X.restore();
  // уголок
  if(o.st=='chk'||(o.st=='ok'&&o.t<3.2)){if(o.st=='ok')o.t+=1/60;const t=o.t,fa=t<.5?sm(t/.5):1,al=t>2.6?1-(t-2.6)/.6:1;X.save();X.globalAlpha=clamp(al,0,1);
   const q=EX.house.corner(o);let ux=lerp(P.x,q[0],fa),uy=lerp(P.y-120,q[1],fa),rot=o.rot?o.rt+Math.PI/4*0-(Math.PI/4-o.rt)*0:0;
   if(o.rot){const cx=EX.house.cx(o),cy=EX.house.cy(o);const a=o.rt;const bx=-o.W/2,by=o.Hh/2;ux=lerp(P.x,cx+bx*Math.cos(a)-by*Math.sin(a),fa);uy=lerp(P.y-120,cy+bx*Math.sin(a)+by*Math.cos(a),fa);rot=a}
   if(!o.rot&&o.b>.3&&t>.5){const sk=Math.tan(o.b*Math.PI/180),hh=Math.min(o.Hh,130);X.fillStyle='rgba(255,70,50,'+(.45+.35*pulse(8))+')';X.beginPath();X.moveTo(q[0]+12,q[1]-14);X.lineTo(q[0]+12,q[1]-hh);X.lineTo(q[0]+hh*sk+2,q[1]-hh);X.closePath();X.fill()}
   ugol(ux,uy,rot,1,t>.5&&t<1.3);
   if(t>.5&&t<1.4){X.fillStyle=o.b0>.3&&!o.rot?'#ff5a4a':'#7bd66b';X.beginPath();X.arc(ux+40,uy-40,10+4*pulse(10),0,7);X.fill()}
   X.restore()}},
 back(o){}};
// ===== 3-2: кнопка-квадрат: стороны должны стать равными; потом кубик жмёт кнопку =====
EX.sqb={setup(o){for(let y=6;y<=9;y++)setT(o.door,y,16);o.on=0;o.dt=0;o.eq=o.rot?1:0;o.str=0;o.k=o.k||.5;o.nc=1},
 S:120,pc(o){return [o.x,o.y-250]},
 upd(o,dt){const p=P;if(o.str&&o.eq<1){o.eq=Math.min(1,o.eq+dt*1.2);if(o.eq>=1){SFX.win();part(o.x,o.y-250,22,'#7ff0a2',320,.7,0);say('r_eq');say('t_eqbtn')}}
  if(!o.intro&&near(o.x,620)&&P.x<o.x){o.intro=1;say(o.rot?'r_rhomb':'t_eq')}
  if(o.on){o.dt=Math.min(1,o.dt+dt*1.6);return}
  if(p.ground&&Math.abs(p.x-o.x)<62&&Math.abs(p.y-o.y)<4){if(p.form=='cube'&&o.eq>=1){o.on=1;for(let y=6;y<=9;y++)setT(o.door,y,0);SFX.crash();shake(10);SFX.light(4);part(o.door*T+30,480,24,'#bfe0ff',400,.8,600,9);say('r_good')}
   else if(!o.g||G.t-o.g>6){o.g=G.t;SFX.no();say(o.eq<1?'t_eq':'t_btn')}}},
 tap(o,wx,wy){if(o.eq>=1||o.str)return false;const [cx,cy]=EX.sqb.pc(o);if(Math.abs(wx-cx)<130&&Math.abs(wy-cy)<130){o.str=1;SFX.light(2);HAND=null;return true}return false},
 top(o){return o.on||!near(o.x,900)?null:o.y-250-130},
 hint(o){if(o.on||!near(o.x,620)||P.x>o.door*T)return;if(o.eq<1){const [cx,cy]=EX.sqb.pc(o),S=EX.sqb.S,h=S*(o.k+(1-o.k)*o.eq);showHand([[cx,cy+S/2-h],[cx,cy-S/2]],'t_eq');return true}
  if(P.form!='cube'){HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say('t_btn')}else{HAND={x:o.x,y:o.y-40,t:0,k:'tap'};say('t_eqbtn')}return true},
 bot(o,dt){const p=P;if(o.on||o.x-p.x>700||p.x>o.door*T)return;BOT.f=p.form!='cube'&&!G.botF&&p.ground?1:0;G.botF=BOT.f?.3:Math.max(0,(G.botF||0)-dt);BOT.j=0;
  if(o.eq<1){WX.go(o.x-3*T,20);G.bt3=(G.bt3||0)+dt;if(G.bt3>.8&&!o.str){G.bt3=0;const [cx,cy]=EX.sqb.pc(o);tapAt(cx,cy)}return true}
  WX.go(o.x,14);return true},
 draw(o){const pr=o.on?1:(Math.abs(P.x-o.x)<62&&P.ground&&Math.abs(P.y-o.y)<4?.4:0);X.save();X.fillStyle='#3d4660';X.beginPath();X.roundRect(o.x-56,o.y-14,112,16,6);X.fill();
  const g=X.createLinearGradient(0,o.y-34,0,o.y-12);g.addColorStop(0,o.on?'#7ff0a2':o.eq>=1?'#ffcc33':'#ff6b5e');g.addColorStop(1,o.on?'#1f8f4a':o.eq>=1?'#c98a00':'#b32a22');X.fillStyle=g;X.beginPath();X.roundRect(o.x-44,o.y-34+pr*16,88,22,8);X.fill();X.strokeStyle='#2a2f44';X.lineWidth=3;X.stroke();
  // столбик и табличка с фигурой
  const [cx,cy]=EX.sqb.pc(o),S=EX.sqb.S;X.fillStyle='#6b5a48';X.fillRect(o.x-5,cy+S/2+20,10,o.y-34-(cy+S/2+20));panel(cx-S/2-40,cy-S/2-40,S+80,S+80,26);
  const h=S*(o.k+(1-o.k)*o.eq),ok=o.eq>=1;X.save();X.translate(cx,cy);if(o.rot)X.rotate(Math.PI/4),X.scale(.78,.78);
  const top=S/2-h;X.fillStyle=ok?'rgba(53,196,106,.35)':'rgba(255,107,94,.25)';X.strokeStyle=ok?'#1f8f4a':'#b32a22';X.lineWidth=8;X.lineJoin='round';X.beginPath();X.rect(-S/2,top,S,h);X.fill();X.stroke();
  // метки равных сторон
  X.strokeStyle=ok?'#145c30':'#7a2a20';X.lineWidth=4;const tick=(x1,y1,x2,y2,n)=>{const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l,tx=dx/l,ty=dy/l;for(let i=0;i<n;i++){const s=(i-(n-1)/2)*8;X.beginPath();X.moveTo(mx+tx*s-nx*10,my+ty*s-ny*10);X.lineTo(mx+tx*s+nx*10,my+ty*s+ny*10);X.stroke()}};
  const nt=ok?1:2;tick(-S/2,top,S/2,top,1);tick(-S/2,S/2,S/2,S/2,1);tick(-S/2,top,-S/2,S/2,ok?1:2);tick(S/2,top,S/2,S/2,ok?1:2);
  X.fillStyle=ok?'#145c30':'#7a2a20';for(const [x,y] of [[-S/2,top],[S/2,top],[S/2,S/2],[-S/2,S/2]]){X.beginPath();X.arc(x,y,6,0,7);X.fill()}
  if(!ok&&!o.str){const a=pulse(6);X.fillStyle='#fff3a0';X.strokeStyle='#8a4b00';X.lineWidth=3;X.beginPath();X.moveTo(0,top-34-a*8);X.lineTo(18,top-12-a*8);X.lineTo(-18,top-12-a*8);X.closePath();X.fill();X.stroke()}
  X.restore();
  if(o.on&&o.dt<1){const x=o.door*T;X.globalAlpha=1-o.dt;X.fillStyle='#8ea3cf';X.fillRect(x+2,360-o.dt*240,T-4,240)}
  X.restore()}};
// ===== 3-3: мост-прямоугольник: длинной стороной поперёк ямы =====
EX.rbr={setup(o){o.ec=Math.round((o.x-T/2)/T);o.r=Math.round(o.y/T);o.done=0;o.nc=1;o.C=(o.cands||[{len:o.gap+1}]).map((c,i)=>Object.assign({a:0,t:-1,i,wob:0},c));
  for(let y=o.r-5;y<o.r;y++)setT(o.ec-1,y,15)},
 ok(o,c){return c.len>=o.gap+1},
 upd(o,dt){const ex=o.ec*T;if(!o.intro&&!o.done&&P.x>ex-900&&P.x<ex){o.intro=1;say('t_rbr')}
  for(const c of o.C){if(c.wob>0)c.wob-=dt;if(c.t<0)continue;c.t+=dt;
   if(EX.rbr.ok(o,c)){if(c.t>=.9&&!o.done){o.done=1;for(let x=o.ec;x<o.ec+o.gap;x++)setT(x,o.r,2);for(let y=o.r-5;y<o.r;y++)setT(o.ec-1,y,0);SFX.crash();shake(8);SFX.win();part(ex+o.gap*T/2,o.r*T,24,'#fff3a0',380,.8,600,9);say('r_rbr')}}
   else if(c.t>1.8){c.t=-1;c.wob=.6;SFX.no();say('r_short')}else if(c.t>.7&&!c.th){c.th=1;SFX.land()}}},
 // геометрия доски: стоячая (шарнир у края) или лежачая (на крыше)
 pose(o,c){const ex=o.ec*T,ry=o.r*T,L=c.len*T,th=26;
  if(c.lie){if(c.t<0)return {x:ex-L-T*.4,y:ry-th,w:L,h:th,a:0,ax:0,ay:th};const k=sm(c.t/.9);return {x:lerp(ex-L-T*.4,ex-6,k),y:ry-th-Math.sin(k*Math.PI)*110+(k>=1?th*.6:0),w:L,h:th,a:0,ax:0,ay:th}}
  let a;if(c.t<0)a=0;else if(EX.rbr.ok(o,c))a=sm(c.t/.9)*Math.PI/2;else{const u=c.t;a=u<.7?sm(u/.7)*(Math.PI/2+.5):u<1.1?Math.PI/2+.5:(Math.PI/2+.5)*(1-sm((u-1.1)/.7))}
  return {x:ex,y:ry,w:th,h:L,a,stand:1}},
 hitC(o,wx,wy){for(const c of o.C){const q=EX.rbr.pose(o,c);let hx,hy,hw,hh;if(q.stand){hx=q.x-q.w-50;hy=q.y-q.h-40;hw=q.w+100;hh=q.h+40}else{hx=q.x-30;hy=q.y-70;hw=q.w+60;hh=110}if(wx>hx&&wx<hx+hw&&wy>hy&&wy<hy+hh)return c}return null},
 tap(o,wx,wy){if(o.done)return false;if(o.C.some(c=>c.t>=0))return false;const c=EX.rbr.hitC(o,wx,wy);if(!c)return false;c.t=0;c.th=0;SFX.boom();HAND=null;return true},
 hint(o){const ex=o.ec*T;if(o.done||P.x>ex||ex-P.x>800)return;const c=o.C.find(c=>EX.rbr.ok(o,c)),q=EX.rbr.pose(o,c);if(q.stand)showHand([[q.x-12,q.y-q.h+30],[q.x+q.h*.7,q.y-q.h*.7]],'t_rbr');else showHand([[q.x+q.w/2,q.y-10],[ex+o.gap*T/2,q.y-60]],'t_rbr');return true},
 top(o){const ex=o.ec*T;if(o.done||!near(ex,900))return null;const m=Math.max(...o.C.map(c=>c.lie?0:c.len));return o.r*T-m*T-60},
 bot(o,dt){const ex=o.ec*T,p=P;if(o.done||p.x>ex||ex-p.x>900)return;BOT.f=0;BOT.j=0;WX.go(ex-3.2*T,40);if(p.x>ex-4.5*T){G.bt3=(G.bt3||0)+dt;if(G.bt3>.9&&!o.C.some(c=>c.t>=0)){G.bt3=0;let c=null;if(!o.bw&&o.C.length>1){o.bw=1;c=o.C.find(c=>!EX.rbr.ok(o,c))}if(!c)c=o.C.find(c=>EX.rbr.ok(o,c));const q=EX.rbr.pose(o,c);if(q.stand)tapAt(q.x-12,q.y-q.h*.6);else tapAt(q.x+q.w/2,q.y-10)}}return true},
 draw(o){const ex=o.ec*T,ry=o.r*T;X.save();
  if(!o.done){X.globalAlpha=.55+.25*pulse(3);X.strokeStyle='#ff7a59';X.lineWidth=5;X.setLineDash([12,10]);X.beginPath();X.moveTo(ex+3,ry);X.lineTo(ex+3,ry-5*T);X.stroke();X.setLineDash([]);X.globalAlpha=1;
   // пунктир «куда ляжет мост»
   X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=4;X.setLineDash([14,10]);X.strokeRect(ex,ry-6,o.gap*T,20);X.setLineDash([])}
  for(const c of o.C){if(o.done&&EX.rbr.ok(o,c)&&c.t>1.1)continue;const q=EX.rbr.pose(o,c),w=c.wob>0?Math.sin(c.wob*40)*.04:0;X.save();
   const good=EX.rbr.ok(o,c);const g1=good?'#c98a4a':'#b98a6a';
   if(q.stand){X.translate(q.x,q.y);X.rotate(q.a+w);plank(-q.w,-q.h,q.w,q.h,c.len)}
   else{X.translate(q.x,q.y);plank(0,0,q.w,q.h,c.len)}X.restore()}
  if(o.done){const k=Math.min(1,(G.t-(o.dT||(o.dT=G.t)))/.4);X.globalAlpha=1-k}X.restore()}};
function plank(x,y,w,h,n){const g=X.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#e7b06a');g.addColorStop(1,'#a8682f');X.fillStyle=g;X.strokeStyle='#5f3512';X.lineWidth=5;X.lineJoin='round';X.beginPath();X.roundRect(x,y,w,h,6);X.fill();X.stroke();
 X.strokeStyle='rgba(95,53,18,.5)';X.lineWidth=3;const v=h>w;for(let i=1;i<n;i++){X.beginPath();if(v){X.moveTo(x+4,y+i*h/n);X.lineTo(x+w-4,y+i*h/n)}else{X.moveTo(x+i*w/n,y+4);X.lineTo(x+i*w/n,y+h-4)}X.stroke()}
 X.fillStyle='#5f3512';for(const [a,b] of v?[[x+w/2,y+10],[x+w/2,y+h-10]]:[[x+10,y+h/2],[x+w-10,y+h/2]]){X.beginPath();X.arc(a,b,4,0,7);X.fill()}}
// соперник ждёт у неготового моста (честная гонка)
EX.rival3=Object.assign({},EX.rival,{upd(o,dt){if(o.go)for(const b of ENTS)if(b.type=='rbr'&&!b.done&&o.rx>b.ec*T-3*T&&o.rx<b.ec*T){o.vy=0;return}EX.rival.upd(o,dt)}});
// ===== 3-4: квадрат — тоже прямоугольник (кубик проходит прямоугольную дверь) =====
EX.sqr={setup(o){o.gx=o.gate;o.nc=1},
 upd(o,dt){const p=P,gx=o.gx*T;if(!o.intro&&p.x>gx-560&&p.x<gx){o.intro=1;say('t_rdoor')}
  if(!o.done&&p.form=='cube'&&p.x>gx+T){o.done=1;SFX.win();part(gx+30,P.y-100,24,'#7ff0a2',340,.8,0);say('r_sqrect')}},
 hint(o){const gx=o.gx*T;if(o.done||P.x>gx+T||gx-P.x>600)return;if(P.form!='cube'){HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say('t_rdoor')}return true},
 draw(o){const gx=o.gx*T;if(o.done&&P.x>gx+6*T)return;X.save();X.translate(gx-2.5*T,6*T-10);X.fillStyle='#6b5a48';X.fillRect(-5,0,10,4*T+10);panel(-110,-130,220,130,24);
  X.strokeStyle='#5d97d6';X.lineWidth=7;X.strokeRect(-90,-105,90,54);X.strokeStyle='#35c46a';X.strokeRect(22,-110,64,64);X.fillStyle='#145c30';txt('=',6,-78,40,'#7a56b8','center','#fff');
  X.fillStyle='#fff';X.restore()}};
// ===== 3-B: Квадратыч — кнопка, уголок на 4 угла, потом голова по табличке =====
const R=EX.rob;
EX.rob3=Object.assign({},R,{
 setup(o){R.setup(o);o.hk=.45;o.hs=0},
 head(o){return [o.x-230,600-o.h+60]},
 upd(o,dt){if(o.st=='head'){o.t+=dt;const p=P;if(p.x>o.x-90){p.x=o.x-90;p.vx=Math.min(0,p.vx)}if(o.hs&&o.hk<1){o.hk=Math.min(1,o.hk+dt*.9);if(o.hk>=1){o.st='calm';o.t=0;SFX.win();shake(8);part(o.x,600-o.h,40,'#7ff0a2',460,1,0,10);say('b3r');say('b3c');say('rule3')}}return}
  if(o.st=='calm'){o.t+=dt;if(o.t>1.5&&!speaking()&&!G.won)win();return}R.upd(o,dt)},
 tap(o,wx,wy){if(o.st=='head'){if(o.hs)return true;const [cx,cy]=EX.rob3.head(o);if(Math.abs(wx-cx)<170&&Math.abs(wy-cy)<150){o.hs=1;SFX.light(3);HAND=null}return true}
  if(o.st!='fight')return false;const cs=R.corners(o);for(let i=0;i<4;i++){const q=cs[i];if(Math.hypot(wx-q[0],wy-q[1])<75){if(o.stun<=0){say('b3t');SFX.no();return true}if(i<o.lit)return true;
   throwBoom(q[0],q[1],()=>{if(i!=o.lit||o.stun<=0||o.st!='fight')return;o.lit++;SFX.light(o.lit);say('n'+o.lit);part(q[0],q[1],16,'#7ff0a2',300,.6,0);if(o.lit==4){o.st='head';o.t=0;o.bolts=[];SFX.win();say('t_b3s')}});return true}}return false},
 hint(o){if(o.st=='head'){if(!o.hs){const [cx,cy]=EX.rob3.head(o);showHand([[cx+100*o.hk,cy],[cx+110,cy]],'t_b3s')}return true}return R.hint(o)},
 bot(o,dt){if(o.st=='head'){BOT.r=0;BOT.l=0;BOT.j=0;G.bt=(G.bt||0)+dt;if(G.bt>1&&!o.hs){G.bt=0;const [cx,cy]=EX.rob3.head(o);tapAt(cx,cy)}return true}return R.bot(o,dt)},
 draw(o){R.draw(o);if(o.st!='head'&&!(o.st=='calm'&&o.t<2.5))return;const [cx,cy]=EX.rob3.head(o),S=150;X.save();
  // табличка-образец: прямоугольник 2:1
  {const sx=o.x+40,sy=300;panel(sx,sy,180,120,24);X.strokeStyle='#5d97d6';X.lineWidth=8;X.strokeRect(sx+30,sy+30,120,60);}
  // голова-рамка: ширина растёт до образца
  const w=S*2*o.hk,h=S;X.shadowColor=o.hk>=1?'#7ff0a2':'#7fd3ff';X.shadowBlur=24;X.strokeStyle=o.hk>=1?'#7ff0a2':'#7fd3ff';X.lineWidth=9;X.fillStyle='rgba(127,211,255,.15)';X.beginPath();X.rect(cx-w/2,cy-h/2,w,h);X.fill();X.stroke();X.shadowBlur=0;
  if(!o.hs){const a=pulse(6);X.fillStyle='#fff3a0';X.strokeStyle='#8a4b00';X.lineWidth=3;X.beginPath();X.moveTo(cx+w/2+44+a*8,cy);X.lineTo(cx+w/2+16+a*8,cy-20);X.lineTo(cx+w/2+16+a*8,cy+20);X.closePath();X.fill();X.stroke()}
  X.restore()}});
// ===== выбор формы ботом в мире 3 =====
WX.add(()=>{
const pw=WX.wantF;WX.wantF=function(want,fx,fy){if(WX.wn()==3){const p=P;
  for(const o of ENTS)if(o.type=='sqb'&&!o.on&&o.x-p.x<9*T&&o.x-p.x>-60)return 'cube';
  for(let k=-2;k<6;k++){const g=WX.gateAt(fx+k);if(g=='board'&&!L.forms.includes('board')&&L.forms.includes('cube'))return 'cube'}}
 return pw?pw(want,fx,fy):want};
const deco=(b,xs,row)=>xs.forEach((x,i)=>b.d(i%2?'bush':'sign',x,row&&row(x)||10,.9));
LV['3-1']=()=>{const b=new LB(172,'3-1');b.meta={name:'3-1 Уголок-выпрямитель',intro:['w3','l31'],forms:[]};
 // 1) знакомство: кривой домик — ступенька на уступ
 b.g(0,34).g(34,52,6).e('house',31,10,{w:3,h:2,bend:22,pi:0});
 // 2) развитие: «почти прямой» дом — уголок показывает щель
 b.g(52,80).e('house',64,10,{w:3,h:2,bend:16,pi:1}).e('house',67,10,{w:3,h:4,bend:7,pi:2,k:'t_almost'}).g(70,86,4).g(86,100);
 // 3) поворот: дом повёрнут на 45°, а угол всё равно прямой
 b.e('house',106,10,{w:3,h:3,rot:1,lift:2.4,pi:3}).g(100,109).g(109,126,5).g(126,172);
 // 4) финал: две ступеньки подряд и окно-наклейка
 b.e('house',139,10,{w:2,h:2,bend:20,pi:4}).e('house',141,10,{w:2,h:4,bend:14,pi:0}).g(143,152,4).g(152,172);
 b.e('stk',148,3,{id:'window',k:'s_window'});
 b.coins(10,8,6,'coin_sq',1).coins(38,4,8,'coin_sq',1).coins(73,2,8,'coin_sq',1).coins(112,3,9,'coin_sq',1).coins(155,8,8,'coin_sq',1);
 b.e('enemy',18,10).e('enemy',90,10).e('enemy',160,10);
 b.e('star',44,3).e('star',117,2).e('star',145,2).e('goal',166,10);
 deco(b,[4,22,56,94,130,162]);return b};
LV['3-2']=()=>{const b=new LB(170,'3-2');b.meta={name:'3-2 Равные стороны',intro:['l32'],forms:[]};
 b.g(0,170).e('stone',14,10,{shape:'sq',give:'cube'});
 b.col(42,0,5,1).e('sqb',37,10,{door:42,k:.5});
 b.col(82,0,5,1).e('sqb',77,10,{door:82,k:.62}).pl(60,7,3);
 b.col(122,0,5,1).e('sqb',117,10,{door:122,rot:1}).pl(100,7,3).e('stk',101,6,{id:'grid',k:'s_grid'});
 b.coins(24,8,6,'coin_sq',1).coins(48,8,8,'coin_sq',1).coins(88,8,8,'coin_sq',1).coins(128,8,8,'coin_sq',1).coins(150,8,8,'coin_sq',1);
 b.e('enemy',52,10).e('enemy',94,10).e('enemy',140,10);
 b.e('star',61,5).e('star',132,6).e('star',152,6).pl(130,7,4).pl(150,7,4).e('goal',165,10);
 deco(b,[4,30,56,70,110,146,160]);return b};
LV['3-3']=()=>{const b=new LB(214,'3-3');b.meta={name:'3-3 Гонка по крышам',intro:['l33'],forms:['cube'],race:1};
 b.g(0,30).e('stone',14,10,{shape:'rect',give:'board'});
 const R=[[30,52,9],[57,78,9],[81,104,8],[107,128,8],[134,152,8],[155,176,9],[179,214,9]];
 for(const [a,c,t] of R)b.g(a,c,t);
 b.e('rbr',52,9,{gap:5});
 b.e('rbr',128,8,{gap:6,cands:[{len:3},{len:7,lie:1}]});
 b.col(92,0,4,1).col(92,5,7,12).e('tip',86,8,{k:'t_rgate',when:86}).col(190,0,5,1).col(190,6,8,12);
 b.e('rival3',20,10,{end:204});R.forEach(([a,c,t],i)=>b.coins(a+4,t-2,Math.min(10,c-a-10),'coin_sq',1));
 b.pl(112,5,3).e('stk',113,4,{id:'door',k:'s_door'});
 b.e('star',66,6).e('star',160,6).e('star',196,6).e('racegoal',207,9);
 [6,22,40,62,112,160,200].forEach((x,i)=>b.d('sign',x,R.find(r=>x>=r[0]&&x<r[1])?R.find(r=>x>=r[0]&&x<r[1])[2]:10,.9));return b};
LV['3-4']=()=>{const b=new LB(160,'3-4');b.meta={name:'3-4 Квадрат тоже прямоугольник',intro:['l34'],forms:['cube']};
 b.g(0,52).col(22,0,9,12).e('sqr',16,10,{gate:22});
 b.e('asm',42,10,{kind:'tri',cells:[[50,8],[51,8],[50,9],[51,9]]}).g(52,56,6).g(56,82).g(94,160);
 const cells=[];for(let x=82;x<94;x++)cells.push([x,10]);b.e('asm',74,10,{kind:'sq',cells});
 b.col(112,0,9,12).pl(124,7,3).e('stk',125,6,{id:'phone',k:'s_phone'});
 b.coins(8,8,6,'coin_sq',1).coins(28,8,8,'coin_sq',1).coins(58,8,8,'coin_sq',1).coins(82,7,12,'coin_sq',2).coins(100,8,8,'coin_sq',1).coins(136,8,8,'coin_sq',1);
 b.e('enemy',64,10).e('enemy',104,10).e('enemy',146,10);
 b.e('star',53,4).e('star',126,4).e('star',140,6).pl(138,7,3).e('goal',155,10);
 deco(b,[6,30,60,100,118,150]);return b};
LV['3-B']=()=>{const n=Math.max(14,Math.ceil(W/1.6/T)+1);const b=new LB(n,'3-B');b.zoom=1.6;b.gf=.78;b.meta={name:'Босс: Квадратыч',intro:['b3a','b3t'],forms:['cube'],boss:'rob3'};b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('rob3',n-3,10,{bx:Math.round(n*.36)*T+30});return b};
});
})();
