(() => {
  'use strict';
  const { categories, products } = window.PION_CATALOG;
  const $ = (s, root = document) => root.querySelector(s);
  const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = (s) => s.toLocaleLowerCase('sv').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '';
  const price = (p) => p.price !== null ? `${p.price.toLocaleString('sv-SE')}${p.priceMax ? '–'+p.priceMax : ''} kr${p.priceNote || ''}` : 'Pris på förfrågan';
  const order = ['kuddfodral','sminkvaskor','necessrer','vaeskor','grytlappar','borsar','tygkassar','lunchbag','forkladen','mossor','bivaxdukar','nyckelband','fodraltillsurfplatta','nappahllare','ovrigt'];
  const curated = [];
  const groups = order.map((id) => products.filter((p) => p.category === id));
  for (let i=0;i<Math.max(...groups.map((g) => g.length));i++) groups.forEach((g) => { if (g[i]) curated.push(g[i]); });
  const state = {category:'all', search:'', sort:'featured', shown:24};
  const inquiry = new Map();
  let detailId;

  const categoryOptions = [{id:'all', name:'Hela sortimentet', count:products.length}, ...categories];
  $('#category-list').innerHTML = categoryOptions.map((c) => `<button class="category-button" type="button" data-category="${c.id}" aria-pressed="${c.id === 'all'}"><span>${escape(c.name)}</span><span>${c.count}</span></button>`).join('');
  $('#category-select').innerHTML = categoryOptions.map((c) => `<option value="${c.id}">${escape(c.name)} (${c.count})</option>`).join('');

  function filterProducts() {
    const words = normalize(state.search.trim()).split(/\s+/).filter(Boolean);
    const result = curated.filter((p) => (state.category === 'all' || p.category === state.category) && words.every((w) => normalize(`${p.title} ${p.displayName} ${p.description} ${categoryName(p.category)}`).includes(w)));
    if (state.sort === 'name') result.sort((a,b) => a.displayName.localeCompare(b.displayName, 'sv'));
    if (state.sort.startsWith('price')) result.sort((a,b) => a.price === null ? (b.price === null ? 0 : 1) : b.price === null ? -1 : state.sort === 'price-low' ? a.price-b.price : b.price-a.price);
    return result;
  }
  function renderCatalog(focusIndex) {
    const filtered = filterProducts();
    $('#product-grid').innerHTML = filtered.slice(0,state.shown).map((p) => `<button type="button" class="product-card" data-product="${p.id}" aria-label="Visa ${escape(p.title)}, ${escape(p.displayName)}, ${escape(price(p))}"><span class="product-photo"><img src="${p.thumb}" alt="${escape(p.title + ' – ' + p.displayName)}" width="480" height="540" loading="lazy" decoding="async"></span><span class="product-view" aria-hidden="true">Se detaljer</span><span class="product-type">${escape(categoryName(p.category))}</span><h4>${escape(p.displayName)}</h4><span class="product-price">${escape(price(p))}</span></button>`).join('');
    $('#results-title').textContent = state.category === 'all' ? 'Hela sortimentet' : categoryName(state.category);
    const categoryDescription=categories.find((c)=>c.id===state.category)?.description || '';
    $('#category-description').textContent=categoryDescription;$('#category-description').hidden=!categoryDescription;
    $('#results-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'träff' : 'träffar'}`;
    $('#shown-count').textContent = filtered.length ? `Visar ${Math.min(state.shown,filtered.length)} av ${filtered.length}` : '';
    $('#load-more').hidden = state.shown >= filtered.length;
    $('#empty-state').hidden = filtered.length > 0;
    document.querySelectorAll('[data-category]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.category === state.category));
    $('#category-select').value = state.category;
    if (Number.isInteger(focusIndex)) $('#product-grid').children[focusIndex]?.focus({preventScroll:true});
  }
  function setCategory(id) {
    state.category = categoryOptions.some((c) => c.id === id) ? id : 'all'; state.shown = 24;
    renderCatalog();
  }
  $('#category-list').addEventListener('click', (e) => { const b=e.target.closest('[data-category]'); if(b) setCategory(b.dataset.category); });
  $('#category-select').addEventListener('change', (e) => setCategory(e.target.value));
  $('#product-search').addEventListener('input', (e) => {state.search=e.target.value;state.shown=24;renderCatalog();});
  $('#product-sort').addEventListener('change', (e) => {state.sort=e.target.value;state.shown=24;renderCatalog();});
  $('#load-more').addEventListener('click', () => {const previous=state.shown;state.shown+=24;renderCatalog(previous);});
  $('#reset-filters').addEventListener('click', () => {state.search='';state.sort='featured';$('#product-search').value='';$('#product-sort').value='featured';setCategory('all');$('#product-search').focus();});
  document.querySelectorAll('[data-category-link]').forEach((link) => link.addEventListener('click', () => {state.search='';$('#product-search').value='';setCategory(link.dataset.categoryLink);}));

  function openDialog(dialog) { dialog.showModal(); dialog.scrollTop=0; }
  function showProduct(id) {
    const p=products.find((p) => p.id===id); if(!p)return;
    detailId=id;
    const inList=inquiry.has(id);
    $('#product-detail').innerHTML=`<div class="detail-layout"><img class="detail-image" src="${p.image}" alt="${escape(p.title+' – '+p.displayName)}"><div class="detail-copy"><span class="product-type">${escape(categoryName(p.category))}</span><h3 id="detail-title">${escape(p.displayName)}</h3><p class="detail-price">${escape(price(p))}</p><p class="detail-description">${escape((p.categoryNote ? p.categoryNote+'\n\n' : '') + (p.description || 'Kontakta Christina för information om den här produkten.'))}</p><div class="detail-actions"><button class="button button-primary" id="add-product" type="button">${inList?'Lägg till en till':'Lägg till i förfrågan'}</button><button class="text-link" id="detail-view-inquiry" type="button" ${inList?'':'hidden'}>Visa din förfrågan</button></div><p class="detail-note">${p.category==='tygkassar'?'Pions prisuppgifter för tygkassar skiljer sig mellan introduktionen och produktbilderna. Här visas priset vid produkten. ':''}Christina bekräftar pris, tillgänglighet och frakt. Bilden kan visa fler produkter eller varianter.</p><a class="detail-source" href="${p.sourceUrl}" target="_blank" rel="noopener">Se kategorin på Pions ursprungliga sida</a></div></div>`;
    openDialog($('#product-dialog'));
  }
  $('#product-grid').addEventListener('click', (e) => {const card=e.target.closest('[data-product]');if(card)showProduct(card.dataset.product);});
  $('#product-detail').addEventListener('click', (e) => {
    if (e.target.closest('#add-product')) {
      inquiry.set(detailId,Math.min((inquiry.get(detailId)||0)+1,99));updateCount();
      $('#add-product').textContent='Lägg till en till';$('#detail-view-inquiry').hidden=false;
      $('#product-dialog .dialog-top>span').textContent='Tillagd i din förfrågan';
    }
    if(e.target.closest('#detail-view-inquiry')) {$('#product-dialog').close();showInquiry();}
  });
  $('#product-dialog').addEventListener('close', () => {$('#product-dialog .dialog-top>span').textContent='En närmare titt';});
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => document.getElementById(b.dataset.close).close()));
  document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (e) => {if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
  function updateCount() {
    const count=Array.from(inquiry.values()).reduce((sum,n) => sum+n,0);
    document.querySelectorAll('.inquiry-count').forEach((el) => el.textContent=count);
    document.querySelectorAll('.inquiry-trigger').forEach((el) => el.setAttribute('aria-label',`Din förfrågan, ${count} valda produkter`));
  }
  function renderInquiry() {
    $('#inquiry-items').innerHTML=inquiry.size ? Array.from(inquiry.entries()).map(([id,qty]) => {
      const p=products.find((p) => p.id===id);
      return `<div class="inquiry-item"><img src="${p.thumb}" alt=""><div><h3>${escape(p.displayName)}</h3><p>${escape(p.title)} · ${escape(price(p))}</p><button class="remove-item" type="button" data-remove="${id}" aria-label="Ta bort ${escape(p.displayName)}">Ta bort</button></div><label class="quantity-label">Antal<input type="number" inputmode="numeric" min="1" max="99" value="${qty}" data-quantity="${id}" aria-label="Antal ${escape(p.displayName)}"></label></div>`;
    }).join('') : '<div class="inquiry-empty"><h3>Vad blir din favorit?</h3><p>Öppna en produkt och välj ”Lägg till i förfrågan”.</p><button class="button button-primary" id="inquiry-browse" type="button">Utforska sortimentet</button></div>';
    $('#inquiry-form').hidden=!inquiry.size;
    $('#inquiry-status').textContent='';$('#copy-fallback').hidden=true;
  }
  function showInquiry() { renderInquiry(); openDialog($('#inquiry-dialog')); }
  document.querySelectorAll('.inquiry-trigger').forEach((b) => b.addEventListener('click',showInquiry));
  $('#inquiry-items').addEventListener('click', (e) => {
    const remove=e.target.closest('[data-remove]');
    if(remove){const index=[...document.querySelectorAll('[data-remove]')].indexOf(remove);inquiry.delete(remove.dataset.remove);updateCount();renderInquiry();const next=document.querySelectorAll('[data-remove]');(next[Math.min(index,next.length-1)]||$('#inquiry-browse'))?.focus();}
    if(e.target.closest('#inquiry-browse')){$('#inquiry-dialog').close();$('#sortiment').scrollIntoView();$('#product-search').focus({preventScroll:true});}
  });
  $('#inquiry-items').addEventListener('input', (e) => {if(e.target.matches('[data-quantity]')){const n=Number(e.target.value);if(Number.isInteger(n)&&n>=1&&n<=99){inquiry.set(e.target.dataset.quantity,n);updateCount();}}});
  $('#inquiry-items').addEventListener('change', (e) => {if(e.target.matches('[data-quantity]')){const n=Math.min(99,Math.max(1,Math.round(Number(e.target.value)||1)));e.target.value=n;inquiry.set(e.target.dataset.quantity,n);updateCount();}});
  function composeInquiry() {
    const name=$('#customer-name').value.trim(), message=$('#customer-message').value.trim();
    const rows=Array.from(inquiry.entries()).map(([id,qty]) => {const p=products.find((p) => p.id===id);return `${qty} × ${p.title} – ${p.displayName}\nVisat pris: ${price(p)}\nKategori: ${p.sourceUrl}\nBild för att identifiera utförandet: ${p.imageUrl}`;});
    return `Hej Christina!\n\nJag vill gärna fråga om följande från Pion Design:\n\n${rows.join('\n\n')}\n\nKan du bekräfta tillgänglighet, pris och frakt?${message?'\n\nMina önskemål:\n'+message:''}\n\nVänliga hälsningar${name?'\n'+name:''}`;
  }
  $('#email-inquiry').addEventListener('click', () => {
    const body=composeInquiry();const base='mailto:bjorkagard711@telia.com?subject='+encodeURIComponent('Förfrågan – Pion Design');
    if(body.length>1800){$('#copy-fallback').value=body;$('#copy-fallback').hidden=false;$('#inquiry-status').textContent='Din förfrågan är lång. Kopiera texten nedan och klistra in den i mejlet som öppnas.';window.location.href=base;}
    else {$('#inquiry-status').textContent='Förfrågan öppnas i ditt mejlprogram. Om inget händer, kopiera texten eller använd Christinas formulär.';window.location.href=base+'&body='+encodeURIComponent(body);}
  });
  $('#copy-inquiry').addEventListener('click', async () => {const body=composeInquiry();try{await navigator.clipboard.writeText(body);$('#inquiry-status').textContent='Förfrågan är kopierad. Klistra in den i ett mejl till bjorkagard711@telia.com.';}catch{$('#copy-fallback').value=body;$('#copy-fallback').hidden=false;$('#copy-fallback').focus();$('#copy-fallback').select();$('#inquiry-status').textContent='Markera och kopiera texten nedan.';}});
  const menu=$('#mobile-nav'), toggle=$('.menu-toggle');
  function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.textContent='Meny';}
  toggle.addEventListener('click',()=>{const isOpen=!menu.hidden;menu.hidden=isOpen;toggle.setAttribute('aria-expanded',!isOpen);toggle.textContent=isOpen?'Meny':'Stäng';});
  menu.addEventListener('click',(e)=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus();}});
  document.addEventListener('click',(e)=>{if(!menu.hidden&&!e.target.closest('.site-header'))closeMenu();});
  matchMedia('(min-width:821px)').addEventListener('change',(e)=>{if(e.matches)closeMenu();});
  updateCount();renderCatalog();
})();
