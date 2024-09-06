import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Request permission for iOS
    PushNotificationIOS.requestPermissions();

    // Request permission for Android
    messaging().requestPermission();

    // Handle incoming notifications when the app is in the foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification;
      addNotification({ title, body });
    });

    // Handle notifications that are received when the app is in the background
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const { title, body } = remoteMessage.notification;
      addNotification({ title, body });
    });

    // Check for initial notification (app opened from a notification)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const { title, body } = remoteMessage.notification;
          addNotification({ title, body });
        }
      });

    return unsubscribe;
  }, []);

  const addNotification = (notification) => {
    setNotifications(prevNotifications => [notification, ...prevNotifications]);
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
  },
});

export default NotificationList;
