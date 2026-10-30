// Мир 5: Небесный храм симметрии
(function(){
const near=(x,d=650)=>x-P.x<d&&P.x-x<240;
const big=()=>Math.max(52,58/Z);
const COLS=['#ff8a8a','#ffcc33','#7ff0a2','#7fd3ff','#c58cff','#ffa726'];
const wall=(gx,v)=>{for(let y=0;y<=9;y++)setT(gx,y,v)};
function glass(x,y,w,h,lit,a=1){X.save();X.globalAlpha*=a;const g=X.createLinearGradient(x,y,x,y+h);g.addColorStop(0,lit?'rgba(255,243,170,.9)':'rgba(236,226,255,.9)');g.addColorStop(1,lit?'rgba(255,170,60,.7)':'rgba(140,110,215,.78)');X.fillStyle=g;X.shadowColor=lit?'#ffd35a':'#e8dcff';X.shadowBlur=lit?22:10;X.beginPath();X.roundRect(x+2,y+2,w-4,h-6,10);X.fill();X.shadowBlur=0;X.strokeStyle=lit?'#e89400':'#7b5cc8';X.lineWidth=4;X.stroke();X.fillStyle='rgba(255,255,255,.7)';X.fillRect(x+12,y+9,w*.3,5);X.restore()}
function puff(x,y,r,a=.85){X.save();X.globalAlpha*=a;X.fillStyle='#fff';for(const [dx,dy,k] of [[-1,0,.7],[0,-.35,1],[1,0,.75],[-.45,.2,.8],[.5,.25,.8]]){X.beginPath();X.arc(x+dx*r,y+dy*r,r*k,0,7);X.fill()}X.restore()}
// ---- декор: колонны храма
EX.temple={setup(o){o.nc=1},draw(o){for(const x0 of o.xs){const x=x0*T+30;if(x<CAM.x-120||x>CAM.x+WV+120)continue;const top=600-(o.h||250);X.save();
 const g=X.createLinearGradient(x-26,0,x+26,0);g.addColorStop(0,'#d9d0f2');g.addColorStop(.45,'#ffffff');g.addColorStop(1,'#c7bce6');X.fillStyle=g;X.fillRect(x-22,top+20,44,600-top-20);
 X.strokeStyle='rgba(150,130,200,.45)';X.lineWidth=3;for(const dx of [-10,0,10]){X.beginPath();X.moveTo(x+dx,top+26);X.lineTo(x+dx,594);X.stroke()}
 X.fillStyle='#f4f0ff';X.beginPath();X.roundRect(x-36,top,72,22,8);X.fill();X.fillStyle='#e6def8';X.beginPath();X.roundRect(x-32,588,64,14,6);X.fill();
 X.fillStyle='#c58cff';X.beginPath();X.arc(x,top+11,6,0,7);X.fill();X.restore()}}};
// ---- зеркальный мост: ступенька слева -> такая же справа
EX.mirror={setup(o){o.nc=1;o.ax=o.A*T;o.lit=0;o.mask=0;o.grow=o.steps.map(()=>0);o.x0=o.x;
 for(let x=o.A;x<o.A+o.gap;x++)for(let y=0;y<12;y++)setT(x,y,0);
 o.steps.forEach(([i,row,len])=>{for(let k=0;k<len;k++)setT(o.A-i-len+k,row,1)})},
 lx(o,s){return (o.A-s[0]-s[2])*T},rx(o,s){return (o.A+s[0])*T},
 upd(o,dt){const p=P;o.x=clamp(CAM.x+WV/2,o.ax-900,o.ax+o.gap*T);o.grow=o.grow.map((g,k)=>o.mask&(1<<k)?Math.min(1,g+dt*2.5):0);
  if(o.say&&!o.said&&near(o.ax-600,700)){o.said=1;say('t_mir')}
  if(!p.ground)return;const row=Math.round(p.y/T);
  o.steps.forEach((s,k)=>{if(o.mask&(1<<k)||s[1]!=row)return;const a=EX.mirror.lx(o,s),b=a+s[2]*T;if(p.x<a-8||p.x>b+8)return;
   o.mask|=1<<k;o.lit++;for(let j=0;j<s[2];j++)setT(o.A+s[0]+j,s[1],1);SFX.light(o.lit);const rx=EX.mirror.rx(o,s);part(a+s[2]*T/2,row*T,14,'#fff3a0',260,.6,0);part(rx+s[2]*T/2,row*T,20,'#e8dcff',320,.8,0);
   if(o.lit==o.steps.length){SFX.win&&tone(1319,.3,'triangle',.12);hush();say('r_pat')}})},
 hint(o){if(o.lit==o.steps.length||P.x<o.ax-1100||P.x>o.ax+o.gap*T)return;const k=o.steps.findIndex((s,k)=>!(o.mask&(1<<k)));const s=o.steps[k];HAND={x:EX.mirror.lx(o,s)+s[2]*T/2,y:s[1]*T-30,t:0,k:'tap'};say('t_mir');return true},
 draw(o){X.save();const ax=o.ax,y0=CAM.y-20;
  // облака в пропасти
  for(let x=ax+20;x<ax+o.gap*T;x+=90)puff(x+((x*7)%30),668+((x*13)%20),46,.9);
  // зеркало
  const g=X.createLinearGradient(ax-12,0,ax+12,0);g.addColorStop(0,'rgba(200,180,255,0)');g.addColorStop(.5,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(200,180,255,0)');X.fillStyle=g;X.fillRect(ax-12,y0,24,640-y0);
  X.fillStyle='#fff';for(let i=0;i<5;i++){const yy=600-((G.t*90+i*130)%(600-y0));X.globalAlpha=.8;X.beginPath();X.moveTo(ax,yy-10);X.lineTo(ax+6,yy);X.lineTo(ax,yy+10);X.lineTo(ax-6,yy);X.fill()}X.globalAlpha=1;
  o.steps.forEach((s,k)=>{const lit=o.mask&(1<<k),y=s[1]*T,w=s[2]*T,lx=EX.mirror.lx(o,s),rx=EX.mirror.rx(o,s);
   glass(lx,y,w,T,lit,lit?1:.75+.25*Math.sin(G.t*5+k));
   if(!lit){X.save();X.globalAlpha=.4+.15*Math.sin(G.t*4+k);X.setLineDash([12,10]);X.strokeStyle='#fff';X.lineWidth=4;X.beginPath();X.roundRect(rx+4,y+4,w-8,T-10,10);X.stroke();X.restore()}
   else{const gr=o.grow[k];X.save();X.translate(ax,0);X.scale(gr,1);X.translate(-ax,0);glass(rx,y,w,T,1);X.restore()}});
  if(o.lit<o.steps.length&&P.x>o.ax-1100&&P.x<o.ax+60){const cx=ax;txt(o.lit+' из '+o.steps.length,cx,Math.max(y0+60,o.steps.reduce((m,s)=>Math.min(m,s[1]*T),600)-80),big(),'#fff3a0');panelHide(cx-80,y0+20,160)}
  X.restore()}};
// путь бота через зеркальный мост
function mpath(A,steps,land){const P2=[];steps.forEach(s=>P2.push([A-s[0]-s[2]/2,s[1]]));P2.sort((a,b)=>a[0]-b[0]);const R=steps.map(s=>[A+s[0]+s[2]/2,s[1]]).sort((a,b)=>a[0]-b[0]);return P2.concat(R,[land])}
// ---- зеркальный узор: дорисуй правую половину
EX.pattern={top(o){return o.done?null:o.y0-100},setup(o){o.gx=Math.floor(o.x/T)+3;wall(o.gx,15);o.cx=o.gx*T+30;o.cs=62;o.mid=26;o.y0=440-o.rows*o.cs-20;o.got=0;o.mask=0;o.done=0;o.bad=null},
 cell(o,side,r,c){const x=side<0?o.cx-o.mid/2-o.cols*o.cs+(c+.5)*o.cs:o.cx+o.mid/2+(c+.5)*o.cs;return [x,o.y0+(r+.5)*o.cs]},
 tgt(o){return o.cells.map(([r,c,k])=>[r,o.cols-1-c,k])},
 upd(o,dt){if(o.bad){o.bad.t-=dt;if(o.bad.t<=0)o.bad=null}if(!o.said&&near(o.cx,700)){o.said=1;say('t_pat')}},
 tap(o,wx,wy){if(o.done||Math.abs(o.cx-P.x)>WV)return false;let best=null,bd=o.cs*.62;for(let r=0;r<o.rows;r++)for(let c=0;c<o.cols;c++){const q=EX.pattern.cell(o,1,r,c);const d=Math.hypot(wx-q[0],wy-q[1]);if(d<bd){bd=d;best=[r,c,q]}}
  if(!best)return false;const tg=EX.pattern.tgt(o);const i=tg.findIndex(t=>t[0]==best[0]&&t[1]==best[1]);
  if(i<0){SFX.no();hush();say('r_mir_no');o.bad={r:best[0],c:best[1],t:.7};return true}
  if(o.mask&(1<<i))return true;
  throwBoom(best[2][0],best[2][1],()=>{if(o.mask&(1<<i)||o.done)return;o.mask|=1<<i;o.got++;SFX.light(o.got);say('n'+o.got);part(best[2][0],best[2][1],16,COLS[tg[i][2]],300,.6,0);
   if(o.got==tg.length){o.done=1;wall(o.gx,0);SFX.win();shake(6);hush();say('r_pat');part(o.cx,o.y0+o.rows*o.cs/2,40,'#fff3a0',500,1,0,10)}});return true},
 next(o){const tg=EX.pattern.tgt(o);const i=tg.findIndex((t,i)=>!(o.mask&(1<<i)));return i<0?null:EX.pattern.cell(o,1,tg[i][0],tg[i][1])},
 hint(o){if(o.done||!near(o.cx,700))return;const q=EX.pattern.next(o);HAND={x:q[0],y:q[1],t:0,k:'tap'};say('t_pat');return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>560||d<-60)return;WX.go(o.cx-380,30);G.bt=(G.bt||0)+dt;if(G.bt>.7&&!BOOM.length){G.bt=0;if(!G.botMis&&Math.random()<.5){G.botMis=1;const q=EX.pattern.cell(o,1,o.cells[0][0],o.cells[0][1]);const tg=EX.pattern.tgt(o);if(!tg.some(t=>t[0]==o.cells[0][0]&&t[1]==o.cells[0][1])){WX.bt(q[0],q[1]);return true}}const q=EX.pattern.next(o);if(q)WX.bt(q[0],q[1])}BOT.j=0;return true},
 draw(o){if(o.done&&o.fade>1)return;const {cx,cs,mid,rows,cols,y0}=o;const pw=cols*cs*2+mid+30,ph=rows*cs+30;X.save();
  if(o.done){o.fade=(o.fade||0)+1/60;X.globalAlpha=Math.max(0,1-o.fade)}
  // стеклянная дверь
  const dg=X.createLinearGradient(cx-34,0,cx+34,0);dg.addColorStop(0,'rgba(200,180,255,.6)');dg.addColorStop(.5,'rgba(255,255,255,.9)');dg.addColorStop(1,'rgba(200,180,255,.6)');X.fillStyle=dg;X.beginPath();X.roundRect(cx-34,y0+ph-16,68,600-(y0+ph-16),12);X.fill();X.strokeStyle='#b49cf0';X.lineWidth=4;X.stroke();
  X.fillStyle='rgba(60,40,110,.82)';X.strokeStyle='#f4f0ff';X.lineWidth=8;X.beginPath();X.roundRect(cx-pw/2,y0-15,pw,ph,22);X.fill();X.stroke();
  X.fillStyle='rgba(255,255,255,.85)';X.fillRect(cx-3,y0-10,6,ph-10);
  const tg=EX.pattern.tgt(o);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
   const l=o.cells.find(q=>q[0]==r&&q[1]==c),[lx,ly]=EX.pattern.cell(o,-1,r,c);X.fillStyle=l?COLS[l[2]]:'rgba(255,255,255,.18)';X.beginPath();X.roundRect(lx-cs/2+4,ly-cs/2+4,cs-8,cs-8,10);X.fill();if(l){X.strokeStyle='#fff';X.lineWidth=3;X.stroke()}
   const i=tg.findIndex(t=>t[0]==r&&t[1]==c),on=i>=0&&(o.mask&(1<<i)),[rx,ry]=EX.pattern.cell(o,1,r,c);let sx=0;if(o.bad&&o.bad.r==r&&o.bad.c==c)sx=Math.sin(G.t*50)*6;
   X.fillStyle=on?COLS[tg[i][2]]:o.bad&&o.bad.r==r&&o.bad.c==c?'rgba(255,120,120,.5)':'rgba(255,255,255,.18)';X.beginPath();X.roundRect(rx-cs/2+4+sx,ry-cs/2+4,cs-8,cs-8,10);X.fill();X.strokeStyle=on?'#fff':'rgba(255,255,255,.5)';X.lineWidth=3;X.stroke()}
  if(!o.done){txt(o.got+' из '+tg.length,cx,y0-62,big(),'#fff3a0');panelHide(cx-pw/2,y0-100,pw)}
  X.restore()}};
// ---- собери отражение: какая половинка как в зеркале
const HALF={
 bfly:[[0,-.6],[-.45,-1],[-.95,-.75],[-.85,-.1],[-.35,0],[-.8,.4],[-.6,.9],[-.15,.65],[0,.3]],
 tree:[[0,-1],[-.45,-.35],[-.22,-.35],[-.7,.3],[-.4,.3],[-1,.82],[-.16,.82],[-.16,1],[0,1]],
 heart:[[0,-.45],[-.22,-.85],[-.65,-.9],[-.98,-.5],[-.85,.08],[0,1]],
 house:[[0,-1],[-1,-.15],[-.75,-.15],[-.75,1],[-.3,1],[-.3,.35],[0,.35]]};
const HCOL={bfly:'#ff8ad8',tree:'#5fd08a',heart:'#ff6b8a',house:'#ffb35a'};
function halfPath(pts,cx,cy,S,fx,dx=0){X.beginPath();pts.forEach(([x,y],i)=>{const px=cx+(x*fx+dx)*S,py=cy+y*S;i?X.lineTo(px,py):X.moveTo(px,py)});X.closePath()}
EX.refl={top(o){return o.done?null:o.cy-o.S-110},setup(o){o.gx=Math.floor(o.x/T)+3;wall(o.gx,15);o.cx=o.gx*T+30;o.cy=330;o.S=88;o.done=0;o.ft=0;
  const ks=Object.keys(HALF).filter(k=>k!=o.shape);const other=ks[(o.x/T|0)%ks.length];
  const opts=[{k:'ok'},{k:'same'},{k:'other',sh:other}];const rot=(o.x/T|0)%3;o.opts=opts.slice(rot).concat(opts.slice(0,rot));
  o.opts.forEach((q,i)=>{q.x=o.cx-250-(2-i)*150;q.y=o.cy;q.w=0})},
 upd(o,dt){o.opts.forEach(q=>q.w=Math.max(0,q.w-dt));if(o.done)o.ft+=dt;if(!o.said&&near(o.cx,760)){o.said=1;say('t_refl')}},
 tap(o,wx,wy){if(o.done||Math.abs(o.cx-P.x)>WV)return false;const q=o.opts.find(q=>Math.abs(wx-q.x)<70&&Math.abs(wy-q.y)<95);if(!q)return false;
  if(q.k!='ok'){SFX.no();hush();say('r_mir_no');q.w=.7;return true}
  throwBoom(q.x,q.y,()=>{if(o.done)return;o.done=1;o.ft=0;wall(o.gx,0);SFX.win();shake(6);hush();say('r_pat');part(o.cx,o.cy,40,'#fff3a0',500,1,0,10)});return true},
 hint(o){if(o.done||!near(o.cx,760))return;const q=o.opts.find(q=>q.k=='ok');HAND={x:q.x,y:q.y,t:0,k:'tap'};say('t_refl');return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>620||d<-60)return;WX.go(o.cx-560,30);G.bt=(G.bt||0)+dt;if(G.bt>.9&&!BOOM.length){G.bt=0;const q=G.botR!=o.x?o.opts.find(q=>q.k=='same'):o.opts.find(q=>q.k=='ok');G.botR=o.x;WX.bt(q.x,q.y)}BOT.j=0;return true},
 draw(o){const {cx,cy,S}=o;X.save();const half=HALF[o.shape],col=HCOL[o.shape];
  if(o.done&&o.ft>1.6)X.globalAlpha=Math.max(0,1-(o.ft-1.6));
  if(X.globalAlpha<=0){X.restore();return}
  // рама
  if(!o.done||o.ft<1.6){const dg=X.createLinearGradient(cx-34,0,cx+34,0);dg.addColorStop(0,'rgba(200,180,255,.6)');dg.addColorStop(.5,'rgba(255,255,255,.9)');dg.addColorStop(1,'rgba(200,180,255,.6)');X.fillStyle=dg;X.beginPath();X.roundRect(cx-34,cy+S+10,68,600-cy-S-10,12);X.fill()}
  X.fillStyle='rgba(60,40,110,.82)';X.strokeStyle='#f4f0ff';X.lineWidth=8;X.beginPath();X.roundRect(cx-S*1.25,cy-S*1.2,S*2.5,S*2.4,22);X.fill();X.stroke();
  X.fillStyle=col;X.strokeStyle='#fff';X.lineWidth=4;halfPath(half,cx,cy,S,1);X.fill();X.stroke();
  if(o.done){const k=Math.min(1,o.ft/.6);X.save();X.globalAlpha*=k;X.fillStyle=col;halfPath(half,cx,cy,S,-1);X.fill();X.stroke();X.restore()}
  else{X.save();X.setLineDash([10,9]);X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=4;halfPath(half,cx,cy,S,-1);X.stroke();X.restore()}
  X.fillStyle='rgba(255,255,255,.85)';X.fillRect(cx-3,cy-S*1.1,6,S*2.2);
  if(!o.done){for(const q of o.opts){const sx=q.w>0?Math.sin(G.t*50)*8:0;X.save();X.translate(q.x+sx,q.y);X.fillStyle='rgba(255,255,255,.88)';X.strokeStyle=q.w>0?'#ff6b6b':'#b49cf0';X.lineWidth=5;X.shadowColor='#e8dcff';X.shadowBlur=12;X.beginPath();X.roundRect(-62,-84,124,168,18);X.fill();X.stroke();X.shadowBlur=0;
    const s=60;X.fillStyle=q.k=='other'?HCOL[q.sh]:col;X.strokeStyle='#3a1d55';X.lineWidth=3;if(q.k=='ok')halfPath(half,-s*.5,0,s,-1);else if(q.k=='same')halfPath(half,-s*.5,0,s,1,1);else halfPath(HALF[q.sh],-s*.5,0,s,-1);X.fill();X.stroke();X.restore()}
   txt('Найди отражение!',o.cx-400,cy-S*1.2-40,Math.max(40,46/Z),'#fff3a0');panelHide(o.cx-760,cy-S*1.2-80,820)}
  X.restore()}};
// ---- облако-овал: отскакиваем
EX.cloud={setup(o){o.w=o.w||2.4;o.sq=0;o.yy=o.y},
 upd(o,dt){const p=P;o.sq=Math.max(0,o.sq-dt*3);const top=o.yy-14+Math.sin(G.t*1.5+o.x)*4,hw=o.w*T/2;
  if(p.vy>0&&Math.abs(p.x-o.x)<hw&&p.y>=top-4&&p.y<=top+Math.max(26,p.vy/60+8)){const F=FORMS[p.form],h=o.hup||300;p.y=top;p.vy=-Math.sqrt(2*Math.max(F.g,900)*h);p.spring=.8;p.ground=false;o.sq=1;tone(520,.25,'sine',.12,1040);part(p.x,top,10,'#ffffff',220,.5,200,8);if(!G.cloudSaid){G.cloudSaid=1;say('t_cloud')}}},
 draw(o){const y=o.yy+Math.sin(G.t*1.5+o.x)*4,s=1+o.sq*.15;X.save();X.translate(o.x,y);X.scale(s,1/s);X.shadowColor='#e8dcff';X.shadowBlur=18;X.fillStyle='#ffffff';X.beginPath();X.ellipse(0,0,o.w*T/2,34,0,0,7);X.fill();X.shadowBlur=0;
  X.fillStyle='#f1eaff';X.beginPath();X.ellipse(0,10,o.w*T/2-12,20,0,0,7);X.fill();X.strokeStyle='#c58cff';X.lineWidth=4;X.beginPath();X.ellipse(0,0,o.w*T/2,34,0,0,7);X.stroke();
  X.fillStyle='#8a6acf';X.beginPath();X.arc(-14,-2,4,0,7);X.arc(14,-2,4,0,7);X.fill();X.strokeStyle='#8a6acf';X.lineWidth=3;X.beginPath();X.arc(0,4,8,.3,Math.PI-.3);X.stroke();X.restore()}};
// ---- восходящий ветер
EX.updraft={setup(o){o.a=o.x0*T;o.b=o.x1*T;o.nc=1},
 upd(o,dt){const p=P;if(p.x>o.a&&p.x<o.b&&p.y>(o.top||120)){if(p.form=='bubble')p.vy-=1500*dt;else if(!p.ground)p.vy-=500*dt;if(!o.said){o.said=1;say('t_up5')}}},
 draw(o){X.save();X.strokeStyle='rgba(255,255,255,.75)';X.lineWidth=5;X.lineCap='round';for(let i=0;i<9;i++){const x=o.a+20+((i*53)%(o.b-o.a-40)),y=600-((G.t*240+i*83)%(600-(o.top||120)));X.globalAlpha=.6;X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+12,y-20,x,y-44);X.stroke()}
  X.globalAlpha=.18;X.fillStyle='#ffffff';X.fillRect(o.a,o.top||120,o.b-o.a,600-(o.top||120));X.restore()}};
// ---- бот: пузырь летит через небо (5-3)
EX.skybot={bot(o,dt){const p=P;if(p.form!='bubble'||!L.forms.includes('bubble'))return;const fx=Math.floor(p.x/T);let top=600,gap=0;
  for(let k=0;k<7;k++){let found=0;for(let y=0;y<12;y++){const v=tileAt(fx+k,y);if(v&&v!=8&&v!=15&&v!=2){if(k<6)top=Math.min(top,y*T);found=1;break}}if(!found&&k<5)gap=1}
  let want=Math.min(top-70,gap?470:600);for(const e of ENTS)if(e.type=='enemy'&&!e.dead&&e.x>p.x-80&&e.x<p.x+360)want=Math.min(want,e.y-120);BOT.r=1;BOT.l=0;BOT.j=p.y>want;return true}};
// ---- озеро с отражением невидимой дорожки
EX.lake={setup(o){o.a=o.x0*T;o.b=o.x1*T;o.x=(o.a+o.b)/2;o.nc=1},draw0(){},
 hint(o){if(P.x<o.a-400||P.x>o.b)return;for(let x=o.x0;x<o.x1;x++)for(let y=6;y<11;y++)if(tileAt(x,y)==17&&!L.seen[y*L.w+x]&&x*T>P.x-30){HAND={x:x*T+30,y:600+(600-y*T)-30,t:0,k:'tap'};say('l54');return true}},
 upd(o){if(!o.said&&P.x>o.a-500&&P.x<o.b){o.said=1;if(o.say)say('l54')}},
 draw(o){X.save();const g=X.createLinearGradient(0,600,0,780);g.addColorStop(0,'rgba(170,200,255,.92)');g.addColorStop(1,'rgba(110,120,220,.95)');X.fillStyle=g;X.fillRect(o.a,604,o.b-o.a,240);
  X.beginPath();X.rect(o.a,604,o.b-o.a,240);X.clip();
  for(let x=o.x0;x<o.x1;x++)for(let y=5;y<11;y++){if(tileAt(x,y)!=17)continue;const ry=600+(600-(y+1)*T),sx=Math.sin(G.t*2+x)*4;glass(x*T+sx,ry+4,T,T-4,L.seen[y*L.w+x],.75)}
  const p=P;if(p.x>o.a&&p.x<o.b){const [w,h]=dims(p);X.globalAlpha=.25;X.fillStyle='#5b3a9a';X.beginPath();X.ellipse(p.x,600+(600-p.y)+h*.5,w*.35,h*.5,0,0,7);X.fill();X.globalAlpha=1}
  X.strokeStyle='rgba(255,255,255,.75)';X.lineWidth=3;for(let i=0;i<8;i++){const x=o.a+((i*97+G.t*30)%(o.b-o.a));X.beginPath();X.moveTo(x,612+i%3*20);X.lineTo(x+40,612+i%3*20);X.stroke()}
  X.restore();X.save();X.fillStyle='#ffffff';X.globalAlpha=.9;X.fillRect(o.a,600,o.b-o.a,5);X.restore()}};
// ---- босс: Сова Зеркалица
const OAX=152,RD=[[340,35],[295,90],[245,135],[320,165],[260,205]],DEC=[[-40,265],[105,330],[-95,60]];
EX.owl={top(o){return 600-o.h-30},setup(o){o.boss=1;o.h=270;o.s=o.h/400;o.st='intro';o.t=0;o.lit=0;o.mask=0;o.waves=[];o.cd=1.5;o.nw=0;o.bad=null;o.fy=0},
 wp(o,ix,iy){return [o.x+(ix-OAX)*o.s,600+(iy-400)*o.s-o.fy]},
 dots(o){return RD.map(([x,y])=>EX.owl.wp(o,2*OAX-x,y))},decs(o){return DEC.map(([x,y])=>EX.owl.wp(o,x,y))},
 upd(o,dt){const p=P;o.t+=dt;if(p.x>o.x-170){p.x=o.x-170;p.vx=Math.min(0,p.vx)}
  {const m=CAM.x+WV-(375-OAX)*o.s-10;if(o.x>m)o.x=o.st=='intro'?m:Math.max(m,o.x-160*dt)}
  if(o.bad){o.bad.t-=dt;if(o.bad.t<=0)o.bad=null}
  const tf=o.st=='fly'?1:0;o.fy+=((tf?40+Math.sin(G.t*3)*14:0)-o.fy)*Math.min(1,dt*4);
  if(o.st=='intro'){if(o.t>3.5){o.st='fly';o.t=0;o.nw=0;o.cd=1}return}
  if(o.st=='calm'){if(o.t>2&&!speaking()&&!G.won)win();return}
  if(o.st=='fly'){o.cd-=dt;if(o.cd<=0&&o.nw<3){o.nw++;o.cd=1.8;o.waves.push({x:o.x-o.h*.35,vx:-330,h:62});tone(880,.4,'sine',.1,440)}
   if(o.nw>=3&&!o.waves.length){o.st='rest';o.t=0;hush();say('b5h')}}
  if(o.st=='rest'&&o.t>11){o.st='fly';o.t=0;o.nw=0;o.cd=.8}
  const [w]=dims(p);
  for(const q of o.waves){q.x+=q.vx*dt;if(q.x<CAM.x-80)q.dead=1;if(!q.hit&&Math.abs(q.x-p.x)<w/2+18&&p.y>600-q.h+6){q.hit=1;hurt(p,q.x)}}
  o.waves=o.waves.filter(q=>!q.dead)},
 tap(o,wx,wy){if(o.st!='rest'&&o.st!='fly')return false;const ds=EX.owl.dots(o);let i=-1,bd=62;ds.forEach((q,k)=>{if(o.mask&(1<<k))return;const d=Math.hypot(wx-q[0],wy-q[1]);if(d<bd){bd=d;i=k}});
  if(i<0){const de=EX.owl.decs(o);const j=de.findIndex(q=>Math.hypot(wx-q[0],wy-q[1])<62);if(j>=0&&o.st=='rest'){SFX.no();hush();say('r_mir_no');o.bad={j,t:.7};return true}if(Math.abs(wx-o.x)<o.h*.6&&wy>600-o.h)return true;return false}
  if(o.st!='rest'){SFX.no();say('b5t');return true}
  const q=ds[i];throwBoom(q[0],q[1],()=>{if(o.mask&(1<<i)||o.st=='calm')return;o.mask|=1<<i;o.lit++;SFX.light(o.lit);hush();say('n'+o.lit);const z=EX.owl.dots(o)[i];part(z[0],z[1],18,COLS[i],300,.6,0);
   if(o.lit==5){o.st='calm';o.t=0;o.waves=[];SFX.win();shake(8);hush();say('b5c');part(o.x,600-o.h*.6,60,'#fff3a0',600,1.2,0,12)}});return true},
 hint(o){if(o.st=='rest'){const ds=EX.owl.dots(o);const i=ds.findIndex((q,k)=>!(o.mask&(1<<k)));HAND={x:ds[i][0],y:ds[i][1],t:0,k:'tap'};say('b5h')}else if(o.st=='fly'){HAND={x:0,y:0,t:0,k:'screen',bx:'jump'};say('b5t')}return true},
 bot(o,dt){const p=P;if(o.st=='calm'||o.st=='intro'){BOT.r=0;return true}const tx=Math.max(o.x-460,200);BOT.r=p.x<tx-30;BOT.l=p.x>tx+60;
  const q=o.waves.find(q=>q.x>p.x-20&&q.x-p.x<175);BOT.j=!!q&&p.ground&&q.x-p.x>40||(!p.ground&&p.vy<0);
  if(o.st=='rest'){G.bt=(G.bt||0)+dt;if(G.bt>.75&&!BOOM.length&&o.t>1){G.bt=0;if(!G.botOwl){G.botOwl=1;const d=EX.owl.decs(o)[0];WX.bt(d[0],d[1])}else{const ds=EX.owl.dots(o),i=ds.findIndex((q,k)=>!(o.mask&(1<<k)));if(i>=0)WX.bt(ds[i][0],ds[i][1])}}}return true},
 draw(o){const im=IMG.owl_0;X.save();
  for(const q of o.waves){X.save();X.shadowColor='#e8dcff';X.shadowBlur=20;const g=X.createLinearGradient(0,600-q.h,0,600);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(197,140,255,.75)');X.fillStyle=g;X.beginPath();X.ellipse(q.x,600,34,q.h,0,Math.PI,0);X.fill();X.strokeStyle='#fff3a0';X.lineWidth=4;X.stroke();X.restore()}
  if(im&&im.width){const s=o.s,bx=o.x-OAX*s,by=600-400*s-o.fy;
   if(o.fy>4){X.fillStyle='rgba(60,40,110,.2)';X.beginPath();X.ellipse(o.x,600,o.h*.35,10,0,0,7);X.fill()}
   X.drawImage(im,bx,by,375*s,400*s);
   const k=o.st=='calm'?Math.min(1,o.t/.8):o.lit/5*.9;const ghost=o.st=='rest'||o.st=='fly'?.42:0;
   if(k>0||ghost){X.save();X.translate(o.x,0);X.scale(-1,1);X.globalAlpha=Math.max(k,ghost);if(k<=0){X.filter='sepia(1) hue-rotate(220deg) saturate(2.2) brightness(1.25)'}X.drawImage(im,400,0,350,540,(200-OAX)*s,by,175*s,270*s);X.restore()}
   if(o.st=='rest'){for(let i=0;i<3;i++){const t=(G.t*.6+i/3)%1;txt('z',o.x+40+t*60,by+40-t*70,30+t*18,'#fff')}}}
  if(o.st=='rest'||o.st=='fly'){const R=RD.map(([x,y])=>EX.owl.wp(o,x,y)),ds=EX.owl.dots(o),de=EX.owl.decs(o);
   R.forEach((q,i)=>{X.save();X.shadowColor=COLS[i];X.shadowBlur=16;X.fillStyle=COLS[i];X.beginPath();X.arc(q[0],q[1],17,0,7);X.fill();X.strokeStyle='#fff';X.lineWidth=3;X.stroke();X.restore()});
   const a=o.st=='rest'?1:.35;
   ds.forEach((q,i)=>{const on=o.mask&(1<<i);X.save();X.globalAlpha=on?1:a;X.fillStyle=on?COLS[i]:'rgba(255,255,255,.7)';X.shadowColor=on?COLS[i]:'#fff';X.shadowBlur=on?18:8;X.beginPath();X.arc(q[0],q[1],on?21:20+(o.st=='rest'?3*Math.sin(G.t*6+i):0),0,7);X.fill();X.strokeStyle='#3a1d55';X.lineWidth=3;X.stroke();X.restore()});
   de.forEach((q,j)=>{const bad=o.bad&&o.bad.j==j;X.save();X.globalAlpha=a;X.fillStyle=bad?'rgba(255,120,120,.8)':'rgba(255,255,255,.7)';X.beginPath();X.arc(q[0]+(bad?Math.sin(G.t*50)*5:0),q[1],20+(o.st=='rest'?3*Math.sin(G.t*6+j+2):0),0,7);X.fill();X.strokeStyle='#3a1d55';X.lineWidth=3;X.stroke();X.restore()})}
  if(o.st!='intro')txt(o.lit+' из 5',CAM.x+WV*.5,CAM.y+75,big(),'#fff3a0');
  X.restore()}};
WX.add(()=>{
const pw=WX.wantF;WX.wantF=function(want,fx,fy){if(pw){const r=pw(want,fx,fy);if(r&&r!=want)return r}if(WX.wn()!=5)return want;if(L.id=='5-3'&&L.forms.includes('bubble'))return 'bubble';return want};
const deco=(b,xs)=>b.e('temple',0,10,{xs});
LV['5-1']=()=>{const b=new LB(172,'5-1');b.meta={name:'5-1 Зеркальный мост',intro:['w5','t_mir'],forms:[]};
 const M1=[[5,8,2],[1,8,2]],M2=[[9,9,2],[5,8,2],[1,7,2]],M3=[[13,9,2],[9,8,2],[5,7,2],[1,6,2]];
 b.g(0,172);b.e('mirror',30,10,{A:30,steps:M1,gap:9,say:1}).e('mirror',75,10,{A:75,steps:M2,gap:13});
 b.e('mirror',128,10,{A:128,steps:M3,gap:17});
 b.meta.path=mpath(30,M1,[39.5,10]).concat(mpath(75,M2,[88.5,10]),mpath(128,M3,[145.5,10]));
 b.coins(8,7,6,'coin_circ',2).coins(42,7,8,'coin_circ',2).coins(92,7,8,'coin_circ',1).coins(150,7,8,'coin_circ',2);
 for(let i=0;i<M3.length;i++)b.e('coin',128+M3[i][0]+1,M3[i][1]-1,{kind:'coin_circ'});
 b.e('enemy',16,10).e('enemy',50,10).e('enemy',100,10).e('enemy',158,10);
 b.e('star',33,6).e('star',85,5).e('star',134,4).e('goal',166,10);
 deco(b,[3,12,44,56,92,104,148,160]);return b};
LV['5-2']=()=>{const b=new LB(176,'5-2');b.meta={name:'5-2 Зеркальные узоры',intro:['l52'],forms:[]};
 b.g(0,176);
 b.e('pattern',24,10,{cols:3,rows:3,cells:[[0,0,0],[1,1,1],[2,0,3]]});
 const M=[[6,8,2],[2,7,2]];b.e('mirror',58,10,{A:58,steps:M,gap:10});b.meta.path=mpath(58,M,[68.5,10]);
 b.e('pattern',86,10,{cols:3,rows:3,cells:[[0,2,4],[1,0,2],[1,1,2],[2,2,5]]});
 b.g(100,106,8).g(112,118,7);
 b.e('pattern',136,10,{cols:4,rows:3,cells:[[0,0,3],[0,3,1],[1,1,4],[2,0,0],[2,2,2]]});
 b.coins(8,7,6,'coin_circ',2).coins(40,7,8,'coin_circ',2).coins(100,6,6,'coin_circ',1).coins(112,5,6,'coin_circ',1).coins(152,7,8,'coin_circ',2);
 b.e('enemy',14,10).e('enemy',44,10).e('enemy',76,10).e('enemy',108,10).e('enemy',124,10).e('enemy',160,10);
 b.e('star',38,6).e('star',103,5).e('star',115,4).e('goal',170,10);
 deco(b,[4,16,34,48,72,98,122,150,164]);return b};
LV['5-3']=()=>{const b=new LB(150,'5-3');b.meta={name:'5-3 Облачный храм',intro:['l53'],forms:[],tk:{bubble:'t_bub5'}};
 b.g(0,32).g(44,58).g(58,74,4).g(74,108).g(122,150);
 b.e('stone',13,10,{shape:'oval',give:'bubble'});
 b.col(24,0,9,8);
 b.e('cloud',35,8,{w:2.4,hup:240}).e('cloud',39.5,7,{w:2.4,hup:240});
 b.e('cloud',54,9,{w:2.4,hup:420});
 b.e('updraft',0,0,{x0:82,x1:87,top:60}).bl(87,2,6,1);
 b.col(96,0,9,8);
 b.e('cloud',111,8,{w:2.4,hup:260}).e('cloud',115.5,6.6,{w:2.4,hup:240}).e('cloud',119.5,8,{w:2.4,hup:240});
 b.e('skybot',0,0);
 b.coins(4,7,6,'coin_circ',2).coins(34,5,8,'coin_circ',2).coins(60,2,8,'coin_circ',1).coins(88,1,4,'coin_circ',0).coins(100,7,6,'coin_circ',2).coins(110,4,10,'coin_circ',2);
 b.e('enemy',20,10).e('enemy',48,10).e('enemy',78,10).e('enemy',102,10).e('enemy',138,10);
 b.e('star',37,4).e('star',90,1).e('star',116,3).e('goal',144,10);
 deco(b,[2,8,18,30,46,76,100,106,126,134]);return b};
LV['5-4']=()=>{const b=new LB(162,'5-4');b.meta={name:'5-4 Невидимая дорожка',intro:['l54'],forms:[]};
 b.g(0,20).g(33,57).g(74,100).g(114,162);
 b.bl(21,9,2,17).bl(25,9,2,17).bl(29,9,2,17);
 b.e('lake',0,0,{x0:20,x1:33,say:0});
 b.e('refl',42,10,{shape:'bfly'});
 b.bl(59,9,2,17).bl(63,8,2,17).bl(67,9,2,17).bl(71,8,1,17);
 b.e('lake',0,0,{x0:57,x1:74});
 b.e('refl',88,10,{shape:'tree'});
 b.bl(102,9,1,17).bl(105,8,1,17).bl(108,9,1,17).bl(111,8,1,17);
 b.e('lake',0,0,{x0:100,x1:114});
 b.e('refl',130,10,{shape:'heart'});
 b.meta.path=[[22,9],[26,9],[30,9],[34,10],[60,9],[64,8],[68,9],[71.5,8],[75,10],[102.5,9],[105.5,8],[108.5,9],[111.5,8],[115,10]];
 b.coins(6,7,8,'coin_circ',2).coins(21,7,10,'coin_circ',1).coins(60,6,12,'coin_circ',1).coins(102,6,10,'coin_circ',1).coins(146,7,8,'coin_circ',2);
 b.e('enemy',12,10).e('enemy',140,10).e('enemy',150,10);
 b.e('star',27,6).e('star',66,5).e('star',107,5).e('goal',156,10);
 deco(b,[3,10,36,52,78,96,118,140,152]);return b};
LV['5-B']=()=>{const n=Math.max(13,Math.ceil(W/1.85/T)+1);const b=new LB(n,'5-B');b.zoom=1.85;b.gf=.8;b.meta={name:'Босс: Сова Зеркалица',intro:['b5a','b5t'],forms:[],boss:'owl'};b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('owl',n-3,10);b.e('temple',0,10,{xs:[2],h:300});return b};
});
})();
