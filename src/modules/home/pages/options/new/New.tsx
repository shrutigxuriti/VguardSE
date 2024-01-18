import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import colors from '../../../../../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { getWhatsNew } from '../../../../../utils/apiservice';
import { useTranslation } from 'react-i18next';
import { NavigationContainerRef } from '@react-navigation/native';

interface NewProps {
  navigation: NavigationContainerRef;
}

interface DataItem {
  fileName: string;
  imagePath: string;
}

const New: React.FC<NewProps> = ({ navigation }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    getWhatsNew()
      .then(response => response.json())
      .then(responseData => {
        const updatedData = responseData.map((item: DataItem) => {
          if (item.imagePath.startsWith('img/')) {
            item.imagePath = `https://www.vguardrishta.com/${item.imagePath}`;
          }
          return item;
        });
        setData(updatedData);
        console.log("<><<><<><>><", updatedData, "<><<<><><><><><><<><");
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleLinkPress = (item: DataItem) => {
    if (item.imagePath === "daily_winner") {
      // Navigate to the "daily_winner" screen
      navigation.navigate("Daily Winner");
    } else {
      // Open the URL in the browser for other cases
      Linking.openURL(item.imagePath);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {data && data.map && data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.listItem}
            onPress={() => handleLinkPress(item)}
          >
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.fileName}</Text>
            </View>
            <Text style={styles.openLinkText}>{t('strings:view')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.white
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: responsiveFontSize(2),
    color: colors.black
  },
  openLinkText: {
    color: colors.yellow,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default New;
