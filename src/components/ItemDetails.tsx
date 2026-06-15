import { Image, Pressable, ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';

import { Product } from '@/lib/products';

type ThemeColors = {
  text: string;
};

interface ItemDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: () => void;
  theme: ThemeColors;
  textStyle: { color: string };
}

export default function ItemDetails({ product, onBack, onAddToCart, theme, textStyle }: ItemDetailsProps) {
  const isOutOfStock = !product.stock;

  return (
    <DetailsContainer>
      <BackButton onPress={onBack}>
        <Text style={{ color: '#3c87f7' }}>← Back to list</Text>
      </BackButton>
      <ProductImage source={{ uri: product.photoUrl }} />
      <Text style={[textStyle, { fontSize: 48, lineHeight: 52, fontWeight: '600' }]}>{product.label}</Text>
      <CategoryText style={textStyle}>Category: {product.category}</CategoryText>
      <Text style={textStyle}>{product.description}</Text>
      <PriceText style={textStyle}>Price: ${product.price}</PriceText>
      <Text style={textStyle}>Rating: {product.rating}</Text>
      <Text style={[textStyle, { color: product.stock ? 'green' : 'red' }]}> 
        {product.stock ? 'In stock' : 'Out of stock'}
      </Text>
      <AddButton
        onPress={product.stock ? onAddToCart : undefined}
        disabled={isOutOfStock}
        outOfStock={isOutOfStock}
      >
        <Text style={{ color: isOutOfStock ? '#ccc' : '#3c87f7' }}>
          {isOutOfStock ? 'Out of stock' : 'Add to cart'}
        </Text>
      </AddButton>
    </DetailsContainer>
  );
}

const DetailsContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    alignItems: 'center',
    display: 'flex',
    gap: 18,
    paddingVertical: 24,
    paddingHorizontal: 36,
  },
})`
  padding-vertical: 24px;
  padding-horizontal: 36px;
  gap: 18px;
  display: flex;
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

const AddButton = styled(Pressable)<{ outOfStock: boolean }>`
  margin-top: 16px;
  padding-vertical: 12px;
  padding-horizontal: 18px;
  background-color: ${({ outOfStock }) => (outOfStock ? '#444' : 'transparent')};
  opacity: ${({ outOfStock }) => (outOfStock ? 0.7 : 1)};
`;
