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
import CheckBox from '@react-native-community/checkbox'
import { responsiveFontSize } from 'react-native-responsive-dimensions';
interface SetPasswordProps {
    navigation: any;
    route: {
      params: {
        usernumber: string;
      };
    };
  }
const SetPassword: React.FC<SetPasswordProps> = ({ navigation, route }) => {
    const usernumber = route.params.usernumber;
    console.log("Number", usernumber)
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [otp, setOtp] = useState('');
    const [preferedLanguage, setpreferedLanguage] = useState(1);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [message, setMessage] = useState('');
    const [loader, showLoader] = useState(false);
    const [enterOtp, setEnterOtp] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const placeholderColor = colors.grey;

    const { t } = useTranslation();
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const handleClose = () => {
        setIsPopupVisible(false);
    }

    const confirmPassword = () => {
        if (passwordOne != passwordTwo) {
            setIsPopupVisible(true);
            setPopupMessage("Enter same password!")
        }
        navigation.navigate('newLoginKyc', {usernumber: usernumber})
        console.log("Confirm Password")
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
                    <Text style={styles.mainHeader}>Setup Password</Text>
                    <View style={styles.formContainer}>
                        <View style={styles.containter}>
                            <Text style={styles.textHeader}>
                                Enter a strong password
                            </Text>
                            <View>
                            <View style={styles.inputContainer}>
                                <Image style={styles.icon} resizeMode='contain' source={require('../../../assets/images/mobile_icon.png')} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('strings:enter_your_mobile_number')}
                                    placeholderTextColor={placeholderColor}
                                    value={usernumber}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    editable={false}
                                />
                            </View>
                                <View style={styles.inputContainer}>
                                    <Image
                                        style={styles.icon}
                                        resizeMode="contain"
                                        source={require('../../../assets/images/lock_icon.png')}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Password"
                                        placeholderTextColor={placeholderColor}
                                        value={passwordOne}
                                        onChangeText={(text) => setPasswordOne(text)}
                                        maxLength={10}
                                        secureTextEntry={!isPasswordVisible}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Image
                                        style={styles.icon}
                                        resizeMode="contain"
                                        source={require('../../../assets/images/lock_icon.png')}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Re-Enter Password"
                                        placeholderTextColor={placeholderColor}
                                        value={passwordTwo}
                                        onChangeText={(text) => setPasswordTwo(text)}
                                        maxLength={10}
                                        secureTextEntry={!isPasswordVisible}
                                    />
                                </View>
                                <View style={styles.checkboxContainer}>
                                    <CheckBox
                                        disabled={false}
                                        tintColors={{ true: colors.yellow, false: colors.lightGrey }}
                                        value={isPasswordVisible}
                                        onValueChange={togglePasswordVisibility}
                                        style={styles.checkbox}
                                    />
                                    {isPasswordVisible && (
                                        <Text style={styles.passwordCheck}>Hide Password</Text>
                                    )}
                                    {!isPasswordVisible && (
                                        <Text style={styles.passwordCheck}>Show Password</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                        <View>
                            <Buttons
                                label={t('strings:set_password')}
                                variant="filled"
                                onPress={() => confirmPassword()}
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
    passwordCheck: {
        fontSize: responsiveFontSize(1.7),
        color: colors.black
    },
    checkbox: {
        alignSelf: 'center',
        borderColor: colors.black,
        // backgroundColor: colors.black
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center'
        // backgroundColor: 'yellow'
    },
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
        // marginBottom: 50,
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

export default SetPassword;
