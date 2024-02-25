import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to HelphubNearby.web.ts
// and on native platforms to HelphubNearby.ts
import HelphubNearbyModule from './src/HelphubNearbyModule';
import { ConnectionInfoType, ConnectionResolutionType, DisconnectionType, DiscoveredEndpointType, InfoPayload, PayloadUpdateType, PayloadType } from './src/HelphubNearby.types';


export function sendPayload(endpoint: string, payload: string) {
  HelphubNearbyModule.sendPayload(endpoint, payload);
}

export function startAdvertising(name: string) {
  HelphubNearbyModule.startAdvertising(name);
}

export function stopAdvertising() {
  HelphubNearbyModule.stopAdvertising();
}

export function startDiscovery() {
  HelphubNearbyModule.startDiscovery();
}

export function stopDiscovery() {
  HelphubNearbyModule.stopDiscovery();
}

export function requestConnection(name : string, endpoint: string) {
  HelphubNearbyModule.requestConnection(name, endpoint);
}

export function acceptConnection(endpoint: string) {
  HelphubNearbyModule.acceptConnection(endpoint);
}

export function rejectConnection(endpoint: string) {
  HelphubNearbyModule.rejectConnection(endpoint);
}

export function disconnect(endpoint: string) {
  HelphubNearbyModule.disconnect(endpoint);
}

export function getMessages() {
  return HelphubNearbyModule.getMessages();
}

export function getEndpointMessage(endpoint: string) {
  return HelphubNearbyModule.getEndpointMessage(endpoint)
}

export function getDiscoveredEndpoints() {
  return HelphubNearbyModule.getDiscoveredEndpoints();
}

const emitter = new EventEmitter(HelphubNearbyModule);

export function addDeviceDiscoveryListener(listener: (event: DiscoveredEndpointType) => void) : Subscription {
  return emitter.addListener("onNewDeviceDiscovered", listener);
}

export function addConnectionUpdateListener(listener: (event: ConnectionResolutionType) => void) : Subscription {
  return emitter.addListener("onConnectionUpdate", listener);
}

export function addPayloadUpdateListener(listener: (event: PayloadUpdateType) => void) : Subscription {
  return emitter.addListener("onPayloadTransferUpdate", listener);
}

export function addNewConnectionListener(listener: (event: ConnectionInfoType) => void) : Subscription {
  return emitter.addListener("onNewConnectionInitiated", listener);
}

export function addDisconnectionListener(listener: (event: DisconnectionType) => void) : Subscription {
  return emitter.addListener("onDisconnection", listener);
}
  
export function addPayloadReceivedListener(listener: (event: PayloadType) => void) : Subscription {
  return emitter.addListener("onPayloadReceived", listener);
}