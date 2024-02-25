import React, { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { Button, TextInput, Checkbox } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@firebaseConfig";
import { useNavigation } from "@react-navigation/native";

function SignInScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNumber] = useState("");
  const [error, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRescuer, setIsRescuer] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCreds = await createUserWithEmailAndPassword(auth, email, password);
      const userProfile = { name, email: userCreds.user.email, phoneNum, mode: isRescuer ? "rescuer" : "victim" };
      await setDoc(doc(db, "users", userCreds.user.uid), userProfile);
      navigation.navigate('LoginScreen');
    } catch (error) {
      setErrMsg("Error signing up. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('@assets/logo.png')} style={styles.logo} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
      <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Phone Number" value={phoneNum} keyboardType="numeric" onChangeText={setPhoneNumber} style={styles.input} />
      <View style={styles.checkboxContainer}>
        <Text>Are you a rescuer?</Text>
        <Checkbox status={isRescuer ? 'checked' : 'unchecked'} onPress={() => setIsRescuer(!isRescuer)} />
      </View>
      <Button mode="contained" onPress={handleSignUp} loading={loading} style={styles.button}>
        Sign Up
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.signInButton}>
        <Text>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 200, height: 200 },
  input: { width: '80%', margin: 10 },
  button: { marginTop: 10 },
  signInButton: { marginTop: 20 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
});

export default SignInScreen;
