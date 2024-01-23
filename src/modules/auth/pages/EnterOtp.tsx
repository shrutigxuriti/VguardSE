import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, TextInput } from 'react-native';
import Buttons from '../../../components/Buttons';
import colors from '../../../../colors';
import language from '../../../assets/images/language.png';
import arrowIcon from '../../../assets/images/arrow.png';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../../../components/LanguagePicker';
import { useFocusEffect } from '@react-navigation/native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
interface EnterOtpProps {
    navigation: any;
    route: {
      params: {
        usernumber: string;
      };
    };
  }
const EnterOtp: React.FC<EnterOtpProps> = ({ navigation, route }) => {
    const usernumber = route.params.usernumber;
    const { t, i18n } = useTranslation();
    const [otp, setOtp] = useState('');

    useEffect(() => {
        console.log('Language changed:', i18n.language);
    }, [i18n.language]);

    const handlePress = async () => {
        // navigation.navigate('setPassword', {usernumber: usernumber})
        navigation.navigate('newProfileDetails', {usernumber: usernumber})
    }

    return (
        <View style={styles.mainWrapper}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../../assets/images/group_907.png')}
                    style={styles.imageSaathi}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.subHeader}>{t('strings:enter_otp')}</Text>
                <View style={styles.inputContainer}>
                    <Image style={styles.icon} resizeMode='contain' source={require('../../../assets/images/mobile_icon.png')} />
                    <TextInput
                        style={styles.input}
                        placeholder={t('strings:enter_otp')}
                        placeholderTextColor={colors.grey}
                        value={otp}
                        onChangeText={(text) => setOtp(text)}
                        keyboardType='numeric'
                        maxLength={4}
                    />
                </View>
                <View style={styles.startButtonContainer}>
                    <Buttons
                        label={t('strings:next')}
                        variant={'filled'}
                        onPress={handlePress}
                        width="100%"
                        iconHeight={10}
                        iconWidth={30}
                        iconGap={30}
                        icon={arrowIcon}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        padding: 25,
        backgroundColor: colors.white,
    },
    subHeader: {
        color: colors.black,
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30
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
    buttonContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '75%',
        width: '100%',
        flex: 2
    },
    container: {
        flex: 1
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

export default EnterOtp;
