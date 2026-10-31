// Мир 3: Квадратный город
(function(){
const bossN=()=>Math.max(14,Math.ceil(W/1.6/T)+1);
const near=(o,d=650)=>o.x-P.x<d&&P.x-o.x<240;
// кнопка и дверь
EX.btn={setup(o){for(let y=6;y<=9;y++)setT(o.door,y,16);o.on=0;o.dt=0},
 upd(o,dt){const p=P;if(o.on){o.dt=Math.min(1,o.dt+dt*1.6);return}
  if(p.ground&&Math.abs(p.x-o.x)<62&&Math.abs(p.y-o.y)<4){if(p.form=='cube'){o.on=1;for(let y=6;y<=9;y++)setT(o.door,y,0);SFX.crash();shake(10);SFX.light(4);part(o.door*T+30,480,24,'#bfe0ff',400,.8,600,9);say('r_good')}else if(!o.g||G.t-o.g>6){o.g=G.t;SFX.no();say('t_btn')}}},
 draw(o){const pr=o.on?1:(Math.abs(P.x-o.x)<62&&P.ground&&Math.abs(P.y-o.y)<4?.4:0);X.save();X.fillStyle='#3d4660';X.beginPath();X.roundRect(o.x-56,o.y-14,112,16,6);X.fill();
  const g=X.createLinearGradient(0,o.y-34,0,o.y-12);g.addColorStop(0,o.on?'#7ff0a2':'#ff6b5e');g.addColorStop(1,o.on?'#1f8f4a':'#b32a22');X.fillStyle=g;X.beginPath();X.roundRect(o.x-44,o.y-34+pr*16,88,22,8);X.fill();X.strokeStyle='#2a2f44';X.lineWidth=3;X.stroke();
  paintShape('sq',o.x,o.y-56+pr*16,14,'#35c46a',0,false,o.on?0:14);
  if(o.on&&o.dt<1){const x=o.door*T;X.globalAlpha=1-o.dt;X.fillStyle='#8ea3cf';X.fillRect(x+2,360-o.dt*240,T-4,240)}
  X.restore()},
 hint(o){if(o.on||!near(o,500))return;if(P.form!='cube'){HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say('t_btn')}else{HAND={x:o.x,y:o.y-40,t:0,k:'tap'};say('t_cube')}return true}};
// найди фигуру в вещах
const KN={sq:'window',circ:'clock',rect:'door',tri:'pizza'};
function item(k,x,y,s,hl){X.save();X.translate(x,y);X.scale(s,s);X.lineJoin='round';if(hl){X.shadowColor='#fff3a0';X.shadowBlur=30}
 if(k=='window'){X.fillStyle='#8a5a2b';X.fillRect(-52,-112,104,104);X.fillStyle='#9fe3ff';X.fillRect(-42,-102,84,84);X.fillStyle='rgba(255,255,255,.6)';X.beginPath();X.moveTo(-36,-96);X.lineTo(-10,-96);X.lineTo(-36,-60);X.fill();X.fillStyle='#8a5a2b';X.fillRect(-4,-102,8,84);X.fillRect(-42,-64,84,8);X.fillStyle='#e0a050';X.fillRect(-58,-14,116,10)}
 else if(k=='clock'){X.fillStyle='#d9a441';X.beginPath();X.arc(0,-62,54,0,7);X.fill();X.fillStyle='#fffbea';X.beginPath();X.arc(0,-62,44,0,7);X.fill();X.fillStyle='#4a3220';for(let i=0;i<12;i++){const a=i*Math.PI/6;X.beginPath();X.arc(Math.cos(a)*36,-62+Math.sin(a)*36,i%3?2.5:4.5,0,7);X.fill()}
  X.strokeStyle='#4a3220';X.lineCap='round';X.lineWidth=6;X.beginPath();X.moveTo(0,-62);X.lineTo(0,-92);X.stroke();X.lineWidth=5;X.beginPath();X.moveTo(0,-62);X.lineTo(22,-50);X.stroke();X.fillStyle='#c0392b';X.beginPath();X.arc(0,-62,5,0,7);X.fill()}
 else if(k=='door'){X.fillStyle='#6b3d1c';X.fillRect(-38,-142,76,138);X.fillStyle='#a0612e';X.fillRect(-31,-135,62,131);X.strokeStyle='#6b3d1c';X.lineWidth=4;X.strokeRect(-23,-125,46,48);X.strokeRect(-23,-66,46,50);X.fillStyle='#ffd35a';X.beginPath();X.arc(20,-70,6,0,7);X.fill()}
 else if(k=='pizza'){X.fillStyle='#d98a3a';X.beginPath();X.moveTo(-56,-112);X.lineTo(56,-112);X.lineTo(0,-6);X.closePath();X.fill();X.fillStyle='#ffd65a';X.beginPath();X.moveTo(-46,-100);X.lineTo(46,-100);X.lineTo(0,-16);X.closePath();X.fill();
  X.fillStyle='#d63a2a';for(const [a,b] of [[-20,-86],[16,-80],[-2,-52],[22,-96]]){X.beginPath();X.arc(a,b,8,0,7);X.fill()}X.fillStyle='#4f9a3a';X.beginPath();X.arc(-10,-70,4,0,7);X.fill()}
 X.restore()}
WX.item=item;
EX.find={setup(o){o.wx=Math.floor(o.x/T)+12;for(let y=0;y<=9;y++)setT(o.wx,y,15);o.done=0;o.its=o.ks.map((k,i)=>({k,x:o.x+i*4*T,sh:0}));for(const it of o.its)setT(Math.floor(it.x/T),7,2),setT(Math.floor(it.x/T)+1,7,2);for(const it of o.its)it.x+=T/2},
 upd(o,dt){const p=P;for(const it of o.its)it.sh=Math.max(0,it.sh-dt);if(o.done){o.fade=Math.min(1,(o.fade||0)+dt);return}
  if(near(o,700)&&!o.said){o.said=1;say('t_find_'+o.ans)}
  if(p.ground&&Math.abs(p.y-7*T)<3){for(const it of o.its)if(Math.abs(p.x-it.x)<70){if(it.k==KN[o.ans]){o.done=1;for(let y=0;y<=9;y++)setT(o.wx,y,0);SFX.win();part(it.x,300,30,'#fff3a0',400,1,0,10);say('c_'+(o.ans=='circ'?'circ':o.ans));o.okIt=it}else if(it.sh<=0&&!it.no){it.sh=.6;it.no=1;SFX.no();say('r_find_no')}}}
  for(const it of o.its)if(!(p.ground&&Math.abs(p.y-7*T)<3&&Math.abs(p.x-it.x)<70))it.no=0},
 top(o){return o.done?null:150},
 draw(o){for(const it of o.its){const dx=it.sh>0?Math.sin(it.sh*50)*6:0;item(it.k,it.x+dx,7*T-4,1,o.okIt==it)}
  const x=o.wx*T;X.save();X.globalAlpha=o.done?1-(o.fade||0):1;if(X.globalAlpha>0){const g=X.createLinearGradient(x,0,x+T,0);g.addColorStop(0,'rgba(197,140,255,.15)');g.addColorStop(.5,'rgba(197,140,255,.7)');g.addColorStop(1,'rgba(197,140,255,.15)');X.fillStyle=g;X.fillRect(x,-60,T,660);
   X.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<8;i++){const y=(G.t*90+i*83)%660-60;X.beginPath();X.arc(x+30+Math.sin(G.t*3+i)*12,y,4,0,7);X.fill()}
   if(!o.done){const l=(x-50-CAM.x)*Z,r=(x+110-CAM.x)*Z;if(r>W-480&&l<W)G.hideName=G.t;const s={sq:'sq',circ:'circle',rect:'rect',tri:'tri'}[o.ans];X.globalAlpha=1;panel(x-50,120,160,130,28);paintShape(s,x+30,186,42,'#ffcc33',0,false,16)}}X.restore()},
 hint(o){if(o.done||o.x-P.x>700||P.x>o.wx*T+60)return;const it=o.its.find(i=>i.k==KN[o.ans]);HAND={x:it.x,y:7*T-80,t:0,k:'tap'};say('t_find_'+o.ans);return true},
 bot(o,dt){if(o.done||o.x-P.x>700||P.x>o.wx*T+60)return;const it=o.its.find(i=>i.k==KN[o.ans]);const p=P;
  if(p.ground&&p.y>=599){if(WX.go(it.x,14))G.bj=.35}else if(!p.ground){BOT.r=it.x>p.x+10;BOT.l=it.x<p.x-10}WX.botJump(dt);if(!p.ground&&p.vy<0)BOT.j=1;return true}};
// гонка: соперник Коробок на доске
EX.rival={setup(o){o.rx=o.x;o.ry=600;o.vy=0;o.go=0;o.fin=0},
 upd(o,dt){const p=P;if(!o.go){if(p.form=='board'){o.go=1;say('t_race')}return}
  if(o.fin)return;const fx=o.end*T;let v=clamp(520+(p.x-o.rx)*.5,380,760);if(fx-o.rx<20*T)v=Math.min(v,560);o.rx+=v*dt;
  const tx=Math.floor(o.rx/T);let gy=null;for(let y=Math.max(0,Math.floor((o.ry-150)/T));y<12;y++){const t=tileAt(tx,y);if(t==1||t==2||t==18){gy=y*T;break}}
  const ahead=Math.floor((o.rx+100)/T);let ga=0;for(let y=0;y<12;y++)if(tileAt(ahead,y)==1||tileAt(ahead,y)==2)ga=1;
  if(o.ry>=(gy??900)-1&&o.vy>=0){o.ry=gy??o.ry;o.vy=0;if(!ga||(gy!=null&&tileAt(ahead,Math.floor(gy/T)-1)==1))o.vy=-760}else{o.vy+=2400*dt;o.ry+=o.vy*dt;if(gy!=null&&o.ry>gy&&o.ry-o.vy*dt<=gy+2){o.ry=gy;o.vy=0}}
  if(o.rx>=fx){o.fin=1}},
 draw(o){X.save();const y=o.ry;X.translate(o.rx,y);X.rotate(clamp(o.vy/2000,-.25,.25));X.fillStyle='#a6e7ff';X.strokeStyle='#3f7fa8';X.lineWidth=4;X.beginPath();X.roundRect(-70,-16,140,14,7);X.fill();X.stroke();img('e_w3',0,-14,100,1);X.restore();
  if(o.go&&!o.fin&&o.rx>CAM.x+WV){txt('Коробок →',CAM.x+WV-120,CAM.y+140,30,'#fff')}}};
EX.racegoal={upd(o){const p=P;if(!G.won&&p.x>o.x-30){const r=ENTS.find(e=>e.type=='rival');say(r&&r.fin?'r_race2':'r_race1');win()}},draw(o){}};
// сложи фигуру из кусочков
EX.asm={setup(o){o.done=0;o.k=o.kind;o.cx=o.x;o.cy=230;o.st=o.kind=='tri'?[1,3]:[0,0];o.fade=0},
 ok(o){return o.k=='tri'?o.st[0]==0&&o.st[1]==2:o.st[0]==1&&o.st[1]==1},
 upd(o,dt){if(!o.done){const hw=(o.k=='tri'?200:270)+16;o.cx=WV>2*hw?clamp(o.x,CAM.x+hw,CAM.x+WV-hw):CAM.x+WV/2}if(near(o,700)&&!o.said){o.said=1;if(o.k=='sq')hush();say(o.k=='tri'?'t_asm1':'t_asm2')}
  if(!o.done&&EX.asm.ok(o)){o.done=1;o.t=0;SFX.win();say('r_asm');part(o.cx,o.cy,30,'#7ff0a2',400,1,0,10)}
  if(o.done&&o.t<9){o.t+=dt;if(o.t>.9&&!o.built){o.built=1;for(const [x,y] of o.cells)setT(x,y,18);SFX.crash();shake(8);for(const [x,y] of o.cells)part(x*T+30,y*T+30,5,'#7ff0a2',260,.6,400,8)}}},
 top(o){return o.built?null:130},
 pcs(o){const s=56,a=EX.asm.ok(o);if(o.k=='tri')return [0,1].map(i=>{const ok=i==0?o.st[0]==0:o.st[1]==2;return [o.cx+(i==0?-1:1)*(ok||a?0:95),o.cy]});return [0,1].map(i=>{const d=i==0?-1:1;return [o.cx+d*(o.st[i]?s:s+70),o.cy+(o.st[i]?0:(i?-20:20))]})},
 tap(o,wx,wy){if(o.done)return false;const ps=EX.asm.pcs(o);let i=Math.hypot(wx-ps[0][0],wy-ps[0][1])<=Math.hypot(wx-ps[1][0],wy-ps[1][1])?0:1;const q=ps[i];if(Math.hypot(wx-q[0],wy-q[1])<120){if(o.k=='tri'){o.st[i]=(o.st[i]+1)%4}else{o.st[i]=1}SFX.light(2+i);return true}return false},
 draw(o){if(o.built&&o.t>1.6)return;X.save();if(o.built)X.globalAlpha=1-(o.t-.9)/0.7;const s=56;
  if(o.done){const k=clamp(o.t/.9,0,1),tx=o.cells[0][0]*T+T,ty=o.cells[0][1]*T;X.translate(lerp(0,tx-o.cx,k*k),lerp(0,ty-o.cy,k*k))}
  panel(o.cx-(o.k=='tri'?200:270),o.cy-95,o.k=='tri'?400:540,190,30);
  if(o.k=='tri'){// контур квадрата-цели
   X.setLineDash([10,8]);X.strokeStyle='rgba(122,86,184,.6)';X.lineWidth=4;X.strokeRect(o.cx-s,o.cy-s,s*2,s*2);X.setLineDash([]);
   const pcs=[[o.cx-s,o.cy-s],[o.cx-s,o.cy-s]];for(let i=0;i<2;i++){const r=o.st[i];const ok=i==0?r==0:r==2;X.save();const ccx=o.cx+(i==0?-1:1)*(ok||EX.asm.ok(o)?0:95),ccy=o.cy;X.translate(ccx,ccy);X.rotate(r*Math.PI/2);
    X.fillStyle=i==0?'#35c46a':'#7ff0a2';X.strokeStyle='#145c30';X.lineWidth=4;X.beginPath();X.moveTo(-s,-s);X.lineTo(-s,s);X.lineTo(s,s);X.closePath();X.fill();X.stroke();X.restore()}}
  else{X.setLineDash([10,8]);X.strokeStyle='rgba(122,86,184,.6)';X.lineWidth=4;X.strokeRect(o.cx-s*2,o.cy-s,s*4,s*2);X.setLineDash([]);
   for(let i=0;i<2;i++){const d=(i==0?-1:1);const x=o.cx+d*(o.st[i]?s:s+70),y=o.cy+(o.st[i]?0:(i?-20:20));X.fillStyle=i==0?'#35c46a':'#7ff0a2';X.strokeStyle='#145c30';X.lineWidth=4;X.beginPath();X.roundRect(x-s,y-s,s*2,s*2,4);X.fill();X.stroke()}}
  X.restore()},
 hint(o){if(o.done||!near(o,700))return;const ps=EX.asm.pcs(o);const i=o.k=='tri'?(o.st[0]!=0?0:1):(o.st[0]?1:0);HAND={x:ps[i][0],y:ps[i][1],t:0,k:'tap'};say(o.k=='tri'?'t_asm1':'t_asm2');return true},
 bot(o,dt){if(o.built||!near(o,700))return;const p=P;WX.go(o.x-4*T,20);BOT.j=0;G.bt2=(G.bt2||0)+dt;if(!o.done&&G.bt2>.6){G.bt2=0;const ps=EX.asm.pcs(o);const i=o.k=='tri'?(o.st[0]!=0?0:1):(o.st[0]?1:0);WX.bt(ps[i][0],ps[i][1])}return true}};
// босс: Квадратыч
EX.rob={setup(o){o.boss=1;o.h=250;o.st='intro';o.t=0;o.lit=0;o.bolts=[];o.cd=2;o.x0=o.x;o.dir=-1;o.stun=0;o.used=0},
 corners(o){const cx=o.x-150,cy=600-150,r=62;return [[cx-r,cy-r],[cx+r,cy-r],[cx+r,cy+r],[cx-r,cy+r]]},
 upd(o,dt){const p=P;o.t+=dt;const bx=o.bx;
  if(p.x>o.x-90){p.x=o.x-90;p.vx=Math.min(0,p.vx)}
  if(o.st=='intro'){const m=CAM.x+WV-125;if(o.x0>m){o.x0=m;o.x=m}if(o.t>3)o.st='fight';return}
  if(o.st=='calm'){if(o.t>1.5&&!speaking()&&!G.won)win();return}
  if(o.stun>0){o.stun-=dt;if(o.stun<=0&&o.lit<4)o.used=0}
  else{o.x+=o.dir*90*dt;if(o.x<o.x0-2.5*T)o.dir=1;if(o.x>o.x0)o.dir=-1;o.cd-=dt;if(o.cd<=0){o.cd=2.2;o.bolts.push({x:o.x-60,y:600-95,vx:-430});SFX.light(1)}
   if(p.form=='cube'&&p.land>0&&Math.abs(p.x-bx)<70&&Math.abs(p.y-600)<4){o.stun=6.5;o.used=0;shake(12);SFX.crash();part(o.x,600-o.h*.6,30,'#ffe36b',400,.8,0,8);hush();say('b3h')}}
  for(const b of o.bolts){b.x+=b.vx*dt;if(b.x<0)b.dead=1;const [w,h]=dims(p);if(Math.abs(b.x-p.x)<w/2+18&&b.y>p.y-h&&b.y<p.y+5){if(p.form=='cube'){b.dead=1;part(b.x,b.y,10,'#bfe0ff',300,.5,0)}else{hurt(p,b.x);b.dead=1}}}o.bolts=o.bolts.filter(b=>!b.dead);
  if(!o.said2&&o.t>9&&o.lit==0&&o.stun<=0){o.said2=1;say('b3t')}},
 tap(o,wx,wy){if(o.st!='fight')return false;const cs=EX.rob.corners(o);for(let i=0;i<4;i++){const q=cs[i];if(Math.hypot(wx-q[0],wy-q[1])<70){if(o.stun<=0){say('b3t');SFX.no();return true}if(i<o.lit)return true;
   throwBoom(q[0],q[1],()=>{if(i!=o.lit||o.stun<=0)return;o.lit++;SFX.light(o.lit);say('n'+o.lit);part(q[0],q[1],16,'#7ff0a2',300,.6,0);if(o.lit==4){o.st='calm';o.t=0;o.bolts=[];SFX.win();hush();say('c_sq');say('b3c')}});return true}}return false},
 hint(o){if(o.st!='fight')return true;if(o.stun>0){const q=EX.rob.corners(o)[o.lit];HAND={x:q[0],y:q[1],t:0,k:'tap'};say('b3h')}else if(P.form!='cube'){HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say('b3t')}else{HAND={x:o.bx,y:560,t:0,k:'tap'};say('b3t')}return true},
 bot(o,dt){const p=P;if(o.st!='fight'){BOT.r=0;return true}BOT.f=p.form!='cube'&&!G.botF?1:0;G.botF=BOT.f?.3:Math.max(0,(G.botF||0)-dt);
  if(o.stun<=0){if(WX.go(o.bx,10)&&p.ground)G.bj=.3}else{WX.go(o.bx-60,30);G.bt=(G.bt||0)+dt;if(G.bt>.7&&!BOOM.length&&o.stun<5.5){G.bt=0;const q=EX.rob.corners(o)[o.lit];if(q)WX.bt(q[0],q[1])}}WX.botJump(dt);return true},
 draw(o){X.save();X.fillStyle='#3d4660';X.beginPath();X.roundRect(o.bx-56,586,112,16,6);X.fill();const pr=o.stun>0?14:0;const g=X.createLinearGradient(0,566,0,588);g.addColorStop(0,'#ffcc33');g.addColorStop(1,'#c98a00');X.fillStyle=g;X.beginPath();X.roundRect(o.bx-44,566+pr,88,22,8);X.fill();X.strokeStyle='#2a2f44';X.lineWidth=3;X.stroke();paintShape('sq',o.bx,546+pr,14,'#35c46a',0,false,o.stun>0?0:16);X.restore();
  for(const b of o.bolts){X.save();X.translate(b.x,b.y);X.rotate(G.t*8);X.shadowColor='#7fd3ff';X.shadowBlur=16;X.fillStyle='#bfe8ff';X.strokeStyle='#3f7fa8';X.lineWidth=3;X.beginPath();X.rect(-16,-16,32,32);X.fill();X.stroke();X.restore()}
  const tilt=o.st=='calm'?0:(4-o.lit)*.07;X.save();X.translate(o.x,600);X.rotate(-tilt+(o.stun>0?Math.sin(G.t*30)*.015:0));img('lineup_2',0,0,o.h,0);X.restore();
  if(o.stun>0)for(let i=0;i<3;i++){const a=G.t*4+i*2.1;paintShape('sq',o.x+Math.cos(a)*50,600-o.h-10+Math.sin(a)*12,10,'#ffe36b',a,false,10)}
  if(!o.noC&&(o.st=='fight'||o.st=='calm'&&o.t<1.5)){const cs=EX.rob.corners(o);X.save();X.globalAlpha=o.stun>0||o.st=='calm'?.95:.35;X.strokeStyle='#7fd3ff';X.lineWidth=6;X.shadowColor='#7fd3ff';X.shadowBlur=14;X.beginPath();cs.forEach((q,i)=>{const d=i<o.lit?0:(1-i%2*2)*10*Math.sin(G.t*3);i?X.lineTo(q[0]+d,q[1]):X.moveTo(q[0]+d,q[1])});X.closePath();X.stroke();
   cs.forEach((q,i)=>{const lit=i<o.lit;X.fillStyle=lit?'#7ff0a2':'rgba(150,110,220,.85)';X.beginPath();X.arc(q[0],q[1],lit?20:16+(o.stun>0&&i==o.lit?5*Math.sin(G.t*8):0),0,7);X.fill();X.strokeStyle='#fff';X.lineWidth=3;X.stroke()});X.restore()}
  if(!o.noC)txt(o.lit+' из 4',o.x-o.h*.25-230,600-o.h*.62,Math.max(52,58/Z),'#fff3a0')}};
WX.add(()=>{
const pw=WX.wantF;WX.wantF=function(want,fx,fy){if(pw){const r=pw(want,fx,fy);if(r&&r!=want)return r}if(WX.wn()!=3)return want;const p=P;
 if(L.forms.includes('board')&&L.meta.race)return 'board';
 for(const o of ENTS)if(o.type=='btn'&&!o.on&&o.x-p.x<9*T&&o.x-p.x>-60)return 'cube';
 for(let k=0;k<6;k++)if(WX.gateAt(fx+k))return want;
 return want=='cube'?'girl':want};
LV['3-1']=()=>{const b=new LB(172,'3-1');b.meta={name:'3-1 Тяжёлый кубик',intro:['w3','l31'],forms:[]};
 b.g(0,74).g(78,118).g(122,172).e('stone',16,10,{shape:'sq',give:'cube'});
 b.col(40,0,5,1).e('btn',38,10,{door:40}).col(62,0,5,1).col(62,6,9,11).e('tip',56,10,{k:'t_sqgate',when:56});
 b.col(96,0,5,1).e('btn',94,10,{door:96}).col(108,0,5,1).col(108,6,9,11).col(142,0,5,1).e('btn',140,10,{door:142});
 b.pl(48,7,3).pl(84,7,3).pl(128,7,3);
 b.coins(26,8,6,'coin_circ',1).coins(66,8,6,'coin_circ',1).coins(110,8,7,'coin_circ',1).coins(146,8,8,'coin_circ',1);
 b.e('enemy',30,10).e('enemy',54,10).e('enemy',88,10).e('enemy',126,10).e('enemy',156,10);
 b.e('star',49,6).e('star',85,6).e('star',129,6).e('goal',166,10);
 [6,22,50,80,114,134,160].forEach((x,i)=>b.d(i%2?'bush':'sign',x,10,.9));return b};
LV['3-2']=()=>{const b=new LB(170,'3-2');b.meta={name:'3-2 Фигуры в вещах',intro:['l32'],forms:['cube']};
 b.g(0,170).e('find',20,10,{ks:['clock','window','pizza'],ans:'sq'}).e('find',58,10,{ks:['door','clock','window'],ans:'circ'}).e('find',96,10,{ks:['pizza','window','door'],ans:'rect'}).e('find',134,10,{ks:['clock','pizza','door'],ans:'tri'});
 b.coins(8,8,6,'coin_circ',1).coins(42,8,8,'coin_circ',1).coins(80,8,8,'coin_circ',1).coins(118,8,8,'coin_circ',1).coins(150,8,8,'coin_circ',1);
 b.e('enemy',45,10).e('enemy',84,10).e('enemy',122,10).e('enemy',156,10);
 b.e('star',36,4).e('star',112,4).e('star',152,6).pl(34,5,4).pl(110,5,4).pl(150,7,4).e('goal',165,10);
 [4,48,86,124,160].forEach((x,i)=>b.d(i%2?'bush':'sign',x,10,.9));return b};
LV['3-3']=()=>{const b=new LB(210,'3-3');b.meta={name:'3-3 Гонка по крышам',intro:['l33'],forms:['cube'],race:1};
 b.g(0,30).e('stone',14,10,{shape:'rect',give:'board'});
 const R=[[30,52,9],[55,80,8],[83,104,9],[107,130,8],[133,150,8],[153,176,9],[179,210,8]];
 for(const [a,c,t] of R)b.g(a,c,t);
 b.col(92,0,5,1).col(92,6,8,12).e('tip',86,9,{k:'t_rgate',when:86}).col(140,0,4,1).col(140,5,7,12).col(186,0,4,1).col(186,5,7,12);
 b.e('rival',20,10,{end:200});R.forEach(([a,c,t],i)=>b.coins(a+4,t-2,Math.min(10,c-a-8),'coin_circ',1));
 b.e('star',53,5).e('star',131,4).e('star',177,5).e('racegoal',203,8);
 [6,22,60,112,160,195].forEach((x,i)=>b.d('sign',x,R.find(r=>x>=r[0]&&x<r[1])?R.find(r=>x>=r[0]&&x<r[1])[2]:10,.9));return b};
LV['3-4']=()=>{const b=new LB(160,'3-4');b.meta={name:'3-4 Сложи фигуру',intro:['l34'],forms:['cube','board']};
 b.g(0,40).g(40,44,6).g(44,70).g(82,160).e('asm',30,10,{kind:'tri',cells:[[38,8],[39,8],[38,9],[39,9]]});
 const cells=[];for(let x=70;x<82;x++)cells.push([x,10]);b.e('asm',62,10,{kind:'sq',cells});
 b.coins(8,8,6,'coin_circ',1).coins(46,8,8,'coin_circ',1).coins(70,7,12,'coin_circ',2).coins(90,8,8,'coin_circ',1);
 b.pl(110,7,3).pl(126,6,3).g(140,141,9);
 b.e('enemy',52,10).e('enemy',96,10).e('enemy',118,10).e('enemy',134,10).e('enemy',150,10);
 b.e('star',41,4).e('star',111,6).e('star',127,4).e('goal',155,10);
 [6,20,48,90,104,146].forEach((x,i)=>b.d(i%2?'bush':'sign',x,10,.9));return b};
LV['3-B']=()=>{const n=bossN();const b=new LB(n,'3-B');b.zoom=1.6;b.gf=.78;b.meta={name:'Босс: Квадратыч',intro:['b3a','b3t'],forms:['cube'],boss:'rob'};b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('rob',n-3,10,{bx:Math.round(n*.36)*T+30});return b};
});
})();
