import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import colors from '../../../../../../colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import NeedHelp from '../../../../../components/NeedHelp';
import CustomTouchableOption from '../../../../../components/CustomTouchableOption';
import { getFile, getMonthWiseEarning } from '../../../../../utils/apiservice';
import { getImageUrl } from '../../../../../utils/FileUtils';

interface UserData {
  userName: string;
  userCode: string;
  userImage: string;
  userRole: string;
}
interface PointsData {
  totalPointsEarned: string;
  totalPointsRedeemed: string;
  schemePoints: string;
}

const Dashboard: React.FC = () => {
  const baseURL = 'https://www.vguardrishta.com/img/appImages/Profile/';

  const { t } = useTranslation();

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MM'));


  const [userData, setUserData] = useState<UserData>({
    userName: '',
    userCode: '',
    userImage: '',
    userRole: ''
  });
  const [pointsData, setPointsData] = useState<PointsData>({
    schemePoints: '',
    totalPointsRedeemed: '',
    totalPointsEarned: ''
  });

  const onValueChange = (event: any, newDate?: Date) => {
    const selectedDate = newDate || date;
    const selectedMonthDate = moment(selectedDate).format('MM');
    const selectedYearDate = moment(selectedDate).format('YYYY');

    console.log('Selected Month:', selectedMonthDate);
    console.log('Selected Year:', selectedYearDate);

    getMonthWiseEarning(selectedMonthDate, selectedYearDate)
      .then((data) => data.json())
      .then((data) => {
        setPointsData(data);
      });

    setShow(false);
  };

  useEffect(() => {
    AsyncStorage.getItem('USER').then((r) => {
      const user = JSON.parse(r);
      const data: UserData = {
        userName: user.name,
        userCode: user.userCode,
        userImage: user.kycDetails.selfie,
        userRole: user.professionId,
      };
      setUserData(data);
    });
  }, []);
  useEffect(() => {
    console.log(selectedMonth, ":", selectedYear)
    getMonthWiseEarning(selectedMonth, selectedYear)
      .then((data) => data.json())
      .then((data) => {
        setPointsData(data);
      })
  }, []);

  useEffect(() => {
    if (userData.userRole && userData.userImage) {
      const getImage = async () => {
        try {
          const profileImageUrl = await getImageUrl(userData.userImage, 'Profile');
          setProfileImage(profileImageUrl);
          console.log(profileImageUrl, "<><><<><")
        } catch (error) {
          console.log('Error while fetching profile image:', error);
        }
      };
      getImage();
    }
  }, [userData.userRole, userData.userImage]);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.profileDetails}>
        <View style={styles.ImageProfile}>
          <ImageBackground
            source={require('../../../../../assets/images/ic_v_guards_user.png')}
            style={{ width: '100%', height: '100%', borderRadius: 100 }}
            resizeMode='contain'
          >
            <Image
              source={{ uri: profileImage }}
              style={{ width: '100%', height: '100%', borderRadius: 100 }}
              resizeMode='contain'
            />
          </ImageBackground>
        </View>
        <View>
          <Text style={styles.textDetail}>{userData.userName}</Text>
          <Text style={styles.textDetail}>{userData.userCode}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <SafeAreaView style={styles.datepicker}>
          <Text style={styles.text}>{moment(date).format('MMMM YYYY')}</Text>
          <Image
            style={{ width: '6%', height: '100%' }}
            resizeMode="contain"
            source={require('../../../../../assets/images/unfold_arrow.png')}
          />
        </SafeAreaView>
      </TouchableOpacity>
      {show && (
        <MonthPicker
          onChange={(event, newDate) => {
            onValueChange(event, newDate);
            setDate(newDate || date);
          }}
          value={date}
          locale="en"
        />

      )}

      <View style={styles.points}>
        <View style={styles.leftPoint}>
          <Text style={styles.greyText}>{t('strings:points_earned')}</Text>

          <Text style={styles.point}>{pointsData?.totalPointsEarned ? pointsData?.totalPointsEarned : 0}</Text>
        </View>
        <View style={styles.middlePoint}>
          <Text style={styles.greyText}>{t('strings:usp_scheme_points')}</Text>
          <Text style={styles.point}>
            {pointsData?.schemePoints ? pointsData?.schemePoints : 0}
          </Text>
        </View>
        <View style={styles.rightPoint}>
          <Text style={styles.greyText}>{t('strings:points_redeemed')}</Text>
          <Text style={styles.point}>{pointsData?.totalPointsRedeemed ? pointsData?.totalPointsRedeemed : 0}</Text>

        </View>
      </View>

      <Text style={{ color: colors.grey, fontSize: responsiveFontSize(1.5), textAlign: 'center', marginTop: 5 }}>*DUPS Scheme Points are non-redeemable</Text>

      <View style={styles.options}>
        <CustomTouchableOption
          text="strings:product_wise_earning"
          iconSource={require('../../../../../assets/images/ic_bank_transfer.webp')}
          screenName="Product Wise Earning"
        />
        <CustomTouchableOption
          text="strings:scheme_wise_earning"
          iconSource={require('../../../../../assets/images/ic_paytm_transfer.webp')}
          screenName="Scheme Wise Earning"
          disabled={true}
        />
        <CustomTouchableOption
          text="strings:your_rewards"
          iconSource={require('../../../../../assets/images/ic_egift_cards.webp')}
          screenName="Your Rewards"
          disabled={true}
        />
      </View>

      <NeedHelp />
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 15,
  },
  datepicker: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: responsiveHeight(2),
    backgroundColor: colors.white,
  },
  text: {
    color: colors.black,
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    fontSize: responsiveFontSize(1.7),
  },
  ImageProfile: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  textDetail: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  points: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 30,
  },
  leftPoint: {
    width: responsiveWidth(30),
    height: responsiveHeight(15),
    backgroundColor: colors.lightYellow,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middlePoint: {
    width: responsiveWidth(30),
    height: responsiveHeight(15),
    backgroundColor: colors.lightYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPoint: {
    width: responsiveWidth(30),
    height: responsiveHeight(15),
    backgroundColor: colors.lightYellow,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greyText: {
    width: '80%',
    color: colors.grey,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 10,
  },
  point: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: responsiveFontSize(1.7),
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: responsiveHeight(5),
  },
});

export default Dashboard;
