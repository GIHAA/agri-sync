import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { ThemedText } from "@/components/ThemedText";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";

export default function RewardsScreen() {
  type AntDesignIconName = "linechart" | "enviromento" | "API";
  const [points, setPoints] = React.useState(16969);

  const rewards: {
    id: number;
    title: string;
    coins: number;
    icon: AntDesignIconName;
    comingSoon?: boolean;
    onPress?: () => void;
  }[] = [
    {
      id: 1,
      title: "Price Prediction",
      coins: 100,
      icon: "linechart",
      onPress: () => {
        router.replace("/(root)/(screens)/selectCropForPrediction");
      },
    },
    {
      id: 2,
      title: "Nearby Farmer info",
      coins: 100,
      icon: "enviromento",
      comingSoon: true,
      onPress: () => {
        alert("Coming Soon");
      },
    },
    {
      id: 3,
      title: "Crop Recommendation",
      coins: 100,
      icon: "API",
      comingSoon: true,
      onPress: () => {
        alert("Coming Soon");
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
    <ScrollView
      className="bg-gray-100 flex-1"
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Go Back Button */}
      <Pressable
        className="flex-row items-center mb-4"
        onPress={() => router.replace("/(root)/(screens)/home")}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text className="text-black ml-2 text-lg">Back</Text>
      </Pressable>

      <ThemedText userId={10} type="title" className="mb-4">Rewards</ThemedText>
      <ThemedText userId={100} type="title" className="mb-4">Rewards</ThemedText>

      <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-600">Your points</Text>

            <View className="flex-row items-center bg-white rounded-full px-2 py-1">
              <View className="bg-yellow-400 rounded-full p-3 mr-2">
                <AntDesign name="heart" size={30} color="#A64B2A" />
              </View>
              <Text className="text-green-600 font-bold text-4xl">
                {points}
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={20} color="gray" />
        </View>

        <View className="flex-row justify-between mt-4 flex-wrap">
          {/* History Button */}
          <Pressable className="w-[30%]  p-4 rounded-lg items-center">
            <View className="bg-green-100 p-4 rounded-full">
              <MaterialIcons name="history" size={30} color="#38A169" />
            </View>
            <Text className="text-gray-700 mt-2 text-center">History</Text>
          </Pressable>

          {/* Leaderboard Button */}
          <Pressable className="w-[30%]  p-4 rounded-lg items-center">
            <View className="bg-purple-100 p-4 rounded-full">
              <AntDesign name="barschart" size={30} color="#805AD5" />
            </View>
            <Text className="text-gray-700 mt-2 text-center">Leaderboard</Text>
          </Pressable>

          {/* Explore Rewards Button */}
          <Pressable className="w-[30%]  p-4 rounded-lg items-center">
            <View className="bg-blue-100 p-4 rounded-full">
              <AntDesign name="staro" size={30} color="#3182CE" />
            </View>
            <Text className="text-gray-700 mt-2 text-center">
              Explore rewards
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Reward Promotion Section */}
      <View className="bg-green-500 rounded-lg p-4 flex-row items-center mb-4">
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">Get Rewarded</Text>
          <Text className="text-white mt-1">
            for sharing your farming data! Tap here to contribute now!
          </Text>
        </View>
        <View className="bg-white p-4 ml-1 rounded-full">
          <AntDesign name="gift" size={50} color="#38A169" />
        </View>
      </View>

      {/* Rewards List */}
      <View className="flex-row flex-wrap justify-between">
        {rewards.map((reward) => (
          <Pressable
            key={reward.id}
            className="w-[48%] bg-green-500 rounded-lg items-center mb-4"
            disabled={reward.comingSoon}
            onPress={reward.onPress}
          >
            <View className="bg-white p-4 rounded-full m-4">
              <AntDesign name={reward.icon} size={30} color="#38A169" />
            </View>

            <View className="flex-row items-center bg-white rounded-full px-2 py-1">
              <View className="bg-yellow-400 rounded-full p-1 mr-2">
                <AntDesign name="heart" size={12} color="#A64B2A" />
              </View>
              <Text className="text-green-600 font-bold">{reward.coins}</Text>
            </View>

            <Text className="text-white font-bold text-[14px] m-2 text-center">
              {reward.title}
            </Text>

            {reward.comingSoon && (
              <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 rounded-lg flex items-center justify-center">
                <Text className="text-white font-bold text-center">
                  Coming Soon
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
