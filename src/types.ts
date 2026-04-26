export type ThemeName = "default" | "obsidian" | "sunset" | "black-drip";
export type Gender = "Men" | "Women" | "Kids";
export type LocationType = "Home" | "Work" | "Other";

export interface AuthProfile {
  name: string;
  email: string;
  phone: string;
  gender: Gender | "";
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  category: string;
}

export interface SavedLocation {
  label: string;
  type: LocationType;
  houseNumber: string;
  fullAddress: string;
  state: string;
  pincode: string;
  mapLocation: string;
}

export interface PendingAction {
  slug: string;
  size: string;
  action: "buy" | "cart";
  returnTo?: string;
}

export interface CatalogProduct {
  name: string;
  category: string;
  price: number;
  sizes: string[];
  description: string;
  angles: string[];
  offerEnds?: string;
  stock?: number;
}

export interface ImageEntry {
  slug: string;
  image: string;
}

export interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}
