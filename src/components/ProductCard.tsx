import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

interface Product {
    title: string;
    price: number;
    image: string;
}

interface ProductCardProps {
    product: Product;
    onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
                <Image source={{ uri: product.image }} style={styles.image} />
                <View style={styles.detail}>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.price}>${product.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        margin: 10,
        width: 150,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10,
        backgroundColor: 'yellow'
    },
    title: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.black
    },
    price: {
        fontSize: responsiveFontSize(1.5),
        fontWeight: 'bold',
        color: colors.black,
        textAlign: 'center',
    },
    detail: {
        width: '100%',
        backgroundColor: colors.lightYellow,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }
});

export default ProductCard;
