// NIGHT INDEX UI: image fade-in, countdowns, hero carousel, sort/filter/search, gallery lightbox, sticky CTA. No network, no tracking.
(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fade=i=>{if(i.complete&&i.naturalWidth)i.classList.add('ld');else i.addEventListener('load',()=>i.classList.add('ld'),{once:true})};$$('.ph img').forEach(fade);
// countdown
const pad=n=>String(n).padStart(2,'0');const tick=()=>{const now=Date.now();$$('[data-end]').forEach(e=>{if(e.id==='saleState')return;const d=+e.dataset.end-now;if(d<=0){e.textContent='セール終了';e.classList.remove('urgent');return}if(d<48*3600e3){const h=Math.floor(d/3600e3),m=Math.floor(d%3600e3/6e4),s=Math.floor(d%6e4/1e3);e.textContent='残り '+(h>=24?Math.floor(h/24)+'日'+(h%24)+'時間':pad(h)+':'+pad(m)+':'+pad(s));e.classList.toggle('urgent',d<6*3600e3)}})};tick();setInterval(tick,1000);
// carousel
$$('[data-carousel]').forEach(h=>{const s=$('.hero-s',h),sl=$$('.slide',s),dots=$('.dots',h);if(sl.length<2)return;let i=0,t;sl.forEach((_,k)=>{const b=document.createElement('button');b.setAttribute('aria-label','スライド'+(k+1));b.onclick=()=>go(k);dots.appendChild(b)});
const go=k=>{i=(k+sl.length)%sl.length;s.scrollTo({left:sl[i].offsetLeft-s.offsetLeft,behavior:'smooth'});mark()};const mark=()=>$$('button',dots).forEach((b,k)=>b.classList.toggle('on',k===i));
s.addEventListener('scroll',()=>{const k=Math.round(s.scrollLeft/s.clientWidth);if(k!==i){i=k;mark()}},{passive:true});const auto=()=>{clearInterval(t);t=setInterval(()=>go(i+1),5000)};['pointerdown','touchstart'].forEach(e=>s.addEventListener(e,()=>clearInterval(t),{passive:true}));mark();auto()});
// sort / filter / search
const g=$('#g');if(g){const cards=$$('.c',g),orig=cards.slice();const q=(new URLSearchParams(location.search).get('q')||'').trim().toLowerCase();const si=$('.search input');if(si&&q)si.value=q;
let key='',saleOnly=false,genre='';const hits=$('[data-hits]');
const apply=()=>{let list=key?orig.slice().sort((a,b)=>key==='p'?(+a.dataset.p||9e9)-(+b.dataset.p||9e9):(+b.dataset[key]-+a.dataset[key])||(+b.dataset.n-+a.dataset.n)):orig;let n=0;const terms=q.split(/\s+/).filter(Boolean);
list.forEach(c=>{const ok=(!saleOnly||c.dataset.s==='1')&&(!genre||c.dataset.g.split(',').includes(genre))&&terms.every(w=>c.dataset.t.includes(w));c.classList.toggle('hide',!ok);if(ok)n++;g.appendChild(c)});if(hits)hits.textContent=(q?'「'+q+'」':'')+n+'件';};
$$('.sortbar button').forEach(b=>b.onclick=()=>{key=b.dataset.k;$$('.sortbar button').forEach(x=>x.classList.toggle('on',x===b));apply()});
const sf=$('[data-salef]');if(sf)sf.onchange=()=>{saleOnly=sf.checked;apply()};const gf=$('[data-genref]');if(gf)gf.onchange=()=>{genre=gf.value;apply()};
if(q||hits)apply()}
// gallery lightbox
const gis=$$('.gi');if(gis.length){let i=0,lb;const show=()=>{$('img',lb).src=gis[i].href;$('.lb-c',lb).textContent=(i+1)+' / '+gis.length};
gis.forEach((a,k)=>a.addEventListener('click',e=>{e.preventDefault();i=k;if(!lb){lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt="サンプル画像" referrerpolicy="no-referrer"><div class="lb-n"><button data-p>‹ 前</button><span class="lb-c"></span><button data-n>次 ›</button><button data-x>閉じる</button></div>';document.body.appendChild(lb);
$('[data-p]',lb).onclick=()=>{i=(i-1+gis.length)%gis.length;show()};$('[data-n]',lb).onclick=()=>{i=(i+1)%gis.length;show()};$('[data-x]',lb).onclick=()=>lb.remove();lb.addEventListener('click',e=>{if(e.target===lb)lb.remove()});document.addEventListener('keydown',e=>{if(!lb.isConnected)return;if(e.key==='Escape')lb.remove();if(e.key==='ArrowRight')$('[data-n]',lb).click();if(e.key==='ArrowLeft')$('[data-p]',lb).click()})}
document.body.appendChild(lb);show()}))}
// sticky CTA after main CTA scrolls away
const sc=$('.sticky-cta'),mc=$('.pbox .cta');if(sc&&mc&&'IntersectionObserver'in window)new IntersectionObserver(([e])=>sc.classList.toggle('on',!e.isIntersecting&&e.boundingClientRect.top<0)).observe(mc);
})();
