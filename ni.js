(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fade=i=>{if(i.complete&&i.naturalWidth)i.classList.add('ld');else i.addEventListener('load',()=>i.classList.add('ld'),{once:true})};$$('.ph img').forEach(fade);
const pad=n=>String(n).padStart(2,'0');const tick=()=>{const now=Date.now();$$('[data-end]').forEach(e=>{if(e.id==='saleState')return;const d=+e.dataset.end-now;if(d<=0){e.textContent='セール終了';e.classList.remove('urgent');return}if(d<48*3600e3){const h=Math.floor(d/3600e3),m=Math.floor(d%3600e3/6e4),s=Math.floor(d%6e4/1e3);e.textContent='残り '+(h>=24?Math.floor(h/24)+'日'+(h%24)+'時間':pad(h)+':'+pad(m)+':'+pad(s));e.classList.toggle('urgent',d<6*3600e3)}})};tick();setInterval(tick,1000);
$$('[data-carousel]').forEach(h=>{const s=$('.hero-s',h),sl=$$('.slide',s),dots=$('.dots',h);if(sl.length<2)return;let i=0,t;sl.forEach((_,k)=>{const b=document.createElement('button');b.setAttribute('aria-label','スライド'+(k+1));b.onclick=()=>go(k);dots.appendChild(b)});
const go=k=>{i=(k+sl.length)%sl.length;s.scrollTo({left:sl[i].offsetLeft-s.offsetLeft,behavior:'smooth'});mark()};const mark=()=>$$('button',dots).forEach((b,k)=>b.classList.toggle('on',k===i));
s.addEventListener('scroll',()=>{const k=Math.round(s.scrollLeft/s.clientWidth);if(k!==i){i=k;mark()}},{passive:true});const auto=()=>{clearInterval(t);t=setInterval(()=>go(i+1),5000)};['pointerdown','touchstart'].forEach(e=>s.addEventListener(e,()=>clearInterval(t),{passive:true}));mark();auto()});
const ga=(n,o)=>{try{if(typeof window.gtag==='function')window.gtag('event',n,Object.assign({page_type:PT,ni_theme:document.documentElement.getAttribute('data-theme-eff')||''},o))}catch(e){}};
const PT=(()=>{const s=location.pathname.split('/').filter(Boolean)[0]||'home';return s.replace(/\.html$/,'')||'home'})();
const V=(()=>{try{let v=localStorage.getItem('ni_cv');const m=$('meta[name="ni-cta-b"]');const pb=m?+m.content:0.5;if(v!=='a'&&v!=='b'){v=Math.random()<pb?'b':'a';localStorage.setItem('ni_cv',v)}return v}catch(e){return 'a'}})();
if(V==='b')$('.cta[data-b]').forEach(a=>{const c=$('.cl',a);if(c)c.textContent=a.dataset.b});
if($('.cta'))ga('nicta_view_'+V,{cta_variant:V});
const TZ=$('[data-pv]');const PV=(()=>{if(!TZ)return '';try{const m=$('meta[name="ni-pv"]');const W=m?JSON.parse(m.content):{};let v=localStorage.getItem('ni_pv');if(!(v in W)){let r=Math.random()*Object.values(W).reduce((s,x)=>s+(+x||0),0);v='p3';for(const [k,x] of Object.entries(W)){r-=+x||0;if(r<=0){v=k;break}}localStorage.setItem('ni_pv',v)}return v}catch(e){return 'p0'}})();
if(TZ){const vs=$$('.tzv',TZ);const hit=vs.find(e=>e.dataset.v===PV);vs.forEach(e=>e.hidden=e!==hit);if(!hit)TZ.classList.add('ctl');ga('nipv_view_'+(hit?PV:'p3'),{pv:hit?PV:'p3'})}
document.addEventListener('click',e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;let u;try{u=new URL(a.href,location.href)}catch(_){return}
if(!/(^|\.)(dmm\.co\.jp|dmm\.com|fanza\.co\.jp)$/.test(u.hostname))return;
const pos=a.closest('.fb')?'first_buyer':a.closest('.sticky-cta')?'sticky':a.closest('.cta-wrap')?'below_gallery':a.closest('.pbox')?'main':a.closest('footer')?'footer':'other';
ga('fanza_click',{item_id:a.dataset.niId||'',button_position:pos,cta_variant:V,link_domain:u.hostname,transport_type:'beacon'});ga('nicta_'+V+'_'+pos,{transport_type:'beacon'});if(TZ){const pv=$$('.tzv',TZ).some(e=>!e.hidden)?PV:'p3';ga('nipv_'+pv+'_click',{transport_type:'beacon'})}ga('nic_'+String(PT).replace(/[^a-z0-9_]/gi,'_').slice(0,30),{transport_type:'beacon'})},true);
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
const gis=$$('.gi');if(gis.length){let i=0,lb;const show=()=>{$('img',lb).src=gis[i].href;$('.lb-c',lb).textContent=(i+1)+' / '+gis.length};
gis.forEach((a,k)=>a.addEventListener('click',e=>{e.preventDefault();i=k;if(!lb){lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt="サンプル画像" referrerpolicy="no-referrer"><div class="lb-n"><button data-p>‹ 前</button><span class="lb-c"></span><button data-n>次 ›</button><button data-x>閉じる</button></div>';document.body.appendChild(lb);
$('[data-p]',lb).onclick=()=>{i=(i-1+gis.length)%gis.length;show()};$('[data-n]',lb).onclick=()=>{i=(i+1)%gis.length;show()};$('[data-x]',lb).onclick=()=>lb.remove();lb.addEventListener('click',e=>{if(e.target===lb)lb.remove()});document.addEventListener('keydown',e=>{if(!lb.isConnected)return;if(e.key==='Escape')lb.remove();if(e.key==='ArrowRight')$('[data-n]',lb).click();if(e.key==='ArrowLeft')$('[data-p]',lb).click()})}
document.body.appendChild(lb);show()}))}
const sc=$('.sticky-cta'),mc=$('.pbox .cta');if(sc&&mc&&'IntersectionObserver'in window)new IntersectionObserver(([e])=>sc.classList.toggle('on',!e.isIntersecting&&e.boundingClientRect.top<0)).observe(mc);
})();

(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ga=(n,o)=>{try{if(typeof window.gtag==='function')window.gtag('event',n,o||{})}catch(e){}};
const P=location.pathname;
const bk=P==='/'?'home':/^\/ranking\/(ending|discount)/.test(P)?(P.includes('ending')?'sale':'ranking'):P.startsWith('/ranking/')?'ranking':P.startsWith('/taste')?'taste':P==='/catalog.html'?'search':'';
$$('.bnav a').forEach(a=>{if(a.dataset.bn===bk)a.classList.add('on');a.addEventListener('click',()=>ga('bnav_click',{target:a.dataset.bn}))});
let IDX=null,so=null,tm=0;const norm=s=>String(s||'').toLowerCase().normalize('NFKC');
const load=()=>IDX||(IDX=fetch('/data/search.json?v='+(document.documentElement.dataset.sv||''),{cache:'force-cache'}).then(r=>r.json()).then(j=>{j.it.forEach(r=>r.k=norm(r[0]+' '+r[1]+' '+r[2]));return j}).catch(()=>null));
const render=async q=>{const box=$('.so-r',so);const j=await load();const t=norm(q).split(/\s+/).filter(Boolean);if(!j){box.innerHTML='<p>検索データを読み込めませんでした。</p>';return}
if(!t.length){box.innerHTML='';return}
const m=(s)=>t.every(w=>norm(s).includes(w));const A=j.a.filter(e=>m(e[0])).slice(0,8),G=j.g.filter(e=>m(e[0])).slice(0,8);const I=j.it.filter(r=>t.every(w=>r.k.includes(w)));
I.sort((a,b)=>(b[4]>0)-(a[4]>0));const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
box.innerHTML=(A.length?'<div class="sg">'+A.map(a=>'<a href="'+a[1]+'" data-sk="actress">'+e(a[0])+'（'+a[2]+'）</a>').join('')+'</div>':'')+(G.length?'<div class="sg">'+G.map(g=>'<a href="'+g[1]+'" data-sk="genre">#'+e(g[0])+'（'+g[2]+'）</a>').join('')+'</div>':'')+
I.slice(0,30).map(r=>'<a href="/item/'+r[3]+'.html" data-sk="item">'+(r[4]?'<b class="off">-'+r[4]+'%</b>':'')+e(r[0])+(r[1]?'<small>'+e(r[1])+'</small>':'')+'</a>').join('')+
(I.length>30?'<a href="/catalog.html?q='+encodeURIComponent(q)+'" data-sk="all">全'+I.length+'件をカタログで見る →</a>':'')+(!A.length&&!G.length&&!I.length?'<p>該当する作品が見つかりませんでした。</p>':'');
clearTimeout(tm);tm=setTimeout(()=>ga('search',{search_term:q.slice(0,60),results:I.length,actress_hits:A.length,genre_hits:G.length,via:'overlay'}),900)};
const open=(v)=>{if(!so){so=document.createElement('div');so.className='so';so.setAttribute('role','dialog');so.setAttribute('aria-label','サイト内検索');so.innerHTML='<div class="so-h"><input type="search" placeholder="作品名・女優・ジャンル" aria-label="サイト内検索" enterkeyhint="search"><button type="button" data-sx>閉じる</button></div><div class="so-r"></div>';document.body.appendChild(so);
const i=$('input',so);i.addEventListener('input',()=>render(i.value));i.addEventListener('keydown',e=>{if(e.key==='Enter'&&i.value.trim())location.href='/catalog.html?q='+encodeURIComponent(i.value.trim());if(e.key==='Escape')close()});$('[data-sx]',so).onclick=close;
so.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[data-sk]');if(a)ga('search_click',{result_type:a.dataset.sk})})}
const g=$('#ageGate');if(g&&!g.classList.contains('hidden'))return;so.hidden=false;const i=$('input',so);i.value=v||'';i.focus();load();if(v)render(v);ga('search_open',{})};
const close=()=>{if(so)so.hidden=true};
$$('[data-sopen]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open('')}));
const hi=$('header .search input');if(hi&&P!=='/catalog.html')hi.addEventListener('focus',()=>{hi.blur();open(hi.value)});
const g=$('#g');if(g&&!g.dataset.chunks){const fs={};const FIRST=24;let lim=FIRST;let btn=null;const now=Date.now();
const ok=c=>(!fs.s||c.dataset.s==='1')&&(!fs.new||(+c.dataset.r>0&&+c.dataset.r<=now&&now-+c.dataset.r<30*864e5))&&(!fs.p||(+c.dataset.p>0&&+c.dataset.p<=+fs.p))&&(!fs.g||c.dataset.g.split(',').includes(fs.g));
const upd=()=>{let shown=0,n=0;$$('.c',g).forEach(c=>{const k=ok(c);c.classList.toggle('xf',!k);if(k){n++;c.classList.toggle('xm',shown>=lim);shown++}else c.classList.remove('xm')});
if(n>lim){if(!btn){btn=document.createElement('button');btn.type='button';btn.className='lmore';btn.onclick=()=>{lim+=FIRST;upd();ga('load_more',{shown:lim,list:P})};g.after(btn)}btn.hidden=false;btn.textContent='もっと見る（残り'+(n-lim)+'件）'}else if(btn)btn.hidden=true;return n};
$$('.fc').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.fk,v=b.dataset.fv;const on=b.getAttribute('aria-pressed')!=='true';
$$('.fc[data-fk="'+k+'"]').forEach(x=>x.setAttribute('aria-pressed','false'));if(on){fs[k]=v;b.setAttribute('aria-pressed','true')}else delete fs[k];lim=FIRST;const n=upd();ga('filter_chip',{filter_type:k,filter_value:on?v:'off',results:n,list:P})}));
upd();const mo=new MutationObserver(()=>{mo.disconnect();upd();mo.observe(g,{childList:true})});mo.observe(g,{childList:true})}
$$('[data-sv-play]').forEach(b=>b.addEventListener('click',()=>{const f=b.closest('.sv-f');if(!f||$('iframe',f))return;const u=f.dataset.svSrc;try{const q=new URL(u);if(q.hostname!=='www.dmm.co.jp'||!q.pathname.startsWith('/litevideo/'))return}catch(e){return}
const i=document.createElement('iframe');i.src=u;i.title='FANZA公式サンプル動画';i.allowFullscreen=true;i.setAttribute('allow','autoplay; fullscreen');i.setAttribute('scrolling','no');f.appendChild(i);b.remove();const im=$('img',f);if(im)im.remove();ga('sample_play',{item_id:f.dataset.niId||'',page_type:P.split('/')[1]||'home'})}));
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a.c');if(!a)return;const src=a.closest('[data-svlist]')?'sample_page':a.closest('[data-svrail]')?'home_rail':'';if(src)ga('sample_page_click',{source:src,link_url:a.getAttribute('href')})},true);
const RK='ni_recent';const get=()=>{try{return JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){return []}};
if(P.startsWith('/item/')){const t=($('meta[property="og:title"]')||{}).content||document.title,im=($('meta[property="og:image"]')||{}).content||'';
if(im&&/^https:\/\/[a-z0-9.-]*dmm\.(co\.jp|com)\//.test(im)){const r=get().filter(x=>x.u!==P);r.unshift({u:P,t:t.replace(/ \| NIGHT INDEX$/,'').slice(0,80),i:im});try{localStorage.setItem(RK,JSON.stringify(r.slice(0,12)))}catch(e){}}}
const rs=$('[data-recent]');if(rs){const r=get().filter(x=>x.u!==P).slice(0,12);if(r.length){const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('.rail-s',rs).innerHTML=r.map(x=>'<a class="rc" href="'+e(x.u)+'"><span><img src="'+e(x.i)+'" alt="" width="800" height="538" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>'+e(x.t)+'</a>').join('');rs.hidden=false;
rs.addEventListener('click',e=>{if(e.target.closest('a.rc'))ga('recent_click',{count:r.length})});$('[data-recent-clear]',rs).onclick=()=>{try{localStorage.removeItem(RK)}catch(e){}rs.hidden=true;ga('recent_clear',{})}}}
})();

(()=>{const d=document.documentElement,b=document.querySelector('[data-theme-toggle]');const eff=()=>d.getAttribute('data-theme-eff')||'dark';
const set=()=>{if(b){b.textContent=eff()==='light'?'☾':'☀';b.setAttribute('aria-pressed',String(eff()==='light'))}try{if(typeof gtag==='function')gtag('set','user_properties',{ni_theme:eff()})}catch(e){}};set();
if(b)b.addEventListener('click',()=>{const n=eff()==='light'?'dark':'light';d.setAttribute('data-theme',n);d.setAttribute('data-theme-eff',n);try{localStorage.setItem('ni_theme',n)}catch(e){}set();try{if(typeof gtag==='function')gtag('event','theme_toggle',{theme:n})}catch(e){}})})();
