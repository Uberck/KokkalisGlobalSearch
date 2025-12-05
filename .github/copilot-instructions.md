# Copilot Instructions — Kokkalis Global Search

## Project Overview
Single-file static website (`KokkalisSearchGroup.html`) for a recruiting/staffing business. Self-contained HTML with inline CSS and vanilla JavaScript — no build tools, frameworks, or dependencies.

## Architecture & Structure

**Single-Page Application Pattern**
- All content in one 367-line HTML file with embedded `<style>` and `<script>` tags
- Anchor-based navigation (`#about`, `#specialties`, etc.) — no routing library
- Sections: hero, about, specialties, testimonials, contact

**Styling Approach**
- CSS custom properties in `:root` for theming (e.g., `--primary:#0f4c81`, `--accent:#0aa775`)
- Grid-based layouts: hero uses `grid-template-columns: 1fr 420px`, services uses `repeat(3, 1fr)`
- Mobile-first responsive: breakpoints at `980px` and `560px` adjust grid columns and hide nav
- No CSS preprocessors or utility frameworks

**JavaScript Patterns**
- Minimal vanilla JS: copyright year updater, form submission handler
- Form submits via `mailto:` protocol (no backend) — constructs email with `encodeURIComponent()`
- DOM manipulation uses `getElementById()` and `.textContent`

## Key Conventions

**Component Structure**
- Cards follow pattern: `.card` class with `h3` (title) + `p` (description)
- Chips/badges: `.chip` for specialties, `.badge` for trust indicators
- Buttons: `.btn` base + `.btn-primary` or `.btn-outline` modifiers

**Color System**
```css
--primary: #0f4c81  /* Navy blue for headings, CTAs */
--accent: #0aa775   /* Teal green for highlights */
--muted: #6b7280    /* Gray for secondary text */
```

**Typography**
- Inter font (Google Fonts) with weights 400, 600, 700
- Heading sizes: `h1` 34px → 28px mobile, `h2` 22px, `h3` 16px

## Development Workflow

**Editing & Testing**
- Edit `KokkalisSearchGroup.html` directly — no build step required
- Open in browser or use Live Server extension for hot reload
- Test responsive design at breakpoints: desktop (>980px), tablet (980px), mobile (560px)

**Contact Form**
- Currently uses `mailto:` — replace with backend API by modifying `handleSubmit()` function
- Form fields: name (required), company (optional), email (required), message (required)

## Common Modifications

**Adding New Sections**
```html
<section id="new-section" class="section">
  <h2>Section Title</h2>
  <p class="lead">Introduction text</p>
  <!-- Content -->
</section>
```

**Adding Navigation Links**
Update both: `<nav><ul>` in header AND quick links in `.hero-card`

**Theme Changes**
Modify CSS custom properties in `:root` — color changes cascade throughout

## Critical Files
- `KokkalisSearchGroup.html` — entire application (single source of truth)

## External Dependencies
- Google Fonts (Inter) — only external dependency
- Contact form sends to: `info@kokkalisglobal.com`
