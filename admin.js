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
const events = store.get('events', []);
const registrations = store.get('registrations', []);

// ========== Login ==========
$('#adminLoginBtn').addEventListener('click', ()=>{
  const pass=$('#adminPassword').value.trim();
  if(pass==='admin123'){
    $('#adminLoginPanel').style.display='none';
    $('#adminSection').style.display='';
    renderAdminEvents(); renderRegFilters(); renderRegTable();
  }else{ toast('Wrong password', false); }
});

// ========== Event Form ==========
$('#eventForm').addEventListener('submit', ev=>{
  ev.preventDefault();
  const id=$('#evId').value||cryptoRandom();
  const data={
    id,title:$('#evTitle').value.trim(),date:$('#evDate').value,time:$('#evTime').value,
    location:$('#evLocation').value.trim(),category:$('#evCategory').value.trim(),
    capacity:Math.max(1,Number($('#evCapacity').value||1)),
    description:$('#evDescription').value.trim(),active:$('#evActive').checked,
    views:events.find(x=>x.id===id)?.views||0
  };
  const idx=events.findIndex(x=>x.id===id);
  if(idx>=0) events[idx]=data; else events.unshift(data);
  persist(); toast('Event saved'); resetForm(); renderAdminEvents();
});
$('#resetFormBtn').addEventListener('click', resetForm);
function resetForm(){ $('#eventForm').reset(); $('#evId').value=''; $('#evActive').checked=true; }

// ========== Admin Events ==========
function capacityLeft(e){ return (e.capacity||0) - registrations.filter(r=>r.eventId===e.id).reduce((s,r)=>s+(r.tickets||1),0); }
function renderAdminEvents(){
  const wrap=$('#adminEventList'), q=slug($('#adminSearch').value||''), status=$('#adminStatus').value;
  let list=events.filter(e=>{
    const matchesQ=!q||[e.title,e.location,e.category].some(v=>slug(v).includes(q));
    const matchesStatus=status==='all'?true:status==='active'?e.active:!e.active;
    return matchesQ&&matchesStatus;
  });
  if(!list.length){ wrap.innerHTML='<div class="empty">No events yet.</div>'; return; }
  wrap.innerHTML=list.map(e=>{
    return `<div class="panel" style="margin-bottom:10px">
      <div class="inline"><div>
        <strong>${e.title}</strong><div class="muted">${fmtDateTime(e.date+'T'+e.time)} • ${e.location}</div>
        <div class="tags mt-8"><span class="tag">${e.capacity} total</span><span class="tag">${capacityLeft(e)} left</span><span class="tag">${(e.views||0)} views</span><span class="tag">${registrations.filter(r=>r.eventId===e.id).length} regs</span></div>
      </div>
      <div class="ml-auto inline">
        <button class="btn ghost small edit" data-id="${e.id}">Edit</button>
        ${e.active? `<button class="btn ghost small stop" data-id="${e.id}">Stop</button>`:`<button class="btn ghost small start" data-id="${e.id}">Start</button>`}
        <button class="btn ghost small delete" data-id="${e.id}" style="color:#ffb3b3">Delete</button>
      </div></div></div>`;
  }).join('');
  $$('.edit',wrap).forEach(b=> b.onclick=()=> editEvent(b.dataset.id));
  $$('.stop',wrap).forEach(b=> b.onclick=()=> toggleEvent(b.dataset.id,false));
  $$('.start',wrap).forEach(b=> b.onclick=()=> toggleEvent(b.dataset.id,true));
  $$('.delete',wrap).forEach(b=> b.onclick=()=> deleteEvent(b.dataset.id));
}
$('#adminSearch').addEventListener('input', renderAdminEvents);
$('#adminStatus').addEventListener('input', renderAdminEvents);

function editEvent(id){
  const e=events.find(x=>x.id===id); if(!e) return;
  $('#evId').value=e.id; $('#evTitle').value=e.title; $('#evDate').value=e.date; $('#evTime').value=e.time;
  $('#evLocation').value=e.location; $('#evCategory').value=e.category; $('#evCapacity').value=e.capacity;
  $('#evDescription').value=e.description||''; $('#evActive').checked=!!e.active;
  window.scrollTo({top:document.querySelector('#eventForm').offsetTop-20,behavior:'smooth'});
}
function toggleEvent(id,on){ const e=events.find(x=>x.id===id); if(!e) return; e.active=!!on; persist(); renderAdminEvents(); toast(on?'Event live':'Event stopped',on); }
function deleteEvent(id){ const idx=events.findIndex(x=>x.id===id); if(idx>=0) events.splice(idx,1); for(let i=registrations.length-1;i>=0;i--){ if(registrations[i].eventId===id) registrations.splice(i,1); } persist(); renderAdminEvents(); toast('Deleted',false); }

// ========== Registrations ==========
function renderRegFilters(){ $('#regEventFilter').innerHTML='<option value="all">All</option>'+events.map(e=>`<option value="${e.id}">${e.title}</option>`).join(''); }
$('#regEventFilter').addEventListener('input', renderRegTable);
$('#regSearch').addEventListener('input', renderRegTable);
function renderRegTable(){
  const tbody=$('#regTbody'), q=slug($('#regSearch').value||''), eventId=$('#regEventFilter').value;
  let rows=registrations.filter(r=>(eventId==='all'||r.eventId===eventId) && (!q||slug(r.name).includes(q)||slug(r.email).includes(q)));
  if(!rows.length){ tbody.innerHTML=''; $('#emptyRegs').style.display='block'; return; }
  $('#emptyRegs').style.display='none';
  tbody.innerHTML=rows.map(r=> `<tr><td>${r.eventTitle}</td><td>${r.name}</td><td>${r.email}</td><td>${r.phone||'-'}</td><td>${r.tickets}</td><td>${fmtDateTime(r.time)}</td></tr>`).join('');
}

// ========== Persist ==========
function persist(){ store.set('events',events); store.set('registrations',registrations); }
