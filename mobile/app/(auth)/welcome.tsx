import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useState } from "react";

import { trackInteraction, getUiRecommendation } from "../../api/reinforceUI";
import { ThemedButtonWithML } from "@/components/ThemedButtonWithML";
import { ThemedButton } from "@/components/ThemedButton";

const Welcome = () => {
  const [buttonClicks, setButtonClicks] = useState(0);
  const [uiAction, setUiAction] = useState<string | null>(null);

  const handleButtonClick = async () => {
    setButtonClicks(buttonClicks + 1);
    const response = await trackInteraction(buttonClicks + 1);

    const recommendation = await getUiRecommendation();
    console.log("Recommendation:", recommendation);
    setUiAction(recommendation.action);

    router.replace("/(auth)/sign-up");
  };

  const buttonStyles =
    uiAction === "Move" ? styles.movedButton : styles.defaultButton;

  return (
    <SafeAreaView>
      <View className="flex flex-col justify-center items-center my-auto h-full">
        {uiAction && <Text>Recommended Action: {uiAction}</Text>}

        <Text className=" text-[32px]">welocme</Text>

        <TouchableOpacity
          onPress={() => {
            router.replace("/(root)/(screens)/home");
          }}
          className="w-1/2 bg-[#2F855A] p-8 rounded-lg mt-4 self-center"
        >
          <Text className="text-center">Debug</Text>
        </TouchableOpacity>

        <ThemedButton
          label="Sign In"
          onPress={() => {
            router.replace("/(auth)/sign-in");
          }}
        />

        <ThemedButtonWithML
          label="Sign Up"
          onPress={() => {
            console.log("Sign Up Pressed");
          }}
          buttonId={"Sign up"}
          missClickTrackingArea={0}
        />

        <ThemedButtonWithML
          label="UI Demo"
          onPress={() => {
            router.replace("/(demo)/welcome");
          }}
          buttonId={"UI_demo"}
          missClickTrackingArea={0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultButton: {
    width: 200,
    height: 50,
    backgroundColor: "blue",
  },
  movedButton: {
    width: 200,
    height: 50,
    backgroundColor: "green",
    marginLeft: 100, // Move the button to the right
  },
});
export default Welcome;
