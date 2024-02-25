import React, { useState, useContext } from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { AccModeContext, AccIdContext } from '../../Contexts';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorMsg] = useState(null);
  const { setAccMode } = useContext(AccModeContext);
  const { setAccId } = useContext(AccIdContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = doc(db, "users", userCreds.user.uid);
      const userProfile = await getDoc(userDoc);

      if (userProfile.exists()) {
        const userData = userProfile.data();
        setAccMode(userData.mode); // Acc Mode is set here to be used in contexts
        setAccId(userCreds.user.uid); // Same deal for user id

        console.log("LOGIN ID: " + String(userCreds.user.uid));

        if (userData.mode === "victim") {
          navigation.navigate('MainApp', { screen: 'Slider_Screen' });
        } else {
          navigation.navigate('MainApp', { screen: 'SAR_Team_Screen' });
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      setErrorMsg("Error. Invalid credentials");
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