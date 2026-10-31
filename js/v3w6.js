// v3 Мир «7» (внутр. 6): Замок Графа Осколка — финал. Фигуру узнают по сторонам и углам, а не по повороту.
(function(){
const near=(x,d=700)=>Math.abs(x-P.x)<d;
const tapAt=(x,y)=>taps.push({x:(x-CAM.x)*Z,y:(y-CAM.y)*Z});
const pulse=(k=4)=>.5+.5*Math.sin(G.t*k);
const sm=k=>{k=clamp(k,0,1);return k*k*(3-2*k)};
const big=()=>Math.max(52,58/Z);
const showHand=(s,k)=>WX.showHand(s,k,0);
// ---- фигуры (вершины в единицах ~80px)
const ng=(n,r,a0)=>{const v=[];for(let i=0;i<n;i++){const a=a0+i*2*Math.PI/n;v.push([Math.cos(a)*r,Math.sin(a)*r])}return v};
const SH={tri:ng(3,85,-Math.PI/2).map(q=>[q[0],q[1]+12]),sq:[[-62,-62],[62,-62],[62,62],[-62,62]],rect:[[-90,-50],[90,-50],[90,50],[-90,50]],
 pent:ng(5,78,-Math.PI/2),hex:ng(6,76,-Math.PI/2)};
const SCOL={tri:'#ff8a5c',sq:'#5ec8ff',rect:'#c58cff',pent:'#7ad97a',hex:'#ffd34a',circ:'#ff6fae'};
const NAME={tri:'Треугольник!',sq:'Квадрат!',rect:'Прямоугольник!',pent:'Пятиугольник!',hex:'Шестиугольник!'};
function tf(v,x,y,r,sx,sy){const c=Math.cos(r*Math.PI/180),s=Math.sin(r*Math.PI/180);return v.map(q=>{const a=q[0]*sx,b=q[1]*sy;return[x+a*c-b*s,y+a*s+b*c]})}
function poly(v,fill,gap,lw){X.save();X.lineJoin='round';X.lineCap='round';X.beginPath();
 if(gap){// незамкнутая: последняя сторона с дыркой
  v.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));const a=v[v.length-1],b=v[0];X.lineTo(a[0]+(b[0]-a[0])*.3,a[1]+(b[1]-a[1])*.3);
  X.strokeStyle='#3a1d55';X.lineWidth=lw||6;X.stroke();X.beginPath();X.moveTo(a[0]+(b[0]-a[0])*.7,a[1]+(b[1]-a[1])*.7);X.lineTo(b[0],b[1]);X.stroke();X.restore();return}
 v.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath();X.fillStyle=fill;X.fill();X.strokeStyle='#3a1d55';X.lineWidth=lw||6;X.stroke();X.restore()}
function shape(k,x,y,r,s,sx,sy,fill,gap,lw){if(k=='circ'){X.save();X.beginPath();X.ellipse(x,y,75*s*sx,75*s*sy,r*Math.PI/180,0,7);X.fillStyle=fill||SCOL.circ;X.fill();X.strokeStyle='#3a1d55';X.lineWidth=lw||6;X.stroke();X.restore();return}
 poly(tf(SH[k],x,y,r,s*sx,s*sy),fill||SCOL[k],gap,lw)}
function card(x,y,sz,hl){X.save();X.fillStyle=hl?'#fff3a0':'rgba(255,255,255,.9)';X.strokeStyle='#5a7ac8';X.lineWidth=5;X.beginPath();X.roundRect(x-sz/2,y-sz/2,sz,sz,20);X.fill();X.stroke();X.restore()}
function heart(x,y,s){X.beginPath();X.moveTo(x,y+95*s);X.bezierCurveTo(x-150*s,y-5*s,x-110*s,y-120*s,x,y-55*s);X.bezierCurveTo(x+110*s,y-120*s,x+150*s,y-5*s,x,y+95*s);X.closePath()}
// ===== босс: Граф Осколок =====
// 1) throw: бросает «неправильные» фигуры (узкие, перевёрнутые, повёрнутые) — назови фигуру, она летит обратно светясь
// 2) shield: щит — наклонный прямоугольник: проверь 4 угла угольником, потом назови
// 3) heart: кривые осколки — сосчитай углы, сложи сердце; Формик летит в центр → Принц Радужик; Маяк рисует остров заново
const THR=[{k:'tri',r:0,sx:.6,sy:1.3,C:['tri','sq','tri*']},{k:'tri',r:180,sx:1,sy:1,C:['circ','tri*','tri']},{k:'sq',r:45,sx:1,sy:1,C:['sq*','pent','sq']},
 {k:'rect',r:-28,sx:.8,sy:1.5,C:['rect','tri','rect*']},{k:'pent',r:20,sx:1.15,sy:.8,C:['hex','pent*','pent']}];
const RK={tri:['r6_tri','r6_tri2'],sq:['r6_sq'],rect:['r6_rect'],pent:['r6_pent']};
const SHD=[{v:[[-70,40],[10,-75],[60,55]],n:3,to:[-48,-22],r:-10},{v:[[-60,-50],[55,-65],[70,40],[-45,60]],n:4,to:[48,-22],r:8},{v:[[-50,-60],[40,-70],[75,0],[20,70],[-70,25]],n:5,to:[0,42],r:0}];
const NUM=[3,4,5,6];
EX.graf6={top(o){return 600-o.h-30},
 setup(o){o.boss=1;o.h=310;o.st='intro';o.t=0;o.sh=0;o.nt=0;o.th=null;o.fl=[];o.ph=0;o.cn=[];o.bad=-1;o.bt=0;o.glow=0;o.hp=0;o.sel=-1;o.fm=null;o.lt=0;WX.fmGone=0},
 cx(){return CAM.x+WV*.4},cy(){return CAM.y+HV*.27},
 cards(o,C){const n=C.length,w=Math.min(180,WV*.18),y=CAM.y+HV*.58;return C.map((k,i)=>({k,x:EX.graf6.cx()+WV*.06-(n-1)*w/2+i*w,y,i,sz:Math.min(140,w*.8)}))},
 cur(o){if(o.st=='throw'&&o.th&&o.th.k2>=1&&!o.th.ok)return THR[o.th.i].C;if(o.st=='shield'&&o.cn.length>=4&&!o.sok)return['sq','rect','tri'];if(o.st=='heart'&&o.hp<3&&!o.hf)return NUM;return null},
 corners(o){return tf(SH.rect,EX.graf6.cx(),EX.graf6.cy()+10,-22,1.15,1.15)},
 upd(o,dt){const p=P;o.t+=dt;if(o.sh>0)o.sh-=dt;if(o.bad>=0&&(o.bt-=dt)<=0)o.bad=-1;if(p.x>o.x-200){p.x=o.x-200;p.vx=Math.min(0,p.vx)}
  {const m=CAM.x+WV-o.h*.42;if(o.x>m)o.x=o.st=='intro'?m:Math.max(m,o.x-160*dt)}
  for(const f of o.fl)f.t+=dt;o.fl=o.fl.filter(f=>f.t<1.6);
  if(o.st=='intro'){if(o.t>3&&!speaking()){o.st='throw';o.t=0;say('b6t')}return}
  if(o.st=='throw'){
   if(!o.th&&o.t>.6&&!speaking()){o.th={i:o.nt,k2:0,t:0,ok:0};SFX.coin();if(o.nt==1||o.nt==3){say('b6x')}}
   const h=o.th;if(h){h.t+=dt;if(h.k2<1)h.k2=Math.min(1,h.k2+dt*1.4);
    if(h.ok){h.ft+=dt;if(h.ft>.8&&!h.hit){h.hit=1;o.sh=.5;shake(6);SFX.light(o.nt+1);part(o.x-20,600-o.h*.6,24,'#fff3a0',380,.7,0,10)}
     if(h.ft>1.6&&!speaking()){o.nt++;o.th=null;o.t=0;if(o.nt>=THR.length){o.st='shield';o.t=0;o.cn=[];o.sok=0;hush();say('b6s')}}}
    else if(h.k2>=1&&h.t>14){// долго думаем — фигура падает рядом (без вреда, если отойти)
     h.t=0;h.k2=0;part(EX.graf6.cx(),560,18,'#c58cff',300,.6,0,8);shake(4);if(Math.abs(p.x-EX.graf6.cx())<90)hurt(p,EX.graf6.cx())}}
   return}
  if(o.st=='shield'){if(!o.ss&&o.t>.4&&!speaking()){o.ss=1;say('b6st')}
   if(o.sok){o.sft+=dt;if(o.sft>2.2&&!speaking()){o.st='heart';o.t=0;o.hp=0;o.hf=0;hush();say('b6h')}}return}
  if(o.st=='heart'){if(!o.hs&&o.t>.4&&!speaking()){o.hs=1;say('b6ht')}
   if(o.hf){o.hf+=dt;if(o.hf>1.2&&o.hp<3){o.hf=0;o.hp++;if(o.hp>=3){o.st='fm';o.t=0;hush();say('b6f');WX.fmGone=1;o.fm={x:FM.x||p.x,y:FM.y||p.y-150}}}}return}
  if(o.st=='fm'){if(o.t>1.8){o.st='trans';o.t=0;SFX.win();shake(8);part(EX.graf6.cx(),EX.graf6.cy(),60,'#fff3a0',600,1.2,0,12)}return}
  if(o.st=='trans'){o.glow=Math.min(1,o.t/1.6);if(o.t>1.2&&!o.sp){o.sp=1;WX.fmGone=0;say('b6p')}if(o.t>2&&o.sp==1&&!speaking()){o.sp=2;say('b6n')}if(o.sp==2&&o.t>3&&!speaking()){o.st='light';o.t=0;say('b6l')}return}
  if(o.st=='light'){o.lt+=dt;if(o.t>7&&!o.r6&&!speaking()){o.r6=1;say('rule6')}if(o.r6&&o.t>9&&!speaking()&&!G.won)win();return}},
 tap(o,wx,wy){const C=EX.graf6.cur(o);
  if(o.st=='shield'&&o.cn.length<4){const K=EX.graf6.corners(o);for(let i=0;i<4;i++){if(o.cn.includes(i))continue;const q=K[i];if(Math.hypot(wx-q[0],wy-q[1])<80){HAND=null;o.cn.push(i);SFX.light(o.cn.length);hush();say('n'+o.cn.length);part(q[0],q[1],12,'#fff3a0',260,.5,0,6);if(o.cn.length==4)say('b6sn');return true}}return false}
  if(!C)return false;for(const c of EX.graf6.cards(o,C)){if(Math.abs(wx-c.x)>c.sz/2+10||Math.abs(wy-c.y)>c.sz/2+10)continue;HAND=null;
   if(o.st=='throw'){const T0=THR[o.th.i];if(c.k==T0.k){o.th.ok=1;o.th.ft=0;SFX.win();hush();say(RK[T0.k][o.th.i==1?1:0]);o.fl.push({s:NAME[T0.k],x:EX.graf6.cx(),y:EX.graf6.cy()-110,t:0})}
    else{o.bad=c.i;o.bt=.6;SFX.no();hush();say(c.k.endsWith('*')?'r6_gap':'r6_no')}return true}
   if(o.st=='shield'){if(c.k=='rect'){o.sok=1;o.sft=0;SFX.win();shake(6);hush();say('r6_shield');const K=EX.graf6.corners(o);K.forEach(q=>part(q[0],q[1],16,'#c58cff',420,.8,0,10));o.fl.push({s:'Прямоугольник!',x:EX.graf6.cx(),y:EX.graf6.cy()-120,t:0})}
    else{o.bad=c.i;o.bt=.6;SFX.no();hush();say(c.k=='sq'?'r6_sqno':'r6_no')}return true}
   if(o.st=='heart'){const s=SHD[o.hp];if(c.k==s.n){o.hf=.01;SFX.light(o.hp+2);hush();say('r6_k'+s.n)}else{o.bad=c.i;o.bt=.6;SFX.no();hush();say('r6_cnt')}return true}}
  if(Math.abs(wx-o.x)<o.h*.4&&wy>600-o.h){o.sh=.3;return true}return false},
 hint(o){const C=EX.graf6.cur(o),g=EX.graf6;
  if(o.st=='shield'&&o.cn.length<4){const K=g.corners(o),i=[0,1,2,3].find(i=>!o.cn.includes(i));showHand([K[i]],'b6st');return true}
  if(!C)return true;let k;if(o.st=='throw')k=THR[o.th.i].k;else if(o.st=='shield')k='rect';else k=SHD[o.hp].n;const c=g.cards(o,C).find(c=>c.k==k);
  if(o.st=='heart'){const s=SHD[o.hp],P0=g.spos(o,o.hp);showHand(s.v.map(q=>[P0[0]+q[0]*.8,P0[1]+q[1]*.8]).concat([[c.x,c.y]]),'b6ht');return true}
  showHand([[g.cx(),g.cy()],[c.x,c.y]],o.st=='throw'?'b6t':'b6sn');return true},
 spos(o,i){const g=EX.graf6;if(i<o.hp||i==o.hp&&o.hf){const k=i<o.hp?1:sm(o.hf/1.2),a=[o.x-80-i*60,600-o.h*.35],b=[g.cx()+SHD[i].to[0],g.cy()+SHD[i].to[1]];return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k-Math.sin(k*Math.PI)*60]}
  return i==o.hp?[g.cx()-WV*.22,g.cy()+20]:[o.x-80-i*60,600-o.h*.35]},
 bot(o,dt){const p=P;BOT.j=0;const tx=Math.max(o.x-560,CAM.x+150);BOT.r=p.x<tx-30;BOT.l=p.x>tx+60;o.bt2=(o.bt2||0)+dt;if(o.bt2<1.1||speaking())return true;
  const g=EX.graf6,C=g.cur(o);
  if(o.st=='shield'&&o.cn.length<4){o.bt2=0;const K=g.corners(o),i=[0,1,2,3].find(i=>!o.cn.includes(i));tapAt(K[i][0],K[i][1]);return true}
  if(!C)return true;let k;if(o.st=='throw')k=THR[o.th.i].k;else if(o.st=='shield')k='rect';else k=SHD[o.hp].n;
  // бот иногда ошибается на «почти-фигуре», чтобы проверить ловушку
  let c=g.cards(o,C).find(c=>c.k==k);if(o.st=='throw'&&o.th.i==2&&!o.trap){o.trap=1;c=g.cards(o,C).find(c=>c.k=='sq*')}
  o.bt2=0;tapAt(c.x,c.y);return true},
 draw(o){const g=EX.graf6,a=IMG.oskolok_0,b=IMG.oskolok_3,c2=IMG.oskolok_2;X.save();const sx=o.sh>0?Math.sin(o.sh*50)*6:0,bob=Math.sin(G.t*2.2)*3;
  // Граф: злой → грустный (сердце) → Принц
  const base=o.st=='heart'||o.st=='fm'||o.st=='trans'&&o.glow<1?c2:a;
  if(base&&base.width){const h=o.h,w=base.width*h/base.height;X.fillStyle='rgba(60,30,80,.22)';X.beginPath();X.ellipse(o.x,600,w*.4,12,0,0,7);X.fill();
   if(o.glow<.99){X.save();X.globalAlpha=1-o.glow;X.drawImage(base,o.x-w/2+sx,600-h+bob,w,h);X.restore()}
   if(b&&b.width&&o.glow>.01){const w2=b.width*h/b.height;X.save();X.globalAlpha=o.glow;X.shadowColor='#fff3a0';X.shadowBlur=30*o.glow;X.drawImage(b,o.x-w2/2,600-h+bob,w2,h);X.restore()}}
  const cx=g.cx(),cy=g.cy();
  if(o.st=='throw'&&o.th){const h=o.th,T0=THR[h.i],k=sm(h.k2);let x=o.x-60+(cx-o.x+60)*k,y=600-o.h*.7+(cy-600+o.h*.7)*k-Math.sin(k*Math.PI)*120,s=.5+.5*k,r=T0.r+(1-k)*360;
   if(h.ok){const f=sm(Math.min(1,h.ft/.8));x=cx+(o.x-cx)*f;y=cy+(600-o.h*.6-cy)*f-Math.sin(f*Math.PI)*90;s=1-.4*f;X.save();X.shadowColor='#fff3a0';X.shadowBlur=40}else X.save();
   if(!h.hit)shape(T0.k,x,y,r,s,T0.sx,T0.sy,h.ok?'#fff3a0':SCOL[T0.k]);X.restore();
   if(!h.ok&&h.k2>=1&&h.t>9){X.save();X.globalAlpha=.3;X.fillStyle='#c58cff';X.beginPath();X.ellipse(cx,600,70,10,0,0,7);X.fill();X.restore()}}
  if(o.st=='shield'){const K=g.corners(o);X.save();if(o.sok){X.globalAlpha=Math.max(0,1-o.sft/1.2)}poly(K,o.sok?'#fff3a0':'#8a6bc0',0,8);X.restore();
   if(!o.sok){X.save();X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=4;X.beginPath();X.moveTo(K[0][0]+20,K[0][1]+30);X.lineTo(K[2][0]-30,K[2][1]-20);X.stroke();X.restore();
    K.forEach((q,i)=>{const on=o.cn.includes(i);X.save();if(on){// значок прямого угла
      const a1=K[(i+1)%4],a0=K[(i+3)%4],u=[(a1[0]-q[0]),(a1[1]-q[1])],v=[(a0[0]-q[0]),(a0[1]-q[1])],lu=Math.hypot(...u),lv=Math.hypot(...v),d=28;
      X.strokeStyle='#fff3a0';X.lineWidth=6;X.beginPath();X.moveTo(q[0]+u[0]/lu*d,q[1]+u[1]/lu*d);X.lineTo(q[0]+u[0]/lu*d+v[0]/lv*d,q[1]+u[1]/lu*d+v[1]/lv*d);X.lineTo(q[0]+v[0]/lv*d,q[1]+v[1]/lv*d);X.stroke()}
     else{X.strokeStyle='rgba(255,243,160,'+(.4+.5*pulse(5))+')';X.lineWidth=5;X.beginPath();X.arc(q[0],q[1],30+pulse(5)*6,0,7);X.stroke()}X.restore()})}}
  if(o.st=='heart'||o.st=='fm'||o.st=='trans'||o.st=='light'){const full=o.st!='heart';X.save();heart(cx,cy,1.25);
   if(full){X.fillStyle='rgba(255,111,174,'+(o.st=='light'?.0:.5)+')';X.fill()}else{X.setLineDash([14,12]);X.strokeStyle='rgba(255,243,160,.8)';X.lineWidth=5;X.stroke()}X.restore();
   if(o.st!='light'){SHD.forEach((s,i)=>{if(i>o.hp)return;const q=g.spos(o,i),done=i<o.hp||i==o.hp&&o.hf;X.save();if(done){X.shadowColor='#fff3a0';X.shadowBlur=20}
     poly(tf(s.v,q[0],q[1],done?s.r:0,.8,.8),done?['#ff8a5c','#5ec8ff','#7ad97a'][i]:'#6a4a8a',0,5);X.restore();
     if(i==o.hp&&!o.hf&&o.st=='heart')tf(s.v,q[0],q[1],0,.8,.8).forEach((v,j)=>{X.save();X.fillStyle='#fff3a0';X.globalAlpha=.5+.5*Math.sin(G.t*5+j);X.beginPath();X.arc(v[0],v[1],9,0,7);X.fill();X.restore()})})}
   if(o.st=='fm'&&o.fm){const k=sm(o.t/1.6),x=o.fm.x+(cx-o.fm.x)*k,y=o.fm.y+(cy-o.fm.y)*k-Math.sin(k*Math.PI)*100;img('fm'+(Math.floor(G.t*6)%4),x,y+40,90,0,1,.5,1)}}
  if(o.st=='light'){// Маяк рисует остров заново: точки → отрезки → углы → фигуры
   const t=o.t,P0=[[-260,60],[-150,-40],[-40,60],[60,-50],[170,60],[260,-30]];X.save();X.lineJoin='round';
   P0.forEach((q,i)=>{const a=clamp(t*2-i*.3,0,1);if(a<=0)return;X.globalAlpha=a;X.fillStyle='#fff3a0';X.beginPath();X.arc(cx+q[0],cy+q[1],10,0,7);X.fill()});
   if(t>2){X.globalAlpha=1;X.strokeStyle='#fff3a0';X.lineWidth=6;const k=clamp((t-2)/1.5,0,1)*(P0.length-1);X.beginPath();X.moveTo(cx+P0[0][0],cy+P0[0][1]);for(let i=1;i<=Math.ceil(k);i++){const a=P0[i-1],b=P0[i],f=Math.min(1,k-i+1);X.lineTo(cx+a[0]+(b[0]-a[0])*f,cy+a[1]+(b[1]-a[1])*f)}X.stroke()}
   if(t>4){const a=clamp((t-4)/1.5,0,1);X.globalAlpha=a;shape('tri',cx-150,cy+5,0,.55,1,1);shape('sq',cx+60,cy+5,0,.5,1,1);shape('circ',cx-260,cy+5,0,.4,1,1);shape('hex',cx+260,cy+5,0,.45,1,1);shape('rect',cx-40,cy+95,0,.45,1,1);shape('pent',cx+170,cy+95,0,.45,1,1)}
   X.restore()}
  const C=g.cur(o);if(C){g.cards(o,C).forEach(c=>{let x=c.x;if(o.bad==c.i)x+=Math.sin(o.bt*40)*8;card(x,c.y,c.sz,0);
   if(typeof c.k=='number')txt(''+c.k,x,c.y,c.sz*.55,'#5b2a8a','center','#fff');
   else{const gap=c.k.endsWith('*'),k=gap?c.k.slice(0,-1):c.k;shape(k,x,c.y,0,c.sz/260,k=='rect'?.9:1,1,SCOL[k],gap,5)}});panelHide(cx-WV*.3,cy-120,WV*.6)}
  for(const f of o.fl)if(f.t<1.5)txt(f.s,f.x,f.y-f.t*20,big()*.7,'#fff3a0');
  if(o.st=='throw')txt(Math.min(o.nt,THR.length)+' из '+THR.length,o.x,600-o.h-40,big()*.7,'#fff');
  if(o.st=='heart')txt(o.hp+' из 3',o.x,600-o.h-40,big()*.7,'#fff');
  X.restore()}};
// ===== Книга правил Маяка на карте =====
const RULES={1:['circ','У круга нет углов. Центр — в самой середине.'],2:['tri','У треугольника 3 стороны и 3 угла. Как ни поверни — треугольник.'],
 3:['rect','У квадрата 4 равные стороны. У прямоугольника 2 длинные и 2 короткие. Углы прямые.'],4:['pent','Сколько сторон, столько и углов.'],
 5:['heart','У симметричной фигуры половинки одинаковые.'],7:['house','Из простых фигур можно собрать любые.'],6:['sq45','Фигуру узнают по сторонам и углам, а не по повороту.']};
const WS=[1,2,3,4,5,7,6];
function ricon(k,x,y,s){if(k=='heart'){X.save();heart(x,y-10*s,.42*s);X.fillStyle='#ff6fae';X.fill();X.strokeStyle='#3a1d55';X.lineWidth=4;X.stroke();X.restore();return}
 if(k=='house'){shape('sq',x,y+12*s,0,.3*s,1,1,0,0,4);shape('tri',x,y-30*s,0,.3*s,1,.8,0,0,4);return}
 if(k=='sq45'){shape('sq',x,y,45,.32*s,1,1,0,0,4);return}shape(k,x,y,0,.38*s,1,1,0,0,4)}
function rrows(){const n=7,y0=118,rh=Math.min(78,(H-190)/n),bx=Math.min(W*.86,1120);return WS.map((w,i)=>({w,i,x:W/2-bx/2,y:y0+i*rh,h:rh-8,bw:bx}))}
function drawBook(){X.fillStyle='rgba(20,10,40,.88)';X.fillRect(0,0,W,H);txt('Книга правил Маяка',W/2,62,56,'#fff3a0');
 for(const r of rrows()){const on=SAVE.done&&SAVE.done[r.w+'-B'];X.save();X.fillStyle=on?'rgba(255,243,160,.14)':'rgba(255,255,255,.06)';X.strokeStyle='rgba(255,243,160,.4)';X.lineWidth=3;X.beginPath();X.roundRect(r.x,r.y,r.bw,r.h,16);X.fill();X.stroke();X.restore();
  txt('Мир '+(r.i+1),r.x+70,r.y+r.h/2,28,'#fff3a0');
  if(on){ricon(RULES[r.w][0],r.x+170,r.y+r.h/2,r.h/80);txt(RULES[r.w][1],r.x+230,r.y+r.h/2,Math.min(30,r.h*.42),'#fff','left')}else txt('?  Пройди босса мира',r.x+230,r.y+r.h/2,28,'rgba(255,255,255,.4)','left')}
 txt('Нажми на правило — я прочитаю. Нажми мимо — закрыть.',W/2,H-30,26,'#fff')}
WX.add(()=>{
const _dm=WX.drawMap,_mt=WX.mapTap;const bx=()=>W-90,by=()=>H-58;
WX.drawMap=function(){_dm();if(G.album)return;X.save();const p=1+Math.sin(G.t*3+1)*.03;X.translate(bx(),by());X.scale(p,p);X.fillStyle='rgba(122,80,200,.95)';X.strokeStyle='#fff';X.lineWidth=6;X.beginPath();X.roundRect(-72,-44,144,88,22);X.fill();X.stroke();
 // книжка
 X.fillStyle='#fff3d6';X.strokeStyle='#3a1d55';X.lineWidth=4;X.beginPath();X.moveTo(0,-26);X.quadraticCurveTo(-24,-34,-46,-26);X.lineTo(-46,26);X.quadraticCurveTo(-24,18,0,26);X.quadraticCurveTo(24,18,46,26);X.lineTo(46,-26);X.quadraticCurveTo(24,-34,0,-26);X.closePath();X.fill();X.stroke();X.beginPath();X.moveTo(0,-26);X.lineTo(0,26);X.stroke();
 const n=WS.filter(w=>SAVE.done&&SAVE.done[w+'-B']).length;X.restore();txt(n+'/7',bx()+44,by()+26,30,'#fff');txt('Правила',bx(),by()-62,26,'#fff3a0');
 if(G.book)drawBook()};
WX.mapTap=function(p){if(G.book){const r=rrows().find(r=>p.y>r.y&&p.y<r.y+r.h&&p.x>r.x&&p.x<r.x+r.bw);if(r&&SAVE.done&&SAVE.done[r.w+'-B']){hush();say('rule'+r.w);SFX.coin();return}G.book=0;SFX.coin();return}
 if(!G.album&&Math.hypot(p.x-bx(),p.y-by())<90){G.book=1;SFX.coin();return}_mt(p)};
drawMap=WX.drawMap;mapTap=WX.mapTap;
// ===== уровни =====
WX.STK.push(['flag','stk_flag','6-1'],['frame','stk_frame','6-2'],['crown','stk_crown','6-3'],['lens','stk_lens','6-4']);
const deco=(b,xs)=>b.e('castle',0,10,{xs:xs.map(x=>Array.isArray(x)?x:[x,10])});
const O={'6-1':LV['6-1'],'6-2':LV['6-2']};
LV['6-1']=()=>{const b=O['6-1']();b.e('stk',64,6,{id:'flag',k:'s_flag'});return b};
LV['6-2']=()=>{const b=O['6-2']();b.e('stk',84,2,{id:'frame',k:'s_frame'});return b};
LV['6-3']=()=>{const b=new LB(176,'6-3');b.meta={name:'6-3 Зал поворотов',intro:['l63'],forms:[]};
 // 1) знакомство: треугольники во всех поворотах; «почти-треугольник» с дыркой — ловушка
 b.g(0,60).e('tgate',30,10,{cards:['inv','rot','gap','thin','circle'],need:3,k:'t_tg6'});
 // 2) развитие: повёрнутый домик — угол всё равно прямой
 b.e('house',66,10,{w:3,h:3,rot:1,lift:2.4,pi:3}).g(60,69).g(69,86,5).g(86,100);
 // 3) поворот: облака — квадрат, повёрнутый «ромбиком»
 b.e('scloud',100,10,{br:[100,105],O:[['tri',180,.8],['sq',45,1.1],['rect',0,.9],['circ',0,1]],want:1,k:'t_cl_sq6',name:'Квадрат!'}).g(106,141).g(147,176);
 // 4) финал: прямоугольник лёг набок — углы всё равно прямые
 b.e('scloud',141,10,{br:[141,146],O:[['sq',20,.9],['rect',-30,1],['tri',0,.9],['circ',0,.9]],want:1,k:'t_cl_rect6',rk:'r_cloud',name:'Прямоугольник!'});
 b.pl(120,7,3).e('stk',121,6,{id:'crown',k:'s_crown'});
 b.coins(8,7,6,'coin_tri',2).coins(46,7,8,'coin_tri',2).coins(72,3,8,'coin_sq',1).coins(110,7,8,'coin_sq',2).coins(152,7,8,'coin_sq',2);
 b.e('enemy',20,10).e('enemy',52,10).e('enemy',82,10).e('enemy',162,10);
 b.e('star',50,6).e('star',78,3).e('star',156,6).e('goal',170,10);deco(b,[4,40,[76,5],112,136,166]);return b};
LV['6-4']=()=>{const b=new LB(184,'6-4');b.meta={name:'6-4 Мастерская Маяка',intro:['l64'],forms:[]};
 // 1) точки → отрезок (мир 1)
 b.g(0,20).e('dots',20,10,{pts:[[20],[27]]}).g(27,58);
 // 2) половинка-зеркало (мир 5)
 b.e('half',44,10,{shape:'hex',other:'sq',ord:[1,2,0]});
 // 3) лампа: яйцо — овал, а не круг (мир 1, ловушка «почти круг»)
 b.g(58,184).e('lamp',66,10,{th:'egg',B:['circ','oval','tri'],name:'Яйцо — овал!',k:'t_lamp6',rk:'r_egg'});
 // 4) мельница: найди центр круга (мир 1)
 b.e('mill',104,10,{gx:108});
 // 5) финал: мозаика-домик (мир 7) — квадрат и треугольник
 b.e('mosaic',140,10,{S:WX.mos.house,C:[['rect',0],['sq',0],['tri',0]],name:'Домик!',k:'t_mos',rk:'r_house'});
 b.pl(88,7,3).e('stk',89,6,{id:'lens',k:'s_lens'});
 b.coins(6,7,6,'coin_circ',2).coins(36,7,6,'coin_tri',2).coins(78,7,8,'coin_circ',2).coins(120,7,8,'coin_sq',2).coins(160,7,8,'coin_tri',2);
 b.e('enemy',12,10).e('enemy',50,10).e('enemy',96,10).e('enemy',160,10);
 b.e('star',24,6).e('star',96,6).e('star',152,6).e('goal',178,10);deco(b,[4,30,56,84,118,150,172]);return b};
LV['6-B']=()=>{const n=Math.max(14,Math.ceil(W/1.6/T)+1);const b=new LB(n,'6-B');b.zoom=1.6;b.gf=.8;b.meta={name:'Финал: Граф Осколок',intro:['b6'],forms:[],boss:'graf6'};b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('graf6',n-3,10);b.e('castle',0,10,{xs:[[2,10]]});return b};
});
})();
