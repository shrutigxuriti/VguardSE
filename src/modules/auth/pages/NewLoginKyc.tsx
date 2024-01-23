import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import { getCities, getDetailsByPinCode, getDistricts, getPincodeList, getRishtaUserProfile, getStates, getUser, loginWithPassword, sendFile } from '../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Cities, District, State, UserData } from '../../../utils/modules/UserData';
import InputField from '../../../components/InputField';
import Buttons from '../../../components/Buttons';
import PickerField from '../../../components/PickerField';
import Popup from '../../../components/Popup';
import ImagePickerField from '../../../components/ImagePickerField';
import Loader from '../../../components/Loader';
import { height } from '../../../utils/dimensions';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from '../../../components/AuthContext';
interface NewLoginKycProps {
    navigation: any;
    route: {
        params: {
            usernumber: string;
        };
    };
}

const NewLoginKyc: React.FC<NewLoginKycProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { usernumber } = route.params;
    const [postData, setPostData] = useState<UserData | any>();
    const [isShopAddressDifferent, setIsShopAddressDifferent] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [PopupVisible, setIsPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [isSkipPopupVisible, setSkipPopupVisible] = useState(false);
    const [popupSkipContent, setPopupSkipContent] = useState('');
    const [states, setStates] = useState<State | any>();
    const [districts, setDistricts] = useState<District | any>();
    const [cities, setCities] = useState<Cities | any>();
    const [currStates, setCurrStates] = useState<State | any>();
    const [currDistricts, setCurrDistricts] = useState<District | any>();
    const [currCities, setCurrCities] = useState<Cities | any>();
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [uiSwitch, setUIswitch] = React.useState({ currentpincode: false, pincode: false })
    const [loader, showLoader] = useState(false);
    const { login, showPopup, popupAuthContent, setShowPopup } = useAuth();


    useEffect(() => {
        setPostData((prevData: UserData) => ({
            ...prevData,
            contactNo: usernumber
        }));
    }, []);

    const handleSkip = async() => {
        setSkipPopupVisible(false);
        // navigation.navigate('login', {usernumber: usernumber});
        try {
            const response = await loginWithPassword('8888888880', 34859272);
            console.log("RESPONSE----", response)
            showLoader(false);
      
            if (response.status === 200) {
              var r = await response.data;
              console.log(r);
              login(r);
            }
            else if (response.status === 500) {
              setIsPopupVisible(!isPopupVisible);
              setPopupContent("Something went wrong!")
            } else {
              setIsPopupVisible(!isPopupVisible);
              setPopupContent("Wrong Username or Password!")
            }
          } catch (error) {
            showLoader(false);
            console.error('Login error:', error);
          }
    }

    const validateField = (label: string, value: string, postData: UserData | any) => {
        const errors: string[] = [];

        switch (label) {
            case 'name':
                if (!value || value.match(/\d/)) {
                    errors.push('Name should not contain numbers');
                }
                if (value == "") {
                    errors.push('Name should not be empty');
                }
                break;
            case 'permanentAddress':
                if (value == "") {
                    errors.push('Address should not be empty');
                }
            case 'streetAndLocality':
                if (value == "") {
                    errors.push('Street and Locality should not be empty');
                }
            case 'pinCode':
                if (value == "") {
                    errors.push('Pincode should not be empty');
                }
            case 'kycDetails.aadharOrVoterOrDLFront':
                if (value == "") {
                    errors.push('Aadhar Card Front should not be empty');
                }
            case 'kycDetails.aadharOrVoterOrDlBack':
                if (value == "") {
                    errors.push('Aadhar Card Back should not be empty');
                }
            case 'kycDetails.panCardFront':
                if (value == "") {
                    errors.push('Pan Card Front should not be empty');
                }
            case 'kycDetails.panCardNo':
                if (value == "") {
                    errors.push('Pan Number should not be empty');
                }
            case 'kycDetails.aadharOrVoterOrDlNo':
                if (value == "") {
                    errors.push('Aadhaar Number should not be empty');
                }
            case 'gstNo':
                if (postData?.gstYesNo == "Yes" && value == "") {
                    errors.push('GST No. should not be empty');
                }
            default:
                break;
        }
        return errors;
    };

    const triggerApiWithImage = async (fileData: { uri: string; type: string; name: string }, imageRelated: string) => {
        try {
            const formData = new FormData();
            formData.append('USER_ROLE', '2');
            formData.append('image_related', imageRelated);
            formData.append('file', {
                uri: fileData.uri,
                name: fileData.name,
                type: fileData.type,
            });

            console.log("formData=====", formData);
            const response = await sendFile(formData);
            console.log("response-----------", response.data.entityUid);
            return response.data.entityUid;
        } catch (error) {
            setPopupContent("Error uploading image");
            setPopupVisible(true);
            console.error('API Error:', error);
            throw error;
        }
    };

    const handleSendImage = async () => {
        try {
            const panPromise = panFileData.uri !== "" ? triggerApiWithImage(panFileData, 'PAN_CARD_FRONT') : Promise.resolve(null);
            const idFrontPromise = idFrontFileData.uri !== "" ? triggerApiWithImage(idFrontFileData, 'ID_CARD_FRONT') : Promise.resolve(null);
            const idBackPromise = idBackFileData.uri !== "" ? triggerApiWithImage(idBackFileData, 'ID_CARD_BACK') : Promise.resolve(null);
            const gstPromise = GstFileData.uri !== "" ? triggerApiWithImage(GstFileData, 'GST') : Promise.resolve(null);

            const [panUid, idFrontUid, idBackUid, gstUid] = await Promise.all([panPromise, idFrontPromise, idBackPromise, gstPromise]);

            const updatedPostData = { ...postData };

            if (panFileData.uri !== "" && panUid !== null) {
                console.log(panUid);
                setPostDataOfImage('pan', panUid);
                updatedPostData.kycDetails.panCardFront = panUid;
            }

            if (idFrontFileData.uri !== "" && idFrontUid !== null) {
                setPostDataOfImage('aadharOrVoterOrDLFront', idFrontUid);
                updatedPostData.kycDetails.aadharOrVoterOrDLFront = idFrontUid;
            }

            if (idBackFileData.uri !== "" && idBackUid !== null) {
                setPostDataOfImage('aadharOrVoterOrDlBack', idBackUid);
                updatedPostData.kycDetails.aadharOrVoterOrDlBack = idBackUid;
            }

            if (GstFileData.uri !== "" && gstUid !== null) {
                setPostDataOfImage('gstPic', gstUid);
                updatedPostData.gstPic = gstUid;
            }

            return Promise.resolve(updatedPostData);
        } catch (error) {
            console.error('Error in handleSendImage:', error);
            return Promise.reject('Error in handleSendImage.');
        }
    };
    const skipKyc = async () => {
        setSkipPopupVisible(true);
        setPopupSkipContent('Your New Account is created!');
    }

    const InitiatePreview = async () => {
        try {
            handleSendImage()
                .then(updatedPostData => {
                    console.log("POSTDATA", updatedPostData);
                    AsyncStorage.setItem('VGUSER', JSON.stringify(updatedPostData)).then(() => {
                        navigation.navigate('previewNewKyc');
                    });
                })
                .catch(error => {
                    console.error('Error in handleSubmit:', error);
                });
        }
        catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    };



    const handleChange = (label: string, value: string) => {
        if (label === 'isShopDifferent') {
            setIsShopAddressDifferent(value);
            if (value == "Yes") {
                setPostData((prevData: UserData) => ({
                    ...prevData,
                    currentAddress: postData.permanentAddress,
                    currStreetAndLocality: postData.streetAndLocality,
                    currLandmark: postData.landmark,
                    currCity: postData.city,
                    currCityId: postData.cityId,
                    currDistId: postData.distId,
                    currDist: postData.dist,
                    currStateId: postData.stateId,
                    currState: postData.state,
                    currPinCode: postData.pinCode
                }))
            }
        } else if (label === 'gstYesNo') {
            setPostData((prevData: UserData) => ({
                ...prevData,
                gstYesNo: value,
            }));
        }
    };

    const handleInputChange = (value: string, label: string) => {
        const updatedData: UserData | any = { ...postData };

        if (label.startsWith('kycDetails.')) {
            const kycLabel = label.replace('kycDetails.', '');
            updatedData.kycDetails = {
                ...updatedData.kycDetails,
                [kycLabel]: value,
            };
        } else {
            updatedData[label] = value;
        }

        const errors: string[] = validateField(label, value, updatedData);
        setValidationErrors(errors);

        setPostData(updatedData);
    };



    const selectYesorNo = [
        { label: 'Select Option', value: '' },
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];

    const [idFrontFileData, setIdFrontFileData] = useState({
        uri: "",
        name: "",
        type: ""
    })
    const [idBackFileData, setIdBackFileData] = useState({
        uri: "",
        name: "",
        type: ""
    })
    const [panFileData, setPanFileData] = useState({
        uri: "",
        name: "",
        type: ""
    })
    const [GstFileData, setGstFileData] = useState({
        uri: "",
        name: "",
        type: ""
    })

    const handleImageChange = async (image: string, type: string, imageName: string, label: string) => {
        let fileData = {
            uri: image,
            name: imageName,
            type: type,
        };
        console.log(fileData)
        try {
            if (label === "Aadhar Card* (Front)") {
                setIdFrontFileData(fileData)
            } else if (label === "Aadhar Card* (Back)") {
                setIdBackFileData(fileData)
            } else if (label === "Pan Card* (Front)") {
                setPanFileData(fileData)
            } else if (label === "GST Photo") {
                setGstFileData(fileData)
            }

        } catch (error) {
            console.error('Error handling image change in Update Kyc:', error);
        }
    };

    const setPostDataOfImage = (label: string, value: string) => {
        setPostData((prevData: UserData) => ({
            ...prevData,
            kycDetails: {
                ...prevData.kycDetails,
                [label]: value,
            }
        }));
    }

    const handleStateSelect = async (text: string, type: string) => {
        let selectedCategory: any;
        if (type == "permanent") {
            selectedCategory = states.find(category => category.stateName === text);
            setPostData((prevData: UserData) => ({
                ...prevData,
                state: text,
                stateId: selectedCategory?.id || null,
            }));
        }
        else if (type == "current") {
            selectedCategory = currStates.find(category => category.stateName === text);
            setPostData((prevData: UserData) => ({
                ...prevData,
                currState: text,
                currStateId: selectedCategory?.id || null,
            }));
        }
        getDistricts(selectedCategory?.id)
            .then(response => response.data)
            .then((data) => {
                if (type == 'permanent') {
                    setDistricts(data);
                }
                if (type == 'current') {
                    setCurrDistricts(data);
                }
            })
    }
    const handleDistrictSelect = async (text: string, type: string) => {
        let selectedCategory: any;
        if (type == "permanent") {
            selectedCategory = districts.find(category => category.districtName === text);
            setPostData((prevData: UserData) => ({
                ...prevData,
                dist: text,
                distId: selectedCategory?.id || null,
            }));
        }
        else if (type == "current") {
            selectedCategory = currDistricts.find(category => category.districtName === text);
            setPostData((prevData: UserData) => ({
                ...prevData,
                currDist: text,
                currDistId: selectedCategory?.id || null,
            }));
        }
        getCities(selectedCategory?.id)
            .then(response => response.data)
            .then((data) => {
                if (type == 'permanent') {
                    setCities(data);
                }
                if (type == 'current') {
                    setCurrCities(data);
                }
            })
    }
    const handleCitySelect = async (text: string, type: string) => {
        if (type == "permanent") {
            const selectedCategory = cities.find(category => category.cityName === text);
            setPostData((prevData: UserData) => ({
                ...prevData,
                city: text,
                cityId: selectedCategory?.id || null,
            }));
        }
        else if (type == "current") {
            const selectedCategory = currCities.find(category => category.cityName === text);
            setPostData((prevData: UserData) => ({
                ...prevData,
                currCity: text,
                currCityId: selectedCategory?.id || null,
            }));
        }
    }

    const [pincode_suggestions, setPincode_Suggestions] = React.useState([])
    const [curr_pincode_suggestions, setCurr_Pincode_Suggestions] = React.useState([])

    function updateDistrictState(pincode: string, type: string) {
        showLoader(true);

        getPincodeList(pincode)
            .then(data => {
                const pincodeid = data.data[0].pinCodeId;
                return getDetailsByPinCode(pincodeid);
            })
            .then(secondData => {
                secondData = secondData.data;
                if (type == 'permanent') {
                    setDistricts([{
                        distId: secondData.distId,
                        districtName: secondData.distName,
                    }]);
                    setStates([secondData]);
                    setCities([secondData]);
                }
                if (type == 'current') {
                    setCurrDistricts([{
                        distId: secondData.distId,
                        districtName: secondData.distName,
                    }]);
                    setCurrStates([secondData]);
                    setCurrCities([secondData]);
                }

                type === 'permanent' ?
                    setPostData((prevData: UserData) => ({
                        ...prevData,
                        dist: secondData.distName,
                        distId: secondData.distId,
                        state: secondData.stateName,
                        stateId: secondData.stateId,
                        cityId: secondData.cityId,
                        city: secondData.cityName,
                        pinCode: pincode
                    }))
                    : setPostData((prevData: UserData) => ({
                        ...prevData,
                        currDist: secondData.distName,
                        currDistId: secondData.distId,
                        currState: secondData.stateName,
                        currStateId: secondData.stateId,
                        currCityId: secondData.cityId,
                        currCity: secondData.cityName,
                        currPinCode: pincode
                    }));
                return getCities(secondData.distId);
            })
            .then(cityData => {
                cityData = cityData;
                // console.log('Second API call:', cityData);
                showLoader(false);
            })
            .catch(error => {
                console.error('Error in Page 1:', error);
            })
            .finally(() => {
                showLoader(false);
            });
    }

    async function processPincode(pincode: string, type: string) {
        if (pincode.length > 3) {
            let suggestionData = await getPincodeList(pincode);
            suggestionData = suggestionData.data;

            if (Array.isArray(suggestionData) && suggestionData.length > 0) {
                const filteredSuggestions = suggestionData.filter((item) => (
                    item.pinCode !== null
                ));
                if (type == 'permanent') {
                    setPincode_Suggestions(filteredSuggestions);
                }
                if (type == 'current') {
                    setCurr_Pincode_Suggestions(filteredSuggestions);
                }
                if (pincode.length == 6) {
                    updateDistrictState(pincode, type);
                }
            }
        }
        // console.log(pincode);

        type === 'permanent' ? setPostData((prevData: UserData) => ({
            ...prevData,
            pinCode: pincode
        })) : setPostData((prevData: UserData) => ({
            ...prevData,
            currPinCode: pincode
        }))
    }


    return (
        <ScrollView style={styles.mainWrapper}>
            {PopupVisible && (
          <Popup isVisible={PopupVisible} onClose={() => setIsPopupVisible(!PopupVisible)}>
            <Text style={{ fontWeight: 'bold' }}>
              {popupContent}
            </Text>
          </Popup>
        )}
            {loader && <Loader isLoading={loader} />}

            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 10,
                borderRadius: 5,
                height: 40,
                width: '90%',
                backgroundColor: colors.yellow,
                elevation: 10
            }}>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>Edit your details below</Text>
            </View>
            <View style={styles.detailsContainer}>
                <InputField
                    label='Service Technician Name'
                    value={postData?.name}
                    disabled={true}
                />
                <InputField
                    label={t('strings:contact_number')}
                    value={postData?.contactNo}
                    disabled={true}
                />
                <Text style={styles.subHeading}>{t('strings:permanent_address')}</Text>
                <InputField
                    label={t('strings:lbl_permanent_address_mandatory')}
                    value={postData?.permanentAddress}
                    onChangeText={(text) => handleInputChange(text, 'permanentAddress')}
                />
                <InputField
                    label={t('strings:lbl_street_locality')}
                    value={postData?.streetAndLocality}
                    onChangeText={(text) => handleInputChange(text, 'streetAndLocality')}
                />
                <InputField
                    label={t('strings:lbl_landmark')}
                    value={postData?.landmark}
                    onChangeText={(text) => handleInputChange(text, 'landmark')}
                />
                <Text style={{ color: colors.black, fontWeight: 'bold', marginBottom: 2 }}>{'Pincode'}</Text>
                <DropDownPicker
                    mode="BADGE"
                    showBadgeDot={true}
                    searchable={true}
                    searchPlaceholder='Search Your Pincode'
                    loading={loader}
                    placeholder={postData?.pinCode === null ? 'Search Pincode' : `${postData?.pinCode || ""}`}
                    searchablePlaceholder="Search Pincode"
                    searchTextInputProps={{
                        maxLength: 6,
                        keyboardType: "number-pad"
                    }}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{ nestedScrollEnabled: true, decelerationRate: "fast" }}
                    open={uiSwitch.pincode}
                    items={pincode_suggestions.map((item) => ({
                        label: item.pinCode,
                        value: item.pinCode,
                    }
                    ))}
                    setOpen={() => setUIswitch({ pincode: !uiSwitch.pincode })}
                    value={postData?.pinCode}
                    onSelectItem={(item) => {
                        // console.log(item)
                        processPincode(`${item.value}`, 'permanent')
                    }}
                    onChangeSearchText={(text) => processPincode(text, 'permanent')}
                    dropDownContainerStyle={{
                        height: height / 5,
                        borderWidth: 2,
                        borderColor: colors.grey,
                        elevation: 0,
                        backgroundColor: "white",
                    }}
                    style={{
                        backgroundColor: 'white',
                        elevation: 0,
                        opacity: 0.9,
                        borderWidth: 2,
                        height: height / 15,
                        borderColor: colors.grey,
                        marginBottom: 20,
                        borderRadius: 5
                    }}
                />
                <PickerField
                    label={t('strings:lbl_state')}
                    disabled={false}
                    selectedValue={postData?.state}
                    onValueChange={(text: string) => handleStateSelect(text, "permanent")}
                    items={states?.map(state => ({ label: state.stateName, value: state.stateName }))}
                />
                <PickerField
                    label={t('strings:district')}
                    disabled={false}
                    selectedValue={postData?.dist}
                    onValueChange={(text: string) => handleDistrictSelect(text, "permanent")}
                    items={districts?.map(district => ({ label: district.districtName, value: district.districtName }))}
                />
                <PickerField
                    label={t('strings:city')}
                    disabled={false}
                    selectedValue={postData?.city}
                    onValueChange={(text: string) => handleCitySelect(text, "permanent")}
                    items={cities?.map(city => ({ label: city.cityName, value: city.cityName }))}
                />
                <InputField
                    label={t('strings:aadhar_card_no')}
                    value={postData?.kycDetails?.aadharOrVoterOrDlNo}
                    onChangeText={(text) => handleInputChange(text, 'kycDetails.aadharOrVoterOrDlNo')}
                    numeric
                    maxLength={12}
                />
                <ImagePickerField label='Aadhar Card* (Front)'
                    onImageChange={handleImageChange}
                    imageRelated='ID_CARD_FRONT'
                    initialImage={postData?.kycDetails?.aadharOrVoterOrDLFront}
                    getImageRelated='IdCard'
                />
                <ImagePickerField label='Aadhar Card* (Back)'
                    onImageChange={handleImageChange}
                    imageRelated="ID_CARD_BACK"
                    initialImage={postData?.kycDetails?.aadharOrVoterOrDlBack}
                    getImageRelated='IdCard'
                />
                <ImagePickerField label='Pan Card* (Front)'
                    onImageChange={handleImageChange}
                    imageRelated="PAN_CARD_FRONT"
                    initialImage={postData?.kycDetails?.panCardFront}
                    getImageRelated='PanCard'
                />
                <InputField
                    label={t('strings:update_pan_number_manually')}
                    value={postData?.kycDetails?.panCardNo}
                    onChangeText={(text) => handleInputChange(text, 'kycDetails.panCardNo')}
                />

                <View style={styles.button}>
                    <Buttons
                        label={'Skip KYC'}
                        variant="blackButton"
                        onPress={() => skipKyc()}
                        width="100%"
                    />
                </View>
                <View style={styles.button}>
                    <Buttons
                        label={t('strings:preview')}
                        variant="filled"
                        onPress={() => InitiatePreview()}
                        width="100%"
                    />
                </View>
            </View>
            {isPopupVisible && (
                <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
                    {popupContent}
                </Popup>
            )}
            {isSkipPopupVisible && (
                <Popup isVisible={isSkipPopupVisible} onClose={handleSkip}>
                    {popupSkipContent}
                </Popup>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center'
    },
    subHeading: {
        color: colors.grey,
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        marginBottom: 30
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
    reasons: {
        borderWidth: 1,
        borderColor: colors.grey,
        padding: 10,
        borderRadius: 5
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
});

export default NewLoginKyc;
