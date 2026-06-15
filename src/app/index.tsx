import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { categories, fetchProducts, FetchProductsParams, Product } from '@/lib/products';
import { useCart } from '@/store/cart-context';
import { useEffect, useRef, useState } from 'react';

export default function HomeScreen() {

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const [data, setData] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("All categories");
  const [sort, setSort] = useState<FetchProductsParams['sort']>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    hasMoreRef.current = true;
    const timeout = setTimeout(() => {
      loadProducts({
        page: 1,
        search,
        category,
        sort,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category, sort]);

  const loadProducts = async ({page, search, category, sort}: FetchProductsParams) => {
          if (loadingRef.current || !hasMoreRef.current) return;

          loadingRef.current = true;

          const res = await fetchProducts({
            page: page,
            limit: 4,
            search,
            category,
            sort,
          });

          if (page === 1) {
            setData(res.items);
          } else {
            setData((prev) => [...prev, ...res.items]);
          }

          hasMoreRef.current = res.hasMore;
          setPage(page || 1);

          loadingRef.current = false;
      }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {selectedProduct ? (
          // Product Details View
          <ScrollView contentContainerStyle={styles.detailsContainer}>
            <Pressable onPress={() => setSelectedProduct(null)} style={styles.backButton}>
              <ThemedText type="linkPrimary">← Back to list</ThemedText>
            </Pressable>
            <Image source={{ uri: selectedProduct.photoUrl }} style={styles.image} />
            <ThemedText type="title">{selectedProduct.label}</ThemedText>
            <ThemedText style={styles.category}>Category: {selectedProduct.category}</ThemedText>
            <ThemedText>{selectedProduct.description}</ThemedText>
            <ThemedText style={styles.price}>Price: ${selectedProduct.price}</ThemedText>
            <ThemedText>Rating: {selectedProduct.rating}</ThemedText>
            <ThemedText style={{ color: selectedProduct.stock ? 'green' : 'red' }}>
              {selectedProduct.stock ? 'In stock' : 'Out of stock'}
            </ThemedText>
            <Pressable
              onPress={() => {
                addItem(selectedProduct);
                setSelectedProduct(null);
              }}
              style={styles.addButton}
            >
              <ThemedText type="linkPrimary">Add to cart</ThemedText>
            </Pressable>
          </ScrollView>
        ) : (
          // Product List View
          <ThemedView style={{padding: 24, flex: 1}}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              style={{color: 'white'}}
              placeholder="Search products..."
            />
            <View style={{marginBottom: 10}}/>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Pressable
                onPress={() => {
                  setSort((currentSort) =>
                    currentSort === 'price_asc' ? 'price_desc' : 'price_asc'
                  );
                }}
                style={{
                  padding: 8,
                  backgroundColor: sort ? 'black' : 'lightgray',
                }}
              >
                <Text style={{ color: sort ? 'white' : 'black' }}>
                  Sort price: {sort === 'price_asc' ? '↑' : sort === 'price_desc' ? '↓' : 'none'}
                </Text>
              </Pressable>
            </View>
            <View style={{marginBottom: 10}}/>
            <View style={{ flexDirection: "row", gap: 10, flexWrap: 'wrap' }}>
              {categories.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={{
                      padding: 8,
                      backgroundColor: category === c ? "black" : "lightgray",
                    }}
                  >
                  <Text style={{ color: category === c ? "white" : "black" }}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={{marginBottom: 10}}/>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedProduct(item)}
                  style={styles.product}
                >
                  <ThemedText style={{fontSize: 30}} >{item.label}</ThemedText>
                  <ThemedText >{item.description}</ThemedText>
                  <ThemedText style={{fontStyle: 'italic', color: '#c0c0c0'}}>
                    Category: {item.category}
                  </ThemedText>
                  <ThemedText >Price: {item.price}$</ThemedText>
                  <ThemedText >Rating: {item.rating}</ThemedText>
                  <ThemedText style={{color: item.stock ? 'green' : 'red' }} >
                    {item.stock ? "In stock" : "Out of stock"}
                  </ThemedText>
                </Pressable>
            )}
            onEndReached={() => loadProducts({page: page + 1, search, category, sort})}
            onEndReachedThreshold={0.5}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
          </ThemedView>
        )}
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
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  product: {
    borderRadius: 10,
    borderStyle:"solid", 
    borderColor: "lightblue", 
    borderWidth: 1, 
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    paddingVertical: 24,
    paddingHorizontal: 36
  },
  detailsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 36,
    alignItems: 'center',
    gap: Spacing.three,
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
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
});
