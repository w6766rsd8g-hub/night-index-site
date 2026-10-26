// Functional 18+ gate; appearance and approved page layouts are unchanged.
// Self-attestation is NOT identity/age verification. No analytics, network or cookies added.
(()=>{
 let gate=document.getElementById('ageGate');
 const existing=gate!==null;
 const page=new URL(location.href).pathname;
 if(!existing&&page!=='/guides.html')return; // Privacy and About remain readable for transparency.
 const consentKey='night_index_age_ok';
 let approved=false;
 try{approved=localStorage.getItem(consentKey)==='1'}catch{}
 if(!gate){
  gate=document.createElement('div');gate.id='ageGate';gate.className='gate';gate.setAttribute('role','dialog');
  gate.setAttribute('aria-modal','true');
  gate.innerHTML='<div class="gate-card"><p class="eyebrow">AGE CHECK</p><h1 id="ageGateTitle">18歳以上ですか？</h1><p>このサイトは18歳以上の方を対象とした成人向けサービスの情報・比較サイトです。</p><div class="gate-actions"><button id="enterBtn" type="button">18歳以上です</button><button id="leaveBtn" type="button" class="secondary">18歳未満です</button></div></div>';
  document.body.prepend(gate);
 }
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
 if(approved)open();else hold();
 enter?.addEventListener('click',()=>{
  try{localStorage.setItem(consentKey,'1')}catch{}
  open();document.querySelector('main h1')?.setAttribute('tabindex','-1');
  document.querySelector('main h1')?.focus()
 });
 leave?.addEventListener('click',()=>{
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
