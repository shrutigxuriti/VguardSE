import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      onRequestClose={() => {}} // You can leave it empty or add a close action
    >
      <View style={styles.container}>
        <View style={styles.loaderBackground}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Background color with transparency
  },
  loaderBackground: {
    backgroundColor: 'white', // White background for the loader
    borderRadius: 10, // Add rounded corners or adjust as needed
    padding: 20, // Add padding to the loader
  },
});

export default Loader;
