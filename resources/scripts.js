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

  // Contact form - Web3Forms handles submissions
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();     
      const formData = new FormData(form);
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;   
      button.textContent = 'Sending...';
      button.disabled = true;    
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });    
        const data = await response.json();       
        if (data.success) {
          alert('Thanks! We received your message and will get back to you within 1 business day.');
          form.reset();
        } else {
          alert('Oops! Something went wrong. Please email us directly at kokkalisgs@gmail.com');
        }
      } catch (error) {
        alert('Oops! Something went wrong. Please email us directly at kokkalisgs@gmail.com');
      } 
      button.textContent = originalText;
      button.disabled = false;
    });
  }
})();