// ============================================
//   THAJVI ATTIRE — Checkout (checkout.js)
// ============================================

/*
═══════════════════════════════
TO ACTIVATE COD:

1. Open js/checkout.js
2. Find STORE_CONFIG object
3. Change this line:
   codEnabled: false,
   TO:
   codEnabled: true,

4. Optional: Add more states
   codAvailableStates: [
     "Kerala",
     "Tamil Nadu",
     "Karnataka",
   ],

5. Optional: Change COD charge
   codCharge: 30,
   (currently ₹30)

6. Save file
7. Deploy to Vercel
8. COD option appears instantly!

TO DEACTIVATE COD:
Change codEnabled back to false
COD option hides instantly

Total work: 30 seconds
═══════════════════════════════
*/

function escapeHTML(str) {
  if (!str) return '';
  var d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  var num = String(priceStr).replace(/[^\d.]/g, '');
  return parseFloat(num) || 0;
}

function validateCartPrices() {
  return fetch('data/products.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var products = data.items;
      var cart = ThajviCart.get();
      for (var i = 0; i < cart.length; i++) {
        var cartItem = cart[i];
        var product = products.find(function(p) {
          return p.name === cartItem.name;
        });
        if (product) {
          var realPrice = parsePrice(product.price);
          var cartPrice = parsePrice(cartItem.price);
          if (realPrice > 0 && cartPrice !== realPrice) {
            return { valid: false, item: cartItem.name, expected: realPrice, got: cartPrice };
          }
        }
      }
      return { valid: true };
    })
    .catch(function() {
      return { valid: true };
    });
}

var STORE_CONFIG = {
  whatsappNumber: '918129651993',
  storeName: 'Thajvi Attire',
  razorpayKey: 'YOUR_KEY_HERE',

  // ─────────────────────────
  // COD SETTINGS
  // To ENABLE COD:
  // Change codEnabled: false
  // to codEnabled: true
  // That's it. One line change.
  // ─────────────────────────
  codEnabled: false,
  codCharge: 30,
  codAvailableStates: [
    'Kerala'
    // Add more states if needed:
    // , 'Tamil Nadu'
    // , 'Karnataka'
  ],
  codMinOrder: 0,
  codMaxOrder: 5000,

  // ─────────────────────────
  // UPI SETTINGS
  // Loaded from site.json at runtime.
  // No manual changes needed here.
  // ─────────────────────────
  upiEnabled: false,
  upiId: '',
  upiName: '',
  upiNote: '',
  upiVerificationTime: '30 minutes'
};

// Default selected payment method
var selectedPaymentMethod = 'whatsapp';

// ===== INDIAN STATES LIST =====
var INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
  'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

// ===== ORDER ID GENERATOR =====
function generateOrderId() {
  var now = new Date();
  var y = now.getFullYear().toString().slice(-2);
  var m = ('0' + (now.getMonth() + 1)).slice(-2);
  var d = ('0' + now.getDate()).slice(-2);
  var r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return 'TH' + y + m + d + '-' + r;
}

// ===== INIT =====
function initCheckout() {
  if (typeof ThajviCart === 'undefined') {
    console.error('cart.js must be loaded before checkout.js');
    return;
  }
  var cart = ThajviCart.get();
  if (cart.length === 0) {
    document.getElementById('checkout-content').innerHTML =
      '<div class="checkout-empty">' +
        '<p class="cart-empty-title">Your cart is empty</p>' +
        '<p class="cart-empty-sub">Add items before checking out</p>' +
        '<a href="index.html#collections" class="cart-empty-btn">Shop Now &rarr;</a>' +
      '</div>';
    return;
  }

  populateStates();
  renderOrderSummary();

  // Load UPI config from site.json, then init payment methods
  fetch('data/site.json')
    .then(function(res) { return res.json(); })
    .then(function(site) {
      if (site.payment) {
        STORE_CONFIG.upiEnabled = site.payment.upiEnabled || false;
        STORE_CONFIG.upiId = site.payment.upiId || '';
        STORE_CONFIG.upiName = site.payment.upiName || '';
        STORE_CONFIG.upiNote = site.payment.upiNote || '';
        STORE_CONFIG.upiVerificationTime = site.payment.upiVerificationTime || '30 minutes';
      }
      // Apply shipping config from CMS
      if (typeof ThajviCart !== 'undefined' && ThajviCart.setShippingConfig) {
        ThajviCart.setShippingConfig(
          typeof site.shipping_cost === 'number' ? site.shipping_cost : 80,
          typeof site.free_shipping_threshold === 'number' ? site.free_shipping_threshold : 999
        );
      }
    })
    .catch(function() { /* UPI stays disabled */ })
    .then(function() {
      initPaymentMethods();
      updateSubmitButton();
      setupFormValidation();
      initUpiModal();
    });
}

// ===== POPULATE STATE DROPDOWN =====
function populateStates() {
  var select = document.getElementById('state');
  if (!select) return;
  INDIAN_STATES.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
}

// ===== RENDER ORDER SUMMARY =====
function renderOrderSummary() {
  var cart = ThajviCart.get();
  var itemsContainer = document.getElementById('summary-items');
  if (!itemsContainer) return;

  var html = '';
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    html +=
      '<div class="summary-item">' +
        '<div class="summary-item-img">' +
          (item.image ? '<img src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.name) + '"/>' : '<div class="summary-item-placeholder"></div>') +
          '<span class="summary-item-qty">' + item.quantity + '</span>' +
        '</div>' +
        '<div class="summary-item-info">' +
          '<p class="summary-item-name">' + escapeHTML(item.name) + '</p>' +
          '<p class="summary-item-size">Size: ' + escapeHTML(item.size) + '</p>' +
        '</div>' +
        '<span class="summary-item-price">' + ThajviCart.formatPrice(item.price * item.quantity) + '</span>' +
      '</div>';
  }
  itemsContainer.innerHTML = html;
  updateOrderTotal();
}

// ===== PAYMENT METHODS =====
function initPaymentMethods() {
  var codOption = document.getElementById('cod-payment');
  var upiOption = document.getElementById('upi-payment');
  var hasMultipleMethods = false;

  // Show UPI if enabled
  if (STORE_CONFIG.upiEnabled && upiOption && STORE_CONFIG.upiId && STORE_CONFIG.upiId.indexOf('@') !== -1) {
    upiOption.classList.remove('hidden');
    hasMultipleMethods = true;
  } else if (upiOption) {
    upiOption.classList.add('hidden');
  }

  // Show COD if enabled
  if (STORE_CONFIG.codEnabled && codOption) {
    codOption.classList.remove('hidden');
    hasMultipleMethods = true;

    var stateField = document.getElementById('state');
    if (stateField) {
      stateField.addEventListener('change', checkCodAvailability);
    }
  } else if (codOption) {
    codOption.classList.add('hidden');
  }

  if (hasMultipleMethods) {
    setupPaymentMethodSelection();
  }
}

function setupPaymentMethodSelection() {
  var methods = document.querySelectorAll('.payment-method-card:not(.hidden)');
  methods.forEach(function(method) {
    method.addEventListener('click', function() {
      if (this.dataset.method === 'cod' && !isCodAvailable()) return;

      methods.forEach(function(m) {
        m.classList.remove('active');
        var dot = m.querySelector('.radio-dot');
        if (dot) dot.classList.remove('active');
      });

      this.classList.add('active');
      var dot = this.querySelector('.radio-dot');
      if (dot) dot.classList.add('active');

      selectedPaymentMethod = this.dataset.method;
      updateOrderTotal();
      updateSubmitButton();
    });
  });
}

function selectPaymentMethod(method) {
  var card = document.querySelector('[data-method="' + method + '"]');
  if (card) card.click();
}

// ===== COD AVAILABILITY =====
function isCodAvailable() {
  var sel = document.getElementById('state');
  if (!sel || !sel.value) return false;
  var subtotal = ThajviCart.subtotal();
  if (STORE_CONFIG.codMaxOrder > 0 && subtotal > STORE_CONFIG.codMaxOrder) return false;
  if (STORE_CONFIG.codMinOrder > 0 && subtotal < STORE_CONFIG.codMinOrder) return false;
  return STORE_CONFIG.codAvailableStates.indexOf(sel.value) !== -1;
}

function checkCodAvailability() {
  if (!STORE_CONFIG.codEnabled) return;
  var codCard = document.getElementById('cod-payment');
  var stateNotice = document.getElementById('cod-state-notice');
  var availableNotice = document.getElementById('cod-available-notice');
  var sel = document.getElementById('state');

  if (!sel || !sel.value) {
    if (stateNotice) stateNotice.classList.add('hidden');
    if (availableNotice) availableNotice.classList.add('hidden');
    return;
  }

  if (isCodAvailable()) {
    if (codCard) codCard.classList.remove('cod-unavailable');
    if (stateNotice) stateNotice.classList.add('hidden');
    if (availableNotice) availableNotice.classList.remove('hidden');
  } else {
    if (selectedPaymentMethod === 'cod') selectPaymentMethod('whatsapp');
    if (codCard) codCard.classList.add('cod-unavailable');
    if (availableNotice) availableNotice.classList.add('hidden');
    if (stateNotice) stateNotice.classList.remove('hidden');
    var noticeText = document.getElementById('cod-notice-text');
    if (noticeText) {
      noticeText.textContent = 'COD available for ' + STORE_CONFIG.codAvailableStates.join(', ') + ' only';
    }
  }
}

// ===== ORDER TOTAL =====
function getCodCharge() {
  if (selectedPaymentMethod === 'cod' && STORE_CONFIG.codEnabled && isCodAvailable()) {
    return STORE_CONFIG.codCharge;
  }
  return 0;
}

function getGrandTotal() {
  return ThajviCart.total() + getCodCharge();
}

function updateOrderTotal() {
  var subtotal = ThajviCart.subtotal();
  var shipping = ThajviCart.shipping();
  var codCharge = getCodCharge();
  var total = getGrandTotal();

  var subtotalEl = document.getElementById('summary-subtotal');
  var shippingEl = document.getElementById('summary-shipping');
  var totalEl = document.getElementById('order-total');
  var codRow = document.getElementById('cod-charge-row');

  if (subtotalEl) subtotalEl.textContent = ThajviCart.formatPrice(subtotal);
  if (shippingEl) shippingEl.innerHTML = shipping === 0 ? '<span style="color:#25d366;font-weight:600;">FREE</span>' : ThajviCart.formatPrice(shipping);
  if (totalEl) totalEl.textContent = ThajviCart.formatPrice(total);

  if (codRow) {
    if (codCharge > 0) {
      codRow.classList.remove('hidden');
      var amt = codRow.querySelector('.amount');
      if (amt) amt.textContent = '+' + ThajviCart.formatPrice(codCharge);
    } else {
      codRow.classList.add('hidden');
    }
  }

  // Shipping progress
  var remaining = ThajviCart.freeShippingRemaining();
  var progress = ThajviCart.freeShippingProgress();
  var progressFill = document.getElementById('checkout-shipping-fill');
  var progressMsg = document.getElementById('checkout-shipping-msg');
  if (progressFill) progressFill.style.width = progress + '%';
  if (progressMsg) {
    if (remaining > 0) {
      progressMsg.textContent = 'Add ' + ThajviCart.formatPrice(remaining) + ' more for free shipping';
      progressMsg.className = 'cart-shipping-msg';
    } else {
      progressMsg.textContent = 'You have free shipping!';
      progressMsg.className = 'cart-shipping-msg free';
    }
  }

  updateSubmitButton();
}

function updateSubmitButton() {
  var btn = document.getElementById('place-order-btn');
  if (!btn) return;
  var total = getGrandTotal();

  switch (selectedPaymentMethod) {
    case 'whatsapp':
      btn.textContent = 'Place Order via WhatsApp \u2192';
      break;
    case 'upi':
      btn.textContent = 'Place Order & Pay via UPI \u2192';
      break;
    case 'cod':
      btn.textContent = 'Place COD Order \u2192 Pay ' + ThajviCart.formatPrice(total) + ' on Delivery';
      break;
    default:
      btn.textContent = 'Place Order \u2192';
  }
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
  var form = document.getElementById('checkout-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handlePlaceOrder();
  });
}

function validateForm() {
  var required = ['fullname', 'phone', 'address1', 'city', 'state', 'pincode'];
  var valid = true;
  required.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var wrap = el.closest('.form-group');
    if (!el.value.trim()) {
      valid = false;
      if (wrap) wrap.classList.add('error');
      el.addEventListener('input', function handler() {
        if (el.value.trim()) {
          wrap.classList.remove('error');
          el.removeEventListener('input', handler);
        }
      });
    } else {
      if (wrap) wrap.classList.remove('error');
    }
  });

  // Phone validation
  var phone = document.getElementById('phone');
  if (phone && phone.value.trim()) {
    var digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10) {
      valid = false;
      var wrap = phone.closest('.form-group');
      if (wrap) wrap.classList.add('error');
    }
  }

  // Pincode validation
  var pincode = document.getElementById('pincode');
  if (pincode && pincode.value.trim()) {
    var pin = pincode.value.replace(/\D/g, '');
    if (pin.length !== 6) {
      valid = false;
      var wrap = pincode.closest('.form-group');
      if (wrap) wrap.classList.add('error');
    }
  }

  if (!valid) {
    var firstError = document.querySelector('.form-group.error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

function showError(msg) {
  var errEl = document.getElementById('checkout-error');
  if (errEl) {
    errEl.textContent = msg;
    errEl.classList.remove('hidden');
    setTimeout(function() { errEl.classList.add('hidden'); }, 5000);
  }
}

function setButtonLoading(loading) {
  var btn = document.getElementById('place-order-btn');
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.origText = btn.textContent;
    btn.textContent = 'Processing...';
    btn.classList.add('loading');
  } else {
    btn.textContent = btn.dataset.origText || 'Place Order';
    btn.classList.remove('loading');
  }
}

// ===== PLACE ORDER =====
var isSubmitting = false;

function handlePlaceOrder() {
  if (isSubmitting) return;
  isSubmitting = true;
  if (!validateForm()) { isSubmitting = false; return; }

  if (selectedPaymentMethod === 'cod' && !isCodAvailable()) {
    showError('COD not available for your location. Please select WhatsApp order.');
    isSubmitting = false;
    return;
  }

  var cart = ThajviCart.get();
  if (cart.length === 0) {
    showError('Your cart is empty. Please add items before checking out.');
    isSubmitting = false;
    return;
  }

  setButtonLoading(true);

  validateCartPrices().then(function(result) {
    if (!result.valid) {
      showError('Price mismatch detected for "' + result.item + '". Please clear your cart and re-add items.');
      setButtonLoading(false);
      return;
    }
    proceedWithOrder();
  });
}

function proceedWithOrder() {
  var order = collectOrderData();
  order.paymentMethod = selectedPaymentMethod;
  order.codCharge = getCodCharge();
  order.total = getGrandTotal();

  // Set payment status based on method
  if (selectedPaymentMethod === 'upi') {
    order.paymentStatus = 'pending_verification';
  }

  saveOrderLocally(order);

  // Save to Supabase (Tier 2+ feature)
  if (typeof saveOrderToSupabase === 'function' && window.THAJVI_TIER && window.THAJVI_TIER.features.supabaseDatabase) {
    saveOrderToSupabase(order).then(function(result) {
      if (result.success) console.log('Order saved to Supabase');
      else if (result.reason !== 'disabled') console.log('Supabase save failed - local backup saved');
    }).catch(function(err) { console.log('Supabase error:', err); });
  }

  switch (selectedPaymentMethod) {
    case 'whatsapp':
      handleWhatsAppOrder(order);
      break;
    case 'upi':
      handleUpiOrder(order);
      break;
    case 'cod':
      handleCodOrder(order);
      break;
    default:
      handleWhatsAppOrder(order);
  }
}

function collectOrderData() {
  var cart = ThajviCart.get();
  var val = function(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };
  return {
    orderId: generateOrderId(),
    timestamp: new Date().toISOString(),
    items: cart,
    customer: {
      name: val('fullname'),
      phone: val('phone'),
      email: val('email'),
      address: {
        line1: val('address1'),
        line2: val('address2'),
        city: val('city'),
        state: val('state'),
        pincode: val('pincode')
      },
      instructions: val('instructions')
    },
    pricing: {
      subtotal: ThajviCart.subtotal(),
      shipping: ThajviCart.shipping()
    }
  };
}

function saveOrderLocally(order) {
  localStorage.setItem('thajvi_last_order', JSON.stringify(order));
}

// ===== WHATSAPP ORDER =====
function handleWhatsAppOrder(order) {
  var msg = buildWhatsAppMessage(order);
  var url = 'https://wa.me/' + STORE_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(msg);
  var win = window.open(url, '_blank');
  if (!win) { showError('Please allow popups to send your order via WhatsApp.'); setButtonLoading(false); return; }
  ThajviCart.clear();
  setTimeout(function() { window.location.href = 'order-success.html'; }, 500);
}

function buildWhatsAppMessage(order) {
  var items = '';
  for (var i = 0; i < order.items.length; i++) {
    var it = order.items[i];
    items += '\u2022 *' + it.name + '*\n  Size: ' + it.size + ' | Qty: ' + it.quantity + ' | ' + ThajviCart.formatPrice(it.price * it.quantity) + '\n';
  }

  return '\uD83D\uDED2 *NEW ORDER \u2014 ' + STORE_CONFIG.storeName + '*\n' +
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n' +
    '*Order ID:* ' + order.orderId + '\n' +
    '*Payment:* WhatsApp Order \uD83D\uDCAC\n\n' +
    '\uD83D\uDC64 *Customer:*\n' +
    'Name: ' + order.customer.name + '\n' +
    'Phone: ' + order.customer.phone + '\n' +
    (order.customer.email ? 'Email: ' + order.customer.email + '\n' : '') + '\n' +
    '\uD83D\uDCE6 *Items:*\n' + items + '\n' +
    '\uD83D\uDCB0 *Pricing:*\n' +
    'Subtotal: ' + ThajviCart.formatPrice(order.pricing.subtotal) + '\n' +
    'Shipping: ' + (order.pricing.shipping === 0 ? 'FREE \u2705' : ThajviCart.formatPrice(order.pricing.shipping)) + '\n' +
    '*Total: ' + ThajviCart.formatPrice(order.total) + '*\n\n' +
    '\uD83D\uDCCD *Delivery Address:*\n' +
    order.customer.address.line1 + '\n' +
    (order.customer.address.line2 ? order.customer.address.line2 + '\n' : '') +
    order.customer.address.city + ', ' + order.customer.address.state + '\n' +
    'Pincode: ' + order.customer.address.pincode + '\n' +
    (order.customer.instructions ? '\n\uD83D\uDCDD *Instructions:* ' + order.customer.instructions + '\n' : '') +
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501';
}

// ===== COD ORDER =====
function handleCodOrder(order) {
  var msg = buildCodWhatsApp(order);
  var url = 'https://wa.me/' + STORE_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(msg);
  var win = window.open(url, '_blank');
  if (!win) { showError('Please allow popups to send your order via WhatsApp.'); setButtonLoading(false); return; }
  ThajviCart.clear();
  setTimeout(function() { window.location.href = 'order-success.html'; }, 500);
}

function buildCodWhatsApp(order) {
  var items = '';
  for (var i = 0; i < order.items.length; i++) {
    var it = order.items[i];
    items += '\u2022 ' + it.name + '\n  Size: ' + it.size + ' | Qty: ' + it.quantity + ' | ' + ThajviCart.formatPrice(it.price * it.quantity) + '\n';
  }

  return '\uD83D\uDCB5 *COD ORDER \u2014 ' + STORE_CONFIG.storeName + '*\n' +
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n' +
    '*Order ID:* ' + order.orderId + '\n' +
    '*Payment:* CASH ON DELIVERY \uD83D\uDCB5\n\n' +
    '\uD83D\uDC64 *Customer Details:*\n' +
    'Name: ' + order.customer.name + '\n' +
    'Phone: ' + order.customer.phone + '\n' +
    (order.customer.email ? 'Email: ' + order.customer.email + '\n' : '') + '\n' +
    '\uD83D\uDCE6 *Items Ordered:*\n' + items + '\n' +
    '\uD83D\uDCB0 *Price Breakdown:*\n' +
    'Subtotal: ' + ThajviCart.formatPrice(order.pricing.subtotal) + '\n' +
    'Shipping: ' + (order.pricing.shipping === 0 ? 'FREE \u2705' : ThajviCart.formatPrice(order.pricing.shipping)) + '\n' +
    'COD Charges: ' + ThajviCart.formatPrice(order.codCharge) + '\n' +
    '*Collect at Door: ' + ThajviCart.formatPrice(order.total) + '*\n\n' +
    '\uD83D\uDCCD *Delivery Address:*\n' +
    order.customer.address.line1 + '\n' +
    (order.customer.address.line2 ? order.customer.address.line2 + '\n' : '') +
    order.customer.address.city + ', ' + order.customer.address.state + '\n' +
    'Pincode: ' + order.customer.address.pincode + '\n' +
    (order.customer.instructions ? '\n\uD83D\uDCDD *Instructions:* ' + order.customer.instructions + '\n' : '') +
    '\n\u26A0\uFE0F *Please confirm this COD order with customer before shipping!*\n' +
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501';
}

// ===== UPI ORDER =====
function handleUpiOrder(order) {
  ThajviCart.clear();

  // Show UPI modal
  showUpiModal(order);
  setButtonLoading(false);
}

function showUpiModal(order) {
  var modal = document.getElementById('upi-modal');
  if (!modal) return;

  // Populate fields
  document.getElementById('upi-order-id').textContent = order.orderId;
  document.getElementById('upi-amount').textContent = ThajviCart.formatPrice(order.total);
  document.getElementById('upi-id-display').textContent = STORE_CONFIG.upiId;
  document.getElementById('upi-verify-time').textContent = STORE_CONFIG.upiVerificationTime;

  // Build UPI link — use raw values for pa/pn/tn to avoid encoding issues with some UPI apps
  var upiLink = 'upi://pay?pa=' + STORE_CONFIG.upiId +
    '&pn=' + STORE_CONFIG.upiName.replace(/\s/g, '+') +
    '&am=' + Math.round(order.total) +
    '&cu=INR' +
    '&tr=' + order.orderId +
    '&tn=' + order.orderId +
    '&mode=02';

  // Set "Open UPI App" button
  document.getElementById('upi-app-btn').href = upiLink;

  // Generate QR code (only if a real UPI ID is configured)
  var qrContainer = document.getElementById('upi-qr-canvas').parentElement;
  var isRealUpi = STORE_CONFIG.upiId && STORE_CONFIG.upiId !== 'yourname@okaxis' && STORE_CONFIG.upiId.indexOf('@') !== -1;
  if (isRealUpi && typeof QRCode !== 'undefined' && QRCode.toCanvas) {
    qrContainer.style.display = '';
    var canvas = document.getElementById('upi-qr-canvas');
    QRCode.toCanvas(canvas, upiLink, { width: 220, margin: 1 }, function(err) {
      if (err) console.log('QR generation error:', err);
    });
  } else {
    qrContainer.style.display = 'none';
  }

  // Build WhatsApp message with FULL order details
  var items = '';
  for (var i = 0; i < order.items.length; i++) {
    var it = order.items[i];
    items += '\u2022 *' + it.name + '*\n  Size: ' + it.size + ' | Qty: ' + it.quantity + ' | ' + ThajviCart.formatPrice(it.price * it.quantity) + '\n';
  }
  var waMsg = '\uD83D\uDCB3 *UPI PAYMENT ORDER \u2014 ' + STORE_CONFIG.storeName + '*\n' +
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n' +
    '*Order ID:* ' + order.orderId + '\n' +
    '*Payment:* UPI (Pending Verification)\n\n' +
    '\uD83D\uDC64 *Customer:*\n' +
    'Name: ' + order.customer.name + '\n' +
    'Phone: ' + order.customer.phone + '\n' +
    (order.customer.email ? 'Email: ' + order.customer.email + '\n' : '') + '\n' +
    '\uD83D\uDCE6 *Items:*\n' + items + '\n' +
    '\uD83D\uDCB0 *Pricing:*\n' +
    'Subtotal: ' + ThajviCart.formatPrice(order.pricing.subtotal) + '\n' +
    'Shipping: ' + (order.pricing.shipping === 0 ? 'FREE \u2705' : ThajviCart.formatPrice(order.pricing.shipping)) + '\n' +
    '*Total: ' + ThajviCart.formatPrice(order.total) + '*\n\n' +
    '\uD83D\uDCCD *Delivery Address:*\n' +
    order.customer.address.line1 + '\n' +
    (order.customer.address.line2 ? order.customer.address.line2 + '\n' : '') +
    order.customer.address.city + ', ' + order.customer.address.state + '\n' +
    'Pincode: ' + order.customer.address.pincode + '\n' +
    (order.customer.instructions ? '\n\uD83D\uDCDD *Instructions:* ' + order.customer.instructions + '\n' : '') +
    '\n\uD83D\uDE4F I will share the payment screenshot here. Please confirm my order.\n' +
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501';
  document.getElementById('upi-whatsapp-btn').href =
    'https://wa.me/' + STORE_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(waMsg);

  // Show WhatsApp number for desktop users who scanned QR on phone
  var waNumEl = document.getElementById('upi-wa-number');
  if (waNumEl && STORE_CONFIG.whatsappNumber) {
    var num = STORE_CONFIG.whatsappNumber.replace(/^91/, '+91 ');
    waNumEl.textContent = num;
  }

  // Show modal + lock body scroll
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Focus trap for accessibility
  var closeBtn = document.getElementById('upi-modal-close');
  if (closeBtn) setTimeout(function() { closeBtn.focus(); }, 100);
  var focusable = modal.querySelectorAll('button, input, a[href], [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    var first = focusable[0], last = focusable[focusable.length - 1];
    modal._focusTrap = function(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    modal.addEventListener('keydown', modal._focusTrap);
  }
}

function initUpiModal() {
  // Close button — just close modal, stay on checkout
  var closeBtn = document.getElementById('upi-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      if (confirm('Cancel UPI payment? You can choose another payment method.')) {
        var modal = document.getElementById('upi-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }

  // Copy button
  var copyBtn = document.getElementById('upi-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      var upiId = STORE_CONFIG.upiId;
      navigator.clipboard.writeText(upiId).then(function() {
        copyBtn.textContent = 'Copied!';
        setTimeout(function() { copyBtn.textContent = 'Copy'; }, 2000);
      }).catch(function() {
        // Fallback: temporary input + execCommand
        var tempInput = document.createElement('input');
        tempInput.value = upiId;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
          copyBtn.textContent = 'Copied!';
          setTimeout(function() { copyBtn.textContent = 'Copy'; }, 2000);
        } catch(e) {
          copyBtn.textContent = 'Select & Copy';
        }
        document.body.removeChild(tempInput);
      });
    });
  }

  // UTR submit (replaces old skip link)
  var utrSubmit = document.getElementById('upi-utr-submit');
  if (utrSubmit) {
    utrSubmit.addEventListener('click', function() {
      var utrInput = document.getElementById('upi-utr-input');
      var utrError = document.getElementById('upi-utr-error');
      var utrValue = (utrInput.value || '').trim();

      if (utrValue.length < 6) {
        utrError.classList.remove('hidden');
        utrInput.focus();
        return;
      }
      utrError.classList.add('hidden');

      // Get current order ID from the modal
      var orderId = document.getElementById('upi-order-id').textContent;

      // Save UTR to Supabase
      if (typeof updateOrderInSupabase === 'function') {
        updateOrderInSupabase(orderId, { utr_number: utrValue });
      }

      // Save UTR locally
      try {
        var localOrder = JSON.parse(localStorage.getItem('thajvi_last_order') || '{}');
        localOrder.utrNumber = utrValue;
        localStorage.setItem('thajvi_last_order', JSON.stringify(localOrder));
      } catch(e) {}

      // Send UTR info via WhatsApp with full order details
      var utrMsg = '\u2705 *UPI PAYMENT DONE*\n\n' +
        '*Order ID:* ' + orderId + '\n' +
        '*UPI Transaction ID:* ' + utrValue + '\n' +
        '*Amount:* ' + document.getElementById('upi-amount').textContent + '\n';
      try {
        var lo = JSON.parse(localStorage.getItem('thajvi_last_order') || '{}');
        if (lo.customer) {
          utrMsg += '\n\uD83D\uDC64 *Customer:*\n' +
            'Name: ' + lo.customer.name + '\n' +
            'Phone: ' + lo.customer.phone + '\n';
          if (lo.items) {
            utrMsg += '\n\uD83D\uDCE6 *Items:*\n';
            for (var k = 0; k < lo.items.length; k++) {
              var itm = lo.items[k];
              utrMsg += '\u2022 ' + itm.name + ' (Size: ' + itm.size + ') x' + itm.quantity + '\n';
            }
          }
          if (lo.customer.address) {
            utrMsg += '\n\uD83D\uDCCD *Delivery Address:*\n' +
              lo.customer.address.line1 + '\n' +
              (lo.customer.address.line2 ? lo.customer.address.line2 + '\n' : '') +
              lo.customer.address.city + ', ' + lo.customer.address.state + '\n' +
              'Pincode: ' + lo.customer.address.pincode + '\n';
          }
        }
      } catch(e) {}
      utrMsg += '\nPlease verify and confirm my order. \uD83D\uDE4F';
      window.open('https://wa.me/' + STORE_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(utrMsg), '_blank');

      window.location.href = 'order-success.html';
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    var modal = document.getElementById('upi-modal');
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      if (confirm('Cancel UPI payment? You can choose another payment method.')) {
        var m = document.getElementById('upi-modal');
        m.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }
  });
}

// ===== INIT ON LOAD =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckout);
} else {
  initCheckout();
}
