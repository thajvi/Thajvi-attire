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
  codMaxOrder: 5000
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
  initPaymentMethods();
  updateSubmitButton();
  setupFormValidation();
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
          (item.image ? '<img src="' + item.image + '" alt="' + item.name + '"/>' : '<div class="summary-item-placeholder"></div>') +
          '<span class="summary-item-qty">' + item.quantity + '</span>' +
        '</div>' +
        '<div class="summary-item-info">' +
          '<p class="summary-item-name">' + item.name + '</p>' +
          '<p class="summary-item-size">Size: ' + item.size + '</p>' +
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

  if (STORE_CONFIG.codEnabled && codOption) {
    codOption.classList.remove('hidden');
    setupPaymentMethodSelection();

    var stateField = document.getElementById('state');
    if (stateField) {
      stateField.addEventListener('change', checkCodAvailability);
    }
  } else if (codOption) {
    codOption.classList.add('hidden');
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
function handlePlaceOrder() {
  if (!validateForm()) return;

  if (selectedPaymentMethod === 'cod' && !isCodAvailable()) {
    showError('COD not available for your location. Please select WhatsApp order.');
    return;
  }

  setButtonLoading(true);

  var order = collectOrderData();
  order.paymentMethod = selectedPaymentMethod;
  order.codCharge = getCodCharge();
  order.total = getGrandTotal();

  saveOrderLocally(order);

  switch (selectedPaymentMethod) {
    case 'whatsapp':
      handleWhatsAppOrder(order);
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
  window.open(url, '_blank');
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
  window.open(url, '_blank');
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

// ===== INIT ON LOAD =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckout);
} else {
  initCheckout();
}
