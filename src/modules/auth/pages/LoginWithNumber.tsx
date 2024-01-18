import React, { useState } from 'react';
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
import { generateOtpForLogin, loginWithOtp } from '../../../utils/apiservice';
import Popup from '../../../components/Popup';
import Loader from '../../../components/Loader';

const LoginWithNumber: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [number, setNumber] = useState('');
  const [preferedLanguage, setpreferedLanguage] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [message, setMessage] = useState('');
  const [loader, showLoader] = useState(false);

  const handleValidation = async () => {
    showLoader(true);
    try {
      const body = {
        loginOtpUserName: number,
        otpType: "SMS"
      };
      let validationResponse = await generateOtpForLogin(body);
      console.log(validationResponse.status, '<><><><><');
      showLoader(false);
      setMessage(validationResponse.data.message);
      if (validationResponse.data.message === "Please enter OTP to proceed with the login process") {
        const successMessage = validationResponse.data.message;
        setIsPopupVisible(true);
        setPopupMessage(successMessage);

      } else {
        const errorMessage = validationResponse.data.message;
        setIsPopupVisible(true);
        setPopupMessage(errorMessage);
      }
    } catch (error) {
      showLoader(false);
      setIsPopupVisible(true);
        setPopupMessage('Something went wrong!');
      console.error('Error during validation:', error);
    }
  };

  const getOTPOnCall = async () => {
    try {
      const body = {
        loginOtpUserName: number,
        otpType: "Voice"
      };
      let validationResponse = await generateOtpForLogin(body);
      validationResponse = await validationResponse.json();
      console.log(validationResponse.code, '<><><><><');
      if (validationResponse.code === 200) {
        const successMessage = validationResponse.message;
        navigation.navigate('loginwithotp', { usernumber: number });
        setIsPopupVisible(true);
        setPopupMessage(successMessage);
      } else {
        const errorMessage = validationResponse.message;
        setIsPopupVisible(true);
        setPopupMessage(errorMessage);
      }
    } catch (error) {
      console.error('Error during validation:', error);
    }
  }

  const placeholderColor = colors.grey;

  const { t } = useTranslation();
  

  const handleClose = () => {
    if(message == "Please enter OTP to proceed with the login process"){
      navigation.navigate('loginwithotp', { usernumber: number })
    }
    setIsPopupVisible(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {isPopupVisible && (
        <Popup
          isVisible={isPopupVisible}
          onClose={handleClose}>
      <Text>{popupMessage}</Text>
    </Popup>
  )
}
<View style={styles.registerUser}>
  <Loader isLoading={loader} />
  <View style={styles.mainWrapper}>
    <Image
      source={require('../../../assets/images/rishta_retailer_logo.webp')}
      style={styles.imageSaathi}
    />
    <Text style={styles.mainHeader}>{t('strings:lbl_welcome')}</Text>
    <View style={styles.formContainer}>
      <View style={styles.containter}>
        <Text style={styles.textHeader}>
          {t('strings:enter_registered_mobile_no_to_continue')}
        </Text>
        <View style={styles.inputContainer}>
          <Image style={styles.icon} resizeMode='contain' source={require('../../../assets/images/mobile_icon.png')} />
          <TextInput
            style={styles.input}
            placeholder={t('strings:enter_your_mobile_number')}
            placeholderTextColor={placeholderColor}
            value={number}
            keyboardType="number-pad"
            onChangeText={(text) => setNumber(text)}
            maxLength={10}
          />
        </View>
      </View>
      <View>
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
      <TouchableOpacity style={styles.otpPhone} onPress={getOTPOnCall}>
        <Image
          source={require('../../../assets/images/group_501.png')}
          style={styles.phone}
        />
        <Text style={styles.greyText}>
          {t('strings:lbl_otp_through_phone_call')}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 30 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Text style={styles.greyText}>{t('strings:otp_not_received')}</Text>
          <TouchableOpacity><Text style={{ color: colors.yellow }}>{t('strings:resend_otp')}</Text></TouchableOpacity>
        </View>
        <Text style={styles.greyText}>{t('strings:or')}</Text>
        <TouchableOpacity>
          <Text style={{ color: colors.yellow }}>{t('strings:call_to_get_otp')}</Text>
        </TouchableOpacity>
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
    </ScrollView >
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
    marginBottom: 20,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center'
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
    alignItems: 'center',
    marginTop: 30
  },
});

export default LoginWithNumber;
