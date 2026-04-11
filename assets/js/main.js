// ============================================
//   STARTER TEMPLATE — Main JavaScript
// ============================================

// ===== SITE CONFIG =====
const WHATSAPP_NUMBER = '918129651993';
const SHOW_SIZE_GUIDE = true;
var SITE_URL = 'https://thajviattire.com';
var INSTAGRAM_HANDLE = '@thajvi_attire_';
var DELIVERY_ITEMS = [];
var BUSINESS_HOURS = null;

// ===== HELPERS =====
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function createSVG(pathD, size) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('width', size || '16');
  svg.setAttribute('height', size || '16');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path);
  return svg;
}

const WA_ICON_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';


// ===== SHARE TOAST =====
var shareToastEl = document.getElementById('share-toast');
var shareToastTextEl = document.getElementById('share-toast-text');
var shareToastTimer;
function showShareToast(type, msg) {
  clearTimeout(shareToastTimer);
  shareToastEl.className = 'share-toast ' + type;
  shareToastTextEl.textContent = msg;
  shareToastEl.classList.add('visible');
  shareToastTimer = setTimeout(function() {
    shareToastEl.classList.remove('visible');
  }, 2800);
}

// ===== INSTAGRAM MODAL =====
var igModalBg   = document.getElementById('ig-modal-bg');
var igModalText = document.getElementById('ig-modal-text');
var igModalClose = document.getElementById('ig-modal-close');
var igCopyBtn   = document.getElementById('ig-copy-btn');
var igOpenBtn   = document.getElementById('ig-open-btn');

function openIgModal(caption) {
  igModalText.textContent = caption;
  igModalBg.classList.add('active');
}

igModalClose.addEventListener('click', function() {
  igModalBg.classList.remove('active');
});
igModalBg.addEventListener('click', function(e) {
  if (e.target === igModalBg) igModalBg.classList.remove('active');
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') igModalBg.classList.remove('active');
});

igCopyBtn.addEventListener('click', function() {
  navigator.clipboard.writeText(igModalText.textContent)
    .then(function() {
      igCopyBtn.textContent = 'Copied!';
      showShareToast('ig', 'Copied! Paste it into Instagram now.');
      setTimeout(function() { igCopyBtn.textContent = 'Copy Text'; }, 2000);
    })
    .catch(function() {
      showShareToast('', 'Please select and copy the text manually.');
    });
});
igOpenBtn.addEventListener('click', function() {
  window.open('https://www.instagram.com/', '_blank');
  showShareToast('ig', 'Instagram opened — paste your caption there!');
});

// ===== TRUST BADGE ICONS =====
function getTrustIcon(type) {
  var icons = {
    check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    star:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    heart:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    truck:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    return: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>',
    lock:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    gift:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>',
    hand:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><path d="M18 11V6a2 2 0 00-2-2 2 2 0 00-2 2"/><path d="M14 10V4a2 2 0 00-2-2 2 2 0 00-2 2v2"/><path d="M10 10.5V6a2 2 0 00-2-2 2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15"/></svg>',
    india:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'
  };
  return icons[type] || icons['check'];
}

function getDeliveryIcon(type) {
  var icons = {
    truck:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    cash:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    clock:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    gift:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>',
    return: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>',
    check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>',
    star:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  };
  return icons[type] || icons['check'];
}

function getHoursStatus(hours) {
  if (!hours || !hours.hours_enabled) return null;
  var now = new Date();
  var tzTime;
  try {
    tzTime = new Date(now.toLocaleString('en-US', {
      timeZone: hours.hours_timezone || 'Asia/Kolkata'
    }));
  } catch (e) { tzTime = now; }
  var day  = tzTime.getDay();
  var hhmm = tzTime.getHours() * 100 + tzTime.getMinutes();
  var openParts  = (hours.hours_open  || '10:00').split(':');
  var closeParts = (hours.hours_close || '19:00').split(':');
  var openHHMM   = parseInt(openParts[0])  * 100 + parseInt(openParts[1]  || 0);
  var closeHHMM  = parseInt(closeParts[0]) * 100 + parseInt(closeParts[1] || 0);
  var daysMap = {
    'Mon\u2013Sat': [1,2,3,4,5,6],
    'Mon\u2013Sun': [0,1,2,3,4,5,6],
    'Mon\u2013Fri': [1,2,3,4,5],
    'Tue\u2013Sun': [0,2,3,4,5,6],
    'Wed\u2013Mon': [0,1,3,4,5,6]
  };
  var openDays  = daysMap[hours.hours_days] || [1,2,3,4,5,6];
  var todayOpen = openDays.indexOf(day) !== -1;
  var isOpen    = todayOpen && hhmm >= openHHMM && hhmm < closeHHMM;
  if (isOpen) return { open: true, text: 'We\'re open now' };
  var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var openTimeStr = (parseInt(openParts[0]) % 12 || 12) + ':' +
    (openParts[1] || '00') + ' ' +
    (parseInt(openParts[0]) < 12 ? 'AM' : 'PM');
  if (todayOpen && hhmm < openHHMM) {
    return { open: false, text: 'Closed \u00b7 Opens today at ' + openTimeStr };
  }
  for (var i = 1; i <= 7; i++) {
    var nextDay = (day + i) % 7;
    if (openDays.indexOf(nextDay) !== -1) {
      var label = i === 1 ? 'tomorrow' : dayNames[nextDay];
      return { open: false, text: 'Closed \u00b7 Opens ' + label + ' at ' + openTimeStr };
    }
  }
  return { open: false, text: 'Currently closed' };
}

// ===== 1. BUILD PRODUCT CARDS (XSS-safe) =====
const grid = document.getElementById('saree-grid');

fetch('data/products.json')
  .then(function(res) { return res.json(); })
  .then(function(data) {
    var products = data.items;

    // --- Deal of the Day ---
    var featured = products.find(function(p) { return p.featured === true; });
    if (featured) {
      var dealSection = document.getElementById('deal-of-day');
      dealSection.style.display = 'block';

      // Name, desc, price, stock
      document.getElementById('deal-name').textContent = featured.name;
      document.getElementById('deal-desc').textContent = featured.description;
      var dealPriceEl = document.getElementById('deal-price');
      dealPriceEl.textContent = featured.price;
      if (!/\d/.test(featured.price)) dealPriceEl.style.fontFamily = 'inherit';
      if (featured.stock) {
        document.getElementById('deal-stock').textContent = featured.stock;
      }

      // Photo
      var dealImgWrap = document.getElementById('deal-image-wrap');
      if (featured.photo) {
        dealImgWrap.innerHTML = '';
        var dImg = document.createElement('img');
        dImg.src = featured.photo;
        dImg.alt = featured.name;
        dImg.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        dealImgWrap.appendChild(dImg);
      }

      // Tags (fabric + occasion)
      var dealTagsEl = document.getElementById('deal-tags');
      dealTagsEl.innerHTML = '';
      if (featured.fabric) {
        var ft = document.createElement('span');
        ft.className = 'deal-tag';
        ft.textContent = featured.fabric;
        dealTagsEl.appendChild(ft);
      }
      if (featured.occasion) {
        var ot = document.createElement('span');
        ot.className = 'deal-tag';
        ot.textContent = featured.occasion;
        dealTagsEl.appendChild(ot);
      }

      // Size buttons
      var dealSizesEl = document.getElementById('deal-sizes');
      dealSizesEl.innerHTML = '';
      var dealSelectedSize = '';
      if (featured.sizes) {
        var szLabel = document.createElement('span');
        szLabel.className = 'deal-size-label';
        szLabel.textContent = 'Size:';
        dealSizesEl.appendChild(szLabel);
        var dealSizeBtns = [];
        featured.sizes.split(',').forEach(function(s) {
          var sz = s.trim();
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'deal-size-btn';
          btn.textContent = sz;
          btn.addEventListener('click', function() {
            dealSelectedSize = sz;
            dealSizeBtns.forEach(function(b) { b.classList.remove('selected'); });
            btn.classList.add('selected');
            updateDealWaLink();
          });
          dealSizeBtns.push(btn);
          dealSizesEl.appendChild(btn);
        });
      }

      // WhatsApp button
      var dealWaBtn = document.getElementById('deal-wa-btn');
      var dealPhone = (featured.whatsapp || WHATSAPP_NUMBER).replace(/[^\d]/g, '');
      function updateDealWaLink() {
        var msg = 'Hi! \uD83D\uDC4B\n\nI\'d like to order the *Deal of the Day*:\n*' +
          featured.name + '*' +
          (dealSelectedSize ? ' in size *' + dealSelectedSize + '*' : '') +
          '\nFabric: ' + (featured.fabric || 'N/A') +
          '\nPrice: ' + featured.price +
          '\n\nPlease confirm availability. Thank you!';
        dealWaBtn.href = 'https://wa.me/' + dealPhone + '?text=' + encodeURIComponent(msg);
      }
      updateDealWaLink();
      dealWaBtn.addEventListener('click', function(e) {
        if (!dealSelectedSize && featured.sizes) {
          e.preventDefault();
          alert('Please select a size first!');
        }
      });

      // Countdown timer — counts down to midnight every day
      var dealTimerEl = document.getElementById('deal-timer');
      function updateDealTimer() {
        var now = new Date();
        var midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        var diff = midnight - now;
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        dealTimerEl.textContent = 'Ends in ' +
          String(h).padStart(2, '0') + 'h ' +
          String(m).padStart(2, '0') + 'm ' +
          String(s).padStart(2, '0') + 's';
      }
      updateDealTimer();
      setInterval(updateDealTimer, 1000);
    }

    // Remove skeleton placeholders
    grid.querySelectorAll('.skeleton-card').forEach(function(el) { el.remove(); });

    products.forEach(function(item) {
  const phone = (item.whatsapp || WHATSAPP_NUMBER).replace(/[^\d]/g, '');
  var selectedSize = '';

  function getWaLink() {
    var msg = 'Hi! \uD83D\uDC4B\n\nI\'d like to order:\n*' + item.name + '* in size *' + selectedSize + '*\nFabric: ' + (item.fabric || 'N/A') + '\nOccasion: ' + (item.occasion || 'N/A') + '\nPrice: ' + item.price + '\n\nPlease confirm availability and delivery details. Thank you!';
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  }

  function handleOrder(e) {
    if (!selectedSize && item.sizes) {
      e.preventDefault();
      alert('Please select a size first!');
      return false;
    }
    window.open(getWaLink(), '_blank');
    return false;
  }

  const card = document.createElement('div');
  card.className = 'saree-card reveal';

  // Image wrapper — entire area is tappable on mobile
  const imgWrap = document.createElement('a');
  imgWrap.href = '#';
  imgWrap.className = 'card-img-wrap';
  imgWrap.setAttribute('aria-label', 'Order ' + item.name + ' on WhatsApp');
  imgWrap.addEventListener('click', function(e) {
    e.preventDefault();
    if (item.stock === 'Out of Stock') return;
    handleOrder(e);
  });

  if (item.photo) {
    const img = document.createElement('img');
    img.src = item.photo;
    img.alt = escapeHTML(item.name);
    img.loading = 'lazy';
    img.width = 400;
    img.height = 500;
    imgWrap.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'card-img-placeholder';
    const placeholderText = document.createElement('span');
    placeholderText.textContent = 'Photo coming soon';
    placeholder.appendChild(placeholderText);
    imgWrap.appendChild(placeholder);
  }

  // Badge
  if (item.badge) {
    const badge = document.createElement('div');
    badge.className = 'card-badge' + (item.badge === 'New Arrival' ? ' new' : '');
    badge.textContent = item.badge;
    imgWrap.appendChild(badge);
  }

  // Hover overlay (desktop only, mobile uses full image tap)
  const overlay = document.createElement('div');
  overlay.className = 'card-hover-overlay';
  const overlayText = document.createElement('span');
  overlayText.className = 'overlay-btn';
  overlayText.textContent = 'Order on WhatsApp';
  overlay.appendChild(overlayText);
  imgWrap.appendChild(overlay);

  card.appendChild(imgWrap);

  // Card info
  const info = document.createElement('div');
  info.className = 'card-info';

  const title = document.createElement('h3');
  title.textContent = item.name;
  info.appendChild(title);

  // Fabric & Occasion tags
  if (item.fabric || item.occasion) {
    const tags = document.createElement('div');
    tags.className = 'card-tags';
    if (item.fabric) {
      const fabricTag = document.createElement('span');
      fabricTag.className = 'card-tag';
      fabricTag.textContent = item.fabric;
      tags.appendChild(fabricTag);
    }
    if (item.occasion) {
      const occasionTag = document.createElement('span');
      occasionTag.className = 'card-tag';
      occasionTag.textContent = item.occasion;
      tags.appendChild(occasionTag);
    }
    info.appendChild(tags);
  }

  const desc = document.createElement('p');
  desc.textContent = item.description;
  info.appendChild(desc);

  if (item.sizes) {
    var sizesWrap = document.createElement('div');
    sizesWrap.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;';
    var sizeLabel = document.createElement('span');
    sizeLabel.textContent = 'Size: ';
    sizeLabel.style.cssText = 'font-size:0.85rem;color:#888;width:100%;margin-bottom:2px;';
    sizesWrap.appendChild(sizeLabel);

    var sizeArr = item.sizes.split(',');
    var sizeBtns = [];
    sizeArr.forEach(function(s) {
      var sz = s.trim();
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = sz;
      btn.style.cssText = 'padding:6px 14px;border:1.5px solid #C9A84C;border-radius:20px;background:transparent;color:#C9A84C;font-size:0.8rem;cursor:pointer;transition:all 0.2s;font-weight:500;';
      btn.addEventListener('click', function() {
        selectedSize = sz;
        sizeBtns.forEach(function(b) {
          b.style.background = 'transparent';
          b.style.color = '#C9A84C';
        });
        btn.style.background = '#C9A84C';
        btn.style.color = '#fff';
      });
      sizeBtns.push(btn);
      sizesWrap.appendChild(btn);
    });
    info.appendChild(sizesWrap);

    // Size Guide link
    if (SHOW_SIZE_GUIDE) {
      var sgLink = document.createElement('a');
      sgLink.href = '#';
      sgLink.className = 'card-size-guide-link';
      sgLink.textContent = 'Size Guide';
      sgLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('size-guide-overlay').classList.add('active');
        // Highlight selected size in table
        var rows = document.querySelectorAll('.sg-table tbody tr');
        rows.forEach(function(row) { row.classList.remove('sg-highlight'); });
        if (selectedSize) {
          rows.forEach(function(row) {
            if (row.getAttribute('data-size') === selectedSize) row.classList.add('sg-highlight');
          });
        }
      });
      sizesWrap.appendChild(sgLink);
    }
  }

  // Stock status + order button (handles OOS, Pre-Order, normal)
  var isOOS      = item.stock === 'Out of Stock';
  var isPreOrder = item.stock === 'Pre-Order';

  // Add OOS or Pre-Order badge on image if needed
  if (isOOS) {
    var oosBadge = document.createElement('div');
    oosBadge.className = 'card-oos-badge';
    oosBadge.textContent = 'Out of Stock';
    imgWrap.appendChild(oosBadge);
  } else if (isPreOrder) {
    var poBadge = document.createElement('div');
    poBadge.className = 'card-preorder-badge';
    poBadge.textContent = 'Pre-Order';
    imgWrap.appendChild(poBadge);
  }

  // Stock urgency label (for non-OOS, non-PreOrder values)
  if (item.stock && !isOOS && !isPreOrder) {
    var stock = document.createElement('p');
    stock.className = 'card-stock';
    stock.textContent = item.stock;
    info.appendChild(stock);
  }

  // Footer with price
  var footer = document.createElement('div');
  footer.className = 'card-footer';
  var price = document.createElement('span');
  price.className = 'price';
  price.textContent = item.price;
  if (!/\d/.test(item.price)) price.style.fontFamily = 'inherit';
  footer.appendChild(price);
  info.appendChild(footer);

  // Order button — changes based on stock state
  var waBtn = document.createElement('button');
  waBtn.type = 'button';

  if (isOOS) {
    // DISABLED state — out of stock
    waBtn.className = 'card-wa-cta disabled';
    waBtn.disabled = true;
    waBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Currently Unavailable';

    // Notify Me button
    var notifyBtn = document.createElement('button');
    notifyBtn.type = 'button';
    notifyBtn.className = 'card-notify-btn';
    notifyBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">' +
      '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>' +
      '<path d="M13.73 21a2 2 0 01-3.46 0"/>' +
      '</svg> Notify Me When Available';
    notifyBtn.addEventListener('click', function() {
      var msg = 'Hi! \uD83D\uDC4B\n\nI\'m interested in:\n*' + item.name + '*\n\nCould you please notify me when it\'s back in stock? Thank you!';
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
    });
    info.appendChild(waBtn);
    info.appendChild(notifyBtn);

  } else if (isPreOrder) {
    // PRE-ORDER state
    waBtn.className = 'card-wa-cta preorder';
    waBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Pre-Order on WhatsApp';
    waBtn.addEventListener('click', function(e) {
      if (!selectedSize && item.sizes) {
        e.preventDefault();
        alert('Please select a size first!');
        return;
      }
      var msg = 'Hi! \uD83D\uDC4B\n\nI\'d like to Pre-Order:\n*' + item.name + '*' +
        (selectedSize ? ' in size *' + selectedSize + '*' : '') +
        '\nFabric: ' + (item.fabric || 'N/A') +
        '\nPrice: ' + item.price +
        '\n\nPlease confirm availability and expected delivery date. Thank you!';
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
    });
    info.appendChild(waBtn);

  } else {
    // NORMAL state — in stock
    waBtn.className = 'card-wa-cta';
    waBtn.appendChild(createSVG(WA_ICON_PATH, '16'));
    waBtn.appendChild(document.createTextNode(' Order on WhatsApp'));
    waBtn.addEventListener('click', handleOrder);
    info.appendChild(waBtn);
  }

  // ===== ADD TO CART BUTTON =====
  if (!isOOS && /\d/.test(item.price)) {
    var addToCartBtn = document.createElement('button');
    addToCartBtn.type = 'button';
    addToCartBtn.className = 'card-add-to-cart';
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // If product has no sizes, use "Free Size"
      var cartSize = selectedSize || (item.sizes ? '' : 'Free Size');
      var productData = {
        name: item.name,
        price: item.price,
        size: cartSize,
        image: item.photo || '',
        productId: item.name.toLowerCase().replace(/\s+/g, '-')
      };
      if (typeof handleAddToCart === 'function') {
        handleAddToCart(productData, addToCartBtn);
      }
    });
    info.appendChild(addToCartBtn);
  }

  // Share buttons row
  var shareRow = document.createElement('div');
  shareRow.className = 'card-share-row';

  // WhatsApp share
  var waShareBtn = document.createElement('button');
  waShareBtn.type = 'button';
  waShareBtn.className = 'share-btn share-wa';
  waShareBtn.setAttribute('aria-label', 'Share ' + item.name + ' on WhatsApp');
  waShareBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">' +
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    '</svg><span>Share</span>';

  waShareBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var msg =
      '\uD83C\uDF38 Hey! Check out this beautiful saree!\n\n' +
      '*' + item.name + '*\n' +
      (item.fabric   ? 'Fabric: '   + item.fabric   + '\n' : '') +
      (item.occasion ? 'Occasion: ' + item.occasion + '\n' : '') +
      'Price: ' + item.price + '\n\n' +
      'Shop here: ' + SITE_URL + '\n' +
      '\u2014 Shared from ' + INSTAGRAM_HANDLE;
    showShareToast('wa', 'Opening WhatsApp...');
    setTimeout(function() {
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    }, 400);
  });

  // Instagram share
  var igShareBtn = document.createElement('button');
  igShareBtn.type = 'button';
  igShareBtn.className = 'share-btn share-ig';
  igShareBtn.setAttribute('aria-label', 'Share ' + item.name + ' on Instagram');
  igShareBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">' +
    '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>' +
    '</svg><span>Share</span>';

  igShareBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var caption =
      '\uD83C\uDF38 Check out this from ' + INSTAGRAM_HANDLE + '!\n\n' +
      '\u2728 ' + item.name + '\n' +
      (item.fabric   ? '\uD83E\uDDF5 Fabric: '   + item.fabric   + '\n' : '') +
      (item.occasion ? '\uD83C\uDF89 Occasion: ' + item.occasion + '\n' : '') +
      '\uD83D\uDCB0 Price: ' + item.price + '\n\n' +
      '\uD83D\uDED2 Shop: ' + SITE_URL + '\n\n' +
      '#KeralaFashion #KasavuSaree #TraditionalSaree #KeralaSaree #SettuMundu #WhatsAppShopping';
    openIgModal(caption);
  });

  shareRow.appendChild(waShareBtn);
  shareRow.appendChild(igShareBtn);
  info.appendChild(shareRow);

  // Delivery info strip
  if (DELIVERY_ITEMS.length > 0) {
    var deliveryStrip = document.createElement('div');
    deliveryStrip.className = 'card-delivery-strip';
    DELIVERY_ITEMS.forEach(function(d) {
      var deliveryItem = document.createElement('div');
      deliveryItem.className = 'card-delivery-item';
      deliveryItem.innerHTML = getDeliveryIcon(d.icon) +
        '<span>' + escapeHTML(d.text) + '</span>';
      deliveryStrip.appendChild(deliveryItem);
    });
    info.appendChild(deliveryStrip);
  }

  // Business hours or reply time
  var hoursStatus = getHoursStatus(BUSINESS_HOURS);
  if (hoursStatus) {
    var hoursEl = document.createElement('div');
    hoursEl.className = 'card-hours-status';
    var dot = document.createElement('span');
    dot.className = 'hours-dot ' + (hoursStatus.open ? 'open' : 'closed');
    var txt = document.createElement('span');
    txt.className = 'hours-text ' + (hoursStatus.open ? 'open' : 'closed');
    txt.textContent = hoursStatus.text;
    hoursEl.appendChild(dot);
    hoursEl.appendChild(txt);
    info.appendChild(hoursEl);
  } else {
    var replyTime = document.createElement('p');
    replyTime.className = 'card-reply-time';
    replyTime.textContent = 'We usually reply within 5 minutes';
    info.appendChild(replyTime);
  }

  card.appendChild(info);
  grid.appendChild(card);
    });
  })
  .catch(function(err) {
    console.error('Failed to load products:', err);
    grid.innerHTML = '<p style="text-align:center;color:#888;">Unable to load products. Please refresh the page.</p>';
  });


// ===== 1B. LOAD BRAND PHOTO & JOURNAL =====
fetch('data/site.json')
  .then(function(res) { return res.json(); })
  .then(function(site) {
    // Countdown timer
    if (site.countdown_enabled && site.countdown_date) {
      var target = new Date(site.countdown_date).getTime();
      var label = site.countdown_label || 'Sale ends in';
      var annoText = document.querySelector('.announcement-text');
      if (annoText) {
        var cdSpan = document.createElement('span');
        cdSpan.className = 'countdown-timer';
        cdSpan.innerHTML = ' &nbsp;\u00B7&nbsp; ' + escapeHTML(label) + ' <span class="cd-digits"></span>';
        annoText.appendChild(cdSpan);
        var digitsEl = cdSpan.querySelector('.cd-digits');

        function updateCountdown() {
          var now = Date.now();
          var diff = target - now;
          if (diff <= 0) {
            cdSpan.style.display = 'none';
            clearInterval(cdInterval);
            return;
          }
          var d = Math.floor(diff / 86400000);
          var h = Math.floor((diff % 86400000) / 3600000);
          var m = Math.floor((diff % 3600000) / 60000);
          var s = Math.floor((diff % 60000) / 1000);
          digitsEl.innerHTML =
            '<span class="cd-unit"><b>' + d + '</b>d</span> ' +
            '<span class="cd-unit"><b>' + String(h).padStart(2, '0') + '</b>h</span> ' +
            '<span class="cd-unit"><b>' + String(m).padStart(2, '0') + '</b>m</span> ' +
            '<span class="cd-unit"><b>' + String(s).padStart(2, '0') + '</b>s</span>';
        }
        updateCountdown();
        var cdInterval = setInterval(updateCountdown, 1000);
      }
    }

    // Brand photo
    if (site.brand_photo) {
      var box = document.getElementById('brand-photo-box');
      if (box) {
        box.innerHTML = '';
        var img = document.createElement('img');
        img.src = site.brand_photo;
        img.alt = 'Brand';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:16px;';
        box.appendChild(img);
      }
    }

    // Hero background image
    if (site.hero_image) {
      var heroBg = document.getElementById('hero-bg-image');
      if (heroBg) {
        var img = document.createElement('img');
        img.src = site.hero_image;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        heroBg.appendChild(img);
      }
    }

    // Journal / Instagram posts
    if (site.journal && site.journal.length > 0) {
      var journalGrid = document.getElementById('journal-grid');
      if (journalGrid) {
        journalGrid.innerHTML = '';
        site.journal.forEach(function(post) {
          var img = document.createElement('img');
          img.src = post.image;
          img.alt = 'Instagram post';
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:8px;';
          journalGrid.appendChild(img);
        });
      }
    }

    // Scrolling marquee
    if (site.marquee_items && site.marquee_items.length > 0) {
      var track = document.getElementById('marquee-track');
      if (track) {
        track.innerHTML = '';
        // Duplicate items twice for seamless loop
        for (var r = 0; r < 2; r++) {
          site.marquee_items.forEach(function(item) {
            var span = document.createElement('span');
            span.textContent = item.text;
            track.appendChild(span);
            var dot = document.createElement('span');
            dot.className = 'dot';
            dot.textContent = '\u2726';
            track.appendChild(dot);
          });
        }
      }
    }

    // Footer collection links
    if (site.footer_collections && site.footer_collections.length > 0) {
      var footerDiv = document.getElementById('footer-collections');
      if (footerDiv) {
        footerDiv.innerHTML = '<h4>Collections</h4>';
        site.footer_collections.forEach(function(col) {
          var a = document.createElement('a');
          a.href = '#collections';
          a.textContent = col.name;
          footerDiv.appendChild(a);
        });
      }
    }

    if (site.site_url) { SITE_URL = site.site_url; }
    if (site.instagram_handle) { INSTAGRAM_HANDLE = site.instagram_handle; }

    // Trust badges strip
    var trustStrip = document.getElementById('trust-badges-strip');
    var trustRow   = document.getElementById('trust-badges-row');
    if (site.trust_badges && site.trust_badges.length > 0 && trustStrip) {
      trustStrip.style.display = 'block';
      site.trust_badges.forEach(function(badge) {
        var pill = document.createElement('div');
        pill.className = 'trust-badge';
        pill.innerHTML = getTrustIcon(badge.icon) +
          '<span>' + escapeHTML(badge.text) + '</span>';
        trustRow.appendChild(pill);
      });
    }

    // Brand story video section
    var videoSection = document.getElementById('video-section');
    if (site.video_enabled && site.video_url && videoSection) {
      videoSection.style.display = 'block';

      // Heading and subtext
      var videoHeading = document.getElementById('video-heading');
      if (videoHeading && site.video_heading) {
        videoHeading.textContent = site.video_heading;
      }
      var videoSubtext = document.getElementById('video-subtext');
      if (videoSubtext && site.video_subtext) {
        videoSubtext.textContent = site.video_subtext;
      }
      // Also update the section-label eyebrow
      var videoLabel = videoSection.querySelector('.section-label');
      if (videoLabel && site.video_heading) {
        videoLabel.textContent = site.video_heading;
      }

      var embedWrap = document.getElementById('video-embed-wrap');
      var url = site.video_url.trim();

      // Detect YouTube
      var ytMatch =
        url.match(/youtube\.com\/watch\?v=([\w-]+)/) ||
        url.match(/youtu\.be\/([\w-]+)/) ||
        url.match(/youtube\.com\/embed\/([\w-]+)/);

      // Detect Instagram
      var igMatch =
        url.match(/instagram\.com\/reel\/([\w-]+)/) ||
        url.match(/instagram\.com\/p\/([\w-]+)/);

      if (ytMatch && ytMatch[1]) {
        // YouTube — full responsive embed
        var ytId = ytMatch[1];
        var container = document.createElement('div');
        container.className = 'video-iframe-container';
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + ytId +
          '?rel=0&modestbranding=1&playsinline=1';
        iframe.title = site.video_heading || 'Brand Story Video';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        container.appendChild(iframe);
        embedWrap.appendChild(container);

      } else if (igMatch) {
        // Instagram Reel — click-through card
        var igCard = document.createElement('div');
        igCard.className = 'video-ig-card';

        var igThumb = document.createElement('div');
        igThumb.className = 'video-ig-thumb';
        igThumb.innerHTML =
          '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">' +
          '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>' +
          '</svg>' +
          '<span>Instagram Reel</span>';

        var igBody = document.createElement('div');
        igBody.className = 'video-ig-body';

        var igText = document.createElement('p');
        igText.textContent = site.video_subtext ||
          'Watch our brand story on Instagram.';
        igBody.appendChild(igText);

        var igBtn = document.createElement('a');
        igBtn.className = 'video-ig-btn';
        igBtn.href = url;
        igBtn.target = '_blank';
        igBtn.rel = 'noopener';
        igBtn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">' +
          '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>' +
          '</svg> Watch on Instagram';
        igBody.appendChild(igBtn);

        igCard.appendChild(igThumb);
        igCard.appendChild(igBody);
        embedWrap.appendChild(igCard);

      } else {
        // Unrecognised URL — show a simple link card
        var linkCard = document.createElement('div');
        linkCard.className = 'video-ig-card';
        var linkBody = document.createElement('div');
        linkBody.className = 'video-ig-body';
        var linkText = document.createElement('p');
        linkText.textContent = 'Watch our brand story video.';
        var linkBtn = document.createElement('a');
        linkBtn.className = 'video-ig-btn';
        linkBtn.href = url;
        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener';
        linkBtn.textContent = 'Watch Video';
        linkBody.appendChild(linkText);
        linkBody.appendChild(linkBtn);
        linkCard.appendChild(linkBody);
        embedWrap.appendChild(linkCard);
      }
    }

    // Catalogue section
    var catalogueSection = document.getElementById('catalogue-section');
    if (site.catalogue_enabled && catalogueSection) {
      catalogueSection.style.display = 'block';

      var catHeading = document.getElementById('catalogue-heading');
      if (catHeading && site.catalogue_heading) {
        catHeading.textContent = site.catalogue_heading;
      }

      var catSubtext = document.getElementById('catalogue-subtext');
      if (catSubtext && site.catalogue_subtext) {
        catSubtext.textContent = site.catalogue_subtext;
      }

      var catBtn     = document.getElementById('catalogue-wa-btn');
      var catBtnText = document.getElementById('catalogue-btn-text');
      var catNote    = document.getElementById('catalogue-note');
      var catLabel   = document.getElementById('catalogue-mode-label');
      var catPhone   = WHATSAPP_NUMBER.replace(/[^\d]/g, '');

      if (site.catalogue_mode === 'whatsapp_business') {
        catBtn.href = 'https://wa.me/c/' + catPhone;
        if (catBtnText) catBtnText.textContent = 'Open Our WhatsApp Catalogue';
        if (catNote)    catNote.textContent    = 'Browse · Order · Instant';
        if (catLabel)   catLabel.textContent   = 'WhatsApp Business Catalogue';
      } else {
        var catMsg = site.catalogue_message ||
          'Hi! I\'d like to receive your full saree catalogue. Please send it to me. Thank you!';
        catBtn.href = 'https://wa.me/' + catPhone + '?text=' + encodeURIComponent(catMsg);
        if (catBtnText) catBtnText.textContent = 'Get Catalogue on WhatsApp';
        if (catNote)    catNote.textContent    = 'Free · Instant · No spam';
        if (catLabel)   catLabel.textContent   = 'Manual Catalogue';
      }
    }

    if (site.delivery_items && site.delivery_items.length > 0) {
      DELIVERY_ITEMS = site.delivery_items;
    }
    if (site.hours_enabled) { BUSINESS_HOURS = site; }
  })
  .catch(function(err) {
    console.error('Failed to load site settings:', err);
  });


// ===== 2. ANNOUNCEMENT BAR =====
const announcementBar = document.getElementById('announcement-bar');
const announcementClose = document.getElementById('announcement-close');

if (announcementClose) {
  announcementClose.addEventListener('click', function() {
    announcementBar.classList.add('dismissed');
    document.body.classList.remove('has-announcement');
  });
}

// Set body class for navbar offset
if (announcementBar && !announcementBar.classList.contains('dismissed')) {
  document.body.classList.add('has-announcement');
}


// ===== 3. NAVBAR + BACK-TO-TOP on scroll =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');
let ticking = false;

window.addEventListener('scroll', function() {
  if (!ticking) {
    requestAnimationFrame(function() {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 60);
      backToTop.classList.toggle('visible', y > 500);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===== 4. HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Close menu');
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open menu');
}

hamburger.addEventListener('click', function() {
  if (hamburger.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    closeMenu();
    hamburger.focus();
  });
});

document.addEventListener('click', function(e) {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    closeMenu();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
    hamburger.focus();
  }
});

navLinks.addEventListener('keydown', function(e) {
  if (e.key !== 'Tab' || !navLinks.classList.contains('open')) return;
  var focusable = navLinks.querySelectorAll('a');
  var first = focusable[0];
  var last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    hamburger.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    hamburger.focus();
  }
});


// ===== 5. CONTACT FORM → WHATSAPP =====
const contactForm = document.getElementById('contact-form');
const submitBtn = contactForm.querySelector('button[type="submit"]');
const originalBtnText = submitBtn.textContent;

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  var name    = document.getElementById('name').value.trim();
  var phone   = document.getElementById('phone').value.trim();
  var message = document.getElementById('message').value.trim();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Opening WhatsApp...';

  var text = 'Hi! \u{1F44B}\n\nI visited your website and would like to enquire.\n\nName: ' + name + '\nPhone: ' + phone + '\nMessage: ' + message;
  var url  = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);

  window.open(url, '_blank');

  setTimeout(function() {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    contactForm.reset();
  }, 2000);
});


// ===== 6. ACTIVE NAV HIGHLIGHT ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const allLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var id = entry.target.getAttribute('id');
      allLinks.forEach(function(link) {
        var isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('nav-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }
  });
}, { rootMargin: '-35% 0px -60% 0px' });

sections.forEach(function(s) { navObserver.observe(s); });


// ===== 7. SCROLL REVEAL ANIMATIONS =====
// Standard fade-up reveals
var revealElements = document.querySelectorAll('.reveal, .section-header, .testimonial-card, .step-item, .feature-item, .review-inner');

// Directional reveals for visual variety
var revealLeft = document.querySelectorAll('.about-text, .insta-cta-text, .contact-form');
var revealRight = document.querySelectorAll('.about-visual, .insta-cta-grid, .contact-info');

var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

revealElements.forEach(function(el) {
  el.classList.add('reveal-target');
  revealObserver.observe(el);
});

revealLeft.forEach(function(el) {
  el.classList.add('reveal-target', 'reveal-left');
  revealObserver.observe(el);
});

revealRight.forEach(function(el) {
  el.classList.add('reveal-target', 'reveal-right');
  revealObserver.observe(el);
});


// ===== 8. REVIEW FORM — Star Rating + WhatsApp Submit =====
var starRating = document.getElementById('star-rating');
var ratingInput = document.getElementById('review-rating');
var stars = starRating ? starRating.querySelectorAll('.star') : [];
var currentRating = 5;

// Set initial state (all 5 stars active)
stars.forEach(function(star) {
  star.classList.add('active');
});

// Click to set rating
stars.forEach(function(star) {
  star.addEventListener('click', function() {
    currentRating = parseInt(this.getAttribute('data-value'));
    ratingInput.value = currentRating;
    updateStars(currentRating);
  });

  // Hover preview
  star.addEventListener('mouseenter', function() {
    var val = parseInt(this.getAttribute('data-value'));
    stars.forEach(function(s) {
      s.classList.toggle('hover', parseInt(s.getAttribute('data-value')) <= val);
    });
  });

  star.addEventListener('mouseleave', function() {
    stars.forEach(function(s) {
      s.classList.remove('hover');
    });
  });
});

function updateStars(rating) {
  stars.forEach(function(s) {
    s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= rating);
  });
}

// Review form submit
var reviewForm = document.getElementById('review-form');
if (reviewForm) {
  var reviewSubmitBtn = reviewForm.querySelector('button[type="submit"]');
  var originalReviewBtnText = reviewSubmitBtn.textContent;

  reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var name   = document.getElementById('review-name').value.trim();
    var city   = document.getElementById('review-city').value.trim();
    var rating = ratingInput.value;
    var review = document.getElementById('review-text').value.trim();

    var starText = '';
    for (var i = 0; i < parseInt(rating); i++) { starText += '\u2B50'; }

    reviewSubmitBtn.disabled = true;
    reviewSubmitBtn.textContent = 'Opening WhatsApp...';

    var text = 'Hi! \u{1F44B}\n\nI\'d like to share my review:\n\n' +
      'Name: ' + name + '\n' +
      'City: ' + city + '\n' +
      'Rating: ' + starText + ' (' + rating + '/5)\n' +
      'Review: ' + review;

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank');

    setTimeout(function() {
      reviewSubmitBtn.disabled = false;
      reviewSubmitBtn.textContent = originalReviewBtnText;
    }, 2000);
  });
}


// ===== 9. SIZE GUIDE MODAL =====
if (SHOW_SIZE_GUIDE) {
  var sgOverlay = document.getElementById('size-guide-overlay');
  var sgClose = document.getElementById('size-guide-close');

  // Close button
  sgClose.addEventListener('click', function() {
    sgOverlay.classList.remove('active');
  });

  // Click outside modal to close
  sgOverlay.addEventListener('click', function(e) {
    if (e.target === sgOverlay) sgOverlay.classList.remove('active');
  });

  // Escape key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sgOverlay.classList.contains('active')) {
      sgOverlay.classList.remove('active');
    }
  });

  // Tab switching
  var sgTabs = document.querySelectorAll('.sg-tab');
  sgTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      sgTabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.sg-tab-content').forEach(function(c) { c.classList.remove('active'); });
      document.getElementById('sg-tab-' + tab.getAttribute('data-sg-tab')).classList.add('active');
    });
  });
}
