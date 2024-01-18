import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import closeIcon from '../assets/images/ic_close.png';
import colors from '../../colors';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

interface PopupWithButtonProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  buttonText: string;
  onConfirm: () => void;
}

const PopupWithButton: React.FC<PopupWithButtonProps> = ({
  isVisible,
  onClose,
  children,
  buttonText,
  onConfirm,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image
              source={closeIcon}
              style={{ flex: 1, width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.popupText}>{children}</Text>
          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text style={styles.buttonText}>{buttonText}</Text>
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
    top: 10,
    right: 10,
    width: responsiveHeight(8),
    height: responsiveHeight(8),
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
    width: '100%',
  },
  buttonText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 20,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 25,
    elevation: 10,
  },
});

export default PopupWithButton;
