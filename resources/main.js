/**
 * ===========================
 * Kokkalis Global Search - Main JavaScript
 * ===========================
 * Handles all client-side interactivity including:
 * - Mobile navigation
 * - Smooth scrolling
 * - Dark mode toggle
 * - Cookie consent
 * - Service modals
 * - Job pagination & filtering
 * - Contact form submission
 * - Scroll to top button
 * ===========================
 */

(function() {
  'use strict';

  // ===========================
  // Configuration & Constants
  // ===========================
  const JOBS_PER_PAGE = 4; // Number of job listings displayed per page
  const COOKIE_BANNER_DELAY = 1000; // Delay before showing cookie banner (milliseconds)
  const SCROLL_TO_TOP_THRESHOLD = 300; // Scroll distance before showing back-to-top button (pixels)

  // Check for reduced motion preference for accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  // ===========================
  // Safe localStorage Utilities
  // ===========================

  /**
   * Safely get item from localStorage with error handling
   * Protects against localStorage access failures in private browsing mode or when quota is exceeded
   * @param {string} key - The localStorage key to retrieve
   * @returns {string|null} - The value or null if not found or on error
   */
  function safeGetLocalStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage access failed:', e);
      return null;
    }
  }

  /**
   * Safely set item in localStorage with error handling
   * Protects against quota exceeded errors and access restrictions
   * @param {string} key - The localStorage key to set
   * @param {string} value - The value to store
   * @returns {boolean} - True if successful, false otherwise
   */
  function safeSetLocalStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('localStorage write failed (quota exceeded or restricted access):', e);
      return false;
    }
  }

  /**
   * Basic HTML sanitization for innerHTML operations
   * Removes script tags as an extra safety measure for trusted content
   * @param {string} html - HTML string to sanitize
   * @returns {string} - Sanitized HTML with script tags removed
   */
  function sanitizeHTML(html) {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }


  // ===========================
  // Mobile Navigation
  // ===========================

  /**
   * Initialize mobile hamburger menu functionality
   * Handles opening/closing the navigation menu on mobile devices (<700px width)
   * Menu auto-closes when navigation links are clicked to improve UX
   */
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (!menuToggle || !mainNav) return;

    // Toggle menu on hamburger button click (adds/removes 'open' class)
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    // Close menu when clicking on navigation links (mobile only)
    // This prevents users from having to manually close the menu after selecting a section
    document.querySelectorAll('#main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 700 && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
        }
      });
    });
  }


  // ===========================
  // Smooth Scrolling
  // ===========================

  /**
   * Enable smooth scrolling for anchor links (e.g., #about, #services)
   * Respects user's reduced motion preference for accessibility (WCAG 2.1)
   * Uses native scrollIntoView API for optimal performance
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');

        // Only handle internal anchor links with actual targets (not just "#")
        if (href.length > 1) {
          e.preventDefault();
          const targetElement = document.querySelector(href);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth', // Instant scroll if user prefers reduced motion
              block: 'start' // Align element to top of viewport
            });
          }
        }
      });
    });
  }


  // ===========================
  // Footer Year
  // ===========================

  /**
   * Set current year in footer copyright
   */
  function setFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }


  // ===========================
  // Google Search Form
  // ===========================

  /**
   * Initialize search form
   * Searches both the site and Google by prepending site:kokkalisgs.com to the query
   */
  function initGoogleSearch() {
    const googleSearchForm = document.getElementById('google-search-form');
    const googleSearchInput = document.getElementById('google-search-input');

    if (!googleSearchForm || !googleSearchInput) return;

    googleSearchForm.addEventListener('submit', function(e) {
      const searchTerm = googleSearchInput.value.trim();

      // Validate that search term is not empty
      if (searchTerm === '') {
        e.preventDefault();
        alert('Please enter a search term before searching.');
        googleSearchInput.focus();
        return;
      }

      // Prepend site: operator to search both site and Google
      googleSearchInput.value = 'site:kokkalisgs.com ' + searchTerm;
    });
  }


  // ===========================
  // Dark Mode Toggle
  // ===========================

  /**
   * Update tooltip text based on current dark mode state
   */
  function updateDarkModeTooltip() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    if (!darkModeToggle) return;

    if (body.classList.contains('dark-mode')) {
      darkModeToggle.setAttribute('data-tooltip', 'Switch to light mode');
    } else {
      darkModeToggle.setAttribute('data-tooltip', 'Switch to dark mode');
    }
  }

  /**
   * Initialize dark mode toggle functionality
   * Saves user preference to localStorage for persistence across sessions
   */
  function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    if (!darkModeToggle) return;

    // Check for saved dark mode preference using safe localStorage access
    if (safeGetLocalStorage('darkMode') === 'enabled') {
      body.classList.add('dark-mode');
    }
    updateDarkModeTooltip();

    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      updateDarkModeTooltip();

      // Save preference to localStorage using safe wrapper
      if (body.classList.contains('dark-mode')) {
        safeSetLocalStorage('darkMode', 'enabled');
      } else {
        safeSetLocalStorage('darkMode', 'disabled');
      }
    });
  }


  // ===========================
  // Cookie Consent Banner
  // ===========================

  /**
   * Initialize cookie consent banner
   * Shows banner if user hasn't made a choice yet
   * Complies with privacy regulations by requiring explicit consent
   */
  function initCookieConsent() {
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (!cookieBanner || !cookieAccept || !cookieDecline) return;

    // Check if user has already accepted cookies using safe localStorage access
    if (!safeGetLocalStorage('cookiesAccepted')) {
      // Show banner after a short delay to avoid interrupting initial page load
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, COOKIE_BANNER_DELAY);
    }

    // Handle accept button click - save preference and hide banner
    cookieAccept.addEventListener('click', () => {
      safeSetLocalStorage('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');

      // Adjust scroll to top button position
      const scrollBtn = document.getElementById('scroll-to-top');
      if (scrollBtn) {
        scrollBtn.classList.add('cookie-accepted');
      }

      // Hide banner after animation
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 300);
    });

    // Handle decline button click - redirect to Google
    cookieDecline.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });

    // Debug: Check if tawk.to is loading
    console.log('Cookie consent initialized. Checking for tawk.to widget...');
    setTimeout(() => {
      const tawkContainer = document.getElementById('tawkchat-container');
      const tawkIframe = document.querySelector('iframe[src*="tawk.to"]');
      console.log('Tawk container found:', !!tawkContainer);
      console.log('Tawk iframe found:', !!tawkIframe);
      if (tawkIframe) {
        console.log('Tawk iframe styles:', {
          display: tawkIframe.style.display,
          visibility: tawkIframe.style.visibility,
          zIndex: tawkIframe.style.zIndex
        });
      }
    }, 3000);
  }


  // ===========================
  // Service Modal
  // ===========================

  /**
   * Service details data for modal content
   */
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
    },
    advisory: {
      title: 'Talent Advisory & Recruiting Operations Consulting',
      content: `
        <p>Transform your hiring function from a bottleneck into a competitive advantage. We partner with leadership teams to design, optimize, and scale world-class talent acquisition operations.</p>

        <h3>What We Offer:</h3>
        <ul>
          <li><strong>Recruiting Strategy:</strong> Build data-driven hiring plans aligned with business goals and growth trajectories</li>
          <li><strong>Process Optimization:</strong> Audit and redesign your recruiting workflows for speed, quality, and candidate experience</li>
          <li><strong>Internal Team Development:</strong> Train and coach in-house recruiters on sourcing, assessment, and closing techniques</li>
          <li><strong>Employer Branding:</strong> Develop compelling value propositions and talent marketing strategies</li>
          <li><strong>Metrics & Analytics:</strong> Implement recruiting dashboards and KPIs to drive accountability and continuous improvement</li>
        </ul>

        <h3>Common Consulting Engagements:</h3>
        <ul>
          <li>Recruiting operations audit and roadmap development</li>
          <li>Hiring manager training and interview calibration</li>
          <li>ATS and recruiting tool stack evaluation</li>
          <li>Diversity, equity, and inclusion (DEI) recruiting initiatives</li>
          <li>Scaling recruiting teams for hyper-growth companies</li>
          <li>Building internal recruiting functions from scratch</li>
        </ul>

        <h3>Who Benefits:</h3>
        <ul>
          <li>High-growth startups building their first recruiting team</li>
          <li>Companies struggling with slow time-to-hire or poor candidate quality</li>
          <li>Organizations preparing for a major hiring surge</li>
          <li>Leadership teams seeking to reduce reliance on external agencies</li>
        </ul>

        <p><strong>Engagement Format:</strong> Flexible retainer or project-based consulting with 30-90 day typical engagements</p>
      `
    }
  };

  /**
   * Privacy and Terms content data for modal
   */
  const legalContent = {
    privacy: {
      title: 'Privacy Policy',
      content: `
        <p><strong>Effective Date:</strong> January 1, 2026</p>

        <h3>Information We Collect</h3>
        <p>Kokkalis Global Search ("we," "our," or "us") collects information that you provide directly to us through our website, including:</p>
        <ul>
          <li>Contact information (name, email address, phone number)</li>
          <li>Company information and job requirements</li>
          <li>Communications you send to us</li>
          <li>Resume and professional background information (for job applicants)</li>
        </ul>

        <h3>How We Use Your Information</h3>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your inquiries and provide recruiting services</li>
          <li>Match candidates with job opportunities</li>
          <li>Communicate with you about our services</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h3>Information Sharing</h3>
        <p>We do not sell your personal information. We may share your information with:</p>
        <ul>
          <li>Client companies when you apply for positions or when we believe you may be a good fit</li>
          <li>Service providers who assist with our operations (email services, analytics, etc.)</li>
          <li>Legal authorities when required by law</li>
        </ul>

        <h3>Cookies and Analytics</h3>
        <p>We use cookies and similar technologies to analyze website traffic and improve user experience. You can control cookies through your browser settings.</p>

        <h3>Data Security</h3>
        <p>We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>

        <h3>Your Rights</h3>
        <p>You have the right to access, correct, or delete your personal information. Contact us at admin@kokkalisgs.com to exercise these rights.</p>

        <h3>Contact Us</h3>
        <p>If you have questions about this Privacy Policy, please contact us at:<br>
        Email: admin@kokkalisgs.com<br>
        Phone: (617) 398-7045</p>
      `
    },
    terms: {
      title: 'Terms of Service',
      content: `
        <p><strong>Effective Date:</strong> January 1, 2026</p>

        <h3>Acceptance of Terms</h3>
        <p>By accessing and using the Kokkalis Global Search website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.</p>

        <h3>Services Description</h3>
        <p>Kokkalis Global Search provides executive recruiting, permanent hiring, contract staffing, and talent advisory services. We act as an intermediary between employers seeking talent and professionals seeking opportunities.</p>

        <h3>User Responsibilities</h3>
        <p>When using our services, you agree to:</p>
        <ul>
          <li>Provide accurate and truthful information</li>
          <li>Not misrepresent your qualifications, experience, or hiring needs</li>
          <li>Respect confidentiality of shared information</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Not use our website for any unlawful purpose</li>
        </ul>

        <h3>Intellectual Property</h3>
        <p>All content on this website, including text, graphics, logos, and software, is the property of Kokkalis Global Search and is protected by copyright and trademark laws.</p>

        <h3>No Guarantees</h3>
        <p>While we strive to provide excellent service, we do not guarantee:</p>
        <ul>
          <li>Specific hiring outcomes or successful placements</li>
          <li>Continuous, uninterrupted access to our website</li>
          <li>That all information on our website is current or error-free</li>
        </ul>

        <h3>Limitation of Liability</h3>
        <p>Kokkalis Global Search shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or website.</p>

        <h3>Fee Structure</h3>
        <p>Recruiting fees are negotiated separately with each client and are outlined in individual service agreements. Candidates are never charged fees for our services.</p>

        <h3>Termination</h3>
        <p>We reserve the right to terminate or suspend access to our services at our discretion, without notice, for conduct that violates these Terms or is harmful to our business or other users.</p>

        <h3>Changes to Terms</h3>
        <p>We may update these Terms of Service from time to time. Continued use of our website after changes constitutes acceptance of the revised terms.</p>

        <h3>Governing Law</h3>
        <p>These Terms are governed by the laws of the Commonwealth of Massachusetts, United States.</p>

        <h3>Contact Information</h3>
        <p>For questions about these Terms of Service, contact us at:<br>
        Email: admin@kokkalisgs.com<br>
        Phone: (617) 398-7045</p>
      `
    }
  };

  /**
   * Initialize service modal functionality
   * Opens modal when clicking "Learn More" buttons on service cards
   * Also handles Privacy Policy and Terms of Service modals
   * Modal content is mapped via data-service attribute (executive, permanent, contract, advisory)
   */
  function initServiceModal() {
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal || !modalTitle || !modalBody || !closeBtn) return;

    // Open modal when clicking service card "Learn More" buttons
    document.querySelectorAll('.service-card').forEach(card => {
      const learnMoreBtn = card.querySelector('.service-learn-more');

      if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent event bubbling to parent elements
          const serviceType = card.getAttribute('data-service'); // e.g., 'executive', 'permanent'
          const details = serviceDetails[serviceType];

          if (details) {
            modalTitle.textContent = details.title;
            // Sanitize HTML content before rendering (removes script tags for security)
            modalBody.innerHTML = sanitizeHTML(details.content);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling while modal is open
          }
        });
      }
    });

    // Close modal when clicking the X button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the content area (on the backdrop)
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal on Escape key press (accessibility feature)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
      }
    });

    /**
     * Close the modal and restore page scrolling
     * Three ways to close: X button, outside click, or ESC key
     */
    function closeModal() {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scrolling
    }

    // Privacy Policy link in footer
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');

    if (privacyLink) {
      privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        const details = legalContent.privacy;
        modalTitle.textContent = details.title;
        modalBody.innerHTML = sanitizeHTML(details.content); // Sanitize for security
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    }

    // Terms of Service link in footer
    if (termsLink) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        const details = legalContent.terms;
        modalTitle.textContent = details.title;
        modalBody.innerHTML = sanitizeHTML(details.content); // Sanitize for security
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    }

    // Privacy policy link in cookie consent banner
    const cookiePrivacyLink = document.getElementById('cookie-privacy-link');
    if (cookiePrivacyLink) {
      cookiePrivacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        const details = legalContent.privacy;
        modalTitle.textContent = details.title;
        modalBody.innerHTML = sanitizeHTML(details.content); // Sanitize for security
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    }
  }


  // ===========================
  // Job Pagination & Filtering
  // ===========================

  /**
   * Job pagination state management
   *
   * State variables:
   * - currentPage: Current page number being displayed (1-indexed)
   * - allJobs: Array of all job DOM elements from the page
   * - filteredJobs: Subset of allJobs based on current filter selection
   *
   * Jobs are filtered by data-role attribute on each .job-row element
   * Valid roles: 'engineering', 'product', 'sales', 'executive'
   */
  let currentPage = 1;
  let allJobs = [];
  let filteredJobs = [];

  /**
   * Initialize job list array from DOM
   * Converts NodeList to array for easier manipulation
   * Sets initial state with all jobs visible (no filter applied)
   */
  function initJobs() {
    const jobList = document.getElementById('job-list');
    if (!jobList) return;

    allJobs = Array.from(jobList.querySelectorAll('.job-row'));
    filteredJobs = [...allJobs]; // Start with all jobs visible
    showPage(1); // Display first page
  }

  /**
   * Display jobs for a specific page
   * Implements pagination logic:
   * 1. Hide all job rows
   * 2. Show only jobs for current page (JOBS_PER_PAGE items)
   * 3. Update pagination controls (prev/next buttons, page indicator)
   *
   * @param {number} page - Page number to display (1-indexed)
   */
  function showPage(page) {
    const jobList = document.getElementById('job-list');
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (!jobList || !pageInfo || !prevBtn || !nextBtn) return;

    currentPage = page;
    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

    // Hide all jobs first to reset display state
    allJobs.forEach(job => job.style.display = 'none');

    // Calculate which jobs to show based on current page
    // Example: Page 2 with 4 jobs/page shows jobs 4-7 (indices 4-8)
    const start = (page - 1) * JOBS_PER_PAGE;
    const end = start + JOBS_PER_PAGE;
    const jobsToShow = filteredJobs.slice(start, end);

    // Show jobs for current page
    jobsToShow.forEach(job => job.style.display = '');

    // Update pagination UI
    pageInfo.textContent = `Page ${page} of ${totalPages}`;
    prevBtn.disabled = page === 1; // Disable prev on first page
    nextBtn.disabled = page >= totalPages; // Disable next on last page
  }

  /**
   * Filter jobs by role category
   * Filters based on data-role attribute on job elements
   * Resets to page 1 after filtering to avoid showing empty pages
   *
   * Filter options: 'all', 'engineering', 'product', 'sales', 'executive'
   */
  function filterJobs() {
    const filter = document.getElementById('filter-role');
    if (!filter) return;

    const val = filter.value;

    if (val === 'all') {
      // Show all jobs when 'all' is selected
      filteredJobs = [...allJobs];
    } else {
      // Filter jobs by matching data-role attribute
      filteredJobs = allJobs.filter(job => job.getAttribute('data-role') === val);
    }

    showPage(1); // Reset to first page when filter changes
  }

  /**
   * Initialize job pagination and filtering controls
   * Sets up event listeners for pagination buttons and filter dropdown
   * Note: Jobs are currently hardcoded in HTML, but architecture supports future Airtable API integration
   */
  function initJobPagination() {
    const jobList = document.getElementById('job-list');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const filter = document.getElementById('filter-role');

    if (!jobList || !prevBtn || !nextBtn) return;

    initJobs(); // Load initial job state

    // Previous page button - go back one page
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        showPage(currentPage - 1);
      }
    });

    // Next page button - advance one page
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
      if (currentPage < totalPages) {
        showPage(currentPage + 1);
      }
    });

    // Filter dropdown - filter jobs by role category
    if (filter) {
      filter.addEventListener('change', filterJobs);
    }
  }


  // ===========================
  // Contact Form
  // ===========================

  /**
   * Handle contact form submission
   * Features:
   * - Dynamic placeholder text based on inquiry type (Hiring, Applying, General inquiry)
   * - Web3Forms API for serverless form processing (no backend required)
   * - Client-side validation via HTML5 attributes (required, email type, etc.)
   * - User feedback during submission (button state changes, success/error alerts)
   *
   * Form data sent to: https://api.web3forms.com/submit
   * Access key configured in HTML hidden input field
   */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Dynamic placeholder text based on dropdown selection
    const interestSelect = document.getElementById('interest-select');
    const messageTextarea = document.getElementById('message-textarea');

    // Map inquiry types to contextual placeholder text
    const placeholderMap = {
      'Hiring': 'Tell us about the role you\'re hiring for...',
      'Applying for a role': 'Tell us about your background and which role interests you...',
      'General inquiry': 'Tell us more about your question...'
    };

    // Update placeholder dynamically when user changes inquiry type
    if (interestSelect && messageTextarea) {
      interestSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        messageTextarea.placeholder = placeholderMap[selectedValue] || 'Tell us about the role or your question...';
      });

      // Set initial placeholder based on default selection (Hiring)
      const initialValue = interestSelect.value;
      messageTextarea.placeholder = placeholderMap[initialValue] || 'Tell us about the role or your question...';
    }

    // Handle form submission via fetch API
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent default form submission

      const formData = new FormData(form);
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;

      // Update button state to show submission in progress
      button.textContent = 'Sending...';
      button.disabled = true;

      try {
        // Submit to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Success - show confirmation and reset form
          alert('Thanks! We received your message and will get back to you within 1 business day.');
          form.reset();
        } else {
          // API returned error
          alert('Oops! Something went wrong. Please email us directly at admin@kokkalisgs.com');
        }
      } catch (error) {
        // Network error or API unavailable
        console.error('Form submission error:', error);
        alert('Oops! Something went wrong. Please email us directly at admin@kokkalisgs.com');
      }

      // Restore button to original state
      button.textContent = originalText;
      button.disabled = false;
    });
  }


  // ===========================
  // Scroll to Top Button
  // ===========================

  /**
   * Initialize scroll to top button with circular progress indicator
   *
   * Features:
   * - Shows button after scrolling down 300px (SCROLL_TO_TOP_THRESHOLD)
   * - Circular progress ring fills as user scrolls down the page
   * - Smooth scroll back to top on click (respects reduced motion preference)
   * - Position adjusts based on cookie banner visibility
   *
   * Technical details:
   * - Uses SVG circle with stroke-dashoffset for progress animation
   * - Progress calculated as: (scrollTop / maxScrollHeight) * 100
   * - Button positioned fixed at bottom-right of viewport
   */
  function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (!scrollToTopBtn) return;

    const progressCircle = scrollToTopBtn.querySelector('.progress-ring-progress');
    const radius = 26; // Must match the 'r' attribute in the SVG circle element
    const circumference = 2 * Math.PI * radius; // Circle circumference ≈ 163.36 pixels

    // Check if cookies already accepted and adjust button position accordingly
    // (Cookie banner affects bottom positioning of scroll button)
    if (safeGetLocalStorage('cookiesAccepted') === 'true') {
      scrollToTopBtn.classList.add('cookie-accepted');
    }

    /**
     * Calculate and update scroll progress indicator
     * Called on every scroll event to update the progress ring
     *
     * Progress calculation:
     * 1. Get current scroll position (scrollTop)
     * 2. Calculate total scrollable height (scrollHeight - clientHeight)
     * 3. Calculate percentage scrolled
     * 4. Convert percentage to stroke-dashoffset for SVG circle
     */
    function updateProgress() {
      // Calculate scroll percentage
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      // Update progress ring using stroke-dashoffset
      // As user scrolls, offset decreases, revealing more of the circle
      if (progressCircle) {
        const offset = circumference - (scrollPercentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
      }

      // Show button when scrolled past threshold, hide when near top
      if (scrollTop > SCROLL_TO_TOP_THRESHOLD) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    }

    // Update progress on scroll event
    window.addEventListener('scroll', updateProgress);

    // Initial update on page load
    updateProgress();

    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth' // Instant scroll for users who prefer reduced motion
      });
    });
  }


  // ===========================
  // Header Scroll Behavior
  // ===========================

  /**
   * Initialize smooth header show/hide on scroll
   * Features:
   * - Hides header smoothly when scrolling down
   * - Shows header smoothly when scrolling up
   * - Prevents jitter with scroll threshold
   */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollTop = 0;
    const scrollThreshold = 5; // Minimum scroll distance to trigger hide/show

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      // Ignore small scroll movements to prevent jitter
      if (Math.abs(currentScroll - lastScrollTop) < scrollThreshold) {
        return;
      }

      // Always show header when near the top of the page
      if (currentScroll <= 100) {
        header.classList.remove('header-hidden');
      }
      // Hide header when scrolling down
      else if (currentScroll > lastScrollTop && !header.classList.contains('header-hidden')) {
        header.classList.add('header-hidden');
      }
      // Show header when scrolling up
      else if (currentScroll < lastScrollTop && header.classList.contains('header-hidden')) {
        header.classList.remove('header-hidden');
      }

      lastScrollTop = currentScroll;
    });
  }


  // ===========================
  // Initialize All Features
  // ===========================

  /**
   * Main initialization function
   * Called immediately when DOM is ready (wrapped in IIFE)
   *
   * Initialization order:
   * 1. Navigation - Mobile menu, smooth scrolling, header scroll behavior
   * 2. UI Features - Footer year, Google search, dark mode, cookies, modals
   * 3. Job Features - Pagination and filtering
   * 4. Forms - Contact form with dynamic placeholders
   * 5. Scroll Features - Back-to-top button with progress indicator
   *
   * All functions use early returns if required DOM elements are missing,
   * preventing errors if HTML structure changes
   */
  function init() {
    // Navigation
    initMobileMenu();        // Hamburger menu toggle
    initSmoothScroll();      // Anchor link smooth scrolling
    initHeaderScroll();      // Smooth header show/hide on scroll

    // UI Features
    setFooterYear();         // Dynamic copyright year
    initGoogleSearch();      // Search form validation
    initDarkMode();          // Dark/light theme toggle
    initCookieConsent();     // Cookie consent banner
    initServiceModal();      // Service details & legal modals

    // Job Features
    initJobPagination();     // Job listing pagination & filtering

    // Forms
    initContactForm();       // Contact form submission

    // Scroll Features
    initScrollToTop();       // Back-to-top button with progress
  }

  // Run initialization when script loads
  // IIFE ensures code runs immediately and variables stay private
  init();

})();