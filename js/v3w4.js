// v3 Мир 4: Подводный риф — многоугольники: сторон столько же, сколько углов (Формик в плену)
(function(){
const near=(x,d=700)=>Math.abs(x-P.x)<d;
const tapAt=(x,y)=>taps.push({x:(x-CAM.x)*Z,y:(y-CAM.y)*Z});
const pulse=(k=4)=>.5+.5*Math.sin(G.t*k);
const sm=k=>{k=clamp(k,0,1);return k*k*(3-2*k)};
const big=()=>Math.max(52,58/Z);
const wall=(gx,v)=>{for(let y=0;y<=9;y++)setT(gx,y,v)};
const showHand=(s,k,d)=>WX.showHand(s,k,d);
function ngon(n,cx,cy,r,a0,fs){const a=[];for(let i=0;i<n;i++){const t=a0+i*2*Math.PI/n+(fs&&fs.a?fs.a[i]:0),rr=r*(fs&&fs.r?fs.r[i]:1);a.push([cx+Math.cos(t)*rr,cy+Math.sin(t)*rr])}return a}
function segD(px,py,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1;let t=((px-a[0])*dx+(py-a[1])*dy)/l;t=clamp(t,0,1);return Math.hypot(px-a[0]-t*dx,py-a[1]-t*dy)}
function path(v){X.beginPath();v.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath()}
function rod(a,b,col,w,glow){X.save();X.lineCap='round';if(glow){X.shadowColor=col;X.shadowBlur=glow}X.strokeStyle='#7a2a20';X.lineWidth=w+6;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.stroke();
 X.strokeStyle=col;X.lineWidth=w;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.stroke();X.shadowBlur=0;X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=w*.3;X.beginPath();X.moveTo(a[0],a[1]-w*.2);X.lineTo(b[0],b[1]-w*.2);X.stroke();X.restore()}
WX.STK.push(['shell','stk_shell','4-1'],['psign','stk_psign','4-2'],['box','stk_box','4-3'],['honey','stk_honey','4-4']);
// ===== 4-1/4-4: звезда из палочек — тап по палочке, она летит на своё место, загорается угол =====
EX.pstk={setup(o){o.gx=Math.floor(o.x/T)+3;wall(o.gx,15);o.cx=o.gx*T+30;o.cy=o.cy||385;o.r=o.r||125;o.n=o.n||5;o.lit=0;o.done=0;o.fy=0;o.t=0;
  o.V=ngon(o.n,o.cx,o.cy,o.r,-Math.PI/2,o.fs);const L0=o.cx-170-56*(o.n-1)-(o.decoy?56:0);
  o.S=o.V.map((q,i)=>{const b=o.V[(i+1)%o.n],len=Math.hypot(b[0]-q[0],b[1]-q[1]);return {i,len,st:0,t:0}});
  const ord=o.S.map((s,i)=>i);if(o.mix)ord.reverse();let k=0;const slots=[];for(let j=0;j<o.S.length+(o.decoy?1:0);j++)slots.push(L0+j*56);
  if(o.decoy){o.D={x:slots[1],len:120,dead:0,sh:0};slots.splice(1,1)}
  ord.forEach((si,j)=>{const s=o.S[si];s.bx=slots[j];s.ba=((j*37)%5-2)*.07})},
 lie(o,s){const h=Math.min(s.len,150),a=s.ba;return [[s.bx-Math.sin(a)*h*.0,598],[s.bx+Math.sin(a)*h,598-Math.cos(a)*h]]},
 slot(o,s){const a=o.V[s.i],b=o.V[(s.i+1)%o.n],k=o.fy;return [[a[0],a[1]-k],[b[0],b[1]-k]]},
 top(o){return o.done&&o.fy>200?null:o.cy-o.r-110},
 upd(o,dt){o.t+=dt;if(o.done){o.fy+=dt*(160+o.fy*1.5);return}
  if(!o.said&&near(o.cx,760)&&P.x<o.cx){o.said=1;say(o.fs?'t_irr':o.k||'t_stick')}
  if(o.D&&o.D.sh>0)o.D.sh-=dt;
  for(const s of o.S)if(s.st==1){s.t+=dt*1.6;if(s.t>=1){s.st=2;o.lit++;SFX.light(o.lit);say('n'+o.lit);const q=o.V[(s.i+1)%o.n];part(q[0],q[1],16,'#fff3a0',300,.6,0);
   if(o.lit==o.n){o.done=1;wall(o.gx,0);SFX.win();shake(6);hush();say(o.fs?'r_irr':o.n==6?'r_p6':'r_p5');part(o.cx,o.cy,40,'#ffb36b',500,1,0,10);HUD.got=(HUD.got||0)+1}}}},
 tap(o,wx,wy){if(o.done||Math.abs(o.cx-P.x)>WV)return false;let best=null,bd=56;
  for(const s of o.S){if(s.st)continue;const [a,b]=EX.pstk.lie(o,s),d=segD(wx,wy,a,b);if(d<bd){bd=d;best=s}}
  if(o.D&&!o.D.dead){const d=Math.hypot(wx-o.D.x-10,wy-540);if(d<bd+10){o.D.sh=.6;SFX.no();say('t_crv');return true}}
  if(!best)return false;best.st=1;best.t=0;SFX.boom();HAND=null;return true},
 hint(o){if(o.done||!near(o.cx,760)||P.x>o.cx)return;const s=o.S.find(s=>!s.st);if(!s)return;const [a,b]=EX.pstk.lie(o,s),[c,d]=EX.pstk.slot(o,s);
  showHand([[(a[0]+b[0])/2,(a[1]+b[1])/2],[(c[0]+d[0])/2,(c[1]+d[1])/2]],o.fs?'t_irr':'t_stick');return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>760||d<-60)return;WX.go(o.cx-560,30);BOT.j=0;G.bt=(G.bt||0)+dt;
  if(G.bt>.8&&Math.abs(P.x-(o.cx-560))<80){G.bt=0;const s=o.S.find(s=>!s.st);if(s){const [a,b]=EX.pstk.lie(o,s);tapAt(a[0]*.4+b[0]*.6,a[1]*.4+b[1]*.6)}}return true},
 draw(o){if(o.fy>900||o.cx<CAM.x-400||o.cx>CAM.x+WV+400)return;const cy=o.cy-o.fy,V=o.V.map(q=>[q[0],q[1]-o.fy]);X.save();
  if(!o.done){X.fillStyle='#8a6a8f';X.beginPath();X.roundRect(o.cx-30,cy+o.r*.7,60,600-cy-o.r*.7,14);X.fill();
   X.fillStyle='rgba(255,255,255,.08)';path(V);X.fill();X.setLineDash([12,12]);X.strokeStyle='rgba(255,255,255,'+(.45+.3*pulse(3))+')';X.lineWidth=6;path(V);X.stroke();X.setLineDash([])}
  else{const g=X.createRadialGradient(o.cx,cy,10,o.cx,cy,o.r);g.addColorStop(0,'#ffd08a');g.addColorStop(1,'#ff8a4c');X.fillStyle=g;path(V);X.fill();
   X.fillStyle='#fff';X.beginPath();X.arc(o.cx-20,cy-6,13,0,7);X.arc(o.cx+20,cy-6,13,0,7);X.fill();X.fillStyle='#2a1a3a';X.beginPath();X.arc(o.cx-18,cy-4,7,0,7);X.arc(o.cx+22,cy-4,7,0,7);X.fill();
   X.strokeStyle='#7a2a20';X.lineWidth=4;X.beginPath();X.arc(o.cx,cy+12,12,.2,Math.PI-.2);X.stroke()}
  for(const s of o.S){if(s.st==0){const [a,b]=EX.pstk.lie(o,s);rod(a,b,'#ff9a5a',16,10+8*pulse(4+s.i))}
   else{const [a,b]=EX.pstk.lie(o,s),[c,d]=EX.pstk.slot(o,s),k=s.st==2?1:sm(s.t),arc=Math.sin(k*Math.PI)*90;
    rod([lerp(a[0],c[0],k),lerp(a[1],c[1],k)-arc],[lerp(b[0],d[0],k),lerp(b[1],d[1],k)-arc],s.st==2?'#ffcc33':'#ffb36b',16,s.st==2?18:8)}}
  if(o.D&&!o.D.dead){const sh=o.D.sh>0?Math.sin(o.D.sh*40)*8:0,x=o.D.x+sh;X.save();X.lineCap='round';X.strokeStyle='#7a2a20';X.lineWidth=22;X.beginPath();X.moveTo(x,598);X.bezierCurveTo(x+60,560,x-50,520,x+20,478);X.stroke();
   X.strokeStyle='#d98a52';X.lineWidth=16;X.beginPath();X.moveTo(x,598);X.bezierCurveTo(x+60,560,x-50,520,x+20,478);X.stroke();X.restore()}
  o.S.forEach(s=>{if(s.st!=2)return;const q=V[(s.i+1)%o.n];X.save();X.shadowColor='#fff3a0';X.shadowBlur=24;X.fillStyle='#fff3a0';X.beginPath();X.arc(q[0],q[1],15,0,7);X.fill();X.restore()});
  if(!o.done){txt(o.lit+' из '+o.n,o.cx,cy-o.r-50,big(),'#fff3a0');panelHide(o.cx-o.r,cy-o.r-90,2*o.r)}
  X.restore()}};
// ===== 4-2: рыбки-фигуры — пятиугольные в левый грот, шестиугольные в правый =====
EX.fsort={setup(o){o.cx=o.x;o.gx=Math.floor((o.cx+290)/T);wall(o.gx,15);o.i=0;o.st='idle';o.t=0;o.c5=0;o.c6=0;o.sh=0;o.done=0;o.gy=530},
 g(o,s){return [o.cx+(s==5?-185:185),o.gy]},
 fish(o){return o.fish[o.i]},
 fp(o){const f=EX.fsort.fish(o);if(!f)return [o.cx,330];if(o.st=='go'){const [gx,gy]=EX.fsort.g(o,f.n),k=sm(o.t/.9);return [lerp(o.cx,gx,k),lerp(330,gy,k)+Math.sin(k*Math.PI)*-60]}
  return [o.cx+(o.st=='no'?Math.sin(o.t*40)*10:0),330+Math.sin(G.t*2)*10]},
 top(o){return o.done?null:250},
 upd(o,dt){o.t+=dt;if(o.done)return;if(!o.said&&near(o.cx,780)&&P.x<o.cx){o.said=1;say(o.k||'t_sort')}
  const f=EX.fsort.fish(o);if(f&&f.weed&&!o.sw&&o.said&&near(o.cx,700)){o.sw=1;say('t_weed')}
  if(o.st=='no'&&o.t>.6){o.st='idle'}
  if(o.st=='go'&&o.t>=.9){o.st='idle';o.t=0;f.n==5?o.c5++:o.c6++;SFX.light(o.c5+o.c6);const [gx,gy]=EX.fsort.g(o,f.n);part(gx,gy-60,18,'#fff3a0',300,.6,0);o.i++;
   if(o.i>=o.fish.length){o.done=1;wall(o.gx,0);SFX.win();shake(5);hush();say(o.fish.some(f=>f.weed)?'r_weed':'r_p6');HUD.got=(HUD.got||0)+1}}},
 tap(o,wx,wy){if(o.done||o.st!='idle'||Math.abs(o.cx-P.x)>WV)return false;if(Math.abs(wx-o.cx)>360||wy<240)return false;if(Math.abs(wx-o.cx)<50)return false;
  const s=wx<o.cx?5:6,f=EX.fsort.fish(o);if(s==f.n){o.st='go';o.t=0;SFX.boom();HAND=null;say(s==5?'r_s5':'r_s6')}else{o.st='no';o.t=0;SFX.no();o.miss=(o.miss||0)+1;say('r_sno')}return true},
 hint(o){if(o.done||!near(o.cx,780)||P.x>o.cx)return;const f=EX.fsort.fish(o),[fx,fy]=EX.fsort.fp(o),[gx,gy]=EX.fsort.g(o,f.n);showHand([[fx,fy],[gx,gy-40]],f.weed?'t_weed':'t_sort');return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>780||d<-60)return;WX.go(o.cx-420,30);BOT.j=0;G.bt=(G.bt||0)+dt;
  if(G.bt>1&&o.st=='idle'&&Math.abs(P.x-(o.cx-420))<80){G.bt=0;const f=EX.fsort.fish(o),[gx,gy]=EX.fsort.g(o,f.n);tapAt(gx,gy-30)}return true},
 draw(o){if(o.cx<CAM.x-500||o.cx>CAM.x+WV+500)return;X.save();
  for(const s of [5,6]){const [gx,gy]=EX.fsort.g(o,s),cnt=s==5?o.c5:o.c6,need=o.fish.filter(f=>f.n==s).length;
   X.fillStyle='#5a4a6a';X.beginPath();X.ellipse(gx,600,120,150,0,Math.PI,0);X.fill();X.fillStyle='#2a1f3f';X.beginPath();X.ellipse(gx,600,80,108,0,Math.PI,0);X.fill();
   X.fillStyle='rgba(255,243,160,'+(need?cnt/need*.6:0)+')';X.beginPath();X.ellipse(gx,600,80,108,0,Math.PI,0);X.fill();
   X.save();X.shadowColor='#fff3a0';X.shadowBlur=14;X.fillStyle=s==5?'#7fd3ff':'#ffcc33';X.strokeStyle='#fff';X.lineWidth=5;path(ngon(s,gx,gy-150,34,-Math.PI/2));X.fill();X.stroke();X.restore();
   txt(String(s),gx,gy-150,30,'#3a1d55','center','#fff')}
  const f=EX.fsort.fish(o);if(f){const [x,y]=EX.fsort.fp(o),fl=Math.sin(G.t*8)*.25;X.save();X.translate(x,y);
   X.fillStyle=f.n==5?'#7fd3ff':'#ffcc33';X.strokeStyle='#3a1d55';X.lineWidth=5;X.beginPath();X.moveTo(-50,0);X.lineTo(-92,-30+fl*20);X.lineTo(-92,30-fl*20);X.closePath();X.fill();X.stroke();
   const v=ngon(f.n,0,0,62,-Math.PI/2+(f.n==6?Math.PI/6:0),f.fs);path(v);X.fill();X.stroke();X.fillStyle='rgba(255,255,255,.3)';path(ngon(f.n,-6,-6,40,-Math.PI/2+(f.n==6?Math.PI/6:0)));X.fill();
   X.fillStyle='#fff';X.beginPath();X.arc(22,-10,12,0,7);X.fill();X.fillStyle='#2a1a3a';X.beginPath();X.arc(25,-9,6,0,7);X.fill();
   if(f.weed){X.lineCap='round';for(let j=0;j<4;j++){X.strokeStyle=j%2?'#2f9a5a':'#5fd08a';X.lineWidth=16;X.beginPath();X.moveTo(-30+j*14,90);X.quadraticCurveTo(-60+j*20+Math.sin(G.t*2+j)*10,10,-40+j*18,-80);X.stroke()}}
   X.restore()}
  if(!o.done)panelHide(o.cx-300,200,600);
  X.restore()}};
// ===== 4-3: Звёздный Щит на подставке — тап поворачивает, золотая сторона отбивает осколок в кнопку =====
EX.mir={setup(o){o.cx=o.x;o.cy=470;o.r=78;o.th=(o.th??-30)*Math.PI/180;o.k=0;o.ra=0;o.need=o.need||1;o.a0=o.th-Math.PI/5-o.need*2*Math.PI/5;o.done=0;o.sh=null;o.cd=1.5;o.D=250;
  o.bx=o.cx+Math.cos(o.th)*o.D;o.by=o.cy+Math.sin(o.th)*o.D;o.gx=Math.floor(o.bx/T)+1;for(let y=0;y<=9;y++)setT(o.gx,y,15)},
 rot(o){return o.a0+o.ra*2*Math.PI/5},
 nrm(o){return EX.mir.rot(o)+Math.PI/5},
 ok(o){return Math.abs(Math.atan2(Math.sin(EX.mir.nrm(o)-o.th),Math.cos(EX.mir.nrm(o)-o.th)))<.08},
 top(o){return o.done?null:Math.min(o.by-80,o.cy-o.r-260)},
 upd(o,dt){if(o.ra<o.k)o.ra=Math.min(o.k,o.ra+dt*3);if(o.done)return;if(!o.said&&near(o.cx,760)&&P.x<o.cx){o.said=1;say('t_mir')}
  if(!o.sh){o.cd-=dt;if(o.cd<=0&&o.said)o.sh={x:o.cx,y:o.cy-420,vx:0,vy:240,warn:.5,b:0}}
  else{const s=o.sh;if(s.warn>0){s.warn-=dt;return}s.x+=s.vx*dt;s.y+=s.vy*dt;
   if(!s.b&&s.y>=o.cy-o.r*.85){const a=EX.mir.nrm(o);if(o.ra<o.k){s.dead=1}else{s.b=1;s.vx=Math.cos(a)*620;s.vy=Math.sin(a)*620;tone(1568,.25,'triangle',.08);part(s.x,s.y,10,'#fff3a0',260,.5,0,6);s.hit=EX.mir.ok(o)}}
   if(s.b&&s.hit&&Math.hypot(s.x-o.bx,s.y-o.by)<40){s.dead=1;o.done=1;for(let y=0;y<=9;y++)setT(o.gx,y,0);SFX.win();shake(8);hush();say('r_mir');part(o.bx,o.by,40,'#7ff0a2',460,1,0,10);HUD.got=(HUD.got||0)+1}
   if(s.b&&!s.hit&&(Math.hypot(s.x-o.cx,s.y-o.cy)>420||s.y>600)){s.dead=1;o.miss=(o.miss||0)+1;if(o.miss%2==1)say('r_mirno')}
   if(s.y>640)s.dead=1;
   if(s.dead){part(s.x,Math.min(s.y,590),10,'#d29bff',220,.5,300,5);o.sh=null;o.cd=1.6}}},
 tap(o,wx,wy){if(o.done||Math.abs(o.cx-P.x)>WV)return false;if(Math.hypot(wx-o.cx,wy-o.cy)>o.r+70)return false;o.k++;SFX.light(2);HAND=null;return true},
 hint(o){if(o.done||!near(o.cx,760)||P.x>o.cx)return;showHand([[o.cx,o.cy]],'t_mir');return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>760||d<-60)return;WX.go(o.cx-330,30);BOT.j=0;G.bt=(G.bt||0)+dt;
  if(G.bt>.9&&!EX.mir.ok(o)&&o.ra>=o.k&&Math.abs(P.x-(o.cx-330))<80){G.bt=0;tapAt(o.cx,o.cy)}return true},
 draw(o){if(o.cx<CAM.x-500||o.cx>CAM.x+WV+500)return;X.save();
  // кнопка-цель на колонне
  X.fillStyle='#4a3a6a';X.fillRect(o.gx*T,0,T,600);X.save();X.shadowColor=o.done?'#7ff0a2':'#ff7ad9';X.shadowBlur=20+10*pulse(5);X.fillStyle=o.done?'#7ff0a2':'#ff7ad9';X.strokeStyle='#fff';X.lineWidth=5;
  X.beginPath();X.arc(o.bx,o.by,30,0,7);X.fill();X.stroke();X.restore();
  // подставка и щит
  X.fillStyle='#6a5a7a';X.beginPath();X.roundRect(o.cx-26,o.cy+o.r*.6,52,600-o.cy-o.r*.6,10);X.fill();
  const v=ngon(5,o.cx,o.cy,o.r,EX.mir.rot(o));X.save();const g=X.createRadialGradient(o.cx,o.cy,8,o.cx,o.cy,o.r);g.addColorStop(0,'#e8f6ff');g.addColorStop(1,'#7fb8ff');X.fillStyle=g;X.strokeStyle='#3a5a9a';X.lineWidth=6;X.lineJoin='round';path(v);X.fill();X.stroke();
  X.lineCap='round';X.shadowColor='#ffcc33';X.shadowBlur=22;X.strokeStyle='#ffcc33';X.lineWidth=14;X.beginPath();X.moveTo(v[0][0],v[0][1]);X.lineTo(v[1][0],v[1][1]);X.stroke();X.restore();
  if(!o.done){const a=EX.mir.nrm(o),m=[(v[0][0]+v[1][0])/2,(v[0][1]+v[1][1])/2];X.save();X.globalAlpha=.5+.3*pulse(4);X.setLineDash([12,12]);X.strokeStyle=EX.mir.ok(o)?'#7ff0a2':'#fff';X.lineWidth=5;
   X.beginPath();X.moveTo(m[0],m[1]);X.lineTo(m[0]+Math.cos(a)*150,m[1]+Math.sin(a)*150);X.stroke();X.restore()}
  const s=o.sh;if(s){if(s.warn>0){X.fillStyle='rgba(120,40,160,'+(.3+.25*Math.sin(G.t*20))+')';X.beginPath();X.arc(o.cx,o.cy-o.r-40,16,0,7);X.fill()}
   else{X.save();X.translate(s.x,s.y);X.rotate(G.t*6);X.shadowColor='#e0b0ff';X.shadowBlur=14;X.fillStyle='#c77dff';X.strokeStyle='#3a1d55';X.lineWidth=3;X.beginPath();X.moveTo(0,-24);X.lineTo(15,13);X.lineTo(-13,17);X.closePath();X.fill();X.stroke();X.restore()}}
  X.restore()}};
// ===== 4-4: клетка Формика — 2 угла под водорослями, 6 сторон бумерангом, затем число на замке =====
const C=EX.cage;
EX.cage4=Object.assign({},C,{
 setup(o){C.setup(o);o.lock=0;o.lsh=0},
 upd(o,dt){if(o.lock==1){o.t+=dt;if(o.lsh>0)o.lsh-=dt;return}C.upd(o,dt);if(o.lit==6&&o.done==1&&!o.lock){o.lock=1;o.done=0;wall(o.gx,15);L.meta.noFM=1;HAND=null;hush();say('t_lock')}},
 nums(o){return [4,5,6].map((n,i)=>({n,x:o.cx-150+i*150,y:o.cy-o.r-80}))},
 tap(o,wx,wy){if(o.lock==1){for(const b of EX.cage4.nums(o))if(Math.hypot(wx-b.x,wy-b.y)<60){if(b.n==6){o.lock=2;o.done=1;o.t=0;wall(o.gx,0);L.meta.noFM=0;FM.x=o.cx;FM.y=o.cy-80;FM.catch=0;SFX.win();shake(10);hush();say('r_lock');say('w4s');part(o.cx,o.cy,60,'#fff3a0',600,1.2,0,12);HUD.got=(HUD.got||0)+1}
    else{o.lsh=.6;SFX.no();say('r_lockno')}return true}return false}
  if(o.lit==0&&!o.s6&&near(o.cx,700)){o.s6=1}return C.tap(o,wx,wy)},
 hint(o){if(o.lock==1){const b=EX.cage4.nums(o)[2];showHand([[b.x,b.y]],'t_lock');return true}if(!o.done&&near(o.cx,700)&&!o.said6){o.said6=1;say('t_cage6')}return C.hint(o)},
 bot(o,dt){if(o.lock==1){BOT.r=0;BOT.l=0;BOT.j=0;G.bt=(G.bt||0)+dt;if(G.bt>1){G.bt=0;const b=EX.cage4.nums(o)[2];tapAt(b.x,b.y)}return true}return C.bot(o,dt)},
 top(o){return o.lock==1?o.cy-o.r-150:C.top(o)},
 draw(o){if(o.lock==1){const {cx,cy,r}=o;X.save();X.fillStyle='#4a2a6a';X.beginPath();X.roundRect(cx-40,cy+r*.85,80,600-cy-r*.85,10);X.fill();img('fm'+(Math.floor(G.t*2)%4),cx,cy+70,140);
   const v=ngon(6,cx,cy,r,-Math.PI/2);X.lineCap='round';X.lineWidth=16;X.strokeStyle='#ffd35a';X.shadowColor='#ffd35a';X.shadowBlur=24;path(v);X.stroke();X.restore();
   for(const b of EX.cage4.nums(o)){const sh=o.lsh>0&&b.n!=6?Math.sin(o.lsh*40)*6:0;panel(b.x-52+sh,b.y-52,104,104,24);txt(String(b.n),b.x+sh,b.y+2,70,'#3a1d55','center','#fff')}
   panelHide(cx-220,cy-r-150,440)}
  else C.draw(o);
  if(!o.done&&o.lock!=1){const v=ngon(6,o.cx,o.cy,o.r,-Math.PI/2);for(const i of [1,2]){const q=v[i];X.save();X.lineCap='round';for(let j=0;j<5;j++){X.strokeStyle=j%2?'#2f9a5a':'#5fd08a';X.lineWidth=18;X.beginPath();X.moveTo(q[0]-30+j*15,600);X.quadraticCurveTo(q[0]-40+j*18+Math.sin(G.t*1.5+j)*12,q[1]+80,q[0]-24+j*12,q[1]-50);X.stroke()}X.restore()}}}});
// ===== 4-B: краб примеряет домики =====
const K=EX.crab;
EX.crab4=Object.assign({},K,{
 hs(o){const x0=CAM.x+WV*.18;return [{n:6,crv:1},{n:5},{n:6}].map((h,i)=>({...h,x:x0+i*Math.min(170,WV*.17),y:600-o.h-40}))},
 upd(o,dt){if(o.st=='pick'){o.t+=dt;const p=P;if(p.x>o.x-190)p.x=o.x-190;if(o.sh>0)o.sh-=dt;return}
  if(o.st=='wear'){o.t+=dt;if(o.t>1){o.st='fight';o.stun=7;say('b4l')}return}
  K.upd(o,dt);if(o.stun>0&&!o.picked&&o.st=='fight'){o.picked=1;o.st='pick';o.t=0;o.stun=0;o.pearls=[];hush();say('b4p')}
  if(o.picked&&o.st=='fight')o.stun=7;
  if(o.st=='calm'&&!o.r4){o.r4=1;say('rule4')}},
 tap(o,wx,wy){if(o.st=='pick'){const H=EX.crab4.hs(o);for(let i=0;i<3;i++){const h=H[i];if(Math.hypot(wx-h.x,wy-h.y)<75){if(h.n==6&&!h.crv){o.st='wear';o.t=0;o.hx=h.x;o.hy=h.y;SFX.win();HAND=null;hush();say('b4ok')}else{o.sh=.6;o.shi=i;SFX.no();say(h.crv?'b4nc':'b4n5')}return true}}return false}
  if(o.st=='wear')return false;return K.tap(o,wx,wy)},
 hint(o){if(o.st=='pick'){const h=EX.crab4.hs(o)[2];showHand([[h.x,h.y],[o.x,600-o.h*.5]],'b4p',1);return true}if(o.st=='wear')return true;return K.hint(o)},
 bot(o,dt){if(o.st=='pick'){BOT.r=0;BOT.l=0;BOT.j=0;G.bt=(G.bt||0)+dt;if(G.bt>1.2&&!speaking()){G.bt=0;const h=EX.crab4.hs(o)[2];tapAt(h.x,h.y)}return true}if(o.st=='wear'){BOT.r=0;return true}return K.bot(o,dt)},
 draw(o){if(o.st=='pick'||o.st=='wear'){X.save();X.translate(o.x,600);img('crab_0',0,0,o.h,0);X.restore();
   const H=EX.crab4.hs(o);H.forEach((h,i)=>{let x=h.x,y=h.y,r=58;if(o.st=='wear'){if(!(h.n==6&&!h.crv))return;const [cx,cy,rr]=K.hc(o),k=sm(o.t);x=lerp(o.hx,cx,k);y=lerp(o.hy,cy,k)-Math.sin(k*Math.PI)*80;r=lerp(58,rr,k)}
    else if(o.sh>0&&o.shi==i)x+=Math.sin(o.sh*40)*8;
    const v=ngon(h.n,x,y,r,-Math.PI/2);X.save();const g=X.createRadialGradient(x,y,6,x,y,r);g.addColorStop(0,'#fff0e0');g.addColorStop(1,['#f7a8c4','#9fd0ff','#ffe08a'][i]);X.fillStyle=g;X.strokeStyle='#7d2f52';X.lineWidth=6;X.lineJoin='round';
    if(h.crv){X.beginPath();X.moveTo(v[0][0],v[0][1]);X.quadraticCurveTo((v[0][0]+v[1][0])/2+r*.55,(v[0][1]+v[1][1])/2-r*.35,v[1][0],v[1][1]);for(let j=2;j<=h.n;j++)X.lineTo(v[j%h.n][0],v[j%h.n][1]);X.closePath()}else path(v);
    X.fill();X.stroke();X.restore()});
   if(o.st=='pick')panelHide(CAM.x,600-o.h-120,WV*.7);return}
  K.draw(o)}});
WX.add(()=>{
const pw=WX.wantF;WX.wantF=function(want,fx,fy){if(WX.wn()==4){const p=P;for(const o of ENTS)if(o.type=='mir'&&!o.done&&o.cx-p.x<9*T&&o.cx-p.x>-60&&L.forms.includes('shield'))return 'shield'}return pw?pw(want,fx,fy):want};
const reef=(b,xs)=>b.e('reef',0,10,{xs});
LV['4-1']=()=>{const b=new LB(156,'4-1');b.meta={name:'4-1 Сломанные звёзды',intro:['w4','t_swim','l41v'],forms:[],water:true,noFM:1};
 b.g(0,156).g(44,48,8).g(112,116,9);
 // 1) знакомство: правильная звезда-пятиугольник
 b.e('pstk',24,10,{n:5});
 // 2) развитие: палочки вперемешку и кривая палочка-обманка
 b.e('pstk',58,10,{n:5,mix:1,decoy:1});
 // 3) поворот: кривобокая звезда — стороны разные, но их всё равно 5
 b.e('pstk',90,10,{n:5,fs:{r:[1,.78,1.12,.86,1.05],a:[0,.12,-.05,.1,-.1]}});
 // 4) финал: шестиугольник
 b.e('pstk',124,10,{n:6,r:118});
 b.pl(70,6,3).e('stk',71,5,{id:'shell',k:'s_shell'});
 b.coins(8,7,6,'coin_circ',2).coins(36,6,6,'coin_circ',1).coins(70,4,6,'coin_circ',0).coins(100,6,8,'coin_circ',2).coins(136,7,8,'coin_circ',2);
 b.e('enemy',14,9).e('enemy',80,8).e('enemy',140,9);
 b.e('star',46,6).e('star',96,3).e('star',132,3).e('goal',150,10);
 reef(b,[3,12,18,36,47,52,66,78,84,100,108,116,134,144]);return b};
LV['4-2']=()=>{const b=new LB(166,'4-2');b.meta={name:'4-2 Пять или шесть?',intro:['l42v'],forms:[],water:true,noFM:1};
 b.g(0,166);
 // 1) знакомство: по одной рыбке каждого вида
 b.e('fsort',30,10,{fish:[{n:5},{n:6}]});
 // 2) развитие: три рыбки вперемешку
 b.e('fsort',66,10,{fish:[{n:6},{n:5},{n:6}]});
 // 3) поворот: водоросль закрывает уголки — считаем стороны
 b.e('fsort',102,10,{fish:[{n:6,weed:1},{n:5,weed:1}],k:'t_weed'});
 // 4) финал: кривобокие рыбки
 b.e('fsort',138,10,{fish:[{n:5,fs:{r:[1,.8,1.1,.85,1.05]}},{n:6,fs:{r:[1,.85,1.1,.9,1.05,.8]}},{n:5,weed:1}]});
 b.pl(84,6,3).e('stk',85,5,{id:'psign',k:'s_psign'});
 b.coins(8,7,8,'coin_circ',2).coins(44,6,8,'coin_circ',2).coins(80,7,6,'coin_circ',2).coins(118,6,8,'coin_circ',2).coins(152,7,8,'coin_circ',2);
 b.e('enemy',16,9).e('enemy',120,8);
 b.e('star',50,6).e('star',108,3).e('star',146,6).e('goal',160,10);
 reef(b,[4,14,22,46,52,82,90,118,124,152,156]);return b};
LV['4-3']=()=>{const b=new LB(172,'4-3');b.meta={name:'4-3 Звёздный Щит',intro:['l43v'],forms:[],water:true,noFM:1,tk:{shield:'t_sh4'}};
 b.g(0,172).e('stone',12,10,{shape:'pent',give:'shield'});
 // 1) знакомство: осколки падают, щит их отбивает
 b.e('shards',0,0,{x0:28,x1:50});
 // 2) развитие: щит на подставке, один поворот до кнопки
 b.e('mir',66,10,{th:-35,need:1});
 // 3) поворот: кнопка в другой стороне — повернуть три раза
 b.e('mir',104,10,{th:-60,need:3});
 // 4) финал: осколки и прыжки по уступам
 b.e('shards',0,0,{x0:120,x1:150}).g(132,136,8);
 b.pl(88,6,3).e('stk',89,5,{id:'box',k:'s_box'});
 b.coins(30,7,10,'coin_circ',2).coins(54,7,6,'coin_circ',2).coins(90,4,6,'coin_circ',1).coins(122,7,10,'coin_circ',2).coins(156,7,8,'coin_circ',2);
 b.e('enemy',22,9).e('enemy',160,9);
 b.e('star',40,7).e('star',112,3).e('star',134,6).e('goal',166,10);
 reef(b,[4,20,24,56,60,84,96,118,152,160]);return b};
LV['4-4']=()=>{const b=new LB(176,'4-4');b.meta={name:'4-4 Спасение Формика',intro:['l44v'],forms:['shield'],water:62,noFM:1};
 b.g(0,176);
 // 1) знакомство: шестиугольник из палочек
 b.e('pstk',14,10,{n:6,r:118,mix:1});
 // 2–3) клетка: два угла под водорослями, считаем стороны → число на замке
 b.e('cage4',50,10);
 // 4) финал: медовые стенки Соткой
 b.g(78,92,5).col(78,5,9,19).e('honey',77,10);
 b.g(104,124,6).col(104,6,9,19).e('honey',103,10).g(116,124,3).col(116,3,5,19).e('honey',115,6);
 b.g(140,150,5).col(140,5,9,19).e('honey',139,10);
 b.e('stk',120,2,{id:'honey',k:'s_honey'});
 b.coins(4,7,6,'coin_circ',2).coins(30,6,8,'coin_circ',2).coins(80,3,8,'coin_circ',1).coins(142,3,7,'coin_circ',1).coins(156,8,8,'coin_circ',1);
 b.e('enemy',40,9).e('enemy',96,10).e('enemy',162,10);
 b.e('star',34,6).e('star',108,4).e('star',145,3).e('goal',170,10);
 reef(b,[4,12,26,38,46,58]);return b};
LV['4-B']=()=>{const n=Math.max(13,Math.ceil(W/1.95/T)+1);const b=new LB(n,'4-B');b.zoom=1.95;b.gf=.8;b.meta={name:'Босс: Краб Отшельник',intro:['b4a','t_shield'],forms:['shield','hex'],startForm:'shield',boss:'crab4',water:true};
 b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('crab4',n-3,10);reef(b,[2,5]);return b};
});
})();
