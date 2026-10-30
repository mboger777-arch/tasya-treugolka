'use strict';
// ===== v14: нарисованный рельеф по мирам (нейросеть): шапка-полоса с краями, бесшовная заливка тела, срезы обрывов, парящие плиты.
// Только визуал: коллизии — прежние тайлы. Без rnd() (детерминизм бота).
const TERR=(()=>{
const M={"1":{"l":205,"p":1848,"r":205,"h":368,"s":24,"b":361,"cut":293},"2":{"l":168,"p":1911,"r":168,"h":328,"s":4,"b":310,"cut":264},"3":{"l":147,"p":2010,"r":147,"h":306,"s":2,"b":303,"cut":242},"4":{"l":412,"p":1441,"r":412,"h":562,"s":192,"b":546,"cut":411},"5":{"l":205,"p":1842,"r":205,"h":440,"s":88,"b":389,"cut":214},"6":{"l":385,"p":1481,"r":385,"h":478,"s":201,"b":431,"cut":343}};
// толщина плиты (поверхность→низ) в мировых px; масштаб заливки; посадка поверхности; цвет кромки обрыва
const CF={1:{th:112,fs:330,sink:5,edge:'rgba(52,28,14,.55)',cap:.5},2:{th:112,fs:300,sink:3,edge:'rgba(30,36,60,.55)',cap:.42},3:{th:104,fs:430,sink:2,edge:'rgba(110,70,60,.45)',cap:.42},
 4:{th:120,fs:330,sink:4,edge:'rgba(110,70,30,.5)',cap:.45},5:{th:118,fs:380,sink:2,edge:'rgba(150,120,70,.45)',cap:.4},6:{th:116,fs:320,sink:3,edge:'rgba(30,10,50,.6)',cap:.42}};
const R={};let cur=0;
function ld(n,nm,ext){const i=new Image();i.onerror=()=>{if(!i.fb){i.fb=1;i.src='assets/img/'+nm+'.png?v='+V}};i.src='assets/img/'+nm+'.'+ext+'?v='+V;return i}
function load(n){if(!M[n])return;cur=n;if(!R[n])R[n]={a:ld(n,'terr_w'+n,'webp'),f:ld(n,'fill_w'+n,'webp')}}
function cv(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c}
function prep(n){const r=R[n],m=M[n],A=r.a,c=CF[n];if(r.ok)return r;if(!A.width||!r.f.width)return null;
 const k=c.th/(m.b-m.s),FW=Math.round(28/k);// ширина перехода край↔полоса (атлас px)
 const Q=Math.max(1,Math.min(2.2,SC*Z)),q=k*Q;r.Q=Q;// запекаем 1:1 к экрану — без дорогого даунскейла каждый кадр
 const dn=c0=>{const o=cv(c0.width*q,c0.height*q),ox=o.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(c0,0,0,o.width,o.height);o.ww=c0.width*k;o.wh=c0.height*k;return o};
 const fade=(x,h0,h1)=>{const g=x.createLinearGradient(0,h0,0,h1);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');x.globalCompositeOperation='destination-out';x.fillStyle=g;x.fillRect(0,h0,x.canvas.width,x.canvas.height-h0);x.globalCompositeOperation='source-over'};
 const mk=(rows,fd)=>{// полоса середины + края с мягким переходом
  const S=cv(m.p,rows),s=S.getContext('2d');s.drawImage(A,m.l,0,m.p,rows,0,0,m.p,rows);if(fd)fade(s,rows-fd,rows);
  const Lc=cv(m.l+2*FW,rows),l=Lc.getContext('2d');l.drawImage(A,0,0,m.l+2*FW,rows,0,0,m.l+2*FW,rows);
  let g=l.createLinearGradient(m.l,0,m.l+2*FW,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');l.globalCompositeOperation='destination-out';l.fillStyle=g;l.fillRect(m.l,0,2*FW+1,rows);l.globalCompositeOperation='source-over';if(fd)fade(l,rows-fd,rows);
  const Rc=cv(m.r+2*FW,rows),q=Rc.getContext('2d');q.drawImage(A,m.l+m.p-2*FW,0,m.r+2*FW,rows,0,0,m.r+2*FW,rows);
  g=q.createLinearGradient(0,0,2*FW,0);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');q.globalCompositeOperation='destination-out';q.fillStyle=g;q.fillRect(0,0,2*FW,rows);q.globalCompositeOperation='source-over';if(fd)fade(q,rows-fd,rows);
  return {S:dn(S),L:dn(Lc),R:dn(Rc),rows}};
 const fd=Math.round(.35*(m.cut-m.s));
 r.g=mk(Math.min(m.h,m.cut+Math.round(fd*.4)),fd);r.fl=mk(m.h,0);
 const capR=m.s+Math.round(c.cap*T/k);r.cap=mk(capR+Math.round(10/k),Math.round(22/k));
 r.k=k;r.FW=FW;r.m=m;r.c=c;
 // заливка тела: паттерн + крупные мягкие пятна (другой период), чтобы не было видно повтора
 const Qf=Math.min(Q,1.5),Wt=Math.round(3*c.fs*Qf),N=cv(Wt,Wt),nx=N.getContext('2d'),fp=Wt/3;
 for(let i=0;i<3;i++)for(let j=0;j<3;j++)nx.drawImage(r.f,i*fp,j*fp,fp+.5,fp+.5);
 let h=n*7919+13;const rn=()=>((h=Math.imul(h^h>>>15,2246822519)+n>>>0)%10000)/10000;
 for(let i=0;i<60;i++){const x=rn()*Wt,y=rn()*Wt,rr=(18+rn()*46)*Wt/256,d=rn()<.55;for(const ox of[-Wt,0,Wt])for(const oy of[-Wt,0,Wt]){const gg=nx.createRadialGradient(x+ox,y+oy,0,x+ox,y+oy,rr);gg.addColorStop(0,d?'rgba(20,10,30,.16)':'rgba(255,245,220,.10)');gg.addColorStop(1,'rgba(0,0,0,0)');nx.fillStyle=gg;nx.fillRect(x+ox-rr,y+oy-rr,2*rr,2*rr)}}
 r.pat=X.createPattern(N,'repeat');r.pat.setTransform(new DOMMatrix([1/Qf,0,0,1/Qf,0,0]));
 r.ok=1;return r}
const sol=v=>v==1;const open=v=>v!=1&&v!=3&&v!=4&&v!=9&&!(v>=10);
function isTop(tx,ty){if(tileAt(tx,ty)!=1)return false;const a=tileAt(tx,ty-1);return a==0||a==2||a>=5&&a!=7&&a!=8&&a!=9}
function floatRun(tx,ty){let a=tx,b=tx;while(isTop(a-1,ty))a--;while(isTop(b+1,ty))b++;for(let x=a;x<=b;x++)if(!open(tileAt(x,ty+1)))return false;return true}
function strip(r,P,Xs,Xe,Y,v0,v1){const k=r.k,Q=r.Q,pw=r.m.p*k;let x=Math.max(Xs,v0);const e=Math.min(Xe,v1);if(e<=x)return;let u=((x-Xs)%pw+pw)%pw;
 while(x<e){const w=Math.min(pw-u,e-x);X.drawImage(P.S,u*Q,0,w*Q,P.S.height,x,Y,w,P.S.wh);x+=w;u=0}}
function run(r,ty,a,b,v0,v1){const m=r.m,k=r.k,c=r.c,X0=a*T,X1=(b+1)*T,OV=7;
 let fl=ty<10;if(fl)for(let tx=a;tx<=b;tx++)if(!open(tileAt(tx,ty+1))){fl=false;break}
 const P=fl?r.fl:r.g,Y=ty*T+c.sink-m.s*k,lo=open(tileAt(a-1,ty)),ro=open(tileAt(b+1,ty));
 const el=lo?m.l*k:0,er=ro?m.r*k:0,fw=r.FW*k;
 if(X1<v0-200||X0>v1+200)return;
 if(el+er>X1-X0+2*OV-2*fw){// узкая колонна/ступенька: края встречаются посередине
  const xm=(X0+X1)/2;if(!lo||!ro)strip(r,P,X0,X1,Y,v0,v1);
  if(lo){X.save();X.beginPath();X.rect(X0-OV-2,Y-80,xm-X0+OV+2+(ro?fw*.5:0),P.rows*k+160);X.clip();X.drawImage(P.L,X0-OV,Y,P.L.ww,P.L.wh);X.restore()}
  if(ro){X.save();X.beginPath();X.rect(xm-(lo?fw*.5:0),Y-80,X1+OV-xm+2+(lo?fw*.5:0),P.rows*k+160);X.clip();X.drawImage(P.R,X1+OV-P.R.ww,Y,P.R.ww,P.R.wh);X.restore()}
  return}
 const Xs=lo?X0-OV+el:X0,Xe=ro?X1+OV-er:X1;
 if(!lo||!ro){X.save();X.beginPath();X.rect(lo?X0-OV-2:X0,Y-80,(ro?X1+OV+2:X1)-(lo?X0-OV-2:X0),P.rows*k+160);X.clip()}
 strip(r,P,Xs,Xe,Y,v0-10,v1+10);
 if(lo&&Xs+fw*2>v0-10&&X0-OV<v1)X.drawImage(P.L,X0-OV,Y,P.L.ww,P.L.wh);
 if(ro&&Xe>v0-10&&Xe-fw*2<v1)X.drawImage(P.R,Xe-2*fw,Y,P.R.ww,P.R.wh);
 if(!lo||!ro)X.restore()}
// основной вызов из drawTiles: тело + кромки обрывов + шапки
function draw(x0,x1){const r=R[cur]&&prep(cur);if(!r)return false;const v0=CAM.x,v1=CAM.x+WV,c=r.c;
 // 1) тело: вертикальные пролёты сплошных клеток (одинарные парящие плиты — без тела, у них свой рисованный низ)
 const body=(tx,ty)=>{const v=tileAt(tx,ty);if(v!=1)return false;if(ty<10&&isTop(tx,ty)&&open(tileAt(tx,ty+1)))return !floatRun(tx,ty);return true};
 for(let tx=x0;tx<x1;tx++){let ty=0;const x=tx*T;while(ty<14){const b0=ty<12?body(tx,ty):tileAt(tx,11)==1;if(!b0){ty++;continue}let e=ty;while(e+1<14&&(e+1<12?body(tx,e+1):tileAt(tx,11)==1))e++;
   X.fillStyle=r.pat;X.fillRect(x,ty*T,T+.5,(e-ty+1)*T+.5);ty=e+1}}
 // глубже — темнее (только в толще земли)
 X.save();X.beginPath();for(let tx=x0;tx<x1;tx++)if(tileAt(tx,11)==1)X.rect(tx*T,10*T,T+.5,4*T);X.clip();const gg=X.createLinearGradient(0,10*T+40,0,13*T);gg.addColorStop(0,'rgba(15,8,25,0)');gg.addColorStop(1,'rgba(15,8,25,.42)');X.fillStyle=gg;X.fillRect(x0*T,10*T,(x1-x0)*T,4*T);X.restore();
 // 2) кромки обрывов у сплошных клеток: мягкая тень внутрь + неровный тёмный контур
 for(let ty=0;ty<12;ty++)for(let tx=x0;tx<x1;tx++){if(!body(tx,ty))continue;const x=tx*T,y=ty*T;
  for(const d of[1,-1]){if(!open(tileAt(tx-d,ty)))continue;const ex=d>0?x:x+T;const g=X.createLinearGradient(ex,0,ex+d*22,0);g.addColorStop(0,'rgba(20,10,25,.42)');g.addColorStop(1,'rgba(20,10,25,0)');X.fillStyle=g;X.fillRect(d>0?ex:ex-22,y,22,T+.5);
   X.strokeStyle=c.edge;X.lineWidth=4;X.beginPath();for(let k=0;k<=6;k++){const yy=y+k*T/6,w=((tx*31+ty*17+k*7)%5)*1.2;k?X.lineTo(ex+d*(2+w),yy):X.moveTo(ex+d*(2+w),yy)}X.stroke()}
  if(ty<11&&open(tileAt(tx,ty+1))){const g=X.createLinearGradient(0,y+T-16,0,y+T);g.addColorStop(0,'rgba(20,10,25,0)');g.addColorStop(1,'rgba(20,10,25,.4)');X.fillStyle=g;X.fillRect(x,y+T-16,T+.5,16)}}
 // 3) шапки: прогоны верхних клеток, от начала прогона (фаза полосы непрерывна)
 for(let ty=0;ty<12;ty++){let tx=x0;while(tx<x1){if(!isTop(tx,ty)){tx++;continue}let a=tx,b=tx;while(a>0&&isTop(a-1,ty))a--;while(b<L.w-1&&isTop(b+1,ty))b++;run(r,ty,a,b,v0,v1);tx=b+1}}
 return true}
// шапка на склоне (тайлы 5/6): короткая полоса, повёрнутая по склону
function slope(v,x,y){const r=R[cur]&&prep(cur);if(!r)return false;const k=r.k,P=r.cap,len=T*Math.SQRT2+16,u=((x*1.7)%(r.m.p*k-len-2));
 X.save();if(v==5){X.translate(x,y+T);X.rotate(-Math.PI/4)}else{X.translate(x,y);X.rotate(Math.PI/4)}
 X.translate(-8,0);X.drawImage(P.S,u*r.Q,0,len*r.Q,P.S.height,0,r.c.sink*.6-r.m.s*k,len,P.S.wh);X.restore();return true}
const OFF=/[?&]terr=0/.test(location.search);
function ready(){return !OFF&&!!(R[cur]&&prep(cur))}
function pat(){const r=R[cur]&&prep(cur);return r?r.pat:null}
return {load,draw,slope,ready,pat,M,CF}})();
self.TERR=TERR;
