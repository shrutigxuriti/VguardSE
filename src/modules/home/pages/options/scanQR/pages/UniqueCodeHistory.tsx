import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../../../../../../colors';
import { getScanCodeHistory } from '../../../../../../utils/apiservice';
interface RedemptionHistoryItem {
  scanDate: string;
  copuonCode: string;
  scanStatus: string;
}

const UniqueCodeHistory: React.FC = () => {
  const { t } = useTranslation();
  const [redemptionHistoryData, setRedemptionHistoryData] = useState<RedemptionHistoryItem[]>([]);

  useEffect(() => {
    fetchRedemptionHistory();
  }, []);

  const fetchRedemptionHistory = async () => {
    try {
      const response = await getScanCodeHistory();
      const responseData: RedemptionHistoryItem[] = await response.data;

      setRedemptionHistoryData(responseData);
    } catch (error) {
      console.error('Error fetching redemption history data:', error);
    }
  };

  const renderItem = ({ item }: { item: RedemptionHistoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.scanDate}</Text>
      <Text style={styles.text}>{item.copuonCode}</Text>
      <Text style={styles.status}>{item.scanStatus}</Text>
    </View>
  );

  return (
    <View style={styles.mainWrapper}>
      <FlatList
        data={redemptionHistoryData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex'
  },
  text: {
    flexGrow: 1,
    width: '30%',
    color: colors.black,
    fontWeight: 'bold'
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGrey,
  },
  status: {
    width: '24%',
    textAlign: 'center',
    backgroundColor: colors.yellow,
    color: colors.black,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold'
  }
});

export default UniqueCodeHistory;
