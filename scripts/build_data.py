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
countries=[]
for c in codes:
    m=bym.get('UNK' if c=='XKX' else c,{})
    countries.append(dict(c=c,n=m.get('name',{}).get('common',c),o=m.get('name',{}).get('official',''),
      f=m.get('flag',''),cap=(m.get('capital') or [''])[0],r=m.get('region',''),sr=m.get('subregion',''),
      lang=list((m.get('languages') or {}).values())[:3],
      cur=[f"{v.get('name','')} ({k}{' '+v['symbol'] if v.get('symbol') else ''})" for k,v in (m.get('currencies') or {}).items()][:2],
      idd=(m.get('idd',{}).get('root','')+(m.get('idd',{}).get('suffixes') or [''])[0] if len(m.get('idd',{}).get('suffixes') or [])==1 else m.get('idd',{}).get('root','')),
      num=m.get('ccn3',''),ll=m.get('latlng',[0,0]),area=m.get('area',0),b=m.get('borders',[]),un=m.get('unMember',False)))
for c in countries:
    if c['c'] in('HKG','MAC'): pass
out=dict(codes=codes,countries=countries,m=[''.join(r) for r in mat],d=[[x for x in r] for r in days])
# compress days to sparse
out['d']={codes[i]:{codes[j]:v for j,v in enumerate(r) if v} for i,r in enumerate(days)}
s=json.dumps(out,separators=(',',':'),ensure_ascii=False)
open('/home/claude/visa/data.js','w').write('window.VISA='+s+';')
print(len(s), [c for c in countries if not c['num']])
