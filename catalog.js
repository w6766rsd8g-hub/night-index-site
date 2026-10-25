(()=>{const root=document.getElementById('catalog');if(!root)return;
const TZ='Asia/Tokyo';
const parts=(d)=>{const o={};for(const p of new Intl.DateTimeFormat('ja-JP',{timeZone:TZ,year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'2-digit',hour12:false}).formatToParts(d))o[p.type]=p.value;return o};
const md=(d)=>{const p=parts(d);return p.month+'/'+p.day};
const mdhm=(d)=>{const p=parts(d);return p.month+'/'+p.day+' '+Number(p.hour)+':'+p.minute};
const ymd=(d)=>{const p=parts(d);return p.year+'/'+p.month+'/'+p.day};
const dt=(s)=>{if(!s)return null;const d=new Date(String(s));return isNaN(d)?null:d};
const left=(end,now)=>{const ms=end-now;if(ms<=0)return null;const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000);return h>=48?'残り'+Math.floor(h/24)+'日':h>=1?'残り'+h+'時間'+m+'分':'残り'+m+'分'};
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e};
const timers=[];
const tick=()=>{const now=new Date();for(const t of timers){const s=left(t.end,now);if(s)t.node.textContent='〜'+mdhm(t.end)+'まで（'+s+'）';else{t.node.textContent='セール終了';t.badge?.remove();t.node.classList.add('ended')}}};
fetch('/catalog.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{const xs=Array.isArray(d.items)?d.items:[];if(!xs.length)return;root.innerHTML='';const now=new Date();
for(const x of xs){const a=el('article','card');const title=el('h2',null,String(x.title||'商品').slice(0,120));
const tags=el('div','tags');const rel=dt(x.releaseDate),end=dt(x.campaignEnd);const pct=Number(x.discountPct)||0;let badge=null;
if(rel&&rel>now)tags.append(el('span','tag tag-pre','予約 '+md(rel)+'発売'));else if(rel&&now-rel<30*86400000)tags.append(el('span','tag tag-new','新作'));
if(pct>0&&(!end||end>now)){badge=el('span','tag tag-off',pct+'%OFF');tags.append(badge)}
const meta=el('p');const bits=[];if(x.priceLabel)bits.push(String(x.priceLabel).slice(0,60));if(x.reviewAverage)bits.push('評価 '+x.reviewAverage);meta.textContent=bits.join(' / ');
const img=String(x.imageURL||'');let ok=false;try{const u=new URL(img);ok=u.protocol==='https:'&&(u.hostname==='dmm.co.jp'||u.hostname.endsWith('.dmm.co.jp'))}catch{}
if(ok){const im=document.createElement('img');im.src=img;im.alt=String(x.title||'').slice(0,120);im.loading='lazy';im.decoding='async';im.referrerPolicy='no-referrer';im.width=400;im.height=270;im.style.cssText='width:100%;height:auto;aspect-ratio:400/270;object-fit:cover;border-radius:8px;display:block;margin-bottom:10px';a.append(im)}
a.append(tags,title,meta);
if(end&&pct>0){const cd=el('p','countdown');a.append(cd);timers.push({end,node:cd,badge})}
const acts=Array.isArray(x.actresses)?x.actresses.slice(0,6).map(s=>String(s).slice(0,30)):[];
const sub=[];if(acts.length)sub.push('出演: '+acts.join('、'));if(x.volumeMinutes)sub.push(Number(x.volumeMinutes)+'分');if(sub.length)a.append(el('p','sub',sub.join(' / ')));
const det=document.createElement('details');det.className='detail';det.append(el('summary',null,'詳細'));const dl=document.createElement('dl');
const row=(k,v)=>{if(!v)return;dl.append(el('dt',null,k),el('dd',null,v))};
row('発売日',rel?ymd(rel)+(rel>now?'（予約受付中）':''):'');row('出演',acts.join('、'));row('収録時間',x.volumeMinutes?Number(x.volumeMinutes)+'分':'');
row('セール',pct>0?(String(x.campaignTitle||'セール').slice(0,40)+' '+pct+'%OFF'+(end?'（〜'+mdhm(end)+'まで）':'')):'');row('価格',x.priceLabel?String(x.priceLabel).slice(0,60):'');
det.append(dl,el('p','note','価格・セール期間は取得時点の情報です。最新情報は公式ページでご確認ください。'));a.append(det);
const link=document.createElement('a');link.href=x.affiliateURL;link.rel='sponsored noopener noreferrer';link.target='_blank';link.textContent='公式ページで確認 →';a.append(link);root.appendChild(a)}
tick();setInterval(tick,60000)}).catch(()=>{})})();
