// import React from "react";
// import { View, ScrollView, Pressable, Text, SafeAreaView } from "react-native";
// import { ThemedInput } from "@/components/ThemedInput";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedButton } from "@/components/ThemedButton";
// import { ThemedSelect } from "@/components/ThemedSelect";
// import { router } from "expo-router";
// import { AntDesign } from "@expo/vector-icons";

// export default function AddFarmData() {
//   const [whereToPlant, setWhereToPlant] =
//     React.useState<string>("NUWARA ELIYA");
//   const [whenToPlant, setWhenToPlant] = React.useState<Date>(new Date());
//   const [whatToPlant, setWhatToPlant] = React.useState<string>("");

//   const handleSubmit = () => {
//     // log state values

//     router.replace({
//       pathname: "/(root)/(screens)/pricePrediction",
//       params: {
//         whereToPlant,
//         whenToPlant: "",
//         whatToPlant,
//       },
//     });
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>

//       <Pressable
//         className="flex-row items-center mb-4"
//         onPress={() => router.replace("/(root)/(screens)/rewards")}
//       >
//         <AntDesign name="arrowleft" size={24} color="black" />
//         <Text className="text-black ml-2 text-lg">Back</Text>
//       </Pressable>
      
//         <View>
//           <ThemedText type="title" className="mb-4">
//             Share Your Farming Data
//           </ThemedText>

//           // need google map here that i can pick a location

//           <ThemedInput
//             label="Where Would You Like to Plant?"
//             placeholder="Enter location"
//             value={whereToPlant}
//             onChangeText={(value) => setWhereToPlant(value as string)}
//             className="mb-4"
//           />
   
//           <ThemedSelect
//             label="Select a Vegetable"
//             placeholder="Choose one"
//             options={[
//               { label: "Brinjals", value: "BRINJALS" },
//               { label: "Cabbage", value: "CABBAGE" },
//               { label: "Carrot", value: "CARROT" },
//               { label: "Pumpkin", value: "PUMPKIN" },
//               { label: "Tomatoes", value: "TOMATOES" },
//             ]}
//             value={whatToPlant}
//             onValueChange={(value) => setWhatToPlant(value as string)}
//             error=""
//             disabled={false}
//           />
//         </View>
//       </ScrollView>

//       <View className="p-4 bg-white border-t border-gray-200">
//         <ThemedButton
//           label="Submit"
//           onPress={() => handleSubmit()}
//           variant="primary"
//           textStyle="text-lg"
//         />
//       </View>
//     </SafeAreaView>
//   );
// }


import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, Text, SafeAreaView } from "react-native";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSelect } from "@/components/ThemedSelect";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function AddFarmData() {
  const [whereToPlant, setWhereToPlant] = useState<string>("NUWARA ELIYA");
  const [whenToPlant, setWhenToPlant] = useState<Date>(new Date());
  const [whatToPlant, setWhatToPlant] = useState<string>("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      // Request for location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      // Get current location
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleSubmit = () => {
    // log state values
    router.replace({
      pathname: "/(root)/(screens)/pricePrediction",
      params: {
        whereToPlant,
        whenToPlant: "",
        whatToPlant,
      },
    });
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
            Share Your Farming Data
          </ThemedText>

          {/* Map component to pick location */}
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
                  setLocation({ latitude: region.latitude, longitude: region.longitude });
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
                    // You can also set the location in a text input if needed
                  }}
                />
              </MapView>
            ) : (
              <Text>Loading map...</Text>
            )}
          </View>

          <ThemedInput
            label="Where Would You Like to Plant?"
            placeholder="Enter location"
            value={whereToPlant}
            onChangeText={(value) => setWhereToPlant(value as string)}
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
