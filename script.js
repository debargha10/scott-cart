const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt-card]");
const themeButtons = document.querySelectorAll("[data-theme-toggle]");
const authButtons = document.querySelectorAll("[data-auth-button]");
const cartCountNodes = document.querySelectorAll("[data-cart-count]");
const methodTabs = document.querySelectorAll("[data-method-tab]");
const paymentPanels = document.querySelectorAll("[data-payment-panel]");

const THEME_KEY = "scottcart-theme";
const AUTH_KEY = "scottcart-auth";
const CART_KEY = "scottcart-cart";
const PENDING_ITEM_KEY = "scottcart-pending-item";
const LOCATIONS_KEY = "scottcart-locations";

const themes = ["cloud", "obsidian", "sunset"];
const themeLabels = {
  cloud: "Cloud",
  obsidian: "Obsidian",
  sunset: "Sunset",
};

const getCurrentReturnPath = () => {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  return `${fileName}${window.location.search}`;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartIndicators();
};

const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
};

const setAuth = (payload) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  updateAuthUI();
};

const showToast = (message) => {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2500);
};

const updateCartIndicators = () => {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);

  cartCountNodes.forEach((node) => {
    node.textContent = count;
  });
};

const updateAuthUI = () => {
  const auth = getAuth();

  authButtons.forEach((button) => {
    if (auth) {
      button.textContent = auth.name ? `Hi, ${auth.name.split(" ")[0]}` : "Account";
      button.setAttribute("href", "login.html");
    } else {
      button.textContent = "Log In / Sign Up";
      button.setAttribute("href", "login.html");
    }
  });
};

const redirectToLogin = (pendingItem) => {
  if (pendingItem) {
    localStorage.setItem(PENDING_ITEM_KEY, JSON.stringify(pendingItem));
  }

  const currentUrl = getCurrentReturnPath();
  window.location.href = `login.html?return=${encodeURIComponent(currentUrl)}`;
};

const addItemToCart = (item) => {
  const cart = getCart();
  const existingItem = cart.find((entry) => entry.name === item.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);

  const total = cart.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
  showToast(`${item.name} added for ${formatCurrency(item.price)}. Cart total ${formatCurrency(total)}.`);
};

const handleAddToCartButtons = () => {
  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const item = {
        name: button.dataset.name,
        price: Number(button.dataset.price),
        category: button.dataset.category || "General",
      };

      if (!getAuth()) {
        redirectToLogin(item);
        return;
      }

      addItemToCart(item);
    });
  });
};

const renderCart = () => {
  const cartList = document.querySelector("[data-cart-list]");
  const emptyState = document.querySelector("[data-cart-empty]");

  if (!cartList) {
    return;
  }

  const cart = getCart();
  cartList.innerHTML = "";

  if (!cart.length) {
    emptyState?.classList.remove("hidden");
  } else {
    emptyState?.classList.add("hidden");

    cart.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "cart-item";
      article.innerHTML = `
        <div class="cart-thumb"></div>
        <div>
          <div class="cart-meta">
            <strong>${item.name}</strong>
            <span class="muted">${item.category}</span>
          </div>
          <p class="product-meta">Quantity ${item.quantity}</p>
          <p class="product-meta">${formatCurrency(item.price)} each</p>
        </div>
        <div class="button-row">
          <span class="price-tag">${formatCurrency(item.price * item.quantity)}</span>
          <button class="ghost-button" type="button" data-remove-index="${index}">Remove</button>
        </div>
      `;
      cartList.appendChild(article);
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length ? 0 : 0;
  const total = subtotal + shipping;

  document.querySelectorAll("[data-cart-subtotal]").forEach((node) => {
    node.textContent = formatCurrency(subtotal);
  });

  document.querySelectorAll("[data-cart-shipping]").forEach((node) => {
    node.textContent = shipping === 0 ? "Free" : formatCurrency(shipping);
  });

  document.querySelectorAll("[data-cart-total]").forEach((node) => {
    node.textContent = formatCurrency(total);
  });
};

const attachCartEvents = () => {
  const cartList = document.querySelector("[data-cart-list]");

  if (!cartList) {
    return;
  }

  cartList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-index]");

    if (!button) {
      return;
    }

    const cart = getCart();
    cart.splice(Number(button.dataset.removeIndex), 1);
    saveCart(cart);
    renderCart();
  });
};

const setupTheme = () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(THEME_KEY) || "cloud";
  root.dataset.theme = savedTheme;

  themeButtons.forEach((button) => {
    button.querySelector(".theme-label").textContent = themeLabels[savedTheme];
    button.addEventListener("click", () => {
      const current = root.dataset.theme || "cloud";
      const nextTheme = themes[(themes.indexOf(current) + 1) % themes.length];
      root.dataset.theme = nextTheme;
      localStorage.setItem(THEME_KEY, nextTheme);
      themeButtons.forEach((node) => {
        node.querySelector(".theme-label").textContent = themeLabels[nextTheme];
      });
      showToast(`Theme changed to ${themeLabels[nextTheme]}.`);
    });
  });
};

const setupReveal = () => {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

const setupTilt = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  tiltCards.forEach((card) => {
    const handleMove = (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - 0.5) * 14;
      const rotateX = (0.5 - y) * 14;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const reset = () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("pointermove", handleMove);
    card.addEventListener("pointerleave", reset);
  });
};

const setupLogin = () => {
  const form = document.querySelector("[data-auth-form]");
  const skipButton = document.querySelector("[data-skip-login]");

  if (!form) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get("return") || "index.html";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const profile = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      audience: formData.getAll("audience"),
    };

    if (!profile.name || (!profile.email && !profile.phone)) {
      showToast("Add your name and either email or phone to continue.");
      return;
    }

    setAuth(profile);

    const pendingItemRaw = localStorage.getItem(PENDING_ITEM_KEY);
    if (pendingItemRaw) {
      try {
        addItemToCart(JSON.parse(pendingItemRaw));
      } catch {
        // Ignore malformed storage
      }
      localStorage.removeItem(PENDING_ITEM_KEY);
    } else {
      showToast("You are signed in and ready to shop.");
    }

    window.location.href = returnUrl;
  });

  skipButton?.addEventListener("click", () => {
    window.location.href = returnUrl;
  });
};

const setupContact = () => {
  const form = document.querySelector("[data-contact-form]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    if (!email && !phone) {
      showToast("Add an email or phone number so we can contact you.");
      return;
    }

    form.reset();
    showToast(email ? `Ask sent from ${email}. We will reach out soon.` : `Ask sent for ${phone}. We will reach out soon.`);
  });
};

const setupLocations = () => {
  const form = document.querySelector("[data-location-form]");
  const list = document.querySelector("[data-location-list]");

  if (!form || !list) {
    return;
  }

  const renderLocations = () => {
    const locations = JSON.parse(localStorage.getItem(LOCATIONS_KEY) || "[]");
    list.innerHTML = "";

    if (!locations.length) {
      list.innerHTML = `<div class="empty-state soft-panel"><p class="empty-copy">No saved locations yet. Add a home, work, or other address.</p></div>`;
      return;
    }

    locations.forEach((location, index) => {
      const card = document.createElement("article");
      card.className = "location-card";
      card.innerHTML = `
        <div class="location-meta">
          <h3>${location.label}</h3>
          <button class="ghost-button" type="button" data-remove-location="${index}">Remove</button>
        </div>
        <p class="mini-label">${location.type}</p>
        <p class="panel-copy">${location.address}</p>
      `;
      list.appendChild(card);
    });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const entry = {
      label: String(formData.get("label") || "").trim(),
      type: String(formData.get("type") || "other").trim(),
      address: String(formData.get("address") || "").trim(),
    };

    if (!entry.label || !entry.address) {
      showToast("Add a location name and address.");
      return;
    }

    const locations = JSON.parse(localStorage.getItem(LOCATIONS_KEY) || "[]");
    const normalizedAddress = entry.address.toLowerCase();
    const duplicateLabel = locations.some(
      (location) => location.label.toLowerCase() === entry.label.toLowerCase()
    );

    if (duplicateLabel) {
      showToast("Location names must be unique.");
      return;
    }

    const homeLocation = locations.find((location) => location.type === "home");
    const workLocation = locations.find((location) => location.type === "work");

    if (entry.type === "home" && workLocation && workLocation.address.toLowerCase() === normalizedAddress) {
      showToast("Home and work addresses must stay different.");
      return;
    }

    if (entry.type === "work" && homeLocation && homeLocation.address.toLowerCase() === normalizedAddress) {
      showToast("Work and home addresses must stay different.");
      return;
    }

    locations.push(entry);
    localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
    form.reset();
    renderLocations();
    showToast(`${entry.label} saved.`);
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-location]");

    if (!button) {
      return;
    }

    const locations = JSON.parse(localStorage.getItem(LOCATIONS_KEY) || "[]");
    locations.splice(Number(button.dataset.removeLocation), 1);
    localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
    renderLocations();
    showToast("Location removed.");
  });

  renderLocations();
};

const setupPayment = () => {
  const form = document.querySelector("[data-payment-form]");
  const totalNode = document.querySelector("[data-payment-total]");

  if (!form) {
    return;
  }

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (totalNode) {
    totalNode.textContent = formatCurrency(total);
  }

  methodTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const method = button.dataset.method;

      methodTabs.forEach((tab) => tab.classList.toggle("is-active", tab === button));
      paymentPanels.forEach((panel) => panel.classList.toggle("hidden", panel.dataset.paymentPanel !== method));
      form.dataset.selectedMethod = method;
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!getAuth()) {
      redirectToLogin();
      return;
    }

    const formData = new FormData(form);
    const method = form.dataset.selectedMethod || "card";

    if (!cart.length) {
      showToast("Your cart is empty right now.");
      return;
    }

    if (method === "upi") {
      const upiId = String(formData.get("upi") || "").trim();

      if (!upiId) {
        showToast("Add your UPI ID to receive the payment request.");
        return;
      }

      showToast(`Payment request sent to ${upiId}.`);
    } else {
      const cardNumber = String(formData.get("cardNumber") || "").trim();
      const cardName = String(formData.get("cardName") || "").trim();

      if (!cardNumber || !cardName) {
        showToast("Complete your card details to continue.");
        return;
      }

      showToast("Card payment authorized. Order confirmed.");
    }

    localStorage.removeItem(CART_KEY);
    updateCartIndicators();
    window.setTimeout(() => {
      window.location.href = "cart.html";
    }, 900);
  });
};

const setupProtectedButtons = () => {
  document.querySelectorAll("[data-requires-auth]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (getAuth()) {
        return;
      }

      event.preventDefault();
      redirectToLogin();
    });
  });
};

setupReveal();
setupTilt();
setupTheme();
updateCartIndicators();
updateAuthUI();
handleAddToCartButtons();
renderCart();
attachCartEvents();
setupLogin();
setupContact();
setupLocations();
setupPayment();
setupProtectedButtons();
