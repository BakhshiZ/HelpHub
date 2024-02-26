/**
 * @file Advice_Screen.js
 * @brief This file contains the implementation of the Advice Screen component.
 */

import React, { useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import { Image } from 'react-native';
import { Audio } from 'expo-av';

/**
 * @brief Component for each advice box.
 * @param item The advice item to be displayed.
 */
const AdviceBox = ({ item }) => {
  // Ignore all logs to avoid clutter
  LogBox.ignoreAllLogs();
  
  return (
    <View style={styles.adviceBox}>
      <View style={styles.extraView}>
        <Image source={item.image} style={styles.adviceImage} />
      </View>
      <Text style={styles.adviceText}>{item.text}</Text>
    </View>
  );
};

/**
 * @brief Main advice screen component.
 */
const Advice_Screen = () => {
  // Navigation hook
  const navigation = useNavigation();
  // State for sound and its playback status
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to toggle play/pause of audio
  async function togglePlay() {
    if (isPlaying) {
      await sound.stopAsync();
      setIsPlaying(false);
    } else {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('@assets/SOS_Sound.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  }

  // Data for advice items
  const advices = [
    {
      text: "Try not to shout randomly, shouting randomly can block dust and respiratory tract. Additionally, prolonged shouting causes loss of energy and hoarseness.",
      image: require('@assets/NoShouting.png'),
    }, 
    {
      text: "Ensure you use a tissue or your clothing to cover both your mouth and nose.",
      image: require('@assets/CoverMouth.png'),
    },
    {
      text: "Refrain from igniting anything flammable.",
      image: require('@assets/NoFire.png'),
    },
    {
      text: "Find a tool to make sound outside by hitting concrete blocks in the coming hours.",
      image: require('@assets/ToolNoise.png'),
    },
  ];

  // Function to render each advice box
  const renderAdviceBox = ({ item, index }) => {
    return <AdviceBox item={item} index={index} />;
  };

  // Dimensions for carousel items
  const sliderWidth = 300;
  const itemWidth = 300;

  return (
    <View style={styles.container}>
      {/* Notification that help is on the way */}
      <Text style={styles.helpNotif}>Help is on the way!</Text>
      {/* Carousel to display advice items */}
      <Carousel
        data={advices}
        renderItem={renderAdviceBox}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        loop={true}
        autoplay={true}
        autoplayDelay={1000}
        autoplayInterval={5000}
      />
      {/* Buttons to exit and toggle audio */}
      <View style={styles.buttonContainer}>
        {/* Button to exit screen */}
        <TouchableOpacity style={styles.exitButton} onPress={() => {
          if (isPlaying) {
            togglePlay();
          }
          navigation.navigate(' ')
          }}>
          <Image style={styles.buttonImage} source={require('@assets/Exit.png')}/>
        </TouchableOpacity>
        {/* Button to toggle audio */}
        <TouchableOpacity style={styles.warningButton} onPress={togglePlay}>
          <Image style={styles.buttonImage} source={require('@assets/Bell.png')}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    flex: 1,
    aspectRatio: 1.5, 
    resizeMode: 'contain',
    top: 10,
    width: '100%',
    height: '100%', 
    marginBottom: 20, 
    borderRadius: 10, 
  },
  helpNotif: {
    position: 'absolute',
    top: 70,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  extraView: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  adviceBox: {
    top: 150,
    left: 15,
    width: 270,
    borderRadius:8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceImage: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
    borderRadius: 10,
  },
  adviceText: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    bottom: 50,
  },
  warningButton: {
    width: 75,
    height: 75,
    backgroundColor: '#de3333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  exitButton: {
    width: 75,
    height: 75,
    backgroundColor: '#7f65bf',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Advice_Screen;
