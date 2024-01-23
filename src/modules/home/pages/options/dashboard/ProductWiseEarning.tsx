import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import colors from '../../../../../../colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { getProdWiseEarning } from '../../../../../utils/apiservice';

interface ProductDetails {
  slNo: number;
  category: string;
  partDesc: string;
  points: number;
  couponCode: string;
  createdDate: string;
}

const ProductWiseEarning: React.FC = () => {
  const [productDetails, setProductDetails] = useState<ProductDetails | {}>();

  useEffect(() => {
    getProdWiseEarning()
      .then(response => response.data)
      .then(responseData => {
        setProductDetails(responseData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const tableHead = ["Sl No.", "Product Category", "Material Description", "Points", "Coupon Code", "Created Date"];

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal={true}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9'}}>
          {productDetails ? (
            <Rows data={[['No Data']]} textStyle={[styles.text, { color: colors.grey, fontWeight: 'bold', textAlign: 'center' }]} />
          ) : (
            <>
              <Row data={tableHead} style={styles.head} widthArr={[50, 100, 320, 80, 150, 120]}  textStyle={styles.text} />
              <Rows data={productDetails} textStyle={styles.text} style={styles.row} widthArr={[50, 100, 320, 80, 150, 120]} />
            </>
          )}
        </Table>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  head: {
    height: responsiveHeight(7),
    backgroundColor: colors.lightGrey,
  },
  text: {
    margin: 10,
    color: colors.black,
  },
  row: {
    height: 40,
  },
});

export default ProductWiseEarning;
