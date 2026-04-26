import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import type { FirestoreProduct } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyBkIpHv_v6DolXe0oYqJt9uBmuC6zWlM2M",
  authDomain: "scott-cart.firebaseapp.com",
  projectId: "scott-cart",
  storageBucket: "scott-cart.firebasestorage.app",
  messagingSenderId: "434099178923",
  appId: "1:434099178923:web:8eb45fd7fe4a66f71896ee",
  measurementId: "G-L106NB2GWS",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchFirestoreProducts = async (): Promise<FirestoreProduct[]> => {
  const snapshot = await getDocs(collection(db, "PRODUCTS"));
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Partial<FirestoreProduct>;
    return {
      id: doc.id,
      name: data.name ?? "Unnamed Product",
      price: Number(data.price ?? 0),
      stock: Number(data.stock ?? 0),
    };
  });
};
