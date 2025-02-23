import React, { useState, useEffect, useMemo } from "react";
import { View, Text, SafeAreaView, FlatList, Modal, TouchableOpacity, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { router } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker, Circle, Region } from "react-native-maps";
import * as SecureStore from "expo-secure-store";
import { groupBy, sumBy, maxBy } from 'lodash';

// Import the API function
import { useGetNearbyFarmers } from "@/api/rewardService"; 

// Configurable geofence radius (in kilometers)
const GEO_FENCE_RADIUS = 10; 

// Interface for farmer data
interface Farmer {
  id: number;
  farmer_ref: string;
  farmer_name: string;
  lat: number;
  long: number;
  vegetable_ref: string;
  vegetable_name: string;
  amount: number;
  distance: number;
}

// Interface for vegetable analytics
interface VegetableAnalytics {
  vegetable_name: string;
  total_amount: number;
  farmer_count: number;
}

export default function NearByFarmersData() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [nearbyFarmers, setNearbyFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  
  // Collapsible states
  const [isAnalyticsCollapsed, setIsAnalyticsCollapsed] = useState(true);
  const [isFarmersListCollapsed, setIsFarmersListCollapsed] = useState(true);
  
  // Full screen state
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      // Get current location
      try {
        let loc = await Location.getCurrentPositionAsync({});
        const currentLocation = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setLocation(currentLocation);

        // Set initial map region
        setMapRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        // Fetch nearby farmers
        const farmersResponse = await useGetNearbyFarmers(
          currentLocation.latitude, 
          currentLocation.longitude, 
          GEO_FENCE_RADIUS
        );

        // Handle the API response structure
        if (farmersResponse) {
          setNearbyFarmers(farmersResponse);
        } else {
          console.error('Failed to fetch nearby farmers');
        }
      } catch (error) {
        console.error("Error getting location or farmers", error);
        alert("Could not retrieve your current location or nearby farmers");
      }
    })();
  }, []);

  useEffect(() => {
    // Retrieve user data from secure storage
    SecureStore.getItemAsync("user").then((user) => {
      if (user) {
        setUser(JSON.parse(user));
      }
    });
  }, []);

  // Compute vegetable analytics
  const vegetableAnalytics = useMemo(() => {
    if (nearbyFarmers.length === 0) return [];

    // Group farmers by vegetable
    const groupedVegetables = groupBy(nearbyFarmers, 'vegetable_name');

    // Compute analytics for each vegetable
    return Object.entries(groupedVegetables).map(([vegetable_name, farmers ] : [any, any]) => ({
      vegetable_name,
      total_amount: sumBy(farmers, 'amount'),
      farmer_count: farmers.length
    })).sort((a, b) => b.total_amount - a.total_amount);
  }, [nearbyFarmers]);

  // Get the most planted vegetable
  const mostPlantedVegetable = useMemo(() => {
    return vegetableAnalytics.length > 0 ? vegetableAnalytics[0] : null;
  }, [vegetableAnalytics]);

  // Get farmer with most vegetable amount
  const farmerWithMostVegetables = useMemo(() => {
    return nearbyFarmers.length > 0 ? maxBy(nearbyFarmers, 'amount') : null;
  }, [nearbyFarmers]);

  const renderFarmerMarkers = () => {
    return nearbyFarmers.map((farmer) => (
      <Marker
        key={farmer.id}
        coordinate={{
          latitude: farmer.lat,
          longitude: farmer.long,
        }}
        pinColor="green"
        title={farmer.farmer_name}
        description={`${farmer.vegetable_name} - ${farmer.amount} kg`}
        onPress={() => setSelectedFarmer(farmer)}
      />
    ));
  };

  const FarmerDetailModal = () => {
    if (!selectedFarmer) return null;

    return (
      <Modal
        visible={!!selectedFarmer}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedFarmer(null)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">{selectedFarmer.farmer_name}</Text>
            <Text>Vegetable: {selectedFarmer.vegetable_name}</Text>
            <Text>Amount: {selectedFarmer.amount} kg</Text>
            <Text>Distance: {(selectedFarmer.distance / 1000).toFixed(2)} km</Text>
            <TouchableOpacity 
              className="mt-4 p-2 bg-blue-500 rounded"
              onPress={() => setSelectedFarmer(null)}
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleRegionChangeComplete = (region: Region) => {
    // Allow the map to be manually moved without snapping back
    setMapRegion(region);
  };

  const CollapsibleSection = ({ 
    title, 
    isCollapsed, 
    setIsCollapsed, 
    children 
  } : {
    title: string;
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    children: React.ReactNode;
  }) => (
    <View className="bg-gray-100 mb-2">
      <TouchableOpacity 
        className="flex-row justify-between items-center p-3 bg-gray-200"
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <ThemedText type="subtitle">{title}</ThemedText>
        <AntDesign 
          name={isCollapsed ? "down" : "up"} 
          size={20} 
          color="black" 
        />
      </TouchableOpacity>
      {!isCollapsed && (
        <View className="p-3">
          {children}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.replace("/(root)/(screens)/rewards")}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-black ml-2 text-lg">Back</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <ThemedText type="title" className="px-4 mb-2">
          Nearby Farmers Map
        </ThemedText>

        <View 
          className="flex-1" 
          style={{ 
            height: isFullScreen ? Dimensions.get('window').height : 400 
          }}
        >
          {location && mapRegion ? (
            <>
              <MapView
                style={{ flex: 1  }}
                region={mapRegion}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Your Location"
                  description="Your current location"
                  pinColor="blue"
                />
                <Circle
                  center={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  radius={GEO_FENCE_RADIUS * 1000} 
                  fillColor="rgba(0, 0, 255, 0.1)"
                  strokeColor="rgba(0, 0, 255, 0.5)"
                  strokeWidth={2}
                />
                {renderFarmerMarkers()}
              </MapView>
              
              {/* Full Screen Toggle Button */}
              {/* <TouchableOpacity
                className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg"
                onPress={() => setIsFullScreen(!isFullScreen)}
              >
                <Ionicons 
                  name={isFullScreen ? "contract" : "expand"} 
                  size={24} 
                  color="black" 
                />
              </TouchableOpacity> */}

              <FarmerDetailModal />
            </>
          ) : (
            <Text className="text-center">Loading map...</Text>
          )}
        </View>

        {/* Analytics Section */}
        <CollapsibleSection
          title="Farmer Analytics"
          isCollapsed={isAnalyticsCollapsed}
          setIsCollapsed={setIsAnalyticsCollapsed}
        >
          {mostPlantedVegetable && (
            <View className="mb-2">
              <Text className="font-bold">Most Planted Vegetable</Text>
              <Text>{mostPlantedVegetable.vegetable_name}</Text>
              <Text>Total Amount: {mostPlantedVegetable.total_amount.toFixed(2)} kg</Text>
              <Text>Number of Farmers: {mostPlantedVegetable.farmer_count}</Text>
            </View>
          )}

          {farmerWithMostVegetables && (
            <View className="mb-2">
              <Text className="font-bold">Farmer with Most Vegetables</Text>
              <Text>{farmerWithMostVegetables.farmer_name}</Text>
              <Text>Vegetable: {farmerWithMostVegetables.vegetable_name}</Text>
              <Text>Amount: {farmerWithMostVegetables.amount.toFixed(2)} kg</Text>
            </View>
          )}

          <ThemedText type="subtitle" className="mt-2 mb-2">
            Vegetable Breakdown
          </ThemedText>
          <FlatList
            data={vegetableAnalytics}
            keyExtractor={(item) => item.vegetable_name}
            renderItem={({ item }) => (
              <View className="border-b border-gray-200 p-2">
                <Text className="font-bold">{item.vegetable_name}</Text>
                <Text>Total Amount: {item.total_amount.toFixed(2)} kg</Text>
                <Text>Farmers: {item.farmer_count}</Text>
              </View>
            )}
          />
        </CollapsibleSection>

        {/* Nearby Farmers List */}
        <CollapsibleSection
          title={`Nearby Farmers (${nearbyFarmers.length})`}
          isCollapsed={isFarmersListCollapsed}
          setIsCollapsed={setIsFarmersListCollapsed}
        >
          <FlatList
            data={nearbyFarmers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="border-b border-gray-200 p-2">
                <Text className="font-bold">{item.farmer_name}</Text>
                <Text>Vegetable: {item.vegetable_name}</Text>
                <Text>Amount: {item.amount} kg</Text>
                <Text>Distance: {(item.distance / 1000).toFixed(2)} km</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-500">
                No nearby farmers found
              </Text>
            }
          />
        </CollapsibleSection>
      </View>

      <View className="p-4 bg-white border-t border-gray-200">
        <ThemedButton
          label="Go Back"
          onPress={() => router.replace("/(root)/(screens)/rewards")}
          variant="primary"
          textStyle="text-lg"
        />
      </View>
    </SafeAreaView>
  );
}