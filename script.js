
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    rating: 4.8,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Classic Sneakers",
    category: "Fashion",
    price: 1899,
    rating: 4.6,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Electronics",
    price: 3299,
    rating: 4.7,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Minimalist Backpack",
    category: "Accessories",
    price: 1499,
    rating: 4.5,
    badge: "",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Modern Table Lamp",
    category: "Home",
    price: 999,
    rating: 4.4,
    badge: "GREAT VALUE",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Premium Sunglasses",
    category: "Accessories",
    price: 799,
    rating: 4.3,
    badge: "",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Everyday T-Shirt",
    category: "Fashion",
    price: 599,
    rating: 4.5,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Ceramic Coffee Mug",
    category: "Home",
    price: 399,
    rating: 4.6,
    badge: "",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Portable Speaker",
    category: "Electronics",
    price: 1799,
    rating: 4.5,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Leather Wallet",
    category: "Accessories",
    price: 699,
    rating: 4.2,
    badge: "",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Travel Water Bottle",
    category: "Home",
    price: 499,
    rating: 4.4,
    badge: "",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Running Shoes",
    category: "Fashion",
    price: 2199,
    rating: 4.7,
    badge: "TOP RATED",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  }
];

// DOM elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const categoryFilters = document.getElementById("categoryFilters");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartSubtitle = document.getElementById("cartSubtitle");
const toast = document.getElementById("toast");

// App state
let activeCategory = "All";
let searchTerm = "";
let toastTimeout;

// Load saved cart safely
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("shopease-cart") || "[]");

    if (!Array.isArray(saved)) return [];

    return saved
      .filter(item =>
        products.some(product => product.id === item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 99
      )
      .map(item => ({
        id: item.id,
        quantity: item.quantity
      }));
  } catch {
    return [];
  }
}

let cart = loadCart();

// Format prices in Indian Rupees
function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

// Escape text before inserting dynamic content into HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Save cart to browser storage
function saveCart() {
  try {
    localStorage.setItem("shopease-cart", JSON.stringify(cart));
  } catch {
    showToast("Cart is available for this session only.");
  }
}

// Display notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Product cards
function renderProducts() {
  let filtered = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  switch (sortSelect.value) {
    case "low":
      filtered.sort((a, b) => a.price - b.price);
      break;

    case "high":
      filtered.sort((a, b) => b.price - a.price);
      break;

    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  resultCount.textContent =
    `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;

  emptyState.hidden = filtered.length !== 0;
  productGrid.hidden = filtered.length === 0;

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/500x500/f7f6fc/6c4be8?text=Product'"
        />
        ${product.badge
          ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
          : ""}
      </div>

      <div class="product-info">
        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <h3>${escapeHTML(product.name)}</h3>

        <div class="product-rating">
          ★★★★★ <span>${product.rating.toFixed(1)} / 5</span>
        </div>

        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>

          <button
            class="add-button"
            data-add="${product.id}"
            aria-label="Add ${escapeHTML(product.name)} to cart"
            title="Add to cart"
          >+</button>
        </div>
      </div>
    </article>
  `).join("");
}

// Update category buttons
function setCategory(category) {
  activeCategory = category;

  document.querySelectorAll("[data-category]").forEach(button => {
    const isActive = button.dataset.category === category;

    button.classList.toggle("active", isActive);

    if (button.classList.contains("nav-link")) {
      if (isActive) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    }
  });

  renderProducts();
}

// Product event delegation
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  addToCart(Number(button.dataset.add));
});

// Search
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
});

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
});

// Category filters
categoryFilters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (button) setCategory(button.dataset.category);
});

// Top navigation categories
document.querySelectorAll(".navbar [data-category]").forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
  });
});

// Sort products
sortSelect.addEventListener("change", renderProducts);

// Reset filters
document.getElementById("resetFilters").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  sortSelect.value = "featured";
  setCategory("All");
});

// Add a product
function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    if (existing.quantity >= 99) {
      showToast("Maximum quantity is 99 per product.");
      return;
    }

    existing.quantity++;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} added to cart!`);
}

// Change quantity
function changeQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  } else if (item.quantity > 99) {
    item.quantity = 99;
    showToast("Maximum quantity is 99.");
  }

  saveCart();
  renderCart();
}

// Remove item
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);

  saveCart();
  renderCart();
  showToast("Product removed from cart.");
}

// Render cart
function renderCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalItems;
  cartSubtitle.textContent =
    `${totalItems} item${totalItems === 1 ? "" : "s"} in your bag`;
  cartSubtotal.textContent = formatPrice(subtotal);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div>🛒</div>
        <h3>Your cart is empty</h3>
        <p>Explore our products and find something you love.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return "";

    return `
      <div class="cart-item">
        <img
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
          onerror="this.onerror=null;this.src='https://placehold.co/200x200/f7f6fc/6c4be8?text=Product'"
        />

        <div>
          <h3>${escapeHTML(product.name)}</h3>
          <div class="item-price">${formatPrice(product.price)}</div>

          <div class="quantity-control">
            <button
              data-quantity="${product.id}"
              data-change="-1"
              aria-label="Decrease quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              data-quantity="${product.id}"
              data-change="1"
              aria-label="Increase quantity"
              ${item.quantity >= 99 ? "disabled" : ""}
            >+</button>
          </div>

          <button
            class="remove-button"
            data-remove="${product.id}"
          >Remove</button>
        </div>

        <strong>${formatPrice(product.price * item.quantity)}</strong>
      </div>
    `;
  }).join("");
}

// Cart event delegation
cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

// Open and close cart drawer
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("cart-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("cart-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.getElementById("openCart").focus();
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
    closeCart();
  }
});

// Demo checkout
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty. Add a product first.");
    return;
  }

  showToast("Demo checkout: connect a payment service to continue.");
});

// Demo newsletter form
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const email = document.getElementById("emailInput").value.trim();

  if (!email) return;

  showToast("Thanks for your interest! Newsletter signup is a demo.");
  event.target.reset();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial rendering
renderProducts();
renderCart();
