# Tomorrow's Work — Two Tasks

## Task 1: Dead code cleanup (1 hour)

- Delete from checkout.js: handleUpiOrder, showUpiModal, initUpiModal,
  handleCodOrder, buildCodWhatsApp, isCodAvailable, checkCodAvailability,
  getCodCharge, STORE_CONFIG UPI/COD properties, switch cases for 'upi'
  and 'cod', initUpiModal() call in init
- Delete from checkout.css: all .upi-* rules (~95 lines), all .cod-*
  rules (~15 lines)
- Estimated: ~410 lines deleted total
- Verification: grep checkout.js and checkout.css for "upi", "cod",
  "Cod", "UPI" — should return zero matches in those files

## Task 2: Stock refactor (4-6 hours)

### Current state:

- products_stock table exists in Supabase with sku/size/stock_qty/
  reserved_qty/sold_qty schema, populated for 3 test products only
- stock-manager.html writes to localStorage (broken, not used)
- mobile-admin.html commits to products.json via GitHub API (works)
- inventory.js reads from products.json into localStorage (display only)
- supabase-stock.js queries Supabase but only overrides display (15
  rows, mostly empty)
- api/reduce-stock.js is unauthenticated, GitHub-based, fire-and-forget
  (unsafe, must be replaced)
- Razorpay flow calls reduce-stock but ignores failures

### Target state:

- Single source of truth: Supabase products_stock table
- All admin UIs (stock-manager.html and mobile-admin.html) write to
  Supabase, not localStorage or GitHub
- Customer-facing stock reads from Supabase on page load
- Razorpay payment: stock decrement merged into verify-payment.js,
  atomic via Supabase RPC, after signature verification succeeds
- Delete api/reduce-stock.js entirely
- New stock_warnings table logs cases where stock row missing or
  Supabase error (don't fail payment, just log)

### Migration steps in order:

1. Populate products_stock with Thajvi's 15 real products and sizes
   (manual via Supabase dashboard CSV import)
2. Create stock_warnings table in Supabase (SQL below)
3. Add stock decrement to verify-payment.js using SUPABASE_SERVICE_KEY
   env var; handle missing-row and error cases with stock_warnings log
4. Remove reduce-stock fetch from checkout.js
5. Delete api/reduce-stock.js
6. Refactor stock-manager.html: add Supabase auth login, read
   products_stock on load, write updates via Supabase update
7. Decision needed from Thajvi: keep mobile-admin.html and stock-manager
   .html as two UIs, or deprecate one?
8. Update customer-facing stock display (main.js or wherever sizes
   render) to read live stock from Supabase first, fall back to
   products.json
9. End-to-end test: Razorpay test payment → verify Supabase
   products_stock decremented → verify sold_qty incremented → verify
   customer site reflects new stock on reload

### stock_warnings table SQL:

```sql
CREATE TABLE stock_warnings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  warning_type TEXT NOT NULL,  -- 'row_missing', 'insufficient_stock', 'supabase_error'
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Open decisions for tomorrow morning:

- Ask Thajvi: stock-manager.html (laptop) or mobile-admin.html (phone) —
  which does she prefer? Inform whether we merge or keep both.
- Real-time sync between admin devices (Supabase subscriptions) —
  build in or defer?

### Estimated total effort:

5-7 hours focused work (cleanup + refactor + testing).
