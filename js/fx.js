'use strict';
// ===== Детализация: реквизит на краях земли, тени, блики, атмосферные частицы. Только визуал: rnd() не трогаем (детерминизм бота).
const FX=(()=>{
const hs=(a,b)=>{let h=(a*73856093^b*19349663^0x5bd1e995)>>>0;h=Math.imul(h^h>>>13,0x5bd1e995)>>>0;return (h^h>>>15)>>>0};
const AMB=[],GLOW={};function glow(c){if(GLOW[c])return GLOW[c];const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,c);g.addColorStop(.25,c);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.globalAlpha=.6;x.fillRect(0,0,64,64);return GLOW[c]=cv}
const AMB0=[];let ambW=0;
const PAL={1:{fl:['#ff7eb6','#ffd84d','#ffffff','#b48cff'],gr:'#4f9e2a',gr2:'#86cf45'},
 2:{fl:['#9db4ff','#ffffff','#ffd84d','#c58cff'],gr:'#6f9a3a',gr2:'#a8c95a'},
 3:{fl:['#ff9ccf','#ffe27a','#9fe3ff','#ffffff'],gr:'#d987b6',gr2:'#f4b8d8'},
 4:{fl:['#ff8a6b','#ffb3d1','#ffd27a','#c7a0ff'],gr:'#2f9e7a',gr2:'#5fd0a0'},
 5:{fl:['#fff3a0','#ffd1f0','#d6e4ff','#ffffff'],gr:'#ffffff',gr2:'#efe8ff'},
 6:{fl:['#ff7ad9','#b98cff','#7fe3ff','#ffd84d'],gr:'#5aa83a',gr2:'#8fd35a'}};
function tuft(x,y,c1,c2,s,sw){X.fillStyle=c1;X.beginPath();for(let i=-2;i<=2;i++){const bx=x+i*4*s,h=(14+(i&1?6:0)+(2-Math.abs(i))*5)*s,lean=i*3*s+sw;X.moveTo(bx-3*s,y+2);X.quadraticCurveTo(bx+lean*.4,y-h*.6,bx+lean,y-h);X.quadraticCurveTo(bx+lean*.3+1.5*s,y-h*.5,bx+3*s,y+2)}X.fill();
 X.fillStyle=c2;X.beginPath();for(let i=-1;i<=1;i++){const bx=x+i*5*s,h=(10+(1-Math.abs(i))*5)*s,lean=i*2*s+sw;X.moveTo(bx-1.5*s,y+1);X.quadraticCurveTo(bx+lean*.4,y-h*.6,bx+lean,y-h);X.lineTo(bx+1.5*s,y+1)}X.fill()}
function flower(x,y,c,s,sw){X.strokeStyle='#3f8a2a';X.lineWidth=2.2*s;X.beginPath();X.moveTo(x,y+2);X.quadraticCurveTo(x+sw*.5,y-10*s,x+sw,y-18*s);X.stroke();const fx=x+sw,fy=y-18*s;
 X.fillStyle=c;for(let i=0;i<5;i++){const a=i*1.2566;X.beginPath();X.ellipse(fx+Math.cos(a)*4.6*s,fy+Math.sin(a)*4.6*s,3.6*s,2.6*s,a,0,7);X.fill()}X.fillStyle='#ffcf3a';X.beginPath();X.arc(fx,fy,2.6*s,0,7);X.fill();X.fillStyle='rgba(255,255,255,.7)';X.beginPath();X.arc(fx-1*s,fy-1*s,1*s,0,7);X.fill()}
function crystal(x,y,c,s,t){X.save();X.translate(x,y);const g=lg('c'+c+s,-8*s,0,8*s,0,[[0,c],[.5,'#ffffff'],[1,c]]);
 for(const [dx,h,a] of [[-7,22,-.35],[0,32,0],[7,18,.4]]){X.save();X.translate(dx*s,0);X.rotate(a);X.fillStyle=g;X.globalAlpha=.92;X.beginPath();X.moveTo(-5*s,2);X.lineTo(-5*s,-h*.7*s);X.lineTo(0,-h*s);X.lineTo(5*s,-h*.7*s);X.lineTo(5*s,2);X.closePath();X.fill();X.globalAlpha=1;X.strokeStyle='rgba(80,30,120,.55)';X.lineWidth=1.5;X.stroke();X.restore()}
 const k=Math.max(0,Math.sin(t*2.2+x*.03));if(k>.85){X.fillStyle='rgba(255,255,255,'+((k-.85)/.15)+')';star4(0,-30*s,9*s)}X.restore()}
function star4(x,y,r){X.beginPath();X.moveTo(x,y-r);X.quadraticCurveTo(x,y,x+r,y);X.quadraticCurveTo(x,y,x,y+r);X.quadraticCurveTo(x,y,x-r,y);X.quadraticCurveTo(x,y,x,y-r);X.fill()}
function lantern(x,y,s,t){X.save();X.translate(x,y);X.strokeStyle='#4a3360';X.lineWidth=4*s;X.beginPath();X.moveTo(0,0);X.lineTo(0,-52*s);X.quadraticCurveTo(0,-62*s,12*s,-62*s);X.stroke();
 const f=.75+.25*Math.sin(t*5+x);let g=GC['L'+s];if(!g){g=GC['L'+s]=X.createRadialGradient(12*s,-50*s,1,12*s,-50*s,30*s);g.addColorStop(0,'rgba(255,230,140,.55)');g.addColorStop(1,'rgba(255,200,90,0)')}X.globalAlpha=f;X.fillStyle=g;X.beginPath();X.arc(12*s,-50*s,30*s,0,7);X.fill();X.globalAlpha=1;
 X.fillStyle='#ffe58a';X.beginPath();X.roundRect(6*s,-58*s,12*s,15*s,4*s);X.fill();X.strokeStyle='#6b4a2a';X.lineWidth=2*s;X.stroke();X.restore()}
function shell(x,y,c,s){X.fillStyle=c;X.beginPath();X.moveTo(x-8*s,y);X.quadraticCurveTo(x-9*s,y-11*s,x,y-12*s);X.quadraticCurveTo(x+9*s,y-11*s,x+8*s,y);X.closePath();X.fill();X.strokeStyle='rgba(120,60,40,.45)';X.lineWidth=1.3;for(let i=-2;i<=2;i++){X.beginPath();X.moveTo(x,y-1);X.lineTo(x+i*3.6*s,y-10*s);X.stroke()}}
function weed(x,y,s,t,c){X.strokeStyle=c;X.lineWidth=4*s;X.lineCap='round';X.beginPath();X.moveTo(x,y+2);for(let k=1;k<=5;k++){X.lineTo(x+Math.sin(t*1.6+k*.9+x*.05)*5*k*s*.6,y-k*9*s)}X.stroke();X.lineCap='butt'}
function fluff(x,y,s){X.fillStyle='rgba(255,255,255,.95)';for(const [dx,dy,r] of [[-12,-2,9],[0,-6,12],[12,-2,9]]){X.beginPath();X.arc(x+dx*s,y+dy*s,r*s,0,7);X.fill()}X.fillStyle='rgba(215,205,255,.5)';X.beginPath();X.ellipse(x,y+2*s,20*s,4*s,0,0,7);X.fill()}
const GC={};function lg(key,x0,y0,x1,y1,stops){let g=GC[key];if(!g){g=X.createLinearGradient(x0,y0,x1,y1);for(const [o,c] of stops)g.addColorStop(o,c);GC[key]=g}return g}
function isTop(tx,ty){if(tileAt(tx,ty)!=1)return false;const a=tileAt(tx,ty-1);return a==0||a==2}
function tiles(){const n=WX.wn(),pal=PAL[n]||PAL[1],t=G.t,lo=G.lowFx||0,TR=self.TERR&&TERR.ready();const x0=Math.max(0,Math.floor(CAM.x/T)-1),x1=Math.min(L.w,Math.ceil((CAM.x+WV)/T)+1);
 for(let ty=1;ty<12;ty++)for(let tx=x0;tx<x1;tx++){if(tileAt(tx,ty)!=1)continue;const x=tx*T,y=ty*T,top=isTop(tx,ty);
  // края: торцы платформ темнее, снизу висящих — мягкая тень
  const le=tileAt(tx-1,ty)==0,re=tileAt(tx+1,ty)==0,below=ty<11&&tileAt(tx,ty+1)==0;
  if(TR){if(!top||lo>=2)continue;const h=hs(tx,ty);if(h%3)continue;const sw=Math.sin(t*1.8+tx*.7)*2.5,hh=hs(tx*3,ty+11),px=x+8+(hh%44),r=(hh>>>8)%10,s=.8+((hh>>>4)%5)*.1;
   if(n==1){if(r<5)flower(px,y-1,pal.fl[(hh>>>12)%4],s,sw*.6)}else if(n==4){if(r<4)weed(px,y-2,s,t,'#2e9e6e')}else if(n==5){if(r<3){X.fillStyle='rgba(255,236,140,'+(.6+.4*Math.sin(t*3+px))+')';star4(px,y-14,6*s)}}else if(n==6){if(h%7==0)crystal(x+T/2,y-2,['#c47bff','#ff7ad9','#7fd8ff'][h%3],.9,t)}
   if((n==3||n==6)&&h%23==5)lantern(x+T/2,y-2,1,t);continue}
  if(le||re){for(const [e,d] of [[le,1],[re,-1]]){if(!e)continue;const ex=d>0?x:x+T;X.save();X.translate(ex,y);X.fillStyle=lg('e'+d,0,0,d*16,0,[[0,'rgba(40,20,30,.45)'],[1,'rgba(40,20,30,0)']]);X.fillRect(d>0?0:-16,top?8:0,16,T-(top?8:0));X.restore()}}
  if(below){X.save();X.translate(x,y+T-14);X.fillStyle=lg('b',0,0,0,14,[[0,'rgba(30,15,30,0)'],[1,'rgba(30,15,30,.4)']]);X.fillRect(0,0,T+.5,14);X.restore()}
  if(!top)continue;
  // тень от травяной кромки на земле + светлая кромка сверху
  X.save();X.translate(x,y+38);X.fillStyle=lg('l',0,0,0,18,[[0,'rgba(30,15,20,.28)'],[1,'rgba(30,15,20,0)']]);X.fillRect(0,2,T+.5,16);X.restore();
  X.fillStyle='rgba(255,255,230,.22)';X.fillRect(x,y-11,T+.5,3);
  if(le||re){for(const [e,d] of [[le,1],[re,-1]]){if(!e)continue;const ex=d>0?x:x+T;X.fillStyle=n==5?'#ffffff':(WX.grass||pal.gr);X.beginPath();X.moveTo(ex,y-11);X.quadraticCurveTo(ex-d*12,y+4,ex-d*2,y+24);X.quadraticCurveTo(ex+d*6,y+10,ex+d*10,y-11);X.fill()}}
  if(lo>=2)continue;
  const h=hs(tx,ty),sw=Math.sin(t*1.8+tx*.7)*2.5;
  for(let k=0;k<2;k++){const hh=hs(tx*3+k,ty+11),px=x+8+(hh%44),r=(hh>>>8)%10,s=.8+((hh>>>4)%5)*.1;
   if(n==4){if(r<4)weed(px,y-4,s,t,k?'#3fbf8f':'#2e9e6e');else if(r<6)shell(px,y-2,pal.fl[(hh>>>12)%4],s);continue}
   if(n==5){if(r<5)fluff(px,y-4,s);else if(r<7){X.fillStyle='rgba(255,236,140,'+(.6+.4*Math.sin(t*3+px))+')';star4(px,y-14,6*s)}continue}
   if(r<4)tuft(px,y-3,pal.gr,pal.gr2,s,sw);else if(r<7)flower(px,y-3,pal.fl[(hh>>>12)%4],s,sw*.6);
  }
  if(n==6&&h%7==0)crystal(x+T/2,y-2,['#c47bff','#ff7ad9','#7fd8ff'][h%3],.9,t);
  if((n==3||n==6)&&h%23==5)lantern(x+T/2,y-2,1,t);
  if(n==2&&h%9==2){X.fillStyle='#9a8f86';X.beginPath();X.ellipse(x+30,y-4,10,6,0,Math.PI,0);X.fill();X.fillStyle='rgba(255,255,255,.35)';X.beginPath();X.ellipse(x+27,y-7,4,2,0,0,7);X.fill()}
 }}
function shadows(){for(const e of ENTS){if(e.dead||e.x<CAM.x-200||e.x>CAM.x+WV+200)continue;
 if(e.type=='enemy'){const gy=e.gy??e.y,up=Math.max(0,gy-e.y);const a=Math.max(.06,.24-up*.002),w=Math.max(16,40-up*.08);X.fillStyle='rgba(20,10,30,'+a+')';X.beginPath();X.ellipse(e.x,gy+3,w,8,0,0,7);X.fill()}
 else if(e.type=='coin'||e.type=='star'){}}}
function glints(){const t=G.t;for(const e of ENTS){if(e.got||e.dead||e.x<CAM.x-100||e.x>CAM.x+WV+100)continue;
 if(e.type=='coin'||e.type=='star'){const ph=(t*.9+e.x*.013)%2.2;if(ph<.5){const k=Math.sin(ph/.5*Math.PI);X.save();X.globalAlpha=k;X.fillStyle='#ffffff';star4(e.x+(e.type=='star'?18:12),e.y-(e.type=='star'?22:14),9+k*7);X.restore()}}}}
const KIND={1:{c:['#fff7c0','#ffd1e8','#ffffff'],n:22,vy:-8,vx:14,sz:[2,4],tw:1},2:{c:['#ffffff','#fff3d0'],n:20,vy:6,vx:60,sz:[2,3.5],seed:1},3:{c:['#ffb3d9','#b3e6ff','#fff0a0','#c9b3ff'],n:20,vy:16,vx:10,sz:[3,5],pet:1},
 4:{c:['rgba(220,250,255,.8)'],n:18,vy:-26,vx:4,sz:[2,5],bub:1},5:{c:['#ffffff','#fff3a0','#ffd6f5'],n:26,vy:-6,vx:8,sz:[1.5,3.5],tw:1},6:{c:['#fff3a0','#d9b3ff','#9ff0ff'],n:26,vy:-10,vx:8,sz:[2,4],tw:1}};
function front(dt){const n=WX.wn(),K=KIND[n]||KIND[1],lo=G.lowFx||0;const N=lo>=2?0:lo?Math.round(K.n/2):K.n;if(ambW!=n){AMB.length=0;ambW=n}
 while(AMB.length<N)AMB.push({x:Math.random()*W,y:Math.random()*H,p:Math.random()*7,z:.4+Math.random()*.9,c:K.c[AMB.length%K.c.length],s:K.sz[0]+Math.random()*(K.sz[1]-K.sz[0])});AMB.length=Math.min(AMB.length,N);
 const t=G.t;X.save();for(const a of AMB){a.x+=(K.vx*a.z+Math.sin(t*.8+a.p)*12)*dt;a.y+=(K.vy*a.z+Math.cos(t*.7+a.p)*6)*dt;if(a.x>W+20)a.x=-20;if(a.x<-20)a.x=W+20;if(a.y<-20)a.y=H+20;if(a.y>H+20)a.y=-20;
  const px=a.x-(CAM.x*.15*a.z)%(W+40),x=((px%(W+40))+W+40)%(W+40)-20;
  if(K.tw){const k=.35+.65*Math.max(0,Math.sin(t*2.5+a.p*3));X.globalAlpha=k;const r=a.s*a.z*4;X.drawImage(glow(a.c),x-r,a.y-r,r*2,r*2);X.fillStyle=a.c;X.beginPath();X.arc(x,a.y,a.s*a.z,0,7);X.fill();if(k>.95&&a.s>3)star4(x,a.y,a.s*3)}
  else if(K.bub){X.globalAlpha=.6;X.strokeStyle=a.c;X.lineWidth=1.5;X.beginPath();X.arc(x,a.y,a.s*a.z+1,0,7);X.stroke();X.fillStyle='rgba(255,255,255,.7)';X.beginPath();X.arc(x-a.s*.3,a.y-a.s*.3,a.s*.3,0,7);X.fill()}
  else if(K.pet){X.globalAlpha=.8;X.fillStyle=a.c;X.save();X.translate(x,a.y);X.rotate(t*1.5+a.p);X.beginPath();X.ellipse(0,0,a.s*a.z*1.4,a.s*a.z*.7,0,0,7);X.fill();X.restore()}
  else{X.globalAlpha=.75;X.fillStyle=a.c;X.beginPath();X.arc(x,a.y,a.s*a.z,0,7);X.fill();X.strokeStyle=a.c;X.lineWidth=1;X.globalAlpha=.4;for(let i=0;i<5;i++){const an=i*1.256+t;X.beginPath();X.moveTo(x,a.y);X.lineTo(x+Math.cos(an)*a.s*2.2,a.y+Math.sin(an)*a.s*2.2);X.stroke()}}}
 X.restore()}
// дальний слой параллакса между картиной и холмами: мягкая дымка + силуэты
function back(){const n=WX.wn(),dy=(CAM.y-600+HV*L.gf);X.save();
 const col={1:'rgba(150,200,120,.35)',2:'rgba(150,160,200,.32)',3:'rgba(230,180,210,.3)',4:'rgba(40,110,160,.3)',5:'rgba(255,255,255,.4)',6:'rgba(140,90,180,.32)'}[n]||'rgba(150,200,120,.35)';
 X.fillStyle=col;X.beginPath();X.moveTo(0,H);for(let x=0;x<=W+30;x+=30){const wx=x+CAM.x*.25;const b=n==5?Math.abs(Math.sin(wx*.006))*50+Math.sin(wx*.017)*14:Math.sin(wx*.0031)*55+Math.sin(wx*.009+2)*22;X.lineTo(x,H*.64-dy*.18-b)}X.lineTo(W,H);X.fill();
 const g=X.createLinearGradient(0,H*.45,0,H*.75);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,n==4?'rgba(160,220,255,.12)':n==6?'rgba(200,160,255,.12)':'rgba(255,250,235,.14)');X.fillStyle=g;X.fillRect(0,H*.45,W,H*.3);X.restore()}
// ===== v14: свет и глубина (экранные координаты): лучи, тонировка мира, виньетка, размытые силуэты переднего плана
const LT={1:{ray:'255,236,170',ra:.11,sx:.78,grade:'rgba(255,214,150,.16)'},2:{ray:'225,240,255',ra:.10,sx:.7,grade:'rgba(170,200,255,.14)'},3:{ray:'255,225,180',ra:.10,sx:.8,grade:'rgba(255,190,170,.13)'},
 4:{ray:'200,250,255',ra:.13,sx:.4,grade:'rgba(80,190,230,.14)'},5:{ray:'255,246,210',ra:.12,sx:.55,grade:'rgba(255,230,190,.14)'},6:{ray:'255,200,240',ra:.09,sx:.6,grade:'rgba(170,110,230,.16)'}};
const FG={},RL={},VG={},GB={};
// v14: цветокор мира «запекается» в фон один раз: soft-light тон + воздушная дымка у горизонта + тёплый/холодный верх
function gbg(n,im){if(GB[n])return GB[n];if(Q.get('grade')=='0')return 0;const c=LT[n]||LT[1],o=document.createElement('canvas');o.nm='bg_w'+n;o.width=im.width;o.height=im.height;const g=o.getContext('2d');g.drawImage(im,0,0);
 g.globalCompositeOperation='soft-light';g.fillStyle=c.grade.replace(/[\d.]+\)$/,m=>(parseFloat(m)*2.2)+')');g.fillRect(0,0,o.width,o.height);g.globalCompositeOperation='source-over';
 const hz=g.createLinearGradient(0,0,0,o.height);hz.addColorStop(0,'rgba('+c.ray+',.10)');hz.addColorStop(.55,'rgba('+c.ray+',.0)');hz.addColorStop(.8,'rgba('+c.ray+',.14)');hz.addColorStop(1,'rgba('+c.ray+',.04)');g.fillStyle=hz;g.fillRect(0,0,o.width,o.height);return GB[n]=o}
function fgArt(n,v){const key=n*10+v;if(FG[key])return FG[key];const w=420,h=300,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 const col={1:'#1d3a1a',2:'#2a3550',3:'#4a2d3a',4:'#123a4a',5:'#8d86a8',6:'#2a1640'}[n]||'#1d3a1a';g.fillStyle=col;g.strokeStyle=col;let hs=key*9973+7;const r=()=>((hs=Math.imul(hs^hs>>>13,1274126177)>>>0)%10000)/10000;
 if(n==1||n==3){for(let i=0;i<26;i++){const x=40+r()*340,hh=90+r()*190,b=(r()-.5)*60;g.lineWidth=7+r()*8;g.lineCap='round';g.beginPath();g.moveTo(x,h);g.quadraticCurveTo(x+b*.3,h-hh*.6,x+b,h-hh);g.stroke()}
  for(let i=0;i<4;i++){const x=80+r()*260,y=h-130-r()*110;g.beginPath();g.arc(x,y,14+r()*8,0,7);g.fill()}}
 else if(n==2){for(let i=0;i<3;i++){const x=60+i*120+r()*40,hh=140+r()*120;g.beginPath();g.moveTo(x-70,h);g.lineTo(x,h-hh);g.lineTo(x+70,h);g.fill()}g.beginPath();g.ellipse(210,h,200,70,0,0,7);g.fill()}
 else if(n==4){for(let i=0;i<5;i++){const x=50+r()*320;g.lineWidth=12;g.lineCap='round';const br=(x0,y0,a,l,d)=>{if(d>3)return;const x1=x0+Math.cos(a)*l,y1=y0+Math.sin(a)*l;g.lineWidth=12-d*2.5;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();br(x1,y1,a-.45,l*.72,d+1);br(x1,y1,a+.4,l*.7,d+1)};br(x,h,-Math.PI/2+(r()-.5)*.5,70+r()*40,0)}}
 else if(n==5){for(let i=0;i<9;i++){g.beginPath();g.arc(30+r()*360,h-20-r()*90,40+r()*45,0,7);g.fill()}}
 else{for(let i=0;i<7;i++){const x=40+r()*340,hh=110+r()*170,ww=22+r()*26,a=(r()-.5)*.5;g.save();g.translate(x,h);g.rotate(a);g.beginPath();g.moveTo(-ww,0);g.lineTo(-ww*.8,-hh*.8);g.lineTo(0,-hh);g.lineTo(ww*.8,-hh*.8);g.lineTo(ww,0);g.fill();g.restore()}}
 const o=document.createElement('canvas');o.width=w;o.height=h;o.nm='fg_w'+n;const q=o.getContext('2d');q.filter='blur(7px)';q.drawImage(c,0,0);FG[key]=o;return o}
function light(){const n=WX.wn(),c=LT[n]||LT[1],lo=G.lowFx||0,t=G.t,M=+(Q.get('lt')??11);X.save();
 // 1) лучи света сверху: аддитивные узкие клинья (растеризуются только сами лучи)
 if(lo<2&&M&1){X.globalCompositeOperation='lighter';const sx=W*c.sx-((CAM.x*.04)%200),sy=-H*.2,nr=lo?2:4;
  for(let i=0;i<nr;i++){const a=1.98+i*.2+Math.sin(t*.13+i*1.7)*.03,len=H*1.25,wd=.035+.02*((i*7)%3),al=c.ra*(.55+.45*Math.sin(t*.4+i*2.1));
   const ex=sx+Math.cos(a)*len,ey=sy+Math.sin(a)*len,g=X.createLinearGradient(sx,sy,ex,ey);g.addColorStop(0,'rgba('+c.ray+','+al+')');g.addColorStop(.7,'rgba('+c.ray+','+(al*.3)+')');g.addColorStop(1,'rgba('+c.ray+',0)');
   X.fillStyle=g;X.beginPath();X.moveTo(sx,sy);X.lineTo(sx+Math.cos(a-wd)*len,sy+Math.sin(a-wd)*len);X.lineTo(sx+Math.cos(a+wd)*len,sy+Math.sin(a+wd)*len);X.fill()}
  X.globalCompositeOperation='source-over'}
 // 2) размытые силуэты переднего плана (параллакс быстрее камеры, только у нижнего края)
 if(!lo&&M&2){const S=1150,px=CAM.x*Z*1.35,i0=Math.floor(px/S)-1;for(let i=i0;i<i0+3+Math.ceil(W/S);i++){const hh=(Math.imul(i*2654435761^n*97,1)>>>0);if(hh%10>5)continue;const im=fgArt(n,hh%3),sc=(.42+((hh>>>5)%5)*.05)*H/720,x=i*S-px+(hh>>>9)%400;
   if(x>W+50||x+im.width*sc<-50)continue;X.globalAlpha=n==5?.6:.8;X.drawImage(im,x,H-im.height*sc+34,im.width*sc,im.height*sc)}X.globalAlpha=1}
 // 3) тонировка мира
 if(!lo&&M&4){X.fillStyle=c.grade;X.globalCompositeOperation='soft-light';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over'}
 // 4) виньетка: только полосы у краёв (без полноэкранного смешивания)
 if(M&8&&!lo){const vw=W*.13,vc='25,10,45';let g=X.createLinearGradient(0,0,vw,0);g.addColorStop(0,'rgba('+vc+',.30)');g.addColorStop(1,'rgba('+vc+',0)');X.fillStyle=g;X.fillRect(0,0,vw,H);
  g=X.createLinearGradient(W,0,W-vw,0);g.addColorStop(0,'rgba('+vc+',.30)');g.addColorStop(1,'rgba('+vc+',0)');X.fillStyle=g;X.fillRect(W-vw,0,vw,H);
  g=X.createLinearGradient(0,0,0,H*.14);g.addColorStop(0,'rgba('+vc+',.22)');g.addColorStop(1,'rgba('+vc+',0)');X.fillStyle=g;X.fillRect(0,0,W,H*.14)}
 X.restore()}
const off=()=>Q.get('fx')=='0';const W_=f=>(...a)=>off()?0:f(...a);
return {gbg:W_(gbg),light:W_(light),tiles:W_(tiles),shadows:W_(shadows),glints:W_(glints),front:W_(front),back:W_(back)}})();
