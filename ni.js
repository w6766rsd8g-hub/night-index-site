// NIGHT INDEX UI: image fade-in, countdowns, hero carousel, sort/filter/search, gallery lightbox, sticky CTA. Network: GA4 events + catalog JSON chunks only.
(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fade=i=>{if(i.complete&&i.naturalWidth)i.classList.add('ld');else i.addEventListener('load',()=>i.classList.add('ld'),{once:true})};$$('.ph img').forEach(fade);
// countdown
const pad=n=>String(n).padStart(2,'0');const tick=()=>{const now=Date.now();$$('[data-end]').forEach(e=>{if(e.id==='saleState')return;const d=+e.dataset.end-now;if(d<=0){e.textContent='セール終了';e.classList.remove('urgent');return}if(d<48*3600e3){const h=Math.floor(d/3600e3),m=Math.floor(d%3600e3/6e4),s=Math.floor(d%6e4/1e3);e.textContent='残り '+(h>=24?Math.floor(h/24)+'日'+(h%24)+'時間':pad(h)+':'+pad(m)+':'+pad(s));e.classList.toggle('urgent',d<6*3600e3)}})};tick();setInterval(tick,1000);
// carousel
$$('[data-carousel]').forEach(h=>{const s=$('.hero-s',h),sl=$$('.slide',s),dots=$('.dots',h);if(sl.length<2)return;let i=0,t;sl.forEach((_,k)=>{const b=document.createElement('button');b.setAttribute('aria-label','スライド'+(k+1));b.onclick=()=>go(k);dots.appendChild(b)});
const go=k=>{i=(k+sl.length)%sl.length;s.scrollTo({left:sl[i].offsetLeft-s.offsetLeft,behavior:'smooth'});mark()};const mark=()=>$$('button',dots).forEach((b,k)=>b.classList.toggle('on',k===i));
s.addEventListener('scroll',()=>{const k=Math.round(s.scrollLeft/s.clientWidth);if(k!==i){i=k;mark()}},{passive:true});const auto=()=>{clearInterval(t);t=setInterval(()=>go(i+1),5000)};['pointerdown','touchstart'].forEach(e=>s.addEventListener(e,()=>clearInterval(t),{passive:true}));mark();auto()});
// GA4 events (gtag loaded in <head>; no-op if blocked)
const ga=(n,o)=>{try{if(typeof window.gtag==='function')window.gtag('event',n,Object.assign({page_type:PT},o))}catch(e){}};
const PT=(()=>{const s=location.pathname.split('/').filter(Boolean)[0]||'home';return s.replace(/\.html$/,'')||'home'})();
document.addEventListener('click',e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;let u;try{u=new URL(a.href,location.href)}catch(_){return}
if(!/(^|\.)(dmm\.co\.jp|dmm\.com|fanza\.co\.jp)$/.test(u.hostname))return;
const pos=a.closest('.sticky-cta')?'sticky':a.closest('.cta-wrap')?'below_gallery':a.closest('.pbox')?'main':a.closest('footer')?'footer':'other';
ga('fanza_click',{item_id:a.dataset.niId||'',button_position:pos,link_domain:u.hostname,transport_type:'beacon'})},true);
// sort / filter / search (+ catalog pagination from JSON chunks)
const g=$('#g');if(g){const orig=$$('.c',g);const q=(new URLSearchParams(location.search).get('q')||'').trim().toLowerCase();const si=$('.search input');if(si&&q)si.value=q;
let key='',saleOnly=false,genre='';const hits=$('[data-hits]');const CH=+g.dataset.chunks||0,PAGE=60;let loaded=0,all=null,lim=CH?PAGE:1e9;const more=$('[data-more]');
const loadNext=()=>loaded>=CH?Promise.resolve():fetch('/data/catalog-'+loaded+'.json?v='+(g.dataset.v||''),{cache:'force-cache'}).then(r=>{if(!r.ok)throw 0;return r.json()}).then(arr=>{const t=document.createElement('div');t.innerHTML=arr.join('');orig.push(...$$('.c',t));loaded++}).catch(()=>{loaded=CH});
const loadAll=()=>all||(all=(async()=>{while(loaded<CH)await loadNext()})());
const filtered=()=>key||saleOnly||genre||q;
const apply=()=>{let list=key?orig.slice().sort((a,b)=>key==='p'?(+a.dataset.p||9e9)-(+b.dataset.p||9e9):(+b.dataset[key]-+a.dataset[key])||(+b.dataset.n-+a.dataset.n)):orig;let n=0,shown=0;const terms=q.split(/\s+/).filter(Boolean);
list.forEach(c=>{const ok=(!saleOnly||c.dataset.s==='1')&&(!genre||c.dataset.g.split(',').includes(genre))&&terms.every(w=>c.dataset.t.includes(w));if(ok)n++;if(ok&&shown<lim){shown++;c.classList.remove('hide');g.appendChild(c);$$('.ph img',c).forEach(fade)}else c.remove()});
const total=filtered()||loaded>=CH?n:+g.dataset.total||n;if(hits)hits.textContent=(q?'「'+q+'」':'')+total+'件';if(more){more.hidden=shown>=total;more.textContent='もっと見る（残り'+(total-shown)+'件）'}return n};
const run=async(ev,o)=>{if(CH&&filtered())await loadAll();const n=apply();if(ev)ga(ev,Object.assign({results:n},o))};
$$('.sortbar button').forEach(b=>b.onclick=()=>{key=b.dataset.k;$$('.sortbar button').forEach(x=>x.classList.toggle('on',x===b));run('sort_change',{sort_key:key||'recommended'})});
const sf=$('[data-salef]');if(sf)sf.onchange=()=>{saleOnly=sf.checked;run('filter_change',{filter_type:'sale_only',filter_value:String(sf.checked)})};const gf=$('[data-genref]');if(gf)gf.onchange=()=>{genre=gf.value;run('filter_change',{filter_type:'genre',filter_value:genre||'all'})};
if(more)more.onclick=async()=>{lim+=PAGE;if(!filtered())while(orig.length<lim&&loaded<CH)await loadNext();apply();ga('load_more',{shown:lim})};
if(q)run('search',{search_term:q});else if(hits||CH)apply()}
// gallery lightbox
const gis=$$('.gi');if(gis.length){let i=0,lb;const show=()=>{$('img',lb).src=gis[i].href;$('.lb-c',lb).textContent=(i+1)+' / '+gis.length};
gis.forEach((a,k)=>a.addEventListener('click',e=>{e.preventDefault();i=k;if(!lb){lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt="サンプル画像" referrerpolicy="no-referrer"><div class="lb-n"><button data-p>‹ 前</button><span class="lb-c"></span><button data-n>次 ›</button><button data-x>閉じる</button></div>';document.body.appendChild(lb);
$('[data-p]',lb).onclick=()=>{i=(i-1+gis.length)%gis.length;show()};$('[data-n]',lb).onclick=()=>{i=(i+1)%gis.length;show()};$('[data-x]',lb).onclick=()=>lb.remove();lb.addEventListener('click',e=>{if(e.target===lb)lb.remove()});document.addEventListener('keydown',e=>{if(!lb.isConnected)return;if(e.key==='Escape')lb.remove();if(e.key==='ArrowRight')$('[data-n]',lb).click();if(e.key==='ArrowLeft')$('[data-p]',lb).click()})}
document.body.appendChild(lb);show()}))}
// sticky CTA after main CTA scrolls away
const sc=$('.sticky-cta'),mc=$('.pbox .cta');if(sc&&mc&&'IntersectionObserver'in window)new IntersectionObserver(([e])=>sc.classList.toggle('on',!e.isIntersecting&&e.boundingClientRect.top<0)).observe(mc);
})();
