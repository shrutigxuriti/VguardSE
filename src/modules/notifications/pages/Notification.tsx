import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import colors from '../../../../colors';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { getNotifications } from '../../../utils/apiservice';
import Loader from '../../../components/Loader';

interface NotificationItem {
  alertDesc: string;
  alertDate: string;
}

const Notification: React.FC = () => {
  const [loader, showLoader] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    showLoader(true);
    
    getNotifications().then(async (response) => {
      console.log(response);
      const result = await response.data;
      console.log(result);
      setNotifications(result);
      showLoader(false);
    });
  }, []);

  return (
    <ScrollView style={styles.mainWrapper}>
      {loader && <Loader />}
      {notifications.map((item, index) => (
        <View key={index} style={styles.messageItem}>
          <Image
            style={styles.image}
            source={require('../../../assets/images/ic_alert_.png')}
          />
          <View style={styles.messageContainer}>
            <Text style={styles.messageHeader}>{item.alertDate}</Text>
            <ScrollView style={styles.messageTextContainer} horizontal={true}>
              <Text style={styles.messageText}>{item.alertDesc}</Text>
            </ScrollView>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
  },
  messageItem: {
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  messageHeader: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    color: colors.black,
  },
  messageText: {
    fontSize: responsiveFontSize(1.7),
    color: colors.black,
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: responsiveFontSize(5),
    width: responsiveFontSize(5),
  },
  messageTextContainer: {
    maxWidth: responsiveWidth(75),
    overflow: 'hidden',
  },
});

export default Notification;
