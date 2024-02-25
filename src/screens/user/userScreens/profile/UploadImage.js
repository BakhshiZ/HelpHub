import React, { useState, useEffect, useContext } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AccIdContext } from '../../../../Contexts';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@firebaseConfig';

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const { AccId } = useContext(AccIdContext);

  useEffect(() => {
    checkForPermissions();
    retrieveStoredImage(); // Retrieve stored image when component mounts
  }, []);

  const checkForPermissions = async () => {
    const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraRollStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
      alert("Please grant camera and gallery permissions inside your system's settings");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      storeImage(result.assets[0].uri); // Store the URI of the selected image
    }
  };
  
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      storeImage(result.assets[0].uri); // Store the URI of the selected image
    }
  };
  
  const storeImage = async (uri) => {
    try {
      await setDoc(doc(db, "usersProfilePics", AccId), { uri }); // Store the URI with a key 'profileImage'
    } catch (error) {
      console.error('Error storing image:', error);
    }
  };

  const retrieveStoredImage = async () => {
    try {
      const userPicDoc = doc(db, "usersProfilePics", AccId);
      const userPic = await getDoc(userPicDoc);
      if (userPic.exists()) {
        const { uri } = userPic.data();
        setImage(uri); // Set the image URI if it exists
      }
    } catch (error) {
      console.error('Error retrieving image:', error);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel" }
    ]);
  };

  return (
    <View style={imageUploaderStyles.container}>
      {image && <Image source={{ uri: image }} style={imageUploaderStyles.image} />}
      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity onPress={showImagePicker} style={imageUploaderStyles.uploadBtn}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
