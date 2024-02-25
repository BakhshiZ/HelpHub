import * as React from 'react';

import { HelphubNearbyConnectionsViewProps } from './HelphubNearbyConnections.types';

export default function HelphubNearbyConnectionsView(props: HelphubNearbyConnectionsViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
