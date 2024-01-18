import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Info from '../Info';
import Downloads from '../Downloads';
import ProductCatalogue from '../ProductCatalogue';
import VGuardInfo from '../VGuardInfo';
import colors from '../../../../../../../colors';
import { Image } from 'react-native';

const InfoStack: React.FC = () => {
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
        name="Info Desk"
        component={Info}
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
        name="Downloads"
        component={Downloads}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Product Catalogue"
        component={ProductCatalogue}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="V-Guard Info"
        component={VGuardInfo}
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
    </Stack.Navigator>
  );
};

export default InfoStack;
