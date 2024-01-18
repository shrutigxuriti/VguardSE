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
import ImagePickerField from '../../../../../components/ImagePickerField';
import Loader from '../../../../../components/Loader';

type BankProps = {};

const Bank: React.FC<BankProps> = () => {
  const { t } = useTranslation();
  const [select, setSelect] = useState<string | null>(null);
  const [accNo, setAccNo] = useState<string>('');
  const [accHolder, setAccHolder] = useState<string>('');
  const [accType, setAccType] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');
  const [entityUid, setEntityUid] = useState<string>('');
  const [availableBanks, setAvailableBanks] = useState<string[]>([]);
  const [popupContent, setPopupContent] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loader, showLoader] = useState(false);
  const [fileData, setFileData] = useState({
    uri: "",
    name: "",
    type: ""
  });

  useEffect(() => {
    showLoader(true);

    const getBankDetailsAndCallFileUri = async () => {
      try {
        const response = await getany();
        if (response.status === 200) {
          const data = await response.json();
          console.log(data, '<><<error message<><>');
          setAccHolder(data.bankAccHolderName);
          setAccType(data.bankAccType);
          setBankName(data.bankNameAndBranch);
          setIfscCode(data.bankIfsc);
          setAccNo(data.bankAccNo);
          setEntityUid(data.checkPhoto);

          if (data.errorMessage) {
            setPopupContent(data.errorMessage);
            setPopupVisible(true);
          }
          showLoader(false);
        } else {
          showLoader(false);
          throw new Error('Failed to get bank details');
        }
      } catch (error) {
        showLoader(false);
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


  const handleProceed = () => {
    showLoader(true);
    triggerApiWithImage(fileData)
      .then((uuid) => {
        const imageUid = uuid;
        const postData = {
          bankAccNo: accNo,
          bankAccHolderName: accHolder,
          bankAccType: accType,
          bankNameAndBranch: bankName,
          bankIfsc: ifscCode,
          checkPhoto: imageUid,
        };

        console.log("POSTDATA", postData);

        if (
          postData.bankAccNo !== "" &&
          postData.bankAccHolderName !== "" &&
          postData.bankAccType !== "" &&
          postData.bankNameAndBranch !== "" &&
          postData.bankIfsc !== "" &&
          postData.checkPhoto !== ""
        ) {
          updateBank(postData)
            .then(response => {
              if (response.status === 200) {
                showLoader(false);
                return response.json();
              } else {
                showLoader(false);
                setPopupContent("Failed to update Bank Details");
              }
            })
            .then(data => {
              showLoader(false);
              setPopupContent(data.message);
              setPopupVisible(true);
            })
            .catch(error => {
              showLoader(false);
              console.error('API Error:', error);
              setPopupContent("An error occurred");
              setPopupVisible(true);
            });
        } else {
          showLoader(false);
          setPopupContent("Enter all the details");
          setPopupVisible(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setPopupContent("An error occurred");
        setPopupVisible(true);
      });
  };



  const handleImageChange = async (image: string, type: string, imageName: string, label: string) => {
    try {
      setFileData({
        uri: image,
        name: imageName,
        type: type
      })
    } catch (error) {
      console.error('Error handling image change in Raise Ticket:', error);
    }
  };

  const triggerApiWithImage = async (fileData: { uri: string; type: string; name: string }) => {
    const formData = new FormData();
    formData.append('USER_ROLE', '2');
    formData.append('image_related', 'CHEQUE');
    formData.append('file', {
      uri: fileData.uri,
      name: fileData.name,
      type: fileData.type,
    });

    console.log("formData=====", formData);

    try {
      const response = await sendFile(formData);
      console.log("response-----------", response.data.entityUid);
      const image = response.data.entityUid
      setEntityUid(image);
      return response.data.entityUid;
    } catch (error) {
      setPopupContent("Error uploading image");
      setPopupVisible(true)
      console.error('API Error:', error);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loader && <Loader isLoading={loader} />}

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
                'strings:lbl_account_number',
              )}
              placeholderTextColor={colors.grey}
              value={accNo}
              onChangeText={(value) => setAccNo(value)}
              keyboardType='numeric'
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
          {/* <View style={styles.inputContainer}>
            <Picker
              selectedValue={accType}
              onValueChange={(itemValue) => setAccType(itemValue)}
              style={styles.picker}>
              <Picker.Item label={t('strings:select_account_type')} value={''} />
              <Picker.Item label={t('strings:account_type:saving')} value={'Saving'} />
              <Picker.Item label={t('strings:account_type:current')} value={'Current'} />
            </Picker>
          </View> */}
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
            <ImagePickerField label={t('strings:cancelled_cheque_copy')}
              onImageChange={handleImageChange}
              imageRelated='CHEQUE'
              initialImage={entityUid}
              getImageRelated = 'Cheque'
            />
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
    borderRadius: 5,
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
