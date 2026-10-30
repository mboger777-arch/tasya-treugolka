// Мир 2: Треугольные горы
(function(){
const bossN=()=>Math.max(14,Math.ceil(W/1.38/T)+1);
// ветер: поднимает змея (или всех, если all)
EX.wind={setup(o){o.x0=o.x-T/2;o.x1=o.x0+(o.w||2)*T;o.top=o.top||60},
 upd(o,dt){const p=P;if(!o.said&&o.k!==0&&Math.abs(p.x-o.x)<520){o.said=1;if(o.k)say(o.k)}
  if((o.all||p.form=='kite')&&p.x>o.x0-10&&p.x<o.x1+10&&p.y>o.top&&(!o.need||o.need())){p.vy=Math.max(-620,p.vy-3600*dt);if(p.ground&&o.all){p.vy=-500;p.ground=false}}},
 draw(o){if(o.need&&!o.need())return;X.save();for(let i=0;i<14;i++){const x=o.x0+((i*37)%(o.x1-o.x0)),h=600-o.top,y=600-((G.t*420+i*97)%h);X.globalAlpha=.55*Math.sin(Math.PI*(600-y)/h);X.strokeStyle='#ffffff';X.lineWidth=5;X.lineCap='round';X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+18*Math.sin(G.t*3+i),y-40,x,y-80);X.stroke()}
  X.globalAlpha=.18;const g=X.createLinearGradient(0,600,0,o.top);g.addColorStop(0,'#bfefff');g.addColorStop(1,'rgba(191,239,255,0)');X.fillStyle=g;X.fillRect(o.x0,o.top,o.x1-o.x0,600-o.top);X.restore()},
 hint(o){if(Math.abs(P.x-o.x)<400&&P.form!='kite'&&L.forms.includes('kite')){HAND={x:0,y:0,t:0,k:'screen',bx:'form'};say('t_wind');return true}}};
// три камня-стороны треугольника и подъёмный мост
EX.sides={setup(o){for(const x of o.bx)setT(x,6,3);o.lit=0;o.done=0;o.bi=o.c0;o.bt=0},
 upd(o,dt){const p=P;if(!o.said&&Math.abs(p.x-o.x)<560){o.said=1;say('t_sides')}
  const lit=o.bx.filter(x=>tileAt(x,6)==9).length;if(lit>o.lit){o.lit=lit;SFX.light(lit);say('n'+lit);part(o.x,230,16,'#fff3a0',300,.6,0)}
  if(o.lit==3&&!o.done){o.done=1;SFX.win();setTimeout(()=>say('r_bridge'),600)}
  if(o.done&&o.bi<o.c1){o.bt+=dt;while(o.bt>.07&&o.bi<o.c1){o.bt-=.07;setT(o.bi,10,2);part(o.bi*T+30,600,6,'#d9b07a',200,.5,600,6);SFX.bump();o.bi++}}},
 top(o){return o.done?null:130},
 draw(o){const cx=o.x,cy=230,r=78;X.save();if(o.done&&o.bi>=o.c1)X.globalAlpha=.6;panel(cx-125,120,250,215,34);const pts=shapePts('tri',cx,cy+12,r);
  for(let i=0;i<3;i++){const a=pts[i],b=pts[(i+1)%3],on=i<o.lit;X.lineCap='round';X.lineWidth=on?16:10;X.strokeStyle=on?'#ffcc33':'rgba(122,86,184,.55)';if(!on)X.setLineDash([12,10]);X.shadowColor='#fff3a0';X.shadowBlur=on?20:0;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.stroke();X.setLineDash([]);X.shadowBlur=0}
  txt(o.lit+' из 3',cx,312,34,'#fff3a0');X.restore()},
 hint(o){if(o.done||Math.abs(P.x-o.x)>700)return;const x=o.bx.find(x=>tileAt(x,6)==3);HAND={x:x*T+20,y:7*T+30,t:0,k:'tap'};say('t_sides');return true},
 bot(o,dt){const p=P;if(!o.done&&o.x-p.x<650&&p.x<o.c0*T){const x=o.bx.find(x=>tileAt(x,6)==3);if(x==null)return;const tx=x*T+30;if(WX.go(tx,10)&&p.ground)G.bj=.3;WX.botJump(dt);return true}
  if(o.done&&o.bi<o.c1&&p.x>o.c0*T-260){BOT.r=0;BOT.l=0;BOT.j=0;return true}}};
// скалы в полёте
EX.spire={upd(o,dt){if(!G.fly)return;const p=P,cx=p.x,cy=p.y-85,r=36;if(Math.abs(cx-o.x)>o.w)return;let hw;
  if(o.up){if(cy+r<o.tip)return;const y=clamp(cy,o.tip,640);hw=o.w/2*(y-o.tip)/(640-o.tip)}else{if(cy-r>o.tip)return;const y=clamp(cy,-80,o.tip);hw=o.w/2*(o.tip-y)/(o.tip+80)}
  if(Math.abs(cx-o.x)<hw+r*.7&&p.inv<=0){HUD.hearts=Math.max(1,HUD.hearts-1);p.inv=1.4;p.hurt=.3;SFX.hurt();shake(8);p.vy=o.up?-330:300;part(cx,cy,14,'#fff',300,.5,0);if(!G.f2){G.f2=1;say('t_fly2')}}},
 draw(o){X.save();const b=o.up?640:-80,hw=o.w/2;const g=X.createLinearGradient(o.x-hw,0,o.x+hw,0);g.addColorStop(0,'#c49a6c');g.addColorStop(.5,'#9b7350');g.addColorStop(1,'#5e432c');X.fillStyle=g;X.strokeStyle='#4a3220';X.lineWidth=5;
  X.beginPath();X.moveTo(o.x-hw,b);X.lineTo(o.x+(o.up?-6:6),o.tip);X.lineTo(o.x+hw,b);X.closePath();X.fill();X.stroke();
  X.fillStyle='rgba(255,255,255,.18)';X.beginPath();X.moveTo(o.x-hw*.55,b);X.lineTo(o.x+(o.up?-6:6),o.tip);X.lineTo(o.x-hw*.15,b);X.fill();
  const k=.26;X.fillStyle=o.up?'#f4fbff':'#d8f3ff';X.beginPath();X.moveTo(o.x+(o.up?-6:6),o.tip);X.lineTo(o.x-hw*k,o.tip+(b-o.tip)*k);for(let i=1;i<4;i++)X.lineTo(o.x-hw*k+i*hw*k*2/4,o.tip+(b-o.tip)*k*(i%2?.8:1.05));X.lineTo(o.x+hw*k,o.tip+(b-o.tip)*k);X.closePath();X.fill();X.restore()}};
// босс: Пирамида
EX.pyr={setup(o){o.boss=1;o.st='intro';o.t=0;o.stomps=0;o.lit=0;o.h=290;o.hy=0;o.rocks=[];o.tip='ground';o.tf=0;o.ph=0},
 dims(o){const i=IMG.lineup_1;const w=i.width?i.width*o.h/i.height:255;return w},
 pts(o){const w=EX.pyr.dims(o),x0=o.x-w/2,y0=600-o.h+o.hy;return [[x0+.07*w,y0+.8*o.h],[x0+.95*w,y0+.8*o.h]]},
 tipHome(o){const w=EX.pyr.dims(o);return [o.x-w/2+.49*w,600-o.h+o.hy+.02*o.h]},
 tipGround(o){return [Math.max(4*T,o.x-EX.pyr.dims(o)/2-3.2*T),590]},
 upd(o,dt){const p=P,w=EX.pyr.dims(o);o.t+=dt;
  if(p.x>o.x-w*.4){p.x=o.x-w*.4;p.vx=Math.min(0,p.vx)}
  if(o.st=='intro'&&o.t>3){o.st='stomp';o.t=0;o.stomps=0}
  if(o.st=='stomp'){const per=1.25;const ph=(o.t%per)/per;o.hy=-Math.sin(ph*Math.PI)*95;const k=Math.floor(o.t/per);if(k>o.ph){o.ph=k;shake(12);SFX.crash();part(o.x,600,24,'#d9b07a',420,.7,900,10);o.stomps++;
    const xs=[p.x,clamp(p.x+(rnd()<.5?-1:1)*(180+rnd()*120),90,o.x-w*.6),90+rnd()*(o.x-w*.6-90)];for(const x of xs)o.rocks.push({x,y:-200,t:0})
    if(o.stomps>=2){o.st='tired';o.t=0;o.hy=0;o.ph=0;say(o.lit<2?'b2h':'b2h2')}}}
  else o.hy=lerp(o.hy,0,1-Math.pow(.001,dt));
  if(o.st=='tired'&&o.t>8.5&&o.lit<3&&o.tip!='fly'){o.st='stomp';o.t=0;o.ph=0;o.stomps=0}
  for(const r of o.rocks){r.t+=dt;if(r.t>.95){r.y+=1500*dt;if(r.y>p.y-150&&r.y<p.y&&Math.abs(r.x-p.x)<55)hurt(p,r.x);if(r.y>585){r.dead=1;part(r.x,590,10,'#a88a68',300,.6,900,9);SFX.land()}}}o.rocks=o.rocks.filter(r=>!r.dead);
  if(o.tip=='fly'){o.tf+=dt*1.1;if(o.tf>=1){o.tip='on';o.lit=3;SFX.win();shake(10);const q=EX.pyr.tipHome(o);part(q[0],q[1],50,'#ffe36b',520,1.2,0,10);o.st='calm';o.t=0;o.rocks=[];say('n3');say('b2c')}}
  if(o.st=='calm'){o.hy=Math.sin(o.t*3)*4;if(o.t>1.5&&!speaking()&&!G.won){win()}if(rnd()<.1)part(o.x+(rnd()-.5)*w,600-rnd()*o.h,1,'#ffd1e8',60,1,-60,7)}},
 tap(o,wx,wy){if(o.st=='calm')return false;const pts=EX.pyr.pts(o);
  for(let i=0;i<2;i++){const q=pts[i];if(Math.hypot(wx-q[0],wy-q[1])<85){if(o.st!='tired'){throwBoom(q[0],q[1],()=>{SFX.no();part(q[0],q[1],8,'#fff',300,.4,0)});say('b2t');return true}if(o.lit>i)return true;if(i!=o.lit){say('b2h');return true}
    throwBoom(q[0],q[1],()=>{if(o.lit!=i)return;o.lit++;SFX.light(o.lit);say('n'+o.lit);part(q[0],q[1],20,'#fff3a0',300,.7,0);if(o.lit==2)say('b2h2')});return true}}
  const g=EX.pyr.tipGround(o);if(o.tip=='ground'&&Math.hypot(wx-g[0],wy-(g[1]-30))<90){if(o.lit<2||o.st!='tired'){SFX.no();say(o.st!='tired'?'b2t':'b2h');return true}throwBoom(g[0],g[1]-30,()=>{if(o.tip=='ground'){o.tip='fly';o.tf=0;SFX.form('kite')}});return true}
  return false},
 hint(o){if(o.st=='tired'){const q=o.lit<2?EX.pyr.pts(o)[o.lit]:EX.pyr.tipGround(o);HAND={x:q[0],y:q[1]-(o.lit<2?0:30),t:0,k:'tap'};say(o.lit<2?'b2h':'b2h2')}else say('b2t');return true},
 bot(o,dt){const p=P;G.bt=(G.bt||0)+dt;let tx=Math.min(o.x-EX.pyr.dims(o)*.6,3*T);for(const r of o.rocks)if(Math.abs(r.x-tx)<110)tx=r.x<o.x-500?r.x+230:r.x-230;tx=clamp(tx,60,o.x-EX.pyr.dims(o)*.5);WX.go(tx,20);BOT.j=0;
  if(o.st=='tired'&&G.bt>.8&&!BOOM.length){G.bt=0;const q=o.lit<2?EX.pyr.pts(o)[o.lit]:EX.pyr.tipGround(o);WX.bt(q[0],q[1]-(o.lit<2?0:30))}return true},
 draw(o){const w=EX.pyr.dims(o);for(const r of o.rocks){const k=clamp(r.t/.95,0,1);X.save();X.fillStyle='rgba(40,20,10,'+(.18+.3*k)+')';X.beginPath();X.ellipse(r.x,598,18+40*k,7+6*k,0,0,7);X.fill();X.restore();if(r.t>.95){X.save();X.translate(r.x,r.y);X.rotate(r.t*6);X.fillStyle='#8f7454';X.strokeStyle='#4f3a26';X.lineWidth=5;X.beginPath();for(let k=0;k<7;k++){const a=k/7*6.283,rr=34*(.8+.25*Math.sin(k*2.3));X.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}X.closePath();X.fill();X.stroke();X.fillStyle='rgba(255,255,255,.25)';X.beginPath();X.arc(-9,-10,9,0,7);X.fill();X.restore()}}
  const g=EX.pyr.tipGround(o);
  X.save();if(o.st=='tired'){X.translate(o.x,600);X.rotate(Math.sin(o.t*1.5)*.025);X.translate(-o.x,-600)}img('lineup_1',o.x,600+o.hy,o.h);X.restore();
  // верхушка
  let tp=null;if(o.tip=='ground')tp=[g[0],g[1]-28];else{const h=EX.pyr.tipHome(o),a=o.tip=='on'?1:o.tf,s=[g[0],g[1]-28],e=[h[0],h[1]-26];tp=[lerp(s[0],e[0],a),lerp(s[1],e[1],a)-Math.sin(a*Math.PI)*180]}
  {const th=.30*o.h,hw=.12*w;X.save();X.translate(tp[0],tp[1]);if(o.tip=='fly')X.rotate((1-o.tf)*6);const gl=o.tip=='ground'&&o.st=='tired'&&o.lit>=2;X.shadowColor='#fff3a0';X.shadowBlur=gl?30+10*Math.sin(G.t*6):0;
   const gr=X.createLinearGradient(0,-th*.6,0,th*.4);gr.addColorStop(0,'#f1cf7c');gr.addColorStop(1,'#b8842f');X.fillStyle=gr;X.strokeStyle='#6d4a17';X.lineWidth=4;X.beginPath();X.moveTo(0,-th*.62);X.lineTo(hw,th*.38);X.lineTo(-hw,th*.38);X.closePath();X.fill();X.stroke();X.restore()}
  if(o.st!='calm'){const pts=EX.pyr.pts(o);pts.forEach((q,i)=>{const lit=o.lit>i;X.save();X.shadowColor='#fff3a0';X.shadowBlur=lit?30:o.st=='tired'?18:0;X.fillStyle=lit?'#ffe36b':o.st=='tired'?'rgba(150,110,220,'+(.6+.3*Math.sin(G.t*6+i))+')':'rgba(120,100,140,.35)';X.beginPath();X.arc(q[0],q[1],lit?26:o.st=='tired'?24:16,0,7);X.fill();X.lineWidth=4;X.strokeStyle='#fff';X.stroke();X.restore()})}
  if(o.st=='tired'){for(let i=0;i<3;i++){const a=(G.t*1.4+i/3)%1;X.save();X.globalAlpha=1-a;X.fillStyle='#9fdcff';X.beginPath();X.ellipse(o.x-w*.25+i*w*.25,600-o.h*.7+a*60,6,10,0,0,7);X.fill();X.restore()}}
  txt(o.lit+' из 3',o.x-w*.5-70,600-o.h+40,44,'#fff3a0')}};
WX.add(()=>{
LV['2-1']=()=>{const b=new LB(175,'2-1');b.meta={name:'2-1 Ветреный перевал',intro:['w2','l21'],forms:[]};
 b.g(0,26).e('stone',20,10,{shape:'tri',give:'kite'}).g(34,52).g(60,74).g(74,98,4).g(98,118).g(126,150).g(150,151,9).g(151,175);
 b.e('wind',72,10,{w:2,k:'t_wind'}).pl(84,2,3).pl(108,7,3).pl(140,6,3);
 b.coins(27,7,6,'coin_tri',2).coins(53,7,6,'coin_tri',2).coins(118,7,7,'coin_tri',2).coins(86,1,2,'coin_tri',0);
 b.e('enemy',44,10).e('enemy',66,10).e('enemy',92,4).e('enemy',112,10).e('enemy',135,10).e('enemy',160,10);
 b.e('star',30,5).e('star',85,1).e('star',141,5).e('goal',169,10);
 [5,40,64,104,130,158].forEach((x,i)=>b.d(i%2?'bush':'sign',x,x>=74&&x<98?4:10,.9));return b};
LV['2-2']=()=>{const b=new LB(165,'2-2');b.meta={name:'2-2 Три стороны',intro:['l22'],forms:['kite']};
 b.g(0,42).g(62,96).g(104,165).e('sides',24,10,{bx:[20,24,28],c0:42,c1:62});
 b.pl(70,7,3).pl(118,7,4).bl(132,6,2,3);
 b.coins(6,8,5,'coin_tri',1).coins(44,8,14,'coin_tri',0).coins(96,7,8,'coin_tri',2);
 b.e('enemy',36,10).e('enemy',78,10).e('enemy',90,10).e('enemy',112,10).e('enemy',128,10).e('enemy',145,10);
 b.e('star',24,4).e('star',52,8).e('star',119,6).e('goal',159,10);
 [8,34,66,100,126,152].forEach((x,i)=>b.d(i%2?'bush':'sign',x,10,.9));return b};
LV['2-3']=()=>{const b=new LB(175,'2-3');b.meta={name:'2-3 Треугольные ворота',intro:['l23'],forms:['kite']};
 b.g(0,60).e('odd',38,10,{n:4,kind:'tri'}).g(66,101).col(84,0,5,1).col(84,6,9,10).e('tip',76,10,{k:'t_tgate',when:76}).g(107,175).col(130,0,5,1).col(130,6,9,10).col(152,0,5,1).col(152,6,9,10);
 b.pl(70,7,3).pl(118,6,3).pl(140,7,3).e('wind',103,10,{w:3,k:0});
 b.coins(8,8,5,'coin_tri',1).coins(60,7,6,'coin_tri',2).coins(100,7,8,'coin_tri',2).coins(155,8,6,'coin_tri',1);
 b.e('enemy',20,10).e('enemy',52,10).e('enemy',91,10).e('enemy',122,10).e('enemy',145,10).e('enemy',163,10);
 b.e('star',71,6).e('star',104,5).e('star',141,6).e('goal',170,10);
 [6,28,70,112,138,165].forEach((x,i)=>b.d(i%2?'bush':'sign',x,10,.9));return b};
LV['2-4']=()=>{const N=19,w=16+N*8+22;const b=new LB(w,'2-4');b.zoom=1.15;b.gf=.9;b.meta={name:'2-4 Полёт сквозь горы',intro:['l24','t_fly'],forms:[],fly:300,noFM:1};
 b.g(0,w);b.start={x:3,y:9};const GC=[330,420,280,460,360,250,430,320,470,300,400,260,440,350,290,460,380,270,410];
 GC.forEach((gc,i)=>{const x=16+i*8;const both=i%3!=1;if(both||gc<360)b.e('spire',x,10,{up:1,tip:gc+(both?120:115),w:210,gc});if(both||gc>=360)b.e('spire',x,10,{up:0,tip:gc-(both?120:115),w:210,gc});b.coins(x,0,1,'coin_tri');b.ents[b.ents.length-1].y=gc+20;if(i==4||i==10||i==16){b.e('star',x+4,0);b.ents[b.ents.length-1].y=(gc+GC[i+1])/2+10}});
 b.e('goal',w-8,10);return b};
LV['2-B']=()=>{const n=bossN();const b=new LB(n,'2-B');b.zoom=1.38;b.meta={name:'Босс: Пирамида',intro:['b2a','b2t'],forms:[],boss:'pyr'};b.g(0,n).col(0,0,9,1).col(n-1,0,9,1);b.start={x:1,y:9};b.e('pyr',n-4,10);return b};
});
})();
