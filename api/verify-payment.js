const crypto = require('crypto');
const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};
  var orderId = body.razorpay_order_id;
  var paymentId = body.razorpay_payment_id;
  var signature = body.razorpay_signature;
  var items = body.items; // [{ productId, size, quantity }] — for stock reduction
  var clientOrderId = body.orderId; // e.g. "TH260513-ABC1" — for stock_warnings log

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({
      verified: false,
      reason: 'Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature'
    });
  }

  var secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return res.status(500).json({
      verified: false,
      reason: 'Payment verification not configured'
    });
  }

  // Razorpay signature = HMAC-SHA256(order_id + "|" + payment_id, key_secret)
  try {
    var expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    var expected = Buffer.from(expectedSignature);
    var received = Buffer.from(signature);

    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
      console.error('Razorpay signature mismatch — order_id:', orderId, 'payment_id:', paymentId);
      return res.status(400).json({
        verified: false,
        reason: 'Payment signature verification failed'
      });
    }
  } catch (e) {
    console.error('Signature verification error:', e.message);
    return res.status(400).json({
      verified: false,
      reason: 'Invalid signature format'
    });
  }

  // === SIGNATURE VERIFIED — now reduce stock in Supabase ===
  // Stock reduction is best-effort: payment is already confirmed, so never
  // fail the response even if stock update fails. Log warnings instead.
  var stockResults = [];

  if (items && Array.isArray(items) && items.length > 0) {
    var supabaseUrl = process.env.SUPABASE_URL || 'https://kqrtyygwonozakvbiujv.supabase.co';
    var supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseKey) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item.productId || !item.size || !item.quantity) continue;

        try {
          var rpcResult = await supabaseRpc(supabaseUrl, supabaseKey, 'reduce_stock', {
            p_sku: item.productId,
            p_size: item.size,
            p_quantity: item.quantity
          });

          if (rpcResult === false) {
            // Row missing or insufficient stock — log warning, don't fail payment
            await logStockWarning(supabaseUrl, supabaseKey, {
              order_id: clientOrderId || orderId,
              sku: item.productId,
              size: item.size,
              quantity: item.quantity,
              warning_type: 'insufficient_stock',
              details: 'reduce_stock returned false — row missing or stock < quantity'
            });
            stockResults.push({ sku: item.productId, size: item.size, reduced: false });
          } else {
            stockResults.push({ sku: item.productId, size: item.size, reduced: true });
          }
        } catch (err) {
          console.error('Stock reduction error for', item.productId, item.size, ':', err.message);
          await logStockWarning(supabaseUrl, supabaseKey, {
            order_id: clientOrderId || orderId,
            sku: item.productId,
            size: item.size,
            quantity: item.quantity,
            warning_type: 'supabase_error',
            details: err.message
          }).catch(function() {}); // don't fail if warning log fails
          stockResults.push({ sku: item.productId, size: item.size, reduced: false, error: err.message });
        }
      }
    } else {
      console.log('SUPABASE_SERVICE_KEY not set — skipping stock reduction');
    }
  }

  return res.status(200).json({ verified: true, stockResults: stockResults });
};

// Call a Supabase RPC function via REST API
function supabaseRpc(url, key, fnName, params) {
  return new Promise(function(resolve, reject) {
    var postData = JSON.stringify(params);
    var options = {
      hostname: url.replace('https://', ''),
      path: '/rest/v1/rpc/' + fnName,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Prefer': 'return=representation'
      }
    };

    var request = https.request(options, function(response) {
      var data = '';
      response.on('data', function(chunk) { data += chunk; });
      response.on('end', function() {
        if (response.statusCode >= 400) {
          reject(new Error('Supabase RPC error ' + response.statusCode + ': ' + data));
        } else {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data === 'true' ? true : data === 'false' ? false : data);
          }
        }
      });
    });
    request.on('error', reject);
    request.write(postData);
    request.end();
  });
}

// Log a stock warning to the stock_warnings table
function logStockWarning(url, key, warning) {
  return new Promise(function(resolve, reject) {
    var postData = JSON.stringify(warning);
    var options = {
      hostname: url.replace('https://', ''),
      path: '/rest/v1/stock_warnings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Prefer': 'return=minimal'
      }
    };

    var request = https.request(options, function(response) {
      var data = '';
      response.on('data', function(chunk) { data += chunk; });
      response.on('end', function() {
        if (response.statusCode >= 400) {
          reject(new Error('Warning log failed: ' + data));
        } else {
          resolve();
        }
      });
    });
    request.on('error', reject);
    request.write(postData);
    request.end();
  });
}
