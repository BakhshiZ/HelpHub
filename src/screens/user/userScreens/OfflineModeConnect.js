import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { Text } from "react-native-paper";
import Button from "../components/Button";
import * as Colors from "../styles/Colors";

import * as Nearby from "../../../../modules/helphub-nearby"

export default function OfflineModeConnect({searching, setSearching}) {
    // Start searching for devices (i.e start advertising and discovering)
    const startSearch = () => {
        Nearby.startAdvertising(userName);
        Nearby.startDiscovery();
        setSearching(true);
    }

    // stop searching for devices (i.e stop advertising and discovering)
    const stopSearch  = () => {
        Nearby.stopAdvertising();
        Nearby.stopDiscovery();
        setSearching(false);
    }
    
    return (
        <View style={styles.container}>
            <Text>lol</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    }
})