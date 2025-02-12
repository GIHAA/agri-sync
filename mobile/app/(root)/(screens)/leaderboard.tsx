import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

// Import the API function
import { useGetFarmingLeaderboard } from "@/api/rewardService";

// Interface for Leaderboard Entry
interface LeaderboardEntry {
  farmer_ref: string;
  farmer_name: string;
  total_production: string;
  total_entries: string;
  unique_vegetables: string;
  rank: number;
  percentile: number;
}

// Interface for Leaderboard Response
interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
  message: string;
  metadata: {
    timeframe: string;
    limit: number;
    totalParticipants: number;
  };
}

export default function FarmingLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [metadata, setMetadata] = useState<LeaderboardResponse['metadata']>({
    timeframe: 'all',
    limit: 10,
    totalParticipants: 0
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await useGetFarmingLeaderboard();
        console.log("Leaderboard response:", response);
        if (response) {
          setLeaderboardData(response.data);
          setMetadata(response.metadata);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  // Render medal icon based on rank
  const renderMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return require('@/assets/images/gold-medal.png');
      case 2:
        return require('@/assets/images/silver-medal.png');
      case 3:
        return require('@/assets/images/bronze-medal.png');
      default:
        return null;
    }
  };

  // Determine background color based on rank
  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100";
      case 2:
        return "bg-gray-200";
      case 3:
        return "bg-orange-100";
      default:
        return "bg-white";
    }
  };

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => (
    <View 
      className={`flex-row items-center p-3 border-b border-gray-200 ${getRowStyle(item.rank)}`}
    >
      {/* Medal Icon for Top 3 */}
      {item.rank <= 3 && (
        <Image
          source={renderMedalIcon(item.rank)}
          className="w-10 h-10 mr-3"
          resizeMode="contain"
        />
      )}
      
      {/* Rank */}
      <View className="w-12">
        <Text className="font-bold text-lg">{item.rank}</Text>
      </View>
      
      {/* Farmer Details */}
      <View className="flex-1">
        <Text className="font-bold text-base">{item.farmer_name}</Text>
        <View className="flex-row">
          <Text className="mr-3">Entries: {item.total_entries}</Text>
          <Text>Vegetables: {item.unique_vegetables}</Text>
        </View>
      </View>
      
      {/* Production */}
      <View>
        <Text className="font-bold text-green-600">
          {item.total_production} kg
        </Text>
        <Text className="text-gray-500">Percentile: {item.percentile}%</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.replace("/(root)/(screens)/rewards")}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-black ml-2 text-lg">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View className="px-4 mb-4">
        <ThemedText type="title">Farming Leaderboard</ThemedText>
        <Text className="text-gray-600">
          Timeframe: {metadata.timeframe} | Total Participants: {metadata.totalParticipants}
        </Text>
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.farmer_ref}
        renderItem={renderLeaderboardItem}
        ListEmptyComponent={
          <View className="items-center p-4">
            <Text className="text-gray-500">No leaderboard data available</Text>
          </View>
        }
      />

      {/* Footer Button */}
      <View className="p-4 bg-white border-t border-gray-200">
        <ThemedButton
          label="Back to Rewards"
          onPress={() => router.replace("/(root)/(screens)/rewards")}
          variant="primary"
          textStyle="text-lg"
        />
      </View>
    </SafeAreaView>
  );
}