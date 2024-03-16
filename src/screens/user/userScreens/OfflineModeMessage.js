import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { Text } from "react-native-paper";
import * as Colors from "../styles/Colors"
import { ScrollView } from "react-native-gesture-handler";

function MessageItem({endpointId, lastMessage}) {
    return (
        <View style={styles.messageItem}>
            <Text style={styles.messageItemId}>{endpointId}</Text>
            <Text style={styles.messageItemLast}>{(lastMessage === null) ? "No messages yet.": lastMessage}</Text>
        </View>
    );
} 

export default function OfflineModeMessage({messages, setMessages}) {
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
                />
            </View>
        </View>
    );
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
        backgroundColor: Colors.containerBackground,
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
        padding: 20,
        backgroundColor: Colors.containerBackground,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    messageItemId: {
        fontFamily: "OpenSans",
        fontSize: 14,
        color: Colors.purple,
        fontWeight: 900,
    },
    messageItemLast: {
        fontFamily: "OpenSans",
        fontSize: 10,
        color: Colors.gray,
        fontWeight: 900,
    }
})