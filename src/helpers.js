/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function req(p,d){const k=V.m[IDX[p]][IDX[d]];const days=(V.d[p]||{})[d]||0;return{k:k==='-'?'S':k,days}}
function stay(r){if(r.k!=='F')return'';return r.days?r.days+' days':'No limit'}
const name=c=>META[c]?META[c].n:c;
const iso=c=>`<span class="iso">${c}</span>`;
function stats(c,dir){const s={F:0,T:0,A:0,E:0,V:0,X:0};CODES.forEach(o=>{if(o!==c)s[dir==='out'?req(c,o).k:req(o,c).k]++});return s}
const mob=s=>s.F+s.T+s.A;
const MOB={},OPEN={};CODES.forEach(c=>{MOB[c]=mob(stats(c,'out'));OPEN[c]=mob(stats(c,'in'))});
const mobTiers=[...new Set(Object.values(MOB))].sort((a,b)=>b-a);
const rankOf=c=>mobTiers.indexOf(MOB[c])+1;
const ordinalPassports=c=>CODES.filter(o=>MOB[o]>MOB[c]).length+1;

/* ---------- state ---------- */
let sel='TUR',mode='out',filter=null,tab='list',q='',focus=null;
try{const s=localStorage.getItem('ba.sel');if(s&&IDX[s]!==undefined)sel=s;const m=localStorage.getItem('ba.mode');if(m==='in'||m==='out')mode=m;const t=localStorage.getItem('ba.tab');if(t==='list'||t==='entry')tab=t}catch(e){}
function save(){try{localStorage.setItem('ba.sel',sel);localStorage.setItem('ba.mode',mode);localStorage.setItem('ba.tab',tab)}catch(e){}}
const relReq=c=>mode==='out'?req(sel,c):req(c,sel);
const keyOf=c=>!c||IDX[c]===undefined?null:(c===sel?'S':relReq(c).k);

