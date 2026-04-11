// ============================================
//   THAJVI ATTIRE — Cart Logic (cart.js)
//   Pure localStorage-based shopping cart
// ============================================

var ThajviCart = (function() {
  'use strict';

  var STORAGE_KEY = 'thajvi_cart';
  var FREE_SHIPPING_THRESHOLD = 999;
  var SHIPPING_COST = 80;
  var MAX_STOCK = 10;
  var listeners = [];

  // ===== CORE FUNCTIONS =====

  function initCart() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    notifyListeners();
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    notifyListeners();
  }

  function addToCart(product) {
    if (!product || !product.name || !product.size) return false;

    var cart = getCart();
    var itemId = generateId(product.name, product.size);
    var existing = null;
    var existingIndex = -1;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === itemId) {
        existing = cart[i];
        existingIndex = i;
        break;
      }
    }

    if (existing) {
      if (existing.quantity >= MAX_STOCK) return false;
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: itemId,
        productId: product.productId || product.name.toLowerCase().replace(/\s+/g, '-'),
        name: product.name,
        price: parsePrice(product.price),
        size: product.size,
        quantity: 1,
        image: product.image || '',
        maxStock: MAX_STOCK
      });
    }

    saveCart(cart);
    return true;
  }

  function removeFromCart(itemId) {
    var cart = getCart();
    cart = cart.filter(function(item) { return item.id !== itemId; });
    saveCart(cart);
  }

  function updateQuantity(itemId, qty) {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === itemId) {
        cart[i].quantity = Math.min(qty, cart[i].maxStock || MAX_STOCK);
        break;
      }
    }
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartCount() {
    var cart = getCart();
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
      count += cart[i].quantity;
    }
    return count;
  }

  function getCartSubtotal() {
    var cart = getCart();
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
      subtotal += cart[i].price * cart[i].quantity;
    }
    return subtotal;
  }

  function getShipping() {
    var subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  }

  function getCartTotal() {
    return getCartSubtotal() + getShipping();
  }

  function getFreeShippingRemaining() {
    var subtotal = getCartSubtotal();
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return FREE_SHIPPING_THRESHOLD - subtotal;
  }

  function getFreeShippingProgress() {
    var subtotal = getCartSubtotal();
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  }

  // ===== HELPERS =====

  function generateId(name, size) {
    return name.toLowerCase().replace(/\s+/g, '-') + '-' + size.toLowerCase();
  }

  function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    var num = String(priceStr).replace(/[^\d.]/g, '');
    return parseFloat(num) || 0;
  }

  function formatPrice(amount) {
    return '\u20B9' + amount.toLocaleString('en-IN');
  }

  // ===== EVENT SYSTEM =====

  function onChange(callback) {
    listeners.push(callback);
  }

  function notifyListeners() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](getCart()); } catch (e) { /* silent */ }
    }
  }

  // ===== PUBLIC API =====

  return {
    init: initCart,
    get: getCart,
    add: addToCart,
    remove: removeFromCart,
    updateQty: updateQuantity,
    clear: clearCart,
    count: getCartCount,
    subtotal: getCartSubtotal,
    shipping: getShipping,
    total: getCartTotal,
    freeShippingRemaining: getFreeShippingRemaining,
    freeShippingProgress: getFreeShippingProgress,
    formatPrice: formatPrice,
    onChange: onChange,
    FREE_SHIPPING_THRESHOLD: FREE_SHIPPING_THRESHOLD
  };

})();

// Initialize cart on load
ThajviCart.init();
