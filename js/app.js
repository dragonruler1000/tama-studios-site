// Mobile nav toggle
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('site-menu');
  if (toggle && menu){
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Smooth scroll for same-page anchors
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href').slice(1);
    if(!id) return;
    const el = document.getElementById(id);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth', block:'start'});
    // Close mobile menu on navigate
    if(menu && menu.classList.contains('open')){
      menu.classList.remove('open');
      if(toggle) toggle.setAttribute('aria-expanded','false');
    }
  }, false);

  // Current year in footer
  const yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = String(new Date().getFullYear()); }

  // Employees: fetch and render from employeeinfo.json
  (function renderEmployees(){
    const container = document.querySelector('#employees .grid.services');
    if(!container) return;

    // Helper to build roles string from available keys
    const buildRoles = (obj) => {
      const parts = [];
      if(obj.role) parts.push(obj.role);
      if(obj.role2) parts.push(obj.role2);
      if(obj.role3) parts.push(obj.role3);
      return parts.join(', ');
    };

    fetch('employeeinfo.json')
      .then(r => {
        if(!r.ok) throw new Error('Network response was not ok');
        return r.json();
      })
      .then(data => {
        // Expecting an object keyed by employee name
        const entries = Object.entries(data);
        if(!entries.length) return;
        // Clear existing static entries
        container.innerHTML = '';
        const frag = document.createDocumentFragment();
        for(const [name, info] of entries){
          const div = document.createElement('div');
          div.className = 'service';
          // Avatar
          if (info.pfp){
            const img = document.createElement('img');
            img.className = 'avatar';
            img.src = info.pfp;
            img.alt = `${name} profile photo`;
            img.loading = 'lazy';
            img.width = 64; img.height = 64;
            div.appendChild(img);
          }
          const title = document.createElement('h3');
          const roles = buildRoles(info);
          title.textContent = roles ? `${name} — ${roles}` : name;
          const p = document.createElement('p');
          // ID and email; make email a mailto link
          const hasId = !!info.id;
          const hasEmail = !!info.email;
          if (hasId) {
            p.appendChild(document.createTextNode(`ID: ${info.id}`));
          }
          if (hasId && hasEmail) {
            p.appendChild(document.createTextNode(' • '));
          }
          if (hasEmail) {
            p.appendChild(document.createTextNode('Contact: '));
            const a = document.createElement('a');
            a.href = `mailto:${info.email}`;
            a.textContent = info.email;
            a.setAttribute('aria-label', `Email ${name}`);
            p.appendChild(a);
          }
          if (!hasId && !hasEmail) {
            p.textContent = 'Team member at Tama Studios.';
          }
          div.appendChild(title);
          div.appendChild(p);
          frag.appendChild(div);
        }
        container.appendChild(frag);
      })
      .catch(err => {
        // Fail silently; keep existing static HTML as a graceful fallback
        // console.warn('Employees fetch failed:', err);
      });
  })();
})();
