import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import closeIcon from '../assets/images/ic_close.png';
import okIcon from '../assets/images/ic_accept_black2.png';

import colors from '../../colors';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  onOk: () => void;
  onTextChange: (pin: string) => void;
}

const PopupWithPin: React.FC<PopupProps> = ({ isVisible, onClose, onOk, onTextChange }) => {
  if (!isVisible) {
    return null;
  }
  const { t } = useTranslation();
  const [pin, setPin] = useState('');

  const handleTextChange = (text: string) => {
    setPin(text);
    onTextChange(text);
  };

  const handlePress = () => {
    onOk();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.popupText}>{t('strings:please_enter_pin')}</Text>
          <TextInput
            style={styles.pinInput}
            keyboardType="numeric"
            maxLength={4}
            value={pin}
            onChangeText={handleTextChange}
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.closeButton} onPress={handlePress}>
              <Image
                source={okIcon}
                style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image
                source={closeIcon}
                style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: 220,
    width: '80%',
    padding: 30,
    backgroundColor: colors.yellow,
    borderRadius: 10,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25
  },
  closeButtonText: {
    color: 'blue',
  },
  popupText: {
    color: colors.black,
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: responsiveHeight(3),
    width: '90%',
  },
  pinInput: {
    height: 40,
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 10,
    textAlign: 'center',
    color: colors.black,
    elevation: 5,
    marginTop: 25
  },
});

export default PopupWithPin;
