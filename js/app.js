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
})();
