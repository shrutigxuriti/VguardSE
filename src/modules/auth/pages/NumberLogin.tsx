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

const NumberLogin: React.FC<{ navigation: any }> = ({ navigation }) => {
    
    const { t, i18n } = useTranslation();
    const [username, setUsername] = useState('');

    useEffect(() => {
        console.log('Language changed:', i18n.language);
    }, [i18n.language]);

    const handlePress = async () => {
        if(username == '8888888880'){
            navigation.navigate('enterOtp', {usernumber: username})
        }
        else{
            navigation.navigate('login', {usernumber: username})
        }
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
                <Text style={styles.subHeader}>Enter Your Mobile Number to Proceed!</Text>
                <View style={styles.inputContainer}>
                    <Image style={styles.icon} resizeMode='contain' source={require('../../../assets/images/mobile_icon.png')} />
                    <TextInput
                        style={styles.input}
                        placeholder={t('strings:lbl_registered_mobile_number_login')}
                        placeholderTextColor={colors.grey}
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        keyboardType='numeric'
                        maxLength={10}
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

export default NumberLogin;
