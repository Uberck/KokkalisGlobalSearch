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

  // Cookie Consent Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  
  // Check if user has already accepted cookies
  if (!localStorage.getItem('cookiesAccepted')) {
    // Show banner after a short delay
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }
  
  // Handle accept button click
  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 300);
    });
  }

  // Service Modal
  const modal = document.getElementById('service-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.querySelector('.modal-close');

  const serviceDetails = {
    executive: {
      title: 'Executive Search',
      content: `
        <p>Our Executive Search practice specializes in identifying and recruiting top-tier C-suite and senior leadership talent for high-growth organizations.</p>
        
        <h3>What We Offer:</h3>
        <ul>
          <li><strong>Confidential Search:</strong> Discreet outreach protecting both client and candidate privacy</li>
          <li><strong>Deep Assessment:</strong> Comprehensive evaluation of technical skills, leadership competencies, and cultural fit</li>
          <li><strong>Market Intelligence:</strong> Insights into compensation trends, competitive landscape, and talent availability</li>
          <li><strong>Targeted Outreach:</strong> Direct approach to passive candidates who aren't actively looking</li>
        </ul>

        <h3>Typical Roles:</h3>
        <ul>
          <li>Chief Executive Officer (CEO)</li>
          <li>Chief Technology Officer (CTO)</li>
          <li>Chief Product Officer (CPO)</li>
          <li>VP of Engineering, Product, Sales</li>
          <li>General Managers and Business Unit Leaders</li>
        </ul>

        <p><strong>Timeline:</strong> 6-12 weeks from kickoff to offer acceptance</p>
      `
    },
    permanent: {
      title: 'Permanent Hiring',
      content: `
        <p>End-to-end permanent recruitment for engineering, product, and go-to-market roles. We handle the entire hiring process so you can focus on running your business.</p>
        
        <h3>Our Process:</h3>
        <ul>
          <li><strong>Intake & Strategy:</strong> Deep dive into role requirements, team dynamics, and hiring goals</li>
          <li><strong>Sourcing:</strong> Multi-channel talent identification including LinkedIn, GitHub, referrals, and our network</li>
          <li><strong>Screening:</strong> Technical phone screens, behavioral interviews, and skills assessment</li>
          <li><strong>Coordination:</strong> Interview scheduling, feedback collection, and candidate management</li>
          <li><strong>Offer Support:</strong> Compensation benchmarking, offer presentation, and negotiation assistance</li>
        </ul>

        <h3>Common Roles:</h3>
        <ul>
          <li>Software Engineers (Backend, Frontend, Full-Stack)</li>
          <li>Product Managers</li>
          <li>Data Scientists & Analytics Engineers</li>
          <li>Sales & Account Executives</li>
          <li>Marketing Leaders</li>
        </ul>

        <p><strong>Timeline:</strong> 3-6 weeks per role, with ongoing pipeline development</p>
      `
    },
    contract: {
      title: 'Contract & Interim Staffing',
      content: `
        <p>Quickly deploy senior contractors and interim leaders for critical short-term projects, seasonal needs, or leadership transitions.</p>
        
        <h3>When to Use Contract Talent:</h3>
        <ul>
          <li><strong>Project-Based Work:</strong> Specific initiatives with defined scope and timeline</li>
          <li><strong>Interim Leadership:</strong> Bridge gaps during executive transitions or leaves</li>
          <li><strong>Seasonal Demand:</strong> Scale up for busy periods without long-term commitment</li>
          <li><strong>Trial Period:</strong> Evaluate talent before making a permanent hire (contract-to-hire)</li>
        </ul>

        <h3>Typical Engagements:</h3>
        <ul>
          <li>Interim CTO or VP of Engineering (3-9 months)</li>
          <li>Senior DevOps Engineers for cloud migration</li>
          <li>Product Managers for new product launches</li>
          <li>Fractional executives (part-time leadership)</li>
          <li>Technical consultants for specialized projects</li>
        </ul>

        <h3>Benefits:</h3>
        <ul>
          <li>Rapid deployment (often 1-2 weeks)</li>
          <li>No long-term commitment</li>
          <li>Access to senior talent who prefer contract work</li>
          <li>Flexibility to convert to permanent if desired</li>
        </ul>

        <p><strong>Timeline:</strong> 1-2 weeks to placement, with flexible engagement lengths</p>
      `
    }
  };

  // Open modal when clicking service cards
  document.querySelectorAll('.service-card').forEach(card => {
    const learnMoreBtn = card.querySelector('.service-learn-more');
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const serviceType = card.getAttribute('data-service');
        const details = serviceDetails[serviceType];
        
        if (details) {
          modalTitle.textContent = details.title;
          modalBody.innerHTML = details.content;
          modal.classList.add('show');
          document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
      });
    }
  });

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scrolling
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  });

  // Job pagination
  const jobList = document.getElementById('job-list');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');
  const filter = document.getElementById('filter-role');
  
  let currentPage = 1;
  const jobsPerPage = 4;
  let allJobs = [];
  let filteredJobs = [];

  function initJobs() {
    allJobs = Array.from(jobList.querySelectorAll('.job-row'));
    filteredJobs = [...allJobs];
    showPage(1);
  }

  function showPage(page) {
    currentPage = page;
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    
    // Hide all jobs first
    allJobs.forEach(job => job.style.display = 'none');
    
    // Show only jobs for current page
    const start = (page - 1) * jobsPerPage;
    const end = start + jobsPerPage;
    const jobsToShow = filteredJobs.slice(start, end);
    
    jobsToShow.forEach(job => job.style.display = '');
    
    // Update pagination controls
    pageInfo.textContent = `Page ${page} of ${totalPages}`;
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page >= totalPages;
  }

  function filterJobs() {
    const val = filter.value;
    if (val === 'all') {
      filteredJobs = [...allJobs];
    } else {
      filteredJobs = allJobs.filter(job => job.getAttribute('data-role') === val);
    }
    showPage(1); // Reset to first page when filtering
  }

  if (jobList && prevBtn && nextBtn) {
    initJobs();
    
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        showPage(currentPage - 1);
      }
    });
    
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
      if (currentPage < totalPages) {
        showPage(currentPage + 1);
      }
    });
    
    if (filter) {
      filter.addEventListener('change', filterJobs);
    }
  }

  // job filter (old implementation removed, now handled by pagination above)

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