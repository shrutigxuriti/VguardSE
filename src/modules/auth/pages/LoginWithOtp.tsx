import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../../../colors';
import Buttons from '../../../components/Buttons';
import arrowIcon from '../../../assets/images/arrow.png';
import { Newuserotpvalidation, generateOtpForLogin, loginOtpDigest, loginWithOtp, validateLoginOtp } from '../../../utils/apiservice';
import Popup from '../../../components/Popup';
import Loader from '../../../components/Loader';
import { useAuth } from '../../../components/AuthContext';

interface LoginWithOtpProps {
  navigation: any;
  route: {
    params: {
      usernumber: string;
      jobprofession: string;
      preferedLanguage: number;
    };
  };
}

const LoginWithOtp: React.FC<LoginWithOtpProps> = ({ navigation, route }) => {
  const { usernumber, jobprofession, preferedLanguage } = route.params;
  const [otp, setOtp] = useState('');
  const [number, setnumber] = useState(usernumber);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [loader, showLoader] = useState(false);
  const { login } = useAuth();

  const placeholderColor = colors.grey;
  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // The interval is set to 1000 milliseconds (1 second)
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  const callToGetOtp = async () => {
    if (countdown <= 0) {
      showLoader(true);
      try {
        const body = {
          loginOtpUserName: number,
          otpType: "Voice"
        };
        let validationResponse = await generateOtpForLogin(body);
        console.log(validationResponse);
        if (validationResponse.data.status === 200) {
          const successMessage = validationResponse.data.message;
          setIsPopupVisible(true);
          setPopupMessage(successMessage);
        } else {
          const errorMessage = validationResponse.data.message;
          setIsPopupVisible(true);
          setPopupMessage(errorMessage);
        }
        showLoader(false);
      } catch (error) {
        setPopupMessage("Error sending OTP!");
        setIsPopupVisible(true);
        showLoader(false);
      }
    }
    else{
      setPopupMessage("Wait for "+countdown+ "seconds to send OTP!");
      setIsPopupVisible(true);
    }
  }
  const smsToGetOtp = async () => {
    showLoader(true);
    const body = {
      loginOtpUserName: number,
      otpType: "SMS"
    };
    try {
      let validationResponse = await generateOtpForLogin(body);
      console.log(validationResponse);
      if (validationResponse.data.status === 200) {
        const successMessage = validationResponse.data.message;
        setIsPopupVisible(true);
        setPopupMessage(successMessage);
      } else {
        const errorMessage = validationResponse.data.message;
        setIsPopupVisible(true);
        setPopupMessage(errorMessage);
      }
      showLoader(false);
    } catch (error) {
      setPopupMessage("Error sending OTP!");
      setIsPopupVisible(true);
      showLoader(false);
    }
  }

  const validateotp = () => {
    showLoader(true);
    if (!otp) {
      setIsPopupVisible(true);
      setPopupMessage('Please Enter the otp to proceed ');
      showLoader(false);
      return;
    }
  
    const body = {
      loginOtpUserName: number,
      otp: otp,
    };
  
    validateLoginOtp(body)
      .then((verification) => {
        console.log("VERIFICATION", verification);
        const successMessage = verification.data.message;
        console.log(successMessage);
  
        if (
          successMessage ===
          'OTP verified successfully, please proceed with the registration.'
        ) {
          setPopupMessage(successMessage);
          setIsPopupVisible(true);
  
          loginWithOtp(number, otp)
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                throw new Error('Error logging in with OTP');
              }
            })
            .then((r) => {
              console.log("<><><<><>", r);
              login(r);
              showLoader(false);
            })
            .catch((error) => {
              console.error('Error logging in with OTP:', error);
              showLoader(false);
            });
        } else {
          setIsPopupVisible(true);
          setPopupMessage(verification.data.message);
          showLoader(false);
        }
      })
      .catch((error) => {
        console.error('Error validating OTP:', error);
        showLoader(false);
      });
  };
  

  useEffect(() => { }, [otp, number]);

  const handleClose = async () => {
    setIsPopupVisible(false);
    if (isPopupVisible == false) {
      console.log("<><><<><")
    }
  }

  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loader && <Loader isLoading={loader} />}

      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)}>
          {popupMessage}
        </Popup>
      )}
      <View style={styles.registerUser}>
        {isLoading == true ? (
          <View style={{ flex: 1 }}>
            <Loader isLoading={isLoading} />
          </View>
        ) : null}
        <View style={styles.mainWrapper}>
          <Image
            source={require('../../../assets/images/group_907.png')}
            style={styles.imageSaathi}
          />
          <Text style={styles.mainHeader}>
            {t('strings:lbl_otp_verification')}
          </Text>
          <View style={styles.formContainer}>
            <View style={styles.containter}>
              {isPopupVisible && (
                <Popup
                  isVisible={isPopupVisible}
                  onClose={handleClose}>
                  <Text>{popupMessage}</Text>
                </Popup>
              )}
              <Text style={styles.textHeader}>
                {t('strings:enter_otp_description')}
              </Text>
              <View style={styles.inputContainer}>
                <Image style={styles.icon} resizeMode='contain' source={require('../../../assets/images/mobile_icon.png')} />
                <TextInput
                  style={styles.input}
                  value={number}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Image style={styles.icon} resizeMode='contain' source={require('../../../assets/images/lock_icon.png')} />
                <TextInput
                  style={styles.input}
                  placeholder={t('strings:enter_otp')}
                  placeholderTextColor={placeholderColor}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={(text) => setOtp(text)}
                  maxLength={4}
                />
              </View>
            </View>
            <View>
              <Buttons
                label={t('strings:login_with_otp')}
                variant="filled"
                onPress={() => validateotp()}
                width="100%"
                iconHeight={10}
                iconWidth={30}
                iconGap={30}
                icon={arrowIcon}
              />
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 30 }}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={styles.greyText}>{t('strings:otp_not_received')}</Text>
                <TouchableOpacity onPress={smsToGetOtp}><Text style={{ color: colors.yellow }}>{t('strings:resend_otp')}</Text></TouchableOpacity>
              </View>
              <Text style={styles.greyText}>{t('strings:or')}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={callToGetOtp}>
                  <Text style={{ color: colors.yellow }}>{t('strings:call_to_get_otp')}</Text>
                </TouchableOpacity>
                {countdown > 0 ? (
                  <Text style={styles.greyText}>in {countdown} seconds</Text>
                ) : null}
              </View>
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
    textAlign: 'center',
    width: '80%',
    color: colors.grey,
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainHeader: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10
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
    width: '100%'
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
    alignItems: 'center',
    gap: 20,
    marginBottom: 50,
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
  },
});

export default LoginWithOtp;
