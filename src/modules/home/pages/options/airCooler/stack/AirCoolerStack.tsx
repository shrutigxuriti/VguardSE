import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../../../../../../../colors';
import AirCooler from '../AirCooler';
import { Image } from 'react-native';
import AirCoolerRedemptionHistory from '../AirCoolerRedemptionHistory';
import AirCoolerNumberOfScans from '../AirCoolerNumberOfScans';

const AirCoolerStack: React.FC = () => {
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
        name="Redeem Points"
        component={AirCooler}
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
        name="Redemption History"
        component={AirCoolerRedemptionHistory}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Unique Code History"
        component={AirCoolerNumberOfScans}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AirCoolerStack;
