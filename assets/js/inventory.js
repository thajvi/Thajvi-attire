// ============================================
//   THAJVI ATTIRE — Inventory System
//   Stock tracking with localStorage cache
// ============================================

var ThajviInventory = (function() {
  'use strict';

  var STORAGE_KEY = 'thajvi_inventory';
  var CACHE_EXPIRY = 3600000; // 1 hour
  var inventory = {};
  var initialized = false;

  // ===== INIT =====
  // Called with products array from products.json fetch
  // Always rebuilds from products.json to reflect CMS stock changes
  function init(products) {
    if (!products || !products.length) return;
    buildFromProducts(products);
    initialized = true;
  }

  function buildFromProducts(products) {
    inventory = {};
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      if (!p.inventory || !p.inventory.sizes) continue;

      var pid = makeId(p.name);
      inventory[pid] = {
        name: p.name,
        sizes: {},
        lowThreshold: p.inventory.lowStockThreshold || 5,
        veryLowThreshold: p.inventory.veryLowThreshold || 3
      };

      var sizes = p.inventory.sizes;
      for (var size in sizes) {
        if (sizes.hasOwnProperty(size)) {
          inventory[pid].sizes[size] = {
            stock: sizes[size],
            reserved: 0
          };
        }
      }
    }
    save();
  }

  // ===== SAVE/LOAD =====
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        inventory: inventory,
        timestamp: Date.now()
      }));
    } catch (e) { /* silent */ }
  }

  // ===== STOCK QUERIES =====
  function getStock(productId, size) {
    var pid = normalizeId(productId);
    var p = inventory[pid];
    if (!p || !p.sizes[size]) return 0;
    return Math.max(0, p.sizes[size].stock - p.sizes[size].reserved);
  }

  function getTotalStock(productId) {
    var pid = normalizeId(productId);
    var p = inventory[pid];
    if (!p) return 0;
    var total = 0;
    for (var size in p.sizes) {
      if (p.sizes.hasOwnProperty(size)) {
        total += Math.max(0, p.sizes[size].stock - p.sizes[size].reserved);
      }
    }
    return total;
  }

  function getStockInfo(productId, size) {
    var pid = normalizeId(productId);
    var p = inventory[pid];
    var available = getStock(productId, size);
    var low = p ? p.lowThreshold : 5;
    var veryLow = p ? p.veryLowThreshold : 3;

    if (available <= 0) {
      return { status: 'out-of-stock', canAdd: false, message: 'Out of Stock', urgency: 'none', stock: 0 };
    }
    if (available <= veryLow) {
      return { status: 'very-low', canAdd: true, message: 'Almost gone! Only ' + available + ' left', urgency: 'high', stock: available };
    }
    if (available <= low) {
      return { status: 'low', canAdd: true, message: 'Only ' + available + ' left!', urgency: 'medium', stock: available };
    }
    return { status: 'in-stock', canAdd: true, message: '', urgency: 'none', stock: available };
  }

  // ===== RESERVATION =====
  function reserve(productId, size, qty) {
    var pid = normalizeId(productId);
    var p = inventory[pid];
    if (!p || !p.sizes[size]) return false;
    var available = p.sizes[size].stock - p.sizes[size].reserved;
    if (available < qty) return false;
    p.sizes[size].reserved += qty;
    save();
    return true;
  }

  function release(productId, size, qty) {
    var pid = normalizeId(productId);
    var p = inventory[pid];
    if (!p || !p.sizes[size]) return;
    p.sizes[size].reserved = Math.max(0, p.sizes[size].reserved - qty);
    save();
  }

  // ===== CONFIRM ORDER =====
  function confirm(items) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var pid = normalizeId(item.productId || item.name);
      var p = inventory[pid];
      if (!p || !p.sizes[item.size]) continue;
      p.sizes[item.size].stock = Math.max(0, p.sizes[item.size].stock - item.quantity);
      p.sizes[item.size].reserved = Math.max(0, p.sizes[item.size].reserved - item.quantity);
    }
    save();
  }

  // ===== STOCK MANAGER =====
  function updateStock(productId, size, newStock) {
    var pid = normalizeId(productId);
    var p = inventory[pid];
    if (!p || !p.sizes[size]) return false;
    p.sizes[size].stock = Math.max(0, newStock);
    save();
    return true;
  }

  function getAllInventory() {
    return inventory;
  }

  function resetToDefaults(products) {
    buildFromProducts(products);
  }

  // ===== HELPERS =====
  function makeId(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  function normalizeId(id) {
    // Accept both "brown-printed-co-ord-set" and "Brown Printed Co-ord Set"
    if (inventory[id]) return id;
    var normalized = makeId(id);
    if (inventory[normalized]) return normalized;
    return id;
  }

  function isReady() { return initialized; }

  // ===== PUBLIC API =====
  return {
    init: init,
    getStock: getStock,
    getTotalStock: getTotalStock,
    getStockInfo: getStockInfo,
    reserve: reserve,
    release: release,
    confirm: confirm,
    updateStock: updateStock,
    getAll: getAllInventory,
    reset: resetToDefaults,
    isReady: isReady
  };

})();
