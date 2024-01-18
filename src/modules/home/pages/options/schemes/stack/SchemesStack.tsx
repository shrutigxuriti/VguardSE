import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Schemes from '../Schemes';
import ProductWise from '../ProductWise';
import ActiveScheme from '../ActiveScheme';
import SpecialCombo from '../SpecialCombo';
import ProductWiseOfferTable from '../ProductWiseOfferTable';
import colors from '../../../../../../../colors';
import { Image } from 'react-native';

const SchemesStack: React.FC = () => {
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
        name="Schemes/Offers"
        component={Schemes}
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
        name="Product Wise Offers"
        component={ProductWise}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Active Schemes/Offers"
        component={ActiveScheme}
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
        name="Special Combo"
        component={SpecialCombo}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Product Wise Offers Table"
        component={ProductWiseOfferTable}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default SchemesStack;
