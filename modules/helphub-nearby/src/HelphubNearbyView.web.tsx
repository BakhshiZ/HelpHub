import * as React from 'react';

import { HelphubNearbyViewProps } from './HelphubNearby.types';

export default function HelphubNearbyView(props: HelphubNearbyViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
