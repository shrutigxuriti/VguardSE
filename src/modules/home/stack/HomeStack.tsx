/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import HomeScreen from '../pages/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colors from '../../../../colors';
import {CustomTabHeader} from '../../common/services/BottomTab';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LanguagePicker from '../../../components/LanguagePicker';
import ProfileStack from '../../profile/stack/ProfileStack';
import ScanStack from '../pages/options/scanQR/stack/ScanStack';
import RedeemStack from '../pages/options/redeemPoints/stack/RedeemStack';
import DashboardStack from '../pages/options/dashboard/stack/DashboardStack';
import SchemesStack from '../pages/options/schemes/stack/SchemesStack';
import InfoStack from '../pages/options/info/stack/InfoStack';
import NewStack from '../pages/options/new/stack/NewStack';
import TicketStack from '../pages/options/ticket/stack/TicketStack';
import Bank from '../pages/options/bank/Bank';
import TDS from '../pages/options/TDS/TDS';
import Engagement from '../pages/options/engagement/Engagement';
import TDSStatement from '../pages/options/TDSStatement/TDSStatement';
import UpdatePAN from '../pages/options/pan/UpdatePAN';
import AirCoolerStack from '../pages/options/airCooler/stack/AirCoolerStack';
import RedemptionHistory from '../pages/options/redeemPoints/RedemptionHistory';
import UniqueCodeHistory from '../pages/options/scanQR/pages/UniqueCodeHistory';

const HomeStack: React.FC = () => {
  type HomeStackParams = {
    Home: undefined;
    'Scan QR': undefined;
    Dashboard: undefined;
    'Redeem Products': undefined;
    'Update KYC': undefined;
    schemes: undefined;
    info: undefined;
    new: undefined;
    ticket: undefined;
    'Update Bank': undefined;
    'TDS Certificate': undefined;
    'TDS Statement': undefined;
    'Update PAN': undefined;
    'Air Cooler': undefined;
    Engagement: undefined;
    Profile: undefined;
    'Unique Code History': undefined;
    'Redemption History': undefined;
  };

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleLanguageButtonPress = () => {
    console.log('handleLanguageButtonPress...........');
    setShowLanguagePicker(true);
  };

  const handleCloseLanguagePicker = () => {
    setShowLanguagePicker(false);
  };

  const Stack = createNativeStackNavigator<HomeStackParams>();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.yellow,
          },
          headerShown: false,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({route}) => ({
            headerTitle: () => (
              <CustomTabHeader
                handleLanguageButtonPress={handleLanguageButtonPress}
                route={route}
              />
            ),
            headerShown: true,
          })}
        />
        <Stack.Screen name="Scan QR" component={ScanStack} />
        <Stack.Screen name="Redeem Products" component={RedeemStack} />
        <Stack.Screen name="Dashboard" component={DashboardStack} />
        <Stack.Screen name="schemes" component={SchemesStack} />
        <Stack.Screen name="info" component={InfoStack} />
        <Stack.Screen name="new" component={NewStack} />
        <Stack.Screen name="ticket" component={TicketStack} />
        <Stack.Screen name="Air Cooler" component={AirCoolerStack} />
        <Stack.Screen
          name="Redemption History"
          component={RedemptionHistory}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Unique Code History"
          component={UniqueCodeHistory}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Update PAN"
          component={UpdatePAN}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}}
                resizeMode="contain"
                source={require('../../../assets/images/group_910.png')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Update Bank"
          component={Bank}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}}
                resizeMode="contain"
                source={require('../../../assets/images/group_910.png')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="TDS Certificate"
          component={TDS}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}}
                resizeMode="contain"
                source={require('../../../assets/images/group_910.png')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Engagement"
          component={Engagement}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}}
                resizeMode="contain"
                source={require('../../../assets/images/group_910.png')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="TDS Statement"
          component={TDSStatement}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{width: 70, height: 50}}
                resizeMode="contain"
                source={require('../../../assets/images/group_910.png')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguagePicker}
        onRequestClose={handleCloseLanguagePicker}>
        <View style={styles.languagePickerContainer}>
          <LanguagePicker onCloseModal={handleCloseLanguagePicker} />
          <TouchableOpacity onPress={handleCloseLanguagePicker}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    borderWidth: 1,
    borderColor: colors.black,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languagePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  closeText: {
    marginTop: 20,
    color: colors.black,
    backgroundColor: colors.yellow,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },
});

export default HomeStack;
