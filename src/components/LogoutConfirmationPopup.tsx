import React from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from '../../colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import closeIcon from '../assets/images/ic_close.png';
import okIcon from '../assets/images/ic_accept_black2.png'
import { useTranslation } from 'react-i18next';

interface LogoutConfirmationPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationPopup: React.FC<LogoutConfirmationPopupProps> = ({ isVisible, onClose, onConfirm }) => {
  const { t } = useTranslation();

  if (!isVisible) {
    return null;
  }

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.popupText}>{t('strings:are_you_sure_logout')}</Text>
          {/* <Button title="Yes" onPress={onConfirm} color={colors.black} /> */}
          <TouchableOpacity style={styles.okButton} onPress={onConfirm}>
            <Image source={okIcon} style={{ flex: 1, width: "100%", height: "100%" }} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image source={closeIcon} style={{ flex: 1, width: "100%", height: "100%" }} resizeMode="contain" />
          </TouchableOpacity>
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
    height: '30%',
    width: '80%',
    padding: 30,
    backgroundColor: colors.yellow,
    borderRadius: 10,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: responsiveHeight(8),
    height: responsiveHeight(8),
  },
  okButton: {
    position: 'absolute',
    bottom: 10,
    right: 80,
    width: responsiveHeight(8),
    height: responsiveHeight(8),
  },
  closeButtonText: {
    color: 'blue',
  },
  popupText: {
    color: colors.black,
    fontSize: responsiveFontSize(2.2),
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: responsiveHeight(3),
    width: '70%',
  },
  button: {
    borderRadius: 10,
    marginTop: 20,
    padding: 5,
  },
});

export default LogoutConfirmationPopup;
