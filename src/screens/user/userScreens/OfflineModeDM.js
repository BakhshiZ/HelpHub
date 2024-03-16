import { View, StyleSheet, Alert, FlatList, Pressable, TextInput, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import * as Colors from "../styles/Colors"
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

import * as Nearby from "../../../../modules/helphub-nearby";


function ReceivedMessageBubble({endpointId, message}) {
    return (
        <View style={styles.bubbleContainerReceived}>
            <Text style={styles.fromReceived}>{endpointId}</Text>
            <Text style={styles.contentReceived}>{message}</Text>
        </View>
    )
}

function SentMessageBubble({message}) {
    return (
        <View style={styles.bubbleContainerSent}>
            <Text style={styles.fromSent}>You</Text>
            <Text style={styles.contentSent}>{message}</Text>
        </View>
    )
}

export default function OfflineModeDM({messages, setMessages}) {
    const route = useRoute();

    [message, setMessage] = useState("");

    const {endpointId} = route.params;

    const render = (data) => {
        if (data.from === "You") {
            return <SentMessageBubble message={data.message}/>
        }
        else {
            return <ReceivedMessageBubble endpointId={data.from} message={data.message}/>
        }
    };

    const sendMessage = (payload) => {
        if (payload.length > 0){
            Nearby.sendPayload(endpointId, payload);
            setMessages(new Map(messages.set(endpointId, [...messages.get(endpointId), {from: "You", message: payload}])));
            setMessage("");
            console.log("Message sent to: " + endpointId); // for debug
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Messages Details</Text>
            <View style={styles.messagePanel}>
                <View style={styles.messages}>
                    <FlatList renderItem={({item}) => render(item)}
                              data={messages.get(endpointId)}/>
                </View>
                <View style={styles.input}>
                    <TextInput
                        style={styles.messageInput}
                        placeholder="Type a message here"
                        onChangeText= {newText => setMessage(newText)}
                        placeholderTextColor={Colors.snow}
                        value={message}
                    />
                    <Pressable onPressOut={() => sendMessage(message)}>
                        <Icon name="send" color={Colors.snow} size={30}/>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const dimScreen = Dimensions.get("screen");

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
    header: {
        marginBottom: 20,
        fontFamily: "OpenSans",
        fontSize: 32,
        color: Colors.snow,
    },
    messagePanel: {
        backgroundColor: Colors.containerBackground,
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "column",
        justifyContent: "space-between",
        height: "90%",
        width: "100%",
        paddingTop: 20,
        paddingHorizontal: 10,
        opacity: 0.5,
    },
    messages: {
        flex: 5.5,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    input: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 15,
    },
    messageInput: {
        height: 40,
        width: "80%",
        backgroundColor: Colors.containerBackground,
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: Colors.snow,
    },
    bubbleContainerReceived: {
        height: "auto",
        width: "100%",
        backgroundColor: Colors.containerBackground,
        padding: 10,
        flexShrink: 1,
        borderWidth: 0,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "flex-end",
    },
    fromReceived: {
        fontFamily: "OpenSans",
        fontSize: 14,
        color: Colors.brightPurple,
        textAlign: "right",
        fontWeight: 900,
    },    
    contentReceived: {
        fontFamily: "OpenSans",
        fontSize: 10,
        color: Colors.snow,
        fontWeight: 900,
        textAlign: "right",
    },
    bubbleContainerSent: {
        height: "auto",
        width: "100%",
        backgroundColor: Colors.containerBackground,
        padding: 10,
        flexShrink: 1,
        borderWidth: 0,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "flex-start",
    },
    fromSent: {
        fontFamily: "OpenSans",
        fontSize: 14,
        color: Colors.brightPurple,
        textAlign: "left",
        fontWeight: 900,
    },    
    contentSent: {
        fontFamily: "OpenSans",
        fontSize: 10,
        color: Colors.snow,
        fontWeight: 900,
        textAlign: "left",
    },
})