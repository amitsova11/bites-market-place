import { FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
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
  const theme = useTheme();
  const textStyle = { color: theme.text };

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
    <Container style={{ backgroundColor: theme.background }}>
      <Screen style={{ backgroundColor: theme.background }}>
        {selectedProduct ? (
          <DetailsContainer>
            <BackButton onPress={() => setSelectedProduct(null)}>
              <Text style={{ color: '#3c87f7' }}>← Back to list</Text>
            </BackButton>
            <ProductImage source={{ uri: selectedProduct.photoUrl }} />
            <Text style={[textStyle, { fontSize: 48, lineHeight: 52, fontWeight: '600' }]}>{selectedProduct.label}</Text>
            <CategoryText style={textStyle}>Category: {selectedProduct.category}</CategoryText>
            <Text style={textStyle}>{selectedProduct.description}</Text>
            <PriceText style={textStyle}>Price: ${selectedProduct.price}</PriceText>
            <Text style={textStyle}>Rating: {selectedProduct.rating}</Text>
            <Text style={[textStyle, { color: selectedProduct.stock ? 'green' : 'red' }]}> 
              {selectedProduct.stock ? 'In stock' : 'Out of stock'}
            </Text>
            <AddButton
              onPress={() => {
                addItem(selectedProduct);
                setSelectedProduct(null);
              }}
            >
              <Text style={{ color: '#3c87f7' }}>Add to cart</Text>
            </AddButton>
          </DetailsContainer>
        ) : (
          <ProductListWrapper>
            <SearchInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search products..."
              placeholderTextColor={theme.textSecondary}
              style={{ color: theme.text, borderColor: theme.backgroundSelected }}
            />
            <Spacer />
            <Row>
              <SortButton
                onPress={() => {
                  setSort((currentSort) => (currentSort === 'price_asc' ? 'price_desc' : 'price_asc'));
                }}
                active={Boolean(sort)}
              >
                <Text style={{ color: sort ? 'white' : theme.text }}>
                  Sort price: {sort === 'price_asc' ? '↑' : sort === 'price_desc' ? '↓' : 'none'}
                </Text>
              </SortButton>
            </Row>
            <Spacer />
            <CategoryRow>
              {categories.map((c) => (
                <CategoryButton key={c} selected={category === c} onPress={() => setCategory(c)}>
                  <Text style={{ color: category === c ? 'white' : theme.text }}>{c}</Text>
                </CategoryButton>
              ))}
            </CategoryRow>
            <Spacer />
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  key={item.id}
                  onPress={() => setSelectedProduct(item)}
                  style={{
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.backgroundSelected,
                  }}
                >
                  <Text style={[textStyle, { fontSize: 30 }]}>{item.label}</Text>
                  <Text style={textStyle}>{item.description}</Text>
                  <Text style={{ ...textStyle, fontStyle: 'italic', color: '#c0c0c0' }}>
                    Category: {item.category}
                  </Text>
                  <Text style={textStyle}>Price: {item.price}$</Text>
                  <Text style={textStyle}>Rating: {item.rating}</Text>
                  <Text style={[textStyle, { color: item.stock ? 'green' : 'red' }]}> 
                    {item.stock ? 'In stock' : 'Out of stock'}
                  </Text>
                </ProductCard>
              )}
              onEndReached={() => loadProducts({ page: page + 1, search, category, sort })}
              onEndReachedThreshold={0.5}
              ItemSeparatorComponent={() => <Spacer />}
            />
          </ProductListWrapper>
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

const ProductListWrapper = styled(View)`
  flex: 1;
  padding: 24px;
`;

const SearchInput = styled(TextInput)`
  color: white;
  padding: 10px 12px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.2);
`;

const Row = styled(View)`
  flex-direction: row;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const SortButton = styled(Pressable)<{ active: boolean }>`
  padding: 8px;
  background-color: ${({ active }) => (active ? 'black' : 'lightgray')};
`;

const CategoryRow = styled(View)`
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;

const CategoryButton = styled(Pressable)<{ selected: boolean }>`
  padding: 8px;
  background-color: ${({ selected }) => (selected ? 'black' : 'lightgray')};
`;

const ProductCard = styled(Pressable)`
  border-radius: 10px;
  border-style: solid;
  border-color: lightblue;
  border-width: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding-vertical: 24px;
  padding-horizontal: 36px;
`;

const Spacer = styled.View`
  height: 12px;
`;

const DetailsContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    alignItems: 'center',
  },
})`
  padding-vertical: 24px;
  padding-horizontal: 36px;
  gap: ${Spacing.three}px;
`;

const BackButton = styled(Pressable)`
  align-self: flex-start;
  padding-vertical: 8px;
  padding-horizontal: 12px;
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 260px;
  border-radius: 14px;
  background-color: #222;
`;

const CategoryText = styled(Text)`
  font-style: italic;
  color: #c0c0c0;
`;

const PriceText = styled(Text)`
  font-weight: 700;
  font-size: 18px;
`;

const AddButton = styled(Pressable)`
  margin-top: 16px;
  padding-vertical: 12px;
  padding-horizontal: 18px;
`;
