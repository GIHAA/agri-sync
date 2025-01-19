import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, Text, SafeAreaView, FlatList, Modal } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import * as SecureStore from "expo-secure-store";

// Import the API function
import { useGetNearbyFarmers } from "@/api/rewardService"; 

// Configurable geofence radius (in kilometers)
const GEO_FENCE_RADIUS = 5; 

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

export default function NearByFarmersData() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [nearbyFarmers, setNearbyFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

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

        // Fetch nearby farmers
        const farmersResponse = await useGetNearbyFarmers(
          currentLocation.latitude, 
          currentLocation.longitude, 
          GEO_FENCE_RADIUS
        );

        // Handle the API response structure
        if (farmersResponse ) {
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
        <View className="flex-1 justify-center items-center  bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">{selectedFarmer.farmer_name}</Text>
            <Text>Vegetable: {selectedFarmer.vegetable_name}</Text>
            <Text>Amount: {selectedFarmer.amount} kg</Text>
            <Text>Distance: {(selectedFarmer.distance / 1000).toFixed(2)} km</Text>
            <Pressable 
              className="mt-4 p-2 bg-blue-500 rounded"
              onPress={() => setSelectedFarmer(null)}
            >
              <Text className="text-white text-center">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        <Pressable
          className="flex-row items-center mb-4"
          onPress={() => router.replace("/(root)/(screens)/rewards")}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-black ml-2 text-lg">Back</Text>
        </Pressable>

        <View>
          <ThemedText type="title" className="mb-4">
            Nearby Farmers Map
          </ThemedText>

          <View style={{ height: 400, marginBottom: 16 }}>
            {location ? (
              <>
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  showsUserLocation={true}
                  followsUserLocation={true}
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
                <FarmerDetailModal />
              </>
            ) : (
              <Text>Loading map...</Text>
            )}
          </View>

          {/* Nearby Farmers List */}
          <ThemedText type="subtitle" className="mb-2">
            Nearby Farmers ({nearbyFarmers.length})
          </ThemedText>
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
        </View>
      </ScrollView>

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