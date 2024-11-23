import { View, Text, Pressable, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function RewardsScreen() {
  const navigation = useNavigation();

  type AntDesignIconName = "linechart" | "enviromento" | "API";

  const rewards: {
    id: number;
    title: string;
    coins: number;
    icon: AntDesignIconName;
  }[] = [
    {
      id: 1,
      title: "Price Prediction",
      coins: 100,
      icon: "linechart",
    },
    {
      id: 2,
      title: "Nearby Farmer info",
      coins: 100,
      icon: "enviromento",
    },
    {
      id: 3,
      title: "Crop Recommendation",
      coins: 100,
      icon: "API",
    },
  ];

  return (
    <View className="p-4 bg-gray-100 flex-1">
      <ThemedText type="title">
        Your Rewards
      </ThemedText>
      <View className="flex-row flex-wrap justify-between">
        {rewards.map((reward) => (
          <Pressable
            key={reward.id}
            className="w-[48%] bg-green-500 rounded-lg items-center mb-4"
          >
            <View className="bg-white p-4 rounded-full m-4">
              <AntDesign name={reward.icon} size={24} color="#38A169" />
            </View>

            <View className="flex-row items-center bg-white rounded-full px-2 py-1 ">
              <View className="bg-yellow-400 rounded-full p-1 mr-2">
                <AntDesign name="heart" size={12} color="#A64B2A" />
              </View>
              <Text className="text-green-600 font-bold">{reward.coins}</Text>
            </View>

            <Text className="text-white font-bold text-[14px] m-2 text-center">
              {reward.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
