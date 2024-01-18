import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/components/AuthContext';
import AppNavigator from './src/components/AppNavigator';
import { Alert, Linking, PermissionsAndroid } from 'react-native';
import notificationListener from './src/modules/notifications/pages/PushNotification';
import ProductRegistrationForm from './src/modules/home/pages/options/scanQR/pages/ProductRegistrationForm';
import Test from './src/modules/home/pages/options/scanQR/pages/AddWarranty';
import AddWarranty from './src/modules/home/pages/options/scanQR/pages/AddWarranty';
import { getAppVersion } from './src/utils/apiservice';
// import { checkVersion } from "react-native-check-version";
import DeviceInfo from 'react-native-device-info';
const App: React.FC = () => {
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    // requestCameraPermission();
    requestAllPermissions();
    notificationListener();
    checkAppVersion();
  }, []);
  async function requestAllPermissions() {
    try {
      const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA;
      const contactPermission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
      const notificationPermission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      const locationPermission =
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;

      const granted = await PermissionsAndroid.requestMultiple([
        cameraPermission,
        contactPermission,
        locationPermission,
        notificationPermission
      ]);

      if (
        granted[cameraPermission] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[contactPermission] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[locationPermission] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Camera, contact and location permissions granted.');
        // You can now use the camera, access contacts, and access the device's location.
      } else {
        Alert.alert(
          'Permission denied',
          'You must grant camera, contact, and location permissions to use this feature.',
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  }

  async function checkAppVersion() {
    try {
      const buildVersion = DeviceInfo.getVersion();
      const latestAppVersion = await getAppVersion();

      const isUpdateRequired = parseFloat(buildVersion) > parseFloat(latestAppVersion.data);
      if (isUpdateRequired) {
        showMandatoryUpdateAlert();
      }
    } catch (error) {
      console.error('Error checking app version:', error);
    }
  }


  async function showMandatoryUpdateAlert() {
    Alert.alert(
      'Update Required',
      'A new version of the app is available. Please update to continue using the app.',
      [
        {
          text: 'Update Now',
          onPress: () => {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.tfl.vguardretailer&hl=en_IN&gl=US');
          },
        },
      ],
      { cancelable: false }
    );
  }


  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
