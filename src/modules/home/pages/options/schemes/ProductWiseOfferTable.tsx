import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import colors from '../../../../../../colors';
import { getProductWiseOffersDetail } from '../../../../../utils/apiservice';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import Loader from '../../../../../components/Loader';

interface ProductWiseOfferTableProps {
  route: any; // Replace 'any' with the correct type if possible
  navigation: any; // Replace 'any' with the correct type if possible
}

const ProductWiseOfferTable: React.FC<ProductWiseOfferTableProps> = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [data, setData] = useState<any[]>([]);
  const { t } = useTranslation();
  const [loader, showLoader] = useState(false);

  useEffect(() => {
    showLoader(true);
    getProductWiseOffersDetail(categoryId)
      .then(response => response.data)
      .then(responseData => {
        console.log(categoryId, "<><><<>")
        console.log("RESPONSE DATA", responseData);
        setData(responseData);
        showLoader(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [categoryId]);

  const dataofTable = data.map(product => [
    product.slNo,
    product.points.toString(),
    product.materialDesc
  ]);

  const tableHead = ["Material Code", "Points", "Material Description"];
  const columnWidths = [80, 80, '100%'];
  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} widthArr={columnWidths}/>
        <Rows data={dataofTable} textStyle={styles.text} widthArr={columnWidths}/>
      </Table>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    // paddingTop: responsiveHeight(2),
    backgroundColor: colors.white
  },
  head: {
    height: responsiveHeight(7),
    backgroundColor: colors.lightGrey
  },
  text: {
    margin: 10,
    color: colors.black
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
    marginBottom: 10,
    color: colors.black,
    fontWeight: 'bold'
  }
});

export default ProductWiseOfferTable;
