// import messaging from "@react-native-firebase/messaging";
import notifee from '@notifee/react-native';

const notificationListener = () => {
  // messaging().onNotificationOpenedApp((remoteMessage) => {});

  // messaging()
  //   .getInitialNotification()
  //   .then((remoteMessage) => {});

  // messaging().onMessage(async (remoteMessage) => {
  //   await onDisplayNotification(remoteMessage)
  // });

  const onDisplayNotification = async(data: any) => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
  
    // Required for iOS
    // See https://notifee.app/react-native/docs/ios/permissions
    await notifee.requestPermission();
  
    const notificationId = await notifee.displayNotification({
      id: '123',
      title: data.notification.title,
      body: data.notification.body,
      android: {
        channelId,
        smallIcon:"ic_launcher_round"
      },
    });
  }

};


export default notificationListener