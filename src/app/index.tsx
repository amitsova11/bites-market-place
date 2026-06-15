import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import { fetchProducts, FetchProductsParams, Product } from './server/server';




export default function HomeScreen() {

  const theme = useTheme();


  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts({
        page: 1,
        search,
      });
    }, 300);

    setHasMore(true)

    return () => clearTimeout(timeout);
  }, [search]);


const loadProducts = async ({page, search}: FetchProductsParams) => {
          if (loading || !hasMore) return;

          setLoading(true);

          const res = await fetchProducts({
            page: page,
            limit: 4,
            search
          });

          if (page === 1) {
            setData(res.items);
          } else {
            setData((prev) => [...prev, ...res.items]);
          }

          setHasMore(res.hasMore);
          setPage(page || 1);

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
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View key={item.id} style={styles.product}>
                <ThemedText style={{fontSize: 30}} >{item.label}</ThemedText>
                <ThemedText >{item.description}</ThemedText>
                <ThemedText >Price: {item.price}$</ThemedText>
                <ThemedText >Rating: {item.rating}</ThemedText>
                <ThemedText style={{color: item.stock ? 'green' : 'red' }} >
                  {item.stock ? "In stock" : "Out of stock"}
                </ThemedText>
              </View>
      )}
      onEndReached={() => loadProducts({page: page +1, search})}
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
