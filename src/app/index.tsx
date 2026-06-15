import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useEffect, useRef, useState } from 'react';
import { categories, fetchProducts, FetchProductsParams, Product } from './server/server';




export default function HomeScreen() {

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const [data, setData] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("All categories");

  useEffect(() => {
    hasMoreRef.current = true;
    setHasMore(true);
    const timeout = setTimeout(() => {
      loadProducts({
        page: 1,
        search,
        category
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category]);

  const loadProducts = async ({page, search, category}: FetchProductsParams) => {
          if (loadingRef.current || !hasMoreRef.current) return;

          loadingRef.current = true;
          setLoading(true);

          const res = await fetchProducts({
            page: page,
            limit: 4,
            search,
            category
          });

          if (page === 1) {
            setData(res.items);
          } else {
            setData((prev) => [...prev, ...res.items]);
          }

          hasMoreRef.current = res.hasMore;
          setHasMore(res.hasMore);
          setPage(page || 1);

          loadingRef.current = false;
          setLoading(false);
      }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={{padding: 24, flex: 1}}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={{color: 'white'}}
            placeholder="Search products..."
          />
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
              <View key={item.id} style={styles.product}>
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
              </View>
      )}
      onEndReached={() => loadProducts({page: page + 1, search, category})}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
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
  }
});
