import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import { CustomTabHeader } from '../../common/services/BottomTab';
import LanguagePicker from '../../../components/LanguagePicker';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../../../colors';
import AddSubLogin from '../pages/AddSubLogin';
import ViewSubLogins from '../pages/ViewSubLogins';

const ProfileStack: React.FC = () => {
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleLanguageButtonPress = () => {
    console.log("handleLanguageButtonPress...........")
    setShowLanguagePicker(true);
  };

  const handleCloseLanguagePicker = () => {
    setShowLanguagePicker(false);
  };
  const Stack = createNativeStackNavigator();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.yellow,
          },
          headerShown: false,
        }}>
        <Stack.Screen name="Profile" component={Profile}
          options={({ route }) => ({
            headerBackVisible: false,
            headerTitle: () => <CustomTabHeader handleLanguageButtonPress={handleLanguageButtonPress} route={route} />,
            headerShown: true,

          })} />
        <Stack.Screen name="Edit Profile" component={EditProfile}
          options={{
            headerShown: true,
            headerRight: () => (
              <Image
                style={{ width: 70, height: 50 }} // Adjust width and height as needed
                resizeMode="contain"
                source={require('../../../assets/images/group_910.png')}
              />),
          }} />
        <Stack.Screen name="Add Sub-Login" component={AddSubLogin}
          options={{
            headerShown: true,
          }} />
        <Stack.Screen name="View All Logins" component={ViewSubLogins}
          options={{
            headerShown: true,
          }} />
      </Stack.Navigator>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguagePicker}
        onRequestClose={handleCloseLanguagePicker}
      >
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

export default ProfileStack;
