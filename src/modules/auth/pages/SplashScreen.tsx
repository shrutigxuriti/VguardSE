import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import Buttons from '../../../components/Buttons';
import colors from '../../../../colors';
import language from '../../../assets/images/language.png';
import arrowIcon from '../../../assets/images/arrow.png';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../../../components/LanguagePicker';
import { useFocusEffect } from '@react-navigation/native';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log('Language changed:', i18n.language);

    const timeoutId = setTimeout(() => {
      navigation.navigate('numberLogin');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [i18n.language]);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/group_910.png')}
          style={styles.imageVguard}
        />
        <Image
          source={require('../../../assets/images/group_907.png')}
          style={styles.imageSaathi}
        />
      </View>
      {/* <View style={styles.startButtonContainer}>
        <Buttons
          label={t('strings:start')}
          variant={'filled'}
          onPress={() => navigation.navigate('login')}
          iconHeight={10}
          iconWidth={30}
          iconGap={30}
          icon={arrowIcon}
          width="90%"
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    padding: 25,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  button: {
    alignSelf: 'right',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '75%',
    width: '100%',
    gap: 100,
  },
  imageVguard: {
    width: 200,
    height: 73,
  },
  imageSaathi: {
    width: 200,
    height: 196,
  },
  startButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '20%',
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
});

export default SplashScreen;
