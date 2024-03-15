import { View, StyleSheet, Alert, FlatList, Pressable, TextInput, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import Button from "../components/Button";
import * as Colors from "../styles/Colors";

import * as Nearby from "../../../../modules/helphub-nearby"

const ConnectedDevices = ({connectedDevices}) => {
    return (
        <View style={styles.listContainer}>
            <Text style={styles.smallTitle}>Connected Devices</Text>
            <View style={styles.list}>
            </View>
        </View>
    );
}

const DiscoveredDevices = ({discoveredDevices}) => {
    return (
        <View style={styles.listContainer}>
            <Text style={styles.smallTitle}>Discovered Devices</Text>
            <View style={styles.list}>
            </View>
        </View>
    );
}

export default function OfflineModeConnect({searching, setSearching, connectedDevices, discoveredDevices}) {
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
            <ConnectedDevices />
            <DiscoveredDevices />
            <View style={styles.buttonContainer}>
                <Button>
                    <Text style={styles.buttonText}>Search</Text>
                </Button>
            </View>
        </View>
    );
}

const dimScreen  = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.background,
        padding: 20,
        paddingTop: 40,
    },
    buttonContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    listContainer: {
        flex: 2.5,
        width: "100%",
        marginBottom: 40,
    },
    list: {
        height: "100%",
        backgroundColor: Colors.containerBackground,
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 10,
        opacity: 0.5,
    },
    smallTitle: {
        fontSize: 14,
        fontWeight: 900,
        color: Colors.gray,
        margin: 5,
    },
    buttonText: {
        fontFamily: "OpenSans",
        fontSize: 16,
        color: Colors.snow,
        fontWeight: 900,
    }
})