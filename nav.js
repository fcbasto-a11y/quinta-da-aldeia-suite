function renderNav(activePage) {
  var role = sessionStorage.getItem('qa_auth_role') || '';

  var links = [
    { href:'index.html',        label:'Calendar',       id:'calendar' },
    { href:'quotes.html',       label:'Quote requests', id:'quotes' },
    { href:'payments.html',     label:'Payments',       id:'payments' },
    { href:'checklist.html',    label:'Checklists',     id:'checklist' },
    { href:'revenue.html',      label:'Revenue',        id:'revenue' },
    { href:'finance.html',      label:'Finance',        id:'finance',      ownerOnly:true },
    { href:'anniversaries.html',label:'Anniversaries',  id:'anniversaries' },
    { href:'wedding-form.html', label:'Checklist form', id:'weddingform' },
  ];

  var botLinks = [
    { href:'index.html',        label:'Calendar',   id:'calendar',     icon:'<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>' },
    { href:'quotes.html',       label:'Quotes',     id:'quotes',       icon:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
    { href:'payments.html',     label:'Payments',   id:'payments',     icon:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>' },
    { href:'finance.html',      label:'Finance',    id:'finance',      icon:'<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',  ownerOnly:true },
    { href:'anniversaries.html',label:'Anniv.',     id:'anniversaries',icon:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>' },
  ];

  var visibleLinks = links.filter(function(l) {
    return !l.ownerOnly || role === 'owner';
  });
  var visibleBotLinks = botLinks.filter(function(l) {
    return !l.ownerOnly || role === 'owner';
  });

  var roleLabel = role === 'owner' ? 'Proprietário' : role === 'staff' ? 'Staff' : '';
  var roleBadge = roleLabel
    ? '<span id="role-indicator" style="font-size:10px;letter-spacing:0.07em;text-transform:uppercase;padding:3px 10px;border-radius:20px;background:var(--cream2);color:var(--ink3);margin-right:6px">' + roleLabel + '</span>'
    : '';

  document.getElementById('nav-placeholder').innerHTML = `
    <nav class="nav">
      <a class="nav-brand" href="index.html">
        <img src="logo.png" alt="Quinta da Aldeia" class="nav-logo">
      </a>
      <div class="nav-links">
        ${visibleLinks.map(l=>`<a href="${l.href}" class="nav-link${l.id===activePage?' active':''}">${l.label}</a>`).join('')}
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        ${roleBadge}
        <button onclick="logout()" class="btn btn-sm" style="font-size:10px;letter-spacing:0.06em">Sair</button>
      </div>
    </nav>
    <nav class="bottom-nav" aria-label="Mobile navigation">
      <div class="bottom-nav-inner" style="grid-template-columns:repeat(${visibleBotLinks.length},1fr)">
        ${visibleBotLinks.map(l=>`
          <a href="${l.href}" class="bot-link${l.id===activePage?' active':''}">
            <svg viewBox="0 0 24 24" aria-hidden="true">${l.icon}</svg>
            <span>${l.label}</span>
          </a>`).join('')}
      </div>
    </nav>
  `;
}
