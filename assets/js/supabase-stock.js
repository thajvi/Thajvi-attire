// ============================================
//   THAJVI ATTIRE — Supabase Stock
//   Live stock tracking from database
// ============================================

(function() {
  'use strict';

  function getSupabase() {
    return window.THAJVI_SUPABASE;
  }

  function isEnabled() {
    return window.THAJVI_TIER && window.THAJVI_TIER.features.liveStockTracking && getSupabase();
  }

  // Get all stock data
  window.getStockFromSupabase = function() {
    if (!isEnabled()) return Promise.resolve(null);
    return getSupabase()
      .from('products_stock')
      .select('*')
      .then(function(res) { return res.error ? null : res.data; })
      .catch(function() { return null; });
  };

  // Get stock for one product+size
  window.getSizeStockFromSupabase = function(sku, size) {
    if (!isEnabled()) return Promise.resolve(null);
    return getSupabase()
      .from('products_stock')
      .select('stock_qty, reserved_qty')
      .eq('sku', sku)
      .eq('size', size)
      .single()
      .then(function(res) {
        if (res.error || !res.data) return null;
        return {
          stock: res.data.stock_qty,
          reserved: res.data.reserved_qty || 0,
          available: res.data.stock_qty - (res.data.reserved_qty || 0)
        };
      })
      .catch(function() { return null; });
  };

  // Check if in stock
  window.isInStockSupabase = function(sku, size, qty) {
    if (!isEnabled()) return Promise.resolve(true);
    return window.getSizeStockFromSupabase(sku, size)
      .then(function(data) {
        if (!data) return true; // fallback: allow
        return data.available >= (qty || 1);
      });
  };

  // Reserve stock when added to cart
  window.reserveStockSupabase = function(sku, size, qty) {
    if (!isEnabled()) return Promise.resolve(true);
    return getSupabase()
      .rpc('reserve_stock', { p_sku: sku, p_size: size, p_quantity: qty })
      .then(function(res) { return res.error ? false : true; })
      .catch(function() { return false; });
  };

  // Release stock when removed from cart
  window.releaseStockSupabase = function(sku, size, qty) {
    if (!isEnabled()) return Promise.resolve(true);
    return getSupabase()
      .rpc('release_stock', { p_sku: sku, p_size: size, p_quantity: qty })
      .then(function(res) { return res.error ? false : true; })
      .catch(function() { return false; });
  };

  // Update stock display on product cards
  window.updateStockFromSupabase = function() {
    if (!isEnabled()) return;

    window.getStockFromSupabase().then(function(allStock) {
      if (!allStock) return;

      // Group by sku
      var stockMap = {};
      for (var i = 0; i < allStock.length; i++) {
        var row = allStock[i];
        if (!stockMap[row.sku]) stockMap[row.sku] = {};
        stockMap[row.sku][row.size] = {
          stock: row.stock_qty,
          available: row.stock_qty - (row.reserved_qty || 0)
        };
      }

      // Update size buttons on cards
      var cards = document.querySelectorAll('.saree-card');
      cards.forEach(function(card) {
        var buttons = card.querySelectorAll('button[style*="border"]');
        if (!buttons.length) return;

        // Try to match product by name
        var titleEl = card.querySelector('h3');
        if (!titleEl) return;
        var pid = titleEl.textContent.toLowerCase().replace(/\s+/g, '-');

        if (!stockMap[pid]) return;

        buttons.forEach(function(btn) {
          var size = btn.textContent.trim().replace(/[^A-Z]/g, '');
          if (!size || !stockMap[pid][size]) return;

          var avail = stockMap[pid][size].available;
          if (avail <= 0 && !btn.disabled) {
            btn.disabled = true;
            btn.style.opacity = '0.35';
            btn.style.cursor = 'not-allowed';
            btn.style.color = '#555';
            btn.style.borderColor = '#222';
            btn.title = 'Out of Stock';
          }
        });
      });
    });
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(window.updateStockFromSupabase, 1500);
    });
  } else {
    setTimeout(window.updateStockFromSupabase, 1500);
  }

})();
