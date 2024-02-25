import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

// Mock data for notifications with date and time
const initialNotifications = [
  { id: '1', text: 'Your order has been shipped.', dateTime: 'Feb 8, 4:30 PM' },
  { id: '2', text: 'Your payment was received.', dateTime: 'Feb 7, 3:10 PM' },
  // ... other notifications
];

const NotificationItem = ({ text, dateTime, onDismiss }) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationContent}>
      <Text style={styles.notificationText}>{text}</Text>
      <Text style={styles.notificationDateTime}>{dateTime}</Text>
    </View>
    <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
      <Text>Dismiss</Text>
    </TouchableOpacity>
  </View>
);

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const dismissAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity onPress={dismissAllNotifications} style={styles.dismissAllButton}>
          <Text>Dismiss All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            text={item.text}
            dateTime={item.dateTime}
            onDismiss={() => dismissNotification(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />} // Add space between items
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    fontSize: 20,
  },
  dismissAllButton: {
    // Style for the 'Dismiss All' button
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff', // Assuming a white background
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5, // Add some space between the text and the date/time
  },
  notificationDateTime: {
    fontSize: 12,
    color: '#666', // A lighter color for the date/time
  },
  dismissButton: {
    // Style for the dismiss button on each notification
  },
  separator: {
    height: 10, // Adjust the space as needed
  },
});

export default NotificationsScreen;