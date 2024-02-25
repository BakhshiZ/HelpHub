import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import legal from '../../../assets/legal.json';

const Settings = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [sound, setSound] = React.useState(false);
  const [vibration, setVibration] = React.useState(false);
  const [language, setLanguage] = React.useState(null);

  showInfo = (msg) =>
    Alert.alert('Legal Information', msg, [
      {
        text: 'OK', 
        onPress: () => console.log('OK Pressed')
      },
    ]);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    // ... add other languages here
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Dark Mode</Text>
        <View style={styles.subsection}>
          <Text style={styles.subLabel}>Enable</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => setDarkMode(value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notifications</Text>
        <View style={styles.subsection}>
          <Text style={styles.subLabel}>Push Notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={(value) => setPushNotifications(value)}
          />
        </View>
        <View style={styles.subsection}>
          <Text style={styles.subLabel}>Sound</Text>
          <Switch
            value={sound}
            onValueChange={(value) => setSound(value)}
          />
        </View>
        <View style={styles.subsection}>
          <Text style={styles.subLabel}>Vibration</Text>
          <Switch
            value={vibration}
            onValueChange={(value) => setVibration(value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Language</Text>
        <Dropdown
          style={styles.dropdown}
          data={languages}
          labelField="label"
          valueField="value"
          placeholder="Pick a language..."
          value={language}
          onChange={item => {
            setLanguage(item.value);
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>About</Text>
        <TouchableOpacity onPress={() => showInfo(legal[1].contents)}>
          <Text style={styles.hyperlink}>Legal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showInfo(legal[0].contents)}>
          <Text style={styles.hyperlink}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    position: "relative",
    left: 106,
    top: 20,
    marginBottom: 20,
  },
  section: {
    top: 0,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  subsection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  hyperlink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default Settings;