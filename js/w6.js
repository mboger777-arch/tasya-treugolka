// Мир 6: Замок Осколка
(function(){
const big=()=>Math.max(52,58/Z);
const wall=(gx,v,y1=9)=>{for(let y=0;y<=y1;y++)setT(gx,y,v)};
const PAL=['#c58cff','#7fd3ff','#ff8a8a','#ffcc33','#7ff0a2'];
const SHC={tri:'#ff8a8a',sq:'#7ff0a2',rect:'#ffcc33',pent:'#7fd3ff',hex:'#c58cff',circle:'#ffa726',oval:'#ff7ac8'};
function crystal(x,y,w,h,col,a=1){X.save();X.globalAlpha*=a;const g=X.createLinearGradient(x-w,y-h,x+w,y);g.addColorStop(0,'#ffffff');g.addColorStop(.35,col);g.addColorStop(1,shade(col,-.45));X.fillStyle=g;X.beginPath();X.moveTo(x,y-h);X.lineTo(x+w,y-h*.4);X.lineTo(x,y);X.lineTo(x-w,y-h*.4);X.closePath();X.fill();X.strokeStyle='rgba(255,255,255,.75)';X.lineWidth=2;X.stroke();X.restore()}
function card(x,y,w,h,hl,sh){X.save();X.translate(x+(sh>0?Math.sin(G.t*50)*6:0),y);X.fillStyle=sh>0?'rgba(255,170,170,.95)':'rgba(255,255,255,.93)';X.shadowColor=hl?'#ffd35a':'#c58cff';X.shadowBlur=hl?24:12;X.beginPath();X.roundRect(-w/2,-h/2,w,h,18);X.fill();X.shadowBlur=0;X.strokeStyle=hl?'#ffb300':'#7a4fb0';X.lineWidth=5;X.stroke();X.restore()}
function heartPath(cx,cy,s){X.beginPath();X.moveTo(cx,cy+110*s);X.bezierCurveTo(cx-155*s,cy+5*s,cx-120*s,cy-115*s,cx,cy-62*s);X.bezierCurveTo(cx+120*s,cy-115*s,cx+155*s,cy+5*s,cx,cy+110*s);X.closePath()}
function fworks(t,W0,H0,n,s){for(let k=0;k<n;k++){const per=1.7,ph=((t+k*.31)%per)/per,cyc=Math.floor((t+k*.31)/per),fr=v=>v-Math.floor(v);
  const cx=W0*(.12+.76*fr(k*.618+cyc*.377)),cy=H0*(.14+.3*fr(k*.37+cyc*.519)),col=PAL[(k+cyc)%5];
  X.save();X.globalAlpha=Math.max(0,1-ph);X.fillStyle=col;X.shadowColor=col;X.shadowBlur=14*s;for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=ph*120*s;X.beginPath();X.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r+ph*ph*30*s,5*s*(1-ph*.5),0,7);X.fill()}X.restore()}}
function shapeCol(sh){return SHC[sh]||'#c58cff'}
// ---- фон мира 6: фиолетовая дымка и падающие кристаллы
WX.bg6=function(dy){X.save();X.fillStyle='rgba(70,30,120,.2)';X.fillRect(0,0,W,H);
 for(let i=0;i<10;i++){const x=((i*241-CAM.x*.25)%(W+200)+W+200)%(W+200)-100,y=(G.t*(30+i*6)+i*137)%(H+120)-60;crystal(x,y,7+i%3*4,18+i%4*6,PAL[i%5],.35)}X.restore()};
// ---- декор: колонны замка
EX.castle={setup(o){o.nc=1},draw(o){for(const [tx,row] of o.xs){const x=tx*T+30,gy=row*T;if(x<CAM.x-150||x>CAM.x+WV+150)continue;const h=230;X.save();
 const g=X.createLinearGradient(x-26,0,x+26,0);g.addColorStop(0,'#4a2a78');g.addColorStop(.5,'#b48ae8');g.addColorStop(1,'#3e2266');X.fillStyle=g;X.fillRect(x-22,gy-h,44,h);
 X.strokeStyle='rgba(30,10,60,.35)';X.lineWidth=3;X.beginPath();X.moveTo(x-8,gy-h+40);X.lineTo(x+6,gy-h+90);X.lineTo(x-4,gy-h+130);X.stroke();
 X.fillStyle='#3a1d55';X.beginPath();X.roundRect(x-32,gy-h-14,64,18,6);X.fill();X.beginPath();X.roundRect(x-30,gy-12,60,12,4);X.fill();
 crystal(x,gy-h-12,20,58,PAL[tx%5]);X.restore()}}};
// ---- рушащийся замок (погоня вида 2)
WX.drawCollapse=function(B){const fx=B.x+150,top=CAM.y-40,bot=CAM.y+HV+40,l=CAM.x-60;X.save();
 if(fx>l){const g=X.createLinearGradient(fx-420,0,fx,0);g.addColorStop(0,'rgba(22,6,40,.97)');g.addColorStop(1,'rgba(70,25,115,.8)');X.fillStyle=g;X.fillRect(l,top,fx-l,bot-top)}
 for(let i=0;i<9;i++){const y=top+i*(bot-top)/8,w=34+((i*37+Math.floor(G.t*5))%5)*10;crystal(fx+w*.25,y+50,w*.6,100,PAL[i%5],.95)}
 for(let i=0;i<7;i++){const ph=(G.t*1.2+i*.153)%1,x=fx-120+((i*97)%260),y=top+ph*(bot-top);crystal(x,y,10,26,PAL[(i+2)%5],1-ph*.5)}
 X.restore()};
// что нужно впереди: [форма, тайл, подсказка]
function needAt(fx){for(let k=0;k<9;k++){const tx=fx+k;for(let y=0;y<11;y++){const v=tileAt(tx,y);if(v==7)return ['wheel',tx,'t_gate'];if(v==4)return ['wheel',tx,'e_wheel'];if(v>=10&&v<=14)return [GATEF[v],tx,v==10?'t_tgate':v==11?'t_sqgate':'t_need']}
  let run=0;for(let j=0;j<9-k;j++){if(!tileAt(tx+j,10)&&!tileAt(tx+j,11))run++;else break}if(run>=5)return ['kite',tx,'e_kite']}return null}
EX.esc={setup(o){o.nc=1;o.said={};o.done=0;G.said14=1},
 upd(o,dt){const B=G.boulder,p=P;if(!B||o.done)return;
  if(p.x>o.out*T){o.done=1;G.boulder=null;hush();say('r_esc');SFX.win();part(p.x,p.y-80,30,'#fff3a0',400,.9,0,9);return}
  const n=needAt(Math.floor(p.x/T));
  if(n&&p.form!=n[0]){B.v=Math.min(B.v,60);B.x=Math.min(B.x,p.x-450);if(!o.said[n[1]]){o.said[n[1]]=1;hush();say(n[2])}if(!HAND)HAND={x:0,y:0,t:0,k:'screen',bx:'form'}}
  else B.v=Math.max(B.v,L.meta.chaseV||230)},
 draw(o){const x=o.out*T;if(x<CAM.x-300||x>CAM.x+WV+300)return;X.save();
  const g=X.createRadialGradient(x+60,470,10,x+60,470,220);g.addColorStop(0,'rgba(255,250,210,.95)');g.addColorStop(1,'rgba(255,230,150,0)');X.fillStyle=g;X.fillRect(x-160,240,440,360);
  X.fillStyle='#4a2a78';X.beginPath();X.moveTo(x-40,600);X.lineTo(x-40,380);X.arc(x+60,380,100,Math.PI,0);X.lineTo(x+160,600);X.lineTo(x+130,600);X.lineTo(x+130,385);X.arc(x+60,385,70,0,Math.PI,true);X.lineTo(x-10,600);X.closePath();X.fill();
  X.strokeStyle='#c58cff';X.lineWidth=5;X.stroke();crystal(x+60,290,22,60,'#ffcc33');X.restore()}};
// ---- друзья помогают по очереди
const AL={kuv:{img:'kuv',h:120,q:'q_kuv',a:'a_kuv',num:1,opts:[0,3,4],ans:0},
 pir:{img:'lineup_1',h:175,q:'q_pir',a:'a_pir',opts:['sq','tri','circle'],ans:'tri'},
 rob:{img:'lineup_2',h:190,q:'q_rob',a:'a_rob',opts:['rect','sq','pent'],ans:'rect'},
 krab:{img:'crab_0',h:125,q:'q_krab',a:'a_krab',num:1,opts:[5,6,8],ans:6},
 sova:{img:'owl_0',h:190,q:'q_sova',a:'a_sova',opts:['hex','sq','pent'],ans:'pent'}};
EX.ally={top(o){return o.st=='ask'||o.st=='wait'&&P.x>o.sx*T-700?o.cy0-95:null},
 setup(o){o.nc=1;o.d=AL[o.who];o.st='wait';o.t=0;o.in=0;o.x=o.sx*T;o.ax=(o.sx-3.6)*T;o.cx=o.ax;o.cy0=o.gy*T-305;o.cy=o.cy0;o.n=0;
  o.opts=o.d.opts.map((v,i)=>({v,ok:v===o.d.ans,x:o.cx+(i-1)*150,y:o.cy,w:0}));
  if(o.stop!=null)wall(o.stop,15,o.gy-1);o.kx=o.ax;o.ky=o.gy*T;o.kr=0},
 upd(o,dt){const p=P,d=o.d;o.t+=dt;o.opts.forEach(q=>q.w=Math.max(0,q.w-dt));if(o.st!='wait')o.in=Math.min(1,o.in+dt*2.5);
  o.cy=Math.max(o.cy0,CAM.y+90/Z+80);o.cx=clamp(o.ax,CAM.x+250,CAM.x+WV-250);o.opts.forEach((q,i)=>{q.x=o.cx+(i-1)*150;q.y=o.cy});
  if(o.st=='wait'){if(p.x>o.sx*T-460&&G.lt>3.2&&!speaking()){o.st='ask';o.t=0;hush();say(d.q)}return}
  if(o.st!='act')return;const t=o.t;
  if(o.act=='ride'){if(t<.7){o.kx=lerp(o.ax,p.x,t/.7);o.kr+=dt*8;G.inputLock=1;p.vx=0;return}
   if(!o.x0){o.x0=p.x;if(o.stop!=null)wall(o.stop,0,o.gy-1)}
   const u=Math.min(1,(t-.7)/2.2);p.x=lerp(o.x0,o.to*T,u);p.y=o.gy*T-120-Math.sin(u*Math.PI)*230;p.vx=0;p.vy=0;p.face=1;p.ground=false;o.kx=p.x;o.ky=p.y+120;o.kr+=dt*10;G.inputLock=1;
   if(u>=1){p.y=o.gy*T-2;G.inputLock=0;o.st='done';o.t=0;o.ky=o.gy*T;part(p.x,o.gy*T,20,'#fff3a0',300,.7,0)}return}
  if(o.act=='wind'){G.inputLock=1;p.vx=0;p.face=1;if(!o.ph){p.vy=0;p.y-=300*dt;p.ground=false;if(p.y<=o.top*T-24)o.ph=1}else{p.vy=0;p.y=o.top*T-24;p.x+=320*dt;if(p.x>=o.to*T){o.st='done';G.inputLock=0;o.t=0}}
   if(Math.random()<.5)part(p.x-40+rnd()*80,p.y,1,'#ffffff',120,.6,-300,5);return}
  if(o.act=='bridge'){const n=Math.min(o.b1-o.b0,Math.floor(t/.22));while(o.n<n){setT(o.b0+o.n,o.gy,15);part((o.b0+o.n)*T+30,o.gy*T,8,'#ffcc33',200,.5,0);SFX.light((o.n%5)+1);o.n++}
   if(o.n>=o.b1-o.b0){if(o.stop!=null)wall(o.stop,0,o.gy-1);o.st='done'}return}
  if(o.act=='cut'){o.kx=lerp(o.ax,o.stop*T-50,Math.min(1,t/.8));if(t>1.1){wall(o.stop,0,o.gy-1);o.st='done';shake(6);SFX.bump();for(let y=1;y<o.gy;y+=2)part(o.stop*T+30,y*T,8,'#c58cff',300,.8,600)}return}
  if(o.act=='stairs'){const n=Math.min(o.steps.length,Math.floor(t/.4));while(o.n<n){const [x,row,len]=o.steps[o.n];for(let k=0;k<len;k++){setT(x+k,row,17);L.seen[row*L.w+x+k]=1}part(x*T+len*T/2,row*T,14,'#cfefff',260,.7,0);SFX.light(o.n+1);o.n++}
   if(o.n>=o.steps.length)o.st='done';return}},
 tap(o,wx,wy){if(o.st!='ask')return false;const q=o.opts.find(q=>Math.abs(wx-q.x)<70&&Math.abs(wy-q.y)<85);if(!q)return false;
  if(!q.ok){SFX.no();hush();say(o.d.num?'r_num_no':'r_find_no');q.w=.7;return true}
  throwBoom(q.x,q.y,()=>{if(o.st!='ask')return;o.st='act';o.t=0;o.x0=0;o.ph=0;hush();say(o.d.a);SFX.win();part(q.x,q.y,30,'#fff3a0',400,.9,0,9)});return true},
 hint(o){if(o.st!='ask')return;const q=o.opts.find(q=>q.ok);HAND={x:q.x,y:q.y,t:0,k:'tap'};say(o.d.q);return true},
 bot(o,dt){if(o.st=='done')return;const sx=o.sx*T;if(P.x<sx-800)return;BOT.j=0;if(o.st=='act'){BOT.l=BOT.r=0;return true}
  const at=WX.go(sx,25);if(o.st=='ask'&&at){G.bt=(G.bt||0)+dt;if(G.bt>1&&!BOOM.length&&o.t>1.2){G.bt=0;const q=!G.botAl?o.opts.find(q=>!q.ok):o.opts.find(q=>q.ok);G.botAl=1;WX.bt(q.x,q.y)}}return true},
 draw(o){const d=o.d,gy=o.gy*T;X.save();
  // препятствия
  if(o.act=='cut'&&o.st!='done'){const x=o.stop*T;for(let k=0;k<3;k++){const xx=x+12+k*18;const g=X.createLinearGradient(xx-6,0,xx+6,0);g.addColorStop(0,'#8a5ad0');g.addColorStop(.5,'#f0e4ff');g.addColorStop(1,'#8a5ad0');X.fillStyle=g;const y0=Math.max(CAM.y-20,0);X.fillRect(xx-6,y0,12,gy-y0)}for(let k=0;k<3;k++)crystal(x+30,gy-40-k*150,26,56,PAL[k],1)}
  if((o.act=='ride'||o.act=='bridge')&&o.st!='done'&&o.st!='act'){const x=o.stop*T+30;X.save();X.globalAlpha=.55+.2*Math.sin(G.t*4);X.strokeStyle='#e8dcff';X.lineWidth=5;X.setLineDash([12,10]);X.beginPath();X.moveTo(x,gy);X.lineTo(x,gy-170);X.stroke();X.restore();crystal(x,gy-170,14,34,'#c58cff')}
  if(o.act=='bridge'){for(let i=0;i<o.n;i++){const x=(o.b0+i)*T,y=gy;for(let r=0;r<2;r++){X.fillStyle=r?'#e0912a':'#f2b13b';X.strokeStyle='#7a4a12';X.lineWidth=3;X.beginPath();X.roundRect(x+2,y+r*30+2,T-4,26,6);X.fill();X.stroke()}
    X.fillStyle='rgba(255,255,255,.35)';X.fillRect(x+8,y+6,T-16,4)}}
  if(o.act=='wind'&&o.st=='act'){X.strokeStyle='rgba(255,255,255,.75)';X.lineWidth=5;for(let i=0;i<4;i++){const a=G.t*6+i*1.6;X.beginPath();X.arc(P.x,P.y-60,60+i*14,a,a+1.4);X.stroke()}}
  if(o.act=='stairs'&&o.st!='wait'){for(let i=0;i<o.n;i++){const [x,row,len]=o.steps[i];X.save();X.globalAlpha=.55+.2*Math.sin(G.t*4+i);X.strokeStyle='#e8dcff';X.shadowColor='#cfefff';X.shadowBlur=18;X.lineWidth=4;X.strokeRect(x*T+4,row*T+2,len*T-8,40);X.restore()}}
  // союзник
  const kx=o.kx,ky=o.ky,h=d.h;
  if(o.who=='kuv'){const i=IMG.kuv;if(i&&i.width){const w=i.width*h/i.height;X.save();X.translate(kx,ky-h/2);X.rotate(o.kr);X.drawImage(i,-w/2,-h/2,w,h);X.restore()}}
  else if(o.who=='sova'){const im=IMG.owl_0;if(im&&im.width){const s=h/400,by=ky-h+Math.sin(G.t*2)*4;X.drawImage(im,kx-152*s,by,375*s,400*s);X.save();X.translate(kx,0);X.scale(-1,1);X.drawImage(im,400,0,350,540,(200-152)*s,by,175*s,270*s);X.restore()}}
  else{const bob=o.who=='pir'&&o.st=='act'?Math.sin(G.t*8)*6:0;img(d.img,kx,ky+bob,h,o.who=='krab'?0:0)}
  if(o.st=='ask'||o.st=='wait'&&P.x>o.sx*T-700){const bx=kx,by=ky-h-40+Math.sin(G.t*4)*5;X.save();X.fillStyle='#fff';X.strokeStyle='#7a4fb0';X.lineWidth=4;X.beginPath();X.arc(bx,by,26,0,7);X.fill();X.stroke();X.restore();txt(o.st=='ask'?'?':'!',bx,by+2,40,'#ff7a00')}
  // карточки
  if(o.st=='ask'||o.in>0&&o.st=='act'&&o.t<.4){X.globalAlpha=o.st=='ask'?o.in:Math.max(0,1-o.t/.4);
   for(const q of o.opts){card(q.x,q.y,124,150,0,q.w);const dx=q.w>0?Math.sin(G.t*50)*6:0;if(d.num)txt(String(q.v),q.x+dx,q.y+4,96,'#ffcc33');else paintShape(q.v,q.x+dx,q.y,q.v=='rect'?34:48,shapeCol(q.v),0,false,8)}}
  X.restore()}};
// ---- финальный босс: Граф Осколок
const SL=[['circle',-62,-38],['tri',62,-38],['sq',0,-2],['hex',-40,52],['pent',40,52]];
const ALLSH=['circle','tri','sq','hex','pent','rect','oval'];
EX.graf={
 V(o){return [[o.x,600-o.h-18],[o.x-150,588],[o.x+150,588]]},
 heart(o){return [o.x-40,405,1.15]},
 blocks:[2,4,6],
 top(o){return 600-o.h-60},
 setup(o){o.boss=1;o.h=330;o.st='intro';o.t=0;o.lit=0;o.mask=0;o.sh=[];o.ns=0;o.cd=1;o.sides=0;o.waves=[];o.wcd=1.5;o.hc=0;o.pcs=null;o.fly=null;o.cool=0;o.said={};WX.fmGone=0},
 go(o,st){o.st=st;o.t=0},
 tray(o){if(o.hc>=5){o.pcs=null;return}const need=SL[o.hc][0];const oth=ALLSH.filter(s=>s!=need&&!SL.slice(0,o.hc).some(z=>z[0]==s));const a=oth[Math.floor(rnd()*oth.length)];let b=oth[Math.floor(rnd()*oth.length)];if(b==a)b=oth[(oth.indexOf(a)+1)%oth.length];
  const arr=[need,a,b];const k=o.hc%3;[arr[0],arr[k]]=[arr[k],arr[0]];o.pcs=arr.map((sh,i)=>({sh,ok:sh==need,x:0,y:0,w:0,i}))},
 lay(o){if(!o.pcs)return;const y=CAM.y+90/Z+70,x0=CAM.x+WV*.1+60;o.pcs.forEach(q=>{q.x=x0+q.i*150;q.y=y})},
 onHead(tx,ty){const o=ENTS.find(e=>e.type=='graf');if(!o||o.st!='p2'||o.cool>0||ty!=5||!EX.graf.blocks.includes(tx))return;o.cool=.35;o.sides++;SFX.light(o.sides);hush();say('n'+o.sides);part(tx*T+30,ty*T+60,16,PAL[o.sides%5],300,.6,0,8);
  const [hx,hy]=EX.graf.shield(o);part(hx,hy,12,'#fff3a0',250,.6,0);if(o.sides>=6){o.waves=[];EX.graf.go(o,'p2done');for(const b of EX.graf.blocks)setT(b,5,0);SFX.win();shake(8);hush();say('f1');say('f2');say('f_p3')}},
 shield(o){return [o.x-175,600-o.h*.55]},
 upd(o,dt){const p=P;o.t+=dt;o.cool=Math.max(0,o.cool-dt);
  {const m=CAM.x+WV-175;if(o.x>m)o.x=o.st=='intro'?m:Math.max(m,o.x-160*dt)}
  if(p.x>o.x-190){p.x=o.x-190;p.vx=Math.min(0,p.vx)}
  const [w]=dims(p);const st=o.st;
  // осколки
  for(const s of o.sh){s.t+=dt;if(s.t>1.3&&!s.hit){s.hit=1;part(s.x,600,14,PAL[s.c],300,.6,600,7);SFX.bump&&SFX.bump();if(Math.abs(s.x-p.x)<w/2+22&&p.y>520)hurt(p,s.x)}if(s.t>1.6)s.dead=1}
  o.sh=o.sh.filter(s=>!s.dead);
  for(const q of o.waves){q.x+=q.vx*dt;if(q.x<CAM.x-80)q.dead=1;if(!q.hit&&Math.abs(q.x-p.x)<w/2+18&&p.y>600-q.h+6){q.hit=1;hurt(p,q.x)}}
  o.waves=o.waves.filter(q=>!q.dead);
  if(st=='intro'){if(o.t>3.5&&!speaking()){EX.graf.go(o,'atk');o.ns=0;o.cd=.8;if(!o.said.t1){o.said.t1=1;say('f_t1')}}return}
  if(st=='atk'){o.cd-=dt;if(o.cd<=0&&o.ns<10){o.ns++;o.cd=1.05;const x=clamp(p.x+(o.ns%3==0?0:(rnd()-.5)*240),CAM.x+80,o.x-200);o.sh.push({x,t:0,c:o.ns%5})}
   if(o.ns>=10&&!o.sh.length){EX.graf.go(o,'rest');hush();say('f_p1')}return}
  if(st=='rest'){if(o.t>12&&o.lit<3){EX.graf.go(o,'atk');o.ns=0;o.cd=.8}return}
  if(st=='p1done'){if(o.t>2.5&&!speaking()){EX.graf.go(o,'p2');for(const b of EX.graf.blocks)setT(b,5,15);part(4*T+30,5*T,30,'#fff3a0',400,.8,0);hush();say('f_p2');say('f_w2');o.wcd=3}return}
  if(st=='p2'){o.wcd-=dt;if(o.wcd<=0){o.wcd=2.8;o.waves.push({x:o.x-170,vx:-300,h:58});tone(660,.35,'sine',.1,330)}return}
  if(st=='p2done'){if(o.t>2&&!speaking()){EX.graf.go(o,'p3');EX.graf.tray(o)}return}
  if(st=='p3'){EX.graf.lay(o);o.pcs&&o.pcs.forEach(q=>q.w=Math.max(0,q.w-dt));
   if(o.fly){o.fly.t+=dt;if(o.fly.t>=.55){o.hc++;o.fly=null;SFX.light(o.hc);hush();say('n'+o.hc);const [hx,hy,s]=EX.graf.heart(o);part(hx,hy,16,'#fff3a0',300,.6,0);
     if(o.hc>=5){o.pcs=null;EX.graf.go(o,'fm');o.fm={x:FM.x,y:FM.y};WX.fmGone=1;SFX.win();say('f_fm')}else EX.graf.tray(o)}}return}
  if(st=='fm'){const [hx,hy]=EX.graf.heart(o);const u=Math.min(1,o.t/1.8);o.fm.u=u;if(o.t>2.2&&!speaking()){EX.graf.go(o,'trans');FLASH=.25;SFX.win();shake(10);part(hx,hy,80,'#fff3a0',700,1.3,0,12);say('f3')}return}
  if(st=='trans'){if(o.t>1.2)WX.fmGone=0;if(o.t>2&&!speaking()){EX.graf.go(o,'lh');say('f_lh')}return}
  if(st=='lh'){if(o.t>3.5&&!speaking()&&!G.won){EX.graf.go(o,'end');win()}return}},
 tap(o,wx,wy){const st=o.st;
  if(st=='rest'||st=='atk'){const Vs=EX.graf.V(o);const i=Vs.findIndex((q,k)=>!(o.mask&(1<<k))&&Math.hypot(wx-q[0],wy-q[1])<75);if(i<0)return false;
   if(st=='atk'){SFX.no();say('f_t1');return true}
   throwBoom(Vs[i][0],Vs[i][1],()=>{if(o.mask&(1<<i)||o.st!='rest')return;o.mask|=1<<i;o.lit++;SFX.light(o.lit);hush();say('n'+o.lit);part(Vs[i][0],Vs[i][1],20,'#ffd35a',300,.6,0);
    if(o.lit>=3){o.sh=[];EX.graf.go(o,'p1done');SFX.win();shake(8);say('f_o2')}});return true}
  if(st=='p3'&&o.pcs&&!o.fly){const q=o.pcs.find(q=>Math.abs(wx-q.x)<62&&Math.abs(wy-q.y)<62);if(!q)return false;
   if(!q.ok){SFX.no();hush();say('r_heart_no');q.w=.7;return true}
   throwBoom(q.x,q.y,()=>{if(o.st!='p3'||o.fly)return;const [hx,hy,s]=EX.graf.heart(o),z=SL[o.hc];o.fly={sh:q.sh,x0:q.x,y0:q.y,x1:hx+z[1]*s,y1:hy+z[2]*s,t:0}});return true}
  return false},
 hint(o){const st=o.st;
  if(st=='rest'){const Vs=EX.graf.V(o);const i=Vs.findIndex((q,k)=>!(o.mask&(1<<k)));if(i>=0){HAND={x:Vs[i][0],y:Vs[i][1],t:0,k:'tap'};say('f_p1')}}
  else if(st=='atk')say('f_t1');
  else if(st=='p2'){const b=EX.graf.blocks[o.sides%3];HAND={x:b*T+30,y:6*T+10,t:0,k:'tap'};say('f_p2')}
  else if(st=='p3'&&o.pcs){const q=o.pcs.find(q=>q.ok);HAND={x:q.x,y:q.y,t:0,k:'tap'};say('f_p3')}return true},
 bot(o,dt){const p=P,st=o.st;BOT.j=0;
  if(st=='atk'||st=='rest'){let tx=Math.max(CAM.x+200,o.x-480);const s=o.sh.find(s=>!s.hit&&Math.abs(s.x-p.x)<120);if(s){tx=s.x>p.x?s.x-230:s.x+230;if(tx<CAM.x+70)tx=s.x+230;if(tx>o.x-195)tx=s.x-230}
   BOT.r=p.x<tx-15;BOT.l=p.x>tx+15;
   if(st=='rest'&&!s){G.bt=(G.bt||0)+dt;if(G.bt>.8&&!BOOM.length&&o.t>1){G.bt=0;const Vs=EX.graf.V(o),i=Vs.findIndex((q,k)=>!(o.mask&(1<<k)));if(i>=0)WX.bt(Vs[i][0],Vs[i][1])}}return true}
  if(st=='p2'){const bx=EX.graf.blocks[o.sides%3]*T+30;WX.go(bx,10);const q=o.waves.find(q=>q.x>p.x-20&&q.x-p.x<190);
   if(q){BOT.j=p.ground&&q.x-p.x>40&&q.x-p.x<175||(!p.ground&&p.vy<0)}else{const nq=o.waves.find(q=>q.x>p.x&&q.x-p.x<330);if(!nq&&Math.abs(p.x-bx)<14&&p.ground&&o.cool<=0)BOT.j=1;else BOT.j=!p.ground&&p.vy<0}return true}
  if(st=='p3'){WX.go(Math.max(CAM.x+200,o.x-480),40);G.bt=(G.bt||0)+dt;if(G.bt>1&&!BOOM.length&&!o.fly&&o.pcs&&o.t>1){G.bt=0;const q=!G.botH?o.pcs.find(q=>!q.ok):o.pcs.find(q=>q.ok);G.botH=1;WX.bt(q.x,q.y)}return true}
  BOT.r=0;BOT.l=0;return true},
 draw(o){const st=o.st;X.save();
  // лучи маяка
  if(st=='lh'||st=='end'){const a=Math.min(1,o.t/1.5);X.save();X.globalAlpha=a*.55;const ox=CAM.x+WV+40,oy=CAM.y-40;for(let i=0;i<7;i++){const an=Math.PI*.62+i*.07+Math.sin(G.t)*.03;X.fillStyle=['#ff6b6b','#ffa726','#ffe36b','#7ff0a2','#7fd3ff','#8a7dff','#d38cff'][i];X.beginPath();X.moveTo(ox,oy);X.lineTo(ox+Math.cos(an)*2600,oy+Math.sin(an)*2600);X.lineTo(ox+Math.cos(an+.06)*2600,oy+Math.sin(an+.06)*2600);X.closePath();X.fill()}X.restore();
   X.save();X.translate(CAM.x,CAM.y);X.scale(1/Z,1/Z);fworks(o.t,W,H,6,1);X.restore()}
  // волны
  for(const q of o.waves){X.save();X.shadowColor='#c58cff';X.shadowBlur=18;const g=X.createLinearGradient(0,600-q.h,0,600);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(150,90,230,.8)');X.fillStyle=g;X.beginPath();X.moveTo(q.x-36,600);X.lineTo(q.x-18,600-q.h*.6);X.lineTo(q.x,600-q.h);X.lineTo(q.x+18,600-q.h*.55);X.lineTo(q.x+36,600);X.closePath();X.fill();X.strokeStyle='#fff3a0';X.lineWidth=3;X.stroke();X.restore()}
  // сам граф
  const im=st=='p2'||st=='p2done'?'oskolok_1':st=='p3'||st=='fm'||(st=='trans'&&o.t<.15)?'oskolok_2':st=='trans'||st=='lh'||st=='end'?'oskolok_3':'oskolok_0';
  const hh=im=='oskolok_1'?370:im=='oskolok_2'?300:o.h;let tilt=0;if(st=='rest')tilt=Math.sin(o.t*1.5)*.03;
  X.save();X.translate(o.x,600);X.rotate(tilt);if(st=='trans'||st=='lh'||st=='end'){X.shadowColor='#fff3a0';X.shadowBlur=30}img(im,0,0,hh,0);X.restore();
  if(st=='rest'){for(let i=0;i<3;i++){const t=(G.t*.6+i/3)%1;txt('z',o.x+60+t*60,600-o.h+20-t*70,30+t*18,'#fff')}}
  // треугольник-фаза
  if(st=='atk'||st=='rest'||st=='p1done'&&o.t<1.5){const Vs=EX.graf.V(o);X.save();X.globalAlpha=st=='rest'||st=='p1done'?1:.35;X.strokeStyle=st=='p1done'?'#ffd35a':'rgba(255,255,255,.85)';X.lineWidth=6;X.shadowColor='#ffd35a';X.shadowBlur=st=='p1done'?30:8;X.beginPath();Vs.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath();X.stroke();
   Vs.forEach((q,i)=>{const on=o.mask&(1<<i);X.fillStyle=on?'#ffd35a':'rgba(255,255,255,.85)';X.shadowColor=on?'#ffd35a':'#fff';X.shadowBlur=on?24:10;X.beginPath();X.arc(q[0],q[1],on?24:22+(st=='rest'?4*Math.sin(G.t*6+i):0),0,7);X.fill();X.strokeStyle='#3a1d55';X.lineWidth=3;X.stroke()});X.restore()}
  // щит-шестиугольник
  if(st=='p2'||st=='p2done'&&o.t<1.5){const [sx,sy]=EX.graf.shield(o);const pts=shapePts('hex',sx,sy,105,Math.PI/6);X.save();X.fillStyle=st=='p2done'?'rgba(255,240,170,.45)':'rgba(200,170,255,.25)';X.beginPath();pts.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath();X.fill();
   for(let i=0;i<6;i++){const a=pts[i],b=pts[(i+1)%6],on=i<o.sides;X.strokeStyle=on?PAL[i%5]:'rgba(255,255,255,.55)';X.shadowColor=on?PAL[i%5]:'#fff';X.shadowBlur=on?20:4;X.lineWidth=on?10:5;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.stroke()}X.restore()}
  // кристальные камни
  if(st=='p2'){for(const b of EX.graf.blocks){const x=b*T,y=5*T;X.save();const g=X.createLinearGradient(x,y,x,y+T);g.addColorStop(0,'#f2e6ff');g.addColorStop(1,'#a777e8');X.fillStyle=g;X.shadowColor='#e8dcff';X.shadowBlur=14+6*Math.sin(G.t*4+b);X.beginPath();X.roundRect(x+2,y+2,T-4,T-4,10);X.fill();X.shadowBlur=0;X.strokeStyle='#5b2a8a';X.lineWidth=3;X.stroke();crystal(x+30,y+48,12,32,PAL[b%5]);X.restore()}}
  // сердце
  if(st=='p3'||st=='fm'||st=='trans'&&o.t<1){const [hx,hy,s]=EX.graf.heart(o);X.save();if(st=='trans')X.globalAlpha=1-o.t;
   heartPath(hx,hy,s);X.fillStyle='rgba(255,215,240,.92)';X.shadowColor='#ff9ad5';X.shadowBlur=22;X.fill();X.shadowBlur=0;X.strokeStyle='#8a2a6a';X.lineWidth=5;X.stroke();
   SL.forEach((z,i)=>{const cx=hx+z[1]*s,cy=hy+z[2]*s;if(i<o.hc)paintShape(z[0],cx,cy,26*s,shapeCol(z[0]),0,false,10);else{X.fillStyle='rgba(60,30,80,.8)';pathShape(z[0],cx,cy,26*s);X.fill();if(i==o.hc&&st=='p3'){X.strokeStyle='rgba(255,243,160,'+(.6+.4*Math.sin(G.t*6))+')';X.lineWidth=4;X.stroke()}}});
   if(st=='fm'){const u=o.fm.u||0;const fx=lerp(o.fm.x,hx,u),fy=lerp(o.fm.y,hy-20,u)-Math.sin(u*Math.PI)*80;img('fm'+(Math.floor(G.t*4)%4),fx,fy+60*(1-u*.6),145*(1-u*.6),0,1-Math.max(0,u-.85)*6);if(u>=1){X.fillStyle='rgba(255,243,160,'+(.5+.4*Math.sin(G.t*8))+')';heartPath(hx,hy,s*.5);X.fill()}}
   X.restore()}
  if(o.fly){const f=o.fly,u=Math.min(1,f.t/.55);paintShape(f.sh,lerp(f.x0,f.x1,u),lerp(f.y0,f.y1,u)-Math.sin(u*Math.PI)*60,(1-u*.45)*48,shapeCol(f.sh),0,false,12)}
  // осколки сверху
  for(const s of o.sh){const warn=s.t<.95;X.save();X.fillStyle='rgba(30,10,60,'+(.25+.35*Math.min(1,s.t/.95))+')';X.beginPath();X.ellipse(s.x,600,40*(.5+Math.min(1,s.t/.95)*.5),11,0,0,7);X.fill();
   if(!warn&&!s.hit){const u=(s.t-.95)/.35,y=lerp(CAM.y-40,600,Math.min(1,u));crystal(s.x,y,22,70,PAL[s.c])}X.restore()}
  // карточки кусочков
  if(st=='p3'&&o.pcs){for(const q of o.pcs){card(q.x,q.y,118,118,0,q.w);const dx=q.w>0?Math.sin(G.t*50)*6:0;paintShape(q.sh,q.x+dx,q.y,q.sh=='rect'?30:44,shapeCol(q.sh),0,false,8)}}
  // счётчик
  const cnt=st=='rest'||st=='atk'?o.lit+' из 3':st=='p2'?o.sides+' из 6':st=='p3'?o.hc+' из 5':null;if(cnt)txt(cnt,CAM.x+WV*.5,CAM.y+75,big(),'#fff3a0');
  X.restore()}};
// ---- финал: салют и титры
WX.drawFin=function(c){fworks(c.t,W,H,7,1.4);
 if(c.t>3){X.save();X.globalAlpha=Math.min(1,(c.t-3)/1.5);txt('Конец',W/2,H*.2,120,'#fff3a0','center','#5b2a8a');X.restore()}
 if(c.t>5){const L2=['Тася Треуголка и Радужный Маяк','','Герои','Тася Треуголка','Формик','Кувырок','Пирамида','Квадратыч','Краб Отшельник','Сова Зеркалица','Принц Радужик','','Спасибо за игру!'];
  const y0=H*.36,y1=H*.97,lh=58,sc=(c.t-5)*55;X.save();X.globalAlpha=Math.min(1,(c.t-5)/1)*.28;X.fillStyle='#2a0f45';X.beginPath();X.roundRect(W*.33,y0-10,W*.34,y1-y0+10,24);X.fill();X.restore();
  X.save();X.beginPath();X.rect(0,y0,W,y1-y0);X.clip();L2.forEach((s,i)=>{let y=y1+20+i*lh-sc;const last=i==L2.length-1;if(last)y=Math.max(y,(y0+y1)/2);if(y<y0-40||y>y1+40)return;txt(s,W/2,y,i==0||last?46:i==2?36:38,i==0||last?'#fff3a0':'#ffffff')});X.restore()}};
WX.add(()=>{
const od=drawFM;drawFM=function(){if(WX.fmGone)return;od()};
const ob=bump;bump=function(tx,ty){ob(tx,ty);EX.graf.onHead(tx,ty)};
const deco=(b,xs)=>b.e('castle',0,10,{xs});
LV['6-1']=()=>{const b=new LB(196,'6-1');b.meta={name:'6-1 Побег из замка',intro:['w6'],forms:['wheel','kite','cube'],chase:2,chaseV:230,chaseMax:300};
 b.g(0,58).g(68,132).g(142,196);
 b.col(24,0,5,1).col(24,6,9,4);
 b.col(44,0,4,1).col(44,5,9,7);
 b.col(80,0,5,1).col(80,6,9,10);
 b.col(100,0,5,1).col(100,6,9,11);
 b.col(116,0,5,1).col(116,6,9,4);
 b.col(156,0,5,1).col(156,6,9,11);
 b.e('esc',176,10,{out:176});
 b.coins(8,7,8,'coin_circ',2).coins(30,7,8,'coin_circ',2).coins(58,6,10,'coin_tri',1).coins(86,7,8,'coin_circ',2).coins(122,7,6,'coin_circ',2).coins(132,6,9,'coin_tri',2).coins(162,7,8,'coin_circ',2);
 b.e('enemy',36,10).e('enemy',92,10).e('enemy',126,10).e('enemy',166,10);
 b.e('star',62,6).e('star',108,7).e('star',136,6).e('goal',188,10);
 deco(b,[[4,10],[16,10],[34,10],[52,10],[72,10],[90,10],[108,10],[124,10],[146,10],[166,10]]);return b};
LV['6-2']=()=>{const b=new LB(196,'6-2');b.meta={name:'6-2 Друзья спешат на помощь',intro:['l62'],forms:[]};
 b.g(0,22).g(33,48).g(48,80,5).g(88,104,5).dn(104,10,5).g(109,196).g(146,149,3);
 b.e('ally',0,10,{who:'kuv',act:'ride',sx:19.5,gy:10,stop:21,to:36});
 b.e('ally',0,10,{who:'pir',act:'wind',sx:46.5,gy:10,top:5,to:50.5});
 b.e('ally',0,5,{who:'rob',act:'bridge',sx:77.5,gy:5,stop:79,b0:80,b1:88});
 b.e('ally',0,10,{who:'krab',act:'cut',sx:121.5,gy:10,stop:124});
 const ST=[[140,8,2],[142,6,2],[144,4,2]];b.e('ally',0,10,{who:'sova',act:'stairs',sx:137,gy:10,steps:ST});
 b.meta.path=[[141,8,()=>{const o=ENTS.find(e=>e.who=='sova');return o&&o.st=='done'}],[143,6],[145,4],[147.5,3],[154,10]];
 b.coins(6,7,8,'coin_circ',2).coins(36,7,8,'coin_circ',2).coins(54,2,8,'coin_tri',1).coins(90,2,8,'coin_tri',1).coins(112,7,6,'coin_circ',2).coins(126,7,8,'coin_circ',2).coins(160,7,10,'coin_circ',2);
 b.e('enemy',12,10).e('enemy',40,10).e('enemy',60,5).e('enemy',96,5).e('enemy',114,10).e('enemy',170,10);
 b.e('star',28,4).e('star',84,3).e('star',147,2).e('goal',188,10);
 deco(b,[[3,10],[34,10],[52,5],[66,5],[92,5],[114,10],[130,10],[158,10],[172,10]]);return b};
LV['6-B']=()=>{const n=Math.max(16,Math.ceil(W/1.45/T)+1);const b=new LB(n,'6-B');b.zoom=1.45;b.gf=.8;b.meta={name:'Финал: Граф Осколок',intro:['f0'],forms:[],boss:'graf'};b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('graf',n-3,10);b.e('castle',0,10,{xs:[[2,10]]});return b};
});
})();
