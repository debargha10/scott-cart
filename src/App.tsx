import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { collectionCards, contentPages, homeFeatureCards } from "./content";
import { PRODUCT_CATALOG, sectionProducts } from "./data/catalog";
import { fetchFirestoreProducts } from "./lib/firebase";
import {
  authMeetsCommerceRequirements,
  formatCurrency,
  getOfferState,
  phoneIsValid,
  useApp,
} from "./state/AppContext";
import type { FirestoreProduct, Gender, SavedLocation } from "./types";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/drops", label: "Drops" },
  { to: "/sneakers", label: "Sneakers" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/featuring-lil-uzi-vert", label: "Featuring Lil Uzi Vert" },
];

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/drops"
          element={
            <CatalogPage
              eyebrow="Drops"
              title="Six clothing choices start the drop floor."
              copy="T-shirt, Hoodies, Sweat-Shirt, Jeans, Track Pant, and Handkerchiefs all route into their own dedicated product pages."
              slugs={sectionProducts.drops}
            />
          }
        />
        <Route
          path="/sneakers"
          element={
            <CatalogPage
              eyebrow="Sneakers"
              title="Every sneaker opens into its own angle-rich product page."
              copy="A focused lane for statement footwear, kept clean and product-first."
              slugs={sectionProducts.sneakers}
            />
          }
        />
        <Route
          path="/new-arrivals"
          element={
            <CatalogPage
              eyebrow="New Arrivals"
              title="Fresh arrivals, cleaner surfaces, and immediate product routing."
              copy="This page stays sharp, minimal, and centered on what is new right now."
              slugs={sectionProducts.arrivals}
            />
          }
        />
        <Route
          path="/build-your-dreams"
          element={
            <CatalogPage
              eyebrow="Build Your Dreams"
              title="A sunglasses lane with a quieter luxury mood."
              copy="This section now features sunglasses as a dedicated product story."
              slugs={sectionProducts.dreams}
            />
          }
        />
        <Route
          path="/featuring-lil-uzi-vert"
          element={
            <CatalogPage
              eyebrow="Featuring Lil Uzi Vert"
              title="A different page, a different palette, and timed product rules."
              copy="This section stands apart visually, and the products below can stay visible while moving to out-of-stock or offer-ended states after stock runs out or the period ends."
              slugs={sectionProducts.uzi}
              specialUzi
            />
          }
        />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {contentPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={<StaticContentPage {...page} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </>
  );
}

function Shell({
  children,
  title,
  subtitle,
  showNav = true,
  specialUzi = false,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showNav?: boolean;
  specialUzi?: boolean;
}) {
  const { cycleTheme, themeLabel, cartCount, auth } = useApp();

  return (
    <div className={`page-shell ${specialUzi ? "special-uzi" : ""}`}>
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>
      <header className="site-header">
        <div className="header-top">
          <div className="brand-lockup">
            <NavLink className="home-logo" to="/home">
              ⌂
            </NavLink>
            <NavLink className="brand-lockup" to="/home">
              <span className="logo-mark"></span>
              <span className="logo-copy">
                <strong>SCOTT CART</strong>
                <span>{subtitle ?? "Dark luxury storefront"}</span>
              </span>
            </NavLink>
          </div>
          <div className="utility-row">
            <button className="theme-switch" type="button" onClick={cycleTheme}>
              <span className="theme-label">{themeLabel}</span>
            </button>
            <NavLink className="utility-link" to={auth ? "/profile" : "/login"}>
              {auth ? "My Profile" : "Log In / Sign Up"}
            </NavLink>
            <NavLink className="utility-link" to="/cart">
              Cart <span>{cartCount}</span>
            </NavLink>
          </div>
        </div>
        {showNav ? (
          <div className="header-tools">
            <nav className="site-nav">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
      <main className="page-main">
        {title ? <PageIntro title={title} /> : null}
        {children}
      </main>
      <footer className="site-footer">
        <div className="copyright">Debargha-2026. All rights reserved</div>
      </footer>
    </div>
  );
}

function PageIntro({ title }: { title: string }) {
  return (
    <section style={{ paddingBottom: 0 }}>
      <div className="section-header">
        <h1 className="section-title">{title}</h1>
      </div>
    </section>
  );
}

function WelcomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get("next") || "/home";
    const timer = window.setTimeout(() => {
      navigate(next, { replace: true });
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [location.search, navigate]);

  const handleEnter = () => {
    const params = new URLSearchParams(location.search);
    navigate(params.get("next") || "/home");
  };

  return (
    <Shell showNav={false} subtitle="Welcome sequence">
      <section className="welcome-shell">
        <div className="welcome-copy">
          <p className="eyebrow">Welcome Sequence</p>
          <h1 className="welcome-title">Enter the SCOTT CART universe.</h1>
          <div className="welcome-lines">
            <div className="welcome-line copy">Dark luxury storefront with a cleaner, calmer visual rhythm.</div>
            <div className="welcome-line copy">Dedicated product pages, gated checkout, and India-first commerce flow.</div>
            <div className="welcome-line copy">Theme switcher, profile system, cart totals, and premium navigation.</div>
            <div className="welcome-line copy">Lil Uzi Vert feature drops and limited-time availability states.</div>
            <div className="welcome-line copy">Loading the main experience now.</div>
          </div>
          <div className="loading-sign" aria-label="Loading site">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
          <div className="button-row">
            <button className="primary-button" type="button" onClick={handleEnter}>
              Enter Site
            </button>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function HomePage() {
  const { resolveImage } = useApp();
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const items = await fetchFirestoreProducts();
        if (!active) return;
        setProducts(items);
      } catch {
        if (!active) return;
        setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Shell subtitle="Dark luxury storefront">
      <section className="hero">
        <div>
          <p className="eyebrow">Apple-inspired, darker, cleaner</p>
          <h1 className="hero-title">A product-first experience with a softer dark mood.</h1>
          <p className="copy">
            The storefront is now driven by typed components, shared state, and a cleaner path toward real backend storage.
          </p>
          <div className="hero-actions">
            <NavLink className="primary-button" to="/drops">
              Enter Drops
            </NavLink>
            <NavLink className="secondary-button" to="/profile">
              My Profile
            </NavLink>
          </div>
        </div>
        <div className="hero-editorial-card has-image" data-library-slug="editorial-home">
          <img className="hero-media" src={resolveImage("editorial-home")} alt="SCOTT CART editorial" />
          <div className="hero-editorial-copy">
            <p className="mini-label">Editorial Hero</p>
            <h3>Now ready for your real uploaded images.</h3>
            <p className="copy">The layout is image-ready, cleaner than the earlier 3D block, and easier to evolve into a portfolio-quality frontend.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <p className="eyebrow">Explore</p>
          <h2 className="section-title">Dedicated routes instead of a crowded single page.</h2>
        </div>
        <div className="gateway-grid">
          {homeFeatureCards.map((card) => (
            <NavLink key={card.to} className="gateway-card" to={card.to}>
              <p className="mini-label">{card.label}</p>
              <h3>{card.title}</h3>
              <p className="copy">{card.copy}</p>
            </NavLink>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <p className="eyebrow">Products</p>
          <h2 className="section-title">Live from STORE SOON</h2>
        </div>
        {loading ? <div className="summary-card"><p className="copy">Loading Firestore products...</p></div> : null}
        {failed ? <div className="summary-card"><p className="copy">Firestore is connected in code, but product loading failed right now.</p></div> : null}
        {!loading && !failed ? (
          <div className="grid-3">
            {products.map((product) => (
              <div key={product.id} className="card">
                <p className="mini-label">{product.name}</p>
                <h3>{formatCurrency(product.price)}</h3>
                <p className="copy">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <div className="section-header">
          <p className="eyebrow">Collections</p>
          <h2 className="section-title">More dedicated pages are already routed.</h2>
        </div>
        <div className="grid-2">
          {collectionCards.map((card) => (
            <NavLink key={card.to} className="card" to={card.to}>
              <p className="mini-label">{card.label}</p>
              <h3>{card.title}</h3>
              <p className="copy">{card.copy}</p>
            </NavLink>
          ))}
        </div>
      </section>
    </Shell>
  );
}

function CatalogPage({
  eyebrow,
  title,
  copy,
  slugs,
  specialUzi = false,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  slugs: string[];
  specialUzi?: boolean;
}) {
  return (
    <Shell subtitle={eyebrow} specialUzi={specialUzi}>
      <section>
        <div className="section-header">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="section-title">{title}</h1>
          <p className="section-copy">{copy}</p>
        </div>
        <div className={specialUzi ? "uzy-grid" : "product-grid"}>
          {slugs.map((slug, index) => (
            <ProductCard key={slug} slug={slug} index={index} />
          ))}
        </div>
      </section>
    </Shell>
  );
}

function ProductCard({ slug, index }: { slug: string; index: number }) {
  const { resolveImage } = useApp();
  const product = PRODUCT_CATALOG[slug];
  const offer = getOfferState(product);

  return (
    <article className={`product-card reveal ${index % 3 === 1 ? "delay-1" : index % 3 === 2 ? "delay-2" : ""}`}>
      <NavLink to={`/product/${slug}`}>
        <div className="product-visual has-image">
          <img src={resolveImage(slug)} alt={product.name} />
        </div>
      </NavLink>
      <p className="mini-label">{product.category}</p>
      <h3>{product.name}</h3>
      <p className="copy">{product.description}</p>
      <div className="price-row">
        <span className="price-tag">{formatCurrency(product.price)}</span>
        <span className={`product-status ${offer.unavailable ? "is-danger" : ""}`}>{offer.label}</span>
      </div>
      <NavLink className="product-link" to={`/product/${slug}`}>
        View Product
      </NavLink>
    </article>
  );
}

function ProductPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { auth, addToCart, locations, resolveImage, setPendingAction, toast } = useApp();
  const product = PRODUCT_CATALOG[slug];
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!product) {
    return (
      <Shell subtitle="Product view" showNav={false}>
        <section>
          <div className="summary-card">
            <h3>Product not found</h3>
            <p className="copy">This product route does not exist yet.</p>
            <NavLink className="secondary-button" to="/home">
              Back to home
            </NavLink>
          </div>
        </section>
      </Shell>
    );
  }

  const offer = getOfferState(product);

  const ensureCommerceAccess = (action: "buy" | "cart") => {
    if (!acceptedTerms) {
      toast("Please agree to the terms and conditions first.");
      return false;
    }
    if (!selectedSize) {
      toast("Please choose a size first.");
      return false;
    }
    if (!authMeetsCommerceRequirements(auth)) {
      setPendingAction({
        slug,
        size: selectedSize,
        action,
        returnTo: `/product/${slug}`,
      });
      navigate(`/login?return=${encodeURIComponent(`/product/${slug}`)}`);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!ensureCommerceAccess("cart")) return;
    addToCart(slug, selectedSize);
    toast(`${product.name} added to cart.`);
  };

  const handleBuyNow = () => {
    if (!ensureCommerceAccess("buy")) return;
    addToCart(slug, selectedSize);
    navigate(`/locations?confirm=1&next=${encodeURIComponent("/payment")}`);
  };

  return (
    <Shell subtitle="Product view" showNav={false}>
      <section className="product-layout">
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <div className="hero-note">
            <div className="product-action-row">
              <span className="price-tag">{formatCurrency(product.price)}</span>
              <span className={`product-status ${offer.unavailable ? "is-danger" : ""}`}>{offer.label}</span>
            </div>
          </div>
          <div className="form-card" style={{ marginTop: 18 }}>
            <h3>Available size</h3>
            <p className="meta-copy">
              {product.category === "T-shirt"
                ? "S means small, M means medium, L means large, XL means extra large, XXL means extra extra large."
                : "Select the correct size before continuing."}
            </p>
            <div className="size-grid" style={{ margin: "16px 0 18px" }}>
              {product.sizes.map((size) => (
                <label key={size} className={`size-chip ${selectedSize === size ? "is-selected" : ""}`}>
                  <input
                    checked={selectedSize === size}
                    name="size"
                    type="radio"
                    value={size}
                    onChange={() => setSelectedSize(size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
            <label className="choice-chip" style={{ justifyContent: "flex-start" }}>
              <input
                checked={acceptedTerms}
                type="checkbox"
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <span>I agree to the terms and conditions before continuing.</span>
            </label>
            <div className="button-row" style={{ marginTop: 18 }}>
              <button className="primary-button" disabled={offer.unavailable} type="button" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="secondary-button" disabled={offer.unavailable} type="button" onClick={handleBuyNow}>
                BUY NOW
              </button>
            </div>
            {locations.length ? <p className="copy" style={{ marginTop: 14 }}>Saved locations found. BUY NOW will take you to location confirmation before payment.</p> : null}
          </div>
        </div>
        <div className="gallery-panel">
          <div className="product-visual has-image" style={{ height: 360 }}>
            <img src={resolveImage(slug)} alt={product.name} />
          </div>
          <div className="angles-grid" style={{ marginTop: 18 }}>
            {product.angles.map((angle) => (
              <div key={angle} className="card">
                <div className="angle-tile has-image">
                  <img src={resolveImage(slug)} alt={`${product.name} ${angle}`} />
                </div>
                <p className="mini-label" style={{ marginTop: 14 }}>{angle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, pendingAction, saveAuth, setPendingAction, toast } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "" as Gender | "",
    password: "",
  });

  const returnUrl = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("return") || "/home";
  }, [location.search]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.gender) {
      toast("Name and gender are required.");
      return;
    }
    if (!phoneIsValid(form.phone)) {
      toast("Phone number must start with +91 and include 10 digits.");
      return;
    }
    saveAuth({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      gender: form.gender,
    });

    if (pendingAction?.slug && pendingAction?.size) {
      addToCart(pendingAction.slug, pendingAction.size);
      if (pendingAction.action === "buy") {
        setPendingAction(null);
        navigate(`/locations?confirm=1&next=${encodeURIComponent("/payment")}`);
        return;
      }
      setPendingAction(null);
      navigate(pendingAction.returnTo || returnUrl);
      return;
    }

    navigate(returnUrl);
  };

  return (
    <Shell subtitle="Account entry" showNav={false}>
      <section className="split-layout">
        <div>
          <p className="eyebrow">Log In / Sign Up</p>
          <h1 className="section-title">Dark ambient entry with stricter profile rules.</h1>
          <p className="copy">Gender is mandatory. Phone must be an India number starting with +91. Email stays optional.</p>
          <div className="hero-note">
            You can still skip for now, but buying and adding to cart later will ask for a valid profile and terms acceptance.
          </div>
        </div>
        <div className="hero-visual">
          <div className="login-side-panel">
            <p className="mini-label">Account Flow</p>
            <h3>Sign in once, then continue to profile, location, or payment.</h3>
            <p className="copy">If you came here from BUY NOW, the next step will continue into location confirmation instead of returning you to the intro page.</p>
          </div>
        </div>
      </section>
      <section style={{ paddingTop: 0 }}>
        <div className="form-card" style={{ maxWidth: 760, margin: "0 auto" }}>
          <h3>Create or continue your profile</h3>
          <form className="form-grid" onSubmit={onSubmit}>
            <input className="input-field" name="name" placeholder="Username" type="text" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="input-field" name="email" placeholder="Email address (optional)" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <input className="input-field" name="phone" placeholder="+911234567890" type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            <select className="select-field" name="gender" value={form.gender} onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value as Gender | "" }))}>
              <option value="">Select gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
            <input className="input-field" name="password" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            <div className="button-row">
              <button className="primary-button" type="submit">Continue</button>
              <button className="ghost-button" type="button" onClick={() => navigate(`/home`)}>
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </section>
    </Shell>
  );
}

function ProfilePage() {
  const { auth, saveAuth, toast } = useApp();
  const [form, setForm] = useState({
    name: auth?.name ?? "",
    email: auth?.email ?? "",
    phone: auth?.phone ?? "",
    gender: auth?.gender ?? "",
  });

  useEffect(() => {
    setForm({
      name: auth?.name ?? "",
      email: auth?.email ?? "",
      phone: auth?.phone ?? "",
      gender: auth?.gender ?? "",
    });
  }, [auth]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.gender) {
      toast("Name and gender are required.");
      return;
    }
    if (!phoneIsValid(form.phone)) {
      toast("Phone number must start with +91 and include 10 digits.");
      return;
    }
    saveAuth({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      gender: form.gender as Gender,
    });
    toast("Profile updated.");
  };

  const ready = authMeetsCommerceRequirements(
    auth
      ? {
          ...auth,
          gender: auth.gender,
        }
      : null
  );

  return (
    <Shell subtitle="My profile" showNav={false}>
      <section className="profile-layout">
        <div className="form-card">
          <p className="eyebrow">My Profile</p>
          <h3>Edit your details</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input-field" type="text" placeholder="Username" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="input-field" type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <input className="input-field" type="tel" placeholder="+911234567890" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            <select
              className="select-field"
              value={form.gender}
              onChange={(event) =>
                setForm((current) => ({ ...current, gender: event.target.value as Gender | "" }))
              }
            >
              <option value="">Select gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
            <button className="primary-button" type="submit">Save Profile</button>
          </form>
        </div>
        <div className="profile-card">
          {ready && auth ? (
            <>
              <h3>User Info</h3>
              <ul className="info-list">
                <li>Username: {auth.name}</li>
                <li>Phone: {auth.phone}</li>
                <li>Email: {auth.email || "Not provided"}</li>
                <li>Gender: {auth.gender}</li>
              </ul>
            </>
          ) : (
            <>
              <h3>Profile Requirements</h3>
              <ul className="info-list">
                <li>Gender is mandatory.</li>
                <li>Phone must start with +91 and stay within India format.</li>
                <li>Email is optional.</li>
              </ul>
            </>
          )}
          <p style={{ marginTop: 18 }}>
            <NavLink className="profile-link" to="/locations">
              Manage saved locations
            </NavLink>
          </p>
        </div>
      </section>
    </Shell>
  );
}

function LocationsPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { locations, removeLocation, saveLocation, toast } = useApp();
  const params = new URLSearchParams(locationState.search);
  const confirmMode = params.get("confirm") === "1";
  const next = params.get("next") || "/payment";
  const [form, setForm] = useState<SavedLocation>({
    label: "",
    type: "Home",
    houseNumber: "",
    fullAddress: "",
    state: "",
    pincode: "",
    mapLocation: "",
  });

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({
          ...current,
          mapLocation: `Lat ${coords.latitude.toFixed(4)}, Lng ${coords.longitude.toFixed(4)}`,
        }));
        toast("Current map location captured.");
      },
      () => toast("Unable to capture map location.")
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = saveLocation(form);
    toast(result.message);
    if (!result.ok) return;
    setForm({
      label: "",
      type: "Home",
      houseNumber: "",
      fullAddress: "",
      state: "",
      pincode: "",
      mapLocation: "",
    });
    if (confirmMode) {
      window.setTimeout(() => navigate(next), 700);
    }
  };

  return (
    <Shell subtitle="Saved locations" showNav={false}>
      <section className="locations-layout">
        <div className="form-card">
          <p className="eyebrow">Locations</p>
          <h3>{confirmMode ? "Confirm your delivery location" : "Location is mandatory before checkout"}</h3>
          <p className="copy">
            {confirmMode
              ? "If you already saved a location, confirm it below. Otherwise save a new one and continue directly to payment."
              : "Save a location once and reuse it later. During BUY NOW flow you will confirm a saved address here before going to payment."}
          </p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input-field" type="text" placeholder="Name" value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} />
            <select className="select-field" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as SavedLocation["type"] }))}>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
            <div className="button-row">
              <input className="input-field" type="text" placeholder="Map location preview" value={form.mapLocation} onChange={(event) => setForm((current) => ({ ...current, mapLocation: event.target.value }))} />
              <button className="icon-button" type="button" onClick={handleDetectLocation}>
                🗺️ Map
              </button>
            </div>
            <input className="input-field" type="text" placeholder="House number" value={form.houseNumber} onChange={(event) => setForm((current) => ({ ...current, houseNumber: event.target.value }))} />
            <textarea className="textarea-field" placeholder="Full address" value={form.fullAddress} onChange={(event) => setForm((current) => ({ ...current, fullAddress: event.target.value }))}></textarea>
            <div className="grid-2">
              <input className="input-field" type="text" placeholder="State" value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} />
              <input className="input-field" type="text" placeholder="Pincode" value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value }))} />
            </div>
            <button className="primary-button" type="submit">Save Location</button>
          </form>
        </div>
        <div className="grid-2" style={{ gridTemplateColumns: "1fr" }}>
          {locations.length ? (
            locations.map((saved, index) => (
              <div key={`${saved.label}-${index}`} className="location-card">
                <div className="location-meta">
                  <div>
                    <h3>{saved.label}</h3>
                    <p className="meta-copy">{saved.type}</p>
                  </div>
                  <div className="button-row">
                    {confirmMode ? (
                      <button className="primary-button" type="button" onClick={() => navigate(next)}>
                        Confirm
                      </button>
                    ) : null}
                    <button className="ghost-button" type="button" onClick={() => removeLocation(index)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="meta-copy">{saved.houseNumber}, {saved.fullAddress}, {saved.state} - {saved.pincode}</p>
                <p className="meta-copy">{saved.mapLocation}</p>
              </div>
            ))
          ) : (
            <div className="summary-card">
              <h3>No saved locations yet</h3>
              <p className="copy">Location is mandatory before checkout. Add one below.</p>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}

function CartPage() {
  const { cart, cartTotal, removeFromCart } = useApp();

  return (
    <Shell subtitle="Cart">
      <section className="cart-layout">
        <div>
          <div className="section-header">
            <p className="eyebrow">Cart</p>
            <h1 className="section-title">Individual price and total price stay visible here.</h1>
          </div>
          {!cart.length ? (
            <div className="summary-card">
              <h3>Your cart is empty</h3>
              <p className="copy">Open any product page and use Add to Cart after accepting the terms.</p>
            </div>
          ) : (
            <div className="grid-2" style={{ gridTemplateColumns: "1fr" }}>
              {cart.map((item, index) => (
                <div key={`${item.slug}-${item.size}-${index}`} className="product-card">
                  <div className="price-row">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="meta-copy">{item.category} / Size {item.size} / Qty {item.quantity}</p>
                    </div>
                    <span className="price-tag">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                  <div className="button-row">
                    <NavLink className="product-link" to={`/product/${item.slug}`}>
                      View Product
                    </NavLink>
                    <button className="ghost-button" type="button" onClick={() => removeFromCart(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="summary-card">
          <h3>Order summary</h3>
          <div className="summary-line"><span>Subtotal</span><strong>{formatCurrency(cartTotal)}</strong></div>
          <div className="summary-line"><span>Shipping</span><strong>Free</strong></div>
          <div className="summary-line"><span>Total</span><strong>{formatCurrency(cartTotal)}</strong></div>
          <p className="copy">Location is mandatory before checkout. Free shipping all over India except remote areas.</p>
          <div className="button-row">
            <NavLink className="primary-button" to="/payment">
              Proceed to Checkout
            </NavLink>
            <NavLink className="secondary-button" to="/home">
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function PaymentPage() {
  const navigate = useNavigate();
  const { auth, cartTotal, clearCart, locations, toast } = useApp();
  const [method, setMethod] = useState<"card" | "upi">("card");
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upi: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authMeetsCommerceRequirements(auth)) {
      navigate("/login");
      return;
    }
    if (!locations.length) {
      toast("Please save a delivery location before payment.");
      window.setTimeout(() => navigate("/locations"), 700);
      return;
    }

    if (method === "upi") {
      if (!form.upi.trim()) {
        toast("Please enter your UPI ID.");
        return;
      }
      toast(`Payment request sent to ${form.upi.trim()}.`);
    } else {
      if (!form.cardNumber.trim()) {
        toast("Please enter your card details.");
        return;
      }
      toast("Card payment confirmed.");
    }

    clearCart();
    window.setTimeout(() => navigate("/home"), 900);
  };

  return (
    <Shell subtitle="Payment">
      <section className="payment-layout">
        <div className="form-card">
          <p className="eyebrow">Payment</p>
          <h3>Card payment or UPI request only</h3>
          <p className="copy">No cash on delivery. If location is missing, payment will ask you to add one first.</p>
          <div className="method-tabs">
            <button className={`tab-button ${method === "card" ? "is-active" : ""}`} type="button" onClick={() => setMethod("card")}>
              Card Payment
            </button>
            <button className={`tab-button ${method === "upi" ? "is-active" : ""}`} type="button" onClick={() => setMethod("upi")}>
              UPI Payment
            </button>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            {method === "card" ? (
              <div>
                <input className="input-field" type="text" placeholder="Name on card" value={form.cardName} onChange={(event) => setForm((current) => ({ ...current, cardName: event.target.value }))} />
                <input className="input-field" type="text" placeholder="Card number" value={form.cardNumber} onChange={(event) => setForm((current) => ({ ...current, cardNumber: event.target.value }))} />
                <div className="grid-2">
                  <input className="input-field" type="text" placeholder="Expiry" value={form.expiry} onChange={(event) => setForm((current) => ({ ...current, expiry: event.target.value }))} />
                  <input className="input-field" type="text" placeholder="CVV" value={form.cvv} onChange={(event) => setForm((current) => ({ ...current, cvv: event.target.value }))} />
                </div>
              </div>
            ) : (
              <div>
                <input className="input-field" type="text" placeholder="yourid@upi" value={form.upi} onChange={(event) => setForm((current) => ({ ...current, upi: event.target.value }))} />
                <p className="copy">We will send a payment request to your UPI ID.</p>
              </div>
            )}
            <button className="primary-button" type="submit">Pay Now</button>
          </form>
        </div>
        <div className="summary-card">
          <h3>Checkout notes</h3>
          <div className="summary-line"><span>Total Due</span><strong>{formatCurrency(cartTotal)}</strong></div>
          <ul className="policy-list">
            <li>Location is mandatory before payment.</li>
            <li>Free shipping across India except remote areas.</li>
            <li>Card and UPI only.</li>
          </ul>
        </div>
      </section>
    </Shell>
  );
}

function ContactPage() {
  const { toast } = useApp();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast("Please enter your email and your query.");
      return;
    }
    setEmail("");
    setMessage("");
    toast("Your query has been sent.");
  };

  return (
    <Shell subtitle="Contact us" showNav={false}>
      <section className="split-layout">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="section-title">Ask us anything through a cleaner support page.</h1>
          <p className="copy">Share your email, write your query, and keep the brand contact details visible on the same page.</p>
          <div className="hero-note">
            Official email: support@scottcart.in
            <br />
            Instagram: @scottcart
            <br />
            X: @scottcart
          </div>
        </div>
        <div className="form-card">
          <h3>Contact Us</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input-field" type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
            <textarea className="textarea-field" placeholder="Write your query" value={message} onChange={(event) => setMessage(event.target.value)}></textarea>
            <button className="primary-button" type="submit">Ask</button>
          </form>
        </div>
      </section>
    </Shell>
  );
}

function StaticContentPage({
  eyebrow,
  title,
  copy,
  path,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  path: string;
}) {
  return (
    <Shell subtitle={eyebrow}>
      <section className="split-layout">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="section-title">{title}</h1>
          <p className="copy">{copy}</p>
          <div className="hero-actions">
            <NavLink className="primary-button" to="/home">
              Back Home
            </NavLink>
            <NavLink className="secondary-button" to={path === "/explore-experience" ? "/new-arrivals" : "/contact"}>
              {path === "/explore-experience" ? "View New Arrivals" : "Contact Us"}
            </NavLink>
          </div>
        </div>
        <div className="hero-note">
          <strong>Dedicated route</strong>
          <p className="copy">This page is now part of the TSX app, so it shares the same typed navigation, cart state, theme state, and profile flow as the rest of the storefront.</p>
        </div>
      </section>
    </Shell>
  );
}

function ToastHost() {
  const { dismissToast, toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <>
      {toasts.map((item) => (
        <div key={item.id} className="toast is-visible" onClick={() => dismissToast(item.id)}>
          {item.message}
        </div>
      ))}
    </>
  );
}

export default App;
