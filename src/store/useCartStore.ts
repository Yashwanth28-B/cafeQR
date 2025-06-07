import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  calculateTotal: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  addItem: (newItem) => {
    const items = get().items;
    const existingItem = items.find((item) => item.id === newItem.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { ...newItem, quantity: 1 }] });
    }
    get().calculateTotal();
  },
  removeItem: (id) => {
    set({ items: get().items.filter((item) => item.id !== id) });
    get().calculateTotal();
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    });
    get().calculateTotal();
  },
  updateNotes: (id, notes) => {
    set({
      items: get().items.map((item) =>
        item.id === id ? { ...item, notes } : item
      ),
    });
  },
  clearCart: () => {
    set({ items: [], total: 0 });
  },
  calculateTotal: () => {
    const total = get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    set({ total });
  },
}));
