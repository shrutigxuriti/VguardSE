import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from '../utils/i18n';
import { Picker } from '@react-native-picker/picker';
import colors from '../../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguagePickerProps {
  onCloseModal: () => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ onCloseModal }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    AsyncStorage.setItem("language", language);
    onCloseModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select a Language:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => changeLanguage(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Hindi" value="hn" />
          <Picker.Item label="Bengali" value="bn" />
          <Picker.Item label="Kannada" value="kn" />
          <Picker.Item label="Marathi" value="mr" />
          <Picker.Item label="Malayalam" value="ml" />
          <Picker.Item label="Tamil" value="ta" />
          <Picker.Item label="Telugu" value="te" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  picker: {
    color: colors.black,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 5,
    backgroundColor: colors.lightGrey,
  },
});

export default LanguagePicker;
