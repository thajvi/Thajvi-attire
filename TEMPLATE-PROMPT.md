# Website Template — Instagram Demo Generator

---

## Your Folder Structure
```
/Users/amu/website-templates/
  TEMPLATE-PROMPT.md        ← This file (your master guide)
  base-template/            ← Clean template (NEVER edit this directly)
  demo-clientname/          ← Each client gets their own folder
```

---

## How to Create a New Demo (3 Steps)

### Step 1: Copy the base template
Open Terminal and run (replace `clientname` with actual name):
```bash
cp -r "/Users/amu/website-templates/base-template" "/Users/amu/website-templates/demo-clientname"
```

### Step 2: Open Claude Code in the new folder
```bash
cd "/Users/amu/website-templates/demo-clientname"
```

### Step 3: Paste the prompt below + attach Instagram screenshots

---

## THE PROMPT — Copy, Fill & Paste

```
I have a website template in this folder that I need to rebrand
for a new client. I'm sharing screenshots of their Instagram page.

IMPORTANT: Only index.html is used. If the client needs an alternate
color theme, duplicate index.html and point it to a different stylesheet.

=== WHAT TO EXTRACT FROM THE SCREENSHOTS ===

Look carefully at the Instagram screenshots I've shared and extract:

1. BRAND IDENTITY
   - Business name (from profile name / bio)
   - What they sell (from posts, bio, highlights)
   - Their tagline or bio text
   - Their vibe: luxury / affordable / handmade / festive / minimal

2. COLOR THEME — ADAPT ENTIRE SITE TO MATCH THE LOGO
   - If a logo screenshot is shared, extract the EXACT colors from the logo
   - If no logo, use dominant colors from their posts and profile aesthetic
   - The ENTIRE site must look like it was built for this brand from scratch
   - DO NOT just change CSS variables — you MUST also update:
     a) Hero section gradient background (hardcoded in style.css)
     b) All dark mode overrides (@media prefers-color-scheme: dark) — 
        update ALL variable overrides to match the brand palette, NOT the old green
     c) All hardcoded hex/rgba colors in style.css (search for old #1A6B35, 
        rgba(26,107,53), rgba(14,68,32), etc. and replace ALL of them)
     d) Elements on always-dark backgrounds (hero, footer, buttons) must use 
        color: #ffffff NOT color: var(--white), because --white gets overridden 
        in dark mode to a dark color for card backgrounds
     e) HOW-TO-EDIT.html inline styles (headings, step numbers, code boxes)
   - Color preset suggestions (or create custom from logo):
     Teal & Gold (elegant, ethnic) — default
     Rose & Cream (feminine, soft)
     Black & Gold (luxury, premium)
     Navy & Silver (modern, professional)
     Maroon & Gold (traditional, festive)
     Sage & Beige (minimal, earthy)
     Custom: extract exact colors from logo/screenshots

3. PRODUCTS
   - Create 4-6 products from their Instagram posts
   - Extract: product name, description, price (or "DM for Price"), fabric/material
   - Assign badges: Bestseller for popular items, New Arrival for recent posts
   - Set one product as featured: true (Deal of the Day)

4. CONTENT
   - Write announcement bar text matching their style
   - Create marquee scroll text from their product categories
   - Write an about section that matches their brand voice
   - Set footer collection links based on their categories

5. NICHE ADJUSTMENTS
   - If NOT clothing: rename "Fabric" → appropriate label (Scent/Material/Flavour)
   - If NOT clothing: rename "Sizes" → appropriate label or remove
   - If NOT clothing: set SHOW_SIZE_GUIDE = false in main.js
   - Update admin/config.yml field labels and occasion options to match niche
   - Update Instagram hashtags in the share message to match their niche

=== CLIENT DETAILS (fill these in) ===

WHATSAPP NUMBER: ___________ (with country code, e.g. 919876543210)
INSTAGRAM HANDLE: ___________ (without @)
WEBSITE URL (if any): ___________

=== FILES TO EDIT — COMPLETE CHECKLIST ===

1. REPLACE business name EVERYWHERE:
   - index.html + index-terracotta.html (~24 locations: title, meta, OG tags,
     structured data, logo spans, about text, review section, footer, favicon link text)
   - assets/js/main.js (comments header, WhatsApp messages, alt text)
   - assets/favicon/site.webmanifest (name, short_name)
   - admin/index.html (page title)
   - HOW-TO-EDIT.html (title, headings, footer)

2. REPLACE logo text in BOTH index.html + index-terracotta.html:
   - <span class="logo-main"> → first word of business name
   - <span class="logo-sub"> → remaining words

3. REPLACE WhatsApp number "918129651993" everywhere:
   - assets/js/main.js (WHATSAPP_NUMBER constant)
   - index.html + index-terracotta.html (all wa.me/ links)
   - data/products.json (every product's whatsapp field)
   - admin/config.yml (default value)

4. REPLACE Instagram handle everywhere:
   - index.html + index-terracotta.html (~12 locations: navbar, about, journal, contact, footer)
   - Update all instagram.com/ URLs

5. UPDATE brand colors (FULL THEME — match the logo):
   - assets/css/style.css lines 31-54 (CSS variables)
   - assets/css/style.css — ALL hardcoded hex/rgba colors (hero gradient, 
     size guide, proof avatars, etc.)
   - assets/css/style.css — ALL @media (prefers-color-scheme: dark) blocks —
     update variable overrides to use brand-matching neutrals, NOT green
   - assets/css/style.css — change color: var(--white) to color: #ffffff on 
     elements with always-dark backgrounds (buttons, hero, footer, badges)
   - index.html (theme-color meta)
   - assets/favicon/site.webmanifest (theme_color, background_color)
   - HOW-TO-EDIT.html (inline style colors)
   - assets/js/main.js (hardcoded colors in size button styles)
   - assets/favicon/site.webmanifest (theme_color, background_color)

6. UPDATE data/products.json:
   - Replace sample products with ones extracted from Instagram
   - Set one product as featured: true
   - Set photo to "" (client uploads later via CMS)

7. UPDATE data/site.json:
   - marquee_items — category names from their Instagram
   - footer_collections — their main categories
   - site_url — their website or a placeholder
   - instagram_handle — their handle
   - catalogue_enabled — false (client enables later)
   - trust_badges — customize text to match their niche
   - video_enabled — false (client adds later)
   - catalogue_message — update greeting with their brand name

8. UPDATE index.html + index-terracotta.html content:
   - Announcement bar text
   - About section (match their Instagram bio / brand voice)
   - Social proof text
   - Meta description
   - "UPI Accepted" in trust signals (keep as is)

9. UPDATE assets/js/main.js:
   - WHATSAPP_NUMBER constant
   - SITE_URL variable
   - INSTAGRAM_HANDLE variable
   - Instagram share hashtags (line with #KeralaFashion...) → match their niche
   - WhatsApp share message "beautiful saree" → match their product type
   - All "Hi!" messages → "Hi [BrandName]!"

10. UPDATE admin/config.yml:
    - Field labels if niche needs it (Fabric → Scent, etc.)
    - Occasion dropdown options to match their niche
    - Stock status options (keep Out of Stock + Pre-Order)
    - WhatsApp default number

After all changes, give me a summary of what was changed.
```

---

## After Claude Customizes the Demo

### Deploy it:
```bash
cd "/Users/amu/website-templates/demo-clientname"
git init
git add .
git commit -m "Initial website for ClientName"
git branch -M main
git remote add origin https://github.com/youraccount/clientname-site.git
git push -u origin main
```

Then connect to Netlify.

### Set up CMS (if client buys):
1. Netlify > Identity > Enable > Invite only
2. Enable Git Gateway
3. Invite client email

---

## Quick Demo Workflow Summary

```
1. Copy base-template → demo-clientname
2. Open folder in Claude Code
3. Take 3-4 screenshots of client's Instagram page
   - Profile page (bio, name, follower count)
   - 2-3 product post screenshots (shows their style, colors, products)
4. Paste prompt + attach screenshots
5. Claude extracts everything from screenshots and customizes (~2 min)
6. Preview with Live Server in VS Code
7. Push to GitHub + Connect Netlify (~5 min)
8. Share demo URL with client
9. Client approves → set up CMS + domain
```

**Total time per demo: ~10 minutes**

---

## Features Available in Template

All features below are built into every demo.
They are controlled via the CMS admin panel (/admin):

| Feature | How to Enable |
|---------|--------------|
| Deal of the Day | Set featured: true on ONE product |
| Share Buttons | Always visible (WhatsApp + Instagram) |
| Catalogue Section | Toggle catalogue_enabled in Site Settings |
| Brand Story Video | Paste YouTube/Instagram link in Site Settings |
| Trust Badges | Add up to 6 badges in Site Settings |
| Out of Stock | Set stock to "Out of Stock" on a product |
| Pre-Order | Set stock to "Pre-Order" on a product |
| Countdown Timer | Set date in Site Settings |
| Business Hours | Configure in Site Settings (when CMS fields added) |
