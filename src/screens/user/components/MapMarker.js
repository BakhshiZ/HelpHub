/**
 * @file MapMarker.js
 * @brief Contains the MapMarker component for displaying markers on a map.
 */

import React from "react";
import { Marker } from "react-native-maps";

/**
 * @brief MapMarker component for displaying markers on a map.
 * @param {Object} props - Props for the MapMarker component.
 * @param {Object} props.marker - Marker object containing information about the marker.
 * @param {number} props.index - Index of the marker.
 * @param {Function} props.onPress - Function to handle marker press event.
 * @param {Function} props.onCalloutPress - Function to handle marker callout press event.
 * @returns {JSX.Element} MapMarker component.
 */
export default function MapMarker({ marker, index, onPress, onCalloutPress }) {
  return (
    <Marker
      key={index}
      coordinate={marker.latlng}
      title={marker.title}
      description={"Click to see more details !"}
      identifier={marker.id}
      onPress={onPress}
      onCalloutPress={onCalloutPress}
    />
  );
}
