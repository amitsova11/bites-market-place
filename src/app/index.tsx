import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import ItemDetails from '@/components/ItemDetails';
import ProductsList from '@/components/ProductsList';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { categories, fetchProducts, FetchProductsParams, Product } from '@/lib/products';
import { useCart } from '@/store/cart-context';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const theme = useTheme();
  const textStyle = { color: theme.text };

  const loadProducts = useCallback(async ({ page, search, category, sort }: FetchProductsParams) => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;

    const res = await fetchProducts({
      page,
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
  }, []);

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
  }, [search, category, sort, loadProducts]);

  return (
    <Container style={{ backgroundColor: theme.background }}>
      <Screen style={{ backgroundColor: theme.background }}>
        {selectedProduct ? (
          <ItemDetails
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={() => {
              addItem(selectedProduct);
              setSelectedProduct(null);
            }}
            theme={theme}
            textStyle={textStyle}
          />
        ) : (
          <ProductsList
            categories={categories}
            data={data}
            search={search}
            category={category}
            sort={sort}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onSortToggle={() => setSort((currentSort) => (currentSort === 'price_asc' ? 'price_desc' : 'price_asc'))}
            onSelectProduct={setSelectedProduct}
            onEndReached={() => loadProducts({ page: page + 1, search, category, sort })}
            theme={theme}
            textStyle={textStyle}
          />
        )}
      </Screen>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
`;

const Screen = styled(SafeAreaView)`
  flex: 1;
  padding-horizontal: ${Spacing.five}px;
  align-items: center;
  gap: ${Spacing.three}px;
  padding-bottom: ${BottomTabInset + Spacing.three}px;
  max-width: ${MaxContentWidth}px;
`;
