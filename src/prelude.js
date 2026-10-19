const V=window.VISA, CODES=V.codes, IDX={}; CODES.forEach((c,i)=>IDX[c]=i);
const META={}; V.countries.forEach(c=>META[c.c]=c);
const N=CODES.length;
const CAT={
  F:{label:'Visa-free',color:'--c-free',desc:'No visa needed. Show your passport at the border.'},
  T:{label:'Travel authorisation',color:'--c-eta',desc:'No visa, but an online authorisation (ETA, ESTA, eTA) must be approved before you board.'},
  A:{label:'Visa on arrival',color:'--c-voa',desc:'Visa issued at the airport or border on arrival, usually for a fee. Often also available online in advance.'},
  E:{label:'e-Visa',color:'--c-evisa',desc:'Apply and pay online before travel, and carry the approval.'},
  V:{label:'Visa required',color:'--c-req',desc:'Get a visa in advance through an embassy, consulate or visa centre.'},
  X:{label:'No admission',color:'--c-no',desc:'Holders of this passport are currently refused entry or entry is suspended.'},
  S:{label:'Selected country',color:'--c-self',desc:''}
};
const ORDER=['F','T','A','E','V','X'];
const REGIONS=['Europe','Asia','Africa','Americas','Oceania'];

