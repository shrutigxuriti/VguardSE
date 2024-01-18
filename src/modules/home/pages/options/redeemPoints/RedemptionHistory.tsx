import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../../../colors';
import { getRedemptionHistory } from '../../../../../utils/apiservice';

const RedemptionHistory = () => {
  const { t } = useTranslation();
  const [redemptionHistoryData, setRedemptionHistoryData] = useState([]);
  useEffect(() => {
    getRedemptionHistory('')
      .then(response => response.json())
      .then(responseData => {
        setRedemptionHistoryData(responseData);
        console.log("<><<><<><>><", responseData, "<><<<><><><><><><<><");
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  const renderItem = ({ item }) => (
    <View style={[styles.item]}>
            <Text style={[styles.text, item.orderStatus === 'In Process' ? styles.activeText : styles.inactiveText]}>{item.transactDate}</Text>
            <View style={styles.detail}>
                <Text style={[styles.text, item.orderStatus === 'In Process' ? styles.activeText : styles.inactiveText]}>{item.productName}</Text>
                <Text style={[styles.smalltext]}>{t('strings:points')}: {item.points}</Text>
                <Text style={[styles.smalltext]}>{t('strings:mobile_no')}: {item.mobileNumber}</Text>
            </View>
            <Text style={[styles.status, item.orderStatus === 'In Process' ? styles.activeItem : styles.inactiveItem]}>{item.orderStatus}</Text>
        </View>
  );

  return (
    
    <ScrollView style={styles.mainWrapper}>
      {redemptionHistoryData.length === 0 ? (
        <View style={styles.middleText}>
        <Text style={styles.greyText}>No Data</Text>
        </View>
      ) : (
      <FlatList
        data={redemptionHistoryData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
  greyText: {
    color: colors.grey,
    fontWeight: 'bold',
  },
  header: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: colors.black,
  },
  headerWrapper: {
    padding: 15,
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  middleText: {
    marginTop: responsiveHeight(40),
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex'
  },
  text: {
    flexGrow: 1,
    width: '20%',
    fontSize: responsiveFontSize(1.5),
  },
  smalltext: {
    fontSize: responsiveFontSize(1.5),
    flexGrow: 1,
    color: colors.black
},
detail: {
    flexGrow: 1,
    width: '40%',
    flexDirection: 'column',
},
  activeItem: {
    backgroundColor: colors.yellow,
    color: colors.black,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold'
  },
  inactiveItem: {
    backgroundColor: colors.lightGrey,
    color: colors.grey,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold'
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGrey,
  },
  activeText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  inactiveText: {
    color: colors.grey,
    fontWeight: 'bold'
  },
  status: {
    width: '24%',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
  }

});

export default RedemptionHistory;
