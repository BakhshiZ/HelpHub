import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { Text } from "react-native-paper";
import * as Colors from "../styles/Colors"
import { ScrollView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OfflineMode from "./OfflineMode";
import OfflineModeDM from "./OfflineModeDM";
import { useNavigation } from "@react-navigation/native";

function MessageItem({endpointId, lastMessage}) {
    const navigation = useNavigation();

    function goToMessageDetails() {
        navigation.navigate("OfflineModeDM", {endpointId: endpointId})
    }

    return (
        <Pressable android_ripple={{color: Colors.background, foreground: true}}
                    onPressOut={goToMessageDetails}>
            <View style={styles.messageItem}>
                <Text style={styles.messageItemId}>{endpointId}</Text>
                <Text style={styles.messageItemLast}>{(lastMessage === null) ? "No messages yet.": lastMessage.message}</Text>
            </View>
        </Pressable>
    );
} 

function OfflineModeMessage({messages, setMessages}) {
    // Gets last message, returns null if it does not exist.
    function getLastMessage(endpointId) {
        const endpointMessages = messages.get(endpointId);
        if (endpointMessages.length < 1) {
            return null;
        }
        
        return endpointMessages[endpointMessages.length - 1];
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Messages</Text>
            <View style={styles.messagesList}>
                <FlatList
                    renderItem={({item}) => (
                        <MessageItem endpointId={item} lastMessage={getLastMessage(item)}/>
                    )}
                    data={[...messages.keys()]}
                />
            </View>
        </View>
    );
}

const MessageStack = createNativeStackNavigator();

export default function OfflineModeMessageScreen({messages, setMessages}) {
    return (
    <MessageStack.Navigator initialRouteName="OfflineModeMessage" screenOptions={{headerShown: false}}>
        <MessageStack.Screen name="OfflineModeMessage" options={{animation: "fade"}}> 
            {() => (<OfflineModeMessage messages={messages} setMessages={setMessages}/>)}
        </MessageStack.Screen>
        <MessageStack.Screen name="OfflineModeDM" options={{animation: "fade"}}>
            {() => (<OfflineModeDM messages={messages} setMessages={setMessages}/>)}
        </MessageStack.Screen>
    </MessageStack.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: Colors.background,
    },
    messagesList: {
        height: "auto",
        width: "100%",
    },
    header: {
        marginBottom: 20,
        fontFamily: "OpenSans",
        fontSize: 32,
        color: Colors.snow,
    },
    messageItem: {
        marginBottom: 10,
        height: "auto",
        width: "100%",
        padding: 15,
        backgroundColor: Colors.containerBackground,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    messageItemId: {
        fontFamily: "OpenSans",
        fontSize: 14,
        color: Colors.snow,
        fontWeight: 900,
    },
    messageItemLast: {
        fontFamily: "OpenSans",
        fontSize: 10,
        color: Colors.gray,
        fontWeight: 900,
    }
})