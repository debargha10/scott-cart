import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fallbackImageByCategory, PRODUCT_CATALOG } from "../data/catalog";
import type {
  AuthProfile,
  CartItem,
  ImageEntry,
  PendingAction,
  SavedLocation,
  ThemeName,
} from "../types";

const THEME_KEY = "scottcart-theme";
const AUTH_KEY = "scottcart-auth";
const CART_KEY = "scottcart-cart";
const LOCATIONS_KEY = "scottcart-locations";
const PENDING_ACTION_KEY = "scottcart-pending-action";
const IMAGE_LIBRARY_PATH = "/assets/data/image-library.json";

const themes: ThemeName[] = ["default", "obsidian", "sunset", "black-drip"];

const themeLabels: Record<ThemeName, string> = {
  default: "Noir",
  obsidian: "Obsidian",
  sunset: "Sunset",
  "black-drip": "Black Drip",
};

interface ToastMessage {
  id: number;
  message: string;
}

interface AppContextValue {
  theme: ThemeName;
  themeLabel: string;
  cycleTheme: () => void;
  auth: AuthProfile | null;
  saveAuth: (profile: AuthProfile) => void;
  cart: CartItem[];
  addToCart: (slug: string, size: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  locations: SavedLocation[];
  saveLocation: (location: SavedLocation) => { ok: boolean; message: string };
  removeLocation: (index: number) => void;
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
  imageMap: Map<string, ImageEntry>;
  resolveImage: (slug: string) => string;
  toast: (message: string) => void;
  toasts: ToastMessage[];
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const readJson = <T,>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const getCurrentTheme = (): ThemeName => {
  const stored = localStorage.getItem(THEME_KEY) as ThemeName | null;
  return stored && themes.includes(stored) ? stored : "default";
};

export const phoneIsValid = (phone: string) => /^\+91\d{10}$/.test(phone.trim());

export const authMeetsCommerceRequirements = (auth: AuthProfile | null): boolean =>
  Boolean(auth && auth.name && auth.gender && phoneIsValid(auth.phone));

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const getOfferState = (product: (typeof PRODUCT_CATALOG)[string]) => {
  const today = new Date().toISOString().slice(0, 10);
  const expired = product.offerEnds ? today > product.offerEnds : false;
  const soldOut = typeof product.stock === "number" ? product.stock <= 0 : false;

  if (expired) return { label: "Offer ended", unavailable: true };
  if (soldOut) return { label: "Out of stock", unavailable: true };
  if (product.offerEnds) return { label: `Offer until ${product.offerEnds}`, unavailable: false };
  return { label: "Available now", unavailable: false };
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeName>(() => getCurrentTheme());
  const [auth, setAuth] = useState<AuthProfile | null>(() => readJson<AuthProfile | null>(AUTH_KEY, null));
  const [cart, setCart] = useState<CartItem[]>(() => readJson<CartItem[]>(CART_KEY, []));
  const [locations, setLocations] = useState<SavedLocation[]>(() =>
    readJson<SavedLocation[]>(LOCATIONS_KEY, [])
  );
  const [pendingAction, setPendingActionState] = useState<PendingAction | null>(() =>
    readJson<PendingAction | null>(PENDING_ACTION_KEY, null)
  );
  const [imageMap, setImageMap] = useState<Map<string, ImageEntry>>(new Map());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === "default") {
      delete document.documentElement.dataset.theme;
      return;
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    if (auth) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      return;
    }
    localStorage.removeItem(AUTH_KEY);
  }, [auth]);

  useEffect(() => {
    if (pendingAction) {
      localStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(pendingAction));
      return;
    }
    localStorage.removeItem(PENDING_ACTION_KEY);
  }, [pendingAction]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch(IMAGE_LIBRARY_PATH);
        if (!response.ok) return;
        const data = (await response.json()) as ImageEntry[];
        setImageMap(new Map(data.map((entry) => [entry.slug, entry])));
      } catch {
        setImageMap(new Map());
      }
    };
    void loadImages();
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme((current) => themes[(themes.indexOf(current) + 1) % themes.length]);
  }, []);

  const saveAuth = useCallback((profile: AuthProfile) => {
    setAuth(profile);
  }, []);

  const addToCart = useCallback((slug: string, size: string) => {
    const product = PRODUCT_CATALOG[slug];
    if (!product) return;

    setCart((current) => {
      const next = [...current];
      const existing = next.find((item) => item.slug === slug && item.size === size);
      if (existing) {
        existing.quantity += 1;
        return next;
      }
      next.push({
        slug,
        name: product.name,
        price: product.price,
        size,
        quantity: 1,
        category: product.category,
      });
      return next;
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const saveLocation = useCallback((location: SavedLocation) => {
    if (!location.label || !location.houseNumber || !location.fullAddress || !location.state || !location.pincode) {
      return { ok: false, message: "House number, full address, pincode, and state are mandatory." };
    }

    if (
      locations.some((entry) => entry.label.toLowerCase() === location.label.toLowerCase())
    ) {
      return { ok: false, message: "Location labels must be unique." };
    }

    const home = locations.find((entry) => entry.type === "Home");
    const work = locations.find((entry) => entry.type === "Work");
    const currentFull = `${location.houseNumber} ${location.fullAddress}`.toLowerCase();

    if (location.type === "Home" && work && `${work.houseNumber} ${work.fullAddress}`.toLowerCase() === currentFull) {
      return { ok: false, message: "Home and work locations cannot be the same." };
    }

    if (location.type === "Work" && home && `${home.houseNumber} ${home.fullAddress}`.toLowerCase() === currentFull) {
      return { ok: false, message: "Work and home locations cannot be the same." };
    }

    setLocations((current) => [...current, location]);
    return { ok: true, message: "Location saved." };
  }, [locations]);

  const removeLocation = useCallback((index: number) => {
    setLocations((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const setPendingAction = useCallback((action: PendingAction | null) => {
    setPendingActionState(action);
  }, []);

  const resolveImage = useCallback(
    (slug: string) => {
      const libraryHit = imageMap.get(slug);
      if (libraryHit?.image) return libraryHit.image;
      if (slug === "editorial-home") return fallbackImageByCategory.hero;
      const product = PRODUCT_CATALOG[slug];
      if (!product) return fallbackImageByCategory.hero;
      return fallbackImageByCategory[product.category] ?? fallbackImageByCategory.hero;
    },
    [imageMap]
  );

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
    }, 2600);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cart]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      themeLabel: themeLabels[theme],
      cycleTheme,
      auth,
      saveAuth,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      locations,
      saveLocation,
      removeLocation,
      pendingAction,
      setPendingAction,
      imageMap,
      resolveImage,
      toast,
      toasts,
      dismissToast,
    }),
    [
      theme,
      cycleTheme,
      auth,
      saveAuth,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      locations,
      saveLocation,
      removeLocation,
      pendingAction,
      setPendingAction,
      imageMap,
      resolveImage,
      toast,
      toasts,
      dismissToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
};
