import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { HelphubNearbyViewProps } from './HelphubNearby.types';

const NativeView: React.ComponentType<HelphubNearbyViewProps> =
  requireNativeViewManager('HelphubNearby');

export default function HelphubNearbyView(props: HelphubNearbyViewProps) {
  return <NativeView {...props} />;
}
