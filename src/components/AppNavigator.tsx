// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from '../modules/common/services/BottomTab';
import AuthNavigator from '../modules/auth/stack/AuthNavigator';
import { useAuth } from './AuthContext';
import OpenPopupOnOpeningApp from './OpenPopupOnOpeningApp'; // Import the OpenPopupOnOpeningApp component

const AppNavigator: React.FC = () => {
  const { isUserAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {/* {isUserAuthenticated ? <BottomTab /> : <AuthNavigator />} */}
      {isUserAuthenticated ? (
        <>
          <BottomTab />
          <OpenPopupOnOpeningApp />
        </>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
