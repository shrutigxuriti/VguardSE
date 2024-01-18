import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '../../../../colors';
import Buttons from '../../../components/Buttons';
import arrowIcon from '../../../assets/images/arrow.png';
import { loginWithPassword } from '../../../utils/apiservice';
import { useAuth } from '../../../components/AuthContext';
import Popup from '../../../components/Popup';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader';
import { Linking } from 'react-native';
import selectedTickImage from '../../../assets/images/tick_1.png';
import notSelectedTickImage from '../../../assets/images/tick_1_notSelected.png';
import LanguagePicker from '../../../components/LanguagePicker';
import language from '../../../assets/images/language.png';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleLanguageButtonPress = () => {
    setShowLanguagePicker(true);
  };

  const pkg = require('../../../../package.json');
  const version = DeviceInfo.getVersion();

  const handleCloseLanguagePicker = () => {
    setShowLanguagePicker(false);
  };

  useEffect(() => {
    const clearAsyncStorage = async () => {
      try {
        await AsyncStorage.removeItem('USER');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('diffAcc');
        console.log('Language changed:', i18n.language);
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };
  
    clearAsyncStorage();
  }, [i18n.language]);
  

  const showSnackbar = (message: string) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const [loader, showLoader] = useState(false);
  const yellow = colors.yellow;
  const placeholderColor = colors.lightGrey;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, showPopup, popupAuthContent, setShowPopup } = useAuth();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [selectedOption, setSelectedOption] = useState(true);

  const handleTermsPress = () => {
    setSelectedOption(!selectedOption);
  };

  const openTermsAndConditions = () => {
    const url = 'https://vguardrishta.com/tnc_retailer.html';

    Linking.openURL(url)
      .catch((error) => console.error('Error opening URL:', error));
  };

  // const togglePopup = () => {
  //   setIsPopupVisible(!isPopupVisible);
  // };

  const handleLogin = async () => {
    if (username === '' || password === '') {
      showSnackbar('Please enter a username and password.');
      return;
    }

    if (selectedOption === false) {
      showSnackbar(t('strings:please_accept_terms'));
      return;
    }

    showLoader(true);

    try {
      const response = await loginWithPassword(username, password);
      console.log("RESPONSE----", response)
      showLoader(false);

      if (response.status === 200) {
        var r = await response.data;
        console.log(r);
        login(r);
      }
      else if (response.status === 500) {
        setIsPopupVisible(!isPopupVisible);
        setPopupContent("Something went wrong!")
      } else {
        setIsPopupVisible(!isPopupVisible);
        setPopupContent("Wrong Username or Password!")
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.loginScreen}>
        <View style={styles.mainWrapper}>
          <View style={styles.buttonLanguageContainer}>
            <Buttons
              label=""
              variant="outlined"
              onPress={handleLanguageButtonPress}
              iconHeight={30}
              iconWidth={30}
              iconGap={0}
              icon={language}
            />
          </View>
          {loader && <Loader />}
          <Image
            source={require('../../../assets/images/rishta_retailer_logo.webp')}
            style={styles.imageSaathi}
          />
          <Text style={styles.mainHeader}>{t('strings:lbl_welcome')}</Text>

          <Text style={styles.textHeader}>
            {t('strings:lbl_login_or_register')}
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Image style={styles.icon} resizeMode='contain' source={require('../../../assets/images/mobile_icon.png')} />
              <TextInput
                style={styles.input}
                placeholder={t('strings:lbl_registered_mobile_number_login')}
                placeholderTextColor={placeholderColor}
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image style={styles.icon} resizeMode='contain' source={require('../../../assets/images/lock_icon.png')} />
              <TextInput
                style={styles.input}
                placeholder={t('strings:password')}
                placeholderTextColor={placeholderColor}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>

            <View style={styles.updateAndForgot}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('updatekyc')}>
                <Text style={styles.buttonText}>
                  {t('strings:update_cap_kyc')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('forgotPassword')}
                style={styles.forgotPasswordContainer}
              >
                <Text style={[styles.forgotPassword]}>
                  {t('strings:forgot_password_question')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <Buttons
                label={t('strings:log_in')}
                variant="filled"
                onPress={handleLogin}
                width="100%"
                iconHeight={10}
                iconWidth={30}
                iconGap={30}
                icon={arrowIcon}
              />
              <Buttons
                label={t('strings:login_with_otp')}
                variant="filled"
                onPress={() => navigation.navigate('loginWithNumber')}
                width="100%"
              />
              {/* <Buttons
                style={styles.button}
                label={t('strings:new_user_registration')}
                variant="blackButton"
                onPress={() => navigation.navigate('register')}
                width="100%"
              /> */}
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => handleTermsPress()}
            style={styles.footerTextContainer}
          >
            <Image
              source={
                selectedOption === true
                  ? selectedTickImage
                  : notSelectedTickImage
              }
              style={styles.tick}
            />

            <TouchableOpacity onPress={() => openTermsAndConditions()}>
              <Text style={styles.footerText}>
                {t('strings:lbl_accept_terms')}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <Text style={styles.versionText}>
            V {version}
          </Text>
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
        {isPopupVisible && (
          <Popup isVisible={isPopupVisible} onClose={() => setIsPopupVisible(!isPopupVisible)}>
            <Text style={{ fontWeight: 'bold' }}>
              {popupContent}
            </Text>
          </Popup>
        )}
        {showPopup && (
          <Popup isVisible={showPopup} onClose={() => setShowPopup(false)}>
            <Text style={{ fontWeight: 'bold' }}>
              {popupAuthContent}
            </Text>
          </Popup>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={showLanguagePicker}
          onRequestClose={handleCloseLanguagePicker}
        >
          <View style={styles.languagePickerContainer}>
            <LanguagePicker onCloseModal={handleCloseLanguagePicker} />
            <TouchableOpacity onPress={handleCloseLanguagePicker}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  loginScreen: {
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
    justifyContent: 'center',
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
  forgotPasswordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPassword: {
    color: colors.grey,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'right',
  },
  or: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 20,
  },
  footer: {},
  footerText: {
    textAlign: 'left',
    fontSize: 10,
    color: colors.black,
  },
  footerTextContainer: {
    paddingBottom: 5,
    paddingHorizontal: 80,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'flex-end',
    gap: 10,
    justifyContent: 'center',
    backgroundColor: colors.lightGrey,
    width: '100%',
    paddingVertical: 10,
  },
  updateAndForgot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.yellow,
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: colors.black,
    fontWeight: 'bold',
  },
  buttonLanguageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  languagePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  closeText: {
    marginTop: 20,
    color: colors.black,
    backgroundColor: colors.yellow,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: colors.black,
    fontSize: responsiveFontSize(1.3),
    marginVertical: 30
  },
});

export default LoginScreen;
