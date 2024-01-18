import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/LoginScreen';
import HomeStack from '../../home/stack/HomeStack';
import SplashScreen from '../pages/SplashScreen';
import ForgotPassword from '../pages/ForgotPassword';
import LoginWithNumber from '../pages/LoginWithNumber';
import LoginWithOtp from '../pages/LoginWithOtp';
import ReUpdateKycOTP from '../pages/ReUpdateKycOTP';
import ReUpdateKyc from '../pages/ReUpdateKyc';
import ReUpdateKycPreview from '../pages/ReUpdateKycPreview';


const AuthNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="forgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <Stack.Screen name="loginWithNumber" component={LoginWithNumber} options={{ headerShown: false }} />
      <Stack.Screen name="loginwithotp" component={LoginWithOtp} options={{ headerShown: false }} />
      <Stack.Screen name="updatekyc" component={ReUpdateKycOTP} options={{ headerShown: false }} />
      <Stack.Screen name="ReUpdateKyc" component={ReUpdateKyc} options={{ headerShown: false }} />
      <Stack.Screen name="PreviewReUpdateKyc" component={ReUpdateKycPreview} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeStack} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
