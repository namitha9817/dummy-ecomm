// ============================================================
// SOUKSNAP — Main JavaScript
// ============================================================

// ── State ───────────────────────────────────────────────────
const state = {
  currentPage: 'home',
  cartItems: [],
  user: null,
  cartOpen: false,
  liveProducts: [],
  liveByCategory: {
    gaming:        [],
    entertainment: [],
    shopping:      [],
    crypto:        [],
    payment:       []
  },
  liveProductsLoaded: false,
  accountBalance: null,
  airtimeOperators: [],         // UAE mobile operators from Reloadly
  airtimeLoaded: false,
  orderHistory: []              // locally tracked orders this session
};

// ── Static fallback products ─────────────────────────────────
const products = [
  { id: 28, name: 'EA Sports FC 24 12000 FC Points',                                        price: 380,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/28/5213-NexCards.jpg' },
  { id: 29, name: 'EA Sports FC 24 5900 FC Points',                                         price: 200,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/29/6437-NexCards.jpg' },
  { id: 30, name: 'EA Sports FC 24 2800 FC Points',                                         price: 100,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/30/6586-NexCards.jpg' },
  { id: 31, name: 'EA Sports FC 24 Ultimate Edition',                                       price: 389,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/31/8171-NexCards.jpg' },
  { id: 32, name: 'EA Sports FC 24 Standard Edition',                                       price: 299,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/32/1987-NexCards.jpg' },
  { id: 33, name: 'EA Sports FC 24 Standard Edition',                                       price: 299,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/33/9430-NexCards.jpg' },
  { id: 34, name: "Senua's Saga: Hellblade II Xbox Series X|S",                             price: 199,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/34/7427-NexCards.jpg' },
  { id: 35, name: 'Minecraft Legends Deluxe Edition Xbox',                                  price: 199,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/35/8157-NexCards.jpg' },
  { id: 36, name: 'Minecraft Legends for Windows 10 PC',                                    price: 159,  category: 'digital',   img: 'https://souksnap.com/gift_card_images/36/7708-NexCards.jpg' },
  { id: 5,  name: "Thrill-Seeker's Paradise Jet Ski Adventures in Dubai",                   price: 1200, category: 'jetski',    img: 'https://souksnap.com/gift_card_images/5/4284-1.jpg' },
  { id: 6,  name: 'Jet Ski in Fujairah: A Unique Ride Along the Indian Ocean',              price: 600,  category: 'jetski',    img: 'https://souksnap.com/gift_card_images/6/3613-1.jpg' },
  { id: 7,  name: 'High-Speed Fun in Abu Dhabi Jet Skiing by Yas Island',                   price: 1500, category: 'jetski',    img: 'https://souksnap.com/gift_card_images/7/2412-1.jpg' },
  { id: 8,  name: "Explore Ras Al Khaimah's Scenic Coastline with a Jet Ski Tour",          price: 750,  category: 'jetski',    img: 'https://souksnap.com/gift_card_images/8/7702-1.jpg' },
  { id: 24, name: 'Authentic Tent Stay at Longbeach Campground',                            price: 550,  category: 'getaways',  img: 'https://souksnap.com/gift_card_images/24/8641-NexCards.jpg' },
  { id: 25, name: '5-Star Weekday Vacation Stay at Radisson Blu Fujairah',                  price: 750,  category: 'getaways',  img: 'https://souksnap.com/gift_card_images/25/4407-NexCards.jpg' },
  { id: 26, name: '5 Star Winter Stay at Al Bahar Hotel and Resort',                        price: 1050, category: 'getaways',  img: 'https://souksnap.com/gift_card_images/26/6362-NexCards.jpg' },
  { id: 27, name: '1-Night All Inclusive Stay at Danat Al Ain',                             price: 1350, category: 'getaways',  img: 'https://souksnap.com/gift_card_images/27/7436-NexCards.jpg' },
  { id: 15, name: 'Massage + Spa Week Offer',                                               price: 750,  category: 'wellness',  img: 'https://souksnap.com/gift_card_images/15/9017-NexCards.jpg' },
  { id: 16, name: "Massage + Full Day Pass at Cleopatra's Spa",                             price: 850,  category: 'wellness',  img: 'https://souksnap.com/gift_card_images/16/8696-NexCards.jpg' },
  { id: 17, name: 'DoubleTree by Hilton JBR Luxury Massage',                                price: 600,  category: 'wellness',  img: 'https://souksnap.com/gift_card_images/17/8134-NexCards.jpg' },
  { id: 18, name: "All-Day Pass at Pharaoh's Club",                                         price: 200,  category: 'wellness',  img: 'https://souksnap.com/gift_card_images/18/7631-NexCards.jpg' },
  { id: 19, name: '5 Star Thai Relaxation Package at Sheraton Sharjah',                     price: 450,  category: 'wellness',  img: 'https://souksnap.com/gift_card_images/19/9007-NexCards.jpg' },
];

// ============================================================
// RELOADLY API LAYER
// ============================================================

const API_BASE = 'http://localhost:3001/api';

const api = {
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `HTTP ${res.status}`);
    }
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }
};

// Map a Reloadly product to NexCards's internal format
function mapReloadlyProduct(p) {
  // Prefer AED (recipient) denominations when currency is AED, else use sender
  const useRecipient = p.recipientCurrencyCode === 'AED' &&
                       p.fixedRecipientDenominations?.length;
  const denoms   = useRecipient
    ? p.fixedRecipientDenominations
    : (p.fixedSenderDenominations || []);
  const currency = useRecipient ? 'AED' : (p.senderCurrencyCode || 'USD');

  return {
    id:               p.productId,
    reloadlyId:       p.productId,
    name:             p.productName,
    price:            denoms[0] || 0,
    category:         'digital',
    img:              p.logoUrls?.[0] || 'https://placehold.co/200x200/f0f0f0/999?text=Gift+Card',
    denominations:    denoms,
    denominationType: p.denominationType,       // FIXED or RANGE
    minDenom:         p.minSenderDenomination,
    maxDenom:         p.maxSenderDenomination,
    currency,
    source:           'reloadly',
    brand:            p.brand?.brandName || '',
    categoryName:     p.category?.name  || ''
  };
}

// Fetch ALL live gift card products from Reloadly, grouped by category
async function fetchLiveProducts() {
  try {
    const data = await api.get('/giftcards/products?countryCode=AE&size=100&page=1');
    const all  = (data.content || []).map(mapReloadlyProduct);

    state.liveProducts = all;

    // Group by Reloadly category name
    state.liveByCategory = {
      gaming:        all.filter(p => p.categoryName === 'Gaming'),
      entertainment: all.filter(p => p.categoryName === 'Entertainment'),
      shopping:      all.filter(p => p.categoryName === 'Shopping'),
      crypto:        all.filter(p => p.categoryName === 'Crypto'),
      payment:       all.filter(p => p.categoryName === 'Payment Cards'),
    };

    state.liveProductsLoaded = true;
    console.log(`✅ Loaded ${all.length} Reloadly products`);
    console.log(`   Gaming: ${state.liveByCategory.gaming.length} | Entertainment: ${state.liveByCategory.entertainment.length} | Shopping: ${state.liveByCategory.shopping.length}`);

    if (state.currentPage === 'home')    updateAllHomeSections();
    if (state.currentPage === 'digital') renderDigital();

  } catch (err) {
    console.warn('⚠️  Live products unavailable, using static data:', err.message);
    state.liveProductsLoaded = true;
  }
}

// Fetch account balance (shown in order summary)
async function fetchBalance() {
  try {
    const data = await api.get('/account/balance');
    state.accountBalance = data;
    console.log('💰 Balance:', data.balance, data.currencyCode);
  } catch (err) {
    console.warn('⚠️  Balance fetch failed:', err.message);
  }
}

// Fetch UAE mobile operators for recharge section
async function fetchAirtimeOperators() {
  try {
    const data = await api.get('/airtime/operators/AE');
    state.airtimeOperators = data;
    state.airtimeLoaded    = true;
    console.log(`📱 Loaded ${data.length} UAE operators:`, data.map(o => o.name).join(', '));
    // Refresh recharge section if on home page
    if (state.currentPage === 'home') updateRechargeSection();
  } catch (err) {
    console.warn('⚠️  Airtime operators failed:', err.message);
    state.airtimeLoaded = true;
  }
}

// Lookup product in live OR static array
function findProduct(id) {
  const numId = Number(id);
  return state.liveProducts.find(p => p.id === numId)
      || products.find(p => p.id === numId)
      || null;
}

// Generic helper — patches a static grid + owl carousel with new products
function patchSection(staticGridId, mobCarouselId, prods, style) {
  const staticGrid  = document.getElementById(staticGridId);
  const mobCarousel = document.getElementById(mobCarouselId);
  if (!staticGrid && !mobCarousel) return;

  const isDigital = style === 'digital';

  const cardHTML = (p, i) => isDigital ? `
    <div class="digital_card digital_card--${(i % 4) + 1}">
      <a href="#" onclick="navigateTo('gift-detail',{productId:${p.id}});return false;">
        <figure>
          <img src="${p.img}" class="img-fluid" alt="${p.name}"
               onerror="this.src='https://placehold.co/160x160/f0f0f0/999?text=IMG'">
        </figure>
        <span>${p.name.substring(0, 22)}</span>
        ${p.source === 'reloadly' ? '<span class="rl-badge">Live</span>' : ''}
      </a>
    </div>` : `
    <div class="gift_card">
      <a href="#" onclick="navigateTo('gift-detail',{productId:${p.id}});return false;">
        <figure><img src="${p.img}" class="img-fluid" alt="${p.name}"
             onerror="this.src='https://placehold.co/300x220/e8f4f8/333?text=Product'"></figure>
        <div>${p.name.substring(0, 28)}</div>
        <div class="price">
          <span>${p.currency || 'AED'}</span> ${p.price}
          ${p.source === 'reloadly' ? '<span class="rl-badge" style="float:right;">Live</span>' : ''}
        </div>
      </a>
    </div>`;

  if (staticGrid) {
    staticGrid.innerHTML = prods.slice(0, 5).map((p, i) =>
      `<div class="col-lg">${cardHTML(p, i)}</div>`
    ).join('');
  }

  if (mobCarousel) {
    if (typeof $ !== 'undefined' && $(mobCarousel).data('owl.carousel')) {
      $(mobCarousel).trigger('destroy.owl.carousel');
    }
    mobCarousel.innerHTML = prods.map((p, i) =>
      `<div class="item">${cardHTML(p, i)}</div>`
    ).join('');
    if (typeof $ !== 'undefined' && $.fn.owlCarousel) {
      $(mobCarousel).owlCarousel(getMobOwlOpts());
    }
  }
}

// Update ALL home sections with live Reloadly products
function updateAllHomeSections() {
  const s = state.liveByCategory;

  // Digital Cards → all live products
  const digitalProds = state.liveProducts.length
    ? state.liveProducts
    : products.filter(p => p.category === 'digital');
  patchSection('digital-static-grid', 'digital-mob', digitalProds, 'digital');

  // Jet Ski, Deals → Gaming (fallback: static jetski)
  const jetskiProds = s.gaming.length
    ? s.gaming
    : products.filter(p => p.category === 'jetski');
  patchSection('jetski-static-grid', 'jet-mob', jetskiProds, 'gift');

  // Getaways → Shopping (fallback: static getaways)
  const getawayProds = s.shopping.length
    ? s.shopping
    : products.filter(p => p.category === 'getaways');
  patchSection('getaways-static-grid', 'getaways-mob', getawayProds, 'gift');

  // Tickets → Entertainment (fallback: static digital)
  const ticketProds = s.entertainment.length
    ? s.entertainment
    : products.filter(p => p.category === 'digital').slice(3);
  patchSection('tickets-static-grid', 'ticket-mob', ticketProds, 'gift');

  // Wellness → no Reloadly match, stays static (no patch needed)

  // Crypto → patch dedicated section
  const cryptoProds = s.crypto.length ? s.crypto : [];
  if (cryptoProds.length) patchSection('crypto-static-grid', 'crypto-mob', cryptoProds, 'gift');

  // Remove all loading spinners from the home page
  document.querySelectorAll('#main-content .rl-loading').forEach(el => el.remove());
}

// Patch just the recharge section when operators load
function updateRechargeSection() {
  const grid = document.getElementById('recharge-operators-grid');
  if (!grid || !state.airtimeOperators.length) return;
  grid.innerHTML = state.airtimeOperators.map(op => operatorCardHTML(op)).join('');
}

// Operator card HTML
function operatorCardHTML(op) {
  const minLocal = op.localFixedAmounts?.[0] || op.fixedAmounts?.[0] || '—';
  return `
    <div class="col-lg-4 col-md-4 col-sm-6">
      <div class="operator-card" onclick="navigateTo('recharge',{operatorId:${op.operatorId}})">
        <div class="operator-logo">
          <img src="${op.logoUrls?.[0] || ''}" alt="${op.name}"
               onerror="this.src='https://placehold.co/80x80/f0f0f0/999?text=📱'">
        </div>
        <div class="operator-name">${op.name.replace(' United Arab Emirates','').replace(' UAE','')}</div>
        <div class="operator-from">From AED ${minLocal}</div>
        <button class="operator-btn">Recharge Now</button>
      </div>
    </div>`;
}

// ── DOM Ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Restore session from localStorage — only if the account still exists
  const savedSession = LS.getSession();
  if (savedSession && savedSession.email && LS.findUser(savedSession.email)) {
    state.user = savedSession;
    state.orderHistory = LS.getOrders(savedSession.email);
  } else if (savedSession) {
    // Stale session (user deleted or old test data) — clear it
    LS.clearSession();
  }
  renderNav();
  navigateTo('home');
  updateCartBadge();
  setupCartDropdown();
  // Kick off Reloadly data fetch (non-blocking)
  fetchLiveProducts();
  fetchBalance();
  fetchAirtimeOperators();
});

// ============================================================
// NAVIGATION
// ============================================================

function navigateTo(page, data = {}) {
  state.currentPage = page;

  document.querySelectorAll('.nav-inner a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  const main = document.getElementById('main-content');
  main.innerHTML = '';

  const pages = {
    'home':          renderHome,
    'about':         renderAbout,
    'digital':       renderDigital,
    'gaming':        renderGaming,
    'shopping':      renderShopping,
    'crypto':        renderCrypto,
    'entertainment': renderEntertainment,
    'contact':       renderContact,
    'signin':        renderSignIn,
    'signup':        renderSignUp,
    'cart':          renderCart,
    'recharge':      () => renderMobileRecharge(data.operatorId),
    'orders':        renderOrderHistory,
    'gift-detail': () => {
      const product = data.productId !== undefined
        ? findProduct(data.productId)
        : data.product;
      renderGiftDetail(product);
    },
    'search':      () => renderSearch(data.query),
  };

  if (pages[page]) pages[page]();
  window.scrollTo(0, 0);
}

// ── Nav & Header ─────────────────────────────────────────────
function renderNav() {
  const navLinks = [
    { label: 'Home',          page: 'home' },
    { label: 'About Us',      page: 'about' },
    { label: 'Digital Card',  page: 'digital' },
    { label: 'Gaming',        page: 'gaming' },
    { label: 'Shopping',      page: 'shopping' },
    { label: 'Crypto',        page: 'crypto' },
    { label: 'Recharge',      page: 'recharge' },
    { label: 'Entertainment', page: 'entertainment' },
    { label: 'Contact Us',    page: 'contact' },
    { label: '📋 My Orders',  page: 'orders' },
  ];


  const rightLinks = [
    { label: 'Contact Us', page: 'contact' },
    ...(state.user ? [{ label: '📋 My Orders', page: 'orders' }] : []),
  ];

  const linkHTML = l =>
    `<a href="#" data-page="${l.page}" onclick="navigateTo('${l.page}');return false;">${l.label}</a>`;

  document.querySelector('.nav-inner').innerHTML =
    `<div class="nav-left">${leftLinks.map(linkHTML).join('')}</div>` +
    `<div class="nav-right">${rightLinks.map(linkHTML).join('')}</div>`;


  updateHeaderUser();
}

function updateHeaderUser() {
  const actions = document.getElementById('header-actions');
  if (!actions) return;

  if (state.user) {
    actions.innerHTML = `
      <span class="btn-user-name">Hi, ${state.user.name.toUpperCase()}</span>
      <button class="btn-logout" onclick="logout()">LOGOUT</button>
      <div class="cart-wrapper">
        <div class="cart-btn" onclick="toggleCart()">🛒
          <span class="cart-badge" id="cart-badge">${state.cartItems.length || ''}</span>
        </div>
        <div class="cart-dropdown hidden" id="cart-dropdown"></div>
      </div>`;
  } else {
    actions.innerHTML = `
      <button class="btn-signin" onclick="navigateTo('signin')">SIGN IN</button>
      <div class="cart-wrapper">
        <div class="cart-btn" onclick="toggleCart()">🛒
          <span class="cart-badge" id="cart-badge">${state.cartItems.length || ''}</span>
        </div>
        <div class="cart-dropdown hidden" id="cart-dropdown"></div>
      </div>`;
  }
}

function logout() {
  state.user = null;
  updateHeaderUser();
  showToast('Logged out successfully');
  navigateTo('home');
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = state.cartItems.length;
    badge.style.display = state.cartItems.length ? 'flex' : 'none';
  }
}

// ── Cart dropdown ─────────────────────────────────────────────
function setupCartDropdown() {
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('cart-dropdown');
    const wrapper  = e.target.closest('.cart-wrapper');
    if (!wrapper && dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
      state.cartOpen = false;
    }
  });
}

function toggleCart() {
  state.cartOpen = !state.cartOpen;
  renderCartDropdown();
}

function renderCartDropdown() {
  const dropdown = document.getElementById('cart-dropdown');
  if (!dropdown) return;
  if (!state.cartOpen) { dropdown.classList.add('hidden'); return; }

  dropdown.classList.remove('hidden');

  if (state.cartItems.length === 0) {
    dropdown.innerHTML = `<div style="padding:24px;text-align:center;color:#999;">Your cart is empty</div>`;
    return;
  }

  const total = state.cartItems.reduce((sum, i) => sum + i.price, 0);
  dropdown.innerHTML = `
    ${state.cartItems.map(item => `
      <div class="cart-dropdown-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/60x60/f0f0f0/999?text=IMG'">
        <div class="cart-dropdown-info">
          <div class="cart-dropdown-name">${item.name.substring(0, 35)}…</div>
          <div class="cart-dropdown-price">${item.currency || 'AED'} ${item.price.toFixed(2)}</div>
        </div>
        <span class="cart-remove-sm" onclick="removeFromCart(${item.id})">🗑️</span>
      </div>
    `).join('')}
    <div class="cart-dropdown-footer">
      <div class="cart-subtotal"><span>Sub Total</span><span>AED ${total.toFixed(2)}</span></div>
      <button class="btn-block" onclick="navigateTo('cart');state.cartOpen=false;document.getElementById('cart-dropdown').classList.add('hidden')">VIEW CART</button>
    </div>`;
}

function addToCart(product) {
  if (typeof product === 'string') {
    try { product = JSON.parse(product); } catch(e) {}
  }
  const exists = state.cartItems.find(i => i.id === product.id && i.price === product.price);
  if (!exists) state.cartItems.push(product);
  updateCartBadge();
  showToast(`${product.name.substring(0, 30)}… added to cart!`);
}

// Add product to cart using currently selected denomination
function addProductToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;

  let finalPrice = product.price;

  // 1. RANGE product — read the number input directly
  const customInput = document.getElementById('custom-amount');
  if (customInput && product.denominationType === 'RANGE') {
    const entered = parseFloat(customInput.value);
    if (!entered || entered <= 0) {
      showToast(`Please enter a valid amount (${product.currency || 'USD'} ${product.minDenom}–${product.maxDenom})`);
      customInput.focus();
      return;
    }
    if (product.minDenom && entered < product.minDenom) {
      showToast(`Minimum amount is ${product.currency || 'USD'} ${product.minDenom}`);
      customInput.focus();
      return;
    }
    if (product.maxDenom && entered > product.maxDenom) {
      showToast(`Maximum amount is ${product.currency || 'USD'} ${product.maxDenom}`);
      customInput.focus();
      return;
    }
    finalPrice = entered;
  }
  // 2. FIXED product — read the active denomination button
  else {
    const activeBtn = document.querySelector('.gd-value-btn.active');
    if (activeBtn) {
      finalPrice = parseFloat(activeBtn.dataset.value) || product.price;
    }
    // 3. Custom amount field visible (Other button selected)
    if (customInput) {
      const wrap = document.getElementById('custom-amount-wrap');
      if (wrap && wrap.style.display !== 'none') {
        const entered = parseFloat(customInput.value);
        if (entered > 0) finalPrice = entered;
      }
    }
  }

  addToCart({ ...product, price: finalPrice });
}

function removeFromCart(id) {
  state.cartItems = state.cartItems.filter(i => i.id !== id);
  updateCartBadge();
  renderCartDropdown();
  if (state.currentPage === 'cart') renderCart();
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type = '') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className   = `toast show ${type}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Search ────────────────────────────────────────────────────
function doSearch(query) {
  if (!query.trim()) return;
  navigateTo('search', { query: query.trim() });
}

// ── Product card HTML (for grid pages) ───────────────────────
function productCardHTML(p) {
  return `
    <div class="product-card" style="cursor:pointer;" onclick="navigateTo('gift-detail',{productId:${p.id}})">
      <img class="product-card-img" src="${p.img}" alt="${p.name}"
           onerror="this.src='https://placehold.co/200x200/f0f0f0/999?text=IMG'">
      <div class="product-card-body">
        ${p.source === 'reloadly' ? '<span class="rl-badge" style="margin-bottom:4px;display:inline-block;">Live</span>' : ''}
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-price"><span>AED</span> ${p.price}</div>
      </div>
    </div>`;
}

// ── Owl carousel options ──────────────────────────────────────
function getMobOwlOpts() {
  return {
    loop: true, margin: 16, nav: false, dots: true,
    autoplay: true, autoplayTimeout: 3500, autoplayHoverPause: true,
    responsive: { 0:{items:1}, 480:{items:2}, 576:{items:3}, 768:{items:4} }
  };
}

// ============================================================
// HOME PAGE
// ============================================================

function renderHome() {
  const main = document.getElementById('main-content');
  const s    = state.liveByCategory;

  // Each section uses live data if loaded, else static fallback
  const digitalCards = (state.liveProducts.length ? state.liveProducts : products.filter(p => p.category === 'digital')).slice(0, 5);
  const jetskiItems  = s.gaming.length        ? s.gaming        : products.filter(p => p.category === 'jetski');
  const getaways     = s.shopping.length      ? s.shopping      : products.filter(p => p.category === 'getaways');
  // wellness removed from homepage
  const tickets      = s.entertainment.length ? s.entertainment : products.filter(p => p.category === 'digital').slice(3);

  const giftCardHTML = (p, i) => `
    <div class="digital_card digital_card--${(i % 4) + 1}">
      <a href="#" onclick="navigateTo('gift-detail',{productId:${p.id}});return false;">
        <figure>
          <img src="${p.img}" class="img-fluid" alt="${p.name}"
               onerror="this.src='https://placehold.co/160x160/f0f0f0/999?text=IMG'">
        </figure>
        <span>${p.name.substring(0, 22)}</span>
        ${p.source === 'reloadly' ? '<span class="rl-badge">Live</span>' : ''}
      </a>
    </div>`;

  const giftRow = (p) => `
    <div class="gift_card">
      <a href="#" onclick="navigateTo('gift-detail',{productId:${p.id}});return false;">
        <figure><img src="${p.img}" class="img-fluid" alt="${p.name}"
             onerror="this.src='https://placehold.co/300x220/e8f4f8/333?text=Product'"></figure>
        <div>${p.name.substring(0, 28)}</div>
        <div class="price">
          <span>${p.currency || 'AED'}</span> ${p.price}
          ${p.source === 'reloadly' ? '<span class="rl-badge" style="float:right;margin-top:2px;">Live</span>' : ''}
        </div>
      </a>
    </div>`;

  main.innerHTML = `

    <!-- ── BANNER ─────────────────────────────────────── -->
    <section class="banner">
      <div id="bannerCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="container">
          <div class="carousel-inner">
            <div class="carousel-item">
              <div class="row align-items-center">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                  <div class="banner_text">
                    <div class="sub_head">Limited Discount</div>
                    <div class="banner_heading">Sell your vouchers in NexCards Market, register today!</div>
                    <a href="#" class="btn" onclick="navigateTo('digital');return false;">Shop Gift Card</a>
                  </div>
                </div>
                <div class="col-xl-5 col-lg-6 col-md-6 col-sm-6">
                  <div class="banner_img">
                    <img src="https://souksnap.com/images/banner.jpg" class="img-fluid" alt="Banner"
                         onerror="this.src='https://placehold.co/560x430/f84464/fff?text=NexCards'">
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-item active">
              <div class="row align-items-center">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                  <div class="banner_text">
                    <div class="sub_head">Limited Discount</div>
                    <div class="banner_heading">Purchase now and save big on your favorite</div>
                    <a href="#" class="btn" onclick="navigateTo('digital');return false;">Shop Gift Card</a>
                  </div>
                </div>
                <div class="col-xl-5 col-lg-6 col-md-6 col-sm-6">
                  <div class="banner_img">
                    <img src="https://souksnap.com/images/banner1.jpg" class="img-fluid" alt="Banner"
                         onerror="this.src='https://placehold.co/560x430/ffffff/333?text=Shop+%26+Save'">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- ── DIGITAL CARDS ─────────────────────────────── -->
    <section class="digital_bg">
      <div class="container">
        <div class="heading_main">
          <div class="heading">Digital <span>Card</span></div>
          ${!state.liveProductsLoaded ? '<div class="rl-loading"><span class="rl-spinner"></span> Loading live products…</div>' : ''}
        </div>
        <!-- Static grid — lg+ -->
        <div class="row g-3 justify-content-center d-none d-lg-flex" id="digital-static-grid">
          ${digitalCards.map((p, i) => `<div class="col-lg">${giftCardHTML(p, i)}</div>`).join('')}
        </div>
        <!-- Carousel — below lg -->
        <div class="d-lg-none">
          <div id="digital-mob" class="owl-carousel owl-theme">
            ${digitalCards.map((p, i) => `<div class="item">${giftCardHTML(p, i)}</div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- ── TRENDING ──────────────────────────────────── -->
    <section class="trending_bg">
      <div class="container">
        <div class="heading_main">
          <div class="heading">What's <span>Trending</span> Today</div>
        </div>
      </div>
    </section>

    <!-- ── JET SKI / GAMING ─────────────────────────── -->
    <section class="py-5">
      <div class="container">
        <div class="heading_main">
          <div class="heading mb-0">Gaming, <span>Deals</span></div>
          ${!state.liveProductsLoaded ? '<div class="rl-loading"><span class="rl-spinner"></span> Loading live products…</div>' : ''}
        </div>
        <div class="row g-4 d-none d-lg-flex" id="jetski-static-grid">
          ${jetskiItems.slice(0, 5).map(p => `<div class="col-lg">${giftRow(p)}</div>`).join('')}
        </div>
        <div class="d-lg-none">
          <div id="jet-mob" class="owl-carousel owl-theme">
            ${jetskiItems.map(p => `<div class="item">${giftRow(p)}</div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- ── AD BANNER ──────────────────────────────────── -->
    <section class="add_banner">
      <div class="container">
        <div id="addCarousel" class="carousel slide pointer-event" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item">
              <img src="https://souksnap.com/images/add.png" class="img-fluid" alt="Ad Banner"
                   onerror="this.src='https://placehold.co/1200x200/2b3149/fff?text=Special+Offer'">
            </div>
            <div class="carousel-item active">
              <img src="https://souksnap.com/images/add.png" class="img-fluid" alt="Ad Banner"
                   onerror="this.src='https://placehold.co/1200x200/f84464/fff?text=Special+Offer'">
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#addCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
          <button class="carousel-control-next" type="button" data-bs-target="#addCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
        </div>
      </div>
    </section>

    <!-- ── GETAWAYS / SHOPPING ───────────────────────── -->
    <section class="pb-0 pt-5">
      <div class="container">
        <div class="heading_main">

          <div class="heading mb-0">Shopping on, <span>Souksnap</span></div>

          ${!state.liveProductsLoaded ? '<div class="rl-loading"><span class="rl-spinner"></span> Loading live products…</div>' : ''}
        </div>
        <div class="row g-4 d-none d-lg-flex" id="getaways-static-grid">
          ${getaways.slice(0, 5).map(p => `<div class="col-lg">${giftRow(p)}</div>`).join('')}
        </div>
        <div class="d-lg-none">
          <div id="getaways-mob" class="owl-carousel owl-theme">
            ${getaways.map(p => `<div class="item">${giftRow(p)}</div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- ── GIFT/ABOUT ─────────────────────────────────── -->
    <section class="about_bg">
      <div class="curv_top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="-380" r="400" fill="white" stroke="white"></circle></svg>
      </div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-7 col-lg-7 col-md-12 col-sm-12">
            <div class="about">
              <div class="heading">Gift
                <span>
                  <span style="color:white;">Whenever.</span>
                  <span style="color:white;">Moments.</span>
                  <span style="color:white;">Sustainably.</span>
                  <span style="color:white;">Joy.</span>
                  <span style="color:white;">Big.</span>
                </span>
              </div>
              <p>Welcome to Souk Snap, a premier vending solutions provider led by Al Afdal Selling Products By Wellness Within LLC - FZ. Our mission is to transform everyday convenience through cutting-edge vending technology, catering to diverse needs in the UAE and expanding our reach to global markets in the USA and Europe.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="curv_bottom">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="-380" r="400" fill="white" stroke="white"></circle></svg>
      </div>
    </section>

    <!-- ── CRYPTO ────────────────────────────────────── -->
   
    <section class="py-5">
      <div class="container">
        <div class="heading_main" style="text-align:center;">
          <div class="heading">Crypto <span>Vouchers</span></div>
          <p style="color:rgba(255,255,255,0.6);margin-top:8px;font-size:14px;">Buy crypto vouchers instantly — secure, fast, no wallet needed</p>
        </div>
        <div class="row g-4 d-none d-lg-flex" id="crypto-static-grid">
          ${state.liveByCategory.crypto.slice(0,5).map(p => `<div class="col-lg">${giftRow(p)}</div>`).join('')}
        </div>
        <div class="d-lg-none">
          <div id="crypto-mob" class="owl-carousel owl-theme">
            ${state.liveByCategory.crypto.map(p => `<div class="item">${giftRow(p)}</div>`).join('')}
          </div>
        </div>
      </div>
    </section>
    <!-- ── MOBILE RECHARGE ───────────────────────────── -->
    <section class="py-5" style="background:#f0f4ff;">
      <div class="container">
        <div class="heading_main">
          <div class="heading mb-0">Mobile <span>Recharge</span></div>
          <p style="color:#666;font-size:14px;margin-top:6px;">Instant top-up for Etisalat, Du & Virgin Mobile UAE</p>
        </div>
        ${!state.airtimeLoaded ? '<div class="rl-loading"><span class="rl-spinner"></span> Loading operators…</div>' : ''}
        <div class="row g-4 justify-content-center" id="recharge-operators-grid">
          ${state.airtimeOperators.map(op => operatorCardHTML(op)).join('')}
        </div>
      </div>
    </section>

    <!-- ── TICKETS / ENTERTAINMENT ──────────────────── -->
    <section class="gray_bg py-5">
      <div class="container">
        <div class="heading_main">
          <div class="heading mb-0">Entertainment</div>
          ${!state.liveProductsLoaded ? '<div class="rl-loading"><span class="rl-spinner"></span> Loading live products…</div>' : ''}
        </div>
        <div class="row g-4 d-none d-lg-flex" id="tickets-static-grid">
          ${tickets.slice(0, 5).map(p => `<div class="col-lg">${giftRow(p)}</div>`).join('')}
        </div>
        <div class="d-lg-none">
          <div id="ticket-mob" class="owl-carousel owl-theme">
            ${tickets.map(p => `<div class="item">${giftRow(p)}</div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- ── WHAT'S WAITING ─────────────────────────────── -->
    <section class="section waiting-for-you" style="background:linear-gradient(0deg,#fff 0%,#ffedef 100%);">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="heading">What's <span>Waiting for You</span></h2>
        </div>
        <div class="row justify-content-center">
          <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div class="waiting_row">
              <div class="waiting" onclick="navigateTo('digital')">
                <figure><img src="https://souksnap.com/images/digital-card-icon.png" class="img-fluid" alt="Digital Card" onerror="this.src='https://placehold.co/50x50/fdeef1/f84464?text=💳'"></figure>
                Digital Card
              </div>
              <div class="waiting" onclick="navigateTo('digital')">
                <figure><img src="https://souksnap.com/images/ticket-icon.png" class="img-fluid" alt="Tickets" onerror="this.src='https://placehold.co/50x50/fdeef1/f84464?text=🎟'"></figure>
                Tickets
              </div>
              <div class="waiting" onclick="navigateTo('jetski')">
                <figure><img src="https://souksnap.com/images/jet-ski-icon.png" class="img-fluid" alt="Jet Ski" onerror="this.src='https://placehold.co/50x50/fdeef1/f84464?text=🛥'"></figure>
                Jet Ski
              </div>
              <div class="waiting" onclick="navigateTo('wellness')">
                <figure><img src="https://souksnap.com/images/wellness-icon.png" class="img-fluid" alt="Wellness" onerror="this.src='https://placehold.co/50x50/fdeef1/f84464?text=💆'"></figure>
                Wellness
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div class="waiting_center">
              <img src="https://souksnap.com/images/mobile-fun.png" class="img-fluid" alt="Mobile App"
                   onerror="this.src='https://placehold.co/320x560/1a1a2e/ffffff?text=App'">
            </div>
          </div>
          <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div class="waiting_row">
              <div class="waiting" onclick="navigateTo('digital')">
                <figure><img src="https://souksnap.com/images/kids-icon.png" class="img-fluid" alt="Kids" onerror="this.src='https://placehold.co/50x50/fdeef1/f84464?text=🎮'"></figure>
                Kids
              </div>
              <div class="waiting" onclick="navigateTo('getaways')">
                <figure><img src="https://souksnap.com/images/getaways-icon.png" class="img-fluid" alt="Getaways" onerror="this.src='https://placehold.co/50x50/fdeef1/f84464?text=🏝'"></figure>
                Getaways
              </div>
              <div class="waiting" onclick="navigateTo('blackfriday')">
                <figure><img src="https://souksnap.com/images/black-friday-icon.png" class="img-fluid" alt="Black Friday" onerror="this.src='https://placehold.co/50x50/fdeef1/f84464?text=🎁'"></figure>
                Black Friday
              </div>
              <div class="waiting" onclick="navigateTo('digital')">
                <figure><img src="https://souksnap.com/images/beauty-icon.png" class="img-fluid" alt="Beauty" onerror="this.src='https://placehold.co/50x50/fdeef1/f84464?text=💄'"></figure>
                Beauty
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  initHomeCarousels();
}

// ── Carousel Init ─────────────────────────────────────────────
function initHomeCarousels() {
  const bannerEl = document.getElementById('bannerCarousel');
  if (bannerEl && typeof bootstrap !== 'undefined') {
    new bootstrap.Carousel(bannerEl, { interval: 5000, ride: 'carousel' });
  }
  const addEl = document.getElementById('addCarousel');
  if (addEl && typeof bootstrap !== 'undefined') {
    new bootstrap.Carousel(addEl, { interval: 4000, ride: 'carousel' });
  }
  if (typeof $ !== 'undefined' && $.fn && $.fn.owlCarousel) {
    const opts = getMobOwlOpts();
    $('#digital-mob').owlCarousel(opts);
    $('#jet-mob').owlCarousel(opts);
    $('#getaways-mob').owlCarousel(opts);
    $('#wellness-mob').owlCarousel(opts);
    $('#ticket-mob').owlCarousel(opts);
  }
}

// ============================================================
// ABOUT
// ============================================================

function renderAbout() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="page-hero-dark">
      <h1>About Us</h1>
      <p>Wellness Within LLC - FZ is more than just an e-commerce platform—we're a digital marketplace built on trust, innovation, and convenience.</p>
      <p style="margin-top:16px;">From our humble beginnings in Dubai, we have rapidly grown into a globally connected business serving diverse markets.</p>
    </section>
    <section class="about-section">
      <div class="about-grid">
        <div>
          <h2>Our Growth Journey</h2>
          <p>We began our journey in 2023, operating out of a single office in Jumeirah Lake Towers (JLT), Dubai. With a focus on seamless shopping experiences and dependable service, we quickly gained traction in the UAE's fast-growing e-commerce space.</p>
        </div>
        <div class="about-img" style="background:linear-gradient(135deg,#e8f4f8,#fdeef1);">
          <img src="https://placehold.co/460x300/e8f4f8/333?text=Team+Meeting" alt="Team" style="border-radius:12px;width:100%;height:300px;object-fit:cover;">
        </div>
      </div>
    </section>
    <div class="about-text-section">
      <h2>Our Mission</h2>
      <p>To redefine digital retail by delivering a personalized, transparent, and value-driven shopping experience for customers around the world.</p>
      <h2>Our Presence</h2>
      <div class="presence-grid">
        <div class="presence-card"><h4>Dubai, UAE (Headquarters)</h4><p>Office# 3402, Dome Tower, Cluster N, JLT</p></div>
        <div class="presence-card"><h4>Manila, Philippines</h4><p>Unit 1503, Tower One, Ayala Triangle, Makati City</p></div>
      </div>
    </div>`;
}

// ============================================================
// DIGITAL CARD PAGE
// ============================================================

function renderDigital() {
  const prods = state.liveProducts.length
    ? state.liveProducts
    : products.filter(p => p.category === 'digital');

  renderCategoryPage({
    title:    'Digital Cards',
    emoji:    '🎁',
    subtitle: 'Gift cards for gaming, shopping, entertainment, crypto & more — instant delivery',
    bg:       'linear-gradient(135deg, #f84464, #ff6b8a)',
    prods,
    gridId:   'digital-grid',
    emptyMsg: 'No digital products available right now.'
  });
}

// ============================================================
// CONTACT
// ============================================================

function renderContact() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="contact-page">
      <h1>We're Here to Help – Anytime, Anywhere.</h1>
      <p class="subtitle">Whether you have a question about your order, need support with a product, or are interested in partnering with us—we'd love to hear from you.</p>
      <div class="contact-layout">
        <div>
          <div class="contact-info-card">
            <h3>Our Contact Details</h3>
            <div class="contact-detail-row"><div class="contact-detail-icon">📍</div><div><p>Address</p><strong>Office #3402, Dome Tower, Cluster N, JLT, Dubai, UAE</strong></div></div>
            <div class="contact-detail-row"><div class="contact-detail-icon">✉️</div><div><p>Email</p><strong>support@souksnap.com</strong></div></div>
            <div class="contact-detail-row"><div class="contact-detail-icon">📞</div><div><p>Phone</p><strong>+971 582096944</strong></div></div>
          </div>
        </div>
        <div class="message-form">
          <h3>Send Us a Message</h3>
          <div class="form-group"><input type="text" class="form-control" placeholder="Full Name" id="contact-name" required></div>
          <div class="form-group"><input type="email" class="form-control" placeholder="Email Address" id="contact-email" required></div>
          <div class="form-group"><input type="tel" class="form-control" placeholder="Mobile Number" id="contact-phone"></div>
          <div class="form-group"><input type="text" class="form-control" placeholder="Subject" id="contact-subject" required></div>
          <div class="form-group"><textarea class="form-control" placeholder="Message" id="contact-message" rows="4" required></textarea></div>
          <button class="btn-block" onclick="submitContactForm()">SUBMIT</button>
        </div>
      </div>
    </div>`;
}

function submitContactForm() {
  const name    = document.getElementById('contact-name').value;
  const email   = document.getElementById('contact-email').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;
  if (!name || !email || !subject || !message) {
    showToast('Please fill in all required fields.');
    return;
  }
  showToast("Message sent! We'll get back to you soon.");
  ['contact-name','contact-email','contact-phone','contact-subject','contact-message']
    .forEach(id => document.getElementById(id).value = '');
}

// ============================================================
// SIGN IN / SIGN UP
// ============================================================

function renderSignIn() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Sign In</h2>
        <div class="form-group"><input type="text" class="form-control light" placeholder="Email or Phone" id="signin-email"></div>
        <div class="form-group"><input type="password" class="form-control light" placeholder="Password" id="signin-password"></div>
        <div class="checkbox-row">
          <label class="checkbox-label"><input type="checkbox" id="remember-me"> Remember Me</label>
          <a href="#" class="forgot-link">Forgot Your Password?</a>
        </div>
        <button class="btn-block" onclick="submitSignIn()">SIGN IN</button>
        <div class="auth-footer">Don't have an account? <a href="#" onclick="navigateTo('signup');return false;">Sign Up</a></div>
      </div>
    </div>`;
}

function submitSignIn() {
  const email    = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  if (!email || !password) { showToast('Please enter your email and password.'); return; }
  const name = email.includes('@') ? email.split('@')[0] : email;
  state.user = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
  updateHeaderUser();
  showToast(`Welcome back, ${state.user.name}!`);
  navigateTo('home');
}

function renderSignUp() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Sign Up</h2>
        <div class="auth-form-row">
          <div class="form-group"><input type="text" class="form-control light" placeholder="Full Name" id="signup-name"></div>
          <div class="form-group"><input type="tel" class="form-control light" placeholder="Phone Number" id="signup-phone"></div>
        </div>
        <div class="form-group"><input type="email" class="form-control light" placeholder="Email" id="signup-email"></div>
        <div class="form-row-2">
          <div class="form-group"><input type="password" class="form-control light" placeholder="Password" id="signup-password"></div>
          <div class="form-group"><input type="password" class="form-control light" placeholder="Confirm Password" id="signup-confirm"></div>
        </div>
        <div class="form-group"><input type="text" class="form-control light" placeholder="Address" id="signup-address"></div>
        <div class="form-row-3">
          <div class="form-group">
            <select class="form-control light" id="signup-country">
              <option value="">Select Country</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
              <option value="IN">India</option>
              <option value="PH">Philippines</option>
            </select>
          </div>
          <div class="form-group"><input type="text" class="form-control light" placeholder="City" id="signup-city"></div>
          <div class="form-group"><input type="text" class="form-control light" placeholder="Postal Code" id="signup-postal"></div>
        </div>
        <button class="btn-block" onclick="submitSignUp()">SIGN UP</button>
        <div class="auth-footer">Already have an account? <a href="#" onclick="navigateTo('signin');return false;">Sign In</a></div>
      </div>
    </div>`;
}

function submitSignUp() {
  const name     = document.getElementById('signup-name').value;
  const email    = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;
  if (!name || !email || !password || !confirm) { showToast('Please fill in all required fields.'); return; }
  if (password !== confirm) { showToast('Passwords do not match!'); return; }
  if (password.length < 6)  { showToast('Password must be at least 6 characters.'); return; }
  state.user = { name, email };
  updateHeaderUser();
  showToast(`Welcome to NexCards, ${name}! 🎉`);
  navigateTo('home');
}

// ============================================================
// CART
// ============================================================

function renderCart() {
  const main  = document.getElementById('main-content');
  const total = state.cartItems.reduce((sum, i) => sum + i.price, 0);

  main.innerHTML = `
    <div class="cart-page">
      <div class="container py-5">
        <div class="row g-4 align-items-start">

          <!-- Cart Items -->
          <div class="col-lg-8">
            <h2 class="cart-heading">Cart Summary</h2>
            <p class="cart-count">${state.cartItems.length} Gift${state.cartItems.length !== 1 ? 's' : ''} in Cart</p>

            ${state.cartItems.length === 0 ? `
              <div class="cart-empty">
                <div style="font-size:48px;margin-bottom:16px;">🛒</div>
                <p>Your cart is empty</p>
                <button class="gd-cart-btn" style="margin-top:20px;max-width:220px;" onclick="navigateTo('home')">Start Shopping</button>
              </div>
            ` : state.cartItems.map(item => `
              <div class="cart-item-card">
                <img src="${item.img}" alt="${item.name}"
                     onerror="this.src='https://placehold.co/90x90/f0f0f0/999?text=IMG'">
                <div class="cart-item-info">
                  <div class="cart-item-name">${item.name}</div>
                  ${item.source === 'reloadly' ? '<span class="rl-badge">Reloadly Live</span>' : ''}
                  <div class="cart-item-price-row">
                    <span class="cart-aed">${item.currency || 'AED'}</span>
                    <span class="cart-price-num">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <button class="cart-remove-btn" onclick="removeFromCart(${item.id})" title="Remove">✕</button>
              </div>
            `).join('')}
          </div>

          <!-- Order Summary -->
          <div class="col-lg-4">
            <div class="order-summary-card">
              <h3 class="order-summary-title">Order Summary</h3>
              ${state.accountBalance ? `
                <div class="order-row-item" style="font-size:13px;color:#888;">
                  <span>Wallet Balance</span>
                  <span>${state.accountBalance.balance} ${state.accountBalance.currencyCode}</span>
                </div>` : ''}
              <div class="order-row-item">
                <span>Order Total</span>
                <span>AED <strong>${total.toFixed(2)}</strong></span>
              </div>
              <div class="order-divider"></div>
              <div class="order-row-item order-total-row">
                <span>Total Amount</span>
                <span>AED <strong>${total.toFixed(2)}</strong></span>
              </div>
              <button class="gd-cart-btn" id="checkout-btn" style="margin-top:24px;"
                onclick="checkout()"
                ${state.cartItems.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                BUY NOW
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>`;
}

// ── Checkout (places real Reloadly orders) ───────────────────
async function checkout() {
  if (!state.user) {
    showToast('Please sign in to complete your purchase.');
    navigateTo('signin');
    return;
  }
  if (state.cartItems.length === 0) return;

  const btn = document.getElementById('checkout-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Processing…'; }

  const reloadlyItems = state.cartItems.filter(i => i.source === 'reloadly');
  const staticItems   = state.cartItems.filter(i => i.source !== 'reloadly');
  const orders = [];

  try {
    // ── Place Reloadly orders ──────────────────────────────
    for (const item of reloadlyItems) {
      const payload = {
        productId:        item.reloadlyId,
        quantity:         1,
        unitPrice:        item.price,
        customIdentifier: `souksnap-${state.user.email}-${Date.now()}`,
        senderName:       state.user.name,
        recipientEmail:   state.user.email
      };
      showToast(`Ordering ${item.name.substring(0, 25)}…`);
      const result = await api.post('/giftcards/order', payload);
      orders.push(result);
      console.log('✅ Reloadly order:', result);
    }

    // ── Static items — simulate ────────────────────────────
    if (staticItems.length) {
      await new Promise(r => setTimeout(r, 600));
      orders.push(...staticItems.map(i => ({ simulated: true, product: i.name })));
    }

    // ── Save to order history ──────────────────────────────
    orders.filter(o => o.transactionId).forEach(o => {
      state.orderHistory.push({
        type:          'giftcard',
        transactionId: o.transactionId,
        productName:   o.product?.productName || 'Gift Card',
        img:           o.product?.logoUrls?.[0] || '',
        amount:        o.amount || 0,
        currency:      o.currencyCode || 'USD',
        status:        o.status || 'PROCESSING',
        date:          new Date().toISOString(),
        _local:        true
      });
    });

    // ── Success ────────────────────────────────────────────
    state.cartItems = [];
    updateCartBadge();
    renderOrderConfirmation(orders);
    showToast('🎉 Order placed! Check your email for gift codes.', 'success');

  } catch (err) {
    console.error('Checkout error:', err);
    showToast(`❌ Order failed: ${err.message}`, 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'BUY NOW'; }
  }
}

// ── Order confirmation screen ────────────────────────────────
function renderOrderConfirmation(orders) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="cart-page">
      <div class="container py-5" style="max-width:680px;">
        <div class="order-summary-card" style="text-align:center;padding:48px 32px;">
          <div style="font-size:64px;margin-bottom:16px;">🎉</div>
          <h2 style="font-weight:700;margin-bottom:8px;">Order Confirmed!</h2>
          <p style="color:#666;margin-bottom:32px;">Thank you, <strong>${state.user?.name || 'Customer'}</strong>!<br>
          Your gift card code(s) will be sent to <strong>${state.user?.email || ''}</strong>.</p>

          ${orders.filter(o => o.transactionId).map(o => `
            <div class="cart-item-card" style="text-align:left;margin-bottom:12px;">
              <div class="cart-item-info">
                <div class="cart-item-name">Transaction #${o.transactionId}</div>
                <div style="font-size:13px;color:#888;margin-top:4px;">Status: <strong style="color:#27ae60;">${o.status || 'PROCESSING'}</strong></div>
                ${o.cards?.length ? `<div style="margin-top:8px;font-size:14px;">🎁 Code: <code style="background:#f5f5f5;padding:2px 8px;border-radius:4px;">${o.cards[0].cardNumber}</code></div>` : ''}
              </div>
            </div>`).join('')}

          <button class="gd-cart-btn" style="max-width:240px;margin:0 auto;" onclick="navigateTo('home')">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>`;
}

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================

function renderGiftDetail(product) {
  if (!product) {
    const main = document.getElementById('main-content');
    main.innerHTML = `<div style="text-align:center;padding:80px 20px;"><h2>Product not found</h2><button class="gd-cart-btn" style="margin-top:20px;max-width:200px;" onclick="navigateTo('home')">Back to Home</button></div>`;
    return;
  }

  const main = document.getElementById('main-content');

  // Build denomination buttons
  let denomSection = '';
  if (product.denominations && product.denominations.length > 0) {
    denomSection = `
      <div class="gd-section">
        <h3 class="gd-section-title">Select card value</h3>
        <div class="gd-value-options" style="flex-wrap:wrap;">
          ${product.denominations.map((d, i) => `
            <button class="gd-value-btn ${i === 0 ? 'active' : ''}"
                    data-value="${d}"
                    onclick="selectValue(this, ${d})">
              ${product.currency || 'AED'} ${d}
            </button>`).join('')}
        </div>
      </div>`;
  } else if (product.denominationType === 'RANGE') {
    denomSection = `
      <div class="gd-section">
        <h3 class="gd-section-title">Enter amount (${product.currency || 'AED'} ${product.minDenom}–${product.maxDenom})</h3>
        <input type="number" class="gd-input" id="custom-amount"
               value="${product.price}" min="${product.minDenom}" max="${product.maxDenom}" step="1"
               style="max-width:200px;">
      </div>`;
  } else {
    denomSection = `
      <div class="gd-section">
        <h3 class="gd-section-title">Select card value</h3>
        <div class="gd-value-options">
          <button class="gd-value-btn active" data-value="${product.price}" onclick="selectValue(this,${product.price})">
            AED ${product.price}
          </button>
        </div>
        <div id="custom-amount-wrap" style="display:none;margin-top:12px;">
          <input type="number" class="gd-input" placeholder="Custom Amount" id="custom-amount" min="10" step="10">
        </div>
      </div>`;
  }

  main.innerHTML = `
    <div class="gd-page">
      <div class="container py-5">
        <div class="row g-4 align-items-start">

          <!-- Product Image -->
          <div class="col-lg-5 col-md-5">
            <div class="gd-img-card">
              <img src="${product.img}" alt="${product.name}"
                   onerror="this.src='https://placehold.co/420x380/f0f0f0/999?text=Product'">
              ${product.source === 'reloadly' ? `
                <div class="rl-live-tag">
                  <span class="rl-badge" style="font-size:12px;padding:4px 10px;">⚡ Live via Reloadly</span>
                </div>` : ''}
            </div>
          </div>

          <!-- Product Info -->
          <div class="col-lg-7 col-md-7">
            <div class="gd-info-card">

              <h1 class="gd-title">${product.name}</h1>
              ${product.brand ? `<p class="gd-subtitle">${product.brand}${product.categoryName ? ' · ' + product.categoryName : ''}</p>` : ''}

              ${denomSection}

              <!-- Tabs -->
              <div class="gd-tabs">
                <button class="gd-tab" onclick="switchGiftTab(this,'gift')">This is a gift</button>
                <button class="gd-tab active" onclick="switchGiftTab(this,'me')">This is for me</button>
              </div>

              <div class="gift-tab-content" id="tab-gift">
                <div class="mb-3"><input type="email" class="gd-input" placeholder="Their Email" id="recipient-email"></div>
                <div class="mb-3"><input type="text"  class="gd-input" placeholder="Your Name/s"></div>
                <div class="mb-3"><textarea class="gd-input" placeholder="Add a Personal Message" rows="3"></textarea></div>
                <div class="mb-3"><input type="date"  class="gd-input"></div>
              </div>

              <div class="gift-tab-content active" id="tab-me">
                <p class="gd-note">Buying for yourself? We'll send the gift card to your registered email address.</p>
              </div>

              <!-- Add to Cart -->
              <button class="gd-cart-btn" onclick="addProductToCart(${product.id})">
                ADD TO CART
              </button>

              <!-- About -->
              <div class="gd-about">
                <h3 class="gd-section-title">About these gift cards</h3>
                <ul class="gd-about-list">
                  <li>Securely delivered to your registered email</li>
                  <li>Instant digital delivery after payment</li>
                  <li>Valid for 4 years from purchase date</li>
                  <li>Non-refundable once redeemed</li>
                  <li>Powered by Reloadly — trusted globally</li>
                  <li>See our gift card purchase terms &amp; conditions</li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>`;
}

// ============================================================
// MOBILE RECHARGE PAGE
// ============================================================

function renderMobileRecharge(preselectedOpId) {
  const main = document.getElementById('main-content');
  const ops  = state.airtimeOperators;

  main.innerHTML = `
    <div class="gd-page">
      <div class="container py-5" style="max-width:720px;">
        <h1 style="font-weight:700;margin-bottom:4px;">Mobile <span style="color:#f84464;">Recharge</span></h1>
        <p style="color:#888;margin-bottom:32px;">Instant top-up for UAE numbers — Etisalat, Du & Virgin Mobile</p>

        <div class="gd-info-card">

          <!-- Phone Number -->
          <div class="gd-section">
            <h3 class="gd-section-title">Mobile Number</h3>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <select class="gd-input" id="country-code" style="max-width:110px;">
                <option value="971">🇦🇪 +971</option>
                <option value="91">🇮🇳 +91</option>
                <option value="44">🇬🇧 +44</option>
                <option value="1">🇺🇸 +1</option>
              </select>
              <input type="tel" class="gd-input" id="recharge-phone"
                     placeholder="50 123 4567" style="flex:1;min-width:180px;"
                     oninput="onPhoneInput(this)"
                     onblur="detectOperator()">
              <button class="gd-value-btn active" onclick="detectOperator()" style="white-space:nowrap;">
                🔍 Detect Operator
              </button>
            </div>
            <!-- Detected operator badge -->
            <div id="detected-operator" style="margin-top:12px;display:none;">
              <div class="rl-loading" id="detect-loading" style="display:none;">
                <span class="rl-spinner"></span> Detecting operator…
              </div>
              <div id="detect-result" style="display:flex;align-items:center;gap:12px;padding:12px;background:#f0fff4;border:1.5px solid #27ae60;border-radius:10px;">
                <img id="detect-logo" src="" alt="" style="width:48px;height:48px;object-fit:contain;border-radius:8px;">
                <div>
                  <div style="font-weight:600;" id="detect-name"></div>
                  <div style="font-size:12px;color:#27ae60;">✅ Operator detected</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Operator selector -->
          <div class="gd-section">
            <h3 class="gd-section-title">Select Operator</h3>
            <div style="display:flex;gap:12px;flex-wrap:wrap;" id="operator-selector">
              ${ops.length ? ops.map(op => `
                <div class="operator-pill ${op.operatorId == preselectedOpId ? 'active' : ''}"
                     id="op-pill-${op.operatorId}"
                     data-operator-id="${op.operatorId}"
                     onclick="selectOperator(${op.operatorId})">
                  <img src="${op.logoUrls?.[0] || ''}" alt="${op.name}"
                       onerror="this.style.display='none'" style="width:28px;height:28px;object-fit:contain;border-radius:4px;">
                  ${op.name.replace(' United Arab Emirates','').replace(' UAE','')}
                </div>`).join('') : '<p style="color:#888;font-size:14px;">Loading operators…</p>'}
            </div>
          </div>

          <!-- Amount selector -->
          <div class="gd-section" id="amount-section" style="${preselectedOpId || ops.length ? '' : 'display:none;'}">
            <h3 class="gd-section-title">Select Amount <span style="font-size:13px;color:#888;">(AED)</span></h3>
            <div id="amount-buttons" class="gd-value-options" style="flex-wrap:wrap;">
              ${preselectedOpId ? renderAmountButtons(preselectedOpId) : (ops[0] ? renderAmountButtons(ops[0].operatorId) : '')}
            </div>
          </div>

          <!-- Top-up button -->
          <button class="gd-cart-btn" id="topup-btn" onclick="placeTopup()">
            ⚡ Top Up Now
          </button>

        </div>
      </div>
    </div>`;

  // Auto-select first operator if none preselected
  if (!preselectedOpId && ops.length) selectOperator(ops[0].operatorId);
}

function renderAmountButtons(operatorId) {
  const op = state.airtimeOperators.find(o => o.operatorId == operatorId);
  if (!op) return '';
  const amounts = op.localFixedAmounts?.length ? op.localFixedAmounts : op.fixedAmounts || [];
  return amounts.map((a, i) => `
    <button class="gd-value-btn ${i === 0 ? 'active' : ''}"
            data-value="${a}" onclick="selectValue(this, ${a})">
      AED ${a}
    </button>`).join('');
}

function selectOperator(operatorId) {
  // Update pill highlight
  document.querySelectorAll('.operator-pill').forEach(p => p.classList.remove('active'));
  const pill = document.getElementById(`op-pill-${operatorId}`);
  if (pill) pill.classList.add('active');

  // Update amount buttons
  const amtSection = document.getElementById('amount-section');
  const amtBtns    = document.getElementById('amount-buttons');
  if (amtSection) amtSection.style.display = '';
  if (amtBtns)    amtBtns.innerHTML = renderAmountButtons(operatorId);
}

let detectTimer = null;
function onPhoneInput(input) {
  // Debounce auto-detect — fire 800ms after user stops typing
  clearTimeout(detectTimer);
  const val = input.value.replace(/\D/g, '');
  if (val.length >= 9) {
    detectTimer = setTimeout(detectOperator, 800);
  }
}

async function detectOperator() {
  const phoneInput = document.getElementById('recharge-phone');
  const ccSelect   = document.getElementById('country-code');
  if (!phoneInput) return;

  const local = phoneInput.value.replace(/\D/g, '');
  if (local.length < 7) return;

  const cc    = ccSelect ? ccSelect.value : '971';
  const full  = cc + local;

  const loading = document.getElementById('detect-loading');
  const result  = document.getElementById('detect-result');
  const wrapper = document.getElementById('detected-operator');

  if (wrapper) wrapper.style.display = 'block';
  if (loading) loading.style.display = 'flex';
  if (result)  result.style.display  = 'none';

  try {
    const data = await api.get(`/airtime/lookup/${full}`);
    if (loading) loading.style.display = 'none';
    if (result)  result.style.display  = 'flex';

    const logo = document.getElementById('detect-logo');
    const name = document.getElementById('detect-name');
    if (logo) logo.src = data.logoUrls?.[0] || '';
    if (name) name.textContent = data.name || 'Unknown Operator';

    // Auto-select the detected operator
    if (data.operatorId) selectOperator(data.operatorId);
    showToast(`📱 Detected: ${data.name}`);
  } catch (err) {
    if (loading) loading.style.display = 'none';
    if (wrapper) wrapper.style.display = 'none';
    showToast('Could not detect operator. Please select manually.');
  }
}

async function placeTopup() {
  if (!state.user) {
    showToast('Please sign in to recharge.');
    navigateTo('signin');
    return;
  }

  const phoneInput = document.getElementById('recharge-phone');
  const ccSelect   = document.getElementById('country-code');
  const activeBtn  = document.querySelector('#amount-buttons .gd-value-btn.active');
  const activePill = document.querySelector('.operator-pill.active');

  const phone      = phoneInput?.value.replace(/\D/g, '');
  const cc         = ccSelect?.value || '971';
  const amount     = parseFloat(activeBtn?.dataset.value || 0);
  const operatorId = activePill ? parseInt(activePill.dataset.operatorId) : null;

  if (!phone || phone.length < 7) { showToast('Please enter a valid phone number.'); return; }
  if (!operatorId) { showToast('Please select an operator.'); return; }
  if (!amount)     { showToast('Please select a recharge amount.'); return; }

  const btn = document.getElementById('topup-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Processing…'; }

  try {
    const result = await api.post('/airtime/topup', {
      operatorId,
      amount,
      useLocalAmount: true,
      recipientPhone: cc + phone,
      senderPhone:    cc + phone
    });

    // Save to order history
    const op = state.airtimeOperators.find(o => o.operatorId == operatorId);
    state.orderHistory.push({
      type:          'airtime',
      transactionId: result.transactionId,
      operator:      op?.name || 'Unknown',
      phone:         '+' + cc + phone,
      amount,
      currency:      'AED',
      status:        result.status || 'COMPLETED',
      date:          new Date().toISOString()
    });

    showToast(`✅ AED ${amount} topped up to +${cc}${phone}!`, 'success');
    renderTopupConfirmation(result, op, cc + phone, amount);

  } catch (err) {
    showToast(`❌ Top-up failed: ${err.message}`, 'error');
    if (btn) { btn.disabled = false; btn.textContent = '⚡ Top Up Now'; }
  }
}

function renderTopupConfirmation(result, op, phone, amount) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="cart-page">
      <div class="container py-5" style="max-width:600px;">
        <div class="order-summary-card" style="text-align:center;padding:48px 32px;">
          <div style="font-size:64px;margin-bottom:16px;">✅</div>
          <h2 style="font-weight:700;margin-bottom:8px;">Recharge Successful!</h2>
          <p style="color:#666;margin-bottom:24px;">
            <strong>AED ${amount}</strong> topped up to <strong>+${phone}</strong><br>
            via <strong>${op?.name || 'Operator'}</strong>
          </p>
          <div class="order-row-item"><span>Transaction ID</span><strong>${result.transactionId || '—'}</strong></div>
          <div class="order-row-item"><span>Status</span><strong style="color:#27ae60;">${result.status || 'COMPLETED'}</strong></div>
          <div class="order-divider"></div>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap;">
            <button class="gd-cart-btn" style="max-width:180px;" onclick="navigateTo('recharge')">Recharge Again</button>
            <button class="gd-cart-btn" style="max-width:180px;background:#333;" onclick="navigateTo('orders')">My Orders</button>
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
// ORDER HISTORY PAGE
// ============================================================

function renderOrderHistory() {
  if (!state.user) { navigateTo('signin'); return; }
  const main = document.getElementById('main-content');


  // Only show orders belonging to the currently logged-in user (localStorage)
  const allOrders = LS.getOrders(state.user.email);

  main.innerHTML = `
    <div class="cart-page">
      <div class="container py-5">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
          <div>
            <h1 style="font-weight:700;margin-bottom:4px;">My <span style="color:#f84464;">Orders</span></h1>
            <p style="color:#888;margin:0;">${allOrders.length} order${allOrders.length !== 1 ? 's' : ''} found</p>
          </div>
          <button class="gd-cart-btn" style="max-width:160px;" onclick="navigateTo('home')">← Back to Shop</button>
        </div>

        ${allOrders.length === 0 ? `
          <div style="text-align:center;padding:80px 20px;color:#aaa;">
            <div style="font-size:56px;margin-bottom:16px;">📋</div>
            <p style="font-size:16px;">No orders yet. Start shopping!</p>
            <button class="gd-cart-btn" style="max-width:200px;margin-top:20px;" onclick="navigateTo('digital')">Browse Gift Cards</button>
          </div>
        ` : `
          <div class="row g-3">
            ${allOrders.map(o => orderRowHTML(o)).join('')}
          </div>
        `}
      </div>
    </div>`;
}

function orderRowHTML(o) {
  const icon      = o.type === 'airtime' ? '📱' : '🎁';
  const typeBadge = o.type === 'airtime' ? 'Recharge' : 'Gift Card';
  const badgeBg   = o.type === 'airtime' ? '#3498db' : '#f84464';
  const statusColor = (o.status || '').includes('COMPLET') || (o.status || '').includes('SUCCESS')
    ? '#27ae60' : '#e67e22';
  const dateStr = o.date ? new Date(o.date).toLocaleDateString('en-AE', { day:'numeric', month:'short', year:'numeric' }) : '—';

  return `
    <div class="col-12">
      <div class="cart-item-card" style="align-items:flex-start;gap:16px;">
        <div style="font-size:36px;line-height:1;min-width:44px;text-align:center;">
          ${o.img ? `<img src="${o.img}" style="width:44px;height:44px;object-fit:contain;border-radius:6px;" onerror="this.outerHTML='${icon}'">` : icon}
        </div>
        <div class="cart-item-info" style="flex:1;">
          <div class="cart-item-name">${o.productName || '—'}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;align-items:center;">
            <span style="background:${badgeBg};color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">${typeBadge}</span>
            ${o._local ? '<span style="background:#f39c12;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">This Session</span>' : ''}
            <span style="color:${statusColor};font-size:12px;font-weight:600;">● ${o.status || 'PROCESSING'}</span>
          </div>
          <div style="font-size:12px;color:#aaa;margin-top:4px;">
            ${o.transactionId ? `TX: ${o.transactionId}` : ''} ${dateStr ? '· ' + dateStr : ''}
          </div>
        </div>
        <div style="text-align:right;min-width:80px;">
          <div class="cart-aed" style="font-size:11px;">${o.currency || 'AED'}</div>
          <div class="cart-price-num">${parseFloat(o.amount || 0).toFixed(2)}</div>
        </div>
      </div>
    </div>`;
}

// ── Tab & value helpers ───────────────────────────────────────
function selectValue(btn, val) {
  document.querySelectorAll('.gd-value-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const wrap = document.getElementById('custom-amount-wrap');
  if (wrap) wrap.style.display = val === 0 ? 'block' : 'none';
}

function switchGiftTab(btn, tab) {
  document.querySelectorAll('.gd-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.gift-tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById('tab-' + tab);
  if (el) el.classList.add('active');
}

// ============================================================
// CATEGORY PAGE HELPER
// ============================================================

function renderCategoryPage({ title, emoji, subtitle, bg, textColor, prods, gridId, emptyMsg }) {
  const main = document.getElementById('main-content');
  const loaded = state.liveProductsLoaded;

  main.innerHTML = `
    <div>
      <!-- Hero banner -->
      <div style="background:${bg};padding:52px 24px;text-align:center;">
        <div style="font-size:52px;margin-bottom:14px;">${emoji}</div>
        <h1 style="color:${textColor || '#fff'};font-weight:800;margin:0;font-size:32px;">${title}</h1>
        <p style="color:${textColor ? textColor + 'aa' : 'rgba(255,255,255,0.65)'};margin:10px 0 0;font-size:15px;">${subtitle}</p>
      </div>

      <!-- Products -->
      <div class="container py-5">
        ${!loaded ? `<div class="rl-loading" style="justify-content:center;padding:48px;"><span class="rl-spinner"></span> Loading live products…</div>` : ''}
        ${loaded && prods.length === 0 ? `
          <div style="text-align:center;padding:80px 20px;color:#aaa;">
            <div style="font-size:48px;margin-bottom:16px;">🔍</div>
            <p>${emptyMsg || 'No products available right now.'}</p>
          </div>` : ''}
        <div class="products-grid" id="${gridId}">
          ${prods.map(p => productCardHTML(p)).join('')}
        </div>
      </div>
    </div>`;
}

// ============================================================
// GAMING PAGE
// ============================================================

function renderGaming() {
  const prods = state.liveByCategory.gaming.length
    ? state.liveByCategory.gaming
    : products.filter(p => p.category === 'jetski');

  renderCategoryPage({
    title:    'Gaming',
    emoji:    '🎮',
    subtitle: 'PlayStation, Xbox, Steam, Fortnite, Free Fire & more — instant delivery',
    bg:       'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    prods,
    gridId:   'gaming-grid',
    emptyMsg: 'No gaming products available right now.'
  });
}

// ============================================================
// SHOPPING PAGE
// ============================================================

function renderShopping() {
  const prods = state.liveByCategory.shopping.length
    ? state.liveByCategory.shopping
    : products.filter(p => p.category === 'getaways');

  renderCategoryPage({
    title:    'Shopping',
    emoji:    '🛍️',
    subtitle: 'Amazon, Shein, Talabat, Deliveroo, HUAWEI & more UAE gift cards',
    bg:       'linear-gradient(135deg, #f093fb, #f5576c)',
    prods,
    gridId:   'shopping-grid',
    emptyMsg: 'No shopping products available right now.'
  });
}

// ============================================================
// CRYPTO PAGE
// ============================================================

function renderCrypto() {
  const prods = state.liveByCategory.crypto.length
    ? state.liveByCategory.crypto
    : [];

  renderCategoryPage({
    title:    'Crypto Vouchers',
    emoji:    '₿',
    subtitle: 'Buy crypto vouchers instantly — no wallet needed, no KYC',
    bg:       'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    prods,
    gridId:   'crypto-grid',
    emptyMsg: 'No crypto products available in your region right now.'
  });
}

// ============================================================
// ENTERTAINMENT PAGE
// ============================================================

function renderEntertainment() {
  const prods = state.liveByCategory.entertainment.length
    ? state.liveByCategory.entertainment
    : [];

  renderCategoryPage({
    title:    'Entertainment',
    emoji:    '🎬',
    subtitle: 'Netflix, Spotify, Google Play, iTunes, Anghami, StarzPlay & more',
    bg:       'linear-gradient(135deg, #e50914, #b20710)',
    prods,
    gridId:   'entertainment-grid',
    emptyMsg: 'No entertainment products available right now.'
  });
}

// ============================================================
// SEARCH
// ============================================================

function renderSearch(query) {
  const main = document.getElementById('main-content');
  const allProducts = [...products, ...state.liveProducts.filter(lp => !products.find(p => p.id === lp.id))];
  const results = allProducts.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  main.innerHTML = `
    <div class="results-page">
      <div class="results-breadcrumb">Gift Cards</div>
      <h1 class="results-title">${results.length} results for "${query}"</h1>
      ${results.length > 0 ? `
        <div class="products-grid" style="margin-bottom:48px;">
          ${results.map(p => productCardHTML(p)).join('')}
        </div>
      ` : `
        <div style="text-align:center;padding:60px 0;color:var(--text-muted);">
          <div style="font-size:48px;margin-bottom:16px;">🔍</div>
          <p>No results found for "${query}". Try a different search term.</p>
        </div>
      `}
    </div>`;
}
