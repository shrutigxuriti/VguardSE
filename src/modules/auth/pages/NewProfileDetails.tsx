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
import InputField from '../../../components/InputField';
interface NewProfileDetailsProps {
    navigation: any;
    route: {
        params: {
            usernumber: string;
        };
    };
}
const NewProfileDetails: React.FC<NewProfileDetailsProps> = ({ navigation, route }) => {
    const usernumber = route.params.usernumber;
    console.log("Number", usernumber)
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [loader, showLoader] = useState(false);
    const [data, setData] = useState({
        name: 'Testing Name',
        contactNo: usernumber,
        associated_with_cp: 'Yes',
        associated_cp: 'Testing CP',
        pincode: '560078',
        state: 'Karnataka',
        city: 'Bengaluru',
        district: 'North Bengaluru',
    })

    const placeholderColor = colors.grey;

    const { t } = useTranslation();

    const handleClose = () => {
        setIsPopupVisible(false);
    }

    const handleProceed = () => {
        navigation.navigate('setPassword', { usernumber: usernumber })
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
                    <Text style={styles.mainHeader}>Profile Details</Text>
                    <View style={styles.formContainer}>
                        <InputField
                            label={'ST Name'}
                            value={data.name}
                            disabled={true}
                            isImage={false}
                        />
                        <InputField
                            label={'ST Contact No.'}
                            value={data.contactNo}
                            disabled={true}
                            isImage={false}
                        />
                        <InputField
                            label={'Associated With CP (Yes/No)'}
                            value={data.associated_with_cp}
                            disabled={true}
                            isImage={false}
                        />
                        <InputField
                            label={'Associated CP'}
                            value={data.associated_cp}
                            disabled={true}
                            isImage={false}
                        />
                        <Text style={styles.subHeader}>Service Technician Address</Text>
                        <InputField
                            label={'Pincode'}
                            value={data.pincode}
                            disabled={true}
                            isImage={false}
                        />
                        <InputField
                            label={'State'}
                            value={data.state}
                            disabled={true}
                            isImage={false}
                        />
                        <InputField
                            label={'City'}
                            value={data.city}
                            disabled={true}
                            isImage={false}
                        />
                        <InputField
                            label={'District'}
                            value={data.district}
                            disabled={true}
                            isImage={false}
                        />
                        
                        <View>
                            <Buttons
                                label={t('strings:next')}
                                variant="filled"
                                onPress={() => handleProceed()}
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
    subHeader: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        color: colors.grey, 
        marginBottom: 15
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
        padding: 10,
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

export default NewProfileDetails;
