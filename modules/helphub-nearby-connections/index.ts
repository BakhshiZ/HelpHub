import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to HelphubNearbyConnections.web.ts
// and on native platforms to HelphubNearbyConnections.ts
import HelphubNearbyConnectionsModule from './src/HelphubNearbyConnectionsModule';
import HelphubNearbyConnectionsView from './src/HelphubNearbyConnectionsView';
import { ChangeEventPayload, HelphubNearbyConnectionsViewProps } from './src/HelphubNearbyConnections.types';

// Get the native constant value.
export const PI = HelphubNearbyConnectionsModule.PI;

export function hello(): string {
  return HelphubNearbyConnectionsModule.hello();
}

export async function setValueAsync(value: string) {
  return await HelphubNearbyConnectionsModule.setValueAsync(value);
}

const emitter = new EventEmitter(HelphubNearbyConnectionsModule ?? NativeModulesProxy.HelphubNearbyConnections);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { HelphubNearbyConnectionsView, HelphubNearbyConnectionsViewProps, ChangeEventPayload };
