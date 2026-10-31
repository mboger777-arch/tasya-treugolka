// v3 Мир 5: Храм Симметрии — половинки «как в зеркале», линия сгиба, Сова Зеркалица
(function(){
const near=(x,d=700)=>Math.abs(x-P.x)<d;
const tapAt=(x,y)=>taps.push({x:(x-CAM.x)*Z,y:(y-CAM.y)*Z});
const pulse=(k=4)=>.5+.5*Math.sin(G.t*k);
const sm=k=>{k=clamp(k,0,1);return k*k*(3-2*k)};
const big=()=>Math.max(52,58/Z);
const wall=(gx,v)=>{for(let y=0;y<=9;y++)setT(gx,y,v)};
const showHand=(s,k,d)=>WX.showHand(s,k,d);
function path(v){X.beginPath();v.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath()}
// правые половинки фигур (x>=0, ось x=0), от верха оси к низу
const arc=(r,n=10)=>{const a=[];for(let i=0;i<=n;i++){const t=-Math.PI/2+i*Math.PI/n;a.push([Math.cos(t)*r,Math.sin(t)*r])}return a};
const HALF={tri:[[0,-95],[88,80],[0,80]],sq:[[0,-80],[80,-80],[80,80],[0,80]],house:[[0,-105],[88,-20],[88,85],[0,85]],
 hex:[[0,-92],[80,-46],[80,46],[0,92]],circ:arc(85),heart:[[0,-45],[22,-82],[62,-90],[92,-58],[86,-10],[0,88]],
 bfly:[[0,-60],[40,-95],[92,-80],[80,-10],[90,50],[50,90],[0,50]]};
const NAME={tri:'треугольник',sq:'квадрат',house:'домик',hex:'шестиугольник',circ:'круг',heart:'сердце',bfly:'бабочка'};
const full=h=>h.concat(h.slice(1,-1).reverse().map(q=>[-q[0],q[1]]));
function drawHalf(h,cx,cy,s,sx,fill,glow){X.save();X.translate(cx,cy);X.scale(s*sx,s);path(h.map(q=>q));X.restore();
 X.save();if(glow){X.shadowColor=glow;X.shadowBlur=22}X.fillStyle=fill;X.strokeStyle='#3a1d55';X.lineWidth=6;X.lineJoin='round';X.fill();X.stroke();X.restore()}
// стеклянная зеркальная преграда
function glass(gx){const x=gx*T;X.save();const g=X.createLinearGradient(x,0,x+T,0);g.addColorStop(0,'rgba(190,225,255,.55)');g.addColorStop(.5,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(170,200,255,.55)');X.fillStyle=g;X.fillRect(x+6,0,T-12,600);X.strokeStyle='#8a6bc0';X.lineWidth=5;X.strokeRect(x+6,-10,T-12,610);X.globalAlpha=.6;X.strokeStyle='#fff';X.lineWidth=4;for(let y=60;y<600;y+=140){X.beginPath();X.moveTo(x+16,y+40);X.lineTo(x+T-16,y);X.stroke()}X.restore()}
// ===== половинка: левая часть фигуры у зеркала, выбрать правую =====
EX.half={setup(o){o.gx=Math.floor(o.x/T)+4;wall(o.gx,15);o.cx=o.gx*T-150;o.cy=330;o.done=0;o.t=0;o.sh=0;o.fly=-1;
  // варианты: ok — зеркальная; copy — та же половинка без отражения; other — половинка другой фигуры
  const ops=[{k:'ok',h:o.shape},{k:'copy',h:o.shape},{k:'x',h:o.other}];const ord=o.ord||[1,0,2];o.ops=ord.map(i=>ops[i])},
 cards(o){return o.ops.map((c,i)=>({...c,x:o.cx-230+i*230,y:o.cy+215}))},
 top(o){return o.done?null:o.cy-140},
 upd(o,dt){o.t+=dt;if(o.sh>0)o.sh-=dt;if(o.done){if(o.ft<1)o.ft+=dt*2;return}
  if(!o.said&&near(o.cx,760)&&P.x<o.cx){o.said=1;say(o.k||'t_half')}
  if(o.fly>=0){o.ft+=dt*2.2;if(o.ft>=1){o.done=1;o.ft=0;wall(o.gx,0);SFX.win();shake(6);hush();say('r_half');part(o.cx+40,o.cy,40,'#fff3a0',500,1,0,10);HUD.got=(HUD.got||0)+1}}
  if(P.x>o.gx*T-40&&!o.done){P.x=o.gx*T-40;P.vx=Math.min(P.vx,0)}},
 tap(o,wx,wy){if(o.done||o.fly>=0||!near(o.cx,WV))return false;const C=EX.half.cards(o);for(let i=0;i<3;i++){const c=C[i];if(Math.abs(wx-c.x)<95&&Math.abs(wy-c.y)<95){
   if(c.k=='ok'){o.fly=i;o.ft=0;HAND=null;SFX.light(3)}else{o.sh=.6;o.shi=i;SFX.no();hush();say(c.k=='copy'?'r_halfno':'r_halfx')}return true}}return false},
 hint(o){if(o.done||o.fly>=0||!near(o.cx,760)||P.x>o.cx)return;const C=EX.half.cards(o),c=C.find(c=>c.k=='ok');showHand([[c.x,c.y],[o.cx+40,o.cy]],o.k||'t_half',1);return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>560||d<-60)return;WX.go(o.cx-330,30);G.bt=(G.bt||0)+dt;
  if(G.bt>1&&o.fly<0&&Math.abs(P.x-(o.cx-330))<80){G.bt=0;const c=EX.half.cards(o).find(c=>c.k=='ok');tapAt(c.x,c.y)}return true},
 draw(o){if(o.cx<CAM.x-500||o.cx>CAM.x+WV+500)return;const h=HALF[o.shape];X.save();
  if(!o.done)glass(o.gx);
  // зеркало-ось
  X.save();X.globalAlpha=o.done?.3:.85;X.setLineDash([14,10]);X.strokeStyle='#bfe8ff';X.shadowColor='#bfe8ff';X.shadowBlur=14;X.lineWidth=6;X.beginPath();X.moveTo(o.cx,o.cy-140);X.lineTo(o.cx,o.cy+120);X.stroke();X.restore();
  const g=o.done?'#fff3a0':null;
  drawHalf(h,o.cx,o.cy,1,-1,'#ffb36b',g);
  if(o.done){drawHalf(h,o.cx,o.cy,1,1,'#ffb36b',g);if(o.ft<1)txt(NAME[o.shape],o.cx,o.cy-150,big()*.8,'#fff3a0');}
  else{const C=EX.half.cards(o);C.forEach((c,i)=>{let x=c.x,y=c.y,s=.55,sx=c.k=='copy'?-1:1,hh=HALF[c.h];
    if(o.fly==i){const k=sm(o.ft);x=x+(o.cx-x)*k;y=y+(o.cy-y)*k-Math.sin(k*Math.PI)*90;s=.55+.45*k}
    else{X.save();X.fillStyle='rgba(255,255,255,.85)';X.strokeStyle='#7d5aa8';X.lineWidth=5;X.beginPath();X.roundRect(x-80,y-80,160,160,22);X.fill();X.stroke();X.restore()}
    if(o.sh>0&&o.shi==i)x+=Math.sin(o.sh*40)*8;
    // карточка: половинка рисуется от своей оси, сдвинута к центру карточки
    const ox=o.fly==i?0:-40*(sx);drawHalf(hh,x+ox*(o.fly==i?0:1),y,s,sx,'#7fd3ff',o.fly==i?'#fff3a0':null)});
   panelHide(o.cx-330,o.cy+120,660)}
  X.restore()}};
// ===== сгиб: фигура и две линии; верная линия — половинки совпадают =====
const FIG={tri:[[0,-95],[95,80],[-95,80]],rect:[[-130,-70],[130,-70],[130,70],[-130,70]],heart:full(HALF.heart),house:full(HALF.house),
 lpar:[[-110,-70],[60,-70],[110,70],[-60,70]]};
EX.fold={setup(o){o.gx=Math.floor(o.x/T)+4;wall(o.gx,15);o.cx=o.gx*T-170;o.cy=o.cy||330;o.done=0;o.k=0;o.sel=-1;o.ft=0;o.sh=0;o.hits=0},
 lines(o){return o.L.map((l,i)=>({...l,i}))},
 top(o){return o.done?null:o.cy-170},
 upd(o,dt){if(o.sh>0)o.sh-=dt;if(o.done){o.ft=Math.min(2,o.ft+dt);return}
  if(!o.said&&near(o.cx,760)&&P.x<o.cx){o.said=1;say('t_fold')}
  if(o.sel>=0){o.ft+=dt*1.6;const l=o.L[o.sel];
   if(o.ft>=1&&!o.chk){o.chk=1;if(l.ok){o.lit=(o.lit||0)|(1<<o.sel);o.hits++;SFX.win();part(o.cx,o.cy,30,'#fff3a0',400,.8,0,8);hush();
     if(o.hits>=(o.need||1)){say(o.need>1?'r_fold2':'r_fold');o.done=1;o.ft=0;o.sel=-1;if(!o.boss)wall(o.gx,0);shake(6);HUD.got=(HUD.got||0)+1;if(o.cb)o.cb()}else say('r_fold')}
    else{SFX.no();o.sh=.6;hush();say('r_foldno')}}
   if(o.ft>=2.2){o.sel=-1;o.ft=0;o.chk=0}}
  if(P.x>o.gx*T-40&&!o.done&&!o.boss){P.x=o.gx*T-40;P.vx=Math.min(P.vx,0)}},
 ld(o,l,wx,wy){return l.v?Math.abs(wx-o.cx-(l.at||0))+(Math.abs(wy-o.cy)>150?999:0):Math.abs(wy-o.cy-(l.at||0))+(Math.abs(wx-o.cx)>190?999:0)},
 tap(o,wx,wy){if(o.done||o.sel>=0||!near(o.cx,WV))return false;let b=-1,bd=55;o.L.forEach((l,i)=>{if(o.lit&(1<<i))return;const d=EX.fold.ld(o,l,wx,wy);if(d<bd){bd=d;b=i}});
  if(b<0)return false;o.sel=b;o.ft=0;o.chk=0;HAND=null;SFX.light(2);return true},
 hint(o){if(o.done||o.sel>=0||!near(o.cx,760)||(!o.boss&&P.x>o.cx))return;const i=o.L.findIndex((l,i)=>l.ok&&!(o.lit&(1<<i))),l=o.L[i];
  showHand(l.v?[[o.cx+(l.at||0),o.cy-110],[o.cx+(l.at||0),o.cy+110]]:[[o.cx-150,o.cy+(l.at||0)],[o.cx+150,o.cy+(l.at||0)]],o.boss?'b5f':'t_fold');return true},
 bot(o,dt){if(o.done)return;const d=o.cx-P.x;if(d>560||d<-60)return;WX.go(o.cx-360,30);G.bt=(G.bt||0)+dt;
  if(G.bt>1.1&&o.sel<0&&Math.abs(P.x-(o.cx-360))<80){G.bt=0;const i=o.L.findIndex((l,i)=>l.ok&&!(o.lit&(1<<i))),l=o.L[i];tapAt(o.cx+(l.v?(l.at||0):60),o.cy+(l.v?60:(l.at||0)))}return true},
 dshape(o,col){const F=FIG[o.shape].map(q=>[o.cx+q[0]*(o.s||1),o.cy+q[1]*(o.s||1)]);path(F);X.fillStyle=col;X.fill();X.strokeStyle='#3a1d55';X.lineWidth=6;X.lineJoin='round';X.stroke();return F},
 draw(o){if(o.cx<CAM.x-500||o.cx>CAM.x+WV+500)return;X.save();if(!o.boss&&!o.done)glass(o.gx);
  const sx=o.sh>0?Math.sin(o.sh*40)*6:0;X.translate(sx,0);
  const glow=o.done;X.save();if(glow){X.shadowColor='#fff3a0';X.shadowBlur=30}const F=EX.fold.dshape(o,glow?'#ffe08a':'#c9a6ff');X.restore();
  if(o.sel>=0){const l=o.L[o.sel],k=o.ft<1?sm(o.ft):o.ft<1.6?1:1-sm((o.ft-1.6)/.6),c=Math.cos(k*Math.PI),ax=o.cx+(l.v?(l.at||0):0),ay=o.cy+(l.v?0:(l.at||0));
   X.save();X.beginPath();if(l.v)X.rect(ax,o.cy-400,400,800);else X.rect(o.cx-400,ay,800,400);X.clip();X.fillStyle='rgba(0,0,0,0)';X.restore();
   // правая/нижняя половинка переворачивается через линию
   X.save();if(l.v){X.translate(ax,0);X.scale(c,1);X.translate(-ax,0)}else{X.translate(0,ay);X.scale(1,c);X.translate(0,-ay)}
   X.beginPath();if(l.v)X.rect(ax,o.cy-400,400,800);else X.rect(o.cx-400,ay,800,400);X.clip();path(F);X.fillStyle=c<0?(l.ok?'rgba(255,224,138,.9)':'rgba(255,120,150,.75)'):'#b48cf0';X.fill();X.strokeStyle='#3a1d55';X.lineWidth=6;X.stroke();X.restore()}
  if(!o.done)o.L.forEach((l,i)=>{const on=o.lit&(1<<i);X.save();X.setLineDash([14,10]);X.lineWidth=7;X.strokeStyle=on?'#7ff0a2':'rgba(255,255,255,'+(.6+.35*pulse(4+i))+')';X.shadowColor='#fff';X.shadowBlur=10;X.beginPath();
   if(l.v){X.moveTo(o.cx+(l.at||0),o.cy-150);X.lineTo(o.cx+(l.at||0),o.cy+150)}else{X.moveTo(o.cx-200,o.cy+(l.at||0));X.lineTo(o.cx+200,o.cy+(l.at||0))}X.stroke();X.restore()});
  if(o.done&&o.ft<1.5)txt('Линия симметрии!',o.cx,o.cy+150,big()*.7,'#fff3a0');
  X.restore()}};
// ===== босс: после 5 точек — окно Совы сложить пополам =====
const OW=EX.owl;
EX.owl5=Object.assign({},OW,{
 setup(o){OW.setup(o);o.F=null},
 upd(o,dt){if(o.st=='fold'){o.t+=dt;const F=o.F;F.cx=o.x-o.h*.95;F.cy=600-o.h*.62;EX.fold.upd(F,dt);if(F.done&&F.ft>1.2&&!o.r5){o.r5=1;o.st='calm';o.t=0;say('rule5');SFX.win();shake(8);part(o.x,600-o.h*.6,60,'#fff3a0',600,1.2,0,12)}return}
  if(o.st=='calm'&&!o.F){o.st='fold';o.t=0;say('b5f');o.F={x:0,cx:o.x-o.h,cy:600-o.h*.6,shape:'heart',s:.8,boss:1,gx:-5,L:[{v:0,ok:0},{v:1,ok:1},{v:0,at:-30,ok:0}],done:0,sel:-1,ft:0,sh:0,hits:0,said:1}}
  OW.upd(o,dt);
  if(o.st=='calm'&&o.r5&&o.t>3&&!speaking()&&!G.won)win()},
 tap(o,wx,wy){if(o.st=='fold')return EX.fold.tap(o.F,wx,wy);return OW.tap(o,wx,wy)},
 hint(o){if(o.st=='fold'){EX.fold.hint(o.F);return true}return OW.hint(o)},
 bot(o,dt){if(o.st=='fold'){BOT.r=0;BOT.l=0;BOT.j=0;const F=o.F;G.bt=(G.bt||0)+dt;if(G.bt>1.3&&F.sel<0&&!F.done){G.bt=0;const i=F.L.findIndex((l,i)=>l.ok&&!(F.lit&(1<<i))),l=F.L[i];tapAt(F.cx+(l.at||0),F.cy+60)}return true}return OW.bot(o,dt)},
 draw(o){OW.draw(o);if(o.st=='fold'||(o.F&&o.st=='calm'&&o.t<2)){EX.fold.draw(o.F);if(o.st=='fold')panelHide(o.F.cx-220,o.F.cy-170,440)}}});
WX.STK.push(['bfly','stk_bfly','5-1'],['snow','stk_snow','5-2'],['leaf','stk_leaf','5-3'],['hmir','stk_hmir','5-4']);
WX.add(()=>{
const O={};for(const k of ['5-1','5-2','5-3','5-4','5-B'])O[k]=LV[k];
const strip=(b,xs)=>{b.ents=b.ents.filter(e=>!(e.type=='enemy'&&xs.includes(Math.round((e.x-T/2)/T))));return b};
LV['5-1']=()=>{const b=strip(O['5-1'](),[50,100]);b.meta.intro=['w5','l51v'];
 b.e('half',52,10,{shape:'tri',other:'sq',ord:[0,1,2]});
 b.e('half',100,10,{shape:'house',other:'hex',ord:[1,2,0]});
 b.e('stk',112,9,{id:'bfly',k:'s_bfly'});return b};
LV['5-2']=()=>{const b=strip(O['5-2'](),[44,124]);
 b.e('half',42,10,{shape:'heart',other:'circ',ord:[2,0,1]});
 b.e('fold',124,10,{shape:'tri',L:[{v:0,ok:0},{v:1,ok:1}]});
 b.e('stk',101,7,{id:'snow',k:'s_snow'});return b};
LV['5-3']=()=>{const b=strip(O['5-3'](),[138]);
 b.e('fold',130,10,{shape:'heart',L:[{v:1,ok:1},{v:0,ok:0}]});
 b.e('stk',70,3,{id:'leaf',k:'s_leaf'});return b};
LV['5-4']=()=>{const b=strip(O['5-4'](),[140,150]);
 b.e('half',80,10,{shape:'bfly',other:'heart',ord:[1,0,2],k:'t_half'});
 b.e('fold',143,10,{shape:'rect',need:2,L:[{v:1,ok:1},{v:0,ok:1}]});
 b.e('stk',125,9,{id:'hmir',k:'s_hmir'});return b};
LV['5-B']=()=>{const b=O['5-B']();b.ents.forEach(e=>{if(e.type=='owl')e.type='owl5'});b.meta.boss='owl5';return b};
});
})();
