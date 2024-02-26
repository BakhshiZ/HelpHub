/**
 * @file NotificationsScreen.js
 * @brief This file contains the implementation of the Notifications Screen component.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

// Mock data for notifications with date and time
const initialNotifications = [
  { id: '1', text: 'There was a magnitude 3.2 earthquake that originated 5km from you', dateTime: 'Feb 8, 16:30 CEST' },
  { id: '2', text: 'There was a magnitude 5.2 earthquake that originated 1km from you', dateTime: 'Feb 3, 12:11 CEST' },
  // ... other notifications
];

/**
 * @brief Individual notification item component.
 * @param text The text content of the notification.
 * @param dateTime The date and time of the notification.
 * @param onDismiss Function to call when the notification is dismissed.
 */
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

/**
 * @brief Notifications screen component.
 */
const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  // Function to dismiss a single notification
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Function to dismiss all notifications
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

// Styles
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
