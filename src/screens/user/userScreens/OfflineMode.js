// React
import { useEffect, useState } from "react";

// UI
import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { Text } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import Dialog from "react-native-dialog";

import * as Nearby from "../../../../modules/helphub-nearby/index";

/**
 * Button Component
 * Can become active (secondary) or inactive (primary).
 * 
 * primary: boolean     -> whether the button is a primary or a secondary button
 * childen: any         -> A react prop for supporting children components, such as text
 * onPress: function    -> Function to call on pressing the button.
 *  */
function NewButton({primary = true, children = null, onPress = null}) {
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


/**
 * Message Dialog
 * A dialog that shows the last message from an endpoint
 * Allows user to send messages.
 * 
 * @param key Unique identifier of the component
 * @param endpointName The name of the endpoint device
 * @param endpointId ID of the endpoint device
 */
const MessageDialog = ({key, endpointName, endpointId}) => {
    [messaging, setMessaging] = useState(false); // Whether client is currently messaging (true or false)
    [message, setMessage] = useState(""); // Message to be sent


    // Send a message via Google Nearby.
    const sendMessage = (payload) => {
        Nearby.sendPayload(endpointId, payload);
        console.log("Message sent to: " + endpointId); // for debug
        setMessaging(false);
    }


    // Cancel message dialog
    const handleCancel = () => {
        setMessaging(false);
    }

    return (
        <Dialog.Container visible={messaging}>
            <Dialog.Title>Messaging</Dialog.Title>
            <Dialog.Description>
                Last Message from {endpointName}: {Nearby.getEndpointMessage(endpointId)};
            </Dialog.Description>
            <Dialog.Input label="Message to be sent" onChangeText={(text) => setMessage(text)}/>
            <Dialog.Button label="Cancel" onPress={handleCancel}/>
            <Dialog.Button label="Send" onPress={() => sendMessage(message)}/>
        </Dialog.Container>
    )
}

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

    // Open messaging panel
    const openMessagingPanel = () => {
        setMessaging(true);
    }

    return (
        <>
            <MessageDialog key={key} endpointId={endpointId} endpointName={endpointName}/>
            <Menu>
                <MenuTrigger>
                    <View style={{...styles.deviceListItem, backgroundColor: isConnected() ? "#A1EEBD" : "#46424f"}}>
                        <Text style={styles.deviceListItemText}>{endpointName}</Text>
                        <Text style={styles.deviceListItemText}>{endpointId}</Text>
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
                                    <MenuOption text="Message" onSelect={openMessagingPanel}/>
                                </>
                            )
                    }
                </MenuOptions>
            </Menu>
        </>
    );
}

export default function OfflineMode() {
    // Discovered devices
    [discoveredDevices, setDiscoveredDevices] = useState(null);

    // Connected devices
    [connectedDevices, setConnectedDevices] = useState([null]);

    // Username
    [userName, setUserName] = useState("HelphubUser");

    // Whether we have showed the warning for the users
    [warned, setWarned] = useState(false);

    // Whether device is advertising
    [advertising, setAdvertising] = useState(false);

    // Whether device is discovering
    [discovering, setDiscovering] = useState(false);

    // Selected device (i.e to connect)
    [selected, setSelected] = useState(null);

    // Adds a device to connectedDevices ONLY IF it is not there
    function setConnectedDevicesUnique(endpoint) {
        if(!connectedDevices.includes(endpoint)) {
            setConnectedDevices([...connectedDevices, endpoint]);
        }
    };

    // Show a warning about app switching to offline mode
    if (!warned) {
        Alert.alert(
            "No internet connection!",
            "App will now switch to offline mode."
        );
        setWarned(true);
    }


    // Start advertising.
    const startAdvertising = () => {
        Nearby.startAdvertising(userName);
        setAdvertising(true);
    }

    // Stop advertising
    const stopAdvertising = () => {
        Nearby.stopAdvertising();
        setAdvertising(false);
    }

    // Start discovery
    const startDiscovering = () => {
        Nearby.startDiscovery();
        setDiscovering(true);
    }

    // Stop discovery
    const stopDiscovering = () => {
        Nearby.stopDiscovery();
        setDiscovering(false);
    }

    // Start searching for devices (i.e start advertising and discovering)
    const startSearch = () => {
        Nearby.startAdvertising(userName);
        Nearby.startDiscovery();
        setDiscovering(true);
        setAdvertising(true);
    }

    // stop searching for devices (i.e stop advertising and discovering)
    const stopSearch  = () => {
        Nearby.stopAdvertising();
        Nearby.stopDiscovery();
        setAdvertising(false);
        setDiscovering(false);
    }

    // const navigation = useNavigation();

    /* 
    useEffect(() => {
        const subscription = NetInfo.addEventListener((state) => {
            if (state.isInternetReachable === true) {
                Alert.alert(
                    "Internet found!",
                    "App will now switch to normal mode"
                )
    
                // navigation.navigate("Login_Screen");
            }
        });

        return () => subscription();
    }, [])

    */

    // Subscriptions for listening various events
    useEffect(() => {
        // Informs when we discover a new devices
        const onNewDeviceDiscovered = Nearby.addDeviceDiscoveryListener((event) => {
            // Get currently discovered devices
            setDiscoveredDevices(Nearby.getDiscoveredEndpoints());
            console.log(discoveredDevices);
        });

        // Informs when a new connection is initiated (by user or someone else)
        const onConnectionInitiated = Nearby.addNewConnectionListener((event) => {
            if (event.isIncomingConnection) {
                Alert.alert(
                    "Connection Request",
                    "A connection from " + event.endpointName + " was requested. Authentication token: " + event.authenticationToken,
                    [
                        {
                            text: "Accept",
                            onPress: () => {Nearby.acceptConnection(event.endpointId); setConnectedDevicesUnique([...connectedDevices, event.endpointId]);},
                        },
                        {
                            text: "Reject",
                            onPress: () => {Nearby.rejectConnection(event.endpointId)},
                        }
                    ]
                )
            }
            else {
                Alert.alert(
                    "Connection Request",
                    "Authentication token for your request" + event.authenticationToken,
                    [
                        {
                            text: "Accept",
                            onPress: () => {Nearby.acceptConnection(event.endpointId); setConnectedDevicesUnique([...connectedDevices, event.endpointId]);},
                        },
                        {
                            text: "Reject",
                            onPress: () => {Nearby.rejectConnection(event.endpointId)},
                        }
                    ]
                )
            }
        });

        // Informs on connection updates (e.g connection lost, succesful)
        const onConnectionUpdate = Nearby.addConnectionUpdateListener((event) => {
            console.log(event.status);
            switch (event.status) {
                case 0:
                    Alert.alert("Connection Successful", "You successfully connected to endpoint " + event.endpointId, [{text: "OK"}]);
                    setConnectedDevices([...connectedDevices, event.endpointId]);
                    break;
                case 15:
                    Alert.alert("Connection Failed", "Timeout while trying to connect. Error code: " + event.status, [{text: "OK"}]);
                    setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
                    break;
                case 16:
                    Alert.alert("Connection Lost", "Connection was cancelled. Error code: " + event.status, [{text: "OK"}]);
                    setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
                    break;
                case 7:
                    Alert.alert("Connection Lost", "A network error occurred. Please try again. Error code: " + event.status, [{text: "OK"}]);
                    setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
                    break;
                case 15:
                    Alert.alert("Connection Failed", "Timeout while trying to connect. Error code: " + event.status, [{text: "OK"}]);
                    break;
                case 13: 
                    Alert.alert("Connection Lost", "Disconnected. Error code: " + event.status, [{text: "OK"}]);
                    setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
                    break;
            };
            
            // Informs when a device is disconnected
            const onDisconnected = Nearby.addDisconnectionListener((event) => {
                Alert.alert("Connection Lost", "Disconnected.", [{text: "OK"}]);
                setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
            })

            // Informs a payload (message) is received
            const onPayloadReceived = Nearby.addPayloadReceivedListener((event) => {
                Alert.alert("Received Message", "From: " + event.endpointId + "\n" + event.message);
            })
        })
    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.safeArea}>
                <Text style={styles.header}>Offline Mode</Text>
                <View style={styles.deviceList}>
                    <FlatList 
                        renderItem={({item}) => {
                            return <NearbyDevice
                            key={item.id}
                            endpointId={item.id} 
                            endpointName={item.name} 
                            userName={userName} 
                            connectedDevices={connectedDevices} 
                            setConnectedDevices={setConnectedDevices}/>;
                        }}
                        data={discoveredDevices}
                    >
                    </FlatList>
                </View>
                <View style={styles.buttonContainer}>
                    <NewButton primary={!discovering}
                        onPress={(discovering ? stopSearch : startSearch)}>
                        <Text>Search</Text>
                    </NewButton>
                </View>
                <Text style={{color: "white"}}>Username: {selected}</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Type your name here."
                    onChangeText={newText => setUserName(newText)}
                    defaultValue={userName}
                />
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1625",
    },
    safeArea: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        marginTop: 20,
    },
    header: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#e0e0e0",
        textAlign: "center",
    },
    deviceList: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        borderColor: "#46424f",
        borderRadius: 5,
        borderWidth: 1,
        elevation: 5,
        width: "100%",
        flex: 4,
    },
    deviceListItem: {
        margin: "auto",
        padding: 10,
        backgroundColor: "#46424f",
        borderColor: "#2f2b3a",
        borderWidth: 1,
        borderRadius: 5,
        width: "100%",
        height: 60,
        color: "white",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonPrimary: {
        width: 140,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: "#3FC1C9",
    },
    buttonPressed: {
        width: 140,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: "#AFAFAF",
    },
    buttonSecondary: {
        width: 140,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: "#FC5185",
    },
    nameInput: {
        height: 50,
        paddingHorizontal: 10,
        borderColor: "#2f2b3a",
        borderWidth: 1,
        borderRadius: 5,
        color: "gray",
    },
    deviceListItemText: {
        color: "white",
    }
})
