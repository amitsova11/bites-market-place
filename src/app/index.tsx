import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

interface Product {
  id: string;
  label: string;
  price: number;
  description: string;
  photoUrl: string;
  rating: number;
  stock: boolean;
}

const sampleData: Product[] = [
  {
    id: '1',
    label: "Apple iPhone 17", 
    price: 1000, description: "A phone that will steal your soul", 
    photoUrl: "https://mtmobile28.co.il/wp-content/uploads/2026/03/%D7%90%D7%99%D7%99%D7%A4%D7%95%D7%9F-%D7%97%D7%93%D7%A9-Apple-iPhone-17-Pro-Max-512GB-%D7%90%D7%A4%D7%9C-%D7%96%D7%9E%D7%99%D7%9F-%D7%91%D7%9E%D7%9C%D7%90%D7%99.jpg",
    rating: 5,
    stock: true
  }
]

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={{padding: 24}}>
          {sampleData.map((product) => 
          <View key={product.id} style={
              {
                borderStyle:"solid", 
                borderColor: "lightblue", 
                borderWidth: 1, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px',
                padding: 24
              }
            }>
            <ThemedText style={{fontSize: 30}} >{product.label}</ThemedText>
            <ThemedText >{product.description}</ThemedText>
            <ThemedText >Price: {product.price}$</ThemedText>
            <ThemedText >Rating: {product.rating}</ThemedText>
            <ThemedText style={{color: product.stock ? 'green' : 'red' }} >
              {product.stock ? "In stock" : "Out of stock"}
              </ThemedText>
          </View>
          )}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
