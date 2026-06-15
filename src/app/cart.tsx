import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCart } from '@/store/cart-context';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

export default function CartScreen() {
  const { state, removeItem, clearCart } = useCart();
  const router = useRouter();

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
              keyExtractor={(item) => item.cartItemId}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <ThemedText style={styles.itemLabel}>{item.label}</ThemedText>
                  <ThemedText>Qty: {item.quantity}</ThemedText>
                  <ThemedText>Price: ${item.price}</ThemedText>
                  <Pressable
                    onPress={() => removeItem(item.cartItemId)}
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
              <Pressable onPress={() => clearCart()} style={styles.clearButton}>
                <ThemedText type="linkPrimary">Clear cart</ThemedText>
              </Pressable>
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
});
