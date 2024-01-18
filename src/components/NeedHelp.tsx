import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../colors';

import { useTranslation } from 'react-i18next';

const NeedHelp: React.FC = () => {
  const { t } = useTranslation();

  const phoneNumber = '9717500011';
  const email = 'info@vguardrishta.com';
  const whatsappNumber = '9818900011';

  const callPhoneNumber = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const sendEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/${whatsappNumber}`);
  };

  return (
    <View style={styles.contact}>
      <Text style={styles.textHeader}>{t('strings:need_help')}</Text>
      <TouchableOpacity onPress={callPhoneNumber}>
        <View style={styles.helpContainer}>
          <Image source={require('../assets/images/ic_phone_call_2.png')} style={styles.icon} />
          <Text style={styles.textHelp}>{phoneNumber}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={sendEmail}>
        <View style={styles.helpContainer}>
          <Image source={require('../assets/images/ic_email.png')} style={styles.icon} />
          <Text style={styles.textHelp}>{email}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={openWhatsApp}>
        <View style={styles.helpContainer}>
          <Image source={require('../assets/images/ic_whatsapp.webp')} style={styles.icon} />
          <Text style={styles.textHelp}>{whatsappNumber}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contact: {
    width: '100%',
    marginTop: 20,
    textAlign: 'left',
  },
  textHeader: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: responsiveFontSize(2.5),
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
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: colors.black,
  },
});

export default NeedHelp;
