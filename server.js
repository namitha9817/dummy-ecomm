// ============================================================
// NEXCARDS — Express API Server
// Proxies Reloadly Gift Cards API (keeps secrets server-side)
// ============================================================

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const axios   = require('axios');
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));   // serve frontend

// ── Reloadly config ────────────────────────────────────────
const CLIENT_ID     = process.env.RELOADLY_CLIENT_ID     || 'VJ3Qfdq6lStoPOgHJHDlpPnMOz3BrifR';
const CLIENT_SECRET = process.env.RELOADLY_CLIENT_SECRET || 'RUnIHloFcY-Edlouv46gbukJVxw7xn-QFwej3gFBUKyBmfVC7lcUd1zUJSDUrU7';
const SANDBOX       = process.env.RELOADLY_SANDBOX !== 'false';   // default = sandbox

const AUTH_URL = 'https://auth.reloadly.com/oauth/token';
const BASE_URL = SANDBOX
  ? 'https://giftcards-sandbox.reloadly.com'
  : 'https://giftcards.reloadly.com';

console.log(`\n🔧 Mode : ${SANDBOX ? '🧪 Sandbox' : '🔴 Production'}`);
console.log(`🔗 Base : ${BASE_URL}\n`);

// ── Token cache ─────────────────────────────────────────────
let tokenCache = { value: null, expiresAt: 0 };

async function getToken() {
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
  }
  console.log('🔑 Fetching new Reloadly access token…');
  const { data } = await axios.post(AUTH_URL, {
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type:    'client_credentials',
    audience:      BASE_URL
  });
  tokenCache.value     = data.access_token;
  tokenCache.expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  console.log('✅ Token acquired, expires in', data.expires_in, 's');
  return tokenCache.value;
}

function rlHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/com.reloadly.giftcards-v1+json'
  };
}

// ── Airtime / Topup API ──────────────────────────────────────
const AIRTIME_BASE = SANDBOX
  ? 'https://topups-sandbox.reloadly.com'
  : 'https://topups.reloadly.com';

let airtimeTokenCache = { value: null, expiresAt: 0 };

async function getAirtimeToken() {
  if (airtimeTokenCache.value && Date.now() < airtimeTokenCache.expiresAt) {
    return airtimeTokenCache.value;
  }
  console.log('🔑 Fetching Airtime access token…');
  const { data } = await axios.post(AUTH_URL, {
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type:    'client_credentials',
    audience:      AIRTIME_BASE
  });
  airtimeTokenCache.value     = data.access_token;
  airtimeTokenCache.expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  console.log('✅ Airtime token acquired');
  return airtimeTokenCache.value;
}

function atHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/com.reloadly.topups-v1+json'
  };
}

// ── Error helper ────────────────────────────────────────────
function handleError(res, err, label) {
  const msg  = err.response?.data?.message || err.response?.data || err.message;
  const code = err.response?.status || 500;
  console.error(`❌ [${label}]`, msg);
  res.status(code).json({ error: msg });
}

// ============================================================
// ROUTES
// ============================================================

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', sandbox: SANDBOX, timestamp: new Date().toISOString() });
});

// ── Account balance ─────────────────────────────────────────
app.get('/api/account/balance', async (req, res) => {
  try {
    const token    = await getToken();
    const { data } = await axios.get(`${BASE_URL}/accounts/balance`, { headers: rlHeaders(token) });
    res.json(data);
  } catch (err) { handleError(res, err, 'balance'); }
});

// ── List gift card products ──────────────────────────────────
// Query params: countryCode, page, size, categoryName, productName
app.get('/api/giftcards/products', async (req, res) => {
  try {
    const token = await getToken();
    const params = {
      countryCode:  req.query.countryCode  || 'AE',
      page:         req.query.page         || 1,
      size:         req.query.size         || 20,
    };
    if (req.query.categoryName) params.categoryName = req.query.categoryName;
    if (req.query.productName)  params.productName  = req.query.productName;

    const { data } = await axios.get(`${BASE_URL}/products`, {
      headers: rlHeaders(token),
      params
    });
    res.json(data);
  } catch (err) { handleError(res, err, 'products'); }
});

// ── Single product detail ────────────────────────────────────
app.get('/api/giftcards/products/:id', async (req, res) => {
  try {
    const token    = await getToken();
    const { data } = await axios.get(`${BASE_URL}/products/${req.params.id}`, {
      headers: rlHeaders(token)
    });
    res.json(data);
  } catch (err) { handleError(res, err, 'product-detail'); }
});

// ── Product categories ───────────────────────────────────────
app.get('/api/giftcards/categories', async (req, res) => {
  try {
    const token    = await getToken();
    const { data } = await axios.get(`${BASE_URL}/product-categories`, {
      headers: rlHeaders(token)
    });
    res.json(data);
  } catch (err) { handleError(res, err, 'categories'); }
});

// ── Place an order ───────────────────────────────────────────
// Body: { productId, quantity, unitPrice, recipientEmail, senderName, customIdentifier }
app.post('/api/giftcards/order', async (req, res) => {
  try {
    const token = await getToken();
    const payload = {
      productId:        req.body.productId,
      quantity:         req.body.quantity         || 1,
      unitPrice:        req.body.unitPrice,
      customIdentifier: req.body.customIdentifier || `nexcards-${Date.now()}`,
      senderName:       req.body.senderName        || 'Souksnap Customer',
      recipientEmail:   req.body.recipientEmail,
      recipientPhoneDetails: req.body.recipientPhoneDetails || {
        countryCode: 'AE',
        phoneNumber: '501234567'
      }
    };
    console.log('📦 Placing order:', JSON.stringify(payload, null, 2));
    const { data } = await axios.post(`${BASE_URL}/orders`, payload, {
      headers: { ...rlHeaders(token), 'Content-Type': 'application/json' }
    });
    console.log('✅ Order placed, transactionId:', data.transactionId);
    res.json(data);
  } catch (err) { handleError(res, err, 'order'); }
});

// ── Order status ─────────────────────────────────────────────
app.get('/api/giftcards/orders/:transactionId', async (req, res) => {
  try {
    const token    = await getToken();
    const { data } = await axios.get(
      `${BASE_URL}/orders/transactions/${req.params.transactionId}`,
      { headers: rlHeaders(token) }
    );
    res.json(data);
  } catch (err) { handleError(res, err, 'order-status'); }
});

// ── Redeem code lookup ───────────────────────────────────────
app.get('/api/giftcards/redeem/:transactionId', async (req, res) => {
  try {
    const token    = await getToken();
    const { data } = await axios.get(
      `${BASE_URL}/orders/transactions/${req.params.transactionId}/cards`,
      { headers: rlHeaders(token) }
    );
    res.json(data);
  } catch (err) { handleError(res, err, 'redeem'); }
});

// ── Gift card order history ───────────────────────────────────
app.get('/api/giftcards/transactions', async (req, res) => {
  try {
    const token    = await getToken();
    const { data } = await axios.get(`${BASE_URL}/reports/transactions`, {
      headers: rlHeaders(token),
      params: { page: req.query.page || 1, size: req.query.size || 20 }
    });
    res.json(data);
  } catch (err) {
    // Sandbox may not expose this endpoint — return empty list gracefully
    console.warn('GC transactions not available:', err.response?.status);
    res.json({ content: [], totalElements: 0 });
  }
});

// ============================================================
// AIRTIME / MOBILE RECHARGE ROUTES
// ============================================================

// ── UAE operators ─────────────────────────────────────────────
app.get('/api/airtime/operators/:country', async (req, res) => {
  try {
    const token    = await getAirtimeToken();
    const { data } = await axios.get(
      `${AIRTIME_BASE}/operators/countries/${req.params.country.toUpperCase()}`,
      { headers: atHeaders(token) }
    );
    res.json(data);
  } catch (err) { handleError(res, err, 'airtime-operators'); }
});

// ── Auto-detect operator from phone number ────────────────────
// phone should be full international format e.g. 971501234567
app.get('/api/airtime/lookup/:phone', async (req, res) => {
  try {
    const token    = await getAirtimeToken();
    const { data } = await axios.get(
      `${AIRTIME_BASE}/operators/auto-detect/phone/${req.params.phone}/countries/AE`,
      { headers: atHeaders(token) }
    );
    res.json(data);
  } catch (err) { handleError(res, err, 'number-lookup'); }
});

// ── Place airtime top-up ──────────────────────────────────────
// Body: { operatorId, amount, useLocalAmount, recipientPhone, senderPhone }
app.post('/api/airtime/topup', async (req, res) => {
  try {
    const token = await getAirtimeToken();
    const payload = {
      operatorId:      req.body.operatorId,
      amount:          req.body.amount,
      useLocalAmount:  req.body.useLocalAmount !== false,   // default true (AED)
      customIdentifier: `nexcards-${Date.now()}`,
      recipientPhone: {
        countryCode: 'AE',
        number:      req.body.recipientPhone
      },
      senderPhone: {
        countryCode: 'AE',
        number:      req.body.senderPhone || req.body.recipientPhone
      }
    };
    console.log('📱 Top-up payload:', JSON.stringify(payload, null, 2));
    const { data } = await axios.post(`${AIRTIME_BASE}/topups`, payload, {
      headers: { ...atHeaders(token), 'Content-Type': 'application/json' }
    });
    console.log('✅ Top-up placed, transactionId:', data.transactionId);
    res.json(data);
  } catch (err) { handleError(res, err, 'airtime-topup'); }
});

// ── Airtime transaction history ───────────────────────────────
app.get('/api/airtime/transactions', async (req, res) => {
  try {
    const token    = await getAirtimeToken();
    const { data } = await axios.get(`${AIRTIME_BASE}/topups/reports/transactions`, {
      headers: atHeaders(token),
      params: { page: req.query.page || 1, size: req.query.size || 20 }
    });
    res.json(data);
  } catch (err) { handleError(res, err, 'airtime-transactions'); }
});

// ── Single airtime transaction ────────────────────────────────
app.get('/api/airtime/transactions/:id', async (req, res) => {
  try {
    const token    = await getAirtimeToken();
    const { data } = await axios.get(
      `${AIRTIME_BASE}/topups/reports/transactions/${req.params.id}`,
      { headers: atHeaders(token) }
    );
    res.json(data);
  } catch (err) { handleError(res, err, 'airtime-transaction-detail'); }
});

// ── Fallback: serve index.html for SPA ──────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Souksnap server → http://localhost:${PORT}`);
  console.log(`   Open the site at: http://localhost:${PORT}\n`);
});
