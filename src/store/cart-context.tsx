import { Product } from '@/lib/products';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { CartItem, addItem, clearCart, removeItem, setQuantity } from './cart-slice';
import { useAppDispatch, useAppSelector } from './hooks';
import { store } from './store';

export interface CartContextType {
  state: {
    items: CartItem[];
  };
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export const useCart = (): CartContextType => {
  const state = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  return {
    state,
    addItem: (product: Product) => dispatch(addItem(product)),
    removeItem: (productId: string) => dispatch(removeItem(productId)),
    updateItemQuantity: (productId: string, quantity: number) =>
      dispatch(setQuantity({ productId, quantity })),
    clearCart: () => dispatch(clearCart()),
  };
};

export type { CartItem };
