import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../colors';

interface CartProductCardProps {
  product: {
    image: any; // Change the type to the appropriate type of your image data
    name: string;
    price: number;
  };
}

const CartProductCard: React.FC<CartProductCardProps> = ({ product }) => {
  return (
    <View style={styles.productCard}>
      <Image source={product.image} style={styles.productImage} />
      <View style={styles.detail}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>{product.price} Points</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productName: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: colors.black,
  },
  productPrice: {
    fontSize: responsiveFontSize(1.8),
    color: colors.yellow,
    fontWeight: 'bold',
    textAlign: 'right',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  detail: {
    padding: 5,
    width: '65%',
    height: '100%',
  },
});

export default CartProductCard;
