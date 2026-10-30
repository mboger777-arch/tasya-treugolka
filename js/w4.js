// Мир 4: Подводный риф
(function(){
const bossN=()=>Math.max(14,Math.ceil(W/1.6/T)+1);
const near=(o,d=650)=>o.x-P.x<d&&P.x-o.x<240;
const big=()=>Math.max(52,58/Z);
function ngon(n,cx,cy,r,a0){const a=[];for(let i=0;i<n;i++){const t=a0+i*2*Math.PI/n;a.push([cx+Math.cos(t)*r,cy+Math.sin(t)*r])}return a}
function nearest(pts,mask,wx,wy,d){let bi=-1,bd=d;pts.forEach((q,i)=>{if(mask&(1<<i))return;const h=Math.hypot(wx-q[0],wy-q[1]);if(h<bd){bd=h;bi=i}});return bi}
function firstFree(pts,mask){for(let i=0;i<pts.length;i++)if(!(mask&(1<<i)))return i;return -1}
const wall=(gx,v)=>{for(let y=0;y<=9;y++)setT(gx,y,v)};
// ---- декор рифа: водоросли и кораллы
EX.reef={setup(o){o.its=o.xs.map((x,i)=>({x:x*T+30,k:i%3,s:.8+((x*37)%5)/10}))},
 draw(o){for(const it of o.its){if(it.x<CAM.x-200||it.x>CAM.x+WV+200)continue;const gy=600;X.save();
  if(it.k==0){X.strokeStyle='#2f9a5a';X.lineCap='round';for(let j=0;j<3;j++){X.lineWidth=12-j*2;X.beginPath();X.moveTo(it.x+j*16-16,gy);for(let s=1;s<=8;s++){const y=gy-s*26*it.s;X.lineTo(it.x+j*16-16+Math.sin(G.t*1.6+s*.7+j)*10*s/8,y)}X.stroke()}
   X.strokeStyle='#5fd08a';X.lineWidth=4;X.beginPath();X.moveTo(it.x-16,gy);for(let s=1;s<=8;s++)X.lineTo(it.x-16+Math.sin(G.t*1.6+s*.7)*10*s/8+3,gy-s*26*it.s);X.stroke()}
  else if(it.k==1){const c=['#ff7a8a','#ff9a5a','#c07aff'][Math.floor(it.x/60)%3];X.strokeStyle=c;X.lineCap='round';X.lineWidth=11;const br=(x,y,a,l,d)=>{if(d>3)return;const x2=x+Math.cos(a)*l,y2=y+Math.sin(a)*l;X.beginPath();X.moveTo(x,y);X.lineTo(x2,y2);X.stroke();br(x2,y2,a-.45,l*.72,d+1);br(x2,y2,a+.45,l*.72,d+1)};X.lineWidth=10;br(it.x,gy,-Math.PI/2,60*it.s,0)}
  else{X.fillStyle='#f0c9a0';X.strokeStyle='#b07a50';X.lineWidth=3;X.beginPath();X.ellipse(it.x,gy-14,34*it.s,16,0,Math.PI,0);X.fill();X.stroke();X.fillStyle='#fff7e8';X.beginPath();X.arc(it.x,gy-22,7,0,7);X.fill()}
  X.restore()}}};
// ---- морская звезда закрыла путь: бумеранг в каждый луч
EX.sstar={top(o){return o.done?null:o.cy-o.r-100},setup(o){o.gx=Math.floor(o.x/T)+3;wall(o.gx,15);o.cx=o.gx*T+30;o.cy=o.cy||400;o.r=128;o.rot=0;o.spd=o.spd||0;o.lit=0;o.mask=0;o.done=0;o.fy=0},
 pts(o){return ngon(5,o.cx,o.cy-o.fy,o.r,-Math.PI/2+o.rot)},
 upd(o,dt){o.rot+=o.spd*dt;if(o.done){o.fy+=dt*(180+o.fy*2);o.rot+=dt*3;return}
  if(!o.said&&near({x:o.cx},700)){o.said=1;say('t_star')}},
 tap(o,wx,wy){if(o.done||Math.abs(o.cx-P.x)>WV)return false;const pts=EX.sstar.pts(o);const i=nearest(pts,o.mask,wx,wy,85);if(i<0)return false;
  throwBoom(pts[i][0],pts[i][1],()=>{if(o.mask&(1<<i)||o.done)return;o.mask|=1<<i;o.lit++;SFX.light(o.lit);say('n'+o.lit);const q=EX.sstar.pts(o)[i];part(q[0],q[1],16,'#fff3a0',300,.6,0);
   if(o.lit==5){o.done=1;wall(o.gx,0);SFX.win();shake(6);hush();say('r_starf');part(o.cx,o.cy,40,'#ffb36b',500,1,0,10)}});return true},
 hint(o){if(o.done||!near({x:o.cx},700))return;const q=EX.sstar.pts(o)[firstFree(EX.sstar.pts(o),o.mask)];HAND={x:q[0],y:q[1],t:0,k:'tap'};say('t_star');return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>560||d<-60)return;WX.go(o.cx-340,30);G.bt=(G.bt||0)+dt;if(G.bt>.7&&!BOOM.length){G.bt=0;const ps=EX.sstar.pts(o),i=firstFree(ps,o.mask);if(i>=0)WX.bt(ps[i][0],ps[i][1])}BOT.j=0;return true},
 draw(o){if(o.fy>900)return;const {cx,r}=o,cy=o.cy-o.fy;X.save();
  if(!o.done){X.fillStyle='#8a6a8f';X.beginPath();X.roundRect(cx-34,cy+40,68,600-cy-40,16);X.fill();X.fillStyle='rgba(255,140,170,.5)';for(let k=0;k<5;k++){X.beginPath();X.arc(cx-14+(k%2)*28,cy+80+k*((600-cy-90)/5),9,0,7);X.fill()}}
  X.translate(cx,cy);X.rotate(o.rot);
  X.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;i?X.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):X.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}X.closePath();
  const g=X.createRadialGradient(0,0,10,0,0,r);g.addColorStop(0,'#ffb36b');g.addColorStop(1,'#e8603c');X.fillStyle=g;X.lineJoin='round';X.lineWidth=26;X.strokeStyle='#e8603c';X.stroke();X.fill();
  X.fillStyle='rgba(255,230,190,.8)';for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5;for(let k=1;k<4;k++){X.beginPath();X.arc(Math.cos(a)*r*k*.24,Math.sin(a)*r*k*.24,5,0,7);X.fill()}}
  X.rotate(-o.rot);X.fillStyle='#fff';X.beginPath();X.arc(-18,-6,13,0,7);X.arc(18,-6,13,0,7);X.fill();X.fillStyle='#2a1a3a';X.beginPath();X.arc(-16,-4,7,0,7);X.arc(20,-4,7,0,7);X.fill();
  X.strokeStyle='#7a2a20';X.lineWidth=4;X.beginPath();if(o.done)X.arc(0,12,12,.2,Math.PI-.2);else X.arc(0,26,10,Math.PI+.4,-.4);X.stroke();X.restore();
  const ps=EX.sstar.pts(o);ps.forEach((q,i)=>{const lit=o.mask&(1<<i);X.save();X.shadowColor=lit?'#fff3a0':'#ffffff';X.shadowBlur=lit?24:10;X.fillStyle=lit?'#fff3a0':'rgba(255,255,255,.55)';X.beginPath();X.arc(q[0],q[1],lit?22:16+5*Math.sin(G.t*6+i),0,7);X.fill();X.strokeStyle=lit?'#ffb300':'#fff';X.lineWidth=4;X.stroke();X.restore()});
  if(!o.done){txt(o.lit+' из 5',cx,cy-r-48,big(),'#fff3a0');panelHide(cx-r,cy-r-90,2*r)}}};
// ---- падающие осколки: щит отбивает
EX.shards={setup(o){o.a=o.x0*T;o.b=o.x1*T;o.list=[];o.cd=1},
 upd(o,dt){const p=P;o.x=clamp(p.x,o.a,o.b);const inz=p.x>o.a-120&&p.x<o.b;if(!o.said&&p.x>o.a-500){o.said=1;say('t_shard')}
  if(inz){o.cd-=dt;if(o.cd<=0){o.cd=.55+Math.random()*.25;const x=clamp(p.x+(Math.random()*500-160)+p.vx*.4,o.a,o.b);o.list.push({x,y:CAM.y+20,vy:120,vx:0,rot:Math.random()*6,k:Math.floor(Math.random()*3),warn:.5})}}
  const [w,h]=dims(p);
  for(const s of o.list){if(s.warn>0){s.warn-=dt;continue}s.vy=Math.min(s.vy+700*dt,420);s.y+=s.vy*dt;s.x+=s.vx*dt;s.rot+=dt*(s.bn?9:3);
   if(!s.bn&&Math.abs(s.x-p.x)<w/2+16&&s.y>p.y-h-10&&s.y<p.y){if(p.form=='shield'){s.bn=1;s.vy=-380;s.vx=(s.x<p.x?-1:1)*260;tone(1568+Math.random()*400,.25,'triangle',.08);part(s.x,s.y,10,'#fff3a0',260,.5,0,6)}else{s.dead=1;hurt(p,s.x);part(s.x,s.y,12,'#d29bff',260,.5,300,6)}}
   if(s.y>590){s.dead=1;part(s.x,590,8,'#d29bff',220,.5,300,5);SFX.bump&&0}}
  o.list=o.list.filter(s=>!s.dead)},
 hint(o){if(!(P.x>o.a-300&&P.x<o.b))return;if(P.form!='shield'&&L.meta.noFM&&L.forms.includes('shield')){P.form='girl';transform(P);return}if(P.form!='shield'){HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say('t_shard');return true}},
 draw(o){if(o.b<CAM.x-100||o.a>CAM.x+WV+100)return;X.save();const cy0=CAM.y-4;
  for(let x=o.a-30;x<o.b+30;x+=46){if(x<CAM.x-60||x>CAM.x+WV+60)continue;const h=40+((x*13)%5)*12;X.fillStyle=(x/46)%2<1?'#7a3fb0':'#5a2a8a';X.beginPath();X.moveTo(x-24,cy0);X.lineTo(x,cy0+h);X.lineTo(x+24,cy0);X.fill();X.fillStyle='rgba(255,255,255,.25)';X.beginPath();X.moveTo(x-10,cy0);X.lineTo(x,cy0+h*.7);X.lineTo(x-2,cy0);X.fill()}
  for(const s of o.list){if(s.warn>0){X.fillStyle='rgba(120,40,160,'+(.25+.25*Math.sin(G.t*20))+')';X.beginPath();X.ellipse(s.x,598,30,8,0,0,7);X.fill();continue}
   X.fillStyle='rgba(60,20,90,.25)';X.beginPath();X.ellipse(s.x,598,22*(1-(600-s.y)/600)+6,6,0,0,7);X.fill();
   X.save();X.translate(s.x,s.y);X.rotate(s.rot);X.shadowColor='#e0b0ff';X.shadowBlur=14;const c=['#c77dff','#ff7ad9','#7ad7ff'][s.k];X.fillStyle=c;X.strokeStyle='#3a1d55';X.lineWidth=3;X.beginPath();X.moveTo(0,-26);X.lineTo(16,14);X.lineTo(-14,18);X.closePath();X.fill();X.stroke();X.fillStyle='rgba(255,255,255,.6)';X.beginPath();X.moveTo(-2,-16);X.lineTo(4,6);X.lineTo(-6,8);X.fill();X.restore()}
  X.restore()}};
// ---- клетка-шестиугольник с Формиком
EX.cage={top(o){return o.done?null:o.cy-o.r-100},setup(o){o.gx=Math.floor(o.x/T)+3;wall(o.gx,15);o.cx=o.gx*T+30;o.cy=405;o.r=138;o.lit=0;o.mask=0;o.done=0;o.t=0},
 pts(o){const v=ngon(6,o.cx,o.cy,o.r,-Math.PI/2);return v.map((q,i)=>{const n=v[(i+1)%6];return [(q[0]+n[0])/2,(q[1]+n[1])/2]})},
 upd(o,dt){o.t+=dt;if(!o.said&&near({x:o.cx},700)){o.said=1;say('t_cage')}
  if(o.done==1&&o.t>.6&&!speaking()){o.done=2;if(!L.forms.includes('hex'))L.forms.push('hex');if(!SAVE.forms.includes('hex'))SAVE.forms.push('hex');save();P.form='girl';const i=L.forms.indexOf('hex');P.form=i>0?L.forms[i-1]:'girl';transform(P);say('t_hexf')}},
 tap(o,wx,wy){if(o.done||Math.abs(o.cx-P.x)>WV)return false;const ps=EX.cage.pts(o);const i=nearest(ps,o.mask,wx,wy,90);if(i<0)return false;
  throwBoom(ps[i][0],ps[i][1],()=>{if(o.mask&(1<<i)||o.done)return;o.mask|=1<<i;o.lit++;SFX.light(o.lit);say('n'+o.lit);part(ps[i][0],ps[i][1],16,'#ffd35a',300,.6,0);
   if(o.lit==6){o.done=1;o.t=0;wall(o.gx,0);L.meta.noFM=0;FM.x=o.cx;FM.y=o.cy-80;FM.catch=0;SFX.win();shake(10);hush();say('w4s');part(o.cx,o.cy,60,'#fff3a0',600,1.2,0,12)}});return true},
 hint(o){if(o.done||!near({x:o.cx},700))return;const ps=EX.cage.pts(o);const q=ps[firstFree(ps,o.mask)];HAND={x:q[0],y:q[1],t:0,k:'tap'};say('t_cage');return true},
 bot(o,dt){if(o.done==1){BOT.r=0;return true}if(o.done)return;const d=o.cx-P.x;if(d>560||d<-60)return;WX.go(o.cx-360,30);G.bt=(G.bt||0)+dt;if(G.bt>.7&&!BOOM.length){G.bt=0;const ps=EX.cage.pts(o),i=firstFree(ps,o.mask);if(i>=0)WX.bt(ps[i][0],ps[i][1])}BOT.j=0;return true},
 draw(o){const {cx,cy,r}=o;if(cx<CAM.x-300||cx>CAM.x+WV+300)return;X.save();
  if(!o.done){X.fillStyle='#4a2a6a';X.beginPath();X.roundRect(cx-40,cy+r*.85,80,600-cy-r*.85,10);X.fill();
   X.globalAlpha=.3;X.fillStyle='#1a0a3a';X.beginPath();ngon(6,cx,cy,r,-Math.PI/2).forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath();X.fill();X.globalAlpha=1;
   img('fm'+(Math.floor(G.t*2)%4),cx,cy+70,140);
   X.save();X.beginPath();ngon(6,cx,cy,r,-Math.PI/2).forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath();X.clip();X.strokeStyle='#5a2a8a';X.lineWidth=9;for(let x=cx-r;x<=cx+r;x+=36){X.beginPath();X.moveTo(x,cy-r);X.lineTo(x,cy+r);X.stroke()}X.restore();
   const v=ngon(6,cx,cy,r,-Math.PI/2);for(let i=0;i<6;i++){const a=v[i],b=v[(i+1)%6],lit=o.mask&(1<<i);X.save();X.lineCap='round';X.lineWidth=16;X.strokeStyle=lit?'#ffd35a':'#7a3fb0';X.shadowColor=lit?'#ffd35a':'#c77dff';X.shadowBlur=lit?24:8;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.stroke();X.restore()}
   EX.cage.pts(o).forEach((q,i)=>{if(o.mask&(1<<i))return;X.fillStyle='rgba(255,255,255,.6)';X.beginPath();X.arc(q[0],q[1],16+5*Math.sin(G.t*6+i),0,7);X.fill();X.strokeStyle='#fff';X.lineWidth=4;X.stroke()});
   txt(o.lit+' из 6',cx,cy-r-46,big(),'#fff3a0');panelHide(cx-r,cy-r-90,2*r)}
  else if(o.t<1.2){X.globalAlpha=1-o.t/1.2;const v=ngon(6,cx,cy,r+o.t*200,-Math.PI/2+o.t);X.strokeStyle='#ffd35a';X.lineWidth=14;X.beginPath();v.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath();X.stroke()}
  X.restore()}};
// ---- медовая стенка: подсказка и бот
EX.honey={hint(o){if(!near(o,520)||P.x>o.x)return;if(P.form!='hex'){HAND={x:0,y:0,t:0,k:'screen',bx:'form'}}else HAND={x:0,y:0,t:0,k:'screen',bx:'jump'};say('t_cliff');return true},
 upd(o){if(!o.said&&near(o,420)&&L.forms.includes('hex')){o.said=1;say('t_cliff')}},
 bot(o){if(P.form=='hex'&&Math.abs(P.wall)==2){BOT.r=1;BOT.l=0;BOT.j=1;return true}}};
// ---- босс: Краб Отшельник
EX.crab={setup(o){o.boss=1;o.h=235;o.st='intro';o.t=0;o.lit=0;o.mask=0;o.pearls=[];o.cd=2.6;o.stun=0;o.x0=o.x},
 hc(o){return [o.x+o.h*.12,600-o.h*.48+(o.stun>0?6:0),o.h*.44]},
 pts(o){const [cx,cy,r]=EX.crab.hc(o);const v=ngon(6,cx,cy,r,-Math.PI/2);return v.map((q,i)=>{const n=v[(i+1)%6];return [(q[0]+n[0])/2,(q[1]+n[1])/2]})},
 upd(o,dt){const p=P;o.t+=dt;if(p.x>o.x-190){p.x=o.x-190;p.vx=Math.min(0,p.vx)}
  {const m=CAM.x+WV-o.h*499/400/2-12;if(o.x>m)o.x=o.st=='intro'?m:Math.max(m,o.x-160*dt)}
  if(o.st=='intro'){if(o.t>3)o.st='fight';return}
  if(o.st=='calm'){if(o.t>1.5&&!speaking()&&!G.won)win();return}
  if(o.stun>0){o.stun-=dt;if(o.stun<=0)o.cd=2}
  else{o.cd-=dt;if(o.cd<=0){o.cd=2.4;o.pearls.push({x:o.x-o.h*.5,y:600-80,vx:-380,b:0});SFX.boom()}}
  const [w,h]=dims(p);
  for(const q of o.pearls){q.x+=q.vx*dt;q.y=600-80+Math.sin(q.x*.02)*8;if(q.x<CAM.x-60)q.dead=1;
   if(!q.b&&Math.abs(q.x-p.x)<w/2+20&&q.y>p.y-h&&q.y<p.y+5){if(p.form=='shield'&&p.face>0){q.b=1;q.vx=560;tone(1568,.3,'triangle',.1);part(q.x,q.y,12,'#fff',260,.5,0,6)}else{q.dead=1;hurt(p,q.x)}}
   if(q.b&&q.x>o.x-o.h*.4){q.dead=1;o.stun=8;o.pearls.forEach(z=>z.dead=1);shake(12);SFX.crash();part(o.x,600-o.h*.5,30,'#fff3a0',400,.8,0,8);hush();say('b4s')}}
  o.pearls=o.pearls.filter(q=>!q.dead);
  if(!o.said2&&o.t>10&&o.lit==0&&o.stun<=0){o.said2=1;say('b4h')}},
 tap(o,wx,wy){if(o.st!='fight')return false;const ps=EX.crab.pts(o);const i=nearest(ps,o.mask,wx,wy,80);if(i<0)return false;if(o.stun<=0){SFX.no();say('b4h');return true}
  throwBoom(ps[i][0],ps[i][1],()=>{if(o.mask&(1<<i)||o.stun<=0)return;o.mask|=1<<i;o.lit++;SFX.light(o.lit);say('n'+o.lit);const q=EX.crab.pts(o)[i];part(q[0],q[1],16,'#ffd35a',300,.6,0);
   if(o.lit==6){o.st='calm';o.t=0;o.pearls=[];o.stun=0;SFX.win();hush();say('b4c')}});return true},
 hint(o){if(o.st!='fight')return true;if(o.stun>0){const ps=EX.crab.pts(o);const q=ps[firstFree(ps,o.mask)];HAND={x:q[0],y:q[1],t:0,k:'tap'};say('b4s')}else if(P.form!='shield'){HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say('b4h')}else{HAND={x:0,y:0,t:0,k:'screen',bx:'right'};say('b4h')}return true},
 bot(o,dt){const p=P;if(o.st!='fight'){BOT.r=0;return true}BOT.f=p.form!='shield'&&!G.botF?1:0;G.botF=BOT.f?.3:Math.max(0,(G.botF||0)-dt);
  const tx=o.x-430;if(p.x<tx-30){BOT.r=1;BOT.l=0}else if(p.x>tx+90){BOT.l=1;BOT.r=0}else{BOT.l=0;BOT.r=p.face<0}
  if(o.stun>0){G.bt=(G.bt||0)+dt;if(G.bt>.7&&!BOOM.length&&o.stun<7.3){G.bt=0;const ps=EX.crab.pts(o),i=firstFree(ps,o.mask);if(i>=0)WX.bt(ps[i][0],ps[i][1])}}BOT.j=0;return true},
 draw(o){X.save();
  for(const q of o.pearls){X.save();X.shadowColor='#fff';X.shadowBlur=14;const g=X.createRadialGradient(q.x-6,q.y-6,2,q.x,q.y,18);g.addColorStop(0,'#ffffff');g.addColorStop(1,q.b?'#ffe36b':'#d8d0f0');X.fillStyle=g;X.beginPath();X.arc(q.x,q.y,18,0,7);X.fill();X.restore()}
  const sq=o.stun>0?Math.sin(G.t*30)*.015:0;X.translate(o.x,600);X.rotate(sq);img('crab_0',0,0,o.h,0);X.restore();
  const [cx,cy,r]=EX.crab.hc(o);
  if(o.st=='calm'){const k=Math.min(1,o.t/.8);X.save();X.globalAlpha=k;const cols=['#ff8a8a','#ffcc33','#7ff0a2','#7fd3ff','#c58cff','#ffa726'];const v=ngon(6,cx,cy,r*1.04,-Math.PI/2);
   for(let i=0;i<6;i++){const a=v[i],b=v[(i+1)%6];X.fillStyle=cols[i];X.beginPath();X.moveTo(cx,cy);X.lineTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.closePath();X.fill();X.strokeStyle='#fff';X.lineWidth=4;X.stroke()}X.restore()}
  else if(o.st=='fight'){X.save();X.strokeStyle='rgba(60,30,40,.8)';X.lineWidth=5;X.beginPath();X.moveTo(cx-r*.6,cy-r*.5);X.lineTo(cx-r*.1,cy-r*.05);X.lineTo(cx-r*.3,cy+r*.5);X.moveTo(cx-r*.1,cy-r*.05);X.lineTo(cx+r*.5,cy+r*.1);X.stroke();
   const v=ngon(6,cx,cy,r,-Math.PI/2);X.globalAlpha=o.stun>0?1:.45;for(let i=0;i<6;i++){const a=v[i],b=v[(i+1)%6],lit=o.mask&(1<<i);X.save();X.lineCap='round';X.lineWidth=12;X.strokeStyle=lit?'#ffd35a':'#9fd8ff';X.shadowColor=lit?'#ffd35a':'#9fd8ff';X.shadowBlur=16;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.stroke();X.restore()}
   if(o.stun>0)EX.crab.pts(o).forEach((q,i)=>{if(o.mask&(1<<i))return;X.fillStyle='rgba(255,255,255,.75)';X.beginPath();X.arc(q[0],q[1],15+5*Math.sin(G.t*8+i),0,7);X.fill();X.strokeStyle='#3a1d55';X.lineWidth=3;X.stroke()});X.restore();
   if(o.stun>0)for(let i=0;i<3;i++){const a=G.t*4+i*2.1;paintShape('hex',cx+Math.cos(a)*60,cy-r-20+Math.sin(a)*12,10,'#ffe36b',a,false,10)}}
  if(o.st!='intro')txt(o.lit+' из 6',o.x-o.h*.6-150,600-o.h*.85,big(),'#fff3a0')}};
WX.add(()=>{
const pw=WX.wantF;WX.wantF=function(want,fx,fy){if(pw){const r=pw(want,fx,fy);if(r&&r!=want)return r}if(WX.wn()!=4)return want;const p=P;
 for(const o of ENTS){if(o.type=='shards'&&p.x>o.a-400&&p.x<o.b+40&&L.forms.includes('shield'))return 'shield';
  if(o.type=='honey'&&o.x-p.x<6*T&&o.x-p.x>-40&&L.forms.includes('hex'))return 'hex'}
 return want};
const W4=(b)=>{[...Array(Math.floor(b.w/9))].forEach(()=>0);return b};
LV['4-1']=()=>{const b=new LB(170,'4-1');b.meta={name:'4-1 Морские звёзды',intro:['w4','t_swim','l41'],forms:[],water:true,noFM:1};
 b.g(0,170).g(20,24,9).g(64,69,8).g(110,113,9);
 b.col(30,0,4,1).col(31,0,4,1).col(82,0,5,1).col(83,0,5,1).col(124,0,4,1);
 b.e('sstar',40,10).e('sstar',94,10,{spd:.25}).e('sstar',140,10,{spd:-.4,cy:420});
 b.coins(8,7,6,'coin_circ',2).coins(24,5,5,'coin_circ',0).coins(50,6,8,'coin_circ',2).coins(70,5,7,'coin_circ',1).coins(100,7,8,'coin_circ',2).coins(146,6,10,'coin_circ',2);
 b.e('enemy',28,9).e('enemy',58,7).e('enemy',76,9).e('enemy',104,6).e('enemy',120,9).e('enemy',154,7);
 b.e('star',30,6).e('star',82,7).e('star',124,6).e('goal',165,10);
 b.e('reef',0,10,{xs:[3,12,18,27,36,47,55,62,72,79,88,100,108,116,128,134,150,158]});return b};
LV['4-2']=()=>{const b=new LB(176,'4-2');b.meta={name:'4-2 Пять или шесть?',intro:['l42'],forms:[],water:true,noFM:1};
 b.g(0,176).g(46,50,8).g(118,122,8);
 b.e('odd',27,10,{n:4,kind:'pent'}).e('sstar',58,10,{spd:.3}).e('odd',88,10,{n:5,kind:'pent'}).e('sstar',132,10,{spd:-.35,cy:420});
 b.col(76,0,5,1).col(77,0,5,1).col(150,0,4,1);
 b.coins(6,7,8,'coin_circ',2).coins(36,6,8,'coin_circ',2).coins(66,7,8,'coin_circ',2).coins(100,6,10,'coin_circ',2).coins(140,7,8,'coin_circ',2);
 b.e('enemy',40,8).e('enemy',72,9).e('enemy',106,7).e('enemy',126,9).e('enemy',160,7);
 b.e('star',47,6).e('star',119,6).e('star',150,6).e('goal',171,10);
 b.e('reef',0,10,{xs:[4,14,32,44,52,70,82,98,112,126,144,156,166]});return b};
LV['4-3']=()=>{const b=new LB(180,'4-3');b.meta={name:'4-3 Звёздный Щит',intro:['l43'],forms:[],water:true,noFM:1,tk:{shield:'t_sh4'}};
 b.g(0,180).e('stone',14,10,{shape:'pent',give:'shield'});
 b.e('shards',0,0,{x0:34,x1:70}).e('shards',0,0,{x0:96,x1:140});
 b.g(80,86,8).col(90,0,4,1).g(150,154,8);
 b.coins(36,7,10,'coin_circ',2).coins(56,7,10,'coin_circ',2).coins(98,7,12,'coin_circ',2).coins(122,7,12,'coin_circ',2).coins(156,7,8,'coin_circ',2);
 b.e('enemy',26,8).e('enemy',76,9).e('enemy',88,6).e('enemy',146,8).e('enemy',164,7);
 b.e('star',52,8).e('star',83,6).e('star',118,8).e('goal',174,10);
 b.e('reef',0,10,{xs:[4,22,30,74,78,92,144,160,170]});return b};
LV['4-4']=()=>{const b=new LB(176,'4-4');b.meta={name:'4-4 Спасение Формика',intro:['l44'],forms:['shield'],water:62,noFM:1};
 b.g(0,176).e('cage',50,10);
 // медовые соты на суше
 b.g(78,92,5).col(78,5,9,19).e('honey',77,10);
 b.g(104,124,6).col(104,6,9,19).e('honey',103,10).g(116,124,3).col(116,3,5,19).e('honey',115,6);
 b.g(140,150,5).col(140,5,9,19).e('honey',139,10);
 b.coins(10,7,8,'coin_circ',2).coins(30,6,8,'coin_circ',2).coins(80,3,8,'coin_circ',1).coins(117,1,6,'coin_circ',1).coins(142,3,7,'coin_circ',1).coins(156,8,8,'coin_circ',1);
 b.e('enemy',22,8).e('enemy',40,9).e('enemy',96,10).e('enemy',130,10).e('enemy',162,10);
 b.e('star',34,6).e('star',120,1).e('star',145,3).e('goal',170,10);
 b.e('reef',0,10,{xs:[4,12,26,38,46,58]});return b};
LV['4-B']=()=>{const n=Math.max(13,Math.ceil(W/1.95/T)+1);const b=new LB(n,'4-B');b.zoom=1.95;b.gf=.8;b.meta={name:'Босс: Краб Отшельник',intro:['b4a','t_shield'],forms:['shield','hex'],startForm:'shield',boss:'crab',water:true};b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('crab',n-3,10);b.e('reef',0,10,{xs:[2,5]});return b};
});
})();
