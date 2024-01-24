import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../../../../../colors';
import NeedHelp from '../../../../../components/NeedHelp';
import Buttons from '../../../../../components/Buttons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendTicket, getTicketTypes } from '../../../../../utils/apiservice';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getFile, sendFile } from '../../../../../utils/apiservice';
import Snackbar from 'react-native-snackbar';
import { height, width } from '../../../../../utils/dimensions';
import { Button } from 'react-native-paper';
import Popup from '../../../../../components/Popup';
import ImagePickerField from '../../../../../components/ImagePickerField';
import { getImageUrl } from '../../../../../utils/FileUtils';
import Loader from '../../../../../components/Loader';

const Ticket: React.FC<{ navigation: any }> = ({ navigation }) => {
  const baseURL =
    'https://www.vguardrishta.com/img/appImages/Profile/';

  const { t } = useTranslation();

  const [userData, setUserData] = useState({
    userName: '',
    userId: '',
    userCode: '',
    userImage: '',
    userRole: '',
  });

  const [profileImage, setProfileImage] = useState("");

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);
  const [entityUid, setEntityUid] = useState('');
  const [fileData, setFileData] = useState({
    uri: "",
    name: "",
    type: ""
  })
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [loader, showLoader] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('USER').then((r) => {
      const user = JSON.parse(r);
      const data = {
        userName: user.name,
        userCode: user.userCode,
        pointsBalance: user.pointsSummary.pointsBalance,
        redeemedPoints: user.pointsSummary.redeemedPoints,
        userImage: user.kycDetails.selfie,
        userRole: user.professionId,
        userId: user.contactNo
      };
      setUserData(data);
    });
    getTicketTypes()
      .then((response) => response.data)
      .then((data) => {
        setOptions(data);
        showLoader(false);
        setIsOptionsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
        setIsOptionsLoading(false);
      });
  }, []);

  useEffect(() => {
    const getImage = async () => {
      try {
        const profileImageUrl = await getImageUrl(userData.userImage, 'Profile');
        setProfileImage(profileImageUrl);
      } catch (error) {
        console.log('Error while fetching profile image:', error);
      }
    };

    getImage();
  }, [userData.userImage]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const openTnC = () => {
    Linking.openURL('https://vguardrishta.com/tnc_retailer.html');
  };

  const openFaqS = () => {
    Linking.openURL(
      'https://vguardrishta.com/frequently-questions-retailer.html',
    );
  };

  // const handleSubmission = async () => {
  //   const postData = {
  //     userId: userData.userId,
  //     issueTypeId: selectedOption,
  //     imagePath: entityUid,
  //     description: descriptionInput,
  //   };

  //   console.log("Post Data========", postData)

  //   if (postData.userId != '' && postData.issueTypeId != '' && postData.description != '') {
  //     sendTicket(postData)
  //       .then((response) => {
  //         if (response.status === 200) {
  //           setSelectedOption('');
  //           setEntityUid('');
  //           setDescriptionInput('');
  //           setPopupContent('Ticket Created Successfully');
  //           setPopupVisible(true);
  //         } else {
  //           setPopupContent('Failed to create ticket');
  //           setPopupVisible(true);
  //           throw new Error('Failed to create ticket');
  //         }
  //       })
  //       .catch((error) => {
  //         setPopupContent('Failed to create ticket');
  //         setPopupVisible(true);
  //         console.error('API Error:', error);
  //       });
  //   }
  //   else {
  //     setPopupContent('Enter All Details');
  //     setPopupVisible(true);
  //   }
  // };


  const handleSubmission = async () => {
    showLoader(true);
    let imageUrl = await triggerApiWithImage(fileData);
    const postData = {
      userId: parseInt(userData.userId, 10),
      issueTypeId: selectedOption.toString(),
      imagePath: imageUrl,
      description: descriptionInput,
    };
    console.log("Post Data========", postData)
    if (postData.userId != null && postData.issueTypeId != '') {
      sendTicket(postData)
        .then((response) => {
          console.log("RESPONSE", response)
          if (response.status === 200) {
            console.log(response.data, " :<<>><<");
            setSelectedOption('');
            setEntityUid('');
            setDescriptionInput('');
            setPopupVisible(true);
            setPopupContent(response.data.message);
            showLoader(false);
          } else {
            setPopupContent('Failed to create ticket');
            setPopupVisible(true);
            showLoader(false);
            throw new Error('Failed to create ticket');
          }
        })
        .catch((error) => {
          setPopupContent('Failed to create ticket');
          setPopupVisible(true);
          console.error('API Error:', error);
        });
    }
    else {
      setPopupContent('Enter All Details');
      setPopupVisible(true);
    }
  }
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
    if (fileData.uri != "") {
      const formData = new FormData();
      formData.append('userRole', '1');
      formData.append('image_related', 'Ticket');
      formData.append('file', {
        uri: fileData.uri,
        name: fileData.name,
        type: fileData.type,
      });
      try {
        const response = await sendFile(formData);
        setEntityUid(response.data.entityUid);
        return response.data.entityUid;
      } catch (error) {
        setPopupContent("Error uploading image");
        setPopupVisible(true)
        console.error('API Error:', error);
      }
    }
    return "";
  };


  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader isLoading={loader} />}
      <View style={styles.flexBox}>
        <View style={styles.profileDetails}>
          <View style={styles.ImageProfile}>
            <ImageBackground
              source={require('../../../../../assets/images/ic_v_guards_user.png')}
              style={{ width: '100%', height: '100%', borderRadius: 100 }}
              resizeMode='contain'
            >
              <Image
                source={{ uri: profileImage }}
                style={{ width: '100%', height: '100%', borderRadius: 100 }}
                resizeMode='contain'
              />
            </ImageBackground>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.textDetail}>{userData.userName}</Text>
            <Text style={styles.textDetail}>{userData.userCode}</Text>
          </View>
        </View>
        <TouchableHighlight
          style={styles.button}
          onPress={() => navigation.navigate('Ticket History')}
        >
          <Text style={styles.buttonText}>
            {t('strings:ticket_history')}
          </Text>
        </TouchableHighlight>
      </View>
      <Text style={[styles.blackText, { marginTop: responsiveFontSize(2) }]}>{t('strings:issue_type')}</Text>
      {isOptionsLoading ? (
        <Text style={styles.blackText}>Loading options...</Text>
      ) : options.length === 0 ? (
        <Text style={styles.blackText}>No options available.</Text>
      ) : (
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={handleOptionChange}
            style={styles.picker}
            label={t('strings:select_ticket_type')}
          >
            <Picker.Item
              key={''}
              label={'Select Issue Type'}
              value={''}
            />
            {options.map((option) => (
              <Picker.Item
                key={option.issueTypeId}
                label={option.name}
                value={option.issueTypeId}
              />
            ))}
          </Picker>
        </View>
      )}
      <ImagePickerField label='Upload Picture (optional)'
        onImageChange={handleImageChange}
        imageRelated='TICKET'
      />
      <Text style={styles.blackText}>{t('strings:description_remarks')}</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder={t('strings:provide_description_in_the_box')}
        placeholderTextColor={colors.grey}
        multiline={true}
        textAlignVertical="top"
        value={descriptionInput}
        onChangeText={(text) => setDescriptionInput(text)}
      />

      <Buttons
        label={t('strings:submit')}
        variant="filled"
        onPress={handleSubmission}
        width="100%"
      />
      <View style={styles.footerRow}>
        <View style={styles.hyperlinks}>
          <TouchableOpacity style={styles.link} onPress={openTnC}>
            <Image
              style={{
                height: 30,
                width: 30
              }}
              resizeMode='contain'
              source={require('../../../../../assets/images/ic_tand_c.png')} />
            <Text style={styles.linkText}>
              {t('strings:terms_and_conditions')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={openFaqS}>
            <Image
              style={{
                height: 30,
                width: 30
              }}
              resizeMode='contain'
              source={require('../../../../../assets/images/ic_faq.png')} />
            <Text style={styles.linkText}>
              {t('strings:frequently_asked_quetions_faq')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <NeedHelp />
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
  footer: {
    marginBottom: 40
  },
  picker: {
    color: colors.black,
    // backgroundColor: colors.grey,
    height: responsiveHeight(5),
    width: '100%',
    fontSize: responsiveFontSize(1.5)
  },
  mainWrapper: {
    padding: 15,
    flexGrow: 1,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    fontSize: responsiveFontSize(1.7),
  },
  ImageProfile: {
    height: 50,
    width: 50,
    borderRadius: 100
  },
  textDetail: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7)
  },
  buttonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5)
  },
  button: {
    backgroundColor: colors.yellow,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,
    borderRadius: 5
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
    marginVertical: responsiveHeight(1)
  },
  input: {
    width: '90%',
    padding: 10,
    fontSize: responsiveFontSize(1.8),
    color: colors.black,
    fontWeight: 'bold'
  },
  descriptionInput: {
    width: '100%',
    height: responsiveHeight(20),
    borderColor: colors.lightGrey,
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    fontSize: responsiveFontSize(1.8),
    color: colors.black,
    fontWeight: 'bold',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(2)
  },
  inputImage: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
    marginRight: 5
  },
  blackText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  hyperlinks: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '40%',
    marginRight: 25,
    marginTop: responsiveHeight(1)
  },
  footerRow: {
    flexDirection: 'row'
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.7)
  },
  link: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5
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

})

export default Ticket