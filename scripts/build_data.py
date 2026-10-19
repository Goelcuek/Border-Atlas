import csv, json, sys
D='/root/passport-index-dataset/passport-index-tidy-iso3.csv'
C='/root/dl_countries/countries/countries.json'
rows=list(csv.DictReader(open(D)))
codes=sorted({r['Passport'] for r in rows})
idx={c:i for i,c in enumerate(codes)}
meta=json.load(open(C)); bym={m['cca3']:m for m in meta}
N=len(codes)
mat=[['-']*N for _ in codes]; days=[[0]*N for _ in codes]
M={'visa required':'V','e-visa':'E','visa on arrival':'A','visa free':'F','eta':'T','no admission':'X','-1':'-'}
for r in rows:
    p,d,q=idx[r['Passport']],idx[r['Destination']],r['Requirement']
    if q in M: mat[p][d]=M[q]
    else: mat[p][d]='F'; days[p][d]=int(q)
changes=0
def setv(p,d,v,dy=0):
    global changes
    if p not in idx or d not in idx: print('miss',p,d); return
    if mat[idx[p]][idx[d]]!=v or days[idx[p]][idx[d]]!=dy: changes+=1
    mat[idx[p]][idx[d]]=v; days[idx[p]][idx[d]]=dy
# Brazil reinstated visas Apr 2025
for p in ['USA','CAN','AUS']: setv(p,'BRA','E')
# UK ETA for all visa-exempt (EU from Apr 2025), Irish exempt
for p in codes:
    if p in ('GBR','IRL'): continue
    if mat[idx[p]][idx['GBR']]=='F': setv(p,'GBR','T')
# Israel ETA-IL from Jan 2025
for p in codes:
    if p=='ISR': continue
    if mat[idx[p]][idx['ISR']]=='F': setv(p,'ISR','T')
# China unilateral 30-day visa-free (through 31 Dec 2026) + UK/Canada (Feb 2026) + Russia (through 2027)
cn='AND ARG AUS AUT BHR BEL BRA BGR CHL HRV CYP DNK EST FIN FRA DEU GRC HUN ISL IRL ITA JPN KWT LVA LIE LUX MLT MCO MNE NLD NZL MKD NOR OMN PER POL PRT ROU SAU SVK SVN KOR ESP SWE CHE URY GBR CAN RUS'.split()
for p in cn:
    if mat[idx[p]][idx['CHN']] not in ('F',) or days[idx[p]][idx['CHN']]<30: setv(p,'CHN','F',30)
print('changes',changes)
import json as _j
SJ='/root/dl_more/country-json/src/'
ab={x['country']:x['abbreviation'] for x in _j.load(open(SJ+'country-by-abbreviation.json'))}
pop={ab[x['country']]:x['population'] for x in _j.load(open(SJ+'country-by-population.json')) if x['country'] in ab and x['population']}
drv={ab[x['country']]:x['side'] for x in _j.load(open(SJ+'country-by-driving-side.json')) if x['country'] in ab}
tz=_j.load(open('/tmp/claude-0/-home-claude/f957879e-f6de-58eb-92ce-c65dd296c516/scratchpad/tz.json'))
PRIMARY={'USA':'America/New_York','CAN':'America/Toronto','RUS':'Europe/Moscow','AUS':'Australia/Sydney','BRA':'America/Sao_Paulo','MEX':'America/Mexico_City','IDN':'Asia/Jakarta','KAZ':'Asia/Almaty','MNG':'Asia/Ulaanbaatar','CHL':'America/Santiago','ARG':'America/Argentina/Buenos_Aires','ESP':'Europe/Madrid','PRT':'Europe/Lisbon','FRA':'Europe/Paris','GBR':'Europe/London','NZL':'Pacific/Auckland','KIR':'Pacific/Tarawa','FSM':'Pacific/Pohnpei','COD':'Africa/Kinshasa','ECU':'America/Guayaquil','DNK':'Europe/Copenhagen','NLD':'Europe/Amsterdam','PNG':'Pacific/Port_Moresby','UKR':'Europe/Kyiv','CHN':'Asia/Shanghai','MYS':'Asia/Kuala_Lumpur','UZB':'Asia/Tashkent','CYP':'Asia/Nicosia','DEU':'Europe/Berlin','NOR':'Europe/Oslo','ECU':'America/Guayaquil','PYF':'Pacific/Tahiti'}
countries=[]
for c in codes:
    m=bym.get('UNK' if c=='XKX' else c,{})
    a2=m.get('cca2','XK' if c=='XKX' else '')
    tzs=tz.get(a2,[])
    p=PRIMARY.get(c)
    if p and p in tzs: tzs=[p]+[x for x in tzs if x!=p]
    idd=m.get('idd',{}); sfx=idd.get('suffixes') or []
    countries.append(dict(c=c,a2=a2,n=m.get('name',{}).get('common',c),o=m.get('name',{}).get('official',''),
      tr=m.get('translations',{}).get('tur',{}).get('common',''),tro=m.get('translations',{}).get('tur',{}).get('official',''),
      cap=(m.get('capital') or [''])[0],r=m.get('region',''),sr=m.get('subregion',''),
      lc=list((m.get('languages') or {}).keys())[:4],lang=list((m.get('languages') or {}).values())[:4],
      cur=[[k,v.get('symbol',''),v.get('name','')] for k,v in (m.get('currencies') or {}).items()][:2],
      idd=(idd.get('root','')+(sfx[0] if len(sfx)==1 else '')),tld=(m.get('tld') or [''])[0],
      num=m.get('ccn3',''),ll=m.get('latlng',[0,0]),area=m.get('area',0),b=m.get('borders',[]),
      land=bool(m.get('landlocked')),pop=pop.get(a2,0),drv=drv.get(a2,''),tz=tzs[:1],ntz=len(tzs)))
out=dict(codes=codes,countries=countries,m=[''.join(r) for r in mat],d=[[x for x in r] for r in days])
# compress days to sparse
out['d']={codes[i]:{codes[j]:v for j,v in enumerate(r) if v} for i,r in enumerate(days)}
s=json.dumps(out,separators=(',',':'),ensure_ascii=False)
open('/home/claude/visa/data.js','w').write('window.VISA='+s+';')
print(len(s), [c for c in countries if not c['num']])
