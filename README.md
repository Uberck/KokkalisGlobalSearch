# Kokkalis Global Search — Executive Recruiting & Talent Acquisition

A modern, high-performance website for Kokkalis Global Search — a premier recruiting and talent acquisition firm specializing in executive search, permanent hiring, and contract staffing for engineering, product, sales, and leadership roles.

## 🎯 About

Kokkalis Global Search is a high-impact talent partner built to outperform competitors. We don't just fill roles — we solve hiring problems and elevate talent strategy. With 10+ years of expertise and 500+ successful hires, we deliver results that move businesses forward.

**Our Mission:** Act as a true advisor, strategist, and extension of your leadership team — bringing faster, sharper, and more committed recruiting solutions than the competition.

---

## ✨ Website Capabilities & Features

### Core Experience
- **Single-page application (SPA)** with smooth anchor-link navigation
- **Fully responsive design** — optimized for desktop, tablet, and mobile devices
- **Professional, modern aesthetic** with clean UI components and typography
- **Dark Mode toggle** — persistent preference stored in localStorage
- **Cookie consent banner** — GDPR-compliant with accept/decline options
- **Scroll-to-top button** — floating navigation for long-page scrolling

### Services Section
- **Interactive service cards** with detailed modal dialogs
- **Four core service offerings:**
  - Executive Search — C-suite and senior leadership recruitment
  - Permanent Hiring — End-to-end recruitment for engineering, product, and GTM roles
  - Contract & Interim Staffing — Senior contractors and interim leaders
  - Talent Advisory & Recruiting Operations Consulting — Strategic hiring optimization

### Featured Roles Section
- **Job board with pagination** — displays 4 jobs per page with previous/next controls
- **Real-time job filtering** — filter by role category (All, Engineering, Product, Sales, Executive)
- **Dynamic job displays** — each job shows title, location, job type, and apply CTA
- **Pagination controls** — page info indicator and navigation buttons
- **Responsive job cards** — mobile-optimized layout

### Contact & Lead Generation
- **Web3Forms integration** — serverless contact form submissions
- **Multi-field contact form** with validation:
  - Name, email, company
  - Interest dropdown (Hiring, Applying, General inquiry)
  - Message textarea
- **Auto-reply confirmation** and error handling
- **Contact sidebar** — email, phone, LinkedIn link, location
- **Form submission tracking**

### Additional Features
- **Google Search integration** — site-wide search bar in header
- **Google Analytics** — built-in GA4 tracking (ID: G-ZRWEEF2ZTQ)
- **SEO optimization** — Open Graph, Twitter Cards, meta descriptions, structured markup
- **Smooth scroll behavior** — all anchor links animate smoothly
- **Mobile menu toggle** — hamburger menu that collapses on nav link click
- **Video hero background** — autoplay, looping background video in hero section
- **Testimonials carousel** — 3-card testimonial section with 5-star ratings
- **About section** — company narrative with image and key stats (10+ years, 500+ hires, 90% retention)

---

## 🛠 Technical Stack

- **Pure HTML5/CSS3/JavaScript** — no frameworks or build tools required
- **Vanilla JavaScript** — all interactivity written without dependencies
- **Google Fonts** — Inter typeface (weights: 300, 400, 600, 800)
- **Web3Forms API** — serverless contact form processing
- **Google Analytics** — GA4 event tracking
- **Responsive mobile-first design** — CSS media queries for all breakpoints
- **localStorage** — dark mode preference and cookie consent persistence
- **CSS Grid & Flexbox** — modern layout techniques

### File Structure
```
index.html              # Main HTML document
resources/
  ├── home.css         # All styles (compiled, no preprocessors)
  ├── main.js          # All JavaScript (vanilla, no dependencies)
  ├── KGS.png          # Brand logo
  ├── favicon2.png     # Favicon
  └── topbg.mp4        # Hero video background
```

---

## 🚀 Future Integration: Airtable

The website is architected to support dynamic job listings via Airtable API:
- Configuration block ready for Airtable credentials (API key, Base ID)
- Placeholder functions for `fetchJobsFromAirtable()`, `renderJobs()`, `filterJobs()`
- Loading and empty states designed but not yet activated
- Once configured, job listings will pull from Airtable "Published" view in real-time

---

## 📊 Key Statistics

- **Experience:** 10+ years in executive recruiting and talent acquisition
- **Track Record:** 500+ successful placements
- **Retention:** 90% client retention rate
- **Team Size:** Boutique, hands-on recruiting firm
- **Geographic Focus:** Boston, MA — Global reach

---

## 📞 Contact Information

**Kokkalis Global Search**  
📧 Email: admin@kokkalisgs.com  
📱 Phone: (617) 398-7045  
🔗 LinkedIn: [George Kokkalis](https://www.linkedin.com/in/george-kokkalis-bb6406a8/)  
📍 Location: Boston, MA

---

## ⚙️ How to Use This Website

### For End Users
1. Browse services on the homepage
2. Click "Learn More" on service cards for detailed information
3. View featured roles in the Jobs section
4. Filter jobs by category or browse all
5. Click "Apply" to submit an inquiry
6. Use the Contact section to start a search or ask questions
7. Toggle dark mode with the moon/sun icon
8. Toggle mobile menu on smaller screens

### For Developers
1. Edit `index.html` for content/structure changes
2. Edit `resources/home.css` for styling
3. Edit `resources/main.js` for interactivity
4. No build process or dependencies required
5. Deploy to any static hosting (GitHub Pages, Netlify, Vercel, etc.)

### To Deploy
- Upload all files to your web server
- Ensure `resources/` folder is properly linked
- Update contact form `access_key` in index.html if changing Web3Forms account
- Test Google Analytics tracking on live site
- Verify video background loads correctly

---

## 🎨 Design & Branding

- **Color Scheme:** Professional blue-gray palette with high contrast
- **Typography:** Inter font family for modern, clean readability
- **Spacing:** Generous whitespace and breathing room
- **Accessibility:** WCAG-compliant color contrasts, semantic HTML, ARIA labels
- **Dark Mode:** Full dark theme support with automatic text inversion and color adjustments

---

## 📝 License

© 2026 Kokkalis Global Search — All rights reserved
