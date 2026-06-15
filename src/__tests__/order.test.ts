import { placeOrder } from '@/lib/order';
import type { CartItem } from '@/store/cart-context';

const sampleCartItem: CartItem = {
  id: 'order-1',
  label: 'Order Product',
  price: 23,
  description: 'Order item description',
  photoUrl: 'https://example.com/order.png',
  rating: 4,
  category: 'Orders',
  stock: true,
  quantity: 2,
};

describe('placeOrder', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('throws when the cart is empty', async () => {
    await expect(placeOrder([])).rejects.toThrow(
      'Your cart is empty. Add items before placing an order.',
    );
  });

  it('returns a mock order result after the delay', async () => {
    jest.useFakeTimers();

    const orderPromise = placeOrder([sampleCartItem]);
    jest.runAllTimers();

    const result = await orderPromise;

    expect(result.orderId).toMatch(/^MOCK-/);
    expect(new Date(result.placedAt).toString()).not.toBe('Invalid Date');
  });
});
