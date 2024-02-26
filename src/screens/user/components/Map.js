/**
 * @file Map.js
 * @brief Contains the Map component for displaying a clustered map with various map types.
 */

import React, { useState } from "react";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { StyleSheet, View } from "react-native";
import { IconButton, Modal, Divider, RadioButton, Button, Text } from "react-native-paper";
import { useStoreState } from "easy-peasy";

/**
 * @brief Map component for displaying a clustered map with various map types.
 * @param {Object} props - Props for the Map component.
 * @param {JSX.Element} props.children - Child components to be rendered on the map.
 * @param {RefObject} props.mapRef - Reference to the map component.
 * @param {Function} props.layoutAnimation - Function to handle layout animation.
 * @param {Function} props.refreshData - Function to refresh map data.
 * @returns {JSX.Element} Map component
 */
export default function Map({ children, mapRef, layoutAnimation, refreshData }) {
  // State variables
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [mapType, setMapType] = useState("standard");
  const { location } = useStoreState((s) => s);

  return (
    <View>
      {/* Render clustered map */}
      <MapView
        clusterColor="#673ab7"
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 8.5,
          longitudeDelta: 8.5,
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        ref={mapRef}
        onLayout={layoutAnimation}
        toolbarEnabled={false}
        mapType={mapType}
        loadingEnabled
      >
        {children}
      </MapView>
      {/* Button to toggle map layers modal */}
      <IconButton
        icon="layers"
        style={[styles.actionButton, styles.layerButton]}
        mode={"contained"}
        iconColor="#646464"
        containerColor="white"
        onPress={showModal}
      />
      {/* Button to refresh map data */}
      <IconButton
        icon="refresh"
        style={[styles.actionButton, styles.refreshButton]}
        mode={"contained"}
        iconColor="#646464"
        containerColor="white"
        onPress={refreshData}
      />
      {/* Modal to change map type */}
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modal}
      >
        <Text variant="headlineSmall">Change Map Type</Text>
        <Divider />
        {/* Radio buttons to select map type */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <View>
            <RadioButton.Item
              value="standard"
              label="Standard"
              status={mapType === "standard" ? "checked" : "unchecked"}
              onPress={() => setMapType("standard")}
            />
            <RadioButton.Item
              value="satellite"
              label="Satellite"
              status={mapType === "satellite" ? "checked" : "unchecked"}
              onPress={() => setMapType("satellite")}
            />
          </View>
          <View>
            <RadioButton.Item
              value="hybrid"
              label="Hybrid"
              status={mapType === "hybrid" ? "checked" : "unchecked"}
              onPress={() => setMapType("hybrid")}
            />
            <RadioButton.Item
              value="terrain"
              label="Terrain"
              status={mapType === "terrain" ? "checked" : "unchecked"}
              onPress={() => setMapType("terrain")}
            />
          </View>
        </View>
        {/* Button to save map type selection */}
        <Button
          icon="check"
          style={{
            alignSelf: "flex-end",
          }}
          onPress={hideModal}
        >
          Save
        </Button>
      </Modal>
    </View>
  );
}

// Styles for the Map component
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  actionButton: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 3.5,
  },
  layerButton: {
    top: 50,
    right: 4,
  },
  refreshButton: {
    top: 100,
    right: 4,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    flexBasis: "auto",
    flexShrink: 1,
    gap: 10,
  },
});
