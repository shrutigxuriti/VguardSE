import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import colors from '../../../../../../colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { getSchemeWiseEarning } from '../../../../../utils/apiservice';

interface SchemeDetails {
  slNo: number;
  createdDate: string;
  partDesc: string;
}

const SchemeWiseEarning: React.FC = () => {
  const [schemeDetails, setSchemeDetails] = useState<SchemeDetails[]>([]);

  useEffect(() => {
    getSchemeWiseEarning()
      .then(response => response.data)
      .then(responseData => {
        setSchemeDetails(responseData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const data = schemeDetails.map(product => [
    product.slNo.toString(),
    product.createdDate,
    product.partDesc,
  ]);

  const tableHead = ["Sl No.", "Created Date", "Material Description"];

  return (
    <ScrollView style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        {data.length === 0 ? (
          <Rows data={[['No Data']]} textStyle={[styles.text, { color: colors.grey, fontWeight: 'bold', textAlign: 'center' }]} />
        ) : (
          <>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            <Rows data={data} textStyle={styles.text} />
          </>
        )}
      </Table>
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

export default SchemeWiseEarning;
