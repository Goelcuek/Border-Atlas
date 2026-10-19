(function(){
const V=window.VISA, CODES=V.codes, IDX={}; CODES.forEach((c,i)=>IDX[c]=i);
const META={}; V.countries.forEach(c=>META[c.c]=c);
if(META.XKX&&!META.XKX.tz.length)META.XKX.tz=['Europe/Belgrade'];
const N=CODES.length;
const ORDER=['F','T','A','E','V','X'];
const REGIONS=['Europe','Asia','Africa','Americas','Oceania'];

/* ---------- language ---------- */
let lang='en';
try{lang=localStorage.getItem('ba.lang')||((navigator.language||'').toLowerCase().startsWith('tr')?'tr':'en')}catch(e){lang=(navigator.language||'').toLowerCase().startsWith('tr')?'tr':'en'}
if(lang!=='tr'&&lang!=='en')lang='en';
const I18N={
en:{
  from:'From',to:'To',fromT:'Where this passport can go',toT:'Who can enter this country',
  search:'Search 199 countries',noMatch:'No country matches',
  chipOut:n=>`<b>${n}</b> countries without a visa`,chipIn:n=>`<b>${n}</b> nationalities admitted`,details:'Details',
  tOverview:'Overview',tListOut:'Destinations',tListIn:'Nationalities',tEntry:'Entry rules',
  ledeOut:(n,t)=>`Citizens can enter <b>${n}</b> of ${t} countries without arranging a visa first.`,
  ledeIn:(n,t)=>`<b>${n}</b> of ${t} nationalities can enter without arranging a visa first.`,
  figReach:'Visa-free reach',figRank:'Passport rank',figAdmit:'Nationalities admitted',
  byDest:'Requirement by destination',byNat:'Requirement by nationality',byRegion:'By region · no visa needed in advance',
  aboutC:'About the country',
  filterOut:'Filter destinations',filterIn:'Filter nationalities',
  filterNote:l=>`Showing ${l.toLowerCase()} only. Tap the category in the legend again to show all.`,
  days:n=>`${n} days`,daysShort:n=>`${n} d`,noLimit:'No limit',
  passportOf:n=>`${n} passport`,selected:'Selected country',territory:'Territory, not in the dataset',
  verdictStay:n=>`Stay up to ${n} days without a visa.`,schengenNote:' Schengen days count across all member states.',
  fom:'Freedom of movement. A national ID card is usually enough.',noFixed:'No visa and no fixed limit for visits.',
  prep:'What to prepare',reverse:'Reverse direction',reciprocal:'reciprocal',facts:'Country facts',neighbours:'Land neighbours',
  rules:'Entry rules',admitsLine:(n,t)=>`Admits ${n} of ${t} nationalities without a prior visa`,
  select:'Select this country',close:'Close',
  capital:'Capital',localTime:'Local time',population:'Population',area:'Area',currency:'Currency',languages:'Languages',
  dialling:'Dialling code',domain:'Internet domain',driving:'Drives on the',right:'right',left:'left',
  timezones:n=>`${n} time zones`,landlocked:'Landlocked',popYear:'2018 est.',
  diff:h=>h===0?'same time as you':(h>0?`${fmtH(h)} h ahead`:`${fmtH(-h)} h behind`),
  generic:'General guidance derived from the visa data. Confirm details with the official source.',
  gMost:'Most visitors',gMostT:(l,n,t)=>`${l}: applies to ${n} of ${t} nationalities.`,
  gPass:'Passport',gPassT:'Carry a passport valid at least 6 months beyond arrival with a blank page. Airlines often enforce this even where the law is looser.',
  gProof:'Proof',gProofT:'Expect to show a return or onward ticket, where you are staying, and enough money for the trip.',
  gVoa:'Visa on arrival',gVoaT:n=>`Available to ${n} nationalities. Carry US dollars or euros in cash and spare passport photos in case cards are not accepted.`,
  gEv:'e-Visa',gEvT:n=>`Available to ${n} nationalities. Apply on the government portal and avoid look-alike agency sites.`,
  gHealth:'Health',gHealthT:'A yellow fever certificate may be required, especially if you arrive from or transit through a risk country.',
  iata:'IATA Travel Centre',
  foot:`<div>Visa matrix from the <a href="https://github.com/ilyankou/passport-index-dataset" target="_blank" rel="noopener">Passport Index open dataset</a> (January 2025), corrected for: UK ETA for all visa-exempt visitors, Israel ETA-IL, Brazil visas for US/Canadian/Australian citizens, and China's 30-day visa-free list (incl. UK, Canada, Russia). Reviewed October 2026.</div><div>Covers ordinary passports on short tourist visits. Rules change often; confirm with the official source or your airline before travelling.</div><div>Country facts: mledoze/countries, country-json (population 2018), countries-and-timezones. Borders: Natural Earth; disputed areas are shown as in the source and imply no position.</div>`
},
tr:{
  from:'Gidiş',to:'Geliş',fromT:'Bu pasaportla nereye gidilebilir',toT:'Bu ülkeye kimler girebilir',
  search:'199 ülkede ara',noMatch:'Eşleşen ülke yok',
  chipOut:n=>`<b>${n}</b> ülkeye ön vize olmadan`,chipIn:n=>`<b>${n}</b> vatandaşlık ön vizesiz girer`,details:'Ayrıntılar',
  tOverview:'Genel bakış',tListOut:'Ülkeler',tListIn:'Vatandaşlıklar',tEntry:'Giriş kuralları',
  ledeOut:(n,t)=>`${t} ülkeden <b>${n}</b> tanesine önceden vize almadan girilebilir.`,
  ledeIn:(n,t)=>`${t} ülkeden <b>${n}</b> ülkenin vatandaşları önceden vize almadan girebilir.`,
  figReach:'Ön vizesiz erişim',figRank:'Pasaport sırası',figAdmit:'Kabul edilen vatandaşlık',
  byDest:'Gidilen ülkeye göre gereklilik',byNat:'Vatandaşlığa göre gereklilik',byRegion:'Bölgelere göre · önceden vize gerekmeyen',
  aboutC:'Ülke bilgileri',
  filterOut:'Ülke ara',filterIn:'Vatandaşlık ara',
  filterNote:l=>`Yalnızca “${l}” gösteriliyor. Tümünü görmek için alttaki kategoriye tekrar dokunun.`,
  days:n=>`${n} gün`,daysShort:n=>`${n} g`,noLimit:'Süresiz',
  passportOf:n=>`${n} pasaportu`,selected:'Seçili ülke',territory:'Bölge, veri setinde yok',
  verdictStay:n=>`Vizesiz ${n} güne kadar kalabilirsiniz.`,schengenNote:' Schengen günleri tüm üye ülkelerde birlikte sayılır.',
  fom:'Serbest dolaşım. Genellikle kimlik kartı yeterlidir.',noFixed:'Vize ve sabit kalış sınırı yok.',
  prep:'Hazırlık',reverse:'Ters yön',reciprocal:'karşılıklı',facts:'Ülke bilgileri',neighbours:'Kara komşuları',
  rules:'Giriş kuralları',admitsLine:(n,t)=>`${t} vatandaşlıktan ${n} tanesini ön vizesiz kabul ediyor`,
  select:'Bu ülkeyi seç',close:'Kapat',
  capital:'Başkent',localTime:'Yerel saat',population:'Nüfus',area:'Yüzölçümü',currency:'Para birimi',languages:'Diller',
  dialling:'Telefon kodu',domain:'İnternet uzantısı',driving:'Trafik',right:'sağdan akar',left:'soldan akar',
  timezones:n=>`${n} saat dilimi`,landlocked:'Denize kıyısı yok',popYear:'2018 tahmini',
  diff:h=>h===0?'sizinle aynı saat':(h>0?`${fmtH(h)} sa ileride`:`${fmtH(-h)} sa geride`),
  generic:'Vize verilerinden üretilmiş genel bilgiler. Ayrıntıları resmî kaynaktan doğrulayın.',
  gMost:'Ziyaretçilerin çoğu',gMostT:(l,n,t)=>`${l}: ${t} vatandaşlıktan ${n} tanesi için geçerli.`,
  gPass:'Pasaport',gPassT:'Varıştan sonra en az 6 ay geçerli ve boş sayfası olan bir pasaport taşıyın. Havayolları, yasa daha esnek olsa bile bunu sıklıkla uygular.',
  gProof:'Belgeler',gProofT:'Dönüş veya devam bileti, konaklama yeri ve seyahat için yeterli para göstermeniz istenebilir.',
  gVoa:'Kapıda vize',gVoaT:n=>`${n} ülke vatandaşına açık. Kart geçmeyebilir; yanınızda dolar veya euro nakit ve yedek vesikalık fotoğraf bulundurun.`,
  gEv:'e-Vize',gEvT:n=>`${n} ülke vatandaşına açık. Resmî devlet portalından başvurun, benzer görünen aracı sitelerden kaçının.`,
  gHealth:'Sağlık',gHealthT:'Özellikle riskli bir ülkeden geliyor veya aktarma yapıyorsanız sarıhumma sertifikası istenebilir.',
  iata:'IATA Seyahat Merkezi',
  foot:`<div>Vize verileri: <a href="https://github.com/ilyankou/passport-index-dataset" target="_blank" rel="noopener">Passport Index açık veri seti</a> (Ocak 2025); şu değişikliklerle güncellendi: tüm vizesiz ziyaretçiler için İngiltere ETA'sı, İsrail ETA-IL, Brezilya'nın ABD/Kanada/Avustralya vatandaşlarına vize zorunluluğu ve Çin'in 30 günlük vizesiz listesi (İngiltere, Kanada ve Rusya dahil). Ekim 2026'da gözden geçirildi.</div><div>Kısa süreli turistik seyahatlerde umuma mahsus pasaportları kapsar. Kurallar sık değişir; seyahatten önce resmî kaynaktan veya havayolunuzdan teyit edin.</div><div>Ülke bilgileri: mledoze/countries, country-json (2018 nüfusu), countries-and-timezones. Sınırlar: Natural Earth; tartışmalı bölgeler kaynaktaki gibi gösterilir ve bir görüş bildirmez.</div>`
}};
function fmtH(h){return Number.isInteger(h)?String(h):h.toFixed(1).replace('.',lang==='tr'?',':'.')}
const t=(k,...a)=>{const s=I18N[lang][k]!==undefined?I18N[lang][k]:I18N.en[k];return typeof s==='function'?s(...a):(s===undefined?k:s)};
const CATDEF={
  F:{color:'--c-free',en:['Visa-free','Visa-free','No visa needed. Show your passport at the border.'],tr:['Vizesiz','Vizesiz','Vize gerekmez. Sınırda pasaportunuzu göstermeniz yeterli.']},
  T:{color:'--c-eta',en:['Travel authorisation','eTA','No visa, but an online authorisation (ETA, ESTA, eTA) must be approved before you board.'],tr:['Elektronik seyahat izni','eTA','Vize gerekmez, ancak uçağa binmeden önce çevrimiçi bir seyahat izni (ETA, ESTA, eTA) onaylanmalıdır.']},
  A:{color:'--c-voa',en:['Visa on arrival','On arrival','Visa issued at the airport or border on arrival, usually for a fee. Often also available online in advance.'],tr:['Kapıda vize','Kapıda vize','Vize varışta havalimanında veya sınır kapısında, genellikle ücret karşılığı verilir. Çoğu zaman önceden çevrimiçi de alınabilir.']},
  E:{color:'--c-evisa',en:['e-Visa','e-Visa','Apply and pay online before travel, and carry the approval.'],tr:['e-Vize','e-Vize','Seyahatten önce çevrimiçi başvurup ödeme yapın ve onayı yanınızda taşıyın.']},
  V:{color:'--c-req',en:['Visa required','Visa required','Get a visa in advance through an embassy, consulate or visa centre.'],tr:['Vize gerekli','Vize gerekli','Vizeyi önceden büyükelçilik, konsolosluk veya vize merkezi aracılığıyla almanız gerekir.']},
  X:{color:'--c-no',en:['No admission','No entry','Holders of this passport are currently refused entry or entry is suspended.'],tr:['Giriş yasak','Giriş yasak','Bu pasaport sahiplerinin girişi şu anda reddediliyor veya askıya alınmış durumda.']},
  S:{color:'--c-self',en:['Selected country','Selected',''],tr:['Seçili ülke','Seçili','']}
};
const CAT={};Object.keys(CATDEF).forEach(k=>{CAT[k]={color:CATDEF[k].color,get label(){return CATDEF[k][lang][0]},get short(){return CATDEF[k][lang][1]},get desc(){return CATDEF[k][lang][2]}}});
const PREP={
 en:{F:['Passport valid for the whole stay; 6 months beyond arrival is safest.','Return or onward ticket.','Accommodation details and enough money for the trip may be checked.'],
     T:['Apply online before you book, or at least 72 hours before departure.','Use the official government site; agency sites charge extra.','Apply with the same passport you will travel on.'],
     A:['The fee is usually paid at the border; carry US dollars or euros in cash.','Hotel booking and return ticket.','A passport photo may be needed. Check whether an online version lets you skip the queue.'],
     E:['Apply online, usually 3–10 days before travel.','You will need a passport scan and a photo.','Print the approval or keep it on your phone.'],
     V:['Book an appointment at the consulate or visa centre 4–8 weeks ahead.','Typical documents: application form, photos, bank statements, travel insurance, hotel and flight reservations, employer or school letter.','Fingerprints may be taken at the appointment.'],
     X:['Entry is not possible with this passport at present.','Check whether another passport or a special permit applies.']},
 tr:{F:['Pasaport kalış boyunca geçerli olmalı; varıştan sonra 6 ay en güvenlisidir.','Dönüş veya devam bileti.','Konaklama bilgisi ve seyahat için yeterli para sorulabilir.'],
     T:['Bilet almadan önce veya kalkıştan en az 72 saat önce çevrimiçi başvurun.','Resmî devlet sitesini kullanın; aracı siteler ek ücret alır.','Seyahat edeceğiniz pasaportla başvurun.'],
     A:['Ücret genellikle sınırda ödenir; yanınızda dolar veya euro nakit bulundurun.','Otel rezervasyonu ve dönüş bileti.','Vesikalık fotoğraf gerekebilir. Sırayı atlamak için çevrimiçi seçenek olup olmadığına bakın.'],
     E:['Genellikle seyahatten 3–10 gün önce çevrimiçi başvurun.','Pasaport taraması ve fotoğraf gerekir.','Onayın çıktısını alın veya telefonunuzda saklayın.'],
     V:['Konsolosluk veya vize merkezinden 4–8 hafta önceden randevu alın.','Genelde istenen belgeler: başvuru formu, fotoğraf, banka dökümü, seyahat sigortası, otel ve uçuş rezervasyonu, işveren veya okul yazısı.','Randevuda parmak izi alınabilir.'],
     X:['Bu pasaportla şu anda giriş mümkün değil.','Başka bir pasaport veya özel izin seçeneği olup olmadığını kontrol edin.']}
};
const REG_TR={Europe:'Avrupa',Asia:'Asya',Africa:'Afrika',Americas:'Amerika',Oceania:'Okyanusya',Antarctic:'Antarktika'};
const SUB_TR={'Western Asia':'Batı Asya','Southern Europe':'Güney Avrupa','Northern Europe':'Kuzey Avrupa','Western Europe':'Batı Avrupa','Eastern Europe':'Doğu Avrupa','Central Europe':'Orta Avrupa','Southeast Europe':'Güneydoğu Avrupa','Central Asia':'Orta Asya','South-Eastern Asia':'Güneydoğu Asya','Eastern Asia':'Doğu Asya','Southern Asia':'Güney Asya','Northern Africa':'Kuzey Afrika','Western Africa':'Batı Afrika','Eastern Africa':'Doğu Afrika','Middle Africa':'Orta Afrika','Southern Africa':'Güney Afrika','North America':'Kuzey Amerika','Central America':'Orta Amerika','South America':'Güney Amerika','Caribbean':'Karayipler','Australia and New Zealand':'Avustralya ve Yeni Zelanda','Melanesia':'Melanezya','Micronesia':'Mikronezya','Polynesia':'Polinezya'};
const regName=r=>lang==='tr'?(REG_TR[r]||r):r;
const subName=r=>lang==='tr'?(SUB_TR[r]||r):r;

/*PROFILES*/
/*PROFILES_TR*/
const prof=c=>(lang==='tr'?P_TR:P)[c];

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function req(p,d){const k=V.m[IDX[p]][IDX[d]];const days=(V.d[p]||{})[d]||0;return{k:k==='-'?'S':k,days}}
function stay(r){if(r.k!=='F')return'';return r.days?t('days',r.days):t('noLimit')}
const name=c=>META[c]?((lang==='tr'&&META[c].tr)||META[c].n):c;
const iso=c=>`<span class="iso">${c}</span>`;
function stats(c,dir){const s={F:0,T:0,A:0,E:0,V:0,X:0};CODES.forEach(o=>{if(o!==c)s[dir==='out'?req(c,o).k:req(o,c).k]++});return s}
const mob=s=>s.F+s.T+s.A;
const MOB={},OPEN={};CODES.forEach(c=>{MOB[c]=mob(stats(c,'out'));OPEN[c]=mob(stats(c,'in'))});
const ordinalPassports=c=>CODES.filter(o=>MOB[o]>MOB[c]).length+1;
const loc=()=>lang==='tr'?'tr-TR':'en-GB';
let DN={};function dn(type,code,fallback){try{const key=lang+type;if(!DN[key])DN[key]=new Intl.DisplayNames([lang],{type});const r=DN[key].of(code);return r&&r.toLowerCase()!==String(code).toLowerCase()?r:fallback}catch(e){return fallback}}
const langNames=m=>m.lc.map((c,i)=>{const r=dn('language',c,m.lang[i]);return r.charAt(0).toLocaleUpperCase(loc())+r.slice(1)}).join(', ');
const curNames=m=>m.cur.map(([code,sym,nm])=>`${dn('currency',code,nm)} (${code}${sym?' '+sym:''})`).join(', ');
function tzOffset(tz,d){try{const p=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset'}).formatToParts(d).find(x=>x.type==='timeZoneName').value;const m=p.match(/GMT([+-])(\d{2}):?(\d{2})?/);if(!m)return 0;return(m[1]==='-'?-1:1)*(+m[2]*60+(+m[3]||0))}catch(e){return null}}
function localTime(c){
  const m=META[c];if(!m||!m.tz||!m.tz.length)return null;
  const tz=m.tz[0],d=new Date();
  let s;try{s=new Intl.DateTimeFormat(loc(),{timeZone:tz,weekday:'short',hour:'2-digit',minute:'2-digit'}).format(d)}catch(e){return null}
  let diff='';const ms=META[sel];
  if(c!==sel&&ms&&ms.tz&&ms.tz.length){const a=tzOffset(tz,d),b=tzOffset(ms.tz[0],d);if(a!==null&&b!==null)diff=t('diff',(a-b)/60)}
  return{s,diff,multi:m.ntz>1?t('timezones',m.ntz):''};
}
const nf=(n,o)=>new Intl.NumberFormat(loc(),o).format(n);

/* ---------- state ---------- */
let sel='TUR',mode='out',filter=null,tab='overview',q='',focus=null;
try{const s=localStorage.getItem('ba.sel');if(s&&IDX[s]!==undefined)sel=s;const m=localStorage.getItem('ba.mode');if(m==='in'||m==='out')mode=m;const tb=localStorage.getItem('ba.tab3');if(['overview','list','entry'].includes(tb))tab=tb}catch(e){}
function save(){try{localStorage.setItem('ba.sel',sel);localStorage.setItem('ba.mode',mode);localStorage.setItem('ba.tab3',tab);localStorage.setItem('ba.lang',lang)}catch(e){}}
const relReq=c=>mode==='out'?req(sel,c):req(c,sel);
const keyOf=c=>!c||IDX[c]===undefined?null:(c===sel?'S':relReq(c).k);

/*MAPCODE*/

/* =========================================================
   FLOATING UI
   ========================================================= */
const isPhone=()=>matchMedia('(max-width:720px)').matches;
const scrim=$('#scrim');
function syncScrim(){scrim.classList.toggle('on',!$('#info').hidden||!$('#detail').hidden)}
scrim.onclick=()=>{closeInfo();closeDetail()};

/* ---------- picker ---------- */
const pick=$('#pick'),pin=$('#pickIn'),plist=$('#pickList');
let active=0,shown=[];
function sortedCountries(){return[...V.countries].sort((a,b)=>name(a.c).localeCompare(name(b.c),loc()))}
function renderPick(f){
  const q2=(f||'').toLocaleLowerCase(loc()).trim();
  shown=sortedCountries().filter(c=>!q2||c.n.toLowerCase().includes(q2)||(c.tr||'').toLocaleLowerCase('tr-TR').includes(q2)||c.c.toLowerCase()===q2||(c.o||'').toLowerCase().includes(q2));
  active=Math.max(0,q2?0:shown.findIndex(c=>c.c===sel));
  plist.innerHTML=shown.map((c,i)=>`<li role="option" data-c="${c.c}" aria-selected="${i===active}">${iso(c.c)}${esc(name(c.c))}<small>${esc(regName(c.r))}</small></li>`).join('')||`<li class="empty">${t('noMatch')}</li>`;
}
function openPick(){closeInfo();closeDetail();pick.hidden=false;pin.value='';pin.placeholder=t('search');renderPick('');const a=plist.children[active];if(a)a.scrollIntoView({block:'center'});if(!isPhone())pin.focus();else setTimeout(()=>pin.focus(),50)}
function closePick(){pick.hidden=true}
$('#who').onclick=openPick;$('#pickX').onclick=closePick;
pin.addEventListener('input',()=>renderPick(pin.value));
pin.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!shown.length)return;active=(active+(e.key==='ArrowDown'?1:-1)+shown.length)%shown.length;[...plist.children].forEach((li,i)=>li.setAttribute('aria-selected',i===active));plist.children[active].scrollIntoView({block:'nearest'})}
  else if(e.key==='Enter'){e.preventDefault();if(shown[active])choose(shown[active].c)}
  else if(e.key==='Escape')closePick();
});
plist.addEventListener('click',e=>{const li=e.target.closest('li[data-c]');if(li)choose(li.dataset.c)});
document.addEventListener('pointerdown',e=>{if(!pick.hidden&&!pick.contains(e.target)&&!e.target.closest('#who'))closePick()});
function choose(c){sel=c;filter=null;q='';focus=null;closePick();closeDetail();save();renderAll();zoomTo(c)}

/* ---------- direction + language ---------- */
function setMode(m){mode=m;filter=null;save();renderAll();if(!$('#detail').hidden&&focus&&focus!==sel)openDetail(focus)}
$('#modeOut').onclick=()=>setMode('out');$('#modeIn').onclick=()=>setMode('in');
function setLang(l){lang=l;save();WCACHE.clear();renderAll();if(!$('#detail').hidden&&focus)openDetail(focus);if(!pick.hidden){pin.placeholder=t('search');renderPick(pin.value)}}
$('#lTR').onclick=()=>setLang('tr');$('#lEN').onclick=()=>setLang('en');

/* ---------- legend ---------- */
function renderLegend(){
  const s=stats(sel,mode),L=$('#legend');
  L.className='float card'+(filter?' filtering':'');
  L.innerHTML=ORDER.filter(k=>s[k]).map(k=>`<button data-k="${k}" aria-pressed="${filter===k}" title="${esc(CAT[k].label)}"><i style="background:var(${CAT[k].color})"></i>${CAT[k].short}<b>${s[k]}</b></button>`).join('');
  L.querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=filter===b.dataset.k?null:b.dataset.k;renderLegend();schedule();if(!$('#info').hidden&&tab==='list')renderInfo()});
}

/* ---------- info chip + popup ---------- */
function barHTML(s,cls){const tt=ORDER.reduce((a,k)=>a+s[k],0)||1;return`<div class="${cls||'bar'}">${ORDER.map(k=>s[k]?`<span style="width:${(s[k]/tt*100).toFixed(2)}%;background:var(${CAT[k].color})"></span>`:'').join('')}</div>`}
function renderChip(){
  const s=stats(sel,mode);
  $('#infoBtn').innerHTML=`${barHTML(s,'mini')}<span>${mode==='out'?t('chipOut',MOB[sel]):t('chipIn',OPEN[sel])}</span><span class="more">${t('details')}</span>`;
}
$('#infoBtn').onclick=()=>{if($('#info').hidden)openInfo();else closeInfo()};
function openInfo(tb){if(tb)tab=tb;closePick();if(isPhone())closeDetail();$('#info').hidden=false;renderInfo();syncScrim()}
function closeInfo(){$('#info').hidden=true;syncScrim()}
$('#infoX').onclick=closeInfo;
document.querySelectorAll('#info .tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;save();renderInfo();$('#infoBody').scrollTop=0});

function renderInfo(){
  if($('#info').hidden)return;
  const m=META[sel];
  $('#infoTitle').textContent=name(sel);
  $('#infoSub').innerHTML=`${iso(sel)}${esc([subName(m.sr||m.r),m.cap].filter(Boolean).join(' · '))}`;
  $('#t-overview').textContent=t('tOverview');
  $('#t-list').textContent=mode==='out'?t('tListOut'):t('tListIn');
  $('#t-entry').textContent=t('tEntry');
  $('#infoX').setAttribute('aria-label',t('close'));
  document.querySelectorAll('#info .tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===tab));
  const body=$('#infoBody');
  if(tab==='overview')body.innerHTML=overviewHTML();
  else if(tab==='entry')body.innerHTML=entryHTML(sel,true);
  else{body.innerHTML=listHTML();bindList()}
  bindNb(body);
}
function overviewHTML(){
  const s=stats(sel,mode),T_=N-1;
  const regs=REGIONS.map(r=>{const st={F:0,T:0,A:0,E:0,V:0,X:0};let n=0,ok=0;CODES.forEach(c=>{if(c===sel||META[c].r!==r)return;const k=relReq(c).k;st[k]++;n++;if('FTA'.includes(k))ok++});return`<tr><td>${regName(r)}</td><td>${barHTML(st)}</td><td>${ok}/${n}</td></tr>`}).join('');
  return`<p class="lede">${mode==='out'?t('ledeOut',MOB[sel],T_):t('ledeIn',OPEN[sel],T_)}</p>
   <div class="figs"><div><b>${MOB[sel]}</b><span>${t('figReach')}</span></div><div><b>${ordinalPassports(sel)}<small style="font-size:12px;color:var(--muted);font-weight:500"> / ${N}</small></b><span>${t('figRank')}</span></div><div><b>${OPEN[sel]}</b><span>${t('figAdmit')}</span></div></div>
   <h3 class="lbl">${mode==='out'?t('byDest'):t('byNat')}</h3>${barHTML(s)}
   <ul class="leg">${ORDER.filter(k=>s[k]).map(k=>`<li><i style="background:var(${CAT[k].color})"></i><span>${CAT[k].label}</span><span class="n">${s[k]}</span><span class="p">${Math.round(s[k]/T_*100)}%</span></li>`).join('')}</ul>
   <h3 class="lbl">${t('byRegion')}</h3><table class="reg">${regs}</table>
   <h3 class="lbl">${t('aboutC')}</h3>${factsHTML(sel)}
   ${nbHTML(sel)}
   <div class="foot">${t('foot')}</div>`;
}
function listHTML(){
  const groups=ORDER.map(k=>({k,items:CODES.filter(c=>c!==sel&&relReq(c).k===k&&(!q||name(c).toLocaleLowerCase(loc()).includes(q)||META[c].n.toLowerCase().includes(q))).sort((a,b)=>name(a).localeCompare(name(b),loc()))})).filter(g=>g.items.length&&(!filter||g.k===filter));
  return`<input class="filter" id="q" type="search" placeholder="${mode==='out'?t('filterOut'):t('filterIn')}" value="${esc(q)}">
   ${filter?`<p class="generic" style="margin:4px 0 0">${t('filterNote',CAT[filter].label)}</p>`:''}
   ${groups.length?groups.map(g=>`<div class="grp"><h4><i style="background:var(${CAT[g.k].color})"></i>${CAT[g.k].label}<span>${g.items.length}</span></h4>${g.items.map(c=>{const r=relReq(c);return`<button class="row${c===focus?' on':''}" data-c="${c}">${iso(c)}<span class="nm">${esc(name(c))}</span><span class="d">${stay(r)}</span></button>`}).join('')}</div>`).join(''):`<p class="empty">${t('noMatch')}</p>`}`;
}
function bindList(){
  const qi=$('#q');
  qi.oninput=()=>{q=qi.value.toLocaleLowerCase(loc()).trim();const p=qi.selectionStart;renderInfo();const n=$('#q');n.focus();n.setSelectionRange(p,p)};
  document.querySelectorAll('#infoBody .row').forEach(b=>b.onclick=()=>{const c=b.dataset.c;if(isPhone())closeInfo();openDetail(c);zoomTo(c)});
}
function factsHTML(c){
  const m=META[c],lt=localTime(c),rows=[];
  if(m.cap)rows.push([t('capital'),esc(m.cap)]);
  if(lt)rows.push([t('localTime'),`${esc(lt.s)}${lt.diff?`<br><small>${esc(lt.diff)}</small>`:''}${lt.multi?`<br><small>${esc(lt.multi)}</small>`:''}`]);
  if(m.pop)rows.push([t('population'),`${nf(m.pop,{notation:'compact',maximumFractionDigits:1})} <small>${t('popYear')}</small>`]);
  if(m.area)rows.push([t('area'),`${nf(m.area)} km²${m.land?`<br><small>${t('landlocked')}</small>`:''}`]);
  if(m.cur.length)rows.push([t('currency'),esc(curNames(m)),true]);
  if(m.lc.length)rows.push([t('languages'),esc(langNames(m)),true]);
  if(m.idd)rows.push([t('dialling'),esc(m.idd)]);
  if(m.tld)rows.push([t('domain'),esc(m.tld)]);
  if(m.drv)rows.push([t('driving'),t(m.drv)]);
  rows.push([lang==='tr'?'Bölge':'Region',esc(subName(m.sr||m.r))]);
  // keep the two-column grid even: widen the last item if odd count among non-wide
  const nonWide=rows.filter(r=>!r[2]).length;if(nonWide%2){const last=[...rows].reverse().find(r=>!r[2]);if(last)last[2]=true}
  return`<dl class="facts">${rows.map(([a,b,w])=>`<div${w?' class="wide"':''}><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>`;
}
function nbHTML(c){
  const nbs=(META[c].b||[]).filter(x=>IDX[x]!==undefined).sort((a,b)=>name(a).localeCompare(name(b),loc()));
  if(!nbs.length)return'';
  return`<h3 class="lbl">${t('neighbours')} · ${nbs.length}</h3><div class="nbs">${nbs.map(x=>{const k=keyOf(x);const r=x===sel?null:relReq(x);return`<button class="nb" data-c="${x}" title="${esc(k==='S'?CAT.S.label:CAT[k].label+(r&&r.days?' · '+t('days',r.days):''))}"><i style="background:var(${CAT[k].color})"></i>${esc(name(x))}</button>`}).join('')}</div>`;
}
function bindNb(root){root.querySelectorAll('.nb').forEach(b=>b.onclick=()=>{const c=b.dataset.c;if(isPhone())closeInfo();openDetail(c);zoomTo(c)})}
function genericProfile(c){
  const si=stats(c,'in'),m=META[c];
  const dom=ORDER.reduce((a,k)=>si[k]>si[a]?k:a,'F');
  const items=[[t('gMost'),t('gMostT',CAT[dom].label,si[dom],N-1)],[t('gPass'),t('gPassT')],[t('gProof'),t('gProofT')]];
  if(si.A)items.push([t('gVoa'),t('gVoaT',si.A)]);
  if(si.E)items.push([t('gEv'),t('gEvT',si.E)]);
  if(m.r==='Africa'||m.sr==='South America')items.push([t('gHealth'),t('gHealthT')]);
  return{items,generic:true};
}
function rulesHTML(c){
  const p=prof(c)||genericProfile(c);
  const link=p.link||[t('iata'),'https://www.iatatravelcentre.com/'];
  return`${(p.tags||[]).length?`<div class="tags">${p.tags.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}
   <dl class="rules">${p.items.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
   ${p.generic?`<p class="generic">${t('generic')}</p>`:''}
   <a class="src" href="${link[1]}" target="_blank" rel="noopener">${esc(link[0])} ↗</a>`;
}
function entryHTML(c){
  const si=stats(c,'in');
  return`<div class="open">${barHTML(si)}<span>${OPEN[c]}/${N-1}</span></div><p class="generic" style="margin-top:4px">${t('admitsLine',OPEN[c],N-1)}</p>${rulesHTML(c)}`;
}

/* ---------- detail popup ---------- */
const detail=$('#detail');
const EUs=['AUT','BEL','BGR','HRV','CYP','CZE','DNK','EST','FIN','FRA','DEU','GRC','HUN','IRL','ITA','LVA','LTU','LUX','MLT','NLD','POL','PRT','ROU','SVK','SVN','ESP','SWE'];
function openDetail(c){
  closePick();if(isPhone())closeInfo();
  focus=c;schedule();
  if(c===sel){openInfo('overview');return}
  const from=mode==='out'?sel:c,to=mode==='out'?c:sel;
  const r=req(from,to),back=req(to,from);
  let sub=CAT[r.k].desc;
  if(r.k==='F'&&r.days)sub=t('verdictStay',r.days)+(SCH.includes(to)&&!EUs.includes(from)?t('schengenNote'):'');
  if(r.k==='F'&&!r.days)sub=EUs.includes(from)&&(EUs.includes(to)||SCH.includes(to))?t('fom'):t('noFixed');
  const prep=(PREP[lang][r.k]||[]);
  detail.innerHTML=`<div class="grab"></div><div class="ph"><div><h2>${esc(name(c))}</h2><small>${iso(from)}${esc(t('passportOf',name(from)))} → ${esc(name(to))}</small></div><button class="x" id="dx" aria-label="${t('close')}">×</button></div>
   <div class="pb" style="padding-top:4px">
     <div class="verdict"><i style="background:var(${CAT[r.k].color})"></i><div><b>${CAT[r.k].label}${r.days?' · '+t('days',r.days):''}</b><span>${esc(sub)}</span></div></div>
     ${prep.length?`<h3 class="lbl">${t('prep')}</h3><ul class="prep" style="--prep:var(${CAT[r.k].color})">${prep.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
     <h3 class="lbl">${t('reverse')}</h3><div class="back"><i style="background:var(${CAT[back.k].color})"></i>${esc(t('passportOf',name(to)))} → ${esc(name(from))}: <b>${CAT[back.k].label}${back.days?' · '+t('daysShort',back.days):''}</b>${back.k===r.k?`<span style="color:var(--faint)">(${t('reciprocal')})</span>`:''}</div>
     <h3 class="lbl">${t('rules')} · ${esc(name(to))}</h3>
     ${entryHTML(to)}
     <h3 class="lbl">${t('facts')} · ${esc(name(c))}</h3>
     ${factsHTML(c)}
     ${nbHTML(c)}
     <div><button class="btn" id="mk">${t('select')}</button></div>
   </div>`;
  detail.hidden=false;syncScrim();
  const pb=detail.querySelector('.pb');if(pb)pb.scrollTop=0;
  $('#dx').onclick=closeDetail;$('#mk').onclick=()=>choose(c);
  bindNb(detail);
  document.querySelectorAll('.row').forEach(b=>b.classList.toggle('on',b.dataset.c===c));
}
function closeDetail(){if(detail.hidden)return;detail.hidden=true;focus=null;schedule();syncScrim();document.querySelectorAll('.row.on').forEach(b=>b.classList.remove('on'))}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!pick.hidden)closePick();else if(!detail.hidden)closeDetail();else closeInfo()}});

function renderAll(){
  document.documentElement.lang=lang;
  $('#lTR').setAttribute('aria-pressed',lang==='tr');$('#lEN').setAttribute('aria-pressed',lang==='en');
  $('#modeOut').textContent=t('from');$('#modeIn').textContent=t('to');
  $('#modeOut').title=t('fromT');$('#modeIn').title=t('toT');
  $('#modeOut').setAttribute('aria-pressed',mode==='out');$('#modeIn').setAttribute('aria-pressed',mode==='in');
  $('#whoCode').textContent=sel;$('#whoName').textContent=name(sel);
  renderChip();renderLegend();renderInfo();schedule();
}
renderAll();updScale();
resize();if(isPhone()&&anchors[sel]){const a=anchors[sel],k=2.4;csel.call(zoom.transform,d3.zoomIdentity.translate(cw/2,ch*.42).scale(k).translate(-(ox+s0*a[0]),-(oy+s0*a[1])))}
setTimeout(()=>{(window.requestIdleCallback||setTimeout)(loadHigh)},1200);
if(document.fonts)document.fonts.ready.then(()=>{WCACHE.clear();schedule()});
setInterval(()=>{if(!detail.hidden&&focus)detail.querySelectorAll('.facts').length&&openDetailTimeRefresh()},60000);
function openDetailTimeRefresh(){/* keep local time fresh without resetting scroll */const pb=detail.querySelector('.pb');const st=pb?pb.scrollTop:0;openDetail(focus);const pb2=detail.querySelector('.pb');if(pb2)pb2.scrollTop=st}
})();
