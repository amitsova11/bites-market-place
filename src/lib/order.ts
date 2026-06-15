import { CartItem } from '@/store/cart-context';

export interface PlaceOrderResult {
  orderId: string;
  placedAt: string;
}

export const placeOrder = async (items: CartItem[]): Promise<PlaceOrderResult> => {
  if (items.length === 0) {
    throw new Error('Your cart is empty. Add items before placing an order.');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId: `MOCK-${Date.now()}`,
        placedAt: new Date().toISOString(),
      });
    }, 1200);
  });
};
