import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../../../colors';
import Buttons from '../../../components/Buttons';
import arrowIcon from '../../../assets/images/arrow.png';
import {
  generateOtpForReverify,
  generateOtpForLogin,
  validateReverifyOtp,
} from '../../../utils/apiservice';
import Popup from '../../../components/Popup';
import { width, height } from '../../../utils/dimensions';
import { Colors } from '../../../utils/constants';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader';

interface ReUpdateKycOTPProps {
  navigation: any;
}

const ReUpdateKycOTP: React.FC<ReUpdateKycOTPProps> = ({ navigation }) => {
  const [number, setNumber] = useState('');
  const [preferedLanguage, setpreferedLanguage] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState('retailer');
  const [countdown, setCounter] = useState<number | null>(null);
  const [otpsentflag, setotpsentflag] = useState(false);
  const [otp, setOtp] = useState('');
  const [loader, showLoader] = useState(false);

  let intervalId: NodeJS.Timeout;

  useEffect(() => {
    if (countdown && countdown > 0) {
      intervalId = setInterval(() => {
        setCounter(prevCounter => (prevCounter ? prevCounter - 1 : null));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [countdown]);

  useEffect(() => {
    console.log("><><><<<><><<><><")
    const clearAsyncStorage = async () => {
      try {
        console.log("REMOVING");
        await AsyncStorage.removeItem('USER');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('diffAcc');
        console.log("REMOVED");
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };
  
    clearAsyncStorage();
  }, []);

  const handleValidation = async () => {
    try {
      showLoader(true);
      let data = { loginOtpUserName: number, otpType: "SMS" };
      console.log(data);
      let validationResponse = await generateOtpForReverify(data);
      console.log(validationResponse);
      showLoader(false);
      // Assuming validationResponse is an object with a 'data' property containing the message
      if (validationResponse.status === 200) {
        setCounter(60);
        const successMessage = validationResponse.data.message;
        setIsPopupVisible(true);
        setPopupMessage(successMessage);
        if (
          validationResponse.data.message ==
          'Please enter OTP to proceed with the process'
        ) {
          setotpsentflag(true);
        }
      } else {
        const errorMessage = validationResponse.data.message;
        setIsPopupVisible(true);
        setPopupMessage(errorMessage);
      }

      setTimeout(() => {
        if (countdown && countdown > 0) {
          clearInterval(intervalId);
          //Alert.alert('OTP not received within 60 seconds.');
        }
      }, 60000);
    } catch (error) {
      setIsPopupVisible(true);
      setPopupMessage("Something went wrong!");
      console.error('Error during validation:', error);
    }
  };

  const loginUserWithOtp = async () => {
    showLoader(true);
    try {
      let userCredentials = {
        loginOtpUserName: number,
        otp: otp,
      };

      let response = await validateReverifyOtp(userCredentials);
      console.log("RESPONSE", response)
      showLoader(false);
      let message = response.data.message;
      if (response.status === 200 && response.data.message == "OTP verified successfully, please proceed with the registration.") {
        console.log("<><><", number, otp)
        AsyncStorage.setItem('username', number.toString()).then(() => {
          AsyncStorage.setItem('password', otp.toString()).then(() => {
            AsyncStorage.setItem('authtype', 'otp').then(() => {
              navigation.navigate('ReUpdateKyc', { usernumber: number });
            });
          });
        });

      } else {
        setIsPopupVisible(true);
        setPopupMessage(message);
        showLoader(false);

      }
      console.log(response);
    } catch (error) {
      console.log(error);
      showLoader(false);

    }
  };

  const calltogetopt = async () => {
    showLoader(true);

    try {
      let userCredentials = {
        loginOtpUserName: number,
        otpType: 'voice',
      };

      let response = await generateOtpForLogin(userCredentials);
      let message = response.message;
      
      if (response.code === 200) {
        setCounter(60);
        setotpsentflag(true);
        setIsPopupVisible(true);
        setPopupMessage(message);
      } else {
        setIsPopupVisible(true);
        setPopupMessage(message);
      }
      console.log(response);
      showLoader(false);
    } catch (error) {
      console.log(error);
      showLoader(false);

    }
  };

  const placeholderColor = colors.grey;

  const { t } = useTranslation();


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Loader isLoading={loader} />
      {isPopupVisible && (
        <Popup
          isVisible={isPopupVisible}
          onClose={() => setIsPopupVisible(false)}>
          <Text>{popupMessage}</Text>
        </Popup>
      )}
      <View style={styles.registerUser}>
        <View style={styles.mainWrapper}>
          <Image
            source={require('../../../assets/images/group_907.png')}
            style={styles.imageSaathi}
          />
          <Text style={styles.mainHeader}>{t('strings:lbl_welcome')}</Text>
          <View style={styles.formContainer}>
            <View style={styles.containter}>
              <Text style={styles.textHeader}>
                {t('strings:enter_registered_mobile_no_to_continue')}
              </Text>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.icon}
                  resizeMode="contain"
                  source={require('../../../assets/images/mobile_icon.png')}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('strings:enter_your_mobile_number')}
                  placeholderTextColor={placeholderColor}
                  value={number}
                  keyboardType="number-pad"
                  onChangeText={text => setNumber(text)}
                  maxLength={10}
                  editable={!otpsentflag}
                />
              </View>
            </View>
            {otpsentflag && (
              <View style={[styles.containter2, styles.inputContainer]}>
                <Image
                  style={styles.icon}
                  resizeMode="contain"
                  source={require('../../../assets/images/lock_icon.png')}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('strings:enter_otp')}
                  placeholderTextColor={placeholderColor}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={text => setOtp(text)}
                  maxLength={4}
                />
              </View>
            )}
            {!otpsentflag && (
              <View style={styles.buttonContainer}>
                <Buttons
                  label={t('strings:send_otp')}
                  variant="filled"
                  onPress={() => handleValidation()}
                  width="100%"
                  iconHeight={10}
                  iconWidth={30}
                  iconGap={30}
                  icon={arrowIcon}
                />
              </View>
            )}
            {otpsentflag && (
              <View style={styles.buttonContainer2}>
                <Buttons
                  label={t('strings:submit')}
                  variant="filled"
                  onPress={() => loginUserWithOtp()}
                  width="100%"
                  iconHeight={10}
                  iconWidth={30}
                  iconGap={30}
                  icon={arrowIcon}
                />
              </View>
            )}
            <Text style={styles.or}>{t('strings:or')}</Text>
            <TouchableOpacity onPress={() => calltogetopt()}>
              <View style={styles.otpPhone}>
                <Image
                  source={require('../../../assets/images/group_501.png')}
                  style={styles.phone}
                />
                <Text style={styles.greyText}>
                  Click Here to get OTP through phone call
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: 'transparent',
                height: height / 25,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: width / 1.3,
                marginTop: 20,
                marginLeft: 15,
              }}>
              <View>
                <Text style={{ color: 'black' }}>OTP Not Received ?</Text>
              </View>
              <TouchableOpacity
                onPress={() => countdown === 0 && handleValidation()}>
                <View style={{ right: 28 }}>
                  <Text
                    style={{
                      color: Colors.yellow,
                      fontSize: responsiveFontSize(1.5),
                    }}>
                    RESEND OTP
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text
                style={{
                  color: 'grey',
                  fontSize: responsiveFontSize(2),
                  alignSelf: 'center',
                }}>
                or
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'transparent',
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '80%',
                paddingTop: 10,
                alignSelf: 'center',
              }}>
              <TouchableOpacity>
                <View>
                  <Text
                    style={{
                      color: Colors.yellow,
                      fontSize: responsiveFontSize(1.8),
                      left: 10,
                    }}>
                    GET OTP VIA CALL
                  </Text>
                </View>
              </TouchableOpacity>
              {countdown !== null && countdown > 0 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.8),
                      paddingLeft: 5,
                      paddingRight: 5,
                      color: 'black',
                    }}>
                    in
                  </Text>
                  <Text
                    style={{
                      color: Colors.yellow,
                      fontSize: responsiveFontSize(1.8),
                      right: 15,
                    }}>
                    {countdown} s
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        <View>
          <View style={styles.footerContainer}>
            <Text style={styles.footergreyText}>
              {t('strings:powered_by_v_guard')}
            </Text>
            <Image
              source={require('../../../assets/images/group_910.png')}
              style={styles.imageVguard}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  registerUser: {
    height: '100%',
    backgroundColor: colors.white,
    display: 'flex',
  },
  mainWrapper: {
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
  },
  textHeader: {
    color: colors.grey,
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainHeader: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageSaathi: {
    width: 100,
    height: 98,
    marginBottom: 30,
  },
  imageVguard: {
    width: 100,
    height: 36,
  },
  formContainer: {
    width: '100%',
    // justifyContent: 'center',
    padding: 16,
    flex: 2,
  },
  input: {
    color: colors.black,
    height: 40,
    padding: 10,
  },
  inputContainer: {
    backgroundColor: colors.white,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginHorizontal: 10,
    width: 15,
    height: 15,
  },
  or: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
    marginTop: 20,
  },
  tick: {
    height: 15,
    width: 15,
  },
  footergreyText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.grey,
    paddingBottom: 5,
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    backgroundColor: colors.lightGrey,
    width: '100%',
    paddingVertical: 10,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  radioButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    alignItems: 'center',
  },
  containter: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginBottom: 20,
  },
  containter2: {
    Bottom: 10,
    gap: 5,
    marginBottom: 20,
  },
  phone: {
    height: 50,
    width: 50,
  },
  greyText: {
    fontSize: 14,
    color: colors.grey,
  },
  otpPhone: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonContainer2: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default ReUpdateKycOTP;
