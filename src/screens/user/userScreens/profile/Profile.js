import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { AccIdContext } from '../../../../Contexts';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // import updateDoc
import { db, auth } from '@firebaseConfig';
import { signOut } from 'firebase/auth';
import UploadImage from './UploadImage';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const Profile = () => {
  const { AccId } = useContext(AccIdContext);
  const [userData, setUserData] = useState(null);
  const [userMedData, setUserMedData] = useState(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [editedPersonalData, setEditedPersonalData] = useState({});
  const [editedMedicalData, setEditedMedicalData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    GetUserData();
  }, []);

  const GetUserData = async () => {
    const userMedDoc = doc(db, "usersMedicalInfo", AccId);
    const userMedProfile = await getDoc(userMedDoc);
    const userMedData = userMedProfile.data();
    setUserMedData(userMedData);

    const userPersDoc = doc(db, "users", AccId);
    const userProfile = await getDoc(userPersDoc);
    const userData = userProfile.data();
    setUserData(userData);
    setEditedPersonalData(userData);
    setEditedMedicalData(userMedData);
  }

  const handleEditPersonal = async () => {
    if (isEditingPersonal) {
      // Save edited personal data
      await updateDoc(doc(db, "users", AccId), editedPersonalData);
    }
    setIsEditingPersonal(!isEditingPersonal);
  }

  const handleEditMedical = async () => {
    if (isEditingMedical) {
      // Save edited medical data
      await updateDoc(doc(db, "usersMedicalInfo", AccId), editedMedicalData);
    }
    setIsEditingMedical(!isEditingMedical);
  }

  const handleChangePersonalData = (key, value) => {
    setEditedPersonalData(prevState => ({ ...prevState, [key]: value }));
  }

  const handleChangeMedicalData = (key, value) => {
    setEditedMedicalData(prevState => ({ ...prevState, [key]: value }));
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigate to LoginScreen after successful signout
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePicContainer}>
          <UploadImage/>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
        <TouchableOpacity style={styles.button} onPress={handleEditPersonal}>
          {isEditingPersonal ? (
              <Text style={styles.buttonText}>Save</Text>
            ) : (
              <Image source={require('@assets/pencil.png')} style={styles.editIcon} />
            )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            editable={isEditingPersonal}
            onChangeText={value => handleChangePersonalData('name', value)}
            value={editedPersonalData.name}
            placeholder="Name"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            editable={isEditingPersonal}
            onChangeText={value => handleChangePersonalData('email', value)}
            value={editedPersonalData.email}
            placeholder="Email"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            editable={isEditingPersonal}
            onChangeText={value => handleChangePersonalData('phoneNum', value)}
            value={editedPersonalData.phoneNum}
            placeholder="Phone Number"
            keyboardType="numeric"
            maxLength={15}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MEDICAL INFORMATION</Text>
        <TouchableOpacity style={styles.button} onPress={handleEditMedical}>
          {/* <Text style={styles.buttonText}>{isEditingMedical ? "Save" : "Edit"}</Text> */}
          {isEditingMedical ? (
              <Text style={styles.buttonText}>Save</Text>
            ) : (
              <Image source={require('@assets/pencil.png')} style={{width: 20, height: 20}} />
            )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        
      <View style={styles.infoRow}>
        <Text style={styles.label}>Blood Type:</Text>
        <View style={[styles.input, styles.pickerContainer]}>
          {isEditingMedical ? (
            <Picker
              selectedValue={editedMedicalData.BloodType}
              style={[styles.picker, { height: 50, width: '100%' }]} // Apply picker style
              onValueChange={(itemValue, itemIndex) =>
                handleChangeMedicalData('BloodType', itemValue)
              }>
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
            </Picker>
          ) : (
            <Text style={{ color: 'gray', opacity: 0.7 }}>{editedMedicalData.BloodType}</Text>
          )}
        </View>
      </View>



        <View style={styles.infoRow}>
          <Text style={styles.label}>Emergency Contact Name:</Text>
          <TextInput
            style={styles.input}
            editable={isEditingMedical}
            onChangeText={value => handleChangeMedicalData('EmergencyContactName', value)}
            value={editedMedicalData.EmergencyContactName}
            placeholder="Emergency Contact Name"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Emergency Contact Number:</Text>
          <TextInput
            style={styles.input}
            editable={isEditingMedical}
            onChangeText={value => handleChangeMedicalData('EmergencyContactNumber', value)}
            value={editedMedicalData.EmergencyContactNumber}
            placeholder="Emergency Contact Number"
            keyboardType="numeric"
            maxLength={15}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Gender:</Text>
          <TextInput
            style={styles.input}
            editable={isEditingMedical}
            onChangeText={value => handleChangeMedicalData('Gender', value)}
            value={editedMedicalData.Gender}
            placeholder="Gender"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Height (in cm):</Text>
          <TextInput
            style={styles.input}
            editable={isEditingMedical}
            onChangeText={value => handleChangeMedicalData('Height', value)}
            value={editedMedicalData.Height}
            keyboardType="numeric"
            placeholder="Height"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Weight (in lbs):</Text>
          <TextInput
            style={styles.input}
            editable={isEditingMedical}
            onChangeText={value => handleChangeMedicalData('Weight', value)}
            value={editedMedicalData.Weight}
            keyboardType="numeric"
            placeholder="Weight"
          />
        </View>
      </View>

      <TouchableOpacity 
      style={styles.logoutButton}
      onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  profilePicContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'lightgrey',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    paddingBottom: 5,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 15,
    margin: 20,
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Lighter border color
    borderRadius: 5,
    marginBottom: 10,
    paddingVertical: 5, // Adjusted padding
    paddingHorizontal: 8, // Adjusted padding
  },    
  picker: {
    height: 50,
    width: '100%',
  },  
  editIcon: {
    width: 20,
    height: 20,
  },
});

export default Profile;
