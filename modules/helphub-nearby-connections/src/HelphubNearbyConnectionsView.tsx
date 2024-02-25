import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { HelphubNearbyConnectionsViewProps } from './HelphubNearbyConnections.types';

const NativeView: React.ComponentType<HelphubNearbyConnectionsViewProps> =
  requireNativeViewManager('HelphubNearbyConnections');

export default function HelphubNearbyConnectionsView(props: HelphubNearbyConnectionsViewProps) {
  return <NativeView {...props} />;
}
