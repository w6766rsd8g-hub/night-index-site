// Functional 18+ gate; appearance and approved page layouts are unchanged.
// Self-attestation is NOT identity/age verification. No new network, cookies or identifiers: it only sends anonymous
// age_gate_view/age_gate_pass/age_gate_leave events through the page's existing GA4 tag when present (gate funnel, GROKBOT 2026-11-03).
(()=>{
 let gate=document.getElementById('ageGate');
 const existing=gate!==null;
 const page=new URL(location.href).pathname;
 if(!existing&&page!=='/guides.html')return; // Privacy and About remain readable for transparency.
 const consentKey='night_index_age_ok';
 const gev=n=>{try{if(typeof window.gtag==='function')window.gtag('event',n,{page_type:(page.split('/').filter(Boolean)[0]||'home').replace(/\.html$/,'')})}catch{}};
 let approved=false;
 try{approved=localStorage.getItem(consentKey)==='1'}catch{}
 if(!gate){
  gate=document.createElement('div');gate.id='ageGate';gate.className='gate';gate.setAttribute('role','dialog');
  gate.setAttribute('aria-modal','true');
  gate.innerHTML='<div class="gate-card"><p class="eyebrow">AGE CHECK</p><h1 id="ageGateTitle">18歳以上ですか？</h1><p>このサイトは18歳以上の方を対象とした成人向けサービスの情報・比較サイトです。</p><div class="gate-actions"><button id="enterBtn" type="button">18歳以上です</button><button id="leaveBtn" type="button" class="secondary">18歳未満です</button></div></div>';
  document.body.prepend(gate);
 }

 // GROKBOT 2026-11-05 daily growth (+2026-11-06: category label; static HTML now also baked in pages-core): tell search visitors, before attestation, what kind of page waits behind the gate
 // (neutral category label only: no work titles, images or explicit wording are shown before the 18+ check).
 try{const parts=page.split('/').filter(Boolean);let seg=(parts[0]||'').replace(/\.html$/,'');if(seg==='index')seg='';const id=(parts.at(-1)||'').replace(/\.html$/,'');
  const label=seg==='item'?(/^d_/.test(id)?'同人作品の詳細ページ（価格・ページ数・サンプル画像）':'作品の詳細ページ（価格・セール期限・サンプル）'):({series:'シリーズの作品一覧',actress:'女優別の作品一覧',maker:'メーカー別の作品一覧',genre:'ジャンル別の作品一覧',ranking:'ランキング',sale:'セール作品の詳細ページ',doujin:'同人誌の作品一覧',comic:'成人コミックの作品一覧',category:'カテゴリ別の作品一覧'})[seg]||'';
  const card=gate.querySelector('.gate-card'),acts=gate.querySelector('.gate-actions');
  if(label&&card&&acts&&!gate.querySelector('.gate-dest')){const p=document.createElement('p');p.className='gate-dest';p.style.cssText='font-size:.85em;opacity:.8;margin:.4em 0 .8em';p.textContent='この先：'+label+'／FANZA公式データ・広告（PR）を含みます';card.insertBefore(p,acts)}}catch{}
 const h=gate.querySelector('h1');if(h&&!h.id)h.id='ageGateTitle';gate.setAttribute('aria-labelledby','ageGateTitle');
 const enter=gate.querySelector('#enterBtn'),leave=gate.querySelector('#leaveBtn');
 const backdrop=[...document.body.children].filter(x=>x!==gate&&x.tagName!=='SCRIPT');
 const hold=()=>{
  backdrop.forEach(x=>{x.setAttribute('inert','');x.setAttribute('aria-hidden','true')});
  gate.classList.remove('hidden');enter?.focus()
 };
 const open=()=>{
  backdrop.forEach(x=>{x.removeAttribute('inert');x.removeAttribute('aria-hidden')});
  gate.classList.add('hidden');
 };
 if(approved)open();else{hold();gev('age_gate_view')}
 enter?.addEventListener('click',()=>{
  try{localStorage.setItem(consentKey,'1')}catch{}
  gev('age_gate_pass');open();document.querySelector('main h1')?.setAttribute('tabindex','-1');
  document.querySelector('main h1')?.focus()
 });
 leave?.addEventListener('click',()=>{
  gev('age_gate_leave');
  const main=document.createElement('main');main.className='blocked';
  main.innerHTML='<div><h1 tabindex="-1">閲覧できません</h1><p>このサイトは18歳以上の方のみご利用いただけます。</p></div>';
  document.body.replaceChildren(main);main.querySelector('h1').focus()
 });
 gate.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();return}
  if(e.key!=='Tab'||gate.classList.contains('hidden'))return;
  const controls=[enter,leave].filter(Boolean);
  if(!controls.length)return;e.preventDefault();
  const i=controls.indexOf(document.activeElement);
  const n=e.shiftKey?(i<=0?controls.length-1:i-1):(i===controls.length-1?0:i+1);
  controls[n].focus()
 });
})();

// GROKBOT-20261124 daily growth: archived / sale-ended item pages (all /item/ landings in GA4 11/17-11/23) had no path to
// anything currently on sale. Show 「いまセール中の近い作品」 from /data/now-sale.json (real FANZA catalog data written by the
// daily sync; internal links only), matched by this page's own actress/maker/genre links. Behind the 18+ gate (inside the
// inert page). Shows nothing on current item pages, on failure, or when the JSON is absent (kill: NIGHT_INDEX_NOW_SALE_DISABLED=1).
/*NI_NOW_PICK*/function niNowPick(d,f,now){
 const cur=new Set(d.cur||[]);if(!f.id||(!f.ended&&cur.has(f.id)))return [];
 const doujin=/^d_/.test(f.id);const A=new Set(f.actresses||[]),G=new Set(f.genres||[]);
 return (d.items||[]).filter(x=>x.i!==f.id&&x.e>now&&/^d_/.test(x.i)===doujin).map(x=>{
  let sc=0;for(const a of x.a||[])if(A.has(a))sc+=6;if(f.maker&&x.m===f.maker)sc+=4;for(const g of x.g||[])if(G.has(g))sc+=1;return [sc,x]})
  .filter(e=>e[0]>=2).sort((a,b)=>b[0]-a[0]||b[1].p-a[1].p||b[1].n-a[1].n).slice(0,8).map(e=>e[1]);
}/*/NI_NOW_PICK*/
(()=>{
 try{
  const m=/^\/item\/([a-z0-9_-]+)\.html$/i.exec(location.pathname);if(!m||document.querySelector('[data-now-sale]'))return;
  const info=document.querySelector('.d-info');const anchor=document.querySelector('main section.rail:not(.recent)')||document.querySelector('main .sticky-cta');
  if(!info||!anchor)return;
  const cd=document.querySelector('.cd.big[data-end]');const ended=!!cd&&Number(cd.getAttribute('data-end'))<Date.now();
  const links=s=>[...info.querySelectorAll('a[href^="/'+s+'/"]')];
  const f={id:m[1],ended,maker:((links('maker')[0]||{}).getAttribute?.('href')||'').replace(/^\/maker\/|\.html$/g,''),
   genres:links('genre').map(a=>a.getAttribute('href').replace(/^\/genre\/|\.html$/g,'')),
   actresses:links('actress').map(a=>a.textContent.trim()).filter(t=>t&&!/すべて見る/.test(t))};
  fetch('/data/now-sale.json',{credentials:'omit'}).then(r=>r.ok?r.json():null).then(d=>{
   if(!d||document.querySelector('[data-now-sale]'))return;const now=Date.now();const xs=niNowPick(d,f,now);if(xs.length<2)return;
   const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
   const jp=ms=>{const t=new Date(ms+9*3600e3);return `${t.getUTCMonth()+1}月${t.getUTCDate()}日 ${t.getUTCHours()}:${String(t.getUTCMinutes()).padStart(2,'0')} JSTまで`};
   const at=new Date(Date.parse(d.at)+9*3600e3);const atS=isNaN(at)?'':`${at.getUTCMonth()+1}月${at.getUTCDate()}日 ${at.getUTCHours()}:${String(at.getUTCMinutes()).padStart(2,'0')} JST時点の`;
   const sec=document.createElement('section');sec.className='rail now-sale';sec.setAttribute('data-now-sale','');
   sec.innerHTML=`<div class="rail-h"><h2>いまセール中の近い作品</h2></div><p class="note">${ended?'この作品のセールは終了しています。':''}${atS}FANZA公式データから、出演者・メーカー・ジャンルが近いセール中の作品です。価格・期限は変わることがあります。</p><div class="rail-s">`+
    xs.map(x=>`<a class="c" href="/item/${esc(x.i)}.html" data-now="1"><div class="ph"><b class="bd off">-${Number(x.p)||0}%</b><img src="${esc(x.im)}" alt="${esc(x.t)}" width="800" height="538" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div><div class="cb"><h3>${esc(x.t)}</h3>${(x.a||[]).length?`<p class="ac">${esc(x.a.slice(0,2).join('・'))}</p>`:''}<p class="pr-l"><span class="now">${esc(x.s)}</span><s>${esc(x.l)}</s></p><p class="mt">${x.n>0?`<span>★${esc(x.r)}（レビュー${Number(x.n)}件）</span>`:''}<span class="cd" data-end="${Number(x.e)}">${jp(Number(x.e))}</span></p></div></a>`).join('')+'</div>';
   anchor.parentNode.insertBefore(sec,anchor);
   try{if(typeof window.gtag==='function')window.gtag('event','ni_now_view',{items:xs.length,ended:ended?1:0})}catch{}
   sec.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[data-now]');if(a)try{if(typeof window.gtag==='function')window.gtag('event','ni_now_click',{to:a.getAttribute('href')})}catch{}});
  }).catch(()=>{});
 }catch{}
})();
