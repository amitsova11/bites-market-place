import type { Product } from '@/lib/products';
import cartReducer, { addItem, clearCart, removeItem, setQuantity } from '@/store/cart-slice';

const sampleProduct: Product = {
  id: 'test-1',
  label: 'Test Product',
  price: 10,
  description: 'A product for testing',
  photoUrl: 'https://example.com/test.png',
  rating: 5,
  category: 'Test',
  stock: true,
};

describe('cart reducer', () => {
  it('adds a new item when the cart is empty', () => {
    const state = cartReducer(undefined, addItem(sampleProduct));

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      ...sampleProduct,
      quantity: 1,
    });
  });

  it('increments quantity for an existing item', () => {
    const state = cartReducer(
      { items: [{ ...sampleProduct, quantity: 1 }] },
      addItem(sampleProduct),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('removes an item when quantity reaches zero', () => {
    const currentState = { items: [{ ...sampleProduct, quantity: 1 }] };
    const nextState = cartReducer(currentState, removeItem(sampleProduct.id));

    expect(nextState.items).toHaveLength(0);
  });

  it('updates quantity and removes item when set to zero', () => {
    const currentState = { items: [{ ...sampleProduct, quantity: 3 }] };
    const nextState = cartReducer(
      currentState,
      setQuantity({ productId: sampleProduct.id, quantity: 0 }),
    );

    expect(nextState.items).toHaveLength(0);
  });

  it('clears the cart', () => {
    const currentState = { items: [{ ...sampleProduct, quantity: 2 }] };
    const nextState = cartReducer(currentState, clearCart());

    expect(nextState.items).toEqual([]);
  });
});
