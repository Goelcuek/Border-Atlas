/* ---------- Curated entry profiles ---------- */
const SCH='AUT BEL BGR HRV CZE DNK EST FIN FRA DEU GRC HUN ISL ITA LVA LIE LTU LUX MLT NLD NOR POL PRT ROU SVK SVN ESP SWE CHE'.split(' ');
const EU='AUT BEL BGR HRV CYP CZE DNK EST FIN FRA DEU GRC HUN IRL ITA LVA LTU LUX MLT NLD POL PRT ROU SVK SVN ESP SWE'.split(' ');
const schengenProfile={
  tags:['Schengen area','EES active','ETIAS: late 2026'],
  items:[
    ['Passport','Valid at least 3 months beyond your planned departure from the Schengen area, and issued within the last 10 years.'],
    ['Stay','Visa-exempt visitors may stay up to 90 days in any rolling 180-day period, counted across all 29 Schengen countries together.'],
    ['Border','The Entry/Exit System (EES) records fingerprints and a facial image for non-EU travellers on first entry and replaces passport stamps. Allow extra time at the border.'],
    ['ETIAS','Visa-exempt nationals will need an ETIAS travel authorisation (€20, valid 3 years or until the passport expires) once it launches, scheduled for the last quarter of 2026.'],
    ['Visa holders','A short-stay Schengen visa requires travel medical insurance with at least €30,000 cover, plus proof of accommodation, funds and return travel. Apply to the country of main destination.'],
    ['EU citizens','EU, EEA and Swiss citizens travel with a passport or national ID card under freedom of movement.']
  ],
  link:['EU travel portal (EES / ETIAS)','https://travel-europe.europa.eu/']
};
const P={
GBR:{tags:['ETA required for visa-exempt'],items:[
  ['Passport','Must be valid for the whole of your stay.'],
  ['ETA','Visa-exempt visitors, including EU citizens, need an Electronic Travel Authorisation before travel. It costs £20, allows multiple stays of up to 6 months, and lasts 2 years or until the passport expires. Every traveller, including children, needs their own.'],
  ['Exempt','Irish citizens, and anyone with UK residence or a valid UK visa.'],
  ['Timing','Decisions usually arrive within 3 working days; apply at least a week ahead using the UK ETA app.'],
  ['Visa nationals','Others need a Standard Visitor visa, applied for online with biometrics at a visa centre.']],
  link:['GOV.UK: Electronic Travel Authorisation','https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta']},
IRL:{tags:['Not Schengen','Common Travel Area'],items:[
  ['Passport','Valid for the duration of your stay.'],
  ['Stay','Visa-exempt visitors usually receive up to 90 days permission at the border.'],
  ['Schengen','Ireland is in the EU but not in the Schengen area, so a Schengen visa does not cover Ireland. ETIAS will not apply.'],
  ['UK link','Ireland and the UK form the Common Travel Area. Certain visa nationals with a UK visa can visit Ireland under the British-Irish Visa Scheme.']],
  link:['Irish Immigration Service','https://www.irishimmigration.ie/']},
CYP:{tags:['EU, not Schengen'],items:[
  ['Passport','Valid at least 3 months beyond departure.'],
  ['Schengen','Cyprus applies EU rules but is not yet a full Schengen member. Holders of a valid multiple-entry Schengen visa can usually enter for up to 90 days.'],
  ['North','Crossings to and from the north of the island are subject to separate checks.'],
  ['ETIAS','Expected to apply to Cyprus when it launches.']],
  link:['Cyprus Ministry of Foreign Affairs','https://mfa.gov.cy/']},
USA:{tags:['ESTA for Visa Waiver Program'],items:[
  ['ESTA','Citizens of Visa Waiver Program countries need an approved ESTA to arrive by air or sea. Fee $40, valid 2 years, stays of up to 90 days. Apply at least 72 hours before departure.'],
  ['Passport','Must be an electronic passport (chip). Many nationalities are exempt from the six-month validity rule, but the passport must be valid for the whole stay.'],
  ['Visa','Everyone else needs a B1/B2 visitor visa, which involves an in-person consular interview. Wait times can run to months.'],
  ['Exempt','Canadian and Bermudian citizens generally need neither a visa nor an ESTA for visits.'],
  ['At the border','Officers decide admission and length of stay. Social media handles and travel history may be requested.']],
  link:['Official ESTA site','https://esta.cbp.dhs.gov/']},
CAN:{tags:['eTA for air arrivals'],items:[
  ['eTA','Visa-exempt travellers flying to or transiting through Canada need an eTA: CAD 7, valid 5 years or until passport expiry. Not needed when arriving by land or sea.'],
  ['Exempt','US citizens, and US lawful permanent residents carrying their green card.'],
  ['Stay','Typically up to 6 months, set by the border officer.'],
  ['Visa','Visa nationals apply online for a visitor visa and give biometrics.']],
  link:['Government of Canada: eTA','https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html']},
MEX:{tags:['Digital FMM'],items:[
  ['Stay','Many nationalities enter visa-free; the officer sets the stay, up to 180 days, sometimes fewer.'],
  ['Visa holders','A valid US, Canadian, UK, Japanese or Schengen visa, or permanent residence there, lets most visa nationals enter without a Mexican visa.'],
  ['Arrival','Your entry is recorded digitally (FMM) at major airports; keep the stamp or record until you leave.'],
  ['Proof','Be ready to show return tickets, hotel bookings and funds.']],
  link:['Instituto Nacional de Migración','https://www.gob.mx/inm']},
BRA:{tags:['e-Visa for US/CA/AU since 2025'],items:[
  ['Change','Since 10 April 2025, US, Canadian and Australian citizens again need a visa, issued online as an e-Visa.'],
  ['Visa-free','EU, UK, most South American and many other nationals can stay up to 90 days.'],
  ['ID entry','Mercosur and associated-state citizens can enter with a national ID card.'],
  ['Health','Yellow fever vaccination is recommended for many regions.']],
  link:['Brazil Ministry of Foreign Affairs: visas','https://www.gov.br/mre/en/subjects/visas']},
ARG:{items:[
  ['Stay','Most Western and Latin American nationals are visa-free for up to 90 days.'],
  ['ID entry','Mercosur citizens may use a national ID card.'],
  ['Passport','Valid for the duration of stay.']],
  link:['Dirección Nacional de Migraciones','https://www.argentina.gob.ar/interior/migraciones']},
COL:{tags:['Check-MIG form'],items:[
  ['Stay','Visa-exempt visitors get up to 90 days, extendable to 180 days per calendar year.'],
  ['Pre-registration','Complete the free Check-MIG form online within 72 hours before travel.'],
  ['Passport','Valid on arrival; six months recommended by airlines.']],
  link:['Migración Colombia: Check-MIG','https://apps.migracioncolombia.gov.co/pre-registro/']},
PER:{items:[['Stay','Many nationalities are visa-free; the officer grants up to 183 days.'],['ID entry','Andean Community and some Mercosur citizens may use national ID.'],['Passport','Six months validity recommended.']],link:['Migraciones Perú','https://www.gob.pe/migraciones']},
CHL:{items:[['Stay','Most visa-exempt visitors receive up to 90 days.'],['Arrival','A tourist card is issued electronically on arrival; keep it until departure.'],['Passport','Valid for the stay.']],link:['Servicio Nacional de Migraciones','https://serviciomigraciones.cl/']},
CUB:{tags:['Tourist card','D\'Viajeros form'],items:[
  ['Visa','Most visitors need a tourist card (tarjeta del turista), sold by airlines, agencies or online.'],
  ['Form','Complete the D\'Viajeros declaration online before arrival.'],
  ['Insurance','Travel medical insurance is mandatory and may be checked.'],
  ['US rules','US citizens also face US sanctions rules limiting travel categories.']],
  link:['D\'Viajeros','https://dviajeros.mitrans.gob.cu/']},
JPN:{tags:['Visit Japan Web'],items:[
  ['Stay','Citizens of around 70 countries are visa-exempt, mostly for up to 90 days.'],
  ['Passport','Valid for the duration of stay.'],
  ['Arrival','Register on Visit Japan Web before travel to get QR codes for immigration and customs.'],
  ['Coming','A pre-travel authorisation (JESTA) is planned, expected around 2028.'],
  ['Medicines','Some common medicines, including stimulant-containing ones, are restricted. Check before packing.']],
  link:['Visit Japan Web','https://www.vjw.digital.go.jp/']},
KOR:{tags:['K-ETA','e-Arrival card'],items:[
  ['K-ETA','Visa-exempt nationals normally need a K-ETA before boarding. Citizens of 22 countries, including the US, UK, Japan, Australia and most of Western Europe, are exempt until 31 December 2026.'],
  ['Arrival card','Submit the e-Arrival card online within 3 days before arrival if you are exempt from K-ETA.'],
  ['Stay','Typically 30 to 90 days depending on nationality.']],
  link:['Official K-ETA site','https://www.k-eta.go.kr/']},
CHN:{tags:['30-day visa-free (≈50 countries)','240-hour transit'],items:[
  ['Visa-free','Ordinary passport holders from about 50 countries, including most of Europe, the UK, Canada, Australia, New Zealand, Japan, South Korea, several Gulf and South American states, can stay up to 30 days without a visa until 31 December 2026.'],
  ['Transit','Citizens of 55 countries, including the US, can stay up to 240 hours visa-free when transiting to a third country via designated ports, with a confirmed onward ticket.'],
  ['Passport','Valid at least 6 months on arrival.'],
  ['Arrival','Fill in the arrival card online or at the airport kiosk. Hotels register your stay with police; private stays must be registered within 24 hours.'],
  ['Payments','Set up Alipay or WeChat Pay with a foreign card before you go.']],
  link:['National Immigration Administration','https://en.nia.gov.cn/']},
HKG:{items:[['Separate system','Hong Kong runs its own immigration; a mainland China visa is not needed.'],['Stay','About 170 nationalities are visa-free for 7 to 180 days.'],['Passport','Valid at least 1 month beyond your stay.']],link:['Hong Kong Immigration Department','https://www.immd.gov.hk/']},
MAC:{items:[['Separate system','Macao has its own entry rules, distinct from mainland China.'],['Stay','Most visitors are visa-free for 30 to 90 days.']],link:['Macao Public Security Police','https://www.fsm.gov.mo/psp/eng/']},
TWN:{items:[['Stay','Many nationalities are visa-free for 30 to 90 days.'],['Arrival card','Submit the online arrival card before landing to speed up immigration.'],['Passport','Valid at least 6 months.']],link:['Taiwan National Immigration Agency','https://www.immigration.gov.tw/']},
IND:{tags:['e-Visa'],items:[
  ['e-Visa','Available to about 170 nationalities: tourist e-Visa for 30 days (double entry), 1 year or 5 years (multiple entry). Apply at least 4 days ahead.'],
  ['Passport','Valid at least 6 months from arrival, with at least 2 blank pages.'],
  ['Arrival','A digital arrival card can be filled in before landing.'],
  ['Exempt','Nepali and Bhutanese citizens need no visa.']],
  link:['Official Indian e-Visa','https://indianvisaonline.gov.in/evisa/']},
THA:{tags:['TDAC arrival card'],items:[
  ['Arrival card','The Thailand Digital Arrival Card (TDAC) has been mandatory since 1 May 2025. Submit it online within 3 days before arrival; it is free.'],
  ['Visa-free','Citizens of about 90 countries can stay without a visa, currently up to 60 days. The government has discussed shortening this, so check before booking.'],
  ['Passport','Valid at least 6 months.'],
  ['Proof','Officers can ask for an onward ticket and proof of funds (20,000 THB per person).'],
  ['e-Visa','Visa nationals apply through the official Thai e-Visa system.']],
  link:['Thailand Digital Arrival Card','https://tdac.immigration.go.th/']},
VNM:{tags:['e-Visa for all'],items:[
  ['e-Visa','Open to all nationalities: single or multiple entry, up to 90 days.'],
  ['Visa-free','Several European countries, Japan and South Korea get 45 days visa-free.'],
  ['Passport','Valid at least 6 months.']],
  link:['Official Vietnam e-Visa','https://evisa.gov.vn/']},
IDN:{tags:['e-VOA','Bali levy'],items:[
  ['Visa','Most visitors use the e-VOA (IDR 500,000), applied online, for 30 days extendable once. ASEAN citizens are visa-free.'],
  ['Arrival card','Complete the All Indonesia digital arrival card (immigration, customs, health) within 3 days before arrival.'],
  ['Bali','A tourist levy of IDR 150,000 is charged for visits to Bali.'],
  ['Passport','Valid at least 6 months with a blank page.']],
  link:['Indonesia e-Visa','https://evisa.imigrasi.go.id/']},
MYS:{tags:['MDAC'],items:[
  ['Arrival card','Submit the Malaysia Digital Arrival Card (MDAC) within 3 days before arrival. Singapore citizens are exempt.'],
  ['Stay','Most Western nationalities get 90 days visa-free.'],
  ['Passport','Valid at least 6 months.']],
  link:['Malaysia Digital Arrival Card','https://imigresen-online.imi.gov.my/mdac/main']},
SGP:{tags:['SG Arrival Card'],items:[
  ['Arrival card','Submit the free SG Arrival Card online within 3 days before arrival.'],
  ['Stay','Visa-free visitors usually get 30 or 90 days.'],
  ['Passport','Valid at least 6 months.'],
  ['Customs','Strict rules on chewing gum, e-cigarettes and medicines.']],
  link:['ICA SG Arrival Card','https://eservices.ica.gov.sg/sgarrivalcard/']},
PHL:{tags:['eTravel'],items:[
  ['Registration','Register on eTravel (free) within 72 hours before arrival.'],
  ['Stay','Many nationalities are visa-free for 30 days, some for longer.'],
  ['Onward','A return or onward ticket is required.']],
  link:['Philippines eTravel','https://etravel.gov.ph/']},
ARE:{items:[
  ['Visa','Many nationalities, including EU, UK and US citizens, get a free visa on arrival for 30 or 90 days.'],
  ['Others','Some visa nationals holding a US visa, green card, or UK/EU residence qualify for a visa on arrival.'],
  ['Passport','Valid at least 6 months.'],
  ['Medicines','Bring prescriptions; some medicines are controlled.']],
  link:['UAE government portal: visas','https://u.ae/en/information-and-services/visa-and-emirates-id']},
SAU:{tags:['Tourist e-Visa'],items:[
  ['e-Visa','Around 60 nationalities can get a tourist e-Visa or visa on arrival: 1-year multiple entry, up to 90 days in total, insurance included.'],
  ['Visa holders','Holders of US, UK or Schengen visas (used at least once) can usually get a visa on arrival.'],
  ['Note','Tourist visas do not allow Hajj.']],
  link:['Visit Saudi e-Visa','https://visa.visitsaudi.com/']},
QAT:{items:[['Visa-free','Many nationalities are visa-free for 30 to 90 days.'],['Others','Apply for an e-Visa through the Hayya platform.'],['Passport','Valid at least 6 months.']],link:['Hayya','https://www.hayya.qa/']},
TUR:{tags:['e-Visa'],items:[
  ['Passport','Valid at least 150 days from entry, and 60 days beyond the end of your permitted stay.'],
  ['Visa-free','Most Europeans, plus US and Canadian citizens (since 2024), can stay up to 90 days in any 180.'],
  ['e-Visa','Eligible nationals apply at the official e-Visa site; avoid third-party sites that charge extra.'],
  ['ID entry','Citizens of several EU countries can enter with a national ID card.']],
  link:['Official Turkish e-Visa','https://www.evisa.gov.tr/']},
EGY:{items:[
  ['Visa','A visa on arrival ($25) is available at major airports for many nationalities, or apply for an e-Visa in advance.'],
  ['Sinai','Visits to Sharm el-Sheikh and Red Sea resorts in South Sinai can use a free stamp valid 15 days.'],
  ['Passport','Valid at least 6 months.']],
  link:['Egypt e-Visa portal','https://visa2egypt.gov.eg/']},
MAR:{items:[['Visa-free','Many nationalities get 90 days visa-free.'],['e-Visa','Some visa nationals can apply online.'],['Passport','Valid for the stay; 6 months recommended.']],link:['Morocco e-Visa','https://www.acces-maroc.ma/']},
ZAF:{items:[
  ['Visa-free','Many nationalities get 30 or 90 days.'],
  ['Passport','Valid at least 30 days beyond departure, with at least 2 blank pages for stamps.'],
  ['Children','Carrying an unabridged birth certificate for minors is strongly recommended.'],
  ['Health','Yellow fever certificate required if arriving from a risk country.']],
  link:['Department of Home Affairs','https://www.dha.gov.za/']},
KEN:{tags:['eTA'],items:[
  ['eTA','Most visitors need an Electronic Travel Authorisation, applied for online before travel. Most African nationals are exempt.'],
  ['Passport','Valid at least 6 months with a blank page.'],
  ['Health','Yellow fever vaccination recommended; certificate needed if arriving from a risk country.']],
  link:['Kenya eTA','https://www.etakenya.go.ke/']},
TZA:{items:[['Visa','Most visitors apply for an e-Visa in advance.'],['Health','Yellow fever certificate required if arriving from or transiting a risk country.'],['Passport','Valid at least 6 months.']],link:['Tanzania e-Visa','https://visa.immigration.go.tz/']},
RUS:{tags:['Unified e-Visa'],items:[
  ['e-Visa','Citizens of about 55 countries can apply for a unified e-Visa allowing stays of up to 16 days.'],
  ['Others','A consular visa with an invitation is needed for longer or other trips.'],
  ['Registration','Your stay must be registered within 7 working days; hotels do this for you.'],
  ['Money','Foreign-issued Visa and Mastercard cards do not work in Russia.'],
  ['Advisories','Many governments advise against all travel to Russia.']],
  link:['Russian e-Visa','https://evisa.kdmid.ru/']},
GEO:{items:[['Visa-free','Citizens of about 95 countries can stay up to one year without a visa.'],['Insurance','Travel health insurance is mandatory for foreign visitors from 2026.'],['e-Visa','Others can apply online.']],link:['Georgia e-Visa portal','https://www.evisa.gov.ge/']},
ISR:{tags:['ETA-IL'],items:[
  ['ETA-IL','Since 1 January 2025 visa-exempt nationals must obtain an ETA-IL before travel (ILS 25, valid up to 2 years).'],
  ['Passport','Valid at least 6 months.'],
  ['Border','No stamp is placed in the passport; you receive an entry slip instead.'],
  ['Advisories','Check your government\'s current travel advice before planning.']],
  link:['ETA-IL official site','https://israel-entry.piba.gov.il/']},
LKA:{tags:['ETA'],items:[['ETA','Most visitors need an ETA, applied for online before travel.'],['Passport','Valid at least 6 months.']],link:['Sri Lanka ETA','https://www.eta.gov.lk/']},
KHM:{tags:['e-Arrival'],items:[['Visa','Tourist e-Visa online or visa on arrival.'],['Arrival','Complete the Cambodia e-Arrival card before arrival.'],['Passport','Valid at least 6 months with a blank page.']],link:['Cambodia e-Visa','https://www.evisa.gov.kh/']},
NPL:{items:[['Visa','Visa on arrival for 15, 30 or 90 days; can be pre-filled online.'],['Exempt','Indian citizens need no visa.'],['Passport','Valid at least 6 months.']],link:['Nepal Department of Immigration','https://www.immigration.gov.np/']},
MDV:{tags:['Free 30-day VOA'],items:[['Visa','Every nationality receives a free 30-day visa on arrival with confirmed accommodation and an onward ticket.'],['Declaration','Submit the IMUGA traveller declaration within 96 hours before arrival.'],['Customs','Alcohol and pork may not be brought in.']],link:['IMUGA','https://imuga.immigration.gov.mv/']},
JOR:{items:[['Visa','Most visitors get a visa on arrival.'],['Jordan Pass','The Jordan Pass covers the visa fee for stays of at least 3 nights and includes Petra entry.'],['Passport','Valid at least 6 months.']],link:['Jordan Pass','https://www.jordanpass.jo/']},
AUS:{tags:['ETA / eVisitor'],items:[
  ['Authorisation','Every visitor except New Zealanders needs a visa or authorisation. Eligible passports use the ETA via the AustralianETA app (AUD 20 service fee); EU and several European passports use the free eVisitor.'],
  ['Stay','Up to 3 months per visit within 12 months of grant.'],
  ['Others','Apply online for a Visitor visa (subclass 600).'],
  ['Biosecurity','Declare all food, plant and animal products. Penalties are strict.']],
  link:['Department of Home Affairs','https://immi.homeaffairs.gov.au/']},
NZL:{tags:['NZeTA + IVL'],items:[
  ['NZeTA','Visa-waiver visitors need an NZeTA (NZD 17 via app) plus the International Visitor Conservation and Tourism Levy (NZD 100).'],
  ['Exempt','Australian citizens need neither.'],
  ['Declaration','Complete the NZ Traveller Declaration before arrival.'],
  ['Biosecurity','Declare food, outdoor gear and plant or animal items.']],
  link:['Immigration New Zealand: NZeTA','https://www.immigration.govt.nz/new-zealand-visas/visas/visa/nzeta']},
BTN:{items:[['Visa','All visitors except Indian, Bangladeshi and Maldivian nationals need a visa arranged in advance.'],['SDF','A Sustainable Development Fee applies per night (USD 100 for most visitors).']],link:['Bhutan Department of Tourism','https://www.bhutan.travel/']}
};
SCH.forEach(c=>{if(!P[c])P[c]=schengenProfile});