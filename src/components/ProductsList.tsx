import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import styled from 'styled-components/native';

import { FetchProductsParams, Product } from '@/lib/products';

type ThemeColors = {
  text: string;
  textSecondary: string;
  backgroundElement: string;
  backgroundSelected: string;
};

interface ProductsListProps {
  categories: string[];
  data: Product[];
  search: string;
  category: string;
  sort?: FetchProductsParams['sort'];
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onSortToggle: () => void;
  onSelectProduct: (product: Product) => void;
  onEndReached: () => void;
  theme: ThemeColors;
  textStyle: { color: string };
}

export default function ProductsList({
  categories,
  data,
  search,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortToggle,
  onSelectProduct,
  onEndReached,
  theme,
  textStyle,
}: ProductsListProps) {
  return (
    <ProductListWrapper>
      <SearchInput
        value={search}
        onChangeText={onSearchChange}
        placeholder="Search products..."
        placeholderTextColor={theme.textSecondary}
        style={{ color: theme.text, borderColor: theme.backgroundSelected }}
      />
      <Spacer />
      <Row>
        <SortButton onPress={onSortToggle} active={Boolean(sort)}>
          <Text style={{ color: sort ? 'white' : theme.text }}>
            Sort price: {sort === 'price_asc' ? '↑' : sort === 'price_desc' ? '↓' : 'none'}
          </Text>
        </SortButton>
      </Row>
      <Spacer />
      <CategoryRow>
        {categories.map((c) => (
          <CategoryButton key={c} selected={category === c} onPress={() => onCategoryChange(c)}>
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
            onPress={() => onSelectProduct(item)}
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
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <Spacer />}
      />
    </ProductListWrapper>
  );
}

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
