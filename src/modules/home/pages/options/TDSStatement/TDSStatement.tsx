import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import colors from '../../../../../../colors';
import { getFiscalYear, getMonth } from '../../../../../utils/apiservice';
import Loader from '../../../../../components/Loader';
import { Table, Row, Rows } from 'react-native-table-component';
import { getTdsStatementList } from '../../../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TDSProps { }

interface StatementList {
  redDate: string;
  redAmnt: string;
  tdsAmnt: string;
  tdsPerc: string;
}

interface UserData {
  userId: string;
}
interface PostData {
  id: string;
  month: string;
  year: string;
  intuserid: string;
}
const CustomMonthDropdown: React.FC<{ data: any[]; value: string; onChange: (item: any) => void }> = ({ data, value, onChange }) => {
  return (
    <FlatList
      style={styles.dropdown}
      data={data}
      keyExtractor={(item) => item.value}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onChange(item)}>
          <Text style={styles.dropdownItem}>{item.month}</Text>
        </TouchableOpacity>
      )}
    />
  );
};
const CustomYearDropdown: React.FC<{ data: any[]; value: string; onChange: (item: any) => void }> = ({ data, value, onChange }) => {
  return (
    <FlatList
      style={styles.dropdown}
      data={data}
      keyExtractor={(item) => item.value}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onChange(item)}>
          <Text style={styles.dropdownItem}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const TDSStatement: React.FC<TDSProps> = () => {
  const { t } = useTranslation();
  const [fiscalYearData, setFiscalYearData] = useState<string[]>([]); // Set appropriate type for fiscalYearData
  const [monthData, setMonthData] = useState<any[]>([]); // Set appropriate type for monthData
  const [loader, showLoader] = useState<boolean>(false);
  const [isFocusFiscalYear, setIsFocusFiscalYear] = useState<boolean>(false);
  const [isFocusMonth, setIsFocusMonth] = useState<boolean>(false);
  const [fiscalYearValue, setFiscalYearValue] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [userData, setUserData] = useState<UserData>({
    userId: '',
  });
  const [postData, setPostData] = useState<PostData>({
    id: '',
    month: '',
    year: '',
    intuserid: '',
  });
  const [statementList, setStatementList] = useState<StatementList[]>([]);

  const handleDropdownFiscalYear = (item: string) => {
    setIsFocusFiscalYear(false);
    setFiscalYearValue(item);
    setPostData((prevData) => ({
      ...prevData,
      year: item,
    }));
  };

  const handleDropdownMonth = (item: any) => {
    setIsFocusMonth(false);
    setSelectedMonth(item.month);
    setPostData((prevData) => ({
      ...prevData,
      id: item.id,
      month: item.month,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      showLoader(true);

      try {
        const [fiscalYearResponse, monthResponse] = await Promise.all([
          getFiscalYear(),
          getMonth(),
        ]);

        const fiscalYearResult = await fiscalYearResponse.data;
        const monthResult = await monthResponse.data;
        setFiscalYearData(fiscalYearResult);
        setFiscalYearValue(fiscalYearResult[0]);
        setMonthData(monthResult);
        setSelectedMonth(monthResult[0]?.month);
        setPostData((prevData) => ({
          ...prevData,
          id: monthResult[0].id,
          month: monthResult[0].month,
          year: fiscalYearResult[0],
        }));
        showLoader(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        showLoader(false);
      }
    };

    fetchData();

    AsyncStorage.getItem('USER').then((r) => {
      const user = JSON.parse(r || '{}');
      const data: UserData = {
        userId: user.userId || '',
      };
      setUserData(data);
      setPostData((prevData) => ({
        ...prevData,
        intuserid: user.userId || '',
      }));
    });
  }, []);

  useEffect(() => {
    getTdsStatementList(postData)
      .then((response) => response.data)
      .then((responseData) => {
        console.log("POSTDATA", postData)
        console.log(responseData)
        setStatementList(responseData);
      })
      .catch((error) => {
        setStatementList([]);
        console.error('Error fetching data:', error);
      });
  }, [postData]);

  let data: any[] = [];
  if (statementList && statementList.length > 0) {
    console.log("Statement List", statementList)
    data = statementList?.map((data) => [
      data?.redDate.toString(),
      data?.redAmnt.toString(),
      data?.tdsAmnt.toString(),
      data?.tdsPerc.toString(),
    ]);
  }

  const tableHead = ['Red Date', 'Red Amt', 'TDS Amt', 'TDS %'];

  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader />}

      <Text style={styles.greyText}>{t('strings:select_fiscal_year')}</Text>
      <TouchableOpacity onPress={() => setIsFocusFiscalYear((prev) => !prev)}>
        <View style={[styles.card, isFocusFiscalYear && styles.dropdownContainer]}>
          <Text style={styles.yearText}>{fiscalYearValue}</Text>
          <Image
            style={styles.downImage}
            source={require('../../../../../assets/images/ic_ticket_drop_down2.png')}
          />
        </View>
      </TouchableOpacity>

      {isFocusFiscalYear && (
        <CustomYearDropdown
          data={fiscalYearData}
          value={fiscalYearValue}
          onChange={handleDropdownFiscalYear}
        />
      )}

      <Text style={styles.greyText}>{t('strings:select_month')}</Text>
      <TouchableOpacity onPress={() => setIsFocusMonth((prev) => !prev)}>
        <View style={[styles.card, isFocusMonth && styles.dropdownContainer]}>
          <Text style={styles.yearText}>{selectedMonth}</Text>
          <Image
            style={styles.downImage}
            source={require('../../../../../assets/images/ic_ticket_drop_down2.png')}
          />
        </View>
      </TouchableOpacity>
      <Table style={[{ zIndex: -999, minHeight: responsiveHeight(50) }]}>
        <>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          {data.length === 0 ? (
            <View style={[styles.noDataRow, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={styles.text}>No Data</Text>
            </View>
          ) : (
            <Rows data={data} textStyle={styles.text} />
          )}
        </>
      </Table>


      {isFocusMonth && (
        <CustomMonthDropdown data={monthData} value={selectedMonth} onChange={handleDropdownMonth} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    paddingHorizontal: 15,
    marginTop: 15,
    paddingBottom: 50,
  },
  noDataRow: {
    flex: 1,
    flexDirection: 'row',
  },
  greyText: {
    color: colors.grey,
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dropdownContainer: {
    zIndex: 999,
  },
  card: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 5
  },
  yearText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: colors.black,
  },
  downImage: {
    height: responsiveFontSize(2.5),
    width: responsiveFontSize(2.5),
  },
  dropdown: {
    position: 'absolute',
    top: responsiveFontSize(5),
    left: 10,
    right: 10,
    backgroundColor: colors.white,
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
    fontSize: responsiveFontSize(2),
    color: colors.black,
  },
  head: {
    height: responsiveHeight(7),
    backgroundColor: colors.lightGrey
  },
  text: {
    margin: 10,
    color: colors.black
  },
});

export default TDSStatement;
