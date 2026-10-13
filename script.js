// بدّل PAGE_USERNAME باسم المستخدم تاع صفحة Facebook. مثال: globalstoredz
const PAGE_USERNAME = 'global.store.dz';
const products = [
 {id:1,name:'معطف أنيق',price:3500,type:'stock',emoji:'🧥',desc:'مثال توضيحي — بدّل الصورة والوصف والسعر.'},
 {id:2,name:'طقم أظافر',price:1500,type:'order',emoji:'💅',desc:'مثال توضيحي — سور كوموند.'},
 {id:3,name:'حقيبة نسائية',price:2800,type:'stock',emoji:'👜',desc:'مثال توضيحي — متوفر في الستوك.'},
 {id:4,name:'إكسسوارات',price:1200,type:'order',emoji:'✨',desc:'مثال توضيحي — سور كوموند.'}
];
const cart = {}; let currentFilter='all';
const money=n=>new Intl.NumberFormat('fr-DZ').format(n);
function renderProducts(){const el=document.getElementById('products');el.innerHTML='';products.filter(p=>currentFilter==='all'||p.type===currentFilter).forEach(p=>{const card=document.createElement('article');card.className='product';card.innerHTML=`<div class="photo">${p.emoji}</div><div class="info"><h3>${p.name}</h3><div class="price">${money(p.price)} دج</div><span class="tag ${p.type==='order'?'pre':''}">${p.type==='stock'?'متوفر — الدفع عند الاستلام':'سور كوموند — الدفع مسبقاً'}</span><p class="small">${p.desc}</p><button class="btn primary" onclick="add(${p.id})">أضف إلى السلة</button></div>`;el.appendChild(card)});}
function add(id){cart[id]=(cart[id]||0)+1;renderCart()}
function change(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];renderCart()}
function getItems(){return products.filter(p=>cart[p.id]).map(p=>({...p,qty:cart[p.id]}))}
function renderCart(){const items=getItems();document.getElementById('count').textContent=items.reduce((a,p)=>a+p.qty,0);document.getElementById('total').textContent=money(items.reduce((a,p)=>a+p.price*p.qty,0));const el=document.getElementById('cartitems');if(!items.length){el.textContent='السلة فارغة، زيد المنتجات لي حابهم.';document.getElementById('paymentnote').textContent='طريقة الدفع تتحدد حسب المنتجات الموجودة في السلة.';return;}el.innerHTML=items.map(p=>`<div class="cartrow"><div><b>${p.name}</b><div class="small">${p.type==='stock'?'الدفع عند الاستلام':'الدفع مسبقاً'} · ${money(p.price*p.qty)} دج</div></div><div class="qty"><button onclick="change(${p.id},-1)">−</button><span>${p.qty}</span><button onclick="change(${p.id},1)">+</button></div></div>`).join('');const hasStock=items.some(p=>p.type==='stock'),hasOrder=items.some(p=>p.type==='order');document.getElementById('paymentnote').textContent=hasStock&&hasOrder?'طلبك فيه ستوك وسور كوموند: الدفع عند الاستلام للستوك، والدفع المسبق لمنتجات سور كوموند. أكّد تفاصيل الدفع مع المتجر قبل الإتمام.':hasOrder?'كل المنتجات سور كوموند: الدفع مسبقاً قبل تأكيد الطلب.':'كل المنتجات متوفرة: الدفع عند الاستلام.';}
function orderText(){const items=getItems();return `طلب جديد — Global Store Dz\n${items.map(p=>`- ${p.name} × ${p.qty} = ${money(p.price*p.qty)} دج (${p.type==='stock'?'متوفر، الدفع عند الاستلام':'سور كوموند، الدفع مسبقاً'})`).join('\n')}\nالمجموع: ${money(items.reduce((a,p)=>a+p.price*p.qty,0))} دج\nالاسم: ${document.getElementById('customer').value} ${document.getElementById('surname').value}\nالهاتف: ${document.getElementById('phone').value}\nالولاية: ${document.getElementById('province').value}\nالبلدية: ${document.getElementById('municipality').value}\nالعنوان: ${document.getElementById('address').value}\nالتوصيل: ${document.getElementById('delivery').value}`}
document.getElementById('filters').addEventListener('click',e=>{if(e.target.dataset.filter){currentFilter=e.target.dataset.filter;document.querySelectorAll('#filters button').forEach(b=>b.classList.toggle('active',b===e.target));renderProducts()}});

document.getElementById('send').addEventListener('click',async()=>{
  const items=getItems();
  if(!items.length){alert('السلة فارغة. زيد منتج أولاً.');return;}
  const customer=document.getElementById('customer').value.trim();
  const surname=document.getElementById('surname').value.trim();
  const province=document.getElementById('province').value.trim();
  const municipality=document.getElementById('municipality').value.trim();
  const phone=document.getElementById('phone').value.trim();
  const address=document.getElementById('address').value.trim();
  const delivery=document.getElementById('delivery').value;
  if(!customer||!surname||!phone||!province||!municipality||!address){alert('عمّر الاسم واللقب ورقم الهاتف والولاية والبلدية والعنوان أولاً.');return;}
  if(!delivery){alert('اختار طريقة التوصيل أولاً.');return;}
  const details=orderText();
  const data=new URLSearchParams();
  data.append('form-name','store-orders');
  data.append('customer',customer);
  data.append('surname',surname);
  data.append('phone',phone);
  data.append('province',province);
  data.append('municipality',municipality);
  data.append('address',address);
  data.append('delivery',delivery);
  data.append('items',items.map(p=>`${p.name} × ${p.qty}`).join('، '));
  data.append('total',String(items.reduce((a,p)=>a+p.price*p.qty,0))+' دج');
  data.append('order-details',details);
  const btn=document.getElementById('send');
  btn.disabled=true;btn.textContent='جاري إرسال الطلب...';
  try{
    const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data.toString()});
    if(!response.ok) throw new Error('submit failed');
    alert('وصل طلبك للمتجر بنجاح. راح يتم الاتصال بك لتأكيد الطلب. شكراً لثقتك في Global Store Dz!');
    Object.keys(cart).forEach(k=>delete cart[k]);
    document.getElementById('customer').value='';
    document.getElementById('surname').value='';
    document.getElementById('phone').value='';
    document.getElementById('province').value='';
    document.getElementById('municipality').value='';
    document.getElementById('address').value='';
    document.getElementById('delivery').value='';
    renderCart();
  }catch(e){
    alert('ما قدرناش نرسل الطلب حالياً. عاود المحاولة أو اتصل بالمتجر.');
  }finally{
    btn.disabled=false;btn.textContent='تأكيد الطلب وإرساله للمتجر';
  }
});

renderProducts();renderCart();
