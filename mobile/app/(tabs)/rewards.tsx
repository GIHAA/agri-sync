import { View, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";

export default function RewardsScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <ThemedText  type="title">Welcome! To Rewards Screen</ThemedText>
      <Text className="bg-black text-white">Rewards Screen</Text>
    </View>
  );
}
