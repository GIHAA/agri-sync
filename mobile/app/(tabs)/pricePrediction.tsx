import { View, Text, Pressable, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function pricePrediction() {
  const navigation = useNavigation();

  type AntDesignIconName = "linechart" | "enviromento" | "API";

  const rewards: { id: number; title: string; coins: number; icon: AntDesignIconName }[] = [
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
      <ThemedText className="!text-black mb-4" type="title">
        Your Rewards
      </ThemedText>

    </View>
  );
}
