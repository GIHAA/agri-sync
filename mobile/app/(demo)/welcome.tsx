import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButtonWithML } from "@/components/ThemedButtonWithML";
import { router } from "expo-router";

const Welcome = () => {
  const [events, setEvents] = useState<string[]>([]);
  const missClickWidthThreshold = 5;
  const missClickHeightThreshold = 10;

  const handleActualButtonPress = () => {
    setEvents((prevEvents) => [...prevEvents, "Actual Button Clicked"]);
  };

  const handleDemoButtonPress = () => {
    setEvents((prevEvents) => [...prevEvents, `Click Detected`]);
  };

  const handleMissClick = () => {
    setEvents((prevEvents) => {
      const newEvents = [
        ...prevEvents,
        `Miss Click Detected ${prevEvents.length + 1}`,
      ];
      return newEvents;
    });
  };

  const missClickCount = events.filter((event) =>
    event.includes("Miss Click")
  ).length;

  // Determine dynamic container styles based on miss click count
  const buttonContainerHeight =
    missClickCount >= missClickHeightThreshold
      ? "h-24" // Increase to 6rem when 10 miss clicks are detected
      : "h-16"; // Default to 4rem

  const buttonContainerWidth =
    missClickCount >= missClickWidthThreshold ? "!w-full" : "!w-1/2";

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-col justify-center items-center my-auto h-full">
        <View className="h-40 mb-4">
          <Text className="text-lg font-bold mb-2">Welcome</Text>
          <ScrollView>
            {events.map((event, index) => (
              <Text key={index} className="text-base">
                {event}
              </Text>
            ))}
          </ScrollView>
        </View>

        <View className="w-full my-10 flex flex-col justify-center items-center">
          <ThemedButtonWithML
            label="Actual Button"
            onPress={handleActualButtonPress}
            onMissClick={handleMissClick}
            missClickTrackingArea={20}
            buttonId={"Sign up"}
            containerStyle={`${buttonContainerWidth} ${buttonContainerHeight}`}
            viewStyle="flex flex-col justify-center items-center"
          />
        </View>

        <View className="w-full">
          <ThemedButtonWithML
            label="Demo Button"
            onPress={handleDemoButtonPress}
            onMissClick={handleMissClick}
            buttonId={"Sign up"}
            missContainerStyle="bg-black"
            containerStyle={`${buttonContainerWidth} ${buttonContainerHeight}`}
            viewStyle="flex flex-col justify-center items-center"
            missClickTrackingArea={20}
          />
        </View>

        <View className=" mt-[50px] flex flex-row max-w-[100px] items-center justify-center">
          <ThemedButtonWithML
            label="Reset"
            onPress={() => setEvents([])}
            buttonId={"Sign up"}
            containerStyle={`${buttonContainerWidth} ${buttonContainerHeight}`}
            viewStyle="flex flex-col justify-center items-center"
          />
           <ThemedButtonWithML
            label="Log In"
            onPress={() => router.replace("/ageDetect")}
            buttonId={"Sign up"}
            containerStyle={`${buttonContainerWidth} ${buttonContainerHeight}`}
            viewStyle="flex flex-col justify-center items-center"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
