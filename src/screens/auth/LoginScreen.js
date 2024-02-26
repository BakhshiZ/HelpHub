/**
 * @file LoginScreen.js
 * @brief Screen component for user login.
 * @details This component provides a user interface for logging in with email and password credentials.
 */

import React, { useState, useContext } from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { AccModeContext, AccIdContext } from '../../Contexts';

/**
 * @function LoginScreen
 * @description Functional component for the login screen.
 * @returns {JSX.Element} JSX element representing the login screen.
 */
function LoginScreen() {
  const [email, setEmail] = useState(''); /**< State for storing user email */
  const [password, setPassword] = useState(''); /**< State for storing user password */
  const [error, setErrorMsg] = useState(null); /**< State for storing error message */
  const { setAccMode } = useContext(AccModeContext); /**< Context for accessing and setting user account mode */
  const { setAccId } = useContext(AccIdContext); /**< Context for accessing and setting user account ID */
  const navigation = useNavigation(); /**< Navigation hook for navigating between screens */

  /**
   * @function handleLogin
   * @description Handles the login process when the user clicks the login button.
   */
  const handleLogin = async () => {
    try {
      // Sign in the user with email and password credentials
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = doc(db, "users", userCreds.user.uid);
      const userProfile = await getDoc(userDoc);

      if (userProfile.exists()) {
        const userData = userProfile.data();
        setAccMode(userData.mode); // Set the user account mode
        setAccId(userCreds.user.uid); // Set the user account ID

        console.log("LOGIN ID: " + String(userCreds.user.uid));

        // Navigate to appropriate screen based on user account mode
        if (userData.mode === "victim") {
          navigation.navigate('MainApp', { screen: 'Slider_Screen' });
        } else {
          navigation.navigate('MainApp', { screen: 'SAR_Team_Screen' });
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      setErrorMsg("Error. Invalid credentials"); // Set error message if login fails
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("@assets/logo.png")} style={styles.logo} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>Log in</Button>
      <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')} style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Need an account?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles for the login screen component
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  input: { width: '80%', marginBottom: 10 },
  button: { marginTop: 10 },
  signupButton: { marginTop: 20 },
  signupButtonText: { color: '#0066cc' },
  error: { color: 'red' },
  logo: { width: 250, height: 250 },
});

export default LoginScreen;
