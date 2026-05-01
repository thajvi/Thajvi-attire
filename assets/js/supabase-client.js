// ============================================
//   THAJVI ATTIRE — Supabase Client
//   Database connection + Tier config
// ============================================

var SUPABASE_URL = 'https://kqrtyygwonozakvbiujv.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcnR5eWd3b25vemFrdmJpdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTc0ODUsImV4cCI6MjA5Mjg5MzQ4NX0.MarhU_IRvWuAro2XE0wLS9mZIBeR3aStQstOo43E5w8';

// Initialize Supabase client lazily (CDN may not be loaded yet)
var thajviSupabase = null;

function getOrInitSupabase() {
  if (thajviSupabase) return thajviSupabase;
  try {
    if (typeof window !== 'undefined' && window.supabase) {
      thajviSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      window.THAJVI_SUPABASE = thajviSupabase;
    }
  } catch (e) {
    console.log('Supabase init skipped:', e.message);
  }
  return thajviSupabase;
}

// ─────────────────────────────
// TIER CONFIG
// 1 = Starter (WhatsApp only)
// 2 = Growth (+ Supabase)
// 3 = Premium (+ Razorpay)
// ─────────────────────────────
var TIER_CONFIG = {
  tier: 2,
  features: {
    whatsappOrdering: true,
    basicCart: true,
    decapCMS: true,
    supabaseDatabase: true,
    orderDashboard: true,
    liveStockTracking: true,
    adminDashboard: true,
    revenueTracking: true,
    razorpayPayment: false,
    customerAccounts: false
  }
};

// Exports
window.THAJVI_SUPABASE = thajviSupabase;
window.THAJVI_TIER = TIER_CONFIG;
window.getOrInitSupabase = getOrInitSupabase;
