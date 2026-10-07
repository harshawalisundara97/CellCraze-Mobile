"use client";

import { create } from "zustand";

export interface CartStoreItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartStoreItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartStoreItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setItems: (items: CartStoreItem[]) => void;
}

interface CartDerived {
  totalAmount: number;
  cartCount: number;
}

export type CartStore = CartState & CartActions & CartDerived;

export const useCartStore = create<CartStore>((set, get) => ({
  // state
  items: [],
  isOpen: false,

  // derived (re-computed on every access)
  get totalAmount() {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
  get cartCount() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },

  // actions
  addItem: (incoming) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.productId === incoming.productId,
      );
      if (existing) {
        const newQty = Math.min(
          existing.quantity + (incoming.quantity ?? 1),
          existing.stock,
        );
        return {
          items: state.items.map((i) =>
            i.productId === incoming.productId
              ? { ...i, quantity: newQty }
              : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { ...incoming, quantity: incoming.quantity ?? 1 },
        ],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.productId !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(quantity, i.stock) }
            : i,
        ),
      };
    });
  },

  clearCart: () => set({ items: [] }),

  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

  setItems: (items) => set({ items }),
}));

// selectors
export const selectTotalAmount = (state: CartStore) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const selectCartCount = (state: CartStore) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);
