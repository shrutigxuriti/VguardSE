import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
    responsiveFontSize,
    responsiveHeight,
} from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    bankTranfer,
    getany,
    getBanks,
    updateBank,
} from '../../../../../utils/apiservice';
import { getFile, sendFile } from '../../../../../utils/apiservice';
import { width, height } from '../../../../../utils/dimensions';
import colors from '../../../../../../colors';
import Buttons from '../../../../../components/Buttons';
import arrowIcon from '../../../../../assets/images/arrow.png';
import Popup from '../../../../../components/Popup';
import { getImageUrl } from '../../../../../utils/FileUtils';

type BankProps = {};

const Bank: React.FC<BankProps> = () => {
    const { t } = useTranslation();
    const [select, setSelect] = useState<string | null>(null);
    const [points, setPoints] = useState<string>('');
    const [accNo, setAccNo] = useState<string>('');
    const [accHolder, setAccHolder] = useState<string>('');
    const [accType, setAccType] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');
    const [ifscCode, setIfscCode] = useState<string>('');
    const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageName, setSelectedImageName] = useState<string>('');
    const [entityUid, setEntityUid] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');
    const [availableBanks, setAvailableBanks] = useState<string[]>([]);
    const [popupContent, setPopupContent] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);

    const handleImageClick = () => {
        setShowImagePreviewModal(true);
    };
    useEffect(() => {
        const getUserRoleFromAsyncStorage = async () => {
            const userRole = await AsyncStorage.getItem('userRole');
            setUserRole(userRole || '');
        };

        const getBankDetailsAndCallFileUri = async () => {
            try {
                await getUserRoleFromAsyncStorage();
                const response = await getany();
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(data, '<><<error message<><>');
                    setAccHolder(data.bankAccHolderName);
                    setAccType(data.bankAccType);
                    setBankName(data.bankNameAndBranch);
                    setIfscCode(data.bankIfsc);
                    setAccNo(data.bankAccNo);
                    setSelectedImageName(data.checkPhoto);
                    setEntityUid(data.checkPhoto);

                    await getFileUri(data.checkPhoto);
                    if (data.errorMessage) {
                        setPopupContent(data.errorMessage);
                        setPopupVisible(true);
                    }
                } else {
                    throw new Error('Failed to get bank details');
                }
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        getBankDetailsAndCallFileUri();

        getBanks()
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Failed to get bank names');
                }
            })
            .then((responses) => {
                if (Array.isArray(responses)) {
                    const bankNames = responses.map((bank) => bank.bankNameAndBranch);
                    setAvailableBanks(bankNames);
                } else {
                    console.error('Invalid response format');
                }
            })
            .catch((error) => {
                console.error('API Error:', error);
            });
    }, []);

    const getFileUri = async (selectedImageName: string) => {
        try {
            if (selectedImageName != '') {
                const response = await getImageUrl(selectedImageName, 'Cheque');
                console.log(response, 'file');
                setSelectedImage(response);
                return response;
            }
        } catch (error) {
            console.error('Error getting file:', error);
            throw error;
        }
    };

    const handleImagePickerPress = () => {
        setShowImagePickerModal(true);
    };

    const handleCameraUpload = () => {
        setShowImagePickerModal(false);
        launchCamera(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    console.log('Camera was canceled');
                } else if (response.error) {
                    console.error('Camera error: ', response.error);
                } else {
                    const fileData = {
                        uri: response.assets[0].uri,
                        type: response.assets[0].type,
                        name: response.assets[0].fileName,
                    };
                    setSelectedImage(response.assets[0].uri);
                    setSelectedImageName(response.assets[0].fileName);
                    triggerApiWithImage(fileData);
                }
            },
        );
    };

    const handleGalleryUpload = () => {
        setShowImagePickerModal(false);
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    console.log('Image picker was canceled');
                } else if (response.error) {
                    console.error('Image picker error: ', response.error);
                } else {
                    const fileData = {
                        uri: response.assets[0].uri,
                        type: response.assets[0].type,
                        name: response.assets[0].fileName,
                    };
                    setSelectedImage(response.assets[0].uri);
                    setSelectedImageName(response.assets[0].fileName);
                    triggerApiWithImage(fileData);
                }
            },
        );
    };

    const triggerApiWithImage = async (fileData: FormData) => {
        const formData = new FormData();
        formData.append('USER_ROLE', userRole);
        formData.append('image_related', 'CHEQUE');
        formData.append('file', fileData);

        try {
            const response = await sendFile(formData);
            setEntityUid(response.data.entityUid);
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    const handleProceed = () => {
        const postData = {
            bankAccNo: accNo,
            bankAccHolderName: accHolder,
            bankAccType: accType,
            bankNameAndBranch: bankName,
            bankIfsc: ifscCode,
            checkPhoto: entityUid,
            points: points
        };
        if (postData.bankAccNo != "" &&
            postData.bankAccHolderName != "" &&
            postData.bankAccType != "" &&
            postData.bankAccType != "" &&
            postData.bankNameAndBranch != "" &&
            postData.bankIfsc != "" &&
            postData.checkPhoto != "" &&
            postData.points != ""
        ) {
            bankTranfer(postData)
                .then((response) => {
                    console.log(postData, '---------------postdata');
                    if (response.status === 200) {
                        const responses = response.json();
                        return responses;
                    } else {
                        setPopupContent("Failed to update Bank Details");
                        setPopupVisible(true);
                    }
                })
                .then((data) => {
                    setPopupVisible(true);
                    setPopupContent(data.message)
                })
                .catch((error) => {
                    console.error('API Error:', error);
                });
        }
        else {
            setPopupContent("Enter all the details");
            setPopupVisible(true);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.mainWrapper}>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>
                        {t('strings:bank_details')}
                    </Text>
                    <Text style={styles.textSubHeader}>
                        {t('strings:for_account_tranfer_only')}
                    </Text>
                </View>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t(
                                'strings:enter_points_to_be_redeemed',
                            )}
                            placeholderTextColor={colors.grey}
                            value={points}
                            onChangeText={(value) => setPoints(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t(
                                'strings:lbl_account_number',
                            )}
                            placeholderTextColor={colors.grey}
                            value={accNo}
                            onChangeText={(value) => setAccNo(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t(
                                'strings:lbl_account_holder_name'
                            )}
                            value={accHolder}
                            placeholderTextColor={colors.grey}
                            onChangeText={(value) => setAccHolder(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Picker
                            selectedValue={accType}
                            onValueChange={(itemValue) => setAccType(itemValue)}
                            style={styles.picker}>
                            <Picker.Item label={t('strings:select_account_type')} value={''} />
                            <Picker.Item label={t('strings:account_type:saving')} value={'Saving'} />
                            <Picker.Item label={t('strings:account_type:current')} value={'Current'} />
                        </Picker>
                    </View>
                    <View style={styles.inputContainer}>
                        <Picker
                            selectedValue={bankName}
                            onValueChange={(itemValue) => setBankName(itemValue)}
                            style={styles.picker}>
                            <Picker.Item
                                key="Select"
                                label="Select Bank Name"
                                value="" />
                            {availableBanks.map((bank, index) => (
                                <Picker.Item
                                    key={index}
                                    label={bank}
                                    value={bank}
                                />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('strings:ifsc')}
                            value={ifscCode}
                            placeholderTextColor={colors.grey}
                            onChangeText={(value) => setIfscCode(value)}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={handleImagePickerPress}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('strings:cancelled_cheque_copy')}
                                    placeholderTextColor={colors.grey}
                                    editable={false}
                                />
                            <TouchableOpacity
                                onPress={handleImageClick}>
                                <View style={styles.inputImage}>
                                    {selectedImage ? (
                                        <Image
                                            source={{ uri: selectedImage }}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Image
                                            source={require('../../../../../assets/images/photo_camera.png')}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="contain"
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showImagePreviewModal}
                            onRequestClose={() => setShowImagePreviewModal(false)}
                        >
                            <View style={styles.modalContainer}>
                                <TouchableOpacity
                                    onPress={() => setShowImagePreviewModal(false)}
                                >
                                    <Image resizeMode='contain' style={{ width: 50, height: 50 }} source={require('../../../../../assets/images/ic_close.png')} />
                                </TouchableOpacity>

                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{ width: '70%', height: '70%' }}
                                    resizeMode="contain"
                                />
                            </View>
                        </Modal>
                        {/* Modal for selecting camera or gallery */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showImagePickerModal}
                            style={styles.modalcontainer}
                            hardwareAccelerated={true}
                            opacity={0.3}>
                            <View style={{
                                width: width / 1.80, borderRadius: 5, alignSelf: 'center', height: height / 8, top: height / 2.8,
                                margin: 20,
                                backgroundColor: '#D3D3D3',
                                borderRadius: 20,
                                padding: 10,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 100,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}>
                                <Picker
                                    mode="dropdown"
                                    placeholder={'Update Your Selfie *'}
                                    style={{ color: 'black' }}
                                    selectedValue={select}
                                    onValueChange={(itemValue, itemIndex) => {
                                        if (itemValue === "Open camera") {
                                            handleCameraUpload()
                                        } else if (itemValue === "Open Image picker") {
                                            handleGalleryUpload();
                                        }
                                    }}
                                >
                                    <Picker.Item label="Select Action" value="" />
                                    <Picker.Item label="Select Photo from gallery" value="Open Image picker" />
                                    <Picker.Item label="Capture Photo from camera" value="Open camera" />

                                </Picker>
                                <Button mode="text" onPress={() => setShowImagePickerModal(false)}>
                                    Close
                                </Button>
                            </View>
                        </Modal>
                    </View>
                </View>
                <View style={styles.button}>
                    <Buttons
                        label={t('strings:submit')}
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
        backgroundColor: colors.white,
    },
    mainWrapper: {
        padding: 15,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    inputImage: {
        height: responsiveHeight(2),
        width: responsiveHeight(2),
        marginRight: 5,
    },
    textHeader: {
        fontSize: responsiveFontSize(2.5),
        color: colors.black,
        fontWeight: 'bold',
    },
    textSubHeader: {
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        fontWeight: 'bold',
    },
    container: {
        height: responsiveHeight(8),
    },
    selectedImage: {
        width: 200,
        height: 200,
        marginVertical: 20,
    },
    buttonText: {
        color: colors.white,
        width: '100%',
        textAlign: 'center',
    },
    inputContainer: {
        borderColor: colors.lightGrey,
        borderWidth: 2,
        borderRadius: 10,
        height: responsiveHeight(5),
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(1),
    },
    input: {
        width: '90%',
        padding: 10,
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        // fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        gap: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        alignItems: 'center',
    },
    picker: {
        width: '90%',
        color: colors.grey,
    },
    labelPicker: {
        color: colors.grey,
        fontWeight: 'bold',
    },
    modalcontainer: { alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },

});

export default Bank;
