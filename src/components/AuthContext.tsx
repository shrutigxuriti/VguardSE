import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDigestPostRequest } from '../utils/apiservice';
import { UserData } from '../utils/modules/UserData';

interface AuthContextProps {
  isUserAuthenticated: boolean;
  login: (user: UserData) => Promise<void>;
  logout: () => Promise<void>;
  popupAuthContent: string;
  showPopup: boolean;
  setShowPopup: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAuthContent, setPopupContent] = useState('Please Enter Credentials of a Retailer');

  const login = async (user: UserData) => {
    console.log("LOGGING IN")
    const userRole = user.roleId;
    const diffAcc = user.diffAcc;
    console.log("USERDATA", user);
    if(userRole == "2"){
      console.log("><><><<, userrole is 2")
      setIsUserAuthenticated(true);
      await AsyncStorage.setItem('USER', JSON.stringify(user));
      await AsyncStorage.setItem('diffAcc', diffAcc);
      console.log("DIFFACCCOUNT", diffAcc)
    }
    else{
      setShowPopup(true);
    }
  };

  const logout = async () => {
    try {
      const path = 'user/logoutUser';
      createDigestPostRequest(path, '');
      await AsyncStorage.removeItem('USER');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      await AsyncStorage.removeItem('diffAcc');
      setIsUserAuthenticated(false);
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('USER')
      .then((value) => {
        if (value) {
          login(JSON.parse(value));
        } else {
          logout();
        }
      })
      .catch((error) => {
        console.error('AsyncStorage error:', error);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, login, logout, showPopup, popupAuthContent, setShowPopup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
