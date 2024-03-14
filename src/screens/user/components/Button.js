import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";

/**
 * Button Component
 * Can become active (secondary) or inactive (primary).
 * 
 * primary: boolean     -> whether the button is a primary or a secondary button
 * childen: any         -> A react prop for supporting children components, such as text
 * onPress: function    -> Function to call on pressing the button.
 *  */
function Button({primary = true, children = null, onPress = null}) {
    return (
      <Pressable
        onPressOut={onPress}
        style={({pressed}) => {
          if (pressed) {
            return styles.buttonPressed;
          }
          else {
            if (primary) {
              return styles.buttonPrimary;
            }
  
            else {
              return styles.buttonSecondary;
            }
          }
        }}>
          {children}
      </Pressable>
    );

}


const styles = StyleSheet.create({
    buttonPrimary: {
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: "#8814B1",
        elevation: 5,
    },
    buttonPressed: {
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: "#7B6682",
        elevation: 5,
    },
    buttonSecondary: {
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: "#EA2C87",
        elevation: 5,
    },
});
