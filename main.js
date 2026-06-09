// ============================================================
// SOUKSNAP - Main JavaScript
// ============================================================

// ---- State ----
const state = {
  currentPage: 'home',
  cartItems: [],
  user: null,  // { name, email }
  cartOpen: false
};

// ---- Products Data ----
const products = [
  { id: 28, name: 'EA Sports FC 24 12000 FC Points', price: 380, category: 'digital', img: 'https://souksnap.com/gift_card_images/28/5213-Souksnap.jpg' },
  { id: 29, name: 'EA Sports FC 24 5900 FC Points', price: 200, category: 'digital', img: 'https://souksnap.com/gift_card_images/29/6437-Souksnap.jpg' },
  { id: 30, name: 'EA Sports FC 24 2800 FC Points', price: 100, category: 'digital', img: 'https://souksnap.com/gift_card_images/30/6586-Souksnap.jpg' },
  { id: 31, name: 'EA Sports FC 24 Ultimate Edition', price: 389, category: 'digital', img: 'https://souksnap.com/gift_card_images/31/8171-Souksnap.jpg' },
  { id: 32, name: 'EA Sports FC 24 Standard Edition', price: 299, category: 'digital', img: 'https://souksnap.com/gift_card_images/32/1987-Souksnap.jpg' },
  { id: 33, name: 'EA Sports FC 24 Standard Edition', price: 299, category: 'digital', img: 'https://souksnap.com/gift_card_images/33/9430-Souksnap.jpg' },
  { id: 34, name: "Senua's Saga: Hellblade II Xbox Series X|S - Instant Delivery", price: 199, category: 'digital', img: 'https://souksnap.com/gift_card_images/34/7427-Souksnap.jpg' },
  { id: 35, name: 'Minecraft Legends Deluxe Edition Xbox Series X|S - Instant Delivery', price: 199, category: 'digital', img: 'https://souksnap.com/gift_card_images/35/8157-Souksnap.jpg' },
  { id: 36, name: 'Minecraft Legends for Windows 10 PC - Instant Delivery', price: 159, category: 'digital', img: 'https://souksnap.com/gift_card_images/36/7708-Souksnap.jpg' },
  { id: 5,  name: "Thrill-Seeker's Paradise Jet Ski Adventures in Dubai", price: 1200, category: 'jetski', img: 'https://souksnap.com/gift_card_images/5/4284-1.jpg' },
  { id: 6,  name: 'Jet Ski in Fujairah: A Unique Ride Along the Indian Ocean', price: 600, category: 'jetski', img: 'https://souksnap.com/gift_card_images/6/3613-1.jpg' },
  { id: 7,  name: 'High-Speed Fun in Abu Dhabi Jet Skiing by Yas Island', price: 1500, category: 'jetski', img: 'https://souksnap.com/gift_card_images/7/2412-1.jpg' },
  { id: 8,  name: "Explore Ras Al Khaimah's Scenic Coastline with a Jet Ski Tour", price: 750, category: 'jetski', img: 'https://souksnap.com/gift_card_images/8/7702-1.jpg' },
  { id: 24, name: 'Authentic Tent Stay at Longbeach Campground', price: 550, category: 'getaways', img: 'https://souksnap.com/gift_card_images/24/8641-Souksnap.jpg' },
  { id: 25, name: '5-Star Weekday Vacation Stay at Radisson Blu Fujairah', price: 750, category: 'getaways', img: 'https://souksnap.com/gift_card_images/25/4407-Souksnap.jpg' },
  { id: 26, name: '5 Star Winter Stay at Al Bahar Hotel and Resort', price: 1050, category: 'getaways', img: 'https://souksnap.com/gift_card_images/26/6362-Souksnap.jpg' },
  { id: 27, name: '1-Night All Inclusive Stay at Danat Al Ain', price: 1350, category: 'getaways', img: 'https://souksnap.com/gift_card_images/27/7436-Souksnap.jpg' },
  { id: 18, name: 'Massage + Spa Week', price: 155, category: 'wellness', img: 'https://placehold.co/200x200/4a2a3a/white?text=Spa+Week' },
  { id: 19, name: 'Massage + Full Day Package', price: 650, category: 'wellness', img: 'https://placehold.co/200x200/3a1a2a/white?text=Full+Day' },
  { id: 20, name: 'DoubleTree by Hilton', price: 600, category: 'wellness', img: 'https://placehold.co/200x200/2a0a1a/white?text=DoubleTree' },
  { id: 21, name: 'All-Day Pilés at Phar', price: 200, category: 'wellness', img: 'https://placehold.co/200x200/3a2a1a/white?text=All+Day' },
  { id: 22, name: '5 Star Thai Relaxati', price: 450, category: 'wellness', img: 'https://placehold.co/200x200/2a1a0a/white?text=Thai+Spa' },
];

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  navigateTo('home');
  updateCartBadge();
  setupCartDropdown();
});

// ---- Navigation ----
function navigateTo(page, data = {}) {
  state.currentPage = page;

  // Update nav active state
  document.querySelectorAll('.nav-inner a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  const main = document.getElementById('main-content');
  main.innerHTML = '';

  const pages = {
    'home': renderHome,
    'about': renderAbout,
    'digital': renderDigital,
    'contact': renderContact,
    'signin': renderSignIn,
    'signup': renderSignUp,
    'cart': renderCart,
    'gift-detail': () => renderGiftDetail(data.product),
    'search': () => renderSearch(data.query),
  };

  if (pages[page]) {
    pages[page]();
  }

  window.scrollTo(0, 0);
}

// ---- Header ----
function renderNav() {
  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Digital Card', page: 'digital' },
    { label: 'Tickets', page: 'digital' },
    { label: 'Jet Ski', page: 'jetski' },
    { label: 'Wellness', page: 'wellness' },
    { label: 'Kids', page: 'kids' },
    { label: 'Getaways', page: 'getaways' },
    { label: 'Black Friday', page: 'blackfriday' },
    { label: "Today' Deal", page: 'deals' },
    { label: 'Supplier', page: 'supplier' },
    { label: 'Contact Us', page: 'contact' },
  ];

  document.querySelector('.nav-inner').innerHTML = navLinks.map(l =>
    `<a href="#" data-page="${l.page}" onclick="navigateTo('${l.page}');return false;">${l.label}</a>`
  ).join('');

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
        <div class="cart-btn" onclick="toggleCart()">
          🛒
          <span class="cart-badge" id="cart-badge">${state.cartItems.length || ''}</span>
        </div>
        <div class="cart-dropdown hidden" id="cart-dropdown"></div>
      </div>
    `;
  } else {
    actions.innerHTML = `
      <button class="btn-signin" onclick="navigateTo('signin')">SIGN IN</button>
      <div class="cart-wrapper">
        <div class="cart-btn" onclick="toggleCart()">
          🛒
          <span class="cart-badge" id="cart-badge">${state.cartItems.length || ''}</span>
        </div>
        <div class="cart-dropdown hidden" id="cart-dropdown"></div>
      </div>
    `;
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

// ---- Cart Dropdown ----
function setupCartDropdown() {
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('cart-dropdown');
    const wrapper = e.target.closest('.cart-wrapper');
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

  if (!state.cartOpen) {
    dropdown.classList.add('hidden');
    return;
  }

  dropdown.classList.remove('hidden');

  if (state.cartItems.length === 0) {
    dropdown.innerHTML = `<div style="padding:24px;text-align:center;color:#999;">Your cart is empty</div>`;
    return;
  }

  const total = state.cartItems.reduce((sum, item) => sum + item.price, 0);

  dropdown.innerHTML = `
    ${state.cartItems.map(item => `
      <div class="cart-dropdown-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/60x60/f0f0f0/999?text=IMG'">
        <div class="cart-dropdown-info">
          <div class="cart-dropdown-name">${item.name.substring(0, 35)}...</div>
          <div class="cart-dropdown-price">AED ${item.price.toFixed(2)}</div>
        </div>
        <span class="cart-remove-sm" onclick="removeFromCart(${item.id})">🗑️</span>
      </div>
    `).join('')}
    <div class="cart-dropdown-footer">
      <div class="cart-subtotal">
        <span>Sub Total</span>
        <span>AED ${total.toFixed(2)}</span>
      </div>
      <button class="btn-block" onclick="navigateTo('cart');state.cartOpen=false;document.getElementById('cart-dropdown').classList.add('hidden')">VIEW CART</button>
    </div>
  `;
}

function addToCart(product) {
  const exists = state.cartItems.find(i => i.id === product.id);
  if (!exists) {
    state.cartItems.push(product);
  }
  updateCartBadge();
  showToast(`${product.name.substring(0, 30)}... added to cart!`);
}

function removeFromCart(id) {
  state.cartItems = state.cartItems.filter(i => i.id !== id);
  updateCartBadge();
  renderCartDropdown();
  if (state.currentPage === 'cart') renderCart();
}

// ---- Toast ----
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- Search ----
function doSearch(query) {
  if (!query.trim()) return;
  navigateTo('search', { query: query.trim() });
}

// ---- Product Card HTML ----
function productCardHTML(p) {
  return `
    <div class="product-card" onclick="navigateTo('gift-detail', {product: ${JSON.stringify(JSON.stringify(p))}})">
      <img class="product-card-img" src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/200x200/f0f0f0/999?text=IMG'">
      <div class="product-card-body">
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-price"><span>AED</span>${p.price}</div>
      </div>
    </div>
  `;
}

// ============================================================
// PAGE RENDERS
// ============================================================

// ---- HOME ----
function renderHome() {
  const main        = document.getElementById('main-content');
  const digitalCards = products.filter(p => p.category === 'digital').slice(0, 5);
  const jetskiItems  = products.filter(p => p.category === 'jetski');
  const getaways     = products.filter(p => p.category === 'getaways');
  const wellness     = products.filter(p => p.category === 'wellness');
  const tickets      = products.filter(p => p.category === 'digital').slice(3);

  main.innerHTML = `

    <!-- ====================================================
         SECTION 1 — BANNER  background #2b3149
    ==================================================== -->
    <section class="banner">
      <div id="bannerCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="container">
          <div class="carousel-inner">

            <div class="carousel-item">
              <div class="row align-items-center">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                  <div class="banner_text">
                    <div class="sub_head">Limited Discount</div>
                    <div class="banner_heading">Sell your vouchers in Souksnap Market, register today!</div>
                    <a href="#" class="btn" onclick="navigateTo('digital');return false;">Shop Gift Card</a>
                  </div>
                </div>
                <div class="col-xl-5 col-lg-6 col-md-6 col-sm-6">
                  <div class="banner_img">
                    <img src="https://souksnap.com/images/banner.jpg" class="img-fluid" alt="Banner"
                         onerror="this.src='https://placehold.co/560x430/f84464/fff?text=Souksnap'">
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
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- ====================================================
         SECTION 2 — DIGITAL CARD  (static 5 products, no carousel)
    ==================================================== -->
    <section class="digital_bg">
      <div class="container">
        <div class="heading_main">
          <div class="heading">Digital <span>Card</span></div>
        </div>
        <div class="row g-3 justify-content-center">
          ${digitalCards.map((p, i) => `
            <div class="col-xl col-lg col-md-4 col-sm-6 col-6">
              <div class="digital_card digital_card--${(i % 4) + 1}">
                <a href="#" onclick="navigateTo('gift-detail',{product:${JSON.stringify(JSON.stringify(p))}});return false;">
                  <figure>
                    <img src="${p.img}" class="img-fluid" alt="${p.name}"
                         onerror="this.src='https://placehold.co/160x160/f0f0f0/999?text=IMG'">
                  </figure>
                  ${p.name.substring(0, 20)}
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ====================================================
         SECTION 3 — WHAT'S TRENDING  (heading only, no products)
    ==================================================== -->
    <section class="trending_bg">
      <div class="container">
        <div class="heading_main">
          <div class="heading">What's <span>Trending</span> Today</div>
        </div>
      </div>
    </section>

    <!-- ====================================================
         SECTION 4 — JET SKI DEALS  (Owl Carousel + gift_card style)
    ==================================================== -->
    <section class="py-5">
      <div class="container">
        <div class="heading_main">
          <div class="heading mb-0">Jet <span>Ski, Deals</span></div>
        </div>
        <div class="row justify-content-center">
          <div id="jet" class="owl-carousel p-0 owl-theme">
            ${jetskiItems.map(p => `
              <div class="item">
                <div class="gift_card">
                  <a href="#" onclick="navigateTo('gift-detail',{product:${JSON.stringify(JSON.stringify(p))}});return false;">
                    <figure>
                      <img src="${p.img}" class="img-fluid" alt="${p.name}"
                           onerror="this.src='https://placehold.co/300x220/e8f4f8/333?text=Jet+Ski'">
                    </figure>
                    <div>${p.name.substring(0, 20)}</div>
                    <div class="price"><span>AED</span> ${p.price}</div>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================
         SECTION 5 — AD BANNER (Bootstrap carousel)
    ==================================================== -->
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
          <button class="carousel-control-prev" type="button" data-bs-target="#addCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#addCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- ====================================================
         SECTION 6 — GETAWAYS  (Owl Carousel + gift_card style)
    ==================================================== -->
    <section class="pb-0 pt-5">
      <div class="container">
        <div class="heading_main">
          <div class="heading mb-0">Getaways on, <span>Souksnap</span></div>
        </div>
        <div class="row justify-content-center">
          <div id="getaways" class="owl-carousel p-0 owl-theme">
            ${getaways.map(p => `
              <div class="item">
                <div class="gift_card">
                  <a href="#" onclick="navigateTo('gift-detail',{product:${JSON.stringify(JSON.stringify(p))}});return false;">
                    <figure>
                      <img src="${p.img}" class="img-fluid" alt="${p.name}"
                           onerror="this.src='https://placehold.co/300x220/e8f4f8/333?text=Getaway'">
                    </figure>
                    <div>${p.name.substring(0, 20)}</div>
                    <div class="price"><span>AED</span> ${p.price}</div>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- GIFT WHENEVER -->
    <section class="gift-section">
      <h2>Gift Whenever.</h2>
      <p>Welcome to Souk Snap, a premier vending solutions provider led by Al Afdal Selling Products By Wellness Within LLC - FZ. Our mission is to transform everyday convenience through cutting-edge vending technology, catering to diverse needs in the UAE and expanding our reach to global markets in the USA and Europe.</p>
    </section>

    <!-- WELLNESS -->
    <section class="section" style="background: var(--bg-light);">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title"><span>Wellness</span></h2>
        </div>
        <div class="products-grid">
          ${wellness.map(p => productCardHTML(p)).join('')}
        </div>
      </div>
    </section>

    <!-- TICKETS -->
    <section class="section">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title"><span>Tickets</span></h2>
        </div>
        <div class="products-grid">
          ${tickets.slice(0, 5).map(p => productCardHTML(p)).join('')}
        </div>
      </div>
    </section>

    <!-- GRAB OFFER -->
    <section class="section" style="background: var(--bg-light);">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">Grab Offer <span>Beauty</span></h2>
        </div>
      </div>
    </section>

    <!-- WHAT'S WAITING -->
    <section class="section">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">What's <span>Waiting for You</span></h2>
        </div>
        <div class="waiting-grid">
          <div class="waiting-side">
            ${[
              { icon: '💳', label: 'Digital Cards', page: 'digital' },
              { icon: '🎟️', label: 'Tickets',       page: 'digital' },
              { icon: '🛥️', label: 'Jet Ski',        page: 'jetski'  },
              { icon: '💆', label: 'Wellness',       page: 'wellness'},
            ].map(c => `
              <div class="waiting-icon-card" onclick="navigateTo('${c.page}')">
                <div class="waiting-icon-img">${c.icon}</div>
                <div class="waiting-icon-label">${c.label}</div>
              </div>
            `).join('')}
          </div>
          <div class="waiting-phone">
            <img class="waiting-phone-img" src="https://placehold.co/140x280/1a1a2e/ffffff?text=%F0%9F%93%B1" alt="App">
          </div>
          <div class="waiting-side">
            ${[
              { icon: '🏝️', label: 'Getaways',     page: 'getaways'    },
              { icon: '🎮', label: 'Kids',          page: 'digital'     },
              { icon: '🎁', label: 'Black Friday',  page: 'blackfriday' },
              { icon: '🌊', label: 'Pool Party',    page: 'digital'     },
            ].map(c => `
              <div class="waiting-icon-card" onclick="navigateTo('${c.page}')">
                <div class="waiting-icon-img">${c.icon}</div>
                <div class="waiting-icon-label">${c.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;

  initHomeCarousels();
}

// ---- Carousel Init ----
function initHomeCarousels() {
  // Bootstrap – Banner
  const bannerEl = document.getElementById('bannerCarousel');
  if (bannerEl && typeof bootstrap !== 'undefined') {
    new bootstrap.Carousel(bannerEl, { interval: 5000, ride: 'carousel' });
  }

  // Bootstrap – Ad Banner
  const addEl = document.getElementById('addCarousel');
  if (addEl && typeof bootstrap !== 'undefined') {
    new bootstrap.Carousel(addEl, { interval: 4000, ride: 'carousel' });
  }

  // Owl Carousel – Jet Ski & Getaways
  if (typeof $ !== 'undefined' && $.fn && $.fn.owlCarousel) {
    const owlOpts = {
      loop: true,
      margin: 20,
      nav: false,
      dots: true,
      autoplay: true,
      autoplayTimeout: 3500,
      autoplayHoverPause: true,
      responsive: {
        0:    { items: 1 },
        576:  { items: 2 },
        768:  { items: 3 },
        992:  { items: 4 }
      }
    };
    $('#jet').owlCarousel(owlOpts);
    $('#getaways').owlCarousel(owlOpts);
  }
}

// ---- ABOUT ----
function renderAbout() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="page-hero-dark">
      <h1>About Us</h1>
      <p>Wellness Within LLC - FZ is more than just an e-commerce platform—we're a digital marketplace built on trust, innovation, and convenience. Founded in 2023, we started with a bold vision: to make online shopping simple, affordable, and accessible for everyone, everywhere.</p>
      <p style="margin-top:16px;">From our humble beginnings in Dubai, we have rapidly grown into a globally connected business serving diverse markets with a curated range of products—from everyday essentials to lifestyle innovations.</p>
    </section>

    <section class="about-section">
      <div class="about-grid">
        <div>
          <h2>Our Growth Journey</h2>
          <p>We began our journey in 2023, operating out of a single office in Jumeirah Lake Towers (JLT), Dubai. With a focus on seamless shopping experiences and dependable service, we quickly gained traction in the UAE's fast-growing e-commerce space.</p>
          <p>Driven by customer satisfaction and smart logistics, we scaled our operations and built strong partnerships with reliable vendors and delivery partners. Our platform evolved to support thousands of daily visitors and an expanding product catalog across multiple categories.</p>
        </div>
        <div class="about-img" style="background: linear-gradient(135deg, #e8f4f8, #fdeef1);">
          <img src="https://placehold.co/460x300/e8f4f8/333?text=Team+Meeting" alt="Team" style="border-radius:12px;width:100%;height:300px;object-fit:cover;">
        </div>
      </div>
    </section>

    <div class="about-text-section">
      <h2>Global Expansion</h2>
      <p>In response to increasing regional demand and supplier interest, we expanded our footprint beyond the UAE. In 2025, we proudly opened our second international office in Makati City, Metro Manila, Philippines, solidifying our presence in Southeast Asia and enhancing our cross-border logistics capability.</p>
      <p>Today, Wellness Within LLC - FZ continues to push boundaries with a global mindset, local service, and scalable infrastructure that supports long-term growth across international markets.</p>

      <h2>Our Mission</h2>
      <p>To redefine digital retail by delivering a personalized, transparent, and value-driven shopping experience for customers around the world.</p>

      <h2>Our Presence</h2>
      <div class="presence-grid">
        <div class="presence-card">
          <h4>Dubai, UAE (Headquarters)</h4>
          <p>Office# 3402, Dome Tower, Cluster N, JLT</p>
        </div>
        <div class="presence-card">
          <h4>Manila, Philippines (Southeast Asia Office)</h4>
          <p>Unit 1503, Tower One, Ayala Triangle, Makati City, Metro Manila 1226</p>
        </div>
      </div>

      <h2>What We Offer</h2>
      <div class="what-we-offer">
        <ul>
          <li>A wide range of high-quality, affordable products</li>
          <li>Fast and reliable delivery services</li>
          <li>Secure checkout and flexible payment options</li>
          <li>24/7 customer support and easy return policies</li>
        </ul>
      </div>

      <div style="margin-top:40px;padding:28px;background:var(--dark-footer);border-radius:12px;text-align:center;">
        <p style="font-size:17px;font-weight:700;color:white;margin-bottom:8px;">At Wellness Within LLC - FZ, we're not just selling products—we're building lasting relationships.</p>
        <p style="color:rgba(255,255,255,0.6);margin:0;">Join us as we grow, innovate, and shape the future of online retail.</p>
      </div>
    </div>
  `;
}

// ---- DIGITAL CARD ----
function renderDigital() {
  const main = document.getElementById('main-content');
  const digitalProducts = products.filter(p => p.category === 'digital');

  main.innerHTML = `
    <div class="section-inner">
      <div class="page-title-bar">
        <h1>Digital Card</h1>
      </div>
      <div class="products-grid" style="margin-bottom: 48px;">
        ${digitalProducts.map(p => productCardHTML(p)).join('')}
      </div>
    </div>
  `;
}

// ---- CONTACT ----
function renderContact() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="contact-page">
      <h1>We're <s>Here to Help</s> – Anytime, Anywhere.</h1>
      <p class="subtitle">At Wellness Within, your satisfaction and well-being are at the heart of everything we do. Whether you have a question about your order, need support with a product, or are interested in partnering with us—we'd love to hear from you.</p>

      <div class="contact-layout">
        <div>
          <div class="contact-info-card">
            <h3>Our Contact Details</h3>

            <div style="margin-bottom:20px;">
              <strong style="font-size:14px;display:block;margin-bottom:12px;">Head Office – United Arab Emirates</strong>
              <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Wellness Within LLC – FZ</p>

              <div class="contact-detail-row">
                <div class="contact-detail-icon">📍</div>
                <div>
                  <p>Address</p>
                  <strong>Office #3402, Dome Tower, Cluster N, JLT, Dubai, UAE</strong>
                </div>
              </div>
              <div class="contact-detail-row">
                <div class="contact-detail-icon">✉️</div>
                <div>
                  <p>Email</p>
                  <strong>support@souksnap.com</strong>
                </div>
              </div>
              <div class="contact-detail-row">
                <div class="contact-detail-icon">📞</div>
                <div>
                  <p>Phone</p>
                  <strong>+971 582096944</strong>
                </div>
              </div>
            </div>

            <div>
              <strong style="font-size:14px;display:block;margin-bottom:12px;">Southeast Asia Office – Philippines</strong>
              <div class="contact-detail-row">
                <div class="contact-detail-icon">📍</div>
                <div>
                  <p>Address</p>
                  <strong>Unit 1503, Tower One, Ayala Triangle, Makati City, Metro Manila 1226</strong>
                </div>
              </div>
              <div class="contact-detail-row">
                <div class="contact-detail-icon">📞</div>
                <div>
                  <p>Phone</p>
                  <strong>+63 (2) 8XXX XXXX</strong>
                </div>
              </div>
            </div>
          </div>

          <div style="background:var(--white);border:1px solid var(--border);border-radius:12px;padding:24px;">
            <h4 style="font-size:20px;font-weight:700;margin-bottom:8px;">Let's Stay Connected</h4>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:16px;">Follow us on social media to stay updated with our latest deals, product launches, and announcements:</p>
            <div class="social-row">
              <a href="#" class="social-link" style="background:#1877f2;">f</a>
              <a href="#" class="social-link" style="background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);">📷</a>
              <a href="#" class="social-link" style="background:#1da1f2;">🐦</a>
              <a href="#" class="social-link" style="background:#0077b5;">in</a>
            </div>
          </div>
        </div>

        <div class="message-form">
          <h3>Send Us a Message</h3>
          <p>Your email address will not be published. Required fields are marked *</p>

          <div class="form-group">
            <input type="text" class="form-control" placeholder="Full Name" id="contact-name" required>
          </div>
          <div class="form-group">
            <input type="email" class="form-control" placeholder="Email Address" id="contact-email" required>
          </div>
          <div class="form-group">
            <input type="tel" class="form-control" placeholder="Mobile Number" id="contact-phone">
          </div>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Subject" id="contact-subject" required>
          </div>
          <div class="form-group">
            <textarea class="form-control" placeholder="Message" id="contact-message" rows="4" required></textarea>
          </div>
          <button class="btn-block" onclick="submitContactForm()">SUBMIT</button>
        </div>
      </div>
    </div>
  `;
}

function submitContactForm() {
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;

  if (!name || !email || !subject || !message) {
    showToast('Please fill in all required fields.');
    return;
  }

  showToast('Message sent! We\'ll get back to you soon.');
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-phone').value = '';
  document.getElementById('contact-subject').value = '';
  document.getElementById('contact-message').value = '';
}

// ---- SIGN IN ----
function renderSignIn() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Sign In</h2>

        <div class="form-group">
          <input type="text" class="form-control light" placeholder="Email or Phone" id="signin-email">
        </div>
        <div class="form-group">
          <input type="password" class="form-control light" placeholder="Password" id="signin-password">
        </div>

        <div class="checkbox-row">
          <label class="checkbox-label">
            <input type="checkbox" id="remember-me">
            Remember Me
          </label>
          <a href="#" class="forgot-link">Forgot Your Password?</a>
        </div>

        <button class="btn-block" onclick="submitSignIn()">SIGN IN</button>

        <div class="auth-footer">
          Don't have an account? <a href="#" onclick="navigateTo('signup');return false;">Sign Up</a>
        </div>
      </div>
    </div>
  `;
}

function submitSignIn() {
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;

  if (!email || !password) {
    showToast('Please enter your email and password.');
    return;
  }

  // Simulate sign-in
  const name = email.includes('@') ? email.split('@')[0] : email;
  state.user = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
  updateHeaderUser();
  showToast(`Welcome back, ${state.user.name}!`);
  navigateTo('home');
}

// ---- SIGN UP ----
function renderSignUp() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Sign Up</h2>

        <div class="auth-form-row">
          <div class="form-group">
            <input type="text" class="form-control light" placeholder="Full Name" id="signup-name">
          </div>
          <div class="form-group">
            <div class="phone-input-group">
              <button class="phone-flag" type="button">🇮🇳 +91 ▾</button>
              <input type="tel" class="form-control light" placeholder="Phone Number" id="signup-phone">
            </div>
          </div>
        </div>

        <div class="form-group">
          <input type="email" class="form-control light" placeholder="Email" id="signup-email">
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <input type="password" class="form-control light" placeholder="Password" id="signup-password">
          </div>
          <div class="form-group">
            <input type="password" class="form-control light" placeholder="Confirm Password" id="signup-confirm">
          </div>
        </div>

        <div class="form-group">
          <input type="text" class="form-control light" placeholder="Address" id="signup-address">
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <select class="form-control light" id="signup-country">
              <option value="">Select Country</option>
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
              <option value="IN">India</option>
              <option value="PK">Pakistan</option>
              <option value="PH">Philippines</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>
          <div class="form-group">
            <input type="text" class="form-control light" placeholder="City" id="signup-city">
          </div>
          <div class="form-group">
            <input type="text" class="form-control light" placeholder="Postal Code" id="signup-postal">
          </div>
        </div>

        <button class="btn-block" onclick="submitSignUp()">SIGN UP</button>

        <div class="auth-footer">
          Already have an account? <a href="#" onclick="navigateTo('signin');return false;">Sign In</a>
        </div>
      </div>
    </div>
  `;
}

function submitSignUp() {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (!name || !email || !password || !confirm) {
    showToast('Please fill in all required fields.');
    return;
  }

  if (password !== confirm) {
    showToast('Passwords do not match!');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters.');
    return;
  }

  state.user = { name, email };
  updateHeaderUser();
  showToast(`Welcome to Souksnap, ${name}!`);
  navigateTo('home');
}

// ---- CART ----
function renderCart() {
  const main = document.getElementById('main-content');
  const total = state.cartItems.reduce((sum, i) => sum + i.price, 0);

  main.innerHTML = `
    <div class="cart-page">
      <div class="cart-inner">
        <div class="cart-main">
          <h2>Cart Summary</h2>
          <p class="cart-count">${state.cartItems.length} Gift${state.cartItems.length !== 1 ? 's' : ''} in Cart</p>

          ${state.cartItems.length === 0 ? `
            <div style="background:white;border-radius:8px;padding:48px;text-align:center;border:1px solid var(--border);">
              <div style="font-size:48px;margin-bottom:16px;">🛒</div>
              <p style="color:var(--text-muted);font-size:16px;">Your cart is empty</p>
              <button class="btn-primary" style="margin-top:20px;" onclick="navigateTo('digital')">Start Shopping</button>
            </div>
          ` : state.cartItems.map(item => `
            <div class="cart-item">
              <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/80x80/f0f0f0/999?text=IMG'">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price"><span class="currency">AED</span>${item.price}</div>
              </div>
              <span class="cart-remove" onclick="removeFromCart(${item.id})" title="Remove">✕</span>
            </div>
          `).join('')}
        </div>

        <div>
          <div class="order-summary">
            <h3>Order Summary</h3>
            <div class="order-row">
              <span>Order Total</span>
              <span class="amount">AED ${total}</span>
            </div>
            <div class="order-row total">
              <span>Total Amount</span>
              <span class="amount">AED ${total}</span>
            </div>
            <button class="btn-block" style="margin-top:20px;" onclick="checkout()" ${state.cartItems.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>BUY NOW</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function checkout() {
  if (!state.user) {
    showToast('Please sign in to complete your purchase.');
    navigateTo('signin');
    return;
  }
  showToast('Order placed successfully! Thank you for shopping with Souksnap.');
  state.cartItems = [];
  updateCartBadge();
  renderCart();
}

// ---- GIFT DETAIL ----
function renderGiftDetail(productJson) {
  const product = typeof productJson === 'string' ? JSON.parse(productJson) : productJson;
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="gift-detail">
      <div>
        <div class="gift-img-card">
          <img src="${product.img}" alt="${product.name}" onerror="this.src='https://placehold.co/380x280/f0f0f0/999?text=Product'" style="max-width:100%;">
        </div>
      </div>

      <div class="gift-info">
        <h1>${product.name}</h1>
        <p class="subtitle">EPAY C2C XSX/XB1 EA Sports FC 24 Ultimate Edition (AE)</p>

        <div class="gift-select-box">
          <h3>Select card value</h3>

          <div class="value-options">
            <button class="value-btn active" onclick="selectValue(this, 200)">AED 200</button>
            <button class="value-btn" onclick="selectValue(this, 0)">Other</button>
          </div>

          <div id="custom-amount-wrap" style="display:none;margin-bottom:16px;">
            <input type="number" class="form-control light" placeholder="Custom Amount" id="custom-amount" min="10" step="10">
          </div>

          <div class="gift-tabs">
            <button class="gift-tab" onclick="switchGiftTab(this, 'gift')">This is a gift</button>
            <button class="gift-tab active" onclick="switchGiftTab(this, 'me')">This is for me</button>
          </div>

          <div class="gift-tab-content" id="tab-gift">
            <div class="form-group">
              <input type="email" class="form-control light" placeholder="Their Email">
            </div>
            <div class="form-group">
              <input type="text" class="form-control light" placeholder="Your Name/s">
            </div>
            <div class="form-group">
              <textarea class="form-control light" placeholder="Add a Personal Message" rows="3"></textarea>
            </div>
            <div class="form-group">
              <input type="date" class="form-control light" placeholder="dd/mm/yyyy">
            </div>
          </div>

          <div class="gift-tab-content active" id="tab-me">
            <p>Buying for yourself? We'll send the gift card to your Registered email address.</p>
          </div>

          <button class="btn-block" onclick="addToCart(${JSON.stringify(JSON.stringify(product))})">ADD TO CART</button>
        </div>

        <div class="gift-about">
          <h3>About these gift cards</h3>
          <ul>
            <li>Securely sent via registered post</li>
            <li>Arrives within 5–10 business days</li>
            <li>Delivery fees from AED 5.50 per address</li>
            <li>Order up to 10 gift cards at a time</li>
            <li>Deliver to the same or multiple addresses</li>
            <li>Every card valid for 4 years</li>
            <li>See our gift card purchase terms & conditions</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function selectValue(btn, val) {
  document.querySelectorAll('.value-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('custom-amount-wrap').style.display = val === 0 ? 'block' : 'none';
}

function switchGiftTab(btn, tab) {
  document.querySelectorAll('.gift-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.gift-tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
}

// ---- SEARCH ----
function renderSearch(query) {
  const main = document.getElementById('main-content');
  const results = products.filter(p =>
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
    </div>
  `;
}

// Override addToCart to parse JSON string if needed
const _origAddToCart = addToCart;
window.addToCart = function(productOrJson) {
  let product = productOrJson;
  if (typeof productOrJson === 'string') {
    try { product = JSON.parse(productOrJson); } catch(e) {}
  }
  _origAddToCart(product);
};
