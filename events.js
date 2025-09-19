// ========== Utilities ==========
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const store = {
  get(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch{ return fallback } },
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)) }
};
function cryptoRandom(){ return 'e_'+Math.random().toString(36).slice(2)+Date.now().toString(36) }
const fmtDateTime = iso => new Date(iso).toLocaleString([], { dateStyle:'medium', timeStyle:'short' });
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function toast(text, ok=true){
  const t=$('#toast'), inner=$('#toastInner');
  inner.textContent=text;
  inner.style.background= ok?'rgba(0,224,184,.15)':'rgba(255,107,107,.18)';
  inner.style.borderColor= ok?'rgba(0,224,184,.35)':'rgba(255,107,107,.35)';
  inner.style.color= ok?'#b6fff1':'#ffc9c9';
  t.style.display='block'; setTimeout(()=>t.style.display='none',1800);
}

// ========== Data ==========
const defaultEvents = [
  { id: cryptoRandom(), title:'Bihar Tech Summit 2025', category:'Conference', location:'Patna Convention Centre', date:'2025-11-18', time:'10:00', description:'A premium technology summit bringing leaders, startups, and engineers together across Bihar.', capacity:500, active:true, views:1200 },
  { id: cryptoRandom(), title:'Indie Music Night', category:'Music', location:'Gandhi Maidan, Patna', date:'2025-10-05', time:'19:00', description:'Open-air concert featuring indie bands and food trucks.', capacity:800, active:true, views:980 },
  { id: cryptoRandom(), title:'Design for Impact Workshop', category:'Workshop', location:'Online', date:'2025-09-28', time:'15:30', description:'Hands-on UX workshop focused on accessibility and inclusive design.', capacity:120, active:false, views:420 }
];
const events = store.get('events', defaultEvents);
const registrations = store.get('registrations', []);

// ========== Filters ==========
const landingFilters = {
  search: $('#searchInput'),
  status: $('#statusFilter'),
  category: $('#categoryFilter'),
  date: $('#dateFilter')
};
$('#clearFilters').addEventListener('click', ()=>{
  landingFilters.search.value=''; landingFilters.status.value='all';
  landingFilters.category.value='all'; landingFilters.date.value='';
  renderEvents();
});
Object.values(landingFilters).forEach(el=> el.addEventListener('input', renderEvents));
$('#sortBySoon').addEventListener('click', ()=> renderEvents('date'));
$('#sortByPopular').addEventListener('click', ()=> renderEvents('popular'));

// ========== Render ==========
function renderCategoryOptions(){
  const cats = Array.from(new Set(events.map(e=>e.category))).sort();
  landingFilters.category.innerHTML = '<option value="all">All categories</option>' +
    cats.map(c=>`<option value="${c}">${c}</option>`).join('');
}
function capacityLeft(e){
  const used = registrations.filter(r=>r.eventId===e.id).reduce((s,r)=>s+(r.tickets||1),0);
  return Math.max(0,(e.capacity||0)-used);
}
function eventCardHTML(e){
  const dt = fmtDateTime(e.date+'T'+e.time);
  const left = capacityLeft(e); const soldOut = left<=0;
  return `
    <article class="card">
      <div class="badge ${e.active?'live':'stopped'}">${e.active?'LIVE':'STOPPED'}</div>
      <div class="title">${e.title}</div>
      <div class="muted">${dt} • ${e.location}</div>
      <div class="tags"><span class="tag">${e.category}</span>
        <span class="tag">${e.capacity} capacity</span>
        <span class="tag">${e.views||0} views</span></div>
      <p class="muted">${e.description||''}</p>
      <div class="inline">
        <span class="pill" style="background:${soldOut?'rgba(255,107,107,.15)':'rgba(41,214,159,.18)'};border-color:${soldOut?'rgba(255,107,107,.35)':'rgba(41,214,159,.35)'};color:${soldOut?'#ffb3b3':'#b8ffe9'}">
          ${soldOut?'Sold out':left+' seats left'}
        </span>
      </div>
      <div class="card-actions">
        <button class="btn ghost small view-details" data-id="${e.id}">Details</button>
        <button class="btn small register" data-id="${e.id}" ${(!e.active||soldOut)?'disabled':''} style="${(!e.active||soldOut)?'opacity:.6;cursor:not-allowed':''}">Register</button>
      </div>
    </article>`;
}
function renderEvents(sortBy){
  renderCategoryOptions();
  const q=slug(landingFilters.search.value), status=landingFilters.status.value,
        cat=landingFilters.category.value, date=landingFilters.date.value;
  let list = events.slice().filter(e=>{
    const matchesQ=!q||[e.title,e.location,e.category].some(v=>slug(v).includes(q));
    const matchesStatus=status==='all'?true:status==='active'?e.active:!e.active;
    const matchesCat=cat==='all'?true:e.category===cat;
    const matchesDate=!date?true:e.date===date;
    return matchesQ&&matchesStatus&&matchesCat&&matchesDate;
  });
  if(sortBy==='date'){ list.sort((a,b)=> new Date(a.date+'T'+a.time)-new Date(b.date+'T'+b.time)); }
  else if(sortBy==='popular'){ list.sort((a,b)=>(b.views||0)-(a.views||0)); }
  else{ list.sort((a,b)=> a.active!==b.active? (a.active?-1:1): new Date(a.date+'T'+a.time)-new Date(b.date+'T'+b.time)); }
  $('#resultCount').textContent=`${list.length} event${list.length!==1?'s':''}`;
  $('#eventGrid').innerHTML = list.map(eventCardHTML).join('');
  $('#emptyEvents').style.display=list.length?'none':'block';
  // bind
  $$('.view-details').forEach(btn=> btn.onclick=()=> showEventDetails(events.find(e=>e.id===btn.dataset.id)));
  $$('.register').forEach(btn=> btn.onclick=()=> showRegisterForm(events.find(e=>e.id===btn.dataset.id)));
}

// ========== Modal ==========
function openModal(id){ const m=document.getElementById(id); if(m){ m.style.display='flex'; } }
function closeModal(id){ const m=document.getElementById(id); if(m){ m.style.display='none'; } }
$$('[data-close]').forEach(b=> b.onclick=()=> closeModal(b.dataset.close));

function showEventDetails(e){
  if(!e) return; e.views=(e.views||0)+1; persist();
  const left=capacityLeft(e), dt=fmtDateTime(e.date+'T'+e.time);
  $('#modalTitle').textContent=e.title;
  $('#modalBody').innerHTML=`
    <p class="muted">${e.description||''}</p>
    <div class="panel"><div><strong>${dt}</strong> • ${e.location} • ${e.category}</div>
    <div class="pill">${left} seats left</div></div>
    <div class="inline mt-12">
      <button class="btn" id="modalRegisterBtn" ${(!e.active||left<=0)?'disabled':''}>Register</button>
      <button class="btn ghost" data-close="detailsModal">Close</button>
    </div>`;
  openModal('detailsModal');
  $('#modalRegisterBtn')?.addEventListener('click', ()=> showRegisterForm(e));
}

function showRegisterForm(e){
  const left=capacityLeft(e);
  $('#modalTitle').textContent=`Register — ${e.title}`;
  $('#modalBody').innerHTML=`
    <form id="regForm">
      <label>Name</label><input class="input" id="rName" required>
      <label>Email</label><input class="input" id="rEmail" type="email" required>
      <label>Phone</label><input class="input" id="rPhone">
      <label>Tickets</label><input class="input" id="rTickets" type="number" min="1" max="${left}" value="1">
      <div class="inline mt-12"><button class="btn" type="submit">Confirm</button>
      <button class="btn ghost" data-close="detailsModal">Cancel</button></div>
    </form>`;
  openModal('detailsModal');
  $('#regForm').addEventListener('submit', ev=>{
    ev.preventDefault();
    const tickets=Math.max(1,Number($('#rTickets').value||1));
    if(tickets>capacityLeft(e)){ toast(`Only ${capacityLeft(e)} left`,false); return; }
    registrations.push({ id:cryptoRandom(), eventId:e.id, eventTitle:e.title,
      name:$('#rName').value.trim(), email:$('#rEmail').value.trim(), phone:$('#rPhone').value.trim(),
      tickets, time:new Date().toISOString() });
    persist(); toast('Registration confirmed'); closeModal('detailsModal'); renderEvents();
  });
}

// ========== Persist & Init ==========
function persist(){ store.set('events',events); store.set('registrations',registrations); }
function init(){ renderEvents(); }
init();
