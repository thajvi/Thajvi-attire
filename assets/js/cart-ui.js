// ============================================
//   THAJVI ATTIRE — Cart UI (cart-ui.js)
//   Drawer, Toast, Navbar badge, interactions
// ============================================

(function() {
  'use strict';

  // ===== CART ICON IN NAVBAR =====

  function createCartIcon() {
    var navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    var instaLink = navContainer.querySelector('.nav-insta');
    var cartLink = document.createElement('button');
    cartLink.type = 'button';
    cartLink.className = 'nav-cart-btn';
    cartLink.setAttribute('aria-label', 'Open cart');
    cartLink.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22">' +
      '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
      '<line x1="3" y1="6" x2="21" y2="6"/>' +
      '<path d="M16 10a4 4 0 01-8 0"/>' +
      '</svg>' +
      '<span class="cart-badge" id="cart-badge">0</span>';

    cartLink.addEventListener('click', function() { openDrawer(); });

    // Always place cart icon before hamburger so it's visible on mobile
    var hamburger = navContainer.querySelector('.hamburger');
    if (hamburger) {
      navContainer.insertBefore(cartLink, hamburger);
    } else if (instaLink) {
      navContainer.insertBefore(cartLink, instaLink.nextSibling);
    } else {
      navContainer.appendChild(cartLink);
    }
  }

  function updateCartBadge() {
    var badge = document.getElementById('cart-badge');
    if (!badge) return;
    var count = ThajviCart.count();
    badge.textContent = count > 9 ? '9+' : count;
    badge.classList.toggle('visible', count > 0);

    // Bounce animation
    if (count > 0) {
      badge.classList.remove('bounce');
      void badge.offsetWidth; // reflow
      badge.classList.add('bounce');
    }
  }

  // ===== CART DRAWER =====

  function createDrawer() {
    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.id = 'cart-overlay';
    overlay.addEventListener('click', closeDrawer);

    // Drawer panel
    var drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.id = 'cart-drawer';

    drawer.innerHTML =
      '<div class="cart-drawer-header">' +
        '<div>' +
          '<h2 class="cart-drawer-title">Your Cart</h2>' +
          '<span class="cart-drawer-count" id="drawer-count">(0 items)</span>' +
        '</div>' +
        '<button class="cart-drawer-close" id="drawer-close" aria-label="Close cart">&times;</button>' +
      '</div>' +
      '<div class="cart-drawer-body" id="drawer-body"></div>' +
      '<div class="cart-drawer-footer" id="drawer-footer"></div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    document.getElementById('drawer-close').addEventListener('click', closeDrawer);

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    // Swipe to close on mobile
    var touchStartX = 0;
    drawer.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    drawer.addEventListener('touchend', function(e) {
      var diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 80) closeDrawer();
    }, { passive: true });
  }

  function openDrawer() {
    renderDrawer();
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderDrawer() {
    var cart = ThajviCart.get();
    var body = document.getElementById('drawer-body');
    var footer = document.getElementById('drawer-footer');
    var countEl = document.getElementById('drawer-count');

    var totalItems = ThajviCart.count();
    countEl.textContent = '(' + totalItems + ' item' + (totalItems !== 1 ? 's' : '') + ')';

    // Empty state
    if (cart.length === 0) {
      body.innerHTML =
        '<div class="cart-empty">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="64" height="64" style="opacity:0.3;color:var(--gold)">' +
          '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
          '<line x1="3" y1="6" x2="21" y2="6"/>' +
          '<path d="M16 10a4 4 0 01-8 0"/>' +
          '</svg>' +
          '<p class="cart-empty-title">Your cart is empty</p>' +
          '<p class="cart-empty-sub">Discover our curated collection</p>' +
          '<button class="cart-empty-btn" onclick="document.getElementById(\'cart-overlay\').classList.remove(\'open\');document.getElementById(\'cart-drawer\').classList.remove(\'open\');document.body.style.overflow=\'\';document.getElementById(\'collections\').scrollIntoView({behavior:\'smooth\'});">Shop Now &rarr;</button>' +
        '</div>';
      footer.innerHTML = '';
      return;
    }

    // Cart items
    var html = '';
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var lineTotal = item.price * item.quantity;
      html +=
        '<div class="cart-item" data-id="' + item.id + '">' +
          '<div class="cart-item-img">' +
            (item.image ? '<img src="' + item.image + '" alt="' + item.name + '" />' : '<div class="cart-item-img-placeholder"></div>') +
          '</div>' +
          '<div class="cart-item-details">' +
            '<div class="cart-item-top">' +
              '<h4 class="cart-item-name">' + item.name + '</h4>' +
              '<button class="cart-item-remove" data-id="' + item.id + '" aria-label="Remove ' + item.name + '">&times;</button>' +
            '</div>' +
            '<p class="cart-item-size">Size: ' + item.size + '</p>' +
            '<div class="cart-item-bottom">' +
              '<div class="cart-qty-control">' +
                '<button class="cart-qty-btn" data-action="decrease" data-id="' + item.id + '" data-qty="' + item.quantity + '">−</button>' +
                '<span class="cart-qty-num">' + item.quantity + '</span>' +
                '<button class="cart-qty-btn" data-action="increase" data-id="' + item.id + '" data-qty="' + item.quantity + '">+</button>' +
              '</div>' +
              '<span class="cart-item-price">' + ThajviCart.formatPrice(lineTotal) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
    body.innerHTML = html;

    // Bind item events
    body.querySelectorAll('.cart-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        ThajviCart.remove(this.getAttribute('data-id'));
        renderDrawer();
      });
    });
    body.querySelectorAll('.cart-qty-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        var qty = parseInt(this.getAttribute('data-qty'));
        var action = this.getAttribute('data-action');
        ThajviCart.updateQty(id, action === 'increase' ? qty + 1 : qty - 1);
        renderDrawer();
      });
    });

    // Footer
    var subtotal = ThajviCart.subtotal();
    var shipping = ThajviCart.shipping();
    var total = ThajviCart.total();
    var remaining = ThajviCart.freeShippingRemaining();
    var progress = ThajviCart.freeShippingProgress();

    var shippingText = shipping === 0 ? '<span style="color:#25d366;font-weight:600;">FREE</span>' : ThajviCart.formatPrice(shipping);
    var progressBar =
      '<div class="cart-shipping-progress">' +
        '<div class="cart-shipping-bar"><div class="cart-shipping-fill" style="width:' + progress + '%"></div></div>' +
        (remaining > 0
          ? '<p class="cart-shipping-msg">Add ' + ThajviCart.formatPrice(remaining) + ' more for free shipping</p>'
          : '<p class="cart-shipping-msg free">You have free shipping!</p>') +
      '</div>';

    footer.innerHTML =
      progressBar +
      '<div class="cart-summary-row"><span>Subtotal</span><span>' + ThajviCart.formatPrice(subtotal) + '</span></div>' +
      '<div class="cart-summary-row"><span>Shipping</span><span>' + shippingText + '</span></div>' +
      '<div class="cart-summary-divider"></div>' +
      '<div class="cart-summary-row cart-summary-total"><span>Total</span><span>' + ThajviCart.formatPrice(total) + '</span></div>' +
      '<a href="cart.html" class="cart-checkout-btn">Checkout &rarr;</a>' +
      '<button class="cart-continue-btn" onclick="document.getElementById(\'cart-overlay\').classList.remove(\'open\');document.getElementById(\'cart-drawer\').classList.remove(\'open\');document.body.style.overflow=\'\';">Continue Shopping</button>';
  }

  // ===== TOAST NOTIFICATION =====

  function showToast(product) {
    // Remove any existing toast
    var existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML =
      '<div class="cart-toast-content">' +
        '<div class="cart-toast-icon">\u2713</div>' +
        '<div class="cart-toast-text">' +
          '<p class="cart-toast-title">Added to Cart</p>' +
          '<p class="cart-toast-detail">' + product.name + ' — Size ' + product.size + '</p>' +
        '</div>' +
        '<button class="cart-toast-close" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="cart-toast-actions">' +
        '<button class="cart-toast-view">View Cart</button>' +
        '<a href="cart.html" class="cart-toast-checkout">Checkout &rarr;</a>' +
      '</div>' +
      '<div class="cart-toast-progress"><div class="cart-toast-progress-bar"></div></div>';

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function() {
      toast.classList.add('visible');
    });

    // Bind events
    toast.querySelector('.cart-toast-close').addEventListener('click', function() {
      dismissToast(toast);
    });
    toast.querySelector('.cart-toast-view').addEventListener('click', function() {
      dismissToast(toast);
      openDrawer();
    });

    // Auto dismiss after 3s
    var timer = setTimeout(function() { dismissToast(toast); }, 3000);
    toast.addEventListener('mouseenter', function() { clearTimeout(timer); });
    toast.addEventListener('mouseleave', function() {
      timer = setTimeout(function() { dismissToast(toast); }, 1500);
    });
  }

  function dismissToast(toast) {
    toast.classList.remove('visible');
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
  }

  // ===== ADD TO CART FROM PRODUCT CARDS =====

  // Called from main.js when "Add to Cart" is clicked
  window.handleAddToCart = function(product, btnElement) {
    if (!product.size) {
      // Shake the size selector area
      var card = btnElement.closest('.saree-card');
      if (card) {
        var sizeArea = card.querySelector('div[style*="display:flex"][style*="gap:8px"]');
        if (sizeArea) {
          sizeArea.style.animation = 'btnShake 0.5s ease';
          setTimeout(function() { sizeArea.style.animation = ''; }, 600);
        }
      }
      // Show tooltip
      btnElement.classList.add('no-size');
      var origText = btnElement.textContent;
      btnElement.textContent = 'Please select a size';
      setTimeout(function() {
        btnElement.textContent = origText;
        btnElement.classList.remove('no-size');
      }, 1500);
      return;
    }

    // Loading state
    btnElement.disabled = true;
    btnElement.textContent = 'Adding...';
    btnElement.classList.add('loading');

    setTimeout(function() {
      var success = ThajviCart.add(product);

      if (success) {
        // Success state
        btnElement.textContent = 'Added \u2713';
        btnElement.classList.remove('loading');
        btnElement.classList.add('success');

        // Bounce cart icon
        var cartBtn = document.querySelector('.nav-cart-btn');
        if (cartBtn) {
          cartBtn.classList.add('bounce');
          setTimeout(function() { cartBtn.classList.remove('bounce'); }, 600);
        }

        // Show toast
        showToast(product);

        // Reset button after 1.5s
        setTimeout(function() {
          btnElement.textContent = 'Add to Cart';
          btnElement.classList.remove('success');
          btnElement.disabled = false;
        }, 1500);

      } else {
        btnElement.textContent = 'Max qty reached';
        setTimeout(function() {
          btnElement.textContent = 'Add to Cart';
          btnElement.disabled = false;
          btnElement.classList.remove('loading');
        }, 1500);
      }
    }, 300);
  };

  // ===== INIT =====

  function init() {
    createCartIcon();
    createDrawer();
    updateCartBadge();
    ThajviCart.onChange(function() { updateCartBadge(); });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
