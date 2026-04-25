const tiltTargets = document.querySelectorAll("[data-tilt-card]");
const themeButtons = document.querySelectorAll("[data-theme-toggle]");
const cartCountNodes = document.querySelectorAll("[data-cart-count]");
const authButtons = document.querySelectorAll("[data-auth-button]");

const THEME_KEY = "scottcart-theme";
const AUTH_KEY = "scottcart-auth";
const CART_KEY = "scottcart-cart";
const LOCATIONS_KEY = "scottcart-locations";
const PENDING_PRODUCT_KEY = "scottcart-pending-product";
const PENDING_ACTION_KEY = "scottcart-pending-action";
const IMAGE_LIBRARY_PATH = "assets/data/image-library.json";

const themes = ["default", "obsidian", "sunset", "black-drip"];
const themeLabels = {
  default: "Noir",
  obsidian: "Obsidian",
  sunset: "Sunset",
  "black-drip": "Black Drip",
};

const PRODUCT_CATALOG = {
  "static-drip-tee": {
    name: "Static Drip Tee",
    category: "T-shirt",
    price: 1899,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A heavyweight Lil-noir inspired street tee with sharp typography, premium cotton, and a clean oversized silhouette.",
    angles: ["Front Angle", "Side Angle", "Back Angle", "Fabric Detail", "Fit Preview"],
  },
  "midnight-pulse-hoodie": {
    name: "Midnight Pulse Hoodie",
    category: "Hoodie",
    price: 3499,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Oversized premium hoodie with reflective accents and a deep monochrome finish designed for layered styling.",
    angles: ["Front Angle", "Right Side", "Back Angle", "Pocket Detail", "Fit Preview"],
  },
  "cloudline-sweatshirt": {
    name: "Cloudline Sweatshirt",
    category: "Sweat-Shirt",
    price: 2799,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A minimal premium sweatshirt balancing soft fleece comfort with a polished fashion-forward cut.",
    angles: ["Front Angle", "Left Side", "Back Angle", "Collar Detail", "Fit Preview"],
  },
  "blue-shift-denim": {
    name: "Blue Shift Denim",
    category: "Jeans",
    price: 3999,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Structured denim with subtle seam articulation and a rich dark wash for elevated everyday wear.",
    angles: ["Front Angle", "Side Angle", "Back Angle", "Pocket Detail", "Fit Preview"],
  },
  "vector-track-pant": {
    name: "Vector Track Pant",
    category: "Track Pant",
    price: 2499,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A technical track pant designed for street styling with a relaxed profile and clean taper.",
    angles: ["Front Angle", "Left Side", "Back Angle", "Waist Detail", "Fit Preview"],
  },
  "silk-mark-band": {
    name: "Silk Mark Handkerchief",
    category: "Handkerchief",
    price: 599,
    sizes: ["One Size"],
    description: "A statement handkerchief with premium trim and a drop-print pattern built for styling detail.",
    angles: ["Flat View", "Folded View", "Pattern Detail", "Trim Detail", "Style Preview"],
  },
  "prism-dash": {
    name: "Prism Dash",
    category: "Sneakers",
    price: 7200,
    sizes: ["6", "7", "8", "9", "10", "11"],
    description: "A sculpted sneaker with modern geometry, layered paneling, and a futuristic performance feel.",
    angles: ["Front Angle", "Outer Side", "Inner Side", "Back Heel", "Sole View"],
  },
  "chrome-sprint": {
    name: "Chrome Sprint",
    category: "Sneakers",
    price: 7800,
    sizes: ["6", "7", "8", "9", "10", "11"],
    description: "Reflective hardware and a bold heel counter make this sneaker feel fast even at rest.",
    angles: ["Front Angle", "Outer Side", "Inner Side", "Back Heel", "Top View"],
  },
  "fluid-rise": {
    name: "Fluid Rise",
    category: "Sneakers",
    price: 6900,
    sizes: ["6", "7", "8", "9", "10", "11"],
    description: "A lighter luxury runner with a clean profile, ready for all-day movement and styling.",
    angles: ["Front Angle", "Outer Side", "Inner Side", "Back Heel", "Sole View"],
  },
  "volt-arc": {
    name: "Volt Arc",
    category: "Sneakers",
    price: 8100,
    sizes: ["6", "7", "8", "9", "10", "11"],
    description: "A high-energy statement sneaker with an exaggerated sole and a luminous design direction.",
    angles: ["Front Angle", "Outer Side", "Inner Side", "Back Heel", "Top View"],
  },
  "obsidian-runner": {
    name: "Obsidian Runner",
    category: "Sneakers",
    price: 6800,
    sizes: ["6", "7", "8", "9", "10", "11"],
    description: "Deep black sneaker concept with reflective details and a sharp sole structure.",
    angles: ["Front Angle", "Outer Side", "Inner Side", "Back Heel", "Sole View"],
  },
  "nova-carrier": {
    name: "Nova Carrier",
    category: "Bag",
    price: 4200,
    sizes: ["One Size"],
    description: "Minimal premium bag with a sculpted shell and quiet luxury attitude.",
    angles: ["Front Angle", "Left Side", "Back Angle", "Handle Detail", "Interior View"],
  },
  "static-layer-jacket": {
    name: "Static Layer Jacket",
    category: "Jacket",
    price: 5100,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Editorial outerwear with metallic trim and a sharp urban silhouette.",
    angles: ["Front Angle", "Side Angle", "Back Angle", "Collar Detail", "Fit Preview"],
  },
  "solar-echo": {
    name: "Solar Echo",
    category: "Sneakers",
    price: 6200,
    sizes: ["6", "7", "8", "9", "10", "11"],
    description: "Warm tonal sneaker concept merging soft suede cues with bold shape language.",
    angles: ["Front Angle", "Outer Side", "Inner Side", "Back Heel", "Top View"],
  },
  "glassline-tee": {
    name: "Glassline Tee",
    category: "T-shirt",
    price: 1650,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Quiet standout tee designed for cleaner monochrome layering and premium comfort.",
    angles: ["Front Angle", "Side Angle", "Back Angle", "Fabric Detail", "Fit Preview"],
  },
  "halo-frame": {
    name: "Halo Frame",
    category: "Sunglasses",
    price: 3800,
    sizes: ["One Size"],
    description: "Glossy rounded sunglasses with a premium finish and a fashion-led profile.",
    angles: ["Front View", "Left Side", "Right Side", "Frame Detail", "Lifestyle Preview"],
  },
  "mirror-drift": {
    name: "Mirror Drift",
    category: "Sunglasses",
    price: 4100,
    sizes: ["One Size"],
    description: "Reflective lens sunglasses with a bolder silhouette built for statement styling.",
    angles: ["Front View", "Left Side", "Right Side", "Lens Detail", "Lifestyle Preview"],
  },
  "solar-tint": {
    name: "Solar Tint",
    category: "Sunglasses",
    price: 3950,
    sizes: ["One Size"],
    description: "Warm lens eyewear designed for softer luxury mood and elevated daily wear.",
    angles: ["Front View", "Left Side", "Right Side", "Frame Detail", "Lifestyle Preview"],
  },
  "uzi-vector-tee": {
    name: "Uzi Vector Tee",
    category: "T-shirt",
    price: 2600,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Lil Uzi Vert inspired tee with electric contrast graphics and performance-culture edge.",
    angles: ["Front Angle", "Side Angle", "Back Angle", "Graphic Detail", "Fit Preview"],
    offerEnds: "2026-05-01",
    stock: 18,
  },
  "uzi-neon-tee": {
    name: "Uzi Neon Tee",
    category: "T-shirt",
    price: 2800,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A louder collaboration tee reflecting stage energy, chrome tones, and nightlife styling.",
    angles: ["Front Angle", "Side Angle", "Back Angle", "Graphic Detail", "Fit Preview"],
    offerEnds: "2026-05-01",
    stock: 8,
  },
  "uzi-stage-track": {
    name: "Uzi Stage Track Pant",
    category: "Track Pant",
    price: 3600,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Track pant rooted in artist-tour culture with sharp line work and a premium technical finish.",
    angles: ["Front Angle", "Side Angle", "Back Angle", "Waist Detail", "Fit Preview"],
    offerEnds: "2026-05-01",
    stock: 3,
  },
  "uzi-limited-bandana": {
    name: "Uzi Limited Bandana",
    category: "Bandana",
    price: 1200,
    sizes: ["One Size"],
    description: "Limited period bandana inspired by Lil Uzi Vert visuals, typography, and underground culture.",
    angles: ["Flat View", "Folded View", "Pattern Detail", "Trim Detail", "Style Preview"],
    offerEnds: "2026-04-20",
    stock: 0,
  },
};

const modelPhotos = {
  Men: ["Look 01", "Look 02", "Look 03", "Look 04", "Look 05", "Look 06"],
  Women: ["Edit 01", "Edit 02", "Edit 03", "Edit 04", "Edit 05", "Edit 06"],
  Kids: ["Kids 01", "Kids 02", "Kids 03", "Kids 04", "Kids 05", "Kids 06"],
};

const fallbackImageByCategory = {
  hero: "assets/images/editorial-home.svg",
  "T-shirt": "assets/images/apparel-core.svg",
  Hoodie: "assets/images/apparel-core.svg",
  "Sweat-Shirt": "assets/images/apparel-core.svg",
  Jeans: "assets/images/apparel-core.svg",
  "Track Pant": "assets/images/apparel-core.svg",
  Handkerchief: "assets/images/apparel-core.svg",
  Sneakers: "assets/images/sneaker-core.svg",
  Bag: "assets/images/bag-core.svg",
  Jacket: "assets/images/apparel-core.svg",
  Sunglasses: "assets/images/sunglasses-core.svg",
  Bandana: "assets/images/uzi-core.svg",
};

let imageLibrary = [];
let imageMap = new Map();

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const getToday = () => new Date().toISOString().slice(0, 10);

const getTheme = () => localStorage.getItem(THEME_KEY) || "default";
const getAuth = () => JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const getLocations = () => JSON.parse(localStorage.getItem(LOCATIONS_KEY) || "[]");

const setAuth = (value) => localStorage.setItem(AUTH_KEY, JSON.stringify(value));
const setCart = (value) => localStorage.setItem(CART_KEY, JSON.stringify(value));
const setLocations = (value) => localStorage.setItem(LOCATIONS_KEY, JSON.stringify(value));
const setPendingAction = (value) => localStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(value));
const getPendingAction = () => JSON.parse(localStorage.getItem(PENDING_ACTION_KEY) || "null");
const clearPendingAction = () => localStorage.removeItem(PENDING_ACTION_KEY);

const loadImageLibrary = async () => {
  try {
    const response = await fetch(IMAGE_LIBRARY_PATH);
    if (!response.ok) {
      return;
    }
    imageLibrary = await response.json();
    imageMap = new Map(imageLibrary.map((entry) => [entry.slug, entry]));
  } catch {
    imageLibrary = [];
    imageMap = new Map();
  }
};

const resolveImageForSlug = (slug) => {
  const fromLibrary = imageMap.get(slug);
  if (fromLibrary?.image) {
    return fromLibrary.image;
  }
  if (slug === "editorial-home") {
    return fallbackImageByCategory.hero;
  }
  const product = PRODUCT_CATALOG[slug];
  if (!product) {
    return fallbackImageByCategory.hero;
  }
  return fallbackImageByCategory[product.category] || fallbackImageByCategory.hero;
};

const mountImage = (container, src, alt, className = "") => {
  if (!container || container.querySelector("img")) return;
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  if (className) image.className = className;
  container.prepend(image);
  container.classList.add("has-image");
};

const enhanceStaticImages = () => {
  document.querySelectorAll("[data-library-slug]").forEach((node) => {
    const slug = node.dataset.librarySlug;
    mountImage(node, resolveImageForSlug(slug), `${slug} image`, "hero-media");
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    const anchor = card.querySelector('a[href^="product.html?product="]');
    const visual = card.querySelector(".product-visual");
    if (!anchor || !visual) return;
    const slug = new URL(anchor.href, window.location.href).searchParams.get("product");
    if (!slug) return;
    mountImage(visual, resolveImageForSlug(slug), `${slug} image`);
  });
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
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
};

const updateCartCount = () => {
  const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
  cartCountNodes.forEach((node) => {
    node.textContent = total;
  });
};

const updateAuthLinks = () => {
  const auth = getAuth();
  authButtons.forEach((button) => {
    if (auth) {
      button.textContent = "My Profile";
      button.href = "profile.html";
    } else {
      button.textContent = "Log In / Sign Up";
      button.href = "login.html";
    }
  });
};

const applyTheme = () => {
  const theme = getTheme();
  if (theme === "default") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
  themeButtons.forEach((button) => {
    const label = button.querySelector(".theme-label");
    if (label) label.textContent = themeLabels[theme];
  });
};

const cycleTheme = () => {
  const current = getTheme();
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  localStorage.setItem(THEME_KEY, next);
  applyTheme();
  showToast(`Theme changed to ${themeLabels[next]}.`);
};

const setupTheme = () => {
  applyTheme();
  themeButtons.forEach((button) => {
    button.addEventListener("click", cycleTheme);
  });
};

const setupReveal = () => {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
};

const setupTilt = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  tiltTargets.forEach((card) => {
    const move = (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 12;
      const ry = (x - 0.5) * 12;
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const reset = () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", reset);
  });
};

const phoneIsValid = (phone) => /^\+91\d{10}$/.test(phone.trim());

const authMeetsCommerceRequirements = (auth) => Boolean(auth && auth.name && auth.gender && phoneIsValid(auth.phone || ""));

const redirectToLogin = (payload = null, next = null) => {
  if (payload?.slug) {
    localStorage.setItem(PENDING_PRODUCT_KEY, payload.slug);
    setPendingAction(payload);
  }
  const returnPath = next || `${window.location.pathname.split("/").pop() || "home.html"}${window.location.search}`;
  window.location.href = `login.html?return=${encodeURIComponent(returnPath)}`;
};

const getOfferState = (product) => {
  const expired = product.offerEnds ? getToday() > product.offerEnds : false;
  const soldOut = typeof product.stock === "number" ? product.stock <= 0 : false;
  if (expired) return { label: "Offer ended", unavailable: true };
  if (soldOut) return { label: "Out of stock", unavailable: true };
  if (product.offerEnds) return { label: `Offer until ${product.offerEnds}`, unavailable: false };
  return { label: "Available now", unavailable: false };
};

const addItemToCart = (slug, size) => {
  const product = PRODUCT_CATALOG[slug];
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.slug === slug && item.size === size);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      slug,
      name: product.name,
      price: product.price,
      size,
      quantity: 1,
      category: product.category,
    });
  }

  setCart(cart);
  updateCartCount();
};

const renderProductPage = () => {
  const container = document.querySelector("[data-product-page]");
  if (!container) return;

  const slug = new URLSearchParams(window.location.search).get("product");
  const product = PRODUCT_CATALOG[slug];

  if (!product) {
    container.innerHTML = `<div class="summary-card"><h3>Product not found</h3><p class="copy">This product route does not exist yet.</p><a class="secondary-button" href="home.html">Back to home</a></div>`;
    return;
  }

  const offer = getOfferState(product);
  const mainImage = resolveImageForSlug(slug);
  const sizeOptions = product.sizes
    .map(
      (size, index) => `
        <label class="size-chip ${index === 0 ? "is-selected" : ""}">
          <input ${index === 0 ? "checked" : ""} type="radio" name="size" value="${size}" />
          <span>${size}</span>
        </label>
      `
    )
    .join("");

  const angles = product.angles
    .map(
      (label) => `
        <div class="card">
          <div class="angle-tile has-image"><img src="${mainImage}" alt="${product.name} ${label}" /></div>
          <p class="mini-label" style="margin-top: 14px;">${label}</p>
        </div>
      `
    )
    .join("");

  container.innerHTML = `
    <section class="product-layout">
      <div>
        <p class="eyebrow reveal">${product.category}</p>
        <h1 class="product-title reveal delay-1">${product.name}</h1>
        <p class="product-description reveal delay-2">${product.description}</p>
        <div class="hero-note reveal delay-3">
          <div class="product-action-row">
            <span class="price-tag">${formatCurrency(product.price)}</span>
            <span class="product-status ${offer.unavailable ? "is-danger" : ""}">${offer.label}</span>
          </div>
        </div>
        <div class="form-card reveal delay-3" style="margin-top: 18px;">
          <h3>Available size</h3>
          <p class="meta-copy">${product.category === "T-shirt" ? "S means small, M means medium, L means large, XL means extra large, XXL means extra extra large." : "Select the correct size before continuing."}</p>
          <div class="size-grid" style="margin: 16px 0 18px;">${sizeOptions}</div>
          <label class="choice-chip" style="justify-content: flex-start;">
            <input type="checkbox" data-terms-checkbox />
            <span>I agree to the terms and conditions before continuing.</span>
          </label>
          <div class="button-row" style="margin-top: 18px;">
            <button class="primary-button" type="button" data-product-action="cart" data-product-slug="${slug}" ${offer.unavailable ? "disabled" : ""}>Add to Cart</button>
            <button class="secondary-button" type="button" data-product-action="buy" data-product-slug="${slug}" ${offer.unavailable ? "disabled" : ""}>BUY NOW</button>
          </div>
        </div>
      </div>
      <div class="gallery-panel reveal delay-2">
        <div class="product-visual has-image" style="height: 360px;"><img src="${mainImage}" alt="${product.name}" /></div>
        <div class="angles-grid" style="margin-top: 18px;">${angles}</div>
      </div>
    </section>
  `;
};

const setupProductActions = () => {
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-action]");
    if (!button) return;

    const slug = button.dataset.productSlug;
    const auth = getAuth();
    const terms = document.querySelector("[data-terms-checkbox]");
    const selectedSize = document.querySelector('input[name="size"]:checked');

    if (!selectedSize) {
      showToast("Please choose a size first.");
      return;
    }

    if (!terms?.checked) {
      showToast("Please agree to the terms and conditions first.");
      return;
    }

    if (!authMeetsCommerceRequirements(auth)) {
      redirectToLogin(
        {
          slug,
          size: selectedSize.value,
          action: button.dataset.productAction,
        },
        button.dataset.productAction === "buy" ? "locations.html?confirm=1&next=payment.html" : null
      );
      return;
    }

    addItemToCart(slug, selectedSize.value);
    showToast(`${PRODUCT_CATALOG[slug].name} added to cart.`);

    if (button.dataset.productAction === "buy") {
      window.location.href = "locations.html?confirm=1&next=payment.html";
    }
  });

  document.body.addEventListener("change", (event) => {
    const chip = event.target.closest(".size-chip");
    if (!chip) return;
    document.querySelectorAll(".size-chip").forEach((node) => node.classList.remove("is-selected"));
    chip.classList.add("is-selected");
  });
};

const renderCart = () => {
  const cartList = document.querySelector("[data-cart-list]");
  if (!cartList) return;

  const cart = getCart();
  cartList.innerHTML = "";

  const empty = document.querySelector("[data-cart-empty]");
  if (!cart.length) {
    empty?.classList.remove("hidden");
  } else {
    empty?.classList.add("hidden");
  }

  cart.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="price-row">
        <div>
          <h3>${item.name}</h3>
          <p class="meta-copy">${item.category} / Size ${item.size} / Qty ${item.quantity}</p>
        </div>
        <span class="price-tag">${formatCurrency(item.price * item.quantity)}</span>
      </div>
      <div class="button-row">
        <a class="product-link" href="product.html?product=${item.slug}">View Product</a>
        <button class="ghost-button" type="button" data-remove-cart="${index}">Remove</button>
      </div>
    `;
    cartList.appendChild(card);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelectorAll("[data-cart-subtotal]").forEach((node) => (node.textContent = formatCurrency(subtotal)));
  document.querySelectorAll("[data-cart-total]").forEach((node) => (node.textContent = formatCurrency(subtotal)));
};

const setupCart = () => {
  renderCart();
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-cart]");
    if (!button) return;

    const cart = getCart();
    cart.splice(Number(button.dataset.removeCart), 1);
    setCart(cart);
    updateCartCount();
    renderCart();
  });
};

const setupPayment = () => {
  const form = document.querySelector("[data-payment-form]");
  if (!form) return;

  const total = getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalNode = document.querySelector("[data-payment-total]");
  if (totalNode) totalNode.textContent = formatCurrency(total);

  document.querySelectorAll("[data-method-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-method-tab]").forEach((node) => node.classList.remove("is-active"));
      tab.classList.add("is-active");
      const method = tab.dataset.method;
      form.dataset.method = method;
      document.querySelectorAll("[data-payment-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.paymentPanel !== method);
      });
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!authMeetsCommerceRequirements(getAuth())) {
      redirectToLogin();
      return;
    }

    if (!getLocations().length) {
      showToast("Please save a delivery location before payment.");
      window.setTimeout(() => {
        window.location.href = "locations.html";
      }, 700);
      return;
    }

    const method = form.dataset.method || "card";
    const formData = new FormData(form);

    if (method === "upi") {
      const upi = String(formData.get("upi") || "").trim();
      if (!upi) {
        showToast("Please enter your UPI ID.");
        return;
      }
      showToast(`Payment request sent to ${upi}.`);
    } else {
      const card = String(formData.get("cardNumber") || "").trim();
      if (!card) {
        showToast("Please enter your card details.");
        return;
      }
      showToast("Card payment confirmed.");
    }

    setCart([]);
    updateCartCount();
    window.setTimeout(() => {
      window.location.href = "home.html";
    }, 900);
  });
};

const setupLogin = () => {
  const form = document.querySelector("[data-login-form]");
  const skip = document.querySelector("[data-skip-login]");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get("return") || "home.html";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const profile = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      gender: String(data.get("gender") || "").trim(),
    };

    if (!profile.name || !profile.gender) {
      showToast("Name and gender are required.");
      return;
    }

    if (!phoneIsValid(profile.phone)) {
      showToast("Phone number must start with +91 and include 10 digits.");
      return;
    }

    setAuth(profile);
    const pending = getPendingAction();

    if (pending?.slug && pending?.size) {
      addItemToCart(pending.slug, pending.size);
      if (pending.action === "buy") {
        clearPendingAction();
        window.location.href = "locations.html?confirm=1&next=payment.html";
        return;
      }
      clearPendingAction();
    }

    window.location.href = returnUrl;
  });

  skip?.addEventListener("click", () => {
    window.location.href = `index.html?next=${encodeURIComponent(returnUrl)}`;
  });
};

const setupWelcome = () => {
  if (document.body.dataset.page !== "welcome") return;

  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") || "home.html";
  const enter = document.querySelector("[data-enter-site]");

  const goNext = () => {
    window.location.href = next;
  };

  enter?.addEventListener("click", goNext);
  setTimeout(goNext, 4200);
};

const renderUziStatus = () => {
  document.querySelectorAll("[data-product-status]").forEach((node) => {
    const slug = node.dataset.productStatus;
    const product = PRODUCT_CATALOG[slug];
    if (!product) return;
    const state = getOfferState(product);
    node.textContent = state.label;
    node.classList.toggle("is-danger", state.unavailable);
  });
};

const renderProfile = () => {
  const form = document.querySelector("[data-profile-form]");
  const auth = getAuth();
  if (!form || !auth) return;

  form.elements.name.value = auth.name || "";
  form.elements.email.value = auth.email || "";
  form.elements.phone.value = auth.phone || "";
  form.elements.gender.value = auth.gender || "";
};

const renderProfileSide = () => {
  const side = document.querySelector("[data-profile-side]");
  if (!side) return;

  const auth = getAuth();

  if (!authMeetsCommerceRequirements(auth)) {
    side.innerHTML = `
      <h3>Profile requirements</h3>
      <ul class="info-list">
        <li>Gender is mandatory.</li>
        <li>Phone must start with +91 and stay within India format.</li>
        <li>Email is optional.</li>
      </ul>
      <p style="margin-top: 18px;"><a class="profile-link" href="locations.html">Manage saved locations</a></p>
    `;
    return;
  }

  side.innerHTML = `
    <h3>User Info</h3>
    <ul class="info-list">
      <li>Username: ${auth.name}</li>
      <li>Phone: ${auth.phone}</li>
      <li>Email: ${auth.email || "Not provided"}</li>
      <li>Gender: ${auth.gender}</li>
    </ul>
    <p style="margin-top: 18px;"><a class="profile-link" href="locations.html">Manage saved locations</a></p>
  `;
};

const setupProfile = () => {
  renderProfile();
  renderProfileSide();
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const updated = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      gender: String(data.get("gender") || "").trim(),
    };

    if (!updated.name || !updated.gender) {
      showToast("Name and gender are required.");
      return;
    }
    if (!phoneIsValid(updated.phone)) {
      showToast("Phone number must start with +91 and include 10 digits.");
      return;
    }
    setAuth(updated);
    updateAuthLinks();
    renderProfileSide();
    showToast("Profile updated.");
  });
};

const renderLocations = () => {
  const list = document.querySelector("[data-location-list]");
  if (!list) return;

  const params = new URLSearchParams(window.location.search);
  const confirmMode = params.get("confirm") === "1";
  const next = params.get("next") || "payment.html";
  const locations = getLocations();
  list.innerHTML = "";

  if (!locations.length) {
    list.innerHTML = `<div class="summary-card"><h3>No saved locations yet</h3><p class="copy">Location is mandatory before checkout. Add one below.</p></div>`;
    return;
  }

  locations.forEach((location, index) => {
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML = `
      <div class="location-meta">
        <div>
          <h3>${location.label}</h3>
          <p class="meta-copy">${location.type}</p>
        </div>
        <div class="button-row">
          ${confirmMode ? `<button class="primary-button" type="button" data-confirm-location="${index}" data-next-page="${next}">Confirm</button>` : ""}
          <button class="ghost-button" type="button" data-remove-location="${index}">Remove</button>
        </div>
      </div>
      <p class="meta-copy">${location.houseNumber}, ${location.fullAddress}, ${location.state} - ${location.pincode}</p>
      <p class="meta-copy">${location.mapLocation || ""}</p>
    `;
    list.appendChild(card);
  });
};

const setupLocations = () => {
  renderLocations();

  const form = document.querySelector("[data-location-form]");
  const mapButton = document.querySelector("[data-map-detect]");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const confirmMode = params.get("confirm") === "1";
  const next = params.get("next") || "payment.html";
  const heading = document.querySelector("[data-location-heading]");
  const copy = document.querySelector("[data-location-copy]");

  if (confirmMode) {
    if (heading) heading.textContent = "Confirm your delivery location";
    if (copy) copy.textContent = "If you already saved a location, confirm it below. Otherwise save a new one and continue directly to payment.";
  }

  mapButton?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        form.elements.mapLocation.value = `Lat ${coords.latitude.toFixed(4)}, Lng ${coords.longitude.toFixed(4)}`;
        showToast("Current map location captured.");
      },
      () => showToast("Unable to capture map location.")
    );
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const location = {
      label: String(data.get("label") || "").trim(),
      type: String(data.get("type") || "").trim(),
      houseNumber: String(data.get("houseNumber") || "").trim(),
      fullAddress: String(data.get("fullAddress") || "").trim(),
      state: String(data.get("state") || "").trim(),
      pincode: String(data.get("pincode") || "").trim(),
      mapLocation: String(data.get("mapLocation") || "").trim(),
    };

    if (!location.label || !location.houseNumber || !location.fullAddress || !location.state || !location.pincode) {
      showToast("House number, full address, pincode, and state are mandatory.");
      return;
    }

    const all = getLocations();
    if (all.some((entry) => entry.label.toLowerCase() === location.label.toLowerCase())) {
      showToast("Location labels must be unique.");
      return;
    }

    const home = all.find((entry) => entry.type === "Home");
    const work = all.find((entry) => entry.type === "Work");
    const currentFull = `${location.houseNumber} ${location.fullAddress}`.toLowerCase();

    if (location.type === "Home" && work && `${work.houseNumber} ${work.fullAddress}`.toLowerCase() === currentFull) {
      showToast("Home and work locations cannot be the same.");
      return;
    }
    if (location.type === "Work" && home && `${home.houseNumber} ${home.fullAddress}`.toLowerCase() === currentFull) {
      showToast("Work and home locations cannot be the same.");
      return;
    }

    all.push(location);
    setLocations(all);
    form.reset();
    renderLocations();
    showToast("Location saved.");

    if (confirmMode) {
      window.setTimeout(() => {
        window.location.href = next;
      }, 700);
    }
  });

  document.body.addEventListener("click", (event) => {
    const confirmButton = event.target.closest("[data-confirm-location]");
    if (confirmButton) {
      window.location.href = confirmButton.dataset.nextPage || "payment.html";
      return;
    }

    const button = event.target.closest("[data-remove-location]");
    if (!button) return;
    const all = getLocations();
    all.splice(Number(button.dataset.removeLocation), 1);
    setLocations(all);
    renderLocations();
  });
};

const setupContact = () => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!email || !message) {
      showToast("Please enter your email and your query.");
      return;
    }
    form.reset();
    showToast("Your query has been sent.");
  });
};

const setupModelGallery = () => {
  const modal = document.querySelector("[data-model-modal]");
  if (!modal) return;

  const grid = modal.querySelector("[data-model-grid]");
  const title = modal.querySelector("[data-model-title]");

  document.querySelectorAll("[data-model-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.modelTab;
      title.textContent = `${key} Models`;
      grid.innerHTML = modelPhotos[key]
        .map(
          (label) => `
            <div class="model-card has-image">
              <img src="${resolveImageForSlug("editorial-home")}" alt="${label}" />
              <div class="mini-label" style="position: absolute; left: 14px; bottom: 12px; margin: 0;">${label}</div>
            </div>
          `
        )
        .join("");
      modal.classList.remove("hidden");
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close-model]")) {
      modal.classList.add("hidden");
    }
  });
};

(async () => {
  await loadImageLibrary();
  setupTheme();
  updateCartCount();
  updateAuthLinks();
  renderProductPage();
  enhanceStaticImages();
  renderUziStatus();
  setupReveal();
  setupTilt();
  setupProductActions();
  setupCart();
  setupPayment();
  setupLogin();
  setupWelcome();
  setupProfile();
  setupLocations();
  setupContact();
  setupModelGallery();
})();
