import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import Buttons from '../../../components/Buttons';
import arrowIcon from '../../../assets/images/arrow.png';
import Popup from '../../../components/Popup';
import { forgotPassword } from '../../../utils/apiservice';
import Loader from '../../../components/Loader';

const ForgotPassword: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const placeholderColor = colors.lightGrey;
  const [number, setNumber] = useState('');

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [loader, showLoader] = useState(false);

  const handleSubmit = async () => {
    // Validate the entered number
    const isValidNumber = /^\d{10}$/;  // Assuming 10 digits are required
    if (!isValidNumber.test(number)) {
      // Show a Snackbar or any other validation message
      setPopupVisible(true);
      setPopupContent(t('strings:enter_valid_mobileNo'));
      return;
    }
    showLoader(true);
    forgotPassword(number)
      .then(responsedata => {
        console.log("responsedata:", responsedata)
        const message = responsedata.data.message;
        setPopupVisible(true);
        setPopupContent(message);
        setNumber("");
        if (message === "SMS sent for new password") {
          showLoader(false);
          setTimeout(() => {
            navigation.navigate('login');
          }, 1000);
        } else {
          showLoader(false);
          return;
        }
      })
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Loader isLoading={loader} />
      <View style={styles.forgotPasswordScreen}>
        <View style={styles.mainWrapper}>
          <Image
            source={require('../../../assets/images/rishta_retailer_logo.webp')}
            style={styles.imageSaathi}
          />
          <Text style={styles.mainHeader}>{t('strings:lbl_forgot_password')}</Text>
          <Text style={styles.textHeader}>{t('strings:enter_registered_mobile_no_rishta_id')}</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../assets/images/mobile_icon.png')} resizeMode='contain' />
            <TextInput
              style={styles.input}
              placeholder={t('strings:lbl_registered_mobile_number_login')}
              placeholderTextColor={placeholderColor}
              value={number}
              onChangeText={(text) => {
                // Allow only digits
                const formattedText = text.replace(/[^0-9]/g, '');
                setNumber(formattedText);
              }}
              keyboardType="numeric"
              maxLength={10}
            />
            </View>
            <View style={styles.buttonContainer}>
              <Buttons
                label={t('strings:submit')}
                variant="filled"
                onPress={handleSubmit}
                width="100%"
                iconHeight={10}
                iconWidth={30}
                iconGap={30}
                icon={arrowIcon}
              />
            </View>
          </View>
        </View>
        <View>
          <View style={styles.footerContainer}>
            <Text style={styles.footergreyText}>{t('strings:powered_by_v_guard')}</Text>
            <Image
              source={require('../../../assets/images/group_910.png')}
              style={styles.imageVguard}
            />
          </View>
        </View>
      </View>
      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  forgotPasswordScreen: {
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
    width: '70%',
    textAlign: 'center',
    marginTop: responsiveHeight(2),
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
    flex: 1
  },
  inputContainer: {
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    marginBottom: 20,
    elevation: 5,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 5,
  },
  icon: {
    marginHorizontal: 10,
    width: 15,
    height: 15
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
  buttonContainer: {
    marginTop: responsiveHeight(10),
  },
});

export default ForgotPassword;
