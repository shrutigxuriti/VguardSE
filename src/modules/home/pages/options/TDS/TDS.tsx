import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {useTranslation} from 'react-i18next';
import colors from '../../../../../../colors';
import {getAy, getTdsList} from '../../../../../utils/apiservice';
import Loader from '../../../../../components/Loader';
import {Table, Row, Rows} from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TDSProps {}

interface CertificateList {
  id: string;
  name: string;
  path: string;
  tdsPerc: string;
}

const CustomYearDropdown: React.FC<{
  data: any[];
  value: string;
  onChange: (item: any) => void;
}> = ({data, value, onChange}) => {
  return (
    <FlatList
      style={styles.dropdown}
      data={data}
      keyExtractor={item => item.value}
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => onChange(item)}>
          <Text style={styles.dropdownItem}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const TDS: React.FC<TDSProps> = () => {
  const {t} = useTranslation();
  const [assessmentYearData, setAssessmentYearData] = useState<string[]>([]); // Set appropriate type for assessmentYearData
  const [loader, showLoader] = useState<boolean>(false);
  const [isFocusAssessmentYear, setIsFocusAssessmentYear] =
    useState<boolean>(false);
  const [assessmentYearValue,  setAssessmentYearValue] = useState<string>('');
  const [certificateList, setCertificateList] = useState<CertificateList[]>([]);

  const BASEURL = 'https://www.vguardrishta.com';

  const handleDropdownFiscalYear = (item: string) => {
    setIsFocusAssessmentYear(false);
    setAssessmentYearValue(item);
  };

  const handleCardPress = (item: string) => {
    console.log('URL', `${BASEURL}${item}`);
    Linking.openURL(`${BASEURL}/${item}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      showLoader(true);

      try {
        const [assessmentYearResponse] = await Promise.all([getAy()]);

        const assessmentYearResult = await assessmentYearResponse.json();

        setAssessmentYearData(assessmentYearResult);
        setAssessmentYearValue(assessmentYearResult[0]);
        showLoader(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        showLoader(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(assessmentYearValue)
    getTdsList(assessmentYearValue)
      .then(response => response.data)
      .then(responseData => {
        if (Array.isArray(responseData)) {
          setCertificateList(responseData);
        } else {
          console.error('Invalid API response format:', responseData);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [assessmentYearValue]);

  const data = certificateList
    ? certificateList.map(data => [
        data?.id.toString(),
        data?.name.toString(),
        data?.path.toString(),
      ])
    : [];

  return (
    <View style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}

      <Text style={styles.greyText}>Select Assessment Year</Text>
      <TouchableOpacity onPress={() => setIsFocusAssessmentYear(prev => !prev)}>
        <View
          style={[
            styles.card,
            isFocusAssessmentYear && styles.dropdownContainer,
          ]}>
          <Text style={styles.yearText}>{assessmentYearValue}</Text>
          <Image
            style={styles.downImage}
            source={require('../../../../../assets/images/ic_ticket_drop_down2.png')}
          />
        </View>
      </TouchableOpacity>

      {isFocusAssessmentYear && (
        <CustomYearDropdown
          data={assessmentYearData}
          value={assessmentYearValue}
          onChange={handleDropdownFiscalYear}
        />
      )}
      <View style={[{zIndex: -1}]}>
        {data.length === 0 ? (
          <Text style={styles.noDataText}>No Data</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.tdscard}
                onPress={() => handleCardPress(item[2])}>
                <Image
                  style={[{width: 50, height: 50}]}
                  resizeMode="contain"
                  source={require('../../../../../assets/images/ic_tds_statement.png')}
                />
                <Text style={styles.text}>{item[1]}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 15,
  },
  greyText: {
    color: colors.grey,
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dropdownContainer: {
    zIndex: 1,
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
    elevation: 5,
  },
  tdscard: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 2,
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
  text: {
    marginHorizontal: 30,
    color: colors.grey,
    fontWeight: 'bold',
  },
  noDataText: {
    color: colors.grey,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TDS;
