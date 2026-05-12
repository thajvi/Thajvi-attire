const fs = require('fs');
const path = require('path');
const https = require('https');

// Duplicated from assets/js/checkout.js — keep in sync
// Strips non-numeric chars and returns a float (e.g. "₹1,299" → 1299)
function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  var num = String(priceStr).replace(/[^\d.]/g, '');
  return parseFloat(num) || 0;
}

function makeProductId(name) {
  return String(name).toLowerCase().replace(/\s+/g, '-');
}

function readJSON(filename) {
  // Try process.cwd() first (Vercel), fall back to relative from __dirname
  var primary = path.join(process.cwd(), 'data', filename);
  var fallback = path.join(__dirname, '..', 'data', filename);
  var filePath;
  try {
    fs.accessSync(primary);
    filePath = primary;
  } catch (e) {
    filePath = fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};

  // Reject legacy amount-only requests — clients must send items
  if (body.amount && !body.items) {
    return res.status(400).json({
      error: 'amount_without_items',
      message: 'Sending amount directly is no longer supported. Send items array instead.'
    });
  }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({
      error: 'missing_items',
      message: 'Request must include a non-empty items array: [{ productId, size, quantity }]'
    });
  }

  // Load products and site config
  var products, siteConfig;
  try {
    products = readJSON('products.json');
    siteConfig = readJSON('site.json');
  } catch (e) {
    return res.status(500).json({ error: 'config_read_error', message: 'Could not read product data' });
  }

  var productItems = products.items || [];
  // Shipping values from data/site.json
  var shippingCost = typeof siteConfig.shipping_cost === 'number' ? siteConfig.shipping_cost : 80;
  var freeThreshold = typeof siteConfig.free_shipping_threshold === 'number' ? siteConfig.free_shipping_threshold : 999;

  var subtotal = 0;
  var unavailable = [];

  for (var i = 0; i < body.items.length; i++) {
    var reqItem = body.items[i];
    if (!reqItem.productId || !reqItem.size || !reqItem.quantity) {
      return res.status(400).json({
        error: 'invalid_item',
        message: 'Each item must have productId, size, and quantity'
      });
    }

    var quantity = parseInt(reqItem.quantity, 10);
    if (isNaN(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({
        error: 'invalid_quantity',
        message: 'Quantity must be between 1 and 10 for item: ' + reqItem.productId
      });
    }

    // Find product by slug match
    var product = null;
    for (var j = 0; j < productItems.length; j++) {
      if (makeProductId(productItems[j].name) === reqItem.productId) {
        product = productItems[j];
        break;
      }
    }

    if (!product) {
      return res.status(400).json({
        error: 'product_not_found',
        message: 'Product not found: ' + reqItem.productId
      });
    }

    var price = parsePrice(product.price);
    if (price <= 0) {
      return res.status(400).json({
        error: 'invalid_price',
        message: 'Product has no valid price: ' + reqItem.productId
      });
    }

    // Stock check via products.json inventory
    if (product.inventory && product.inventory.sizes) {
      var stock = product.inventory.sizes[reqItem.size];
      if (stock === undefined || stock < quantity) {
        unavailable.push({
          id: reqItem.productId,
          size: reqItem.size,
          reason: stock === undefined ? 'invalid_size' : 'out_of_stock',
          available: stock || 0,
          requested: quantity
        });
      }
    }

    subtotal += price * quantity;
  }

  // Reject if any items are unavailable
  if (unavailable.length > 0) {
    return res.status(400).json({
      error: 'items_unavailable',
      items: unavailable
    });
  }

  // Apply shipping
  var shipping = subtotal >= freeThreshold ? 0 : shippingCost;
  var totalRupees = subtotal + shipping;
  var totalPaise = Math.round(totalRupees * 100);

  // Sanity check: ₹100 – ₹5,00,000
  if (totalPaise < 10000 || totalPaise > 50000000) {
    return res.status(400).json({
      error: 'amount_out_of_range',
      message: 'Total must be between ₹100 and ₹5,00,000. Computed: ₹' + totalRupees
    });
  }

  // Create Razorpay order
  var rzpKeyId = process.env.RAZORPAY_KEY_ID;
  var rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!rzpKeyId || !rzpKeySecret) {
    return res.status(500).json({ error: 'payment_not_configured', message: 'Razorpay keys not set' });
  }

  var orderPayload = JSON.stringify({
    amount: totalPaise,
    currency: 'INR',
    receipt: 'order_' + Date.now()
  });

  try {
    var rzpOrder = await createRazorpayOrder(orderPayload, rzpKeyId, rzpKeySecret);
    return res.status(200).json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency
    });
  } catch (e) {
    return res.status(500).json({
      error: 'razorpay_error',
      message: e.message || 'Failed to create Razorpay order'
    });
  }
};

function createRazorpayOrder(payload, keyId, keySecret) {
  return new Promise(function(resolve, reject) {
    var auth = Buffer.from(keyId + ':' + keySecret).toString('base64');
    var options = {
      hostname: 'api.razorpay.com',
      path: '/v1/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': 'Basic ' + auth
      }
    };

    var req = https.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try {
          var parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error ? parsed.error.description : 'Razorpay API error'));
          }
        } catch (e) {
          reject(new Error('Invalid response from Razorpay'));
        }
      });
    });

    req.on('error', function(e) { reject(e); });
    req.write(payload);
    req.end();
  });
}
