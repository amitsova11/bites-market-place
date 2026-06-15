import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { fetchProductById } from '../server/server';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = id && typeof id === 'string' ? fetchProductById(id) : null;

  if (!product) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.safeArea}>
          <ThemedText type="title">Product not found</ThemedText>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText type="linkPrimary">Go back</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.safeArea}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText type="linkPrimary">← Back</ThemedText>
        </Pressable>
        <Image source={{ uri: product.photoUrl }} style={styles.image} />
        <ThemedText type="title">{product.label}</ThemedText>
        <ThemedText style={styles.category}>Category: {product.category}</ThemedText>
        <ThemedText>{product.description}</ThemedText>
        <ThemedText style={styles.price}>Price: ${product.price}</ThemedText>
        <ThemedText>Rating: {product.rating}</ThemedText>
        <ThemedText style={{ color: product.stock ? 'green' : 'red' }}>
          {product.stock ? 'In stock' : 'Out of stock'}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
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
  image: {
    width: '100%',
    height: 260,
    borderRadius: 14,
    backgroundColor: '#222',
  },
  category: {
    fontStyle: 'italic',
    color: '#c0c0c0',
  },
  price: {
    fontWeight: '700',
    fontSize: 18,
  },
});
