import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import colors from '../../../../colors';
import { useTranslation } from 'react-i18next';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const ContactPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();

  const handlePhoneCall = () => {
    Linking.openURL('tel:+91 9717500011');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@vguardrishta.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/919818900011');
  };

  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.mainHeader}>{t('strings:need_help')}</Text>
      <Text style={styles.text}>{t('strings:rishta_program_centre_contact_details')}</Text>
      <View style={styles.contact}>
        <TouchableOpacity style={styles.helpContainer} onPress={handlePhoneCall}>
          <Image
            source={require('../../../assets/images/ic_phone_call_2.png')}
            style={styles.icon}
          />
          <Text style={styles.textHelp}>9717500011</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpContainer} onPress={handleEmail}>
          <Image
            source={require('../../../assets/images/ic_email.png')}
            style={styles.icon}
          />
          <Text style={styles.textHelp}>info@vguardrishta.com</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpContainer} onPress={handleWhatsApp}>
          <Image
            source={require('../../../assets/images/ic_whatsapp.webp')}
            style={styles.icon}
          />
          <Text style={styles.textHelp}>9818900011</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>{t('strings:v_guard_customer_care_numbers')}</Text>
        <View style={styles.smallContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.blackDetail}>
              {t('strings:customerCareTollFree')} {t('strings:airtel')}
            </Text>
            <Text style={styles.greyDetail}>{t('strings:toll_free')}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.blackDetail}>
              {t('strings:customerCareNoCharged')} BSNL
            </Text>
            <Text style={styles.greyDetail}>{t('strings:charges_apply')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>{t('strings:v_guard_e_mail_id')}</Text>
        <View style={styles.smallContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.blackDetail}>
              {t('strings:customercare_vguard_in')}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>{t('strings:v_guard_corporate_office')}</Text>
        <View style={styles.smallContainer}>
          <Text style={styles.smallDetail}>V-Guard Industries Ltd.</Text>
          <Text style={styles.smallDetail}>Regd. Office:</Text>
          <Text style={styles.smallDetail}>
            42/962. Vennala Highschool Road Vennala. Kochi-682028
          </Text>
          <Text style={styles.smallDetail}>Ph: +91 484 433 5000</Text>
          <Text style={styles.smallDetail}>Fax: +91 484 300 5100</Text>
          <Text style={styles.smallDetail}>Email: mail@vguard.in</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainHeader: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: 18,
  },
  mainWrapper: {
    padding: 30,
  },
  text: {
    color: colors.black,
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
  },
  helpContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
  textHelp: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.black,
  },
  smallContainer: {
    backgroundColor: colors.lightYellow,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    gap: 10,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  blackDetail: {
    color: colors.black,
    fontSize: 14,
  },
  smallDetail: {
    marginLeft: 10,
    color: colors.black,
    fontSize: 14,
  },
  greyDetail: {
    color: colors.grey,
    fontSize: 14,
  },
});

export default ContactPage;
