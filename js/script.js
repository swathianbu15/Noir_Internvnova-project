/**
 * NOIR — Premium Store
 * Web Development Internship Project Script
 * Core Functionality: Product Catalogue, Dynamic Filters, Shopping Bag, LocalStorage, Demo Checkout
 */

// 1. Product Catalogue Data
const products = [
  {
    id: 1,
    name: "Arc Everyday Tote",
    category: "Accessories",
    price: 1899,
    tag: "BESTSELLER",
    rating: "4.9",
    reviews: 82,
    image: "https://images.unsplash.com/photo-1590870702355-7f3e5d7f2b2f?auto=format&fit=crop&w=700&q=80",
    alt: "Minimalist durable canvas everyday tote bag"
  },
  {
    id: 2,
    name: "Form Studio Bottle",
    category: "Lifestyle",
    price: 1299,
    tag: "NEW",
    rating: "4.8",
    reviews: 56,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80",
    alt: "Matte black insulated water bottle"
  },
  {
    id: 3,
    name: "Everyday Heavy Tee",
    category: "Apparel",
    price: 1499,
    tag: "CORE PIECE",
    rating: "4.9",
    reviews: 104,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    alt: "Premium heavyweight organic cotton t-shirt"
  },
  {
    id: 4,
    name: "Sculpture Desk Lamp",
    category: "Lifestyle",
    price: 3299,
    tag: "DESIGN PICK",
    rating: "4.7",
    reviews: 38,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
    alt: "Architectural modern minimalist desk lamp"
  },
  {
    id: 5,
    name: "Daily Carry Crossbody",
    category: "Accessories",
    price: 2499,
    tag: "LOW STOCK",
    rating: "4.8",
    reviews: 61,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    alt: "Structured weather-resistant crossbody bag"
  },
  {
    id: 6,
    name: "Relaxed Linen Shirt",
    category: "Apparel",
    price: 2799,
    tag: "NEW",
    rating: "4.9",
    reviews: 47,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80",
    alt: "Breathable natural linen shirt"
  },
  {
    id: 7,
    name: "Mono Wireless Headphones",
    category: "Lifestyle",
    price: 4599,
    tag: "STAFF FAVOURITE",
    rating: "4.8",
    reviews: 93,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    alt: "Over-ear minimalist wireless headphones"
  },
  {
    id: 8,
    name: "Everyday Canvas Cap",
    category: "Accessories",
    price: 999,
    tag: "EASY ESSENTIAL",
    rating: "4.6",
    reviews: 29,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80",
    alt: "Low-profile neutral baseball cap"
  }
];

// 2. Constants & Application State
const CART_STORAGE_KEY = "noir-store-cart-v1";
const FREE_SHIPPING_THRESHOLD = 2499;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const appState = {
  category: "All",
  searchQuery: "",
  sortBy: "featured",
  cart: loadCartFromStorage()
};

const dom = (id) => document.getElementById(id);

// 3. LocalStorage Persistence Functions
function loadCartFromStorage() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored
      .filter(item => products.some(p => p.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
      .map(item => ({ id: item.id, quantity: Math.min(item.quantity, 99) }));
  } catch (err) {
    console.warn("Could not load cart from localStorage", err);
    return [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(appState.cart));
  } catch (err) {
    showToast("Notice: Local storage unavailable on this device.");
  }
}

// 4. Product Filtering & Sorting
function getFilteredProducts() {
  let list = products.filter(product => {
    const matchesCategory = appState.category === "All" || product.category === appState.category;
    const query = appState.searchQuery.trim().toLowerCase();
    const matchesSearch = !query || `${product.name} ${product.category} ${product.tag}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (appState.sortBy === "price-low") list.sort((a, b) => a.price - b.price);
  if (appState.sortBy === "price-high") list.sort((a, b) => b.price - a.price);
  if (appState.sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
}

// 5. Product Rendering
function renderProducts() {
  const visibleProducts = getFilteredProducts();
  const productGrid = dom("productGrid");
  const emptyState = dom("emptyState");

  if (visibleProducts.length === 0) {
    productGrid.classList.add("hidden");
    emptyState.classList.remove("hidden");
  } else {
    productGrid.classList.remove("hidden");
    emptyState.classList.add("hidden");

    productGrid.innerHTML = visibleProducts.map(product => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${product.image}" alt="${product.alt}" loading="lazy">
          <span class="product-tag">${product.tag}</span>
          <button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to bag">
            <span>ADD TO BAG</span>
            <span aria-hidden="true">＋</span>
          </button>
        </div>
        <div class="product-info">
          <div>
            <h3>${product.name}</h3>
            <span class="product-category">${product.category}</span>
          </div>
          <span class="product-price">${currencyFormatter.format(product.price)}</span>
        </div>
        <div class="product-rating">
          <span aria-hidden="true">★</span>
          <span>${product.rating}</span>
          <span style="color:#777d74">(${product.reviews})</span>
        </div>
      </article>
    `).join("");
  }

  dom("allCount").textContent = products.length;
  dom("resultsCount").textContent = `SHOWING ${visibleProducts.length} OF ${products.length} PIECES`;
}

// 6. Cart Management
function addToCart(productId) {
  const existingItem = appState.cart.find(item => item.id === productId);
  if (existingItem) {
    if (existingItem.quantity >= 99) {
      showToast("Maximum quantity limit (99) reached for this item.");
      return;
    }
    existingItem.quantity += 1;
  } else {
    appState.cart.push({ id: productId, quantity: 1 });
  }

  saveCartToStorage();
  renderCart();

  const product = products.find(p => p.id === productId);
  showToast(`Added "${product.name}" to your bag.`);
}

function updateQuantity(productId, delta) {
  const item = appState.cart.find(entry => entry.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    appState.cart = appState.cart.filter(entry => entry.id !== productId);
  } else if (item.quantity > 99) {
    item.quantity = 99;
  }

  saveCartToStorage();
  renderCart();
}

function removeFromCart(productId) {
  const product = products.find(p => p.id === productId);
  appState.cart = appState.cart.filter(item => item.id !== productId);
  saveCartToStorage();
  renderCart();
  if (product) {
    showToast(`Removed "${product.name}" from your bag.`);
  }
}

function calculateCartTotals() {
  return appState.cart.reduce((totals, item) => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      totals.itemCount += item.quantity;
      totals.subtotal += product.price * item.quantity;
    }
    return totals;
  }, { itemCount: 0, subtotal: 0 });
}

function renderCart() {
  const { itemCount, subtotal } = calculateCartTotals();

  dom("headerCartCount").textContent = itemCount;
  dom("drawerCartCount").textContent = `(${itemCount})`;
  dom("cartSubtotal").textContent = currencyFormatter.format(subtotal);

  const cartEmpty = dom("cartEmpty");
  const cartFooter = dom("cartFooter");
  const cartItems = dom("cartItems");

  if (itemCount === 0) {
    cartEmpty.classList.remove("hidden");
    cartFooter.classList.add("hidden");
    cartItems.classList.add("hidden");
  } else {
    cartEmpty.classList.add("hidden");
    cartFooter.classList.remove("hidden");
    cartItems.classList.remove("hidden");

    cartItems.innerHTML = appState.cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return "";
      return `
        <div class="cart-line" role="listitem">
          <img src="${product.image}" alt="${product.alt}">
          <div>
            <h3>${product.name}</h3>
            <p>${currencyFormatter.format(product.price)}</p>
            <div class="quantity-control">
              <button data-qty-id="${product.id}" data-change="-1" aria-label="Decrease quantity for ${product.name}">−</button>
              <span aria-label="Current quantity">${item.quantity}</span>
              <button data-qty-id="${product.id}" data-change="1" aria-label="Increase quantity for ${product.name}">＋</button>
            </div>
          </div>
          <div class="cart-line-price">
            <div>${currencyFormatter.format(product.price * item.quantity)}</div>
            <button class="remove-item" data-remove-id="${product.id}" aria-label="Remove ${product.name} from bag">Remove</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Shipping threshold calculation
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingNote = dom("shippingNote");
  if (remaining > 0) {
    shippingNote.textContent = `You're ${currencyFormatter.format(remaining)} away from complimentary shipping.`;
  } else {
    shippingNote.textContent = "✦ Complimentary shipping unlocked on this order.";
  }
}

// 7. Drawer & Modal Controls
function openCartDrawer() {
  const drawer = dom("cartDrawer");
  const overlay = dom("overlay");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  dom("closeCart").focus();
}

function closeCartDrawer() {
  const drawer = dom("cartDrawer");
  const overlay = dom("overlay");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

// 8. Toast Feedback Helper
let toastTimeout;
function showToast(message) {
  const toast = dom("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// 9. Event Listeners Initialization
function initEventListeners() {
  // Add to cart delegation
  dom("productGrid").addEventListener("click", event => {
    const addBtn = event.target.closest("[data-add]");
    if (addBtn) addToCart(Number(addBtn.dataset.add));
  });

  // Cart quantity & remove delegation
  dom("cartItems").addEventListener("click", event => {
    const qtyBtn = event.target.closest("[data-qty-id]");
    const removeBtn = event.target.closest("[data-remove-id]");
    if (qtyBtn) updateQuantity(Number(qtyBtn.dataset.qtyId), Number(qtyBtn.dataset.change));
    if (removeBtn) removeFromCart(Number(removeBtn.dataset.removeId));
  });

  // Category filter tabs
  dom("categoryFilters").addEventListener("click", event => {
    const chip = event.target.closest("[data-category]");
    if (!chip) return;
    appState.category = chip.dataset.category;
    document.querySelectorAll(".filter-chip").forEach(btn => {
      const isActive = btn === chip;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
    renderProducts();
  });

  // Search input with dynamic filtering
  dom("searchInput").addEventListener("input", event => {
    appState.searchQuery = event.target.value;
    renderProducts();
  });

  // Sort dropdown
  dom("sortSelect").addEventListener("change", event => {
    appState.sortBy = event.target.value;
    renderProducts();
  });

  // Reset filters
  dom("resetFilters").addEventListener("click", () => {
    appState.category = "All";
    appState.searchQuery = "";
    appState.sortBy = "featured";
    dom("searchInput").value = "";
    dom("sortSelect").value = "featured";
    document.querySelectorAll(".filter-chip").forEach(chip => {
      const isAll = chip.dataset.category === "All";
      chip.classList.toggle("active", isAll);
      chip.setAttribute("aria-selected", String(isAll));
    });
    renderProducts();
  });

  // Focus search trigger
  dom("searchFocus").addEventListener("click", () => {
    dom("shop").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => dom("searchInput").focus(), 300);
  });

  // Cart open/close triggers
  dom("openCart").addEventListener("click", openCartDrawer);
  dom("closeCart").addEventListener("click", closeCartDrawer);
  dom("overlay").addEventListener("click", closeCartDrawer);
  dom("continueShopping").addEventListener("click", () => {
    closeCartDrawer();
    dom("shop").scrollIntoView({ behavior: "smooth" });
  });

  // Mobile menu toggle
  const menuToggle = dom("menuToggle");
  const mainNav = dom("mainNav");
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.querySelector(".menu-icon").textContent = isOpen ? "✕" : "☰";
  });

  // Close mobile menu on nav link click
  mainNav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.querySelector(".menu-icon").textContent = "☰";
    }
  });

  // Keyboard accessibility (Escape key closes overlays/dialogs or clears search)
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeCartDrawer();
      const checkoutDialog = dom("checkoutDialog");
      if (checkoutDialog.open) checkoutDialog.close();
      if (mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.querySelector(".menu-icon").textContent = "☰";
      }
      if (document.activeElement === dom("searchInput")) {
        dom("searchInput").value = "";
        appState.searchQuery = "";
        renderProducts();
        dom("searchInput").blur();
      }
    }
  });

  // Newsletter form submission
  dom("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();
    const emailInput = dom("emailInput");
    const msg = dom("newsletterMessage");
    const emailVal = emailInput.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      msg.textContent = "Please provide a valid email address.";
      msg.style.color = "#4a120b";
      return;
    }

    msg.textContent = "Thank you for subscribing to NOIR Journal.";
    msg.style.color = "inherit";
    emailInput.value = "";
  });

  // Demo checkout modal
  dom("checkoutButton").addEventListener("click", () => {
    if (appState.cart.length === 0) {
      showToast("Your shopping bag is empty.");
      return;
    }
    closeCartDrawer();
    dom("checkoutMessage").textContent = "";
    dom("checkoutDialog").showModal();
    dom("customerName").focus();
  });

  dom("closeCheckout").addEventListener("click", () => dom("checkoutDialog").close());

  dom("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const msg = dom("checkoutMessage");

    if (!form.checkValidity()) {
      msg.textContent = "Please fill in all required fields accurately.";
      form.reportValidity();
      return;
    }

    const { itemCount, subtotal } = calculateCartTotals();
    msg.textContent = `Demo order placed! ${itemCount} items (${currencyFormatter.format(subtotal)}). Simulation only.`;
    
    // Clear cart upon successful demo order
    appState.cart = [];
    saveCartToStorage();
    renderCart();
    form.reset();

    setTimeout(() => {
      if (dom("checkoutDialog").open) dom("checkoutDialog").close();
    }, 2800);
  });

  // Current year in footer
  dom("year").textContent = new Date().getFullYear();
}

// 10. Initialization
initEventListeners();
renderProducts();
renderCart();

// URL Query Helpers for Testing / Preview
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("view") === "cart") {
  addToCart(1);
  addToCart(3);
  openCartDrawer();
} else if (urlParams.get("view") === "catalog") {
  window.scrollTo(0, 700);
}
