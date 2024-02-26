/**
 * @file Slider_Screen.js
 * @brief This file contains the implementation of the Slider_Screen component.
 */

import React, { useContext, useRef } from 'react';
import { View, StyleSheet, Text, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { db } from '@firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { AccIdContext } from '../../../Contexts';

/**
 * @brief Slider_Screen component.
 */
export default function Slider_Screen() {
  const { AccId } = useContext(AccIdContext);
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;

  /** 
   * @brief panResponder for handling user's touches
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateX.setOffset(translateX._value);
      },
      onPanResponderMove: Animated.event(
        [null, { dx: translateX }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, { vx, dx }) => {
        translateX.flattenOffset();
        if (dx > 150) { // Threshold to navigate
          updateLocationInFirestore();
          navigation.navigate('Advice_Screen');
        }
        Animated.spring(translateX, {
          toValue: 0,
          bounciness: 10,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;  

  /**
   * @function updateLocationInFirestore
   * @brief update user's location in firestore database
   * @returns {void}
   */
  async function updateLocationInFirestore() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status != 'granted') {
      console.error('Permission to access location was denied');
      return;
    }
    
    const location = await Location.getCurrentPositionAsync({});
    await setDoc(doc(db, "usersLocations", AccId), {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date(),
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.sliderBar}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 150],
                    outputRange: [-10, 210],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.arrowText}>→</Text>
        </Animated.View>
      </View>
      <Text style={styles.sliderText}>SLIDE FOR HELP</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sliderBar: {
    width: 300,
    height: 80,
    backgroundColor: 'red',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 40,
    position: 'absolute',
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: 'red',
    fontSize: 24,
  },
  sliderText: {
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    fontSize: 18,
  },
});

