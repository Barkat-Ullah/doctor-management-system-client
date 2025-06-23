import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Medicine } from "@/types/medicine";

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ medicine: Medicine; quantity: number }>
    ) => {
      const { medicine, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.medicine.id === medicine.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ medicine, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.medicine.id !== action.payload
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.medicine.id === id);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.medicine.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
