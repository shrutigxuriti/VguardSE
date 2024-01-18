import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../../../../../../../colors';
import Dashboard from '../Dashboard';
import ProductWiseEarning from '../ProductWiseEarning';
import SchemeWiseEarning from '../SchemeWiseEarning';
import YourRewards from '../YourRewards';
import { Image } from 'react-native';

const DashboardStack: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.yellow,
        },
        headerShown: false,
      }}>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: true,
          headerRight: () => (
            <Image
              style={{ width: 70, height: 50 }}
              resizeMode="contain"
              source={require('../../../../../../assets/images/group_910.png')}
            />),
        }}
      />
      <Stack.Screen
        name="Product Wise Earning"
        component={ProductWiseEarning}
        options={{
          headerShown: true,
          headerRight: () => (
            <Image
              style={{ width: 70, height: 50 }}
              resizeMode="contain"
              source={require('../../../../../../assets/images/group_910.png')}
            />),
        }}
      />
      <Stack.Screen
        name="Scheme Wise Earning"
        component={SchemeWiseEarning}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Your Rewards"
        component={YourRewards}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default DashboardStack;
