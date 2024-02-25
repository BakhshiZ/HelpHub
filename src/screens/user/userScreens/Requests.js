import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const RequestItem = ({ username, distance, requestText, timestamp }) => {
  return (
    <View style={styles.requestItem}>
      <View style={styles.headerContainer}>
        <Text style={styles.usernameText}>[USER] requests [ITEM]</Text>
        <Text style={styles.timestampText}>{timestamp}</Text>
      </View>
      <Text style={styles.requestText}>{requestText}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>SHOW ON MAP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>PROVIDE HELP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>DISMISS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RequestsPage = () => {
  // This would be your data fetched from your backend or state management
  const requestsData = [
    // Example data structure
    {
      username: 'User123',
      distance: '2 km away',
      requestText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      timestamp: '1hr ago',
    },
    // More requests...
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        {requestsData.map((request, index) => (
          <RequestItem
            key={index}
            username={request.username}
            distance={request.distance}
            requestText={request.requestText}
            timestamp={request.timestamp}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
  },
  requestItem: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  usernameText: {
    fontWeight: 'bold',
  },
  timestampText: {
    fontStyle: 'italic',
  },
  requestText: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4e4e4e',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default RequestsPage;