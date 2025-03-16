import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButtonWithML } from "@/components/ThemedButtonWithML";
import { router } from "expo-router";
import { UserInteractionWrapper } from "@/components/UserInteractionWrapper";

const Welcome = () => {
  const [events, setEvents] = useState<string[]>([]);
  const [coordinates, setCoordinates] = React.useState({ x: 0, y: 0 });
  const missClickWidthThreshold = 5;
  const missClickHeightThreshold = 10;

  const handleTouch = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    setCoordinates({ x: locationX, y: locationY });
  };

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
      <View
        onStartShouldSetResponder={() => true}
        onResponderRelease={handleTouch}
        className="flex flex-col bg-red-200 justify-center items-center my-auto h-full"
      >
        <View className="h-40 mb-4">
          <Text className="text-lg font-bold mb-2">Welcome</Text>
          <Text>Touch coordinates:</Text>
          <Text>X: {coordinates.x}</Text>
          <Text>Y: {coordinates.y}</Text>
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
            devmode={true}
            //missContainerStyle="bg-cyan-100 opacity-50 border-2 border-cyan-600"
            containerStyle={`${buttonContainerWidth} ${buttonContainerHeight}`}
            viewStyle="flex flex-col justify-center items-center"
            missClickTrackingArea={50}
          />
        </View>

        <View className=" mt-[50px] flex flex-row max-w-[100px] items-center justify-center">
          <ThemedButtonWithML
            label="Reset"
            onPress={() => setEvents([])}
            buttonId={"Sign up"}
            containerStyle={`${buttonContainerWidth} ${buttonContainerHeight}`}
            viewStyle="flex flex-col justify-center items-center"
            missClickTrackingArea={10}
            actualButton={
              <>
                <TouchableOpacity
                  onPress={() => {
                    handleActualButtonPress();
                  }}
                  className={`flex items-center justify-center rounded-lg border px-4 py-3 my-1 bg-[#2F855A]`}
                >
                  <Text className={`font-semibold text-base text-white`}>
                    Actual Button
                  </Text>
                </TouchableOpacity>
              </>
            }
          />

          <UserInteractionWrapper
            buttonId={"test-gihan-button"}
            devmode={true}
            missClickTrackingArea={50}
            actualButton={
              <>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Actual button clicked");
                  }}
                  className={`flex items-center justify-center rounded-lg border px-4 py-3 my-1 bg-[#2F855A]`}
                >
                  <Text className={`font-semibold text-base text-white`}>
                    Actual222222222222 Button
                  </Text>
                </TouchableOpacity>
              </>
            }
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
