
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ImageBackground } from 'react-native';
import NeedHelp from '../../../components/NeedHelp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../../colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import { getFile } from '../../../utils/apiservice';
import { getImageUrl } from '../../../utils/FileUtils';
import CustomTouchableOption from '../../../components/CustomTouchableOption';
interface User {
  userCode: string;
  name: string;
  selfieImage: string;
  userRole: string;
  pointsBalance: string;
  redeemedPoints: string;
  numberOfScan: string;
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState("");
  const [disableOptions, setDisableOptions] = useState(false);

  const loadUserDetails = async () => {
    try {
      const userString = await AsyncStorage.getItem('USER');
      const diffAcc = await AsyncStorage.getItem('diffAcc');
      if (userString) {
        const user = JSON.parse(userString);
        const shapedUser = {
          name: user?.name || '',
          userCode: user?.userCode || '',
          selfieImage: user?.kycDetails?.selfie || '',
          userRole: user?.roleId || 0,
          pointsBalance: user?.pointsSummary?.pointsBalance || 0,
          redeemedPoints: user?.pointsSummary.redeemedPoints || 0,
          numberOfScan: user?.pointsSummary.numberOfScan || 0
        };
        if(diffAcc == "1"){
          setDisableOptions(true);
        }
        setUserData(shapedUser);
      }
    } catch (error) {
      console.error('Error retrieving user details:', error);
    }
  };



  useEffect(() => {
    loadUserDetails();
  }, []);
  useEffect(() => {
    console.log(userData, "userData=================")
    if (userData?.userRole && userData.selfieImage) {
      const getImage = async () => {
        try {
          // const profileImageUrl = await getFile(userData.selfieImage, 'PROFILE', "2");
          const profileImageUrl = await getImageUrl(userData.selfieImage, 'Profile');
          console.log(profileImageUrl);
          setProfileImage(profileImageUrl);
          // console.log(profileImage)
        } catch (error) {
          console.log('Error while fetching profile image:', error);
        }
      };
      getImage();
    }
  }, [userData?.userRole, userData?.selfieImage]);
  return (
    <ScrollView style={styles.mainWrapper}>
      <View style={{ padding: 15 }}>
        <View style={styles.detailContainer}>
          <View style={styles.ImageProfile}>
            <ImageBackground
              source={require('../../../assets/images/ic_v_guards_user.png')}
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
            <Text style={styles.name}>{userData?.name}</Text>
            <Text style={styles.code}>{userData?.userCode}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.viewProfile}>{t('strings:view_profile')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.points}>
          <TouchableOpacity style={styles.leftPoint} onPress={() => navigation.navigate("Dashboard")} >
            <Text style={styles.greyText}>{t('strings:points_balance')}</Text>

            <Text style={styles.point}>{userData?.pointsBalance ? userData?.pointsBalance : 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.middlePoint} onPress={() => navigation.navigate("Redemption History")} >
            <Text style={styles.greyText}>{t('strings:points_redeemed')}</Text>
            <Text style={styles.point}>
              {userData?.redeemedPoints ? userData?.redeemedPoints : 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightPoint} onPress={() => navigation.navigate("Unique Code History")} >
            <Text style={styles.greyText}>{t('strings:number_of_scans')}</Text>
            <Text style={styles.point}>{userData?.numberOfScan}</Text>

          </TouchableOpacity>
        </View>
        <View style={styles.dashboard}>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:scan_code"
              iconSource={require('../../../assets/images/ic_scan_code.png')}
              screenName="Scan QR"
            />
            <CustomTouchableOption
              text="strings:redeem_points"
              iconSource={require('../../../assets/images/ic_redeem_points.webp')}
              screenName="Redeem Products"
              diffAcc = {disableOptions}
            />
            <CustomTouchableOption
              text="strings:dashboard"
              iconSource={require('../../../assets/images/ic_dashboard.webp')}
              screenName="Dashboard"
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:update_pan"
              iconSource={require('../../../assets/images/ic_update_kyc.webp')}
              screenName="Update PAN"
              diffAcc = {disableOptions}
            />
            <CustomTouchableOption
              text="strings:scheem_offers"
              iconSource={require('../../../assets/images/ic_scheme_offers.png')}
              screenName="schemes"
            />
            <CustomTouchableOption
              text="strings:info_desk"
              iconSource={require('../../../assets/images/ic_vguard_info.webp')}
              screenName="info"
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:air_cooler"
              iconSource={require('../../../assets/images/icon_air_cooler.webp')}
              screenName="Air Cooler"
            />
            <CustomTouchableOption
              text="strings:what_s_new"
              iconSource={require('../../../assets/images/ic_whats_new.webp')}
              screenName="new"
            />
            <CustomTouchableOption
              text="strings:raise_ticket"
              iconSource={require('../../../assets/images/ic_raise_ticket.webp')}
              screenName="ticket"
            />
          </View>
          <View style={styles.row}>
            <CustomTouchableOption
              text="strings:update_bank"
              iconSource={require('../../../assets/images/ic_raise_ticket.webp')}
              screenName="Update Bank"
              diffAcc = {disableOptions}
            />
            <CustomTouchableOption
              text="strings:tds_certificate"
              iconSource={require('../../../assets/images/tds_ic.png')}
              screenName="TDS Certificate"
            />
            <CustomTouchableOption
              text="strings:engagement"
              iconSource={require('../../../assets/images/elink.png')}
              screenName="Engagement"
            />
          </View>
          <View style={styles.lastrow}>
            <CustomTouchableOption
              text="strings:tds_statement"
              iconSource={require('../../../assets/images/tds_ic.png')}
              screenName="TDS Statement"
            />
          </View>
        </View>
        <NeedHelp />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.white
  },
  name: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7)
  },
  code: {
    color: colors.black,
    fontSize: responsiveFontSize(1.7)
  },
  viewProfile: {
    color: colors.yellow,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20
  },
  ImageProfile: {
    height: 50,
    width: 50,
    borderRadius: 100,
    // backgroundColor: 'red'
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
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    marginTop: 30,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-around',
  },
  lastrow: {
    marginLeft: 5,
  },
  oval: {
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(18),
    width: responsiveWidth(25),
    maxWidth: responsiveWidth(25),
    flexGrow: 1,
    backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    borderRadius: 100,
  },
  optionIcon: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    marginBottom: 20,
  },
  nav: {
    color: colors.black,
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default HomeScreen;
