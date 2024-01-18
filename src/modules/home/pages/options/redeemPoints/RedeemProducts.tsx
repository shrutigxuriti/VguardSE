import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, FlatList } from 'react-native';
import { Dialog, Badge, Portal, List, Button } from 'react-native-paper';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Provider as PaperProvider } from 'react-native-paper';
import colors from '../../../../../../colors';
import ProductCard from '../../../../../components/ProductCard';
import { useTranslation } from 'react-i18next';


const RedeemProducts = ({ navigation }) => {
  const { t } = useTranslation();

  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [pointsDialogVisible, setPointsDialogVisible] = useState(false);

  const showCategoryDialog = () => {
    setCategoryDialogVisible(true);
  };

  const hidePointsDialog = () => {
    setPointsDialogVisible(false);
  };
  const showPointsDialog = () => {
    setPointsDialogVisible(true);
  };

  const hideCategoryDialog = () => {
    setCategoryDialogVisible(false);
  };

  const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
  ];
  const points = [
    { id: 1, name: t('strings:points_low_to_high') },
    { id: 2, name: t('strings:points_high_to_low') },
  ];
  const products = [
    {
      id: 1,
      image: 'https://ibb.co/5cW6Qp9',
      title: 'Product 1',
      price: 29.99,
    },
    {
      id: 2,
      image: 'https://ibb.co/5cW6Qp9',
      title: 'Product 2',
      price: 39.99,
    },
  ];

  const renderItem = ({ item }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item.id)} />
  );

  const handleViewCart = () => {
    navigation.navigate("View Cart");
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.mainWrapper}>
        <Text style={styles.header}>{t('strings:redeem_products')}</Text>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.touchableButton} onPress={showCategoryDialog}>
            <Text style={styles.buttonText}>{t('dashboard:redeem:redeemProduct:selectCategory')}</Text>
            <Image
              source={require('../../../../../assets/images/down_key.png')}
              style={{ width: '10%', height: '50%' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchableButton} onPress={showPointsDialog}>
            <Text style={styles.buttonText}>{t('dashboard:redeem:redeemProduct:sortPoints')}</Text>
            <Image
              source={require('../../../../../assets/images/down_key.png')}
              style={{ width: '10%', height: '50%' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.container} onPress={handleViewCart}>
            <Image
              source={require('../../../../../assets/images/shopping_cart.png')}
              style={styles.image}
            />
            <Badge size={15} style={styles.badge}>
              5
            </Badge>
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.productCatalogue}
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />

        <Portal>
          <Dialog visible={categoryDialogVisible} onDismiss={hideCategoryDialog}>
            <Dialog.Title>{t('dashboard:redeem:redeemProduct:selectCategory')}</Dialog.Title>
            <Dialog.Content>
              <List.Section>
                {categories.map((category) => (
                  <List.Item
                    key={category.id}
                    title={category.name}
                    onPress={() => {
                      console.log(category.id);
                      hideCategoryDialog();
                    }}
                  />
                ))}
              </List.Section>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideCategoryDialog}>{t('dashboard:redeem:redeemProduct:close')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={pointsDialogVisible} onDismiss={hidePointsDialog}>
            <Dialog.Title>{t('dashboard:redeem:redeemProduct:sortPoints')}</Dialog.Title>
            <Dialog.Content>
              <List.Section>
                {points.map((points) => (
                  <List.Item
                    key={points.id}
                    title={points.name}
                    onPress={() => {
                      console.log(points.id);
                      hidePointsDialog();
                    }}
                  />
                ))}
              </List.Section>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hidePointsDialog}>{t('dashboard:redeem:redeemProduct:close')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.5),
    marginBottom: 20
  },
  mainWrapper: {
    backgroundColor: colors.white,
    padding: 25,
  },
  container: {
    position: 'relative',
    width: responsiveHeight(3),
    height: responsiveHeight(3),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    backgroundColor: colors.yellow,
    color: colors.black,
    fontWeight: 'bold',
  },
  touchableButton: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 50,
    height: responsiveHeight(5),
    width: responsiveWidth(35),
    borderColor: colors.grey,
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.black,
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productCatalogue: {
    marginTop: 20
  }
});

export default RedeemProducts;
