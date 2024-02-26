/**
 * @file UploadImage.js
 * @brief Contains the UploadImage component for uploading and displaying user profile pictures.
 */

import React, { useState, useEffect, useContext } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AccIdContext } from '../../../../Contexts';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@firebaseConfig';

/**
 * @brief UploadImage component for uploading and displaying user profile pictures.
 * @returns {JSX.Element} UploadImage component
 */
export default function UploadImage() {
  // State variables
  const [image, setImage] = useState(null);
  const { AccId } = useContext(AccIdContext);

  // Check for permissions and retrieve stored image when component mounts
  useEffect(() => {
    checkForPermissions();
    retrieveStoredImage();
  }, []);

  // Function to check for permissions
  const checkForPermissions = async () => {
    // Request camera roll and camera permissions
    const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    // Alert if permissions are not granted
    if (cameraRollStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
      alert("Please grant camera and gallery permissions inside your system's settings");
    }
  };

  // Function to pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Set image URI and store it
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      storeImage(result.assets[0].uri);
    }
  };

  // Function to take photo using camera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Set image URI and store it
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      storeImage(result.assets[0].uri);
    }
  };

  // Function to store image URI in Firestore
  const storeImage = async (uri) => {
    try {
      await setDoc(doc(db, "usersProfilePics", AccId), { uri });
    } catch (error) {
      console.error('Error storing image:', error);
    }
  };

  // Function to retrieve stored image from Firestore
  const retrieveStoredImage = async () => {
    try {
      const userPicDoc = doc(db, "usersProfilePics", AccId);
      const userPic = await getDoc(userPicDoc);
      if (userPic.exists()) {
        const { uri } = userPic.data();
        setImage(uri);
      }
    } catch (error) {
      console.error('Error retrieving image:', error);
    }
  };

  // Function to display image picker options
  const showImagePicker = () => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel" }
    ]);
  };

  // Render the UploadImage component
  return (
    <View style={imageUploaderStyles.container}>
      {/* Display uploaded image if available */}
      {image && <Image source={{ uri: image }} style={imageUploaderStyles.image} />}
      {/* Button to trigger image picker */}
      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity onPress={showImagePicker} style={imageUploaderStyles.uploadBtn}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles for the UploadImage component
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: '#efefef',
    position: 'relative',
    borderRadius: 999,
    overflow: 'hidden',
    flex: 1,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: "center",
    justifyContent: 'center',
  },
  image: {
    width: "100%",
    height: "100%",
  }
});
