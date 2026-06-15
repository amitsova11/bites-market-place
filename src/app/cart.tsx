import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { placeOrder } from '@/lib/order';
import { useCart } from '@/store/cart-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

export default function CartScreen() {
  const { state, removeItem, updateItemQuantity, clearCart } = useCart();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.safeArea}>
        <Pressable onPress={() => router.push('/')} style={styles.backButton}>
          <ThemedText type="linkPrimary">← Back to shop</ThemedText>
        </Pressable>
        <ThemedText type="title">Shopping Cart</ThemedText>
        {state.items.length === 0 ? (
          <ThemedText>Your cart is empty.</ThemedText>
        ) : (
          <>
            <FlatList
              data={state.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <ThemedText style={styles.itemLabel}>{item.label}</ThemedText>
                  <View style={styles.quantityRow}>
                    <Pressable
                      onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                      style={styles.quantityButton}
                    >
                      <ThemedText type="linkPrimary">−</ThemedText>
                    </Pressable>
                    <ThemedText style={styles.quantityValue}>{item.quantity}</ThemedText>
                    <Pressable
                      onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <ThemedText type="linkPrimary">+</ThemedText>
                    </Pressable>
                  </View>
                  <ThemedText>Price: ${item.price}</ThemedText>
                  <Pressable
                    onPress={() => removeItem(item.id)}
                    style={styles.removeButton}
                  >
                    <ThemedText type="linkPrimary">Remove</ThemedText>
                  </Pressable>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
            <View style={styles.summary}>
              <ThemedText style={styles.total}>Total: ${total.toFixed(2)}</ThemedText>
              <Pressable
                onPress={() => clearCart()}
                style={styles.clearButton}
              >
                <ThemedText type="linkPrimary">Clear cart</ThemedText>
              </Pressable>
              <Pressable
                disabled={isPlacingOrder}
                onPress={async () => {
                  setOrderMessage(null);
                  setIsPlacingOrder(true);
                  try {
                    const result = await placeOrder(state.items);
                    setOrderMessage(`Order placed: ${result.orderId}`);
                    clearCart();
                  } catch (error) {
                    const message = error instanceof Error ? error.message : 'Unable to place order.';
                    setOrderMessage(message);
                  } finally {
                    setIsPlacingOrder(false);
                  }
                }}
                style={[styles.orderButton, isPlacingOrder && styles.disabledButton]}
              >
                <ThemedText type="linkPrimary">
                  {isPlacingOrder ? 'Placing order…' : 'Place order'}
                </ThemedText>
              </Pressable>
              {orderMessage ? (
                <ThemedText style={styles.orderMessage}>{orderMessage}</ThemedText>
              ) : null}
            </View>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 24,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  item: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    padding: 16,
    gap: 8,
  },
  itemLabel: {
    fontWeight: '700',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
  },
  quantityValue: {
    minWidth: 28,
    textAlign: 'center',
    fontWeight: '700',
  },
  removeButton: {
    marginTop: 8,
  },
  summary: {
    marginTop: 16,
    alignItems: 'flex-start',
    gap: 8,
  },
  total: {
    fontWeight: '700',
    fontSize: 18,
  },
  clearButton: {
    paddingVertical: 8,
  },
  orderButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  disabledButton: {
    opacity: 0.5,
  },
  orderMessage: {
    marginTop: 4,
    color: 'darkgreen',
  },
});
