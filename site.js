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
