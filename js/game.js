'use strict';
// ===== Тася Треуголка и Радужный Маяк — движок =====
const C=document.getElementById('c'),X=C.getContext('2d');
const Q=new URLSearchParams(location.search);
const H=720,T=60,STEP=1/120;let W=1280,SC=1,DPR=1;
const G={scene:'title',t:0,fps:60,errors:[],bot:Q.has('bot'),log:[]};window.G=G;
window.addEventListener('error',e=>G.errors.push(String(e.message)));
function resize(){DPR=Math.min(2,devicePixelRatio||1);const w=innerWidth,h=innerHeight;C.width=Math.round(w*DPR);C.height=Math.round(h*DPR);SC=C.height/H;W=C.width/SC;}
addEventListener('resize',resize);resize();
let seed=+(Q.get('seed')||Date.now()%100000);function rnd(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
const pick=a=>a[Math.floor(rnd()*a.length)],shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;
// ---- картинки
const IMG={};const LIST='t_idle t_blink t_jump t_fall t_hurt t_run0 t_run1 t_run2 t_run3 fm0 fm1 fm2 fm3 ground e_wheel stone plank sign bush block kuv heart coin_tri coin_circ star btn_jump btn_form btn_arrow tile_top tile_dirt oskolok_0 oskolok_3 lineup_1 lineup_2 crab_0 owl_0'.split(' ');
let loaded=0;for(const n of LIST){const i=new Image();i.onload=()=>loaded++;i.src='assets/img/'+n+'.png?v='+V;IMG[n]=i}
for(const n of ['bg_w1','map']){const i=new Image();i.onload=()=>loaded++;i.src='assets/img/'+n+'.jpg?v='+V;IMG[n]=i}
const TOTAL=LIST.length+2;
// ---- звук
let AC=null,MG=null;function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.5;MG.connect(AC.destination)}catch(e){}}if(AC&&AC.state=='suspended')AC.resume();return AC}
function tone(f,d,type='sine',v=.2,f2,delay=0){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+delay;o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(MG);o.start(t);o.stop(t+d+.02)}
function noise(d,v=.2,fr=800){const a=ac();if(!a)return;const b=a.createBuffer(1,a.sampleRate*d,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=(Math.random()*2-1)*(1-i/c.length);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();f.type='lowpass';f.frequency.value=fr;g.gain.value=v;s.buffer=b;s.connect(f);f.connect(g);g.connect(MG);s.start()}
const SFX={jump:()=>tone(420,.16,'square',.07,820),land:()=>noise(.08,.12,500),coin:()=>{tone(988,.08,'triangle',.15);tone(1319,.18,'triangle',.15,0,.07)},
 bump:()=>{tone(180,.1,'square',.12,90);noise(.06,.1,1500)},stomp:()=>{tone(300,.15,'square',.12,80)},hurt:()=>tone(500,.3,'sawtooth',.08,150),
 crash:()=>{noise(.35,.3,900);tone(120,.3,'square',.1,50)},boom:()=>tone(700,.25,'triangle',.08,1400),
 light:n=>{tone(523*Math.pow(1.122,n),.3,'triangle',.18)},win:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.3,'triangle',.16,0,i*.12))},
 no:()=>tone(220,.25,'sine',.12,180),star:()=>{[784,988,1175,1568].forEach((f,i)=>tone(f,.25,'sine',.14,0,i*.07))},
 form:k=>{const F=FORMS[k];F&&F.snd()}};
let music=null;function musicStart(){const a=ac();if(!a||music)return;music={t:a.currentTime+.1,i:0};}
const MEL=[[0,2],[4,1],[7,1],[9,2],[7,2],[4,2],[5,1],[4,1],[2,2],[0,2],[2,1],[4,1],[7,2],[4,2],[2,4]];
function musicTick(){if(!music||!AC)return;const base=G.scene=='boss'?220:262;while(music.t<AC.currentTime+.4){const [n,d]=MEL[music.i%MEL.length];const f=base*Math.pow(2,n/12),len=d*.22;
 tone(f,len*.9,'triangle',.035,0,music.t-AC.currentTime);if(music.i%2==0)tone(base/2*Math.pow(2,[0,5,7,0][(music.i/4|0)%4]/12),.4,'sine',.05,0,music.t-AC.currentTime);music.t+=len;music.i++}}
// ---- голос: очередь, реплики не обрываются
const VQ=[];let vcur=null,vEnd=0;const vplayed={};
function say(k,force){if(!VOICE[k]){G.log.push('novoice '+k);return}if(VQ.includes(k)||(vcur&&vcur.k==k))return;VQ.push(k)}
function voiceTick(){if(vcur&&!vcur.a.ended&&!vcur.a.paused)return;if(vcur&&vcur.a.ended)vcur=null;if(vcur&&performance.now()>vcur.until)vcur=null;if(vcur)return;const k=VQ.shift();if(!k)return;
 const a=new Audio('assets/voice/'+VOICE[k][0]);a.play().catch(()=>{});vcur={k,a,until:performance.now()+VOICE[k][1]*1000+1500};SUB={k,t:G.t,d:VOICE[k][1]}}
let SUB=null;const TXT={};
function speaking(){return !!vcur||VQ.length>0}
// ---- ввод
const KEY={},TOUCH={};let taps=[];const BTN={};
addEventListener('keydown',e=>{KEY[e.code]=1;ac();if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault()});addEventListener('keyup',e=>KEY[e.code]=0);
function btnLayout(){const s=Math.min(150,H*.2),m=30;BTN.left={x:m+s/2,y:H-m-s/2,r:s/2};BTN.right={x:m+s*1.6,y:H-m-s/2,r:s/2};
 BTN.jump={x:W-m-s/2-10,y:H-m-s/2,r:s*.58};BTN.form={x:W-m-s*1.75,y:H-m-s*.45,r:s*.46};}
const ptrs={};
function evp(e){return {x:e.clientX*DPR/SC,y:e.clientY*DPR/SC}}
function hitBtn(p){btnLayout();for(const k in BTN){const b=BTN[k];if(Math.hypot(p.x-b.x,p.y-b.y)<b.r*1.25)return k}return null}
C.addEventListener('pointerdown',e=>{ac();musicStart();fs();const p=evp(e);const b=G.scene=='play'?hitBtn(p):null;ptrs[e.pointerId]=b;if(b)TOUCH[b]=1;else taps.push(p);e.preventDefault()});
C.addEventListener('pointermove',e=>{if(!(e.pointerId in ptrs))return;const p=evp(e),b=G.scene=='play'?hitBtn(p):null,o=ptrs[e.pointerId];if(o&&b!==o&&(o=='left'||o=='right')){TOUCH[o]=0;if(b=='left'||b=='right'){TOUCH[b]=1;ptrs[e.pointerId]=b}}});
function up(e){const b=ptrs[e.pointerId];if(b)TOUCH[b]=0;delete ptrs[e.pointerId]}
C.addEventListener('pointerup',up);C.addEventListener('pointercancel',up);
function fs(){if(G.bot||document.fullscreenElement)return;const d=document.documentElement;try{(d.requestFullscreen||d.webkitRequestFullscreen).call(d).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})).catch(()=>{})}catch(e){}}
const BOT={};const inp=()=>({l:KEY.ArrowLeft||KEY.KeyA||TOUCH.left||BOT.l,r:KEY.ArrowRight||KEY.KeyD||TOUCH.right||BOT.r,j:KEY.Space||KEY.ArrowUp||KEY.KeyW||TOUCH.jump||BOT.j,f:KEY.KeyX||KEY.ShiftLeft||TOUCH.form||BOT.f});
// ---- сохранение
const SAVE=Object.assign({done:{},stars:{},shards:0,forms:['girl']},JSON.parse(localStorage.getItem('t59save')||'{}'));
function save(){try{localStorage.setItem('t59save',JSON.stringify(SAVE))}catch(e){}}
// ---- формы
const FORMS={
 girl:{name:'Тася',w:54,h:150,acc:2600,dec:3200,max:430,jump:1080,g:2900,col:'#ff5a4e',snd:()=>tone(660,.2,'triangle',.1,990)},
 wheel:{name:'Огненное Колесо',corners:0,shape:'circle',w:104,h:104,acc:1500,dec:900,max:720,jump:900,g:2900,col:'#ff8a1f',say:'«Вжжух!»',snd:()=>{noise(.4,.2,2500);tone(200,.4,'sawtooth',.06,900)}},
 kite:{name:'Небесный Змей',corners:3,shape:'tri',w:110,h:96,acc:2200,dec:2400,max:460,jump:950,g:2900,glide:170,col:'#5ec8ff',say:'«Фьюить!»',snd:()=>tone(1200,.35,'sine',.12,2400)},
 cube:{name:'Изумрудный Кубик',corners:4,shape:'sq',w:100,h:100,acc:1800,dec:3600,max:330,jump:820,g:3600,col:'#35c46a',say:'«БУМ!»',snd:()=>{tone(90,.4,'square',.15,40);noise(.3,.3,400)}},
 board:{name:'Ледяная Доска',corners:4,shape:'rect',w:150,h:46,acc:1400,dec:300,max:800,jump:850,g:2900,col:'#a6e7ff',say:'«Шшшух!»',snd:()=>noise(.5,.15,4000)},
 shield:{name:'Звёздный Щит',corners:5,shape:'pent',w:100,h:100,acc:2200,dec:3000,max:400,jump:950,g:2900,col:'#ffcc33',say:'«Дзынь!»',snd:()=>{tone(1568,.5,'triangle',.12);tone(2093,.5,'triangle',.08)}},
 hex:{name:'Медовая Сотка',corners:6,shape:'hex',w:100,h:100,acc:2200,dec:3000,max:380,jump:950,g:2900,climb:1,col:'#ffa726',say:'«Чпок!»',snd:()=>tone(400,.12,'sine',.2,1200)},
 bubble:{name:'Лиловый Пузырь',corners:0,shape:'oval',w:96,h:120,acc:1300,dec:900,max:330,jump:420,g:520,float:1,col:'#c58cff',say:'«Плюм!»',snd:()=>{tone(300,.3,'sine',.18,900)}}};
// ---- уровень (тайлы)
// 0 пусто 1 земля 2 доска(односторонняя) 3 блок-сторона 4 треснувшая стена 5 склон / 6 склон \ 7 круглые ворота 8 овальные ворота 9 пустой блок
let L=null;
function tileAt(tx,ty){if(!L||tx<0||tx>=L.w)return 1;if(ty<0)return 0;if(ty>=L.h)return 0;return L.m[ty*L.w+tx]}
function setT(tx,ty,v){if(tx>=0&&tx<L.w&&ty>=0&&ty<L.h)L.m[ty*L.w+tx]=v}
function solidFor(v,p,dir){if(v==1||v==3||v==9)return true;if(v==4)return true;if(v==7)return p.form!='wheel';if(v==8)return p.form!='bubble';return false}
class LB{ // строитель уровня
 constructor(w,id){this.id=id;this.w=w;this.h=12;this.m=new Array(w*12).fill(0);this.ents=[];this.deco=[];this.gy=10;this.task=[];this.start={x:6,y:9}}
 g(x0,x1,top=10){for(let x=x0;x<x1;x++)for(let y=top;y<12;y++)this.m[y*this.w+x]=1;return this}
 pl(x,y,w){for(let i=0;i<w;i++)this.m[y*this.w+x+i]=2;return this}
 bl(x,y,w=1,v=3){for(let i=0;i<w;i++)this.m[y*this.w+x+i]=v;return this}
 col(x,y0,y1,v){for(let y=y0;y<=y1;y++)this.m[y*this.w+x]=v;return this}
 up(x,top,n){for(let i=0;i<n;i++){this.m[(top-1-i)*this.w+x+i]=5;for(let y=top-i;y<12;y++)this.m[y*this.w+x+i]=1}this.g(x+n,x+n+1,top-n);return this}
 dn(x,top,n){for(let i=0;i<n;i++){this.m[(top-n+i)*this.w+x+i]=6;for(let y=top-n+i+1;y<12;y++)this.m[y*this.w+x+i]=1}return this}
 e(type,x,y,o={}){this.ents.push(Object.assign({type,x:x*T+T/2,y:y*T},o));return this}
 d(img,x,y,s=1,par=1){this.deco.push({img,x:x*T,y:y*T,s,par});return this}
 coins(x,y,n,kind='coin_circ',dy=0){for(let i=0;i<n;i++)this.e('coin',x+i,y-Math.round(Math.sin(i/(n-1||1)*Math.PI)*dy),{kind});return this}
}
function mkLevel(lb){const l={id:lb.id,w:lb.w,h:12,m:lb.m.slice(),deco:lb.deco,ents:[],start:lb.start,meta:lb.meta||{}};return [l,lb.ents]}
// ---- сущности
let P=null,FM=null,ENTS=[],PART=[],CAM={x:0,y:0,shake:0},HUD={shards:0,stars:0,hearts:3},TASK=null,HAND=null,IDLE=0,FLASH=0,BANNER=null;
function part(x,y,n,col,sp=300,life=.7,g=600,sz=8){for(let i=0;i<n;i++){const a=rnd()*Math.PI*2,v=sp*(.3+rnd()*.7);PART.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.3,life,l0:life,col,g,sz:sz*(.5+rnd())})}}
function shake(v){CAM.shake=Math.max(CAM.shake,v)}
function newPlayer(x,y){return {x,y,vx:0,vy:0,form:'girl',face:1,ground:false,coy:0,buf:0,jh:0,inv:0,land:0,blink:0,run:0,hurt:0,safe:{x,y},lastJ:0,lastF:0,idle:0,air:0,glid:0}}
function dims(p){const F=FORMS[p.form];return [F.w,F.h]}
// столкновения: ось X затем Y, шаг 1/120
function moveP(p,dt){const F=FORMS[p.form],[w,h]=dims(p);const I=G.inputLock?{}:inp();
 let ax=0;if(I.l)ax-=1;if(I.r)ax+=1;
 if(G.auto){ax=G.auto.dir}
 if(ax){p.vx+=ax*F.acc*dt*(Math.sign(p.vx)!=ax&&p.vx?1.8:1);p.face=ax}else{const d=F.dec*dt;p.vx=Math.abs(p.vx)<d?0:p.vx-Math.sign(p.vx)*d}
 const mx=F.max*(G.auto?G.auto.boost||1:1);p.vx=clamp(p.vx,-mx,mx);
 // прыжок: буфер+койот+высота от удержания
 if(I.j&&!p.lastJ)p.buf=.14;p.lastJ=I.j;p.buf-=dt;p.coy-=dt;
 if(p.buf>0&&(p.coy>0||F.float)){if(F.float){p.vy=-F.jump;}else{p.vy=-F.jump;SFX.jump();part(p.x,p.y,6,'#fff',120,.4,200,6)}p.buf=0;p.coy=0;p.jh=.2;p.ground=false}
 let g=F.g;if(F.float){g=I.j?-700:F.g}else if(p.vy<0&&!I.j)g*=2.6;else if(p.vy<0&&I.j&&p.jh>0)g*=.8;p.jh-=dt;
 if(F.glide&&p.vy>F.glide&&I.j){p.vy=F.glide;p.glid=1}
 p.vy+=g*dt;p.vy=clamp(p.vy,F.float?-420:-2000,F.float?300:1500);
 // X
 p.x+=p.vx*dt;const hx=w/2;
 for(const side of [-1,1]){const ex=p.x+side*hx;const tx=Math.floor(ex/T);
  for(let ty=Math.floor((p.y-h+2)/T);ty<=Math.floor((p.y-6)/T);ty++){const v=tileAt(tx,ty);
   if(v==4&&p.form=='wheel'&&Math.abs(p.vx)>250){breakWall(tx,ty);continue}
   if(solidFor(v,p)&&!(v==5||v==6)){if(side>0&&p.vx>0){p.x=tx*T-hx-.01;p.vx=0;p.wall=1}else if(side<0&&p.vx<0){p.x=(tx+1)*T+hx+.01;p.vx=0;p.wall=-1}}}}
 // Y
 const oy=p.y;p.y+=p.vy*dt;const was=p.ground;p.ground=false;
 const x0=Math.floor((p.x-hx+3)/T),x1=Math.floor((p.x+hx-3)/T);
 if(p.vy>=0){const ty=Math.floor(p.y/T);for(let tx=x0;tx<=x1;tx++){const v=tileAt(tx,ty);const top=ty*T;
   if((solidFor(v,p)&&v!=5&&v!=6)||(v==2&&oy<=top+1)){if(oy<=top+Math.max(8,p.vy*dt+2)||solidFor(v,p)){if(tileAt(tx,ty-1)==0||v==2||!solidFor(tileAt(tx,ty-1),p)){p.y=top;p.vy=0;p.ground=true}}}}}
 else{const ty=Math.floor((p.y-h)/T);for(let tx=x0;tx<=x1;tx++){const v=tileAt(tx,ty);if(solidFor(v,p)&&v!=5&&v!=6){p.y=(ty+1)*T+h;p.vy=0;bump(tx,ty);break}}}
 // склоны: точка под центром
 {const tx=Math.floor(p.x/T);for(const ty of [Math.floor((p.y-1)/T),Math.floor((p.y+ (was?T/2:2))/T)]){const v=tileAt(tx,ty);if(v==5||v==6){const lx=p.x-tx*T;const sy=ty*T+(v==5?T-lx:lx);if(p.y>=sy-(was?T/2:0)&&p.vy>=0&&p.y<=sy+T){p.y=sy;p.vy=0;p.ground=true;break}}}}
 if(p.ground){if(!was&&p.air>.18){p.land=.12;SFX.land();part(p.x,p.y,8,'#e8f5c8',160,.4,300,6);if(p.form=='cube'){shake(10);stompWave(p)}}p.coy=.1;p.air=0;p.glid=0;if(rnd()<.05)p.safe={x:p.x,y:p.y}}else p.air+=dt;
 if(p.y>L.h*T+200)fallCatch(p);
 if(p.x<hx)p.x=hx,p.vx=Math.max(0,p.vx);if(p.x>L.w*T-hx)p.x=L.w*T-hx;
}
function breakWall(tx,ty){for(let y=0;y<12;y++)if(tileAt(tx,y)==4){setT(tx,y,0);part(tx*T+30,y*T+30,10,'#9a8b78',500,.9,1400,12)}SFX.crash();shake(14);say('r_good2')}
function bump(tx,ty){const v=tileAt(tx,ty);SFX.bump();if(v==3){setT(tx,ty,9);const e=ENTS.find(e=>e.type=='coin'&&false);spawnShard(tx*T+30,ty*T-20);part(tx*T+30,ty*T,12,'#ffe36b',300,.6);L.bumps=(L.bumps||0)+1;onBump&&onBump(tx,ty)}}
let onBump=null;
function spawnShard(x,y){ENTS.push({type:'coin',x,y,vy:-600,fly:1,kind:L.id[0]=='1'?'coin_circ':'coin_tri'})}
function stompWave(p){for(const e of ENTS)if(e.type=='enemy'&&Math.abs(e.x-p.x)<300&&Math.abs(e.y-p.y)<80)killEnemy(e)}
function fallCatch(p){p.x=p.safe.x;p.y=p.safe.y-10;p.vx=0;p.vy=0;FM.x=p.x;FM.y=p.y-200;FM.catch=1;say('r_oops');part(p.x,p.y-80,20,'#fff7c0',300,.8,0);if(G.auto)G.auto.rewind=1}
function hurt(p,from){if(p.inv>0)return;HUD.hearts--;p.inv=1.6;p.hurt=.4;p.vx=(p.x<from?-1:1)*500;p.vy=-600;SFX.hurt();shake(8);if(HUD.hearts<=0){HUD.hearts=3;fallCatch(p)}}
function killEnemy(e){e.dead=1;SFX.stomp();part(e.x,e.y-40,14,'#c08a50',350,.7);HUD.shards++}
function transform(p){const fs=L.forms||[];const order=['girl',...fs];let i=order.indexOf(p.form);const nx=order[(i+1)%order.length];if(nx==p.form)return;
 const [w0,h0]=dims(p);p.form=nx;const [w1,h1]=dims(p);
 // не застрять: проверить место
 for(let ty=Math.floor((p.y-h1)/T);ty<=Math.floor((p.y-2)/T);ty++)for(let tx=Math.floor((p.x-w1/2)/T);tx<=Math.floor((p.x+w1/2)/T);tx++)if(solidFor(tileAt(tx,ty),p)&&tileAt(tx,ty)!=5&&tileAt(tx,ty)!=6){p.form=order[i];return}
 SFX.form(nx);part(p.x,p.y-h1/2,26,(FORMS[nx]||FORMS.girl).col,420,.8,0,10);shake(4);FLASH=.15;BANNER={t:1.6,txt:nx=='girl'?'Тася!':FORMS[nx].name+' '+(FORMS[nx].say||'')}}
// ---- фигуры (рисование)
function shapePts(shape,cx,cy,r,rot=0){const P=[];const reg=(n,a0)=>{for(let i=0;i<n;i++){const a=a0+rot+i*Math.PI*2/n;P.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}};
 if(shape=='tri')reg(3,-Math.PI/2);else if(shape=='sq')reg(4,-Math.PI/4);else if(shape=='pent')reg(5,-Math.PI/2);else if(shape=='hex')reg(6,0);
 else if(shape=='rect'){P.push([cx-r*1.4,cy-r*.6],[cx+r*1.4,cy-r*.6],[cx+r*1.4,cy+r*.6],[cx-r*1.4,cy+r*.6])}return P}
function pathShape(shape,cx,cy,r,rot=0){X.beginPath();if(shape=='circle')X.arc(cx,cy,r,0,7);else if(shape=='oval')X.ellipse(cx,cy,r*.72,r,0,0,7);else{const p=shapePts(shape,cx,cy,r,rot);p.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath()}}
function paintShape(shape,cx,cy,r,col,rot=0,face=true,glow=0){X.save();if(glow){X.shadowColor=col;X.shadowBlur=glow}
 const g=X.createRadialGradient(cx-r*.3,cy-r*.4,r*.1,cx,cy,r*1.2);g.addColorStop(0,'#fff');g.addColorStop(.25,col);g.addColorStop(1,shade(col,-.45));
 pathShape(shape,cx,cy,r,rot);X.fillStyle=g;X.fill();X.shadowBlur=0;X.lineWidth=r*.09;X.strokeStyle=shade(col,-.6);X.stroke();
 if(face){const e=r*.16;X.fillStyle='#2b1a10';const bl=(G.t%3.3)<.12;for(const s of[-1,1]){X.beginPath();if(bl)X.fillRect(cx+s*r*.28-e,cy-r*.08,e*2,e*.4);else X.ellipse(cx+s*r*.28,cy-r*.08,e*.8,e,0,0,7);X.fill();if(!bl){X.fillStyle='#fff';X.beginPath();X.arc(cx+s*r*.28-e*.25,cy-r*.08-e*.35,e*.32,0,7);X.fill();X.fillStyle='#2b1a10'}}
  X.beginPath();X.arc(cx,cy+r*.2,r*.22,.15*Math.PI,.85*Math.PI);X.lineWidth=r*.07;X.stroke();X.fillStyle='rgba(255,120,120,.45)';for(const s of[-1,1]){X.beginPath();X.arc(cx+s*r*.5,cy+r*.15,r*.11,0,7);X.fill()}}
 X.restore()}
function shade(hex,k){let n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const f=k<0?0:255,a=Math.abs(k);r=Math.round(r+(f-r)*a);g=Math.round(g+(f-g)*a);b=Math.round(b+(f-b)*a);return `rgb(${r},${g},${b})`}
function txt(s,x,y,sz,col='#fff',al='center',stroke='#3a1d55',font='Lobster'){X.font=`${sz}px ${font},cursive`;X.textAlign=al;X.textBaseline='middle';X.lineJoin='round';X.lineWidth=sz*.18;X.strokeStyle=stroke;X.strokeText(s,x,y);X.fillStyle=col;X.fillText(s,x,y)}
function img(n,x,y,h,flip=0,al=1,ax=.5,ay=1){const i=IMG[n];if(!i||!i.width)return;const w=i.width*h/i.height;X.save();X.globalAlpha*=al;X.translate(x,y);if(flip)X.scale(-1,1);X.drawImage(i,-w*ax,-h*ay,w,h);X.restore()}
function hand(x,y,t,press){// светящаяся ладошка-подсказка
 X.save();X.translate(x,y);const s=1+(press?.0:Math.sin(t*6)*.05);X.scale(s,s);X.shadowColor='#fff6b0';X.shadowBlur=30;X.fillStyle='rgba(255,240,200,.95)';X.strokeStyle='#8a5a2b';X.lineWidth=4;
 X.beginPath();X.ellipse(0,40,30,34,0,0,7);X.fill();X.stroke();for(let i=0;i<4;i++){X.beginPath();X.ellipse(-22+i*15,i==1?-8:0,7,i==1?42:34,0,0,7);X.fill();X.stroke()}X.beginPath();X.ellipse(-34,30,20,9,-.7,0,7);X.fill();X.stroke();X.restore();
 if(press){X.strokeStyle='rgba(255,255,255,'+(1-press)+')';X.lineWidth=6;X.beginPath();X.arc(x-7,y-30,20+press*50,0,7);X.stroke()}}
// ---- уровни
const LV={};
LV['1-1']=()=>{const b=new LB(150,'1-1');b.meta={name:'1-1 Первые шаги',intro:['w1','t_move'],forms:[]};
 b.g(0,26).g(29,48).up(48,10,2).g(51,62,8).dn(62,10,2).g(64,80).g(84,100).g(103,150);
 b.pl(18,7,3).bl(36,6,3,3).pl(56,5,3).bl(71,6,1,3).bl(73,6,1,3).pl(90,7,4).bl(108,6,3,3);
 b.coins(12,8,4,'coin_circ',1).coins(26,7,3,'coin_circ',1).coins(80,7,4,'coin_circ',2).coins(100,7,3,'coin_circ',1);
 b.e('enemy',40,10).e('enemy',68,10).e('enemy',92,10).e('enemy',112,10).e('star',57,4).e('star',91,6).e('star',120,7);
 b.e('stone',132,10,{shape:'circle',give:'wheel'}).e('goal',146,10);
 b.e('tip',8,10,{k:'t_stomp',when:38}).e('tip',30,10,{k:'t_bump',when:33}).e('tip',128,10,{k:'l11',when:124});
 [6,22,45,77,97,118,140].forEach((x,i)=>b.d(i%2?'bush':'sign',x,10,i%2?1:.9));return b};
LV['1-2']=()=>{const b=new LB(170,'1-2');b.meta={name:'1-2 Круглые ворота',intro:['l12'],forms:['wheel'],startForm:'wheel'};
 b.g(0,30).col(22,6,9,4).g(33,60).col(45,5,9,7).g(60,61,9).up(61,10,1).g(62,90,9).col(75,4,8,4).dn(90,9,1).g(91,120).col(100,6,9,4).col(101,6,9,4).g(124,170);
 b.pl(36,6,4).bl(52,6,3,3).pl(110,6,3).bl(130,6,2,3).col(140,5,9,7);
 b.coins(8,8,5,'coin_circ',1).coins(64,7,6,'coin_circ',2).coins(124,8,5,'coin_circ',1);
 b.e('enemy',30,10).e('enemy',56,10).e('enemy',85,9).e('enemy',115,10).e('enemy',135,10).e('star',37,5).e('star',111,5).e('star',150,7);
 b.e('tip',18,10,{k:'t_wheel',when:16}).e('tip',40,10,{k:'t_gate',when:42}).e('goal',164,10);
 [5,28,58,95,128,155].forEach((x,i)=>b.d(i%2?'bush':'sign',x,i==3?10:10,.9));return b};
LV['1-3']=()=>{const b=new LB(170,'1-3');b.meta={name:'1-3 Круг или овал',intro:['l13'],forms:['wheel']};
 b.g(0,40).g(43,70).g(74,110).g(113,170);
 b.pl(24,7,3).bl(60,6,3,3).pl(88,7,3);
 b.coins(8,8,4).coins(44,8,6,'coin_circ',1).coins(118,8,5);
 b.e('enemy',34,10).e('enemy',64,10).e('enemy',100,10).e('enemy',128,10).e('star',25,6).e('star',89,6).e('star',145,7);
 b.e('odd',52,10,{n:4,kind:'oval'}).e('stone',82,10,{shape:'oval',give:'bubble'}).col(98,1,9,8).g(99,110,10).col(110,3,9,1).col(111,3,9,1).col(112,3,9,1).g(110,113,3);
 b.e('tip',95,10,{k:'t_oval',when:93}).e('odd',140,10,{n:5,kind:'circle'}).e('goal',164,10);
 [6,30,72,120,155].forEach((x,i)=>b.d(i%2?'bush':'sign',x,10,.9));return b};
LV['1-4']=()=>{const b=new LB(220,'1-4');b.meta={name:'1-4 Бегство от валуна',intro:['l14'],forms:['wheel'],startForm:'wheel',chase:1};
 b.g(0,40).g(43,70).up(70,10,2).g(73,90,8).dn(90,10,2).g(92,120).g(124,150).col(135,5,9,4).g(150,151,9).up(151,10,1).g(152,175,9).dn(175,9,1).g(176,220);
 b.pl(100,7,3).pl(160,6,3);b.coins(20,8,8,'coin_circ',1).coins(95,8,8,'coin_circ',2).coins(178,8,8,'coin_circ',1);
 b.e('star',101,6).e('star',161,5).e('star',200,7).e('goal',214,10);return b};
LV['1-B']=()=>{const b=new LB(34,'1-B');b.meta={name:'Босс: Кувырок',intro:['b1a','b1b'],forms:['wheel'],boss:'kuv'};b.g(0,34).col(0,0,9,1).col(33,0,9,1);b.pl(6,6,4).pl(24,6,4);b.start={x:4,y:9};b.e('kuv',22,10);return b};
const ORDER=['1-1','1-2','1-3','1-4','1-B'];
// ---- загрузка уровня
function loadLevel(id){const b=LV[id]();seed=+(Q.get('seed')||((Date.now()/1000|0)%100000));const [l,ents]=mkLevel(b);L=l;L.forms=b.meta.forms.slice();L.meta=b.meta;
 ENTS=[];PART=[];TASK=null;HAND=null;IDLE=0;HUD={shards:0,stars:0,hearts:3,got:0};
 for(const e of ents){const o=Object.assign({},e);if(o.type=='enemy'){o.vx=-90;o.ph=rnd()*6}if(o.type=='odd')setupOdd(o);if(o.type=='stone')setupStone(o);if(o.type=='kuv')setupKuv(o);ENTS.push(o)}
 P=newPlayer(b.start.x*T,b.start.y*T+T);P.y=10*T;if(b.meta.startForm&&b.meta.startForm!='girl'){P.form=b.meta.startForm}
 FM={x:P.x-80,y:P.y-200,vx:0,vy:0,catch:0};CAM.x=P.x-W*.35;CAM.y=0;G.auto=null;
 if(b.meta.chase)G.boulder={x:-400,v:330};else G.boulder=null;
 G.level=id;G.scene=b.meta.boss?'boss':'play';G.lt=0;G.inputLock=0;G.won=0;for(const k of b.meta.intro)say(k);BANNER={t:3,txt:b.meta.name}}
// ---- задания
function setupStone(o){const n=FORMS[o.give].corners||0;o.n=n;o.lit=0;o.done=0;o.r=95;o.cy=o.y-330;}
function stonePts(o){if(o.shape=='circle'||o.shape=='oval')return [];return shapePts(o.shape,o.x,o.cy,o.r)}
function setupOdd(o){// ряд из n фигур, одна лишняя (варьируется)
 const pairs=o.kind=='oval'?[['circle','oval'],['circle','oval']]:[['oval','circle'],['sq','circle'],['tri','circle']];const [main,odd]=pick(pairs);
 o.items=[];const k=Math.floor(rnd()*o.n);for(let i=0;i<o.n;i++){o.items.push({shape:i==k?odd:main,odd:i==k,x:o.x+(i-(o.n-1)/2)*120,y:o.y-260-((i%2)*50),r:48,hit:0,wob:0,col:pick(['#ff7a59','#5ec8ff','#7ad65a','#ffcc33','#c58cff'])})}
 o.done=0;o.wx=Math.floor(o.x/T)+3;for(let y=2;y<10;y++)setT(o.wx,y,1);o.block=1}
function setupKuv(o){o.hp=8;o.spikes=[];for(let i=0;i<8;i++)o.spikes.push({a:i*Math.PI/4,on:1});o.vx=-260;o.rot=0;o.r=150;o.y=10*T;o.jt=2;o.vy=0;o.state='fight';o.cnt=0}
function tapWorld(p){const wx=p.x+CAM.x,wy=p.y+CAM.y;IDLE=0;
 for(const o of ENTS){if(o.type=='stone'&&!o.done&&Math.abs(P.x-o.x)<420){const pts=stonePts(o);
   if(!pts.length){if(Math.hypot(wx-o.x,wy-o.cy)<o.r*1.5)stoneDone(o);continue}
   for(let i=0;i<pts.length;i++){const q=pts[i];if(Math.hypot(wx-q[0],wy-q[1])<75&&!(o.litMask&(1<<i))){o.litMask=(o.litMask||0)|1<<i;o.lit++;SFX.light(o.lit);say('n'+o.lit);part(q[0],q[1],14,'#fff3a0',260,.6,0);if(o.lit==o.n)setTimeout(()=>stoneDone(o),500);return}}}
  if(o.type=='odd'&&!o.done){for(const it of o.items)if(Math.hypot(wx-it.x,wy-it.y)<it.r*1.4){throwBoom(it.x,it.y,()=>{if(it.odd){it.hit=1;o.done=1;SFX.win();say('r_odd_ok');for(let y=0;y<12;y++)if(tileAt(o.wx,y)==1&&y<10)setT(o.wx,y,0);part(o.wx*T,6*T,30,'#fff',500,.9)}else{it.wob=1;SFX.no();say('r_odd_no')}});return}}
  if(o.type=='kuv'&&o.state=='fight'){for(const s of o.spikes){if(!s.on)continue;const a=s.a+o.rot,sx=o.x+Math.cos(a)*o.r*1.05,sy=o.y-o.r+Math.sin(a)*o.r*1.05;if(Math.hypot(wx-sx,wy-sy)<80){throwBoom(sx,sy,()=>{if(!s.on)return;s.on=0;o.cnt++;SFX.light(o.cnt);say('n'+o.cnt);part(sx,sy,18,'#a98bd6',400,.8,900);shake(6);if(o.cnt==8){o.state='calm';SFX.win();say('b1c');say('b1d');say('b1e')}});return}}}}
 throwBoom(wx,wy)}
const BOOM=[];function throwBoom(tx,ty,cb){if(BOOM.length>1)return;SFX.boom();BOOM.push({x:P.x,y:P.y-100,tx,ty,t:0,cb,back:0})}
function stoneDone(o){if(o.done)return;o.done=1;SFX.win();shake(8);part(o.x,o.cy,40,FORMS[o.give].col,500,1.2,0,12);say(o.n==0?(o.shape=='oval'?'c_oval':'t_stone0'):'c_tri');if(!L.forms.includes(o.give))L.forms.push(o.give);if(!SAVE.forms.includes(o.give))SAVE.forms.push(o.give);save();
 setTimeout(()=>{if(P.form!=o.give){P.form='girl';const i=L.forms.indexOf(o.give);P.form=i>0?L.forms[i-1]:'girl';transform(P)}if(o.give=='wheel')say('t_wheel')},700)}
// ---- обновление игры
function update(dt){G.lt+=dt;const p=P;const I=inp();
 if(I.f&&!p.lastF&&!G.won)transform(p);p.lastF=I.f;
 moveP(p,dt);p.inv-=dt;p.hurt-=dt;p.land-=dt;
 if(Math.abs(p.vx)>20&&p.ground)p.run+=Math.abs(p.vx)*dt/95;
 IDLE+=dt;if(I.l||I.r||I.j)IDLE=0;
 for(const t of taps.splice(0))tapWorld(t);
 // Формик летит за Тасей
 const tx=p.x-p.face*90,ty=p.y-FORMS[p.form].h-70+Math.sin(G.t*3)*12;FM.x=lerp(FM.x,tx,1-Math.pow(.02,dt));FM.y=lerp(FM.y,ty,1-Math.pow(.02,dt));FM.catch=Math.max(0,FM.catch-dt);
 // бумеранг
 for(let i=BOOM.length-1;i>=0;i--){const b=BOOM[i];b.t+=dt;if(!b.back){const dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy),s=1500*dt;if(d<s){b.back=1;b.cb&&b.cb()}else{b.x+=dx/d*s;b.y+=dy/d*s}
   for(const e of ENTS)if(e.type=='enemy'&&!e.dead&&Math.hypot(e.x-b.x,e.y-40-b.y)<60){killEnemy(e);b.back=1}}
  else{const dx=p.x-b.x,dy=p.y-100-b.y,d=Math.hypot(dx,dy),s=1700*dt;if(d<s)BOOM.splice(i,1);else{b.x+=dx/d*s;b.y+=dy/d*s}}}
 const [pw,ph]=dims(p);
 for(const e of ENTS){if(e.dead)continue;
  if(e.type=='enemy'){e.ph+=dt;e.x+=e.vx*dt;const ftx=Math.floor((e.x+Math.sign(e.vx)*40)/T),fty=Math.floor(e.y/T);if(solidFor(tileAt(ftx,fty-1),{})||!solidFor(tileAt(ftx,fty),{})&&tileAt(ftx,fty)!=2)e.vx*=-1;
   if(Math.abs(e.x-p.x)<pw/2+40&&p.y>e.y-80&&p.y-ph<e.y){if(p.vy>100&&p.y<e.y-30){killEnemy(e);p.vy=-750;p.jh=.15}else if(p.form=='wheel'&&Math.abs(p.vx)>300||p.form=='cube'){killEnemy(e)}else hurt(p,e.x)}}
  else if(e.type=='coin'){if(e.fly){e.vy+=1800*dt;e.y+=e.vy*dt;if(e.vy>0){e.fly=0;}}
   if(Math.abs(e.x-p.x)<pw/2+30&&e.y-30<p.y&&e.y+30>p.y-ph){e.dead=1;HUD.shards++;SFX.coin();part(e.x,e.y,8,'#ffe36b',200,.4,0,6)}}
  else if(e.type=='star'){if(Math.abs(e.x-p.x)<pw/2+40&&e.y-50<p.y&&e.y+50>p.y-ph){e.dead=1;HUD.stars++;SFX.star();say('r_star');part(e.x,e.y,30,'#fff',400,.9,0,10)}}
  else if(e.type=='tip'){if(!e.said&&p.x>e.when*T){e.said=1;say(e.k);if(e.k=='t_bump')HAND={x:36.5*T+T,y:5*T,t:0,k:'bump'}}}
  else if(e.type=='stone'){if(!e.intro&&Math.abs(p.x-e.x)<500){e.intro=1;say(e.n?'t_stone':(e.shape=='oval'?'t_oval':'t_stone0'))}
   if(!e.done&&!e.n&&Math.abs(p.x-e.x)<80)stoneDone(e);if(!e.done&&e.n==0&&false);
   if(!e.done&&p.x>e.x+40){p.x=e.x+40;p.vx=Math.min(p.vx,0)}}
  else if(e.type=='odd'){for(const it of e.items){it.wob=Math.max(0,it.wob-dt*1.5);if(it.hit){it.y+=900*dt;it.x+=300*dt}}if(!e.intro&&Math.abs(p.x-e.x)<600){e.intro=1;say('t_odd');say('t_boom')}}
  else if(e.type=='goal'){if(!G.won&&p.x>e.x-30){win()}}
  else if(e.type=='kuv')updKuv(e,dt);}
 ENTS=ENTS.filter(e=>!e.dead||e.type=='enemy'&&(e.dt=(e.dt||0)+dt)<.01);
 // валун
 if(G.boulder){const B=G.boulder;B.v=Math.min(560,B.v+6*dt);B.x+=B.v*dt;if(B.x<p.x-1400)B.x=p.x-1400;if(B.x+150>p.x-pw/2&&!G.won){hurt(p,B.x+300);p.x=B.x+520;p.y=10*T-2;for(let k=0;k<40&&tileAt(Math.floor(p.x/T),Math.floor((p.y-2)/T))!=0;k++)p.y-=T;p.vy=-300;}
  if(G.lt>1&&!G.said14){G.said14=1;say('t_chase')}}
 // частицы
 for(const q of PART){q.life-=dt;q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt}PART=PART.filter(q=>q.life>0);
 // камера с упреждением
 G.look=lerp(G.look||0,p.face*W*.12+p.vx*.25,1-Math.pow(.15,dt));const cx=clamp(p.x-W*.42+G.look,0,L.w*T-W);CAM.x=lerp(CAM.x,cx,1-Math.pow(.004,dt));
 const cy=clamp(p.y-H*.68,-H*.9,0);CAM.y=lerp(CAM.y,cy,1-Math.pow(.05,dt));CAM.shake*=Math.pow(.003,dt);
 if(HAND){HAND.t+=dt;if(HAND.t>4)HAND=null}
 if(IDLE>8&&!HAND)hint();
}
function hint(){IDLE=0;// подсказка ладошкой к ближайшему заданию
 for(const o of ENTS){if(o.type=='stone'&&!o.done&&Math.abs(o.x-P.x)<700){const pts=stonePts(o);const q=pts.find((q,i)=>!(o.litMask&(1<<i)))||[o.x,o.cy];HAND={x:q[0],y:q[1],t:0,k:'tap'};say(o.n?'t_stone':'t_stone0');return}
  if(o.type=='odd'&&!o.done&&Math.abs(o.x-P.x)<800){const it=o.items.find(i=>i.odd);HAND={x:it.x,y:it.y,t:0,k:'tap'};say('t_odd');return}
  if(o.type=='kuv'&&o.state=='fight'){const s=o.spikes.find(s=>s.on);const a=s.a+o.rot;HAND={x:o.x+Math.cos(a)*o.r,y:o.y-o.r+Math.sin(a)*o.r,t:0,k:'tap'};say('b1b');return}}
 HAND={x:BTN.right?BTN.right.x+CAM.x:0,y:BTN.right?BTN.right.y+CAM.y:0,t:0,k:'screen',bx:'right'}}
function updKuv(o,dt){const p=P;if(o.state=='fight'){o.x+=o.vx*dt;o.rot+=o.vx*dt/o.r;if(o.x<o.r+T||o.x>L.w*T-o.r-T){o.vx*=-1;o.x=clamp(o.x,o.r+T,L.w*T-o.r-T);shake(6)}
  o.jt-=dt;if(o.jt<0&&o.vy==0){o.vy=-900;o.jt=2.5+rnd()*1.5}o.vy+=2200*dt;o.y+=o.vy*dt;if(o.y>10*T){if(o.vy>500){shake(10);SFX.land()}o.y=10*T;o.vy=0}
  if(Math.hypot(p.x-o.x,(p.y-70)-(o.y-o.r))<o.r+30){if(p.vy>200&&p.y<o.y-o.r*1.6){p.vy=-1000;SFX.bump()}else hurt(p,o.x)}
  o.vx=Math.sign(o.vx)*(260+o.cnt*25)}
 else{o.vx*=Math.pow(.2,dt);o.rot+=o.vx*dt/o.r;o.y=10*T;if(!speaking()&&!G.won)win()}}
function win(){if(G.won)return;G.won=1;SFX.win();say('r_win');const id=G.level;SAVE.done[id]=1;SAVE.stars[id]=Math.max(SAVE.stars[id]||0,HUD.stars);SAVE.shards+=HUD.shards;save();G.winT=0;part(P.x,P.y-100,60,'#fff3a0',600,1.4,200,10)}
// ---- рисование мира
function drawBG(){const bg=IMG.bg_w1;if(bg.width){const h=H*1.05,w=bg.width*h/bg.height;const off=CAM.x*.12,k0=Math.floor(off/w);for(let k=k0;k<k0+3;k++){const x=k*w-off;X.save();X.translate(x+(k%2?w:0),-CAM.y*.05-20);if(k%2)X.scale(-1,1);X.drawImage(bg,0,0,w,h);X.restore()}}
 // средний слой: холмы
 X.fillStyle='rgba(120,190,90,.55)';X.beginPath();X.moveTo(0,H);for(let x=0;x<=W+20;x+=20){const wx=x+CAM.x*.4;X.lineTo(x,H*.72-CAM.y*.3+Math.sin(wx*.004)*40+Math.sin(wx*.011)*18)}X.lineTo(W,H);X.fill();
 X.fillStyle='rgba(90,160,70,.6)';X.beginPath();X.moveTo(0,H);for(let x=0;x<=W+20;x+=20){const wx=x+CAM.x*.6;X.lineTo(x,H*.8-CAM.y*.5+Math.sin(wx*.006+1)*30)}X.lineTo(W,H);X.fill()}
function drawTiles(){const x0=Math.max(0,Math.floor(CAM.x/T)-1),x1=Math.min(L.w,Math.ceil((CAM.x+W)/T)+1);const tt=IMG.tile_top,td=IMG.tile_dirt;
 for(let ty=0;ty<12;ty++)for(let tx=x0;tx<x1;tx++){const v=tileAt(tx,ty);if(!v)continue;const x=tx*T,y=ty*T;
  if(v==1){const top=tileAt(tx,ty-1)==0||tileAt(tx,ty-1)==2||tileAt(tx,ty-1)>=5&&tileAt(tx,ty-1)!=9&&tileAt(tx,ty-1)!=7&&tileAt(tx,ty-1)!=8;const u=(tx%4)*60;
    if(top){X.drawImage(td,u,0,60,120,x,y,T,T*2>H?T:T);X.drawImage(tt,u,0,60,130,x,y-12,T,T*1.1)}else X.drawImage(td,u,(ty%2)*60,60,60,x,y,T+.5,T+.5)}
  else if(v==2)img('plank',x+T/2,y+46,46,0,1,.5,1);
  else if(v==3||v==9){X.save();X.globalAlpha=v==9?.75:1;img('block',x+T/2,y+T,T);X.restore();if(v==3){X.fillStyle='#ffe36b';X.globalAlpha=.6+.4*Math.sin(G.t*5);X.beginPath();X.arc(x+T/2,y+T/2,9,0,7);X.fill();X.globalAlpha=1}}
  else if(v==4){X.fillStyle='#8d7b66';X.fillRect(x,y,T,T);X.strokeStyle='#5b4a3a';X.lineWidth=4;X.strokeRect(x+2,y+2,T-4,T-4);X.beginPath();X.moveTo(x+10,y+8);X.lineTo(x+30,y+30);X.lineTo(x+22,y+52);X.moveTo(x+30,y+30);X.lineTo(x+52,y+38);X.stroke()}
  else if(v==5||v==6){X.save();X.beginPath();if(v==5){X.moveTo(x,y+T);X.lineTo(x+T,y);X.lineTo(x+T,y+T)}else{X.moveTo(x,y);X.lineTo(x+T,y+T);X.lineTo(x,y+T)}X.closePath();X.clip();X.drawImage(td,0,0,60,60,x,y,T,T);X.restore();
   X.strokeStyle='#5fae2e';X.lineWidth=12;X.lineCap='round';X.beginPath();if(v==5){X.moveTo(x,y+T);X.lineTo(x+T,y)}else{X.moveTo(x,y);X.lineTo(x+T,y+T)}X.stroke()}
  else if(v==7||v==8){if(ty==0||tileAt(tx,ty-1)!=v){let n=0;while(tileAt(tx,ty+n)==v)n++;const cy=y+n*T/2;X.save();X.globalAlpha=.85;X.lineWidth=10;X.strokeStyle=v==7?'#ff8a1f':'#c58cff';X.fillStyle=v==7?'rgba(255,170,60,.25)':'rgba(200,150,255,.3)';X.beginPath();
    if(v==7)X.arc(x+T/2,cy,n*T/2-6,0,7);else X.ellipse(x+T/2,cy,n*T*.33,n*T/2-6,0,0,7);X.fill();X.stroke();X.globalAlpha=1;
    paintShape(v==7?'circle':'oval',x+T/2,y-34,28,v==7?'#ff8a1f':'#c58cff',0,false,20);X.restore()}}}}
function drawP(){const p=P,F=FORMS[p.form];X.save();if(p.inv>0&&Math.floor(G.t*12)%2)X.globalAlpha=.45;
 const land=p.land>0?p.land/.12:0;
 if(p.form=='girl'){let n='t_idle',h=170;
  if(p.hurt>0)n='t_hurt';else if(!p.ground)n=p.vy<0?'t_jump':'t_fall';else if(Math.abs(p.vx)>30)n='t_run'+(Math.floor(p.run)%4);else{p.blink-=1/60;if((G.t%3.7)<.13)n='t_blink'}
  const ih=IMG[n];const sh=n.startsWith('t_run')?h*.912:n=='t_jump'?h*.82:n=='t_fall'||n=='t_hurt'?h*.98:h*(ih.height/340||1);
  const breathe=n=='t_idle'||n=='t_blink'?Math.sin(G.t*2.6)*2:0;const bob=n.startsWith('t_run')?-Math.abs(Math.sin(p.run*Math.PI))*6:0;
  X.translate(p.x,p.y+land*5);X.scale(1+land*.04,1-land*.04);
  // тень
  X.fillStyle='rgba(0,0,0,.22)';X.beginPath();X.ellipse(0,-land*5,40,9,0,0,7);X.fill();
  img(n,0,bob+(n=='t_jump'?-14:0),sh+breathe,p.face<0&&n!='t_idle'&&n!='t_blink'?1:0,1,.5,1)}
 else{const r=F.h/2;const roll=p.form=='wheel'||p.form=='bubble'?0:0;p.rot=(p.rot||0)+(p.form=='wheel'?p.vx/r/120:0);
  X.fillStyle='rgba(0,0,0,.22)';X.beginPath();X.ellipse(p.x,p.y,F.w*.45,9,0,0,7);X.fill();
  if(p.form=='wheel'){X.save();X.translate(p.x,p.y-r);X.rotate(p.rot);X.strokeStyle='#ffd36b';X.lineWidth=6;for(let i=0;i<8;i++){X.beginPath();X.moveTo(0,0);X.lineTo(Math.cos(i*Math.PI/4)*r*.9,Math.sin(i*Math.PI/4)*r*.9);X.stroke()}X.restore();
   if(Math.abs(p.vx)>250)for(let i=0;i<2;i++)PART.push({x:p.x-p.face*r*.8,y:p.y-r*.4-rnd()*r,vx:-p.face*200,vy:-100,life:.35,l0:.35,col:pick(['#ff6a00','#ffb300','#ffe36b']),g:-200,sz:9})}
  const bob=p.form=='bubble'?Math.sin(G.t*4)*5:0;
  X.save();if(p.form=='wheel'){X.globalAlpha*=.92}paintShape(F.shape,p.x,p.y-r+bob,r,F.col,0,true,25);X.restore();
  // Тасина шапочка сверху, чтобы видно было, что это она
  X.save();X.translate(p.x+p.face*r*.15,p.y-2*r+bob+6);X.fillStyle='#e8312a';X.beginPath();X.moveTo(-26,8);X.lineTo(26,8);X.lineTo(p.face*6,-38);X.closePath();X.fill();X.fillStyle='#ffc93c';X.beginPath();X.arc(p.face*6,-40,8,0,7);X.fill();X.restore()}
 X.restore()}
function drawFM(){if(P.form!='girl'&&!FM.catch)return;const f='fm'+(Math.floor(G.t*2)%4);img(f,FM.x,FM.y+75,FM.catch?150:125,P.face<0?1:0,1,.5,1);
 X.save();X.globalAlpha=.35+.15*Math.sin(G.t*5);X.fillStyle='#fff6c8';X.beginPath();X.arc(FM.x,FM.y+25,46,0,7);X.fill();X.restore()}
function drawEnts(){for(const e of ENTS){if(e.x<CAM.x-400||e.x>CAM.x+W+400)continue;
 if(e.type=='enemy'){X.save();if(e.dead)X.globalAlpha=.4;img('e_wheel',e.x,e.y+2+Math.abs(Math.sin(e.ph*8))*-4,92,e.vx>0?1:0);X.restore()}
 else if(e.type=='coin'){const s=Math.abs(Math.cos(G.t*3+e.x*.01));X.save();X.translate(e.x,e.y);X.scale(.4+.6*s,1);img(e.kind,0,0,50,0,1,.5,.5);X.restore()}
 else if(e.type=='star'){X.save();X.translate(e.x,e.y+Math.sin(G.t*3)*6);X.rotate(Math.sin(G.t*2)*.15);img('star',0,0,72,0,1,.5,.5);X.restore()}
 else if(e.type=='goal'){// маячок-финиш
  X.save();X.translate(e.x,e.y);X.fillStyle='#fff';X.fillRect(-26,-260,52,260);for(let i=0;i<5;i++){X.fillStyle=['#ff5a4e','#ff8a1f','#ffcc33','#35c46a','#5ec8ff'][i];X.fillRect(-26,-250+i*50,52,25)}
  X.fillStyle='#7b4fd6';X.beginPath();X.moveTo(-40,-260);X.lineTo(40,-260);X.lineTo(0,-310);X.fill();X.globalAlpha=.5+.3*Math.sin(G.t*4);X.fillStyle='#fff3a0';X.beginPath();X.arc(0,-280,40,0,7);X.fill();X.restore()}
 else if(e.type=='stone'){img('stone',e.x,e.y,200);X.save();X.globalAlpha=.9;X.fillStyle='rgba(30,20,60,.55)';X.beginPath();X.roundRect(e.x-150,e.cy-150,300,300,30);X.fill();
  const col=FORMS[e.give].col;if(e.done){paintShape(e.shape,e.x,e.cy,e.r,col,0,true,40)}else{X.setLineDash([14,10]);pathShape(e.shape,e.x,e.cy,e.r);X.lineWidth=8;X.strokeStyle='#fff';X.stroke();X.setLineDash([]);
   const pts=stonePts(e);pts.forEach((q,i)=>{const lit=e.litMask&(1<<i);X.save();X.shadowColor='#fff3a0';X.shadowBlur=lit?30:0;X.fillStyle=lit?'#ffe36b':'rgba(255,255,255,'+(.5+.3*Math.sin(G.t*5+i))+')';X.beginPath();X.arc(q[0],q[1],lit?24:18,0,7);X.fill();X.restore()});
   if(!pts.length){X.fillStyle='rgba(255,255,255,'+(.3+.2*Math.sin(G.t*4))+')';pathShape(e.shape,e.x,e.cy,e.r);X.fill()}}
  txt(e.done?(e.n?e.n+' '+plural(e.n,'угол','угла','углов'):'0 углов'):e.lit+' из '+e.n,e.x,e.cy+e.r+42,40,'#fff3a0');X.restore()}
 else if(e.type=='odd'){X.save();X.fillStyle='rgba(30,20,60,.45)';X.beginPath();X.roundRect(e.items[0].x-80,e.y-380,e.items.length*120+40,230,30);X.fill();X.restore();
  if(!e.done){const wx=e.wx*T;X.save();X.globalAlpha=.8;for(let y=2;y<10;y++){X.fillStyle=y%2?'#9b7bd6':'#b89aea';X.fillRect(wx+4,y*T,T-8,T)}X.restore()}
  for(const it of e.items){if(it.y>H+200)continue;const wob=Math.sin(G.t*30)*it.wob*12;paintShape(it.shape,it.x+wob,it.y+Math.sin(G.t*2+it.x)*6,it.r,it.col,0,true,10)}}
 else if(e.type=='kuv')drawKuv(e)}}
function drawKuv(o){X.save();const cy=o.y-o.r;X.translate(o.x,cy);X.rotate(o.rot);const i=IMG.kuv;
 // колесо без шипов: картинка содержит шипы — поверх рисуем свои: берём круг из картинки
 X.save();X.beginPath();X.arc(0,0,o.r*.98,0,7);X.clip();X.drawImage(i,-o.r*1.27,-o.r*1.32,o.r*2.55,o.r*2.55*i.height/i.width);X.restore();
 X.restore();X.save();X.translate(o.x,cy);for(const s of o.spikes){if(!s.on)continue;const a=s.a+o.rot;X.save();X.rotate(a);X.fillStyle='#7d5fb8';X.strokeStyle='#3b2a66';X.lineWidth=4;X.beginPath();X.moveTo(o.r*.9,-26);X.lineTo(o.r*1.45,0);X.lineTo(o.r*.9,26);X.closePath();X.fill();X.stroke();X.fillStyle='rgba(255,255,255,.5)';X.beginPath();X.moveTo(o.r*.95,-12);X.lineTo(o.r*1.3,0);X.lineTo(o.r*.95,4);X.fill();X.restore()}X.restore();
 txt(o.cnt+' из 8',o.x,cy-o.r-80,46,'#fff3a0')}
function plural(n,a,b,c){n=Math.abs(n)%100;const n1=n%10;if(n>10&&n<20)return c;if(n1>1&&n1<5)return b;if(n1==1)return a;return c}
function drawBoom(){for(const b of BOOM){X.save();X.translate(b.x,b.y);X.rotate(b.t*20);X.fillStyle='#ffc93c';X.strokeStyle='#8a5a12';X.lineWidth=4;X.beginPath();X.moveTo(-30,-18);X.lineTo(30,-18);X.lineTo(-30,30);X.closePath();X.fill();X.stroke();X.restore()}}
function drawHUD(){btnLayout();// сердечки, осколки, звёзды
 for(let i=0;i<3;i++)img('heart',50+i*62,78,56,0,i<HUD.hearts?1:.25,.5,1);
 img('coin_circ',250,50,54,0,1,.5,.5);txt('× '+HUD.shards,285,52,46,'#fff','left');
 for(let i=0;i<3;i++)img('star',420+i*58,52,52,0,i<HUD.stars?1:.25,.5,.5);
 txt(L.meta.name,W-30,46,38,'#fff3a0','right');
 // кнопки
 const B=(k,n,fl)=>{const b=BTN[k];X.save();X.globalAlpha=TOUCH[k]?1:.82;const s=TOUCH[k]?.92:1;X.translate(b.x,b.y);X.scale(s,s);if(fl)X.scale(-1,1);img(n,0,0,b.r*2,0,1,.5,.5);X.restore()};
 B('left','btn_arrow',1);B('right','btn_arrow');B('jump','btn_jump');if(L.forms.length){B('form','btn_form');const nf=FORMS[nextForm()];if(nf){X.save();paintShape(nf.shape||'tri',BTN.form.x+BTN.form.r*.75,BTN.form.y-BTN.form.r*.75,22,nf.col,0,false);X.restore()}}
 if(BANNER&&BANNER.t>0){BANNER.t-=1/60;X.save();X.globalAlpha=Math.min(1,BANNER.t*2);txt(BANNER.txt,W/2,H*.2,70,'#fff3a0');X.restore()}
 if(HAND&&HAND.k=='screen'){const b=BTN[HAND.bx];hand(b.x+10,b.y-20,HAND.t,(HAND.t%1)>.6?(HAND.t%1-.6)/.4:0)}}
function nextForm(){const o=['girl',...L.forms];return o[(o.indexOf(P.form)+1)%o.length]}
function drawSub(){if(!vcur||!SUB)return;const s=TXTS[SUB.k];if(!s)return;X.save();X.font='34px Lobster,cursive';const lines=wrap(s,W*.62);const h=lines.length*42+20;X.fillStyle='rgba(30,18,60,.72)';X.beginPath();X.roundRect(W/2-W*.33,H*.28-h/2,W*.66,h,20);X.fill();lines.forEach((l,i)=>txt(l,W/2,H*.28-h/2+30+i*42,34,'#fff'));X.restore()}
function wrap(s,mw){const w=s.split(' ');const out=[];let cur='';for(const x of w){const t=cur?cur+' '+x:x;if(X.measureText(t).width>mw&&cur){out.push(cur);cur=x}else cur=t}out.push(cur);return out}
const TXTS={};
// ---- бот-проверка (?bot=1): проходит уровни сам
const STATS={frames:0,ground:0,badFeet:0,minFps:999,levels:{}};G.stats=STATS;
function botThink(dt){if(!G.bot||G.scene=='map'||G.scene=='title')return;BOT.l=0;BOT.r=1;BOT.f=0;const p=P;G.bt=(G.bt||0)+dt;
 const F=FORMS[p.form],[w,h]=dims(p);const fx=Math.floor((p.x+w/2+30)/T),fy=Math.floor((p.y-5)/T);
 // задания
 for(const o of ENTS){if(o.type=='stone'&&!o.done&&Math.abs(o.x-p.x)<420){BOT.r=p.x<o.x-60;if(G.bt>.6){G.bt=0;const pts=stonePts(o);const q=pts.find((q,i)=>!(o.litMask&(1<<i)))||[o.x,o.cy];taps.push({x:q[0]-CAM.x,y:q[1]-CAM.y})}return}
  if(o.type=='odd'&&!o.done&&o.x-p.x<500&&o.x-p.x>-200){BOT.r=p.x<o.x-200;if(G.bt>.8){G.bt=0;const it=G.botWrong?o.items.find(i=>i.odd):o.items.find(i=>!i.odd&&!G.botW1)||o.items.find(i=>i.odd);G.botW1=1;G.botWrong=1;taps.push({x:it.x-CAM.x,y:it.y-CAM.y})}return}
  if(o.type=='kuv'&&o.state=='fight'){BOT.r=p.x<o.x-380;BOT.l=p.x>o.x-260&&p.x>200;if(BOT.l)BOT.r=0;if(G.bt>.5){G.bt=0;const s=o.spikes.find(s=>s.on);if(s){const a=s.a+o.rot;taps.push({x:o.x+Math.cos(a)*o.r-CAM.x,y:o.y-o.r+Math.sin(a)*o.r-CAM.y})}}
   BOT.j=Math.abs(o.x-p.x)<o.r+200&&o.vy==0?1:0;return}}
 // форма
 let want=p.form;for(let k=0;k<4;k++){const tx=fx+k;let has7=0,has8=0,has4=0;for(let y=0;y<11;y++){const v=tileAt(tx,y);if(v==7)has7=1;if(v==8)has8=1;if(v==4)has4=1}if(has7||has4){want='wheel';break}if(has8){want='bubble';break}}
 if(G.boulder)want='wheel';if(p.form=='bubble'&&want=='bubble'){}
 if(want!=p.form&&L.forms.includes(want)&&!G.botF){BOT.f=1;G.botF=.15}else BOT.f=0;G.botF=Math.max(0,(G.botF||0)-dt);if(G.botF>0&&G.botF<.08)BOT.f=0;
 if(p.form=='bubble'){let wall=0,gate=0;for(let k=0;k<4;k++)for(let y=0;y<Math.floor(p.y/T)-2;y++){const v=tileAt(fx+k,y);if(v==1)wall=1;if(v==8)gate=1}BOT.j=wall?1:0;if(!wall&&!gate&&p.ground&&!G.botF){BOT.f=1;G.botF=.15}return}
 // прыжок
 let wall=0;for(let y=fy-2;y<=fy;y++){const v=tileAt(fx,y);if(solidFor(v,p)&&v!=5&&v!=6)wall=1}
 let gap=1;for(let k=0;k<2;k++)for(let y=fy+1;y<12;y++)if(tileAt(fx+k,y))gap=0;
 let foe=ENTS.some(e=>e.type=='enemy'&&!e.dead&&e.x>p.x&&e.x-p.x<190&&Math.abs(e.y-p.y)<90)&&p.form!='wheel';
 if(G.stuck>1.2)wall=1;
 if((wall||gap||foe)&&p.ground)G.bj=.35;G.bj=(G.bj||0)-dt;BOT.j=G.bj>0;
 G.lx=G.lx||0;if(Math.abs(p.x-G.lx)<1)G.stuck=(G.stuck||0)+dt;else G.stuck=0;G.lx=p.x}
function checkFeet(){const p=P;STATS.frames++;if(!p.ground)return;STATS.ground++;const tx=Math.floor(p.x/T),ty=Math.floor((p.y+1)/T);let ok=false;const [w]=dims(p);
 for(const x of [Math.floor((p.x-w/2+3)/T),tx,Math.floor((p.x+w/2-3)/T)]){const v=tileAt(x,ty),v2=tileAt(x,ty-1);if(v&&v!=8&&v!=7||v==7&&p.form!='wheel'||v2==5||v2==6||v==5||v==6)ok=true}
 if(!ok){STATS.badFeet++;if(STATS.badFeet<5)G.log.push('feet '+G.level+' '+p.x.toFixed(0)+','+p.y.toFixed(0))}}
// ---- сцены
const MAPN=[{id:'1-1',x:.16,y:.78},{id:'1-2',x:.25,y:.70},{id:'1-3',x:.33,y:.78},{id:'1-4',x:.41,y:.68},{id:'1-B',x:.49,y:.76}];
function unlocked(id){const i=ORDER.indexOf(id);return i==0||SAVE.done[ORDER[i-1]]||Q.has('all')}
function drawMap(){const m=IMG.map;if(m.width){const s=Math.max(W/m.width,H/m.height);X.drawImage(m,(W-m.width*s)/2,(H-m.height*s)/2,m.width*s,m.height*s)}
 X.fillStyle='rgba(20,10,40,.25)';X.fillRect(0,0,W,H);txt('Долина Колёс',W/2,60,64,'#fff3a0');
 X.strokeStyle='rgba(255,243,160,.8)';X.lineWidth=10;X.setLineDash([4,22]);X.lineCap='round';X.beginPath();MAPN.forEach((n,i)=>i?X.lineTo(n.x*W,n.y*H):X.moveTo(n.x*W,n.y*H));X.stroke();X.setLineDash([]);
 MAPN.forEach((n,i)=>{const u=unlocked(n.id),d=SAVE.done[n.id];const r=n.id=='1-B'?62:52;X.save();X.globalAlpha=u?1:.5;paintShape('circle',n.x*W,n.y*H,r+(u&&!d?Math.sin(G.t*4)*4:0),d?'#ffcc33':u?'#ff8a1f':'#888888',0,false,u?20:0);
  txt(n.id=='1-B'?'Босс':n.id,n.x*W,n.y*H,n.id=='1-B'?34:40,'#fff');for(let s=0;s<3;s++)img('star',n.x*W-36+s*36,n.y*H+r+26,30,0,s<(SAVE.stars[n.id]||0)?1:.25,.5,.5);X.restore()});
 const cur=MAPN.find(n=>unlocked(n.id)&&!SAVE.done[n.id])||MAPN[0];img('t_idle',cur.x*W,cur.y*H-50,150);
 X.save();X.globalAlpha=.85;txt('Миры 2–6: скоро!',W*.78,H*.9,36,'#fff');X.restore();
 img('coin_circ',W-230,H-40,44,0,1,.5,.5);txt('× '+SAVE.shards,W-200,H-40,38,'#fff','left');
 if(IDLE>6){hand(cur.x*W+20,cur.y*H+30,G.t,(G.t%1)>.6?(G.t%1-.6)/.4:0)}}
function mapTap(p){IDLE=0;for(const n of MAPN){if(Math.hypot(p.x-n.x*W,p.y-n.y*H)<80&&unlocked(n.id)){SFX.coin();loadLevel(n.id);return}}}
function drawTitle(){const m=IMG.map;if(m.width){const s=Math.max(W/m.width,H/m.height);X.drawImage(m,(W-m.width*s)/2,(H-m.height*s)/2,m.width*s,m.height*s)}X.fillStyle='rgba(30,15,60,.45)';X.fillRect(0,0,W,H);
 txt('Тася Треуголка',W/2,H*.2,96,'#ff6a5a','center','#fff');txt('и Радужный Маяк',W/2,H*.34,70,'#fff3a0');
 img('t_idle',W*.3,H*.92+Math.sin(G.t*2.6)*2,300);img('fm'+(Math.floor(G.t*2)%4),W*.42,H*.62+Math.sin(G.t*3)*10,150);img('oskolok_0',W*.78,H*.95,330);
 const pr=1+Math.sin(G.t*4)*.05;X.save();X.translate(W/2,H*.58);X.scale(pr,pr);X.fillStyle='#ff8a1f';X.beginPath();X.roundRect(-160,-48,320,96,48);X.fill();X.strokeStyle='#fff';X.lineWidth=6;X.stroke();txt('Играть!',0,2,60,'#fff');X.restore()}
function drawWin(){X.fillStyle='rgba(20,10,40,.55)';X.fillRect(0,0,W,H);txt('Уровень пройден!',W/2,H*.3,84,'#fff3a0');for(let i=0;i<3;i++)img('star',W/2-110+i*110,H*.5,100,0,i<HUD.stars?1:.25,.5,.5);
 img('coin_circ',W/2-60,H*.68,56,0,1,.5,.5);txt('× '+HUD.shards,W/2-20,H*.68,52,'#fff','left');if(!speaking()&&G.winT>1.5)txt('Нажми, чтобы продолжить',W/2,H*.85,44,'#fff')}
function render(){X.setTransform(SC,0,0,SC,0,0);X.clearRect(0,0,W,H);
 if(G.scene=='title'){drawTitle();if(loaded<TOTAL)txt('Загрузка… '+Math.round(loaded/TOTAL*100)+'%',W/2,H*.75,40)}
 else if(G.scene=='map')drawMap();
 else{drawBG();const sx=(rnd()-.5)*CAM.shake,sy=(rnd()-.5)*CAM.shake;X.save();X.translate(-Math.round(CAM.x)+sx,-Math.round(CAM.y)+sy);
  for(const d of L.deco)img(d.img,d.x+T/2,d.y,(IMG[d.img].height||100)*d.s*.9);drawTiles();drawEnts();
  if(G.boulder){const B=G.boulder;X.save();X.translate(B.x,10*T-170);X.rotate(B.x/170);paintShape('circle',0,0,170,'#8d7b66',0,false);X.strokeStyle='#5b4a3a';X.lineWidth=8;X.beginPath();X.moveTo(-90,-40);X.lineTo(30,10);X.lineTo(60,90);X.stroke();X.restore();for(let i=0;i<2;i++)PART.push({x:B.x+60,y:10*T-10,vx:-100+rnd()*-200,vy:-200*rnd(),life:.5,l0:.5,col:'#b8a27a',g:600,sz:10})}
  drawFM();drawP();drawBoom();for(const q of PART){X.globalAlpha=Math.max(0,q.life/q.l0);X.fillStyle=q.col;X.beginPath();X.arc(q.x,q.y,q.sz,0,7);X.fill()}X.globalAlpha=1;
  if(HAND&&HAND.k!='screen')hand(HAND.x+10,HAND.y+20,HAND.t,(HAND.t%1)>.6?(HAND.t%1-.6)/.4:0);
  X.restore();if(FLASH>0){X.fillStyle='rgba(255,255,255,'+FLASH*4+')';X.fillRect(0,0,W,H);FLASH-=1/60}
  drawHUD();if(G.won)drawWin()}
 drawSub();if(Q.has('fps'))txt(G.fps.toFixed(0)+' fps',W-80,H-20,24)}
// ---- главный цикл, фиксированный шаг
let last=performance.now(),acc=0,fpsT=0,fpsN=0;
function frame(now){let dt=Math.min(.1,(now-last)/1000);last=now;G.t+=dt;fpsT+=dt;fpsN++;if(fpsT>=1){G.fps=fpsN/fpsT;if(G.scene=='play'||G.scene=='boss')STATS.minFps=Math.min(STATS.minFps,G.fps);fpsT=0;fpsN=0}
 voiceTick();musicTick();
 if(G.scene=='title'){if(taps.length&&loaded>=TOTAL){taps=[];G.scene='map';if(!SAVE.intro){SAVE.intro=1;save();['i1','i2','i3','i4','i5','i6','m1'].forEach(k=>say(k))}else say('m1')}if(G.bot&&loaded>=TOTAL){G.scene='map'}}
 else if(G.scene=='map'){IDLE+=dt;for(const t of taps.splice(0))mapTap(t);if(G.bot){const n=MAPN.find(n=>!SAVE.done[n.id]);if(n)loadLevel(n.id);else G.botDone=1}}
 else{if(G.won){G.winT+=dt;taps.length=0;acc+=dt;while(acc>=STEP){acc-=STEP;for(const q of PART){q.life-=STEP;q.vy+=q.g*STEP;q.x+=q.vx*STEP;q.y+=q.vy*STEP}}PART=PART.filter(q=>q.life>0);
   if((G.winT>2&&!speaking()&&(inp().j||taps.length||G.bot))||G.winT>12&&G.bot||(G.bot&&G.winT>2)){STATS.levels[G.level]={t:G.lt,bad:STATS.badFeet};G.scene='map'}
   if(!G.bot&&G.winT>2&&!speaking()){C.onpointerup=()=>{C.onpointerup=null;if(G.won&&G.scene!='map')G.scene='map'}}}
  else{acc+=dt;let n=0;while(acc>=STEP&&n<20){acc-=STEP;n++;botThink(STEP);update(STEP);checkFeet()}}}
 render();requestAnimationFrame(frame)}
fetch('tools/lines.json?v='+V).then(r=>r.json()).then(a=>a.forEach(o=>TXTS[o.k]=o.t)).catch(()=>{});
if(Q.get('level')){const id=Q.get('level');const tick=()=>{if(loaded>=TOTAL)loadLevel(id);else setTimeout(tick,100)};tick()}
requestAnimationFrame(frame);
