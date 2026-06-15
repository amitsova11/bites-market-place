import { CartProvider } from '@/store/cart-context';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <CartProvider>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Shop' }} />
        <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      </Tabs>
    </CartProvider>
  );
}
