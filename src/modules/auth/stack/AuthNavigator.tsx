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
import NewLogin from '../pages/NewLogin';
import SetPassword from '../pages/SetPassword';
import NewLoginKyc from '../pages/NewLoginKyc';
import PreviewNewKyc from '../pages/PreviewNewKyc';


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
      <Stack.Screen name="newLogin" component={NewLogin} options={{ headerShown: false }} />
      <Stack.Screen name="setPassword" component={SetPassword} options={{ headerShown: false }} />
      <Stack.Screen name="newLoginKyc" component={NewLoginKyc} options={{ headerShown: false }} />
      <Stack.Screen name="previewNewKyc" component={PreviewNewKyc} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeStack} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
