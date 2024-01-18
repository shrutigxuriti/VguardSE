import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import DeliveryStatus from '../../../../../components/DeliveryStatus';
import { useTranslation } from 'react-i18next';
import colors from '../../../../../../colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';

const TrackRedemption = () => {
  const deliveryStatuses = ["Order Placed", "Processing", "Shipped", "Delivered"];
  const activeStatusIndex = 2;
  const date = "Wed, 19 October";
  const order_id = "XXXX"
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{t('dashboard:redeem:track:header')}</Text>
        <Text style={styles.subHeader}>{date}</Text>
        <Text style={styles.subHeader}>Order Id: {order_id}</Text>
      </View>
      <View style={styles.tracker}>
      <DeliveryStatus statuses={deliveryStatuses} activeStatusIndex={activeStatusIndex} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  header: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(3),
  },
  headerContainer: {
    marginBottom: responsiveHeight(3)
  },
  subHeader: {
    color: colors.grey,
    fontWeight: 'bold'
  },
  tracker: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


export default TrackRedemption