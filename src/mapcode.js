/* =========================================================
   MAP — canvas renderer
   ========================================================= */
const wrap=$('#mapwrap'),canvas=$('#map'),ctx=canvas.getContext('2d');
const BW=1000,BH=520;
const world=window.WORLD;
const NUM={};V.countries.forEach(c=>{if(c.num)NUM[String(c.num).padStart(3,'0')]=c.c});
function codeOf(f){if(f.properties&&f.properties.name==='Kosovo')return'XKX';return f.id!=null?NUM[String(f.id).padStart(3,'0')]||null:null}
function prep(topo){const fc=topojson.feature(topo,topo.objects.countries);return fc.features.filter(f=>f.properties.name!=='Antarctica')}
const lowF=prep(world);
const proj=d3.geoNaturalEarth1().fitExtent([[6,6],[BW-6,BH-6]],{type:'FeatureCollection',features:lowF});
const gpath=d3.geoPath(proj);
function fixWind(f){const g=f.geometry;if(!g)return f;const polys=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];for(const p of polys){if(d3.geoArea({type:'Polygon',coordinates:p})>2*Math.PI)p.forEach(r=>r.reverse())}return f}
function makeFeat(f){fixWind(f);const b=gpath.bounds(f);return{f,code:codeOf(f),b,area:gpath.area(f),p:null,name:f.properties.name}}
const low=lowF.map(makeFeat);
low.forEach(o=>o.p=new Path2D(gpath(o.f)));
let high=null,highLoading=false;
const grat=new Path2D(gpath(d3.geoGraticule10()));
const sphere=new Path2D(gpath({type:'Sphere'}));
// label anchors and small-state dots
const shapeArea={};low.forEach(o=>{if(o.code)shapeArea[o.code]=Math.max(shapeArea[o.code]||0,o.area)});
const anchors={};V.countries.forEach(c=>{if(c.ll&&(c.ll[0]||c.ll[1])){const p=proj([c.ll[1],c.ll[0]]);if(p)anchors[c.c]=p}});
// fix anchors that fall outside their own shape (e.g. France via overseas, USA) using largest polygon centroid
low.forEach(o=>{if(!o.code||!anchors[o.code])return;const a=anchors[o.code];if(a[0]<o.b[0][0]||a[0]>o.b[1][0]||a[1]<o.b[0][1]||a[1]>o.b[1][1]){anchors[o.code]=gpath.centroid(o.f)}});
const dotList=V.countries.filter(c=>anchors[c.c]&&(shapeArea[c.c]===undefined||shapeArea[c.c]<8)).map(c=>({code:c.c,x:anchors[c.c][0],y:anchors[c.c][1],a:shapeArea[c.c]||0}));
const labelList=V.countries.filter(c=>anchors[c.c]).map(c=>({code:c.c,x:anchors[c.c][0],y:anchors[c.c][1],a:shapeArea[c.c]||0})).sort((a,b)=>b.a-a.a);

let cw=0,ch=0,dpr=1,s0=1,ox=0,oy=0,T=d3.zoomIdentity,raf=0,hover=null;
const MAXK=80;
// Adaptive rendering: while the user is panning/zooming we draw the light 50m borders; if even that can't keep up
// (slow GPU / huge screen) we transform a cached bitmap of the last frame and re-render sharply when the gesture pauses.
let interacting=false,slow=false,lastFrame=0,ema=16,snapT=null;
const snap=document.createElement('canvas'),sctx=snap.getContext('2d');
function takeSnap(){snap.width=canvas.width;snap.height=canvas.height;sctx.drawImage(canvas,0,0);snapT=T}
const zoom=d3.zoom().scaleExtent([1,MAXK])
  .on('start',()=>{interacting=true;lastFrame=0;canvas.classList.add('drag');takeSnap()})
  .on('zoom',e=>{T=e.transform;schedule();updScale();if(!tip.hidden)tip.hidden=true})
  .on('end',()=>{interacting=false;canvas.classList.remove('drag');schedule()});
const csel=d3.select(canvas).call(zoom).on('dblclick.zoom',function(e){const p=d3.pointer(e,canvas);csel.transition().duration(300).call(zoom.scaleBy,2,p)});
function resize(){
  const r=wrap.getBoundingClientRect();cw=Math.max(1,r.width);ch=Math.max(1,r.height);dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);
  s0=Math.min(cw/BW,ch/BH);ox=(cw-BW*s0)/2;oy=(ch-BH*s0)/2;
  zoom.extent([[0,0],[cw,ch]]).translateExtent([[Math.min(0,ox)-cw*.15,Math.min(0,oy)-ch*.15],[Math.max(cw,ox+BW*s0)+cw*.15,Math.max(ch,oy+BH*s0)+ch*.15]]);
  schedule();
}
new ResizeObserver(resize).observe(wrap);
function schedule(){if(!raf)raf=requestAnimationFrame(draw)}
let col={};
function readColors(){const cs=getComputedStyle(document.documentElement);['ocean','grat','border','nodata','halo','label','ink','panel'].forEach(k=>col[k]=cs.getPropertyValue('--'+k).trim());Object.keys(CAT).forEach(k=>col[k]=cs.getPropertyValue(CAT[k].color).trim());schedule()}
readColors();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',readColors);
new MutationObserver(readColors).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

function toBase(x,y){return[((x-T.x)/T.k-ox)/s0,((y-T.y)/T.k-oy)/s0]}
function toScreen(bx,by){return[T.x+T.k*(ox+s0*bx),T.y+T.k*(oy+s0*by)]}
function fillFor(code){const k=keyOf(code);if(!k)return col.nodata;return col[k]}
function drawSnap(){
  const r=T.k/snapT.k,tx=T.x-snapT.x*r,ty=T.y-snapT.y*r;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=col.ocean;ctx.fillRect(0,0,cw,ch);
  ctx.setTransform(dpr*r,0,0,dpr*r,dpr*tx,dpr*ty);ctx.imageSmoothingEnabled=true;ctx.drawImage(snap,0,0,cw,ch);
}
function draw(){
  raf=0;
  const now=performance.now();
  if(interacting){if(lastFrame&&now-lastFrame<250)ema=ema*.7+(now-lastFrame)*.3;lastFrame=now;if(ema>26)slow=true}
  if(interacting&&slow&&snapT){
    const r=T.k/snapT.k,dx=Math.abs(T.x-snapT.x*r),dy=Math.abs(T.y-snapT.y*r);
    if(r<2.2&&r>.45&&dx<cw*.35&&dy<ch*.35){drawSnap();return}
  }
  const K=T.k*s0;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle=col.ocean;ctx.fillRect(0,0,cw,ch);
  ctx.setTransform(dpr*K,0,0,dpr*K,dpr*(T.x+T.k*ox),dpr*(T.y+T.k*oy));
  const [vx0,vy0]=toBase(0,0),[vx1,vy1]=toBase(cw,ch);
  const pad=2/K;
  // graticule
  ctx.lineWidth=.6/K;ctx.strokeStyle=col.grat;ctx.stroke(grat);ctx.stroke(sphere);
  const useHigh=high&&K>3&&!interacting;
  const set=useHigh?high:low;
  const vis=[];
  for(const o of set){const b=o.b;if(b[1][0]<vx0-pad||b[0][0]>vx1+pad||b[1][1]<vy0-pad||b[0][1]>vy1+pad)continue;if(!o.p)o.p=new Path2D(gpath(o.f));vis.push(o)}
  for(const o of vis){const k=keyOf(o.code);ctx.globalAlpha=(filter&&k&&k!=='S'&&k!==filter)?.22:1;ctx.fillStyle=k?col[k]:col.nodata;ctx.fill(o.p)}
  ctx.globalAlpha=1;
  ctx.lineWidth=Math.min(.8,.5+K*.01)/K;ctx.strokeStyle=col.border;ctx.lineJoin='round';
  for(const o of vis)ctx.stroke(o.p);
  // selected + hover + focus outlines
  const outline=(code,w,c)=>{if(!code)return;ctx.lineWidth=w/K;ctx.strokeStyle=c;for(const o of vis)if(o.code===code)ctx.stroke(o.p)};
  outline(focus,2.2,col.ink);
  if(hover&&hover!==focus)outline(hover,1.4,col.ink);
  // screen space: dots, labels
  ctx.setTransform(dpr,0,0,dpr,0,0);
  for(const d of dotList){
    if(d.a*K*K>40)continue;
    const [x,y]=toScreen(d.x,d.y);if(x<-10||y<-10||x>cw+10||y>ch+10)continue;
    const k=keyOf(d.code);
    ctx.globalAlpha=(filter&&k&&k!=='S'&&k!==filter)?.25:1;
    ctx.beginPath();ctx.arc(x,y,K>6?5:K>2?4:3,0,Math.PI*2);ctx.fillStyle=k?col[k]:col.nodata;ctx.fill();
    ctx.lineWidth=(d.code===hover||d.code===focus)?2:1;ctx.strokeStyle=(d.code===hover||d.code===focus)?col.ink:col.border;ctx.stroke();
  }
  ctx.globalAlpha=1;
  if(K>=1.6)drawLabels(K);
  if(interacting&&slow)takeSnap();
  if(!interacting)slow=slow&&ema>26;
}
const WCACHE=new Map();let FONT=null;
function drawLabels(K){if(!FONT)FONT=getComputedStyle(document.body).fontFamily;
  ctx.font=`600 ${K>8?12:11}px ${FONT}`;
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  const placed=[];
  for(const l of labelList){
    const [x,y]=toScreen(l.x,l.y);if(x<0||y<0||x>cw||y>ch)continue;
    const nm=name(l.code);const ck=ctx.font+nm;let w=WCACHE.get(ck);if(w===undefined){w=ctx.measureText(nm).width;WCACHE.set(ck,w)}
    const shapePx=Math.sqrt(l.a)*K;
    if(shapePx<w*0.55&&!(l.a===0&&K>10)&&!(shapePx>0&&K>14))continue;
    const r=[x-w/2-3,y-8,x+w/2+3,y+8];
    if(placed.some(p=>!(r[2]<p[0]||r[0]>p[2]||r[3]<p[1]||r[1]>p[3])))continue;
    placed.push(r);
    const yy=l.a<8?y-12:y;
    ctx.lineWidth=3;ctx.strokeStyle=col.halo;ctx.strokeText(nm,x,yy);ctx.fillStyle=col.label;ctx.fillText(nm,x,yy);
    if(placed.length>140)break;
  }
}
function loadHigh(){
  if(high||highLoading)return;highLoading=true;
  fetch('world-10m.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(t=>{
    setTimeout(()=>{high=prep(t).map(makeFeat);schedule()},0);
  }).catch(()=>{});
}
// hit testing
const hitCtx=document.createElement('canvas').getContext('2d');
function hit(x,y){
  const K=T.k*s0;
  for(const d of dotList){if(d.a*K*K>40)continue;const [sx,sy]=toScreen(d.x,d.y);if((sx-x)**2+(sy-y)**2<81)return d.code}
  const [bx,by]=toBase(x,y);
  const set=(high&&K>3)?high:low;
  for(const o of set){const b=o.b;if(bx<b[0][0]||bx>b[1][0]||by<b[0][1]||by>b[1][1])continue;if(!o.p)o.p=new Path2D(gpath(o.f));if(hitCtx.isPointInPath(o.p,bx,by))return o.code||('?'+o.name)}
  return null;
}
const tip=$('#tip');
let moveRaf=0,lastMove=null;
canvas.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;lastMove=e;if(!moveRaf)moveRaf=requestAnimationFrame(onMove)});
function onMove(){
  moveRaf=0;const e=lastMove;if(canvas.classList.contains('drag'))return;
  const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  const h=hit(x,y);const code=h&&h[0]!=='?'?h:null;
  if(code!==hover){hover=code;schedule()}
  canvas.classList.toggle('hot',!!code);
  if(!h){tip.hidden=true;return}
  if(!code){tip.innerHTML=`<b>${esc(h.slice(1))}</b><small>${t('territory')}</small>`}
  else if(code===sel){tip.innerHTML=`<b>${esc(name(code))}</b><small>${t('selected')}</small>`}
  else{const rr=relReq(code);tip.innerHTML=`<b>${esc(name(code))}</b><small>${mode==='out'?esc(t('passportOf',name(sel))):esc(t('passportOf',name(code)))+' → '+esc(name(sel))}</small><div class="k"><i style="background:${col[rr.k]}"></i>${CAT[rr.k].label}${rr.days?' · '+t('days',rr.days):''}</div>`}
  tip.hidden=false;
  const tw=tip.offsetWidth,th=tip.offsetHeight;
  tip.style.left=Math.min(x+14,cw-tw-6)+'px';tip.style.top=Math.min(y+14,ch-th-6)+'px';
}
canvas.addEventListener('pointerleave',()=>{tip.hidden=true;if(hover){hover=null;schedule()}});
canvas.addEventListener('click',e=>{
  const r=canvas.getBoundingClientRect();const h=hit(e.clientX-r.left,e.clientY-r.top);
  if(h&&h[0]!=='?'&&IDX[h]!==undefined)openDetail(h);
});
$('#zIn').onclick=()=>csel.transition().duration(250).call(zoom.scaleBy,2);
$('#zOut').onclick=()=>csel.transition().duration(250).call(zoom.scaleBy,.5);
$('#zReset').onclick=()=>csel.transition().duration(350).call(zoom.transform,d3.zoomIdentity);
function updScale(){$('#scale').textContent=(T.k<10?T.k.toFixed(1):Math.round(T.k))+'×';$('#zIn').disabled=T.k>=MAXK-.01;$('#zOut').disabled=T.k<=1.001}
function zoomTo(code){
  const os=low.filter(o=>o.code===code);let b;
  if(os.length){b=os.reduce((m,o)=>o.area>m.area?o:m).b}else if(anchors[code]){const a=anchors[code];b=[[a[0]-4,a[1]-4],[a[0]+4,a[1]+4]]}else return;
  const [x0,y0]=[ox+s0*b[0][0],oy+s0*b[0][1]],[x1,y1]=[ox+s0*b[1][0],oy+s0*b[1][1]];
  const ph=matchMedia('(max-width:720px)').matches,vh=ph?ch*.32:ch,cy=ph?ch*.3:ch/2;
  const k=Math.max(1,Math.min(MAXK,.7/Math.max((x1-x0)/cw,(y1-y0)/vh)));
  const t=d3.zoomIdentity.translate(cw/2,cy).scale(k).translate(-(x0+x1)/2,-(y0+y1)/2);
  csel.transition().duration(600).call(zoom.transform,t);
}

