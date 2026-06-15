import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { placeOrder } from '@/lib/order';
import { useCart } from '@/store/cart-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import styled from 'styled-components/native';

export default function CartScreen() {
  const { state, removeItem, updateItemQuantity, clearCart } = useCart();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  const theme = useTheme();
  const textStyle = { color: theme.text };

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container style={{ backgroundColor: theme.background }}>
      <SafeArea style={{ backgroundColor: theme.background }}>
        <BackButton onPress={() => router.push('/')}>
          <Text style={{ color: '#3c87f7' }}>← Back to shop</Text>
        </BackButton>
        <Text style={[textStyle, { fontSize: 48, lineHeight: 52, fontWeight: '600' }]}>Shopping Cart</Text>
        {state.items.length === 0 ? (
          <Text style={textStyle}>Your cart is empty.</Text>
        ) : (
          <>
            <FlatList
              data={state.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Item style={{ backgroundColor: theme.backgroundElement }}>
                  <Text style={[textStyle, { fontWeight: '700' }]}>{item.label}</Text>
                  <QuantityRow>
                    <QuantityButton
                      onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                    >
                      <Text style={{ color: '#3c87f7' }}>−</Text>
                    </QuantityButton>
                    <Text style={[textStyle, { minWidth: 28, textAlign: 'center', fontWeight: '700' }]}> 
                      {item.quantity}
                    </Text>
                    <QuantityButton
                      onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={{ color: '#3c87f7' }}>+</Text>
                    </QuantityButton>
                  </QuantityRow>
                  <Text style={textStyle}>Price: ${item.price}</Text>
                  <Pressable onPress={() => removeItem(item.id)}>
                    <Text style={{ color: '#3c87f7' }}>Remove</Text>
                  </Pressable>
                </Item>
              )}
              ItemSeparatorComponent={() => <Spacer />}
            />
            <Summary>
              <Text style={[textStyle, { fontWeight: '700', fontSize: 18 }]}>
                Total: ${total.toFixed(2)}
              </Text>
              <Pressable onPress={() => clearCart()}>
                <Text style={{ color: '#3c87f7' }}>Clear cart</Text>
              </Pressable>
              <OrderButton
                style={{ borderColor: theme.backgroundSelected }}
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
              >
                <Text style={{ color: '#3c87f7' }}>
                  {isPlacingOrder ? 'Placing order…' : 'Place order'}
                </Text>
              </OrderButton>
              {orderMessage ? (
                <Text style={[textStyle, { marginTop: 4, color: 'darkgreen' }]}>{orderMessage}</Text>
              ) : null}
            </Summary>
          </>
        )}
      </SafeArea>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
`;

const SafeArea = styled.View`
  flex: 1;
  padding: 24px;
  gap: ${Spacing.three}px;
  padding-bottom: ${BottomTabInset + Spacing.three}px;
  max-width: ${MaxContentWidth}px;
  align-self: center;
`;

const BackButton = styled.Pressable`
  align-self: flex-start;
  padding-vertical: 8px;
  padding-horizontal: 12px;
`;

const Item = styled.View`
  border-width: 1px;
  border-color: lightgray;
  border-radius: 10px;
  padding: 16px;
  gap: 8px;
`;

const QuantityRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.Pressable`
  padding-vertical: 6px;
  padding-horizontal: 12px;
  border-width: 1px;
  border-color: lightgray;
  border-radius: 8px;
`;

const Summary = styled.View`
  margin-top: 16px;
  align-items: flex-start;
  gap: 8px;
`;

const OrderButton = styled.Pressable<{ disabled: boolean }>`
  padding-vertical: 10px;
  padding-horizontal: 16px;
  border-radius: 10px;
  border-width: 1px;
  border-color: lightgray;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const Spacer = styled.View`
  height: 12px;
`;
