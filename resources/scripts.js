// Interactivity: mobile menu, smooth scroll, job filter, contact form stub
(function(){
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  menuToggle && menuToggle.addEventListener('click', ()=>{
    mainNav.classList.toggle('open');
  });

  // collapse nav when link clicked (mobile)
  document.querySelectorAll('#main-nav a').forEach(a=>{
    a.addEventListener('click', ()=>{
      if(window.innerWidth <= 700 && mainNav.classList.contains('open')){
        mainNav.classList.remove('open');
      }
    })
  })

  // smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      }
    })
  });

  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // job filter
  const filter = document.getElementById('filter-role');
  const jobList = document.getElementById('job-list');
  if(filter && jobList){
    filter.addEventListener('change', ()=>{
      const val = filter.value;
      const rows = jobList.querySelectorAll('[data-role]');
      rows.forEach(r=>{
        const role = r.getAttribute('data-role');
        if(val === 'all' || role === val) r.style.display = '';
        else r.style.display = 'none';
      })
    })
  }

  // contact form demo
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      alert('Thanks, we received your message. We will get back to you within 1 business day.');
      form.reset();
    })
  }

})();
