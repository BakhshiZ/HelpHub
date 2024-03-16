import { View, StyleSheet, Alert, FlatList, Pressable, TextInput, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import Button from "../components/Button";
import * as Colors from "../styles/Colors";
import Icon from "@expo/vector-icons/MaterialIcons";

import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

import * as Nearby from "../../../../modules/helphub-nearby"

/**
 * Nearby Device
 * A render component that displays the ID and the name of a Nearby device
 * Has pop-up menus that allow for connection, disconnection, and messaging 
 * @param key Unique identifier of the component
 * @param endpointName Name of the endpoint device
 * @param endpointId ID of the endpoint device
 * @param userName Name of the user
 * @param connectedDevices An array that contains the endpointId's of all 
 * connected devices via Nearby
 * @param setConneectedDevices React state function to set connectedDevices array
 */
const NearbyDevice = ({key, endpointName, endpointId, userName, connectedDevices, setConnectedDevices}) => {
    const DiscoveredDeviceInfo = () => {
        return (
            <View style={styles.listItemWrapper}>
                <Icon name="wifi" color={Colors.gray} size={35}/>
                <View style={styles.deviceListItemTextWrapper}>    
                    <Text style={styles.discoveredTextCode}>{endpointName}</Text>
                    <Text style={styles.textInfo}>{endpointId}, not connected.</Text>
                </View>
            </View>
        );
    }

    const ConnectedDeviceInfo = () => {
        return (
            <View style={styles.listItemWrapper}>
                <Icon name="wifi" color={Colors.purple} size={35}/>
                <View style={styles.deviceListItemTextWrapper}>    
                    <Text style={styles.connectedTextCode}>{endpointName}</Text>
                    <Text style={styles.textInfo}>{endpointId}, connected.</Text>
                </View>
            </View>
        );
    }

    // Check if the endpoint is connected
    const isConnected = () => {
        return connectedDevices.includes(endpointId);
    }
    
    // Request connection to the endpoint
    const requestConnection = () => {
        Nearby.requestConnection(userName, endpointId);
        Alert.alert("Connection Request", "Connection request was sent to " + endpointId);
    };

    // Disconnect from an endpoint
    const disconnectFromEndpoint = () => {
        Nearby.disconnect(endpointId);
        setConnectedDevices(connectedDevices.filter(function(e) {return e !== endpointId}));
    }

    return (
        <>
            <Menu>
                <MenuTrigger>
                    <View style={styles.deviceListItem}>
                        <View style={styles.listItemWrapper}>
                            {!isConnected() ? (<DiscoveredDeviceInfo/>) : (<ConnectedDeviceInfo/>)}
                        </View>
                    </View>
                </MenuTrigger>
                <MenuOptions>
                    {
                        !isConnected() ? 
                            (<MenuOption text="Connect" onSelect={requestConnection}/>)
                                : 
                            (   
                                <>
                                    <MenuOption text="Disconnect" onSelect={disconnectFromEndpoint}/>
                                </>
                            )
                    }
                </MenuOptions>
            </Menu>
        </>
    );
}

const DiscoveredDevices = ({connectedDevices, setConnectedDevices, discoveredDevices}) => {
    return (
        <View style={styles.listContainer}>
            <Text style={styles.smallTitle}>Discovered Devices</Text>
            <View style={styles.list}>
                <FlatList 
                        renderItem={({item}) => (
                            <NearbyDevice
                                key={item.id}
                                endpointId={item.id} 
                                endpointName={item.name} 
                                userName={userName}
                                connectedDevices={connectedDevices} 
                                setConnectedDevices={setConnectedDevices}/>
                        )}
                        data={discoveredDevices}
                    />
            </View>
        </View>
    );
}

export default function OfflineModeConnect({searching, setSearching, connectedDevices, setConnectedDevices, discoveredDevices, userName, setUserName}) {
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
            <DiscoveredDevices connectedDevices={connectedDevices} setConnectedDevices={setConnectedDevices} discoveredDevices={discoveredDevices}/>
            <View style={styles.buttonContainer}>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Type your name here."
                    onChangeText={newText => setUserName(newText)}
                    defaultValue={userName}
                    placeholderTextColor={Colors.snow}
                    editable={!searching}
                />
                <Button primary={!searching}
                        onPress={(searching ? stopSearch : startSearch)}>
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
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
    },
    listContainer: {
        flex: 5,
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
    },
    nameInput: {
        fontFamily: "OpenSans",
        fontSize: 10,
        color: Colors.snow,
        height: 40,
        width: 150,
        backgroundColor: Colors.containerBackground,
        opacity: 0.5, 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.gray,
        paddingHorizontal: 10,
    },
    deviceListItem: {
        backgroundColor: "transparent",
        height: 50,
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    listItemWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        height: 35,
    },
    deviceListItemTextWrapper: {
        flexDirection: "column",
        justifyContent: "space-between",
        marginLeft: 15,
    },
    discoveredTextCode: {
        fontFamily: "OpenSans",
        fontSize: 14,
        fontWeight: 900,
        color: Colors.snow,
    },
    textInfo: {
        fontFamily: "OpenSans",
        fontSize: 10,
        fontWeight: 900,
        color: Colors.gray,
    },
    connectedTextCode: {
        fontFamily: "OpenSans",
        fontSize: 14,
        fontWeight: 900,
        color: Colors.brightPurple,        
    },
})