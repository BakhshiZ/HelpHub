import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import * as Colors from "../styles/Colors";
import { NavigationContainer } from '@react-navigation/native';
import OfflineModeMap from './OfflineModeMap';
import OfflineModeConnect from './OfflineModeConnect';
import Icon from "@expo/vector-icons/MaterialIcons"
import OfflineModeMessage from './OfflineModeMessage';

const Tab = createBottomTabNavigator();

export default function OfflineModeMain() {
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
                component={OfflineModeConnect} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon name="wifi" size={35} color={focused ? Colors.magenta : Colors.snow}/>
                        )
                }}
            />

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