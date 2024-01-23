import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useTransition} from 'react';
import colors from '../../../../../../../colors';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useTranslation} from 'react-i18next';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Buttons from '../../../../../../components/Buttons';
import arrowIcon from '../../../../../../assets/images/arrow.png';
import {sendCustomerData, sendFile} from '../../../../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomerData} from '../../../../../../utils/modules/CustomerData';
import {Props} from 'react-native-paper';
import RewardBox from '../../../../../../components/ScratchCard';
import Popup from '../../../../../../components/Popup';
import getLocation from '../../../../../../utils/geolocation';
import Loader from '../../../../../../components/Loader';

const AddWarranty = ({navigation}) => {
  const {t} = useTranslation();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [qrcode, setQrcode] = useState('1234567890');
  const [skuDetails, setSkuDetails] = useState('VS-400');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [loader, showLoader] = useState(true);
  const [scratchCardProps, setScratchCardProps] = useState({
    rewardImage: {
      width: 100,
      height: 100,
      resourceLocation: require('../../../../../../assets/images/ic_rewards_gift.png') /*resourceUrl:"https://www.leavesofgrassnewyork.com/cdn/shop/products/gift-card_612x.jpg?v=1614324792"*/,
    },
    rewardResultText: {
      color: 'black',
      fontSize: 16,
      textContent: 'YOU WON',
      fontWeight: '700',
    },
    text1: {color: 'black', fontSize: 16, textContent: '', fontWeight: '700'},
    text2: {
      color: 'black',
      fontSize: 16,
      textContent: 'POINTS',
      fontWeight: '700',
    },
    text3: {
      color: '#9c9c9c',
      fontSize: 12,
      textContent: ' ',
      fontWeight: '700',
    },
    button: {
      buttonColor: '#F0C300',
      buttonTextColor: 'black',
      buttonText: '',
      buttonAction: () => {},
      fontWeight: '400',
    },
    textInput: false,
  });
  const [popupContent, setPopupContent] = useState('');

  const [scratchCard, setScratchCard] = useState(false);
  const [scratchable, setScratchable] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(null);
  const [selectedBillImage, setSelectedBillImage] = useState(null);
  const [selectedBillImageName, setSelectedBillImageName] = useState('');
  const [selectedWarrantyImage, setSelectedWarrantyImage] = useState(null);
  const [selectedWarrantyImageName, setSelectedWarrantyImageName] =
    useState('');
  const [couponResponse, setCouponResponse] = useState(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerData>();
  const [imageType, setImageType] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US');
    setPurchaseDate(formattedDate);
    AsyncStorage.getItem('COUPON_RESPONSE').then(r => {
     
      setCouponResponse(JSON.parse(r));
      setQrcode(JSON.parse(r).copuonCode);
      setSkuDetails(JSON.parse(r).skuDetail);
      AsyncStorage.getItem('CUSTOMER_DETAILS').then(r => {
    
        setCustomerDetails(JSON.parse(r));
      });
    });
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    getLocation()
      .then(position => {
        if (position != null) {
          setLatitude(position.latitude.toString());
          setLongitude(position.longitude.toString());
          showLoader(false);
        } else {
          console.log('Position is undefined or null');
        }
      })
      .catch(error => {
        console.error('Error getting location:', error);
      });
  };

  const handleImagePickerPress = (type: React.SetStateAction<string>) => {
    setImageType(type);
    setShowImagePickerModal(true);
  };

  const handleCameraUpload = () => {
    setShowImagePickerModal(false);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
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
          if (imageType == 'bill') {
            setSelectedBillImage(response.assets[0]);
            setSelectedBillImageName(response.assets[0].fileName);
          } else if (imageType == 'warranty') {
            setSelectedWarrantyImage(response.assets[0]);
            setSelectedWarrantyImageName(response.assets[0].fileName);
          }
          //triggerApiWithImage(fileData);
        }
      },
    );
  };
  const handleGalleryUpload = () => {
    console.log('Image type==============', imageType);

    setShowImagePickerModal(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
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
          if (imageType == 'bill') {
            setSelectedBillImage(response.assets[0]);
            setSelectedBillImageName(response.assets[0].fileName);
          } else if (imageType == 'warranty') {
            setSelectedWarrantyImage(response.assets[0]);
            setSelectedWarrantyImageName(response.assets[0].fileName);
          }
          //triggerApiWithImage(fileData);
        }
      },
    );
  };
  const triggerApiWithImage = async (
    fileData: {uri: any; type: any; fileName: any} | null,
    documentType: string,
  ) => {
    const formData = new FormData();
    formData.append('USER_ROLE', 2);

    formData.append('file', {
      uri: fileData.uri,
      type: fileData.type,
      name: fileData.fileName,
    });

    if (documentType == 'bill') {
      formData.append('image_related', 'BILL');
    } else if (documentType == 'warranty') {
      formData.append('image_related', 'WARRANTY');
    }

    try {
      const response = await sendFile(formData);
      if (imageType == 'bill') {
        setSelectedBillImageName(response.data.entityUid);
        console.log(response.data.entityUid)
        return response.data.entityUid;
      }
      if (imageType == 'warranty') {
        setSelectedWarrantyImageName(response.data.entityUid);
        console.log(response.data.entityUid)
        return response.data.entityUid;
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  async function saveData() {
    if (!customerDetails?.contactNo) {
      ToastAndroid.show(
        t('strings:enter_mandatory_fields'),
        ToastAndroid.SHORT,
      );
      return;
    }
    if (
      selectedBillImage == null &&
      couponResponse.anomaly == 1 &&
      customerDetails.dealerCategory != 'Sub-Dealer'
    ) {
      ToastAndroid.show(
        t('strings:enter_mandatory_fields'),
        ToastAndroid.SHORT,
      );
      return;
    }
    const bill = await triggerApiWithImage(selectedBillImage, 'bill');
    const warranty = await triggerApiWithImage(
      selectedWarrantyImage,
      'warranty',
    );
    console.log("<><<<><><<>")
    const postData = {
      contactNo: customerDetails.contactNo,
      name: customerDetails.name,
      email: customerDetails.email,
      alternateNo: customerDetails.alternateNo,
      city: customerDetails.city,
      district: customerDetails.district,
      state: customerDetails.state,
      pinCode: customerDetails.pinCode,
      landmark: customerDetails.landmark,
      dealerCategory: customerDetails.dealerCategory,
      currAdd: customerDetails.currAdd,
      dealerName: customerDetails.dealerName,
      dealerAdd: customerDetails.dealerAdd,
      dealerPinCode: customerDetails.dealerPinCode,
      dealerState: customerDetails.dealerState,
      dealerDist: customerDetails.dealerDist,
      dealerCity: customerDetails.dealerCity,
      addedBy: customerDetails.addedBy,
      dealerNumber: customerDetails.dealerNumber,
      transactId: '',
      billDetails: selectedBillImageName,
      warrantyPhoto: selectedWarrantyImageName,
      sellingPrice: sellingPrice,
      emptStr: '',
      cresp: {
        custIdForProdInstall: '',
        modelForProdInstall: '',
        errorCode: couponResponse?.errorCode,
        errorMsg: couponResponse?.errorMsg,
        statusType: '',
        balance: '',
        currentPoints: '',
        couponPoints: '',
        promotionPoints: '',
        transactId: '',
        schemePoints: '',
        basePoints: '',
        clubPoints: '',
        scanDate: '',
        scanStatus: '',
        copuonCode: '',
        bitEligibleScratchCard: '',
        pardId: '',
        partNumber: '',
        partName: '',
        couponCode: '',
        skuDetail: '',
        purchaseDate: '',
        categoryId: '',
        category: '',
        anomaly: '',
        warranty: '',
      },
      selectedProd: {
        specs: '',
        pointsFormat: '',
        product: '',
        productName: '',
        productCategory: '',
        productCode: '',
        points: '',
        imageUrl: '',
        userId: '',
        productId: '',
        paytmMobileNo: '',
      },
      latitude: latitude,
      longitude: longitude,
      geolocation: '',
    };
    console.log("POST DATA")
    const response = await sendCustomerData(postData);
    const result = await response.data;
    console.log("RESPONSE<><><><", result);
    if (result.errorCode == 1) {
      var couponPoints = result.couponPoints;
      var basePoints = result.basePoints;
      // var couponPoints = "100";
      // var basePoints = "200";
      basePoints ? (basePoints = `Base Points: ${basePoints}`) : null;

      console.log('COUPON POINTS:===', couponPoints);
      console.log('BASE POINTS:========', basePoints);
      setScratchCardProps({
        rewardImage: {
          width: 100,
          height: 100,
          resourceLocation: require('../../../../../../assets/images/ic_rewards_gift.png'),
        },
        rewardResultText: {
          color: colors.black,
          fontSize: 16,
          textContent: 'YOU WON',
          fontWeight: '700',
        },
        text1: {
          color: colors.black,
          fontSize: 16,
          textContent: couponPoints,
          fontWeight: '700',
        },
        text2: {
          color: colors.black,
          fontSize: 16,
          textContent: 'POINTS',
          fontWeight: '700',
        },
        text3: {
          color: colors.grey,
          fontSize: 12,
          textContent: basePoints,
          fontWeight: '700',
        },
        button: {
          buttonColor: colors.yellow,
          buttonTextColor: colors.black,
          buttonText: 'Scan Again',
          buttonAction: () =>
            navigation.reset({index: 0, routes: [{name: 'Scan Code'}]}),
          fontWeight: '400',
        },
        textInput: false,
      });
      setScratchCard(true);
    } else {
      setPopupVisible(true);
      setPopupContent(t('strings:something_wrong'));
    }
  }
  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader />}
      <Text style={styles.heading}>Register Product</Text>
      {scratchCard && (
        <RewardBox
          scratchCardProps={scratchCardProps}
          visible={scratchCard}
          scratchable={scratchable}
          onClose={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
        />
      )}
      {isPopupVisible && (
        <Popup
          isVisible={isPopupVisible}
          onClose={() => setPopupVisible(false)}>
          {popupContent}
        </Popup>
      )}
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>{t('strings:qr_code')}</Text>
          <View style={styles.inputArea}>
            <TextInput editable={false} value={qrcode} style={styles.input} />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>{t('strings:squ_details')}</Text>
          <View style={styles.inputArea}>
            <TextInput
              editable={false}
              value={skuDetails}
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>{t('strings:bill_details')}</Text>
          <TouchableOpacity
            style={styles.inputArea}
            onPress={() => handleImagePickerPress('bill')}>
            {selectedBillImage ? (
              <TextInput
                style={styles.input}
                placeholder={selectedBillImageName}
                placeholderTextColor={colors.grey}
                editable={false}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder={t('strings:capture_bill_details')}
                placeholderTextColor={colors.grey}
                editable={false}
              />
            )}
            <View style={styles.inputImage}>
              {selectedBillImage ? (
                <Image
                  source={{uri: selectedBillImage.uri}}
                  style={{width: 30, height: 30}}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../../../../../assets/images/ic_attatchment_pin.png')}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>
            {t('strings:warranty_photo_mandatory')}
          </Text>
          <TouchableOpacity
            style={styles.inputArea}
            onPress={() => handleImagePickerPress('warranty')}>
            {selectedWarrantyImage ? (
              <TextInput
                style={styles.input}
                placeholder={selectedWarrantyImageName}
                placeholderTextColor={colors.grey}
                editable={false}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder={t('strings:capture_warranty_details')}
                placeholderTextColor={colors.grey}
                editable={false}
              />
            )}
            <View style={styles.inputImage}>
              {selectedWarrantyImage ? (
                <Image
                  source={{uri: selectedWarrantyImage.uri}}
                  style={{width: 30, height: 30}}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../../../../../assets/images/ic_attatchment_pin.png')}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>{t('strings:selling_price')}</Text>
          <View style={styles.inputArea}>
            <TextInput
              editable
              onChangeText={text => setSellingPrice(text)}
              value={sellingPrice}
              style={styles.input}
              placeholder={t('strings:enter_selling_price')}
              placeholderTextColor={colors.grey}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>
            {t('strings:purchase_date_mandatory')}
          </Text>
          <View style={styles.inputArea}>
            <TextInput
              editable={false}
              value={purchaseDate}
              style={styles.input}
            />
            <Image
              style={{width: 20, height: 20}}
              source={require('../../../../../../assets/images/calendar.png')}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <Buttons
            style={styles.button}
            label={t('strings:add_customer_details')}
            variant="filled"
            onPress={() => saveData()}
            width="100%"
            iconHeight={10}
            iconWidth={30}
            iconGap={30}
            icon={arrowIcon}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImagePickerModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Button title="Launch Camera" onPress={handleCameraUpload} />
            <Button title="Choose from Gallery" onPress={handleGalleryUpload} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 15,
    backgroundColor: colors.white,
  },
  heading: {
    color: colors.black,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: colors.black,
  },
  inputArea: {
    borderColor: colors.lightGrey,
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    color: colors.black,
    paddingHorizontal: 10,

    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRow: {
    marginTop: 15,
  },
  input: {
    color: 'black',
    width: '90%',
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
});

export default AddWarranty;
