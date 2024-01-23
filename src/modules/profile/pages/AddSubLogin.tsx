import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import InputField from '../../../components/InputField';
import { useTranslation } from 'react-i18next';
import Buttons from '../../../components/Buttons';
import { addLogin } from '../../../utils/apiservice';
import Popup from '../../../components/Popup';
import Snackbar from 'react-native-snackbar';

const AddSubLogin: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { t } = useTranslation();

    const [inputName, setInputName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState('');

    const handleInputChange = (value: string, label: string) => {
        if (label === 'Name') {
            setInputName(value);
        } else if (label === 'Contact Number') {
            setContactNo(value);
        }
    };

    const addSubLogin = async () => {
        const data = {
            name: inputName,
            mobileNo: contactNo
        }
        const isValidNumber = /^\d{10}$/.test(contactNo);
        if (isValidNumber && inputName) {
            addLogin(data)
                .then(response => response.data)
                .then((responseData) => {
                    setPopupVisible(true);
                    setPopupContent(responseData.message);
                    setContactNo("");
                    setInputName("");
                    console.log("<><<><<><>><", responseData, "<><<<><><><><><><<><");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
        else if (inputName == "") {
            Snackbar.show({
                text: 'Please enter name',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
        else if (!isValidNumber) {
            Snackbar.show({
                text: 'Please enter a valid 10-digit mobile number',
                duration: Snackbar.LENGTH_SHORT,
            });
        }


    }

    return (
        <View style={styles.container}>
            <View style={styles.flexBox}>
                <View style={styles.ImageProfile}>
                    <Image source={require('../../../assets/images/ic_v_guards_user.png')} style={{ width: '100%', height: '100%', borderRadius: 100 }} resizeMode='contain' />
                </View>
                <View>
                    <Text style={styles.textBoldDetail}>New User</Text>
                    <Text style={styles.textDetail}>Rishta ID</Text>
                </View>
            </View>
            <View style={styles.formContainer}>
                <InputField
                    label={t('strings:lbl_name_mandatory')}
                    value={inputName}
                    onChangeText={(text) => handleInputChange(text, 'Name')}
                    maxLength={10}
                />
                <InputField
                    label={t('strings:lbl_contact_number_mandatory')}
                    value={contactNo}
                    onChangeText={(text) => handleInputChange(text, 'Contact Number')}
                    numeric
                    maxLength={10}
                />
                <View style={styles.buttonContainer}>
                    <Buttons
                        label={t('strings:create_login')}
                        variant="filled"
                        onPress={() => addSubLogin()}
                        width="70%"
                    />
                </View>
            </View>
            <View style={styles.buttonBottomContainer}>
                <Buttons
                    label={t('strings:view_all_login')}
                    variant="filled"
                    onPress={() => navigation.navigate('View All Logins')}
                    width="70%"
                />
            </View>

            {isPopupVisible && (
                <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
                    {popupContent}
                </Popup>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: colors.white
    },
    formContainer: {
        marginTop: 50,
    },
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    textDetail: {
        color: colors.black,
        fontSize: responsiveFontSize(1.7),
    },
    textBoldDetail: {
        color: colors.black,
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold'
    },
    ImageProfile: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    buttonContainer: {
        marginTop: responsiveHeight(10),
        width: '100%',
        alignItems: 'center'
    },
    buttonBottomContainer: {
        marginTop: responsiveHeight(20),
        width: '100%',
        alignItems: 'center'
    },
});

export default AddSubLogin;
