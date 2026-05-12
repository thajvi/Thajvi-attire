const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};
  var orderId = body.razorpay_order_id;
  var paymentId = body.razorpay_payment_id;
  var signature = body.razorpay_signature;

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

  return res.status(200).json({ verified: true });
};
