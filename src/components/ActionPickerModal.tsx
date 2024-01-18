import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, Pressable } from 'react-native';

interface ActionPickerModalProps {
  onCamera: () => void;
  onGallery: () => void;
}

const ActionPickerModal: React.FC<ActionPickerModalProps> = ({ onCamera, onGallery }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Action!</Text>
          <Pressable
            style={{ height: 40, marginVertical: 15, backgroundColor: 'red' }}
            onPress={onGallery}
          >
            <Text style={styles.textStyle}>Select photo from gallery</Text>
          </Pressable>
          <Pressable
            style={{ height: 40, marginVertical: 15, backgroundColor: 'blue' }}
            onPress={onCamera}
          >
            <Text style={styles.textStyle}>Capture photo from camera</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'transparent',
  },
  modalView: {
    backgroundColor: 'white',
    margin: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  modalText: {
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ActionPickerModal;
