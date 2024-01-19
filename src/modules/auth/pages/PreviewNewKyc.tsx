import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity, Modal } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import { reUpdateUserForKyc, updateKycReatiler } from '../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { UserData } from '../../../utils/modules/UserData';
import InputField from '../../../components/InputField';
import Buttons from '../../../components/Buttons';
import Popup from '../../../components/Popup';
import Loader from '../../../components/Loader';
import ImagePickerField from '../../../components/ImagePickerField';
interface PreviewNewKycProps {
    navigation: any;
}
const PreviewNewKyc: React.FC<PreviewNewKycProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<UserData | any>();
    const [postData, setPostData] = useState<UserData | any>();
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [loader, showLoader] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('VGUSER').then(result => {
            setUserData(JSON.parse(result))
            console.log("<><><><", result);
            setPostData(JSON.parse(result));
            showLoader(false);
        })
    }, []);



    const handleSubmit = () => {
        console.log("Post Data:----", postData);
        reUpdateUserForKyc(postData)
            .then(response => response.json())
            .then((responseData) => {
                console.log("RESPONSE DATA:", responseData);
                setPopupVisible(true);
                setPopupContent(responseData?.message);

                if (responseData?.code === 200 && responseData.message=="Your KYC re-submission successful") {
                    AsyncStorage.removeItem('VGUSER');
                }
            })
            .catch(error => {
                console.error('Error posting data:', error);
            });
    };

    const handleClose = () => {
        setPopupVisible(false);
        if(popupContent == "Your KYC re-submission successful"){
            navigation.navigate("login");
        }
    }

    const handleEdit = async () => {
        navigation.navigate('ReUpdateKyc', { usernumber: postData.contactNo });
    }

    return (
        <ScrollView style={styles.mainWrapper}>
            {loader && <Loader isLoading={loader} />}
            <View style={styles.detailsContainer}>
                <InputField
                    label={t('strings:retailer_name')}
                    value={postData?.name}
                    disabled={true}
                />
                <InputField
                    label={t('strings:contact_number')}
                    value={userData?.contactNo}
                    disabled={true}
                />
                <Text style={styles.subHeading}>{t('strings:permanent_address')}</Text>
                <InputField
                    label={t('strings:lbl_permanent_address_mandatory')}
                    value={postData?.permanentAddress}
                    disabled={true}
                />
                <InputField
                    label={t('strings:lbl_street_locality')}
                    value={postData?.streetAndLocality}
                    disabled={true}
                />
                <InputField
                    label={t('strings:lbl_landmark')}
                    value={postData?.landmark}
                    disabled={true}
                />
                <InputField
                    label={t('strings:pincode')}
                    value={postData?.pinCode}
                    disabled={true}
                />
                <InputField
                    label={t('strings:lbl_state')}
                    value={postData?.state}
                    disabled={true}
                />
                <InputField
                    label={t('strings:district')}
                    value={postData?.dist}
                    disabled={true}
                />
                <InputField
                    label={t('strings:city')}
                    value={postData?.city}
                    disabled={true}
                />
                <ImagePickerField label='Aadhar Card* (Front)'
                    imageRelated='ID_CARD_FRONT'
                    initialImage={postData?.kycDetails?.aadharOrVoterOrDLFront}
                    getImageRelated='IdCard'
                    editable={false}
                />
                <ImagePickerField label='Aadhar Card* (Back)'
                    imageRelated="ID_CARD_BACK"
                    initialImage={postData?.kycDetails?.aadharOrVoterOrDlBack}
                    getImageRelated='IdCard'
                    editable={false}
                />
                <InputField
                    label={t('strings:id_proof_no')}
                    value={postData?.kycDetails?.aadharOrVoterOrDlNo}
                    disabled={true}
                />
                <ImagePickerField label='Pan Card* (Front)'
                    imageRelated="PAN_CARD_FRONT"
                    initialImage={postData?.kycDetails?.panCardFront}
                    getImageRelated='PanCard'
                    editable={false}
                />
                <InputField
                    label={t('strings:update_pan_number_manually')}
                    value={postData?.kycDetails?.panCardNo}
                    disabled={true}
                />
                <InputField
                    label={t('strings:do_you_have_gst_number')}
                    value={postData?.gstYesNo}
                    disabled={true}
                />
                <InputField
                    label={t('strings:gst_no')}
                    value={postData?.gstNo}
                    disabled={true}
                />
                {/* <InputField
                    label="GST Photo"
                    isImage
                    imageName={gstImageName}
                    imageSource={gstCopySource}
                    onPressImage={() => handleImageClick(gstCopySource)}
                /> */}
                <ImagePickerField
                    label='GST Photo'
                    imageRelated="GST"
                    initialImage={postData?.gstPic}
                    getImageRelated='GST'
                    editable={false}
                />

                <View style={styles.buttons}>
                    <View style={styles.button}>
                        <Buttons
                            label={t('strings:Edit')}
                            variant="blackButton"
                            onPress={() => handleEdit()}
                            width="100%"
                        />
                    </View>
                    <View style={styles.button}>
                        <Buttons
                            label={t('strings:submit')}
                            variant="filled"
                            onPress={() => handleSubmit()}
                            width="100%"
                        />
                    </View>
                </View>
            </View>
            {isPopupVisible && (
                <Popup isVisible={isPopupVisible} onClose={handleClose}>
                    {popupContent}
                </Popup>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    mainWrapper: {
        padding: 15,
        flex: 1,
        backgroundColor: colors.white,
    },
    ImageProfile: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    textName: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(3),
        marginTop: responsiveHeight(2),
    },
    label: {
        color: colors.grey,
        fontSize: responsiveFontSize(1.7),
        marginTop: responsiveHeight(3),
        fontWeight: 'bold'
    },
    textDetail: {
        color: colors.black,
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold'
    },
    viewProfile: {
        color: colors.yellow,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(1.7),
    },
    data: {
        color: colors.black,
        fontSize: responsiveFontSize(1.7),
        marginTop: responsiveHeight(3),
        textAlign: 'right',
        fontWeight: 'bold'
    },
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    detailsContainer: {
        flexDirection: 'column',
        marginVertical: 30
    },
    subHeading: {
        color: colors.grey,
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        marginBottom: 30,
        flex: 1
    },
    container: {
        height: 50,
        marginBottom: 20,
        borderColor: colors.lightGrey,
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    focusedContainer: {
        borderColor: colors.grey,
    },
    label: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        color: colors.black,
        backgroundColor: colors.white,
        paddingHorizontal: 3,
    },
    focusedLabel: {
        position: 'absolute',
        top: -8,
        left: 10,
        fontSize: responsiveFontSize(1.5),
        color: colors.black,
    },
    input: {
        color: colors.black,
        paddingTop: 10,
    },
    disabledInput: {
        color: colors.grey,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    }
});

export default PreviewNewKyc;
