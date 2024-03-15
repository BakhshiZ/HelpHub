import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Alert } from 'react-native';
import {useEffect, useContext, useState} from "react";
import * as Colors from "../styles/Colors";
import { NavigationContainer } from '@react-navigation/native';
import OfflineModeMap from './OfflineModeMap';
import OfflineModeConnect from './OfflineModeConnect';
import Icon from "@expo/vector-icons/MaterialIcons"
import OfflineModeMessage from './OfflineModeMessage';

import * as Nearby from "../../../../modules/helphub-nearby";

const Tab = createBottomTabNavigator();

export default function OfflineModeMain() {
        // Discovered devices
        [discoveredDevices, setDiscoveredDevices] = useState(null);

        // Connected devices
        [connectedDevices, setConnectedDevices] = useState([null]);
    
        // Username
        [userName, setUserName] = useState("HelphubUser");
    
        // Whether we have showed the warning for the users
        [warned, setWarned] = useState(false);
    
        [searching, setSearching] = useState(false);
    
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
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                headerShown: false,
                tabBarShowLabel: false,
            }}
            initialRouteName='OMMap'
        >

            <Tab.Screen 
                name="OMConnections"
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon name="wifi" size={35} color={focused ? Colors.magenta : Colors.snow}/>
                    )
                }}
            >
                {() => (<OfflineModeConnect />)}
            </Tab.Screen>

            <Tab.Screen 
                name="OMMap"
                component={OfflineModeMap} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon name="pin-drop" size={50} color={focused ? Colors.magenta : Colors.snow}/>
                    )
                }}
            />

            <Tab.Screen 
                name="OMMessage"
                component={OfflineModeMessage} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon name="chat" size={35} color={focused ? Colors.magenta : Colors.snow}/>
                    )
                }}
            />

        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        height: 80,
        backgroundColor: Colors.containerBackground,
        borderTopWidth: 0,
    }
})