import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, Text, SafeAreaView } from "react-native";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSelect } from "@/components/ThemedSelect";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import { usePostFarmingData } from "@/api/rewardService";
import * as SecureStore from "expo-secure-store";

const GEO_FENCE_LATITUDE = 7.050308;
const GEO_FENCE_LONGITUDE = 79.937582;
const GEO_FENCE_RADIUS = 5; // in kilometers

function isLocationInRadius(latitude : number , longitude : number) {
  return isLocationWithinRadius(
    latitude,
    longitude,
    GEO_FENCE_LATITUDE,
    GEO_FENCE_LONGITUDE,
    GEO_FENCE_RADIUS
  );
}

function isLocationWithinRadius(latitude : number, longitude : number, geoFenceLatitude : number, geoFenceLongitude : number, radius : number) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(geoFenceLatitude - latitude);
  const dLon = deg2rad(geoFenceLongitude - longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latitude)) * Math.cos(deg2rad(geoFenceLatitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance <= radius;
}

function deg2rad(deg : number) {
  return deg * (Math.PI / 180);
}

export default function AddFarmData() {
  const [whenToPlant, setWhenToPlant] = useState<Date>(new Date());
  const [whatToPlant, setWhatToPlant] = useState<string>("");
  const [amount, setAmount] = useState<number>(150);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleSubmit = async () => {
    if (!location || !whatToPlant || !amount) {
      alert("Please provide a location, vegetable selection, and amount.");
      return;
    }

    if (!isLocationInRadius(location.latitude, location.longitude)) {
      alert("The selected location is outside the allowed geo-fence radius.");
      return;
    }

    const payload = {
      farmer_ref: user.id,
      farmer_name: user.email,
      lat: location.latitude,
      long: location.longitude,
      vegetable_ref: "V001",
      vegetable_name: whatToPlant,
      amount: amount,
      planted_at: whenToPlant.toISOString(),
    };

    try {
      await usePostFarmingData(payload);
      router.replace({
        pathname: "/(root)/(screens)/home",
        params: {},
      });
    } catch (error) {
      console.error("Error submitting farming data:", error);
      alert("An error occurred while submitting your data.");
    }
  };

  useEffect(() => {
    SecureStore.getItemAsync("user").then((user) => {
      if (user) {
        setUser(JSON.parse(user));
      }
    });
  }, []);

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
            Share Your Farming Data
          </ThemedText>

          <View style={{ height: 300, marginBottom: 16 }}>
            {location ? (
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onRegionChangeComplete={(region) => {
                  setLocation({
                    latitude: region.latitude,
                    longitude: region.longitude,
                  });
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Selected Location"
                  description="You can drag the marker to pick a location"
                  draggable
                  onDragEnd={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setLocation({ latitude, longitude });
                  }}
                />
                <Circle
                  center={{
                    latitude: GEO_FENCE_LATITUDE,
                    longitude: GEO_FENCE_LONGITUDE,
                  }}
                  radius={GEO_FENCE_RADIUS * 1000} 
                  fillColor="rgba(0, 0, 255, 0.1)"
                  strokeColor="rgba(0, 0, 255, 0.5)"
                  strokeWidth={2}
                />
              </MapView>
            ) : (
              <Text>Loading map...</Text>
            )}
          </View>

          <ThemedInput
            label="When Do You Wish to Plant?"
            placeholder="Select date"
            type="date"
            value={new Date(whenToPlant)}
            onChangeText={setWhenToPlant}
            className="mb-4"
          />
          <ThemedSelect
            label="Select a Vegetable"
            placeholder="Choose one"
            options={[
              { label: "Brinjals", value: "BRINJALS" },
              { label: "Cabbage", value: "CABBAGE" },
              { label: "Carrot", value: "CARROT" },
              { label: "Pumpkin", value: "PUMPKIN" },
              { label: "Tomatoes", value: "TOMATOES" },
            ]}
            value={whatToPlant}
            onValueChange={(value) => setWhatToPlant(value as string)}
            error=""
            disabled={false}
          />

          <ThemedInput
            label="Amount to Plant"
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount.toString()}
            onChangeText={(value) => setAmount(parseInt(value, 10))}
            className="mb-4"
          />
        </View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-200">
        <ThemedButton
          label="Submit"
          onPress={handleSubmit}
          variant="primary"
          textStyle="text-lg"
        />
      </View>
    </SafeAreaView>
  );
}