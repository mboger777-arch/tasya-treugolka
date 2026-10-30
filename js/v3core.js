// v3: общие механики «Маяк, который рисует мир» — точки→отрезок, центр, ворота-формы, стопор, наклейки, альбом
(function(){
const near=(x,d=700)=>Math.abs(x-P.x)<d;
const tapAt=(x,y)=>taps.push({x:(x-CAM.x)*Z,y:(y-CAM.y)*Z});
const pulse=(k=4)=>.5+.5*Math.sin(G.t*k);
// ладошка-демо: последовательность точек (касания) или drag
WX.hpos=function(h){if(!h.seq)return null;const n=h.seq.length,per=1.15,u=h.t/per,i=Math.floor(u)%n,f=u-Math.floor(u);const a=h.seq[(i+n-1)%n],b=h.seq[i];
 const m=Math.min(1,f/.45),e=m*m*(3-2*m);h.x=a[0]+(b[0]-a[0])*e;h.y=a[1]+(b[1]-a[1])*e;return h.drag?(f>.45?.0:0):(f>.6?(f-.6)/.4:0)};
const showHand=(seq,k,drag)=>{HAND={k:'tap',x:seq[0][0],y:seq[0][1],seq,t:0,drag};if(k)say(k)};
WX.showHand=showHand;
function glowDot(x,y,r,col,on){X.save();const p=pulse(5);X.shadowColor=col;X.shadowBlur=on?34:18+p*14;X.fillStyle=on?'#fff':col;X.beginPath();X.arc(x,y,r*(on?1.25:1+p*.08),0,7);X.fill();X.shadowBlur=0;
 X.strokeStyle='rgba(255,255,255,'+(on?.95:.45+p*.4)+')';X.lineWidth=5;X.beginPath();X.arc(x,y,r*1.9+(on?6:p*8),0,7);X.stroke();X.fillStyle=on?col:'#fff';X.beginPath();X.arc(x,y,r*.38,0,7);X.fill();X.restore()}
WX.glowDot=glowDot;
// ===== точки → отрезок-мостик =====
EX.dots={off(o){return o.waitStop&&!G.v3stop},setup(o){o.P=o.pts.map(q=>({x:q[0]*T,y:(q[1]||10)*T-4,row:q[1]||10}));o.seg=o.P.slice(1).map(()=>0);o.grow=o.P.slice(1).map(()=>0);o.sel=-1;o.done=0;
  if(o.fly)o.F={x:o.fly[0]*T,y:o.fly[1]*T,gone:0,vx:0,vy:0}},
 upd(o,dt){if(EX.dots.off(o))return;if(!o.intro&&P.x>o.P[0].x-560&&P.x<o.P[o.P.length-1].x){o.intro=1;EX.dots.hint(o,1)}
  o.grow=o.grow.map((g,i)=>o.seg[i]?Math.min(1,g+dt*2.5):0);
  if(o.F&&o.F.gone){o.F.x+=o.F.vx*dt;o.F.y+=o.F.vy*dt;o.F.vy-=60*dt}},
 tap(o,wx,wy){if(o.done||EX.dots.off(o))return false;let best=-1,bd=115;o.P.forEach((q,i)=>{const d=Math.hypot(wx-q.x,wy-q.y);if(d<bd){bd=d;best=i}});
  if(o.F&&!o.F.gone&&Math.hypot(wx-o.F.x,wy-o.F.y)<Math.min(bd,115)){o.F.gone=1;o.F.vx=260;o.F.vy=-220;SFX.no();say('t_mukha');part(o.F.x,o.F.y,10,'#fff',200,.5,0);return true}
  if(best<0)return false;const q=o.P[best];
  if(o.sel<0||o.sel==best){o.sel=o.sel==best?-1:best;SFX.light(1);part(q.x,q.y,10,'#fff3a0',220,.5,0);return true}
  const a=Math.min(o.sel,best);if(Math.abs(o.sel-best)==1&&!o.seg[a]){EX.dots.build(o,a);o.sel=-1;return true}
  o.sel=best;SFX.light(1);return true},
 build(o,i){const a=o.P[i],b=o.P[i+1];o.seg[i]=1;SFX.light(3);for(let x=Math.round(a.x/T);x<Math.round(b.x/T);x++)if(!tileAt(x,a.row))setT(x,a.row,2);
  part((a.x+b.x)/2,a.y,26,'#fff3a0',380,.8,0,8);if(!G.saidSeg){G.saidSeg=1;say('r_seg')}else say('n'+(o.seg.filter(s=>s).length));HAND=null;
  if(o.seg.every(s=>s)){o.done=1;HUD.got=(HUD.got||0)+1}},
 hint(o,force){if(o.done||EX.dots.off(o)||(!force&&!near(o.P[0].x,800)))return;const i=o.seg.findIndex(s=>!s);const a=o.P[i],b=o.P[i+1];
  showHand(o.sel==i+1?[[b.x,b.y],[a.x,a.y]]:[[a.x,a.y],[b.x,b.y]],o.k||(o.P.length>2&&!o.saidK?'t_dots3':'t_dots'));o.saidK=1;return true},
 draw(o){if(EX.dots.off(o))return;X.save();
  for(let i=0;i<o.seg.length;i++){const a=o.P[i],b=o.P[i+1];if(o.seg[i]){const g=o.grow[i],ex=a.x+(b.x-a.x)*g,ey=a.y+(b.y-a.y)*g;X.lineCap='round';X.shadowColor='#ffe680';X.shadowBlur=22;X.strokeStyle='#ffcc33';X.lineWidth=16;X.beginPath();X.moveTo(a.x,a.y);X.lineTo(ex,ey);X.stroke();X.shadowBlur=0;X.strokeStyle='#fff8d0';X.lineWidth=5;X.beginPath();X.moveTo(a.x,a.y-2);X.lineTo(ex,ey-2);X.stroke()}
   else{X.setLineDash([6,18]);X.lineCap='round';X.strokeStyle='rgba(255,243,160,'+(.25+pulse(3)*.25)+')';X.lineWidth=6;X.beginPath();X.moveTo(a.x,a.y);X.lineTo(b.x,b.y);X.stroke();X.setLineDash([])}}
  o.P.forEach((q,i)=>glowDot(q.x,q.y,15,'#ffcc33',o.sel==i||(i>0&&o.seg[i-1])||(i<o.seg.length&&o.seg[i])));
  if(o.F){const f=o.F;if(!f.gone){glowDot(f.x,f.y+Math.sin(G.t*7)*4,13,'#ffcc33',0);X.globalAlpha=.55;img('fly',f.x,f.y+14+Math.sin(G.t*7)*4,34,0,.55,.5,1)}else if(f.y>-200)img('fly',f.x,f.y,70,0,1,.5,.5)}
  X.restore()},
 bot(o,dt){if(o.done||EX.dots.off(o)||P.x>o.P[o.P.length-1].x||P.x<o.P[0].x-650)return;BOT.j=0;WX.go(o.P[0].x-50,14);G.bt3=(G.bt3||0)+dt;if(G.bt3<.55)return true;G.bt3=0;
  if(o.F&&!o.F.gone){tapAt(o.F.x,o.F.y);return true}const i=o.seg.findIndex(s=>!s);const q=o.sel==i?o.P[i+1]:o.P[i];tapAt(q.x,q.y);return true}};
// ===== мельница: найди центр =====
EX.mill={setup(o){o.r=o.r||150;o.cx=o.x;o.cy=600-o.r-6;o.on=0;o.rot=0;o.wob=0;o.gy=0;o.gx=o.gx||Math.round(o.x/T)+3;for(let y=o.gtop||6;y<10;y++)setT(o.gx,y,1)},
 upd(o,dt){if(!o.intro&&P.x>o.x-620&&P.x<o.gx*T){o.intro=1;EX.mill.hint(o,1)}if(o.wob>0)o.wob-=dt;
  if(o.on){o.rot+=dt*(o.oval?2.2:1.6);const want=o.oval?(Math.sin(o.rot*2)>-.2?1:0):1;o.gy+=(want-o.gy)*Math.min(1,dt*(o.oval?5:2.5));
   for(let y=o.gtop||6;y<10;y++)setT(o.gx,y,o.gy>.7?0:1)}},
 tap(o,wx,wy){if(o.on||Math.hypot(wx-o.cx,wy-o.cy)>o.r*1.15)return false;if(Math.hypot(wx-o.cx,wy-o.cy)<Math.max(75,o.r*.38)){o.on=1;SFX.win();part(o.cx,o.cy,30,'#fff3a0',400,.9,0,9);HAND=null;say(o.oval?'r_omill':'r_mill');return true}
  o.wob=.5;SFX.no();if(!o.miss){o.miss=1}showHand([[o.cx,o.cy]],'t_mill');return true},
 hint(o,force){if(o.on||(!force&&!near(o.x,800)))return;showHand([[o.cx,o.cy]],'t_mill');return true},
 draw(o){X.save();// столб-основание
  X.fillStyle='#6b4a2e';X.fillRect(o.cx-14,o.cy,28,600-o.cy);X.translate(o.cx+(o.wob>0?Math.sin(o.wob*40)*6:0),o.cy);if(o.oval)X.scale(1.22,.86);X.rotate(o.rot);const i=IMG.mill;if(i&&i.width){const h=o.r*2.1;X.drawImage(mip(i,h),-h*i.width/i.height/2,-h/2,h*i.width/i.height,h)}X.restore();
  if(o.on)glowDot(o.cx,o.cy,14,'#ffcc33',1);else if(o.miss){X.save();X.strokeStyle='rgba(255,243,160,'+(.4+pulse(5)*.4)+')';X.lineWidth=5;X.setLineDash([8,10]);X.beginPath();X.arc(o.cx,o.cy,40,0,7);X.stroke();X.restore()}
  // шлюз-ворота
  const gx=o.gx*T,top=(o.gtop||6)*T,h=600-top,lift=o.gy*h*.92;X.save();X.beginPath();X.rect(gx-10,top-h,T+20,h*2);X.clip();
  const g=X.createLinearGradient(gx,0,gx+T,0);g.addColorStop(0,'#9a6a3c');g.addColorStop(1,'#6b4526');X.fillStyle=g;X.strokeStyle='#3e2a16';X.lineWidth=5;X.fillRect(gx,top-lift,T,h);X.strokeRect(gx,top-lift,T,h);
  X.strokeStyle='rgba(60,40,20,.6)';X.lineWidth=3;for(let y=top-lift+30;y<top-lift+h;y+=48){X.beginPath();X.moveTo(gx+4,y);X.lineTo(gx+T-4,y);X.stroke()}X.restore();
  X.strokeStyle='#5a3d22';X.lineWidth=10;X.beginPath();X.moveTo(gx-6,top-h*.95);X.lineTo(gx-6,600);X.moveTo(gx+T+6,top-h*.95);X.lineTo(gx+T+6,600);X.stroke()},
 bot(o,dt){if(o.on&&(!o.oval||o.gy>.8)||P.x>o.gx*T+T)return;if(P.x<o.x-650)return;BOT.j=0;
  if(o.on){WX.go(o.gx*T-90,14);return true}WX.go(o.x-260,14);G.bt3=(G.bt3||0)+dt;if(G.bt3>.6){G.bt3=0;if(!o.bm){o.bm=1;tapAt(o.cx+o.r*.7,o.cy)}else tapAt(o.cx,o.cy)}return true}};
// ===== Колесо-Тася без центра =====
EX.wctr={setup(o){o.need=1;o.nc=1},
 upd(o,dt){const p=P;if(!o.need)return;if(p.form!='wheel'){FORMS.wheel.max=720;return}
  if(!o.intro){o.intro=1;EX.wctr.hint(o,1)}FORMS.wheel.max=330;o.hop=(o.hop||0)+dt*Math.abs(p.vx)/330;if(p.ground&&o.hop>1.1){o.hop=0;p.vy=-230;p.ground=false;SFX.bump&&SFX.bump()}},
 tap(o,wx,wy){if(!o.need||P.form!='wheel')return false;const cy=P.y-62;if(Math.hypot(wx-P.x,wy-cy)<95){o.need=0;FORMS.wheel.max=720;SFX.win();part(P.x,cy,30,'#fff3a0',400,.9,0,9);say('r_ctr');HAND=null;return true}return false},
 hint(o,force){if(!o.need||P.form!='wheel')return;showHand([[P.x,P.y-62]],'t_ctr');return true},
 draw(o){if(!o.need||P.form!='wheel')return;const cy=P.y-62;X.save();X.strokeStyle='rgba(255,243,160,'+(.45+pulse(6)*.45)+')';X.lineWidth=5;X.setLineDash([8,9]);X.beginPath();X.arc(P.x,cy,30+pulse(6)*6,0,7);X.stroke();X.restore();
  if(HAND&&HAND.seq)HAND.seq[0]=[P.x,cy]},
 bot(o,dt){if(!o.need||P.form!='wheel')return;BOT.r=0;G.bt3=(G.bt3||0)+dt;if(G.bt3>.5){G.bt3=0;tapAt(P.x,P.y-62)}return true}};
// ===== ворота с отверстием-формой =====
const GK={circle:7,oval:8,tilt:8,small:7,near:1};
EX.sgate={setup(o){o.gx=Math.round(o.x/T-.5);o.top=o.top||4;for(let y=o.top;y<10;y++)setT(o.gx,y,GK[o.kind])},
 upd(o){if(!o.intro&&P.x>o.gx*T-520&&P.x<o.gx*T){o.intro=1;const k={circle:'t_cgate',small:'t_cgate',oval:'t_ogate',tilt:'t_tilt',near:'t_near'}[o.kind];
  if(o.kind=='near'||(o.kind=='tilt')||P.form!=(GK[o.kind]==7?'wheel':'bubble')){say(k);if(o.kind=='near'){const q=G.lseq;setTimeout(()=>{if(G.lseq==q)say('t_near2')},2600)}else HAND={x:0,y:0,t:0,k:'screen',bx:'form'}}}},
 hint(o){const f=GK[o.kind]==7?'wheel':'bubble';if(o.kind=='near'||!near(o.gx*T,600)||P.x>o.gx*T||P.form==f)return;HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say(GK[o.kind]==7?'t_rgate':'t_ogate');return true},
 draw(o){const x=o.gx*T-16,w=T+32,top=o.top*T-30,h=600-top,cx=x+w/2,cy=top+h*.55;X.save();
  const g=X.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#b9a58c');g.addColorStop(.5,'#9a8670');g.addColorStop(1,'#6d5c4a');X.fillStyle=g;X.strokeStyle='#4a3b2c';X.lineWidth=6;
  X.beginPath();X.roundRect?X.roundRect(x,top,w,h+10,18):X.rect(x,top,w,h+10);X.fill();X.stroke();
  // знак-отверстие (крупно, видно издалека)
  const R=(o.kind=='small'?.7:1)*Math.min(150,h*.42),col=GK[o.kind]==7?'#ff8a1f':GK[o.kind]==8?'#c58cff':'#9a9a9a';
  X.translate(cx,cy);if(o.kind=='tilt')X.rotate(.6);X.beginPath();
  if(o.kind=='circle'||o.kind=='small')X.arc(0,0,R*.62,0,7);else if(o.kind=='near'){X.arc(0,0,R*.62,-.9,Math.PI+.9,false);X.closePath()}else X.ellipse(0,0,R*.42,R*.68,0,0,7);
  X.fillStyle='rgba(30,20,50,.78)';X.fill();X.shadowColor=col;X.shadowBlur=24;X.lineWidth=12;X.strokeStyle=col;X.stroke();X.restore();
  if(o.kind=='near'){X.save();X.translate(cx,cy);X.strokeStyle='#fff3a0';X.lineWidth=7;X.globalAlpha=.6+pulse(5)*.4;X.beginPath();const R2=R*.62;X.moveTo(Math.cos(-.9)*R2,Math.sin(-.9)*R2);X.lineTo(Math.cos(Math.PI+.9)*R2,Math.sin(Math.PI+.9)*R2);X.stroke();X.restore()}}};
// ===== овальный камень-стопор (погоня) =====
EX.stopper={setup(o){G.v3stop=0;o.st='wait';o.sx=o.x;o.sy=o.y-(o.h||4)*T;o.vy=0},
 upd(o,dt){const B=G.boulder;if(o.st=='wait'){if(B&&P.x>o.x-700){B.v=Math.min(B.v,45);B.x=Math.min(B.x,P.x-WV*.45);if(!o.intro){o.intro=1;EX.stopper.hint(o,1)}}}
  else if(o.st=='fall'){o.vy+=2600*dt;o.sy+=o.vy*dt;o.sx+=(o.tx-o.sx)*Math.min(1,dt*5);if(o.sy>=600-70){o.sy=600-70;o.st='down';shake(8);SFX.land();part(o.sx,600,20,'#b8a27a',400,.7,600)}}
  else if(o.st=='down'&&B){B.v=Math.max(B.v,260);if(B.x+170>o.sx-55){o.bx=o.sx-55-170;o.st='stopped';G.v3stop=1;G.boulder=null;shake(12);SFX.bump();say('r_stop');part(o.sx-60,560,30,'#b8a27a',500,.8,700)}}},
 tap(o,wx,wy){if(o.st!='wait'||Math.hypot(wx-o.sx,wy-o.sy)>130)return false;o.st='fall';o.tx=Math.max(P.x-300,(G.boulder?G.boulder.x+300:0));SFX.light(2);HAND=null;return true},
 hint(o,force){if(o.st!='wait'||(!force&&!near(o.x,800)))return;showHand([[o.sx,o.sy]],'t_stop');return true},
 draw(o){if(o.st=='wait'){X.save();X.fillStyle='#7a5a3a';X.fillRect(o.sx-70,o.sy+64,140,22);X.restore();glowDot(o.sx,o.sy-10,10,'#c58cff',0)}
  img('ostone',o.sx,o.sy+70,140,0,1,.5,1);
  if(o.st=='stopped'){X.save();X.translate(o.bx,10*T-170);X.rotate(o.bx/170);paintShape('circle',0,0,170,'#8d7b66',0,false);X.strokeStyle='#5b4a3a';X.lineWidth=8;X.beginPath();X.moveTo(-90,-40);X.lineTo(30,10);X.lineTo(60,90);X.stroke();X.restore()}},
 bot(o,dt){if(o.st!='wait'||P.x<o.x-650)return;BOT.r=P.x<o.x-120;G.bt3=(G.bt3||0)+dt;if(G.bt3>.7){G.bt3=0;tapAt(o.sx,o.sy)}return true}};
// ===== наклейки «Фигуры вокруг нас» =====
WX.STK=[['ball','stk_ball','1-1'],['clock','stk_clock','1-2'],['egg','stk_egg','1-3'],['plate','stk_plate','1-4']];
EX.stk={setup(o){o.got=SAVE.album&&SAVE.album[o.id]},
 upd(o){if(o.dead)return;const p=P;if(Math.abs(o.x-p.x)<80&&p.y>o.y-60&&p.y-160<o.y+40){o.dead=1;SAVE.album=SAVE.album||{};SAVE.album[o.id]=1;save();SFX.star();say(o.k||'s_got');
  part(o.x,o.y-40,34,'#fff',420,1,0,10);G.stkT={t:0,img:'stk_'+o.id}}},
 draw(o){if(o.dead)return;const b=Math.sin(G.t*2.4)*6;X.save();X.shadowColor='#fff';X.shadowBlur=24+pulse(3)*14;img('stk_'+o.id,o.x,o.y-20+b,96,0,o.got?.6:1,.5,1);X.restore();
  if(G.t%1.6<.2)st4&&st4(o.x+30,o.y-100+b,6)}};
// маленькая «наклейка летит в альбом»
WX.drawStkFx=function(){const s=G.stkT;if(!s)return;s.t+=1/60;if(s.t>2.2){G.stkT=null;return}const k=Math.min(1,s.t/1.2),e=k*k;
 const x=W/2+(110-W/2)*e,y=H*.42+(H-70-H*.42)*e,h=180*(1-e*.6);X.save();X.globalAlpha=s.t>1.8?(2.2-s.t)/.4:1;X.shadowColor='#fff3a0';X.shadowBlur=30;img(s.img,x,y,h,0,1,.5,.5);X.restore();
 if(s.t<1.2)txt('Наклейка!',W/2,H*.42-130,56,'#fff3a0')};
// ===== альбом на карте =====
function albumN(){return Object.keys(SAVE.album||{}).length}
const _dm=WX.drawMap,_mt=WX.mapTap;
WX.drawMap=function(){_dm();const bx=82,by=H-58;X.save();const p=1+Math.sin(G.t*3)*.03;X.translate(bx,by);X.scale(p,p);X.fillStyle='rgba(255,138,31,.95)';X.strokeStyle='#fff';X.lineWidth=6;X.beginPath();X.roundRect?X.roundRect(-72,-44,144,88,22):X.rect(-72,-44,144,88);X.fill();X.stroke();
 img('stk_ball',-32,0,62,0,1,.5,.5);txt(albumN()+'',28,-2,40,'#fff');X.restore();txt('Альбом',bx,by-62,26,'#fff3a0');
 if(G.album)drawAlbum()};
function drawAlbum(){X.fillStyle='rgba(20,10,40,.86)';X.fillRect(0,0,W,H);txt('Фигуры вокруг нас',W/2,58,58,'#fff3a0');const cols=7,rows=4,cw=Math.min(150,(W-80)/cols),ch=Math.min(140,(H-170)/rows),x0=W/2-cw*cols/2,y0=110;
 for(let i=0;i<cols*rows;i++){const s=WX.STK[i],cx=x0+(i%cols+.5)*cw,cy=y0+(Math.floor(i/cols)+.5)*ch;X.fillStyle='rgba(255,255,255,.1)';X.strokeStyle='rgba(255,243,160,.35)';X.lineWidth=3;X.beginPath();X.arc(cx,cy,Math.min(cw,ch)*.42,0,7);X.fill();X.stroke();
  if(s&&SAVE.album&&SAVE.album[s[0]])img(s[1],cx,cy,Math.min(cw,ch)*.78,0,1,.5,.5);else txt('?',cx,cy,40,'rgba(255,255,255,.35)')}
 txt('Нажми, чтобы закрыть',W/2,H-34,30,'#fff')}
WX.mapTap=function(p){if(G.album){G.album=0;SFX.coin();return}if(Math.hypot(p.x-82,p.y-(H-58))<90){G.album=1;SFX.coin();return}_mt(p)};
})();
