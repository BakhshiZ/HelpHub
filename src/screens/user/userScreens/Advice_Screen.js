import React, { useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import { Image } from 'react-native';
import { Audio } from 'expo-av';


const AdviceBox = ({ item }) => {
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

const Advice_Screen = () => {
  const navigation = useNavigation();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function togglePlay() {
    if (isPlaying) {
      console.log("Stopping Sound...");
      await sound.stopAsync();
      setIsPlaying(false);
    } else {
      if (!sound) {
        console.log("Loading Sound...");
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('@assets/SOS_Sound.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      } else {
        console.log("Playing Sound...");
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  }

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
      text: "Refrain from igniting anything flambable.",
      image: require('@assets/NoFire.png'),
    },
    {
      text: "Find a tool to make sound outside by hitting concrete blocks in the coming hours.",
      image: require('@assets/ToolNoise.png'),
    },
  ];

  const renderAdviceBox = ({ item, index }) => {
    return <AdviceBox item={item} index={index} />;
  };

  const sliderWidth = 300; // Adjust this to be the same as the device's width if necessary
  const itemWidth = 300; // Adjust the width as needed
return (
    <View style={styles.container}>
      <Text style={styles.helpNotif}>Help is on the way!</Text>

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.exitButton} onPress={() => {
          if (isPlaying) {
            togglePlay();
          }
          navigation.navigate(' ')
          }}>
          <Image style={styles.buttonImage} source={require('@assets/Exit.png')}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.warningButton} onPress={togglePlay}>
          <Image style={styles.buttonImage} source={require('@assets/Bell.png')}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    width: '100%', // Adjust the width as needed
    height: '100%', // Adjust the height as needed
    marginBottom: 20, // Adjust the margin as needed
    borderRadius: 10, // Optional for rounded corners
  },
  helpNotif: {
    position: 'absolute',
    top: 70, // Adjust the top position as needed
    fontSize: 20, // Adjust the font size as needed
    fontWeight: 'bold', // Adjust the font weight as needed
    color: 'black', // Adjust the color as needed
  },  
  scrollView: {
    // Adjust this as needed
  },
  extraView: {
    width: 250, // Adjust the width as needed
    height: 250,
    marginBottom: 20,
  },
  adviceBox: {
    top: 150,
    left: 15,
    width: 270, // Adjust the width as needed
    borderRadius:8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceImage: {
    width: '100%', // Adjust the width as needed
    height: '100%', // Adjust the height as needed
    marginBottom: 20, // Adjust the margin as needed
    borderRadius: 10, // Optional for rounded corners
  },
  adviceText: {
    textAlign: 'center',
    // Add other styling as needed
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
    width: 75, // Adjust the size as needed
    height: 75, // Adjust the size as needed
    backgroundColor: '#de3333', // Adjust the color as needed
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  exitButton: {
    width: 75, // Adjust the size as needed
    height: 75, // Adjust the size as needed
    backgroundColor: '#7f65bf',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Advice_Screen;