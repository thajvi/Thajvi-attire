# Thajvi vs Base Template — Feature Comparison Report

**Generated:** 2026-04-30

---

## Summary

| Metric | Base Template | Thajvi |
|--------|--------------|--------|
| JS files | 9 | 9 |
| HTML pages | 7 + admin pages | 7 + admin pages |
| Payment methods | 4 (WhatsApp, UPI, COD, Razorpay) | 3 (WhatsApp, UPI, COD) |
| Tier | Configurable (1/2/3) | Tier 2 (Growth) |
| Database | Supabase (optional) | Supabase (active) |
| CMS | Decap CMS | Decap CMS |

---

## Feature-by-Feature Comparison

### PAYMENT SYSTEM

| Feature | Base Template | Thajvi | Notes |
|---------|:---:|:---:|-------|
| WhatsApp ordering | ✅ | ✅ | Same |
| UPI payment | ✅ | ✅ | Same |
| UPI QR code | ✅ | ✅ (fixed) | Thajvi: fixed CDN 404 (1.5.3→1.5.1) |
| UPI QR hidden when no real ID | ❌ | ✅ | Thajvi: hides QR when placeholder UPI ID |
| UPI UTR verification gate | ❌ | ✅ | Thajvi: requires UTR before "Already paid" works |
| UPI desktop flow hint | ❌ | ✅ | Thajvi: shows WhatsApp number for phone-scanned QR |
| UPI modal close behavior | ❌ (redirects to success) | ✅ (stays on checkout) | Thajvi: closing modal doesn't show false success |
| COD payment | ✅ | ✅ | Same |
| Razorpay integration | ✅ | ❌ | Base has full Razorpay (Tier 3) |
| Razorpay API endpoints | ✅ (create-order, verify-payment) | ❌ | Not needed at Tier 2 |

### STOCK & INVENTORY

| Feature | Base Template | Thajvi | Notes |
|---------|:---:|:---:|-------|
| Per-size stock tracking | ✅ | ✅ | Same |
| Low/very-low stock indicators | ✅ | ✅ | Same |
| Out-of-stock disable | ✅ | ✅ | Same |
| Cart reservation system | ✅ (reserves on add) | ❌ (removed) | Thajvi: no reservation, prevents false stock reduction |
| Auto stock reduce on order | ✅ (Supabase RPC) | ❌ (removed) | Thajvi: seller manages stock manually |
| Stock manager admin | ✅ | ✅ | Same |
| Supabase live stock sync | ✅ | ✅ | Same |
| Per-size stock editing in admin | ❌ | ✅ | Thajvi: mobile admin has +/- per-size editing |

### ORDER MANAGEMENT

| Feature | Base Template | Thajvi | Notes |
|---------|:---:|:---:|-------|
| Supabase order saving | ✅ | ✅ | Same |
| Order dashboard (desktop) | ✅ | ✅ | Same |
| Mobile admin | ✅ | ✅ | Same |
| Mark Paid (UPI orders) | ✅ | ✅ | Same |
| Shipping status updates | ✅ | ✅ | Same |
| Revenue summary | ✅ | ✅ | Same |
| Order search & filters | ✅ | ✅ | Same |
| Local backup on Supabase fail | ✅ | ✅ | Same |
| RLS policies for anon inserts | ❌ (not configured) | ✅ | Thajvi: added RLS policies in Supabase |

### STOREFRONT & UI

| Feature | Base Template | Thajvi | Notes |
|---------|:---:|:---:|-------|
| Hero section | ✅ | ✅ | Same |
| Product grid | ✅ | ✅ | Same |
| Deal of the Day | ✅ | ✅ | Same |
| Size guide modal | ✅ | ✅ | Same |
| Cart drawer (swipe close) | ✅ | ✅ | Same |
| Trust badges | ✅ | ✅ | Same |
| Instagram reel links | ✅ | ✅ | Same |
| Share (WhatsApp/Instagram) | ✅ | ✅ | Same |
| Countdown timer | ✅ | ✅ | Same |
| Marquee scrolling | ✅ | ✅ | Same |
| Video section | ✅ | ✅ | Same |
| Catalogue section | ✅ | ✅ | Same |
| Announcement bar | ✅ | ✅ | Same |
| Scroll animations | ✅ | ✅ | Same |
| Terracotta theme variant | ❌ | ✅ | Thajvi has an alternate color theme |

### CMS & ADMIN

| Feature | Base Template | Thajvi | Notes |
|---------|:---:|:---:|-------|
| Decap CMS | ✅ | ✅ | Same |
| GitHub OAuth | ✅ | ✅ | Same |
| Product editing | ✅ | ✅ | Same |
| Site settings editing | ✅ | ✅ | Same |
| HOW-TO-EDIT guide | ✅ | ❌ | Base has documentation page |

### API & BACKEND

| Feature | Base Template | Thajvi | Notes |
|---------|:---:|:---:|-------|
| GitHub OAuth (auth.js, callback.js) | ✅ | ✅ | Same |
| GitHub content update API | ❌ | ✅ | Thajvi: has github-update.js |
| Razorpay create-order API | ✅ | ❌ | Not needed at Tier 2 |
| Razorpay verify-payment API | ✅ | ❌ | Not needed at Tier 2 |

---

## Features ADDED to Thajvi (not in base)

1. **UPI QR code fix** — CDN version corrected (1.5.3→1.5.1)
2. **UPI QR hidden when placeholder** — No empty QR box when UPI ID not set
3. **UTR verification gate** — Replaces "Already paid?" skip link with transaction ID input
4. **Desktop QR flow hint** — WhatsApp number shown for phone-scanned QR users
5. **UPI modal close fix** — Closing modal stays on checkout, not false success page
6. **Seller-controlled stock** — No auto stock reduction; seller manages manually
7. **Per-size stock editing** — Mobile admin has per-size +/- stock controls
8. **Supabase RLS policies** — Anonymous insert/select/update policies added
9. **Terracotta theme** — Alternate color scheme
10. **GitHub content update API** — Serverless function for CMS writes

## Features in Base Template NOT in Thajvi

1. **Razorpay payment gateway** — Full online payment with order creation + signature verification
2. **Razorpay API endpoints** — create-order.js, verify-payment.js serverless functions
3. **Cart reservation system** — Stock reserved when added to cart (removed in Thajvi by design)
4. **Auto stock reduction** — Supabase RPC reduces stock on order (removed in Thajvi by design)
5. **HOW-TO-EDIT documentation** — Setup guide page

---

## Features that need to be BACKPORTED to Base Template

These Thajvi improvements should be added to the base template:

### Critical (bugs/broken features)
1. **QR code CDN fix** — `qrcode@1.5.3` → `@1.5.1` (404 error)
2. **UPI modal close** — Should stay on checkout, not redirect to success page

### Important (UX improvements)
3. **UTR verification gate** — Prevent customers from skipping payment
4. **QR hidden when no real UPI ID** — Don't show empty QR with placeholder
5. **Desktop QR flow hint** — WhatsApp number for phone-scanned QR users

### Consider (design decisions)
6. **Seller-controlled stock** — Depends on client preference
7. **Per-size stock editing in mobile admin** — Better admin UX
8. **Supabase RLS policies** — Need SQL setup guide

---

## Architecture Differences

| Aspect | Base Template | Thajvi |
|--------|--------------|--------|
| Stock management | Auto (cart reserves, order confirms) | Manual (seller controls) |
| Payment tier | Tier 1-3 (configurable) | Tier 2 (Growth, hardcoded) |
| Stock source of truth | localStorage + Supabase hybrid | Seller via admin |
| UPI skip behavior | Direct skip to success | UTR required |
| Modal close behavior | Redirect to success | Dismiss modal |
