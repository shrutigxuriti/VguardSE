import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../../../../colors';
import { getProductWiseOffers } from '../../../../../utils/apiservice';
import Loader from '../../../../../components/Loader';

const baseURL = 'https://www.vguardrishta.com/';

interface Category {
  categoryId: number;
  imageUrl: string;
  // Add other properties as needed
}

interface ProductWiseProps {
  navigation: any; // You might want to replace 'any' with the correct type
}

const ProductWise: React.FC<ProductWiseProps> = ({ navigation }) => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductWiseOffers()
      .then(response => response.data)
      .then(responseData => {
        
        const updatedData = responseData.map((category: Category) => ({
          ...category,
          imageUrl: baseURL + category.imageUrl,
        }));
        setData(updatedData);
        setLoading(false);
        console.log("RESPONSE DATA-------", updatedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleCategoryPress = (categoryId: number) => {
    const category = data.find(item => item.categoryId === categoryId);
    console.log('category id:', categoryId);
    navigation.navigate('Product Wise Offers Table', { categoryId });
  };

  return (
    <ScrollView style={styles.mainWrapper}>
      <Loader isLoading={loading} />
      {data.map(category => (
        <TouchableOpacity
          key={category.categoryId}
          style={styles.categoryContainer}
          onPress={() => handleCategoryPress(category.categoryId)}>
          <Image
            source={{ uri: category.imageUrl }}
            style={styles.categoryImage}
            onLoadEnd={() => setLoading(false)}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: colors.white,
    flex: 1,
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },
  categoryImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.lightGrey
  },
});

export default ProductWise;
