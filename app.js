// SEPAN STYLE · کۆدێ سەرەکی یێ لاپەڕێ (پێدڤی ب config.js هەیە)
// ==================================================
// 1. ڕێکخستن و ئامرازێن گشتی
// ==================================================
const C=typeof CFG!=='undefined'?CFG:{WHATSAPP:'9647502326795'},$=id=>document.getElementById(id),wa=t=>`https://wa.me/${C.WHATSAPP}?text=${encodeURIComponent(t||'سلاڤ، حەز دکەم پسیارەکێ بکەم')}`,
esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('hwa').href=wa();$('cwa').href=wa();$('fab').href=wa();
let P=[],cat='هەمی',cur=null,sz='',img=0,cats=[];
const price=p=>p.price?p.price.toLocaleString('en')+' دینار':'بۆ بهای پسیار بکە';
const io='IntersectionObserver' in window?new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12}):null;
const watch=()=>document.querySelectorAll('.rv:not(.in)').forEach(el=>io?io.observe(el):el.classList.add('in'));

// ==================================================
// 2. بارکرنا بەرهەمان ژ products.json
// ==================================================
async function load(){
 try{const r=await fetch('products.json',{cache:'no-cache'});P=r.ok?await r.json():[]}catch(e){console.error(e);P=[]}
 render();renderCart()}

// ==================================================
// 3. نیشاندانا بەرهەمان و فلتەرا جۆران
// ==================================================
function render(){
 cats=['هەمی',...new Set(P.map(p=>p.category).filter(Boolean))];
 $('filters').innerHTML=cats.map((c,i)=>`<button class="${c===cat?'on':''}" onclick="cat=cats[${i}];render()">${esc(c)}</button>`).join('');
 const L=P.filter(p=>cat==='هەمی'||p.category===cat);
 $('grid').innerHTML=L.length?L.map((p,i)=>`<button class="card rv" style="--i:${i%8}" onclick="openM(${+p.id})">${p.soldout?'<span class="tag s">تەمام بوو</span>':p.is_new?'<span class="tag">نوی</span>':''}<div class="ph">${p.images?.[0]?`<img src="${esc(p.images[0])}" loading="lazy" alt="">`:'👗'}</div><div class="t"><b>${esc(p.name)}</b><span class="pr">${price(p)}</span></div></button>`).join(''):'<p class="empty">هێشتا بەرهەم نینن، دێ ب زووی زێدە بن 💗</p>';
 watch()}

// ==================================================
// 4. مۆدالا بەرهەمی (وێنە، سایز، فەرمان)
// ==================================================
function openM(id){cur=P.find(p=>p.id==id);sz=cur.sizes?.[0]||'';img=0;
 $('mn').textContent=cur.name;$('mp').textContent=price(cur);
 $('msw').hidden=!cur.sizes?.length;
 $('ms').innerHTML=(cur.sizes||[]).map((s,i)=>`<button onclick="sz=cur.sizes[${i}];upd()">${esc(s)}</button>`).join('');
 upd();$('m').hidden=false;document.body.style.overflow='hidden'}
function upd(){
 const im=cur.images||[];
 $('mi').innerHTML=im[img]?`<img src="${esc(im[img])}" alt="">`:'👗';
 $('mt').innerHTML=im.length>1?im.map((u,i)=>`<img src="${esc(u)}" class="${i===img?'on':''}" onclick="img=${i};upd()">`).join(''):'';
 document.querySelectorAll('#ms button').forEach(b=>b.classList.toggle('on',b.textContent===sz));
 const o=$('mo');
 if(cur.soldout){o.textContent='تەمام بوو';o.removeAttribute('href');o.style.opacity=.5}
 else{o.textContent='داخازیێ ل واتسئاپ بکە';o.style.opacity=1;
  o.href=wa(`سلاڤ 👋 حەز دکەم ڤی بەرهەمی داخاز بکەم:\n${cur.name}${sz?'\nسایز: '+sz:''}\nنرخ: ${price(cur)}${cur.images?.[0]?'\n🖼 '+abs(cur.images[0]):''}${cur.price&&zone?`\n📍 جهێ بکری : ${zname()}\n🚚 گەهاندن: ${dtxt()}\n💰 کوژمێ گشتی: ${ttxt(cur.price)}`:''}`)}
 $('ma').hidden=!!cur.soldout||!cur.price;
 const d=$('md');d.textContent=cur.price&&ZK.length?(zone?(pend()?'گەهاندن: نرخ ل چاتێ دهێتە دیارکرن':`گەهاندن: ${fmt(fee())} · کوژمێ گشتی: ${fmt(cur.price+fee())}`):'جهێ خو هەلبژێرە بۆ دیارکرنا گەهاندنێ'):'';d.hidden=!d.textContent}



// ==================================================
// 5. گەهاندن و هەلبژارتنا شوێنی
// ==================================================
const Z=typeof ZONES!=='undefined'?ZONES:{},ZK=Object.keys(Z),fmt=n=>n.toLocaleString('en')+' دینار';
const abs=u=>{try{return new URL(u,location.href).href}catch(e){return u}};
const sg=k=>{try{return localStorage.getItem(k)}catch(e){return null}},ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
let cart={},zone=sg('sepan_zone')||'';try{cart=JSON.parse(sg('sepan_cart')||'{}')||{}}catch(e){cart={}}
const OT='__other';let loc=sg('sepan_loc')||'';
if(!Z[zone]&&zone!==OT)zone='';
const pend=()=>zone===OT,fee=()=>zone&&!pend()?Z[zone].fee:0,zname=()=>pend()?(loc.trim()||'—'):zone?Z[zone].ku:'—',
 dtxt=()=>pend()?'ل چاتی دهێتە دیارکرن':fmt(fee()),ttxt=s=>pend()?fmt(s)+' + گەهاندن':fmt(s+fee());
function lineOf(k){const [id,z]=k.split('|'),p=P.find(x=>x.id==id);return p&&p.price&&!p.soldout?{p,sz:z,price:p.price}:null}
function renderZones(){const h='<option value="">جهێ خو هەلبژێرە...</option>'+ZK.map(k=>`<option value="${k}">${esc(Z[k].ku)} — ${fmt(Z[k].fee)}</option>`).join('')+(ZK.length?'<option value="'+OT+'">شوێنەکێ دی — نرخ ل چاتێ</option>':'');
 ['mz','cz'].forEach(id=>{$(id).innerHTML=h;$(id).value=zone});
 ['mx','cx'].forEach(id=>{$(id).hidden=!ZK.length||!pend();$(id).value=loc});document.querySelectorAll('.zb').forEach(x=>x.hidden=!ZK.length)}
function setZone(v){zone=Z[v]||v===OT?v:'';ss('sepan_zone',zone);renderZones();if(cur&&!$('m').hidden)upd();renderCart()}
function shake(id){const s=$(id);s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');s.focus()}
$('mz').onchange=e=>setZone(e.target.value);$('cz').onchange=e=>setZone(e.target.value);
$('mo').addEventListener('click',e=>{if(cur&&cur.price&&!cur.soldout&&ZK.length){if(!zone){e.preventDefault();shake('mz')}else if(pend()&&!loc.trim()){e.preventDefault();shake('mx')}}});
$('co').addEventListener('click',e=>{if(ZK.length){if(!zone){e.preventDefault();shake('cz')}else if(pend()&&!loc.trim()){e.preventDefault();shake('cx')}}});
['mx','cx'].forEach(id=>$(id).addEventListener('input',e=>{loc=e.target.value;ss('sepan_loc',loc);['mx','cx'].forEach(j=>{if($(j)!==e.target)$(j).value=loc});if(cur&&!$('m').hidden)upd();renderCart()}));

// ==================================================
// 6. سەبەتا کرینێ
// ==================================================
const saveCart=()=>ss('sepan_cart',JSON.stringify(cart));
function addCur(){if(!cur||cur.soldout||!cur.price)return;const k=cur.sizes?.length?cur.id+'|'+sz:String(cur.id);
 cart[k]=(cart[k]||0)+1;saveCart();renderCart();const b=$('ma');b.textContent='زێدە بوو ✓';clearTimeout(b._t);b._t=setTimeout(()=>b.textContent='بۆ سەبەتێ زێدە بکە',1300);
 const g=$('cc');g.classList.remove('bump');void g.offsetWidth;g.classList.add('bump')}
function qty(k,d){const q=(cart[k]||0)+d;if(q<=0)delete cart[k];else cart[k]=Math.min(q,99);saveCart();renderCart()}
$('ci').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(b)qty(b.dataset.k,+b.dataset.d)});
function clearCart(){cart={};saveCart();renderCart()}
function renderCart(){const ks=Object.keys(cart).filter(k=>lineOf(k)&&cart[k]>0),n=ks.reduce((s,k)=>s+cart[k],0);
 $('cc').textContent=n;$('cc').hidden=!n;
 if(!ks.length){$('ci').innerHTML='<p class="none">سەبەتا تە ڤالایە. چەند بەرهەمان زێدە بکە.</p>';$('cf').hidden=true;return}
 $('ci').innerHTML=ks.map(k=>{const L=lineOf(k),p=L.p;return `<div class="ct1"><div class="cth">${p.images?.[0]?`<img src="${esc(p.images[0])}" alt="">`:'👗'}</div><div class="cin"><b>${esc(p.name)}${L.sz?' · '+esc(L.sz):''}</b><span>${fmt(L.price*cart[k])}</span></div><div class="qt"><button data-k="${esc(k)}" data-d="-1" aria-label="−">−</button><span>${cart[k]}</span><button data-k="${esc(k)}" data-d="1" aria-label="+">+</button></div></div>`}).join('');
 const sub=ks.reduce((s,k)=>s+lineOf(k).price*cart[k],0),tot=0;
 $('sumS').textContent=fmt(sub);$('sumD').textContent=zone?dtxt():'—';$('sumT').textContent=ttxt(sub);$('cf').hidden=false;
 const ln=ks.map(k=>{const L=lineOf(k);return `✦ ${L.p.name}${L.sz?' (سایز: '+L.sz+')':''} × ${cart[k]} — ${fmt(L.price*cart[k])}${L.p.images?.[0]?'\n🖼 '+abs(L.p.images[0]):''}`}).join('\n');
 $('co').href=wa(`سلاڤ 👋 حەز دکەم ڤان بەرهەمان داخاز بکەم:\n${ln}\n\n🧾 کوژمێ بەرهەمان: ${fmt(sub)}\n 📍 جهێ بکری : ${zname()}\n🚚 گەهاندن: ${dtxt()}\n💰 کوژمێ گشتی: ${ttxt(sub)}`)}

// ==================================================
// 7. ڤەکرن و داخستنا مۆدالان
// ==================================================
function openCart(){$('cm').hidden=false;document.body.style.overflow='hidden'}
function closeCart(){$('cm').hidden=true;document.body.style.overflow=''}
renderZones();
function closeM(){$('m').hidden=true;document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeM();closeCart()}});

// ==================================================
// 8. ڕووداوێن لاپەڕێ (scroll، ئەنیمەیشن)
// ==================================================
addEventListener('scroll',()=>$('hd').classList.toggle('sc2',scrollY>20),{passive:true});
document.querySelectorAll('.sc').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')}));
watch();setTimeout(()=>document.querySelectorAll(".rv").forEach(e=>e.classList.add("in")),2500);load();

// ==================================================
// 9. تیما ڕووناک / تاری
// ==================================================
function tc(){const d=document.documentElement.classList.contains('dark');$('themeBtn').textContent=d?'🌞':'🌛';document.querySelector('meta[name=theme-color]').content=d?'#0F0A0B':'#FFF6F3'}
function toggleTheme(){const h=document.documentElement;h.classList.toggle('dark');try{localStorage.setItem('theme',h.classList.contains('dark')?'dark':'light')}catch(e){}tc()}
tc();
