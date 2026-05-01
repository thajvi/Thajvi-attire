// ============================================
//   THAJVI ATTIRE — Supabase Orders
//   Save & manage orders in database
// ============================================

(function() {
  'use strict';

  function getSupabase() {
    if (window.getOrInitSupabase) return window.getOrInitSupabase();
    return window.THAJVI_SUPABASE;
  }

  function isEnabled() {
    return window.THAJVI_TIER && window.THAJVI_TIER.features.supabaseDatabase && getSupabase();
  }

  // ===== SAVE ORDER =====
  window.saveOrderToSupabase = function(order) {
    if (!isEnabled()) {
      return Promise.resolve({ success: false, reason: 'disabled' });
    }

    var sb = getSupabase();

    // Step 1: Insert order
    return sb.from('orders').insert({
      order_id: order.orderId,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_email: order.customer.email || '',
      address_line1: order.customer.address.line1,
      address_line2: order.customer.address.line2 || '',
      city: order.customer.address.city,
      state: order.customer.address.state,
      pincode: order.customer.address.pincode,
      delivery_instructions: order.customer.instructions || '',
      subtotal: order.pricing.subtotal,
      shipping: order.pricing.shipping,
      cod_charge: order.codCharge || 0,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus || 'pending',
      shipping_status: 'pending',
      source: 'website'
    })
    .then(function(res) {
      if (res.error) throw res.error;

      // Step 2: Insert order items
      var items = [];
      for (var i = 0; i < order.items.length; i++) {
        var it = order.items[i];
        items.push({
          order_id: order.orderId,
          sku: it.productId,
          product_name: it.name,
          size: it.size,
          quantity: it.quantity,
          unit_price: it.price,
          total_price: it.price * it.quantity
        });
      }

      return sb.from('order_items').insert(items);
    })
    .then(function(res) {
      if (res.error) throw res.error;
      return res;
    })
    .then(function() {
      console.log('Order saved to Supabase:', order.orderId);
      return { success: true, orderId: order.orderId };
    })
    .catch(function(err) {
      console.log('Supabase order save failed:', err.message || err);
      saveOrderBackup(order);
      return { success: false, error: err.message || 'Unknown error' };
    });
  };

  // ===== LOCAL BACKUP =====
  function saveOrderBackup(order) {
    try {
      var key = 'thajvi_orders_backup';
      var existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({
        order: order,
        savedAt: new Date().toISOString(),
        synced: false
      });
      localStorage.setItem(key, JSON.stringify(existing));
      console.log('Order backed up locally');
    } catch (e) { /* silent */ }
  }

  // ===== GET ALL ORDERS (admin) =====
  window.getAllOrdersFromSupabase = function(filters) {
    if (!isEnabled()) return Promise.resolve([]);

    var sb = getSupabase();
    var query = sb.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });

    if (filters) {
      if (filters.payment_status) query = query.eq('payment_status', filters.payment_status);
      if (filters.payment_method) query = query.eq('payment_method', filters.payment_method);
      if (filters.shipping_status) query = query.eq('shipping_status', filters.shipping_status);
      if (filters.today) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
      }
      if (filters.week) {
        var weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      }
      if (filters.search) {
        query = query.or('customer_name.ilike.%' + filters.search + '%,customer_phone.ilike.%' + filters.search + '%,order_id.ilike.%' + filters.search + '%');
      }
    }

    return query.then(function(res) {
      return res.error ? [] : (res.data || []);
    }).catch(function() { return []; });
  };

  // ===== UPDATE ORDER STATUS (admin) =====
  window.updateOrderInSupabase = function(orderId, updates) {
    if (!isEnabled()) return Promise.resolve({ success: false });
    updates.updated_at = new Date().toISOString();
    return getSupabase().from('orders').update(updates).eq('order_id', orderId)
      .then(function(res) { return res.error ? { success: false } : { success: true }; })
      .catch(function() { return { success: false }; });
  };

  // ===== GET REVENUE SUMMARY (admin) =====
  window.getRevenueSummary = function() {
    if (!isEnabled()) return Promise.resolve(null);
    return getSupabase().from('revenue_summary').select('*').single()
      .then(function(res) { return res.error ? null : res.data; })
      .catch(function() { return null; });
  };

})();
