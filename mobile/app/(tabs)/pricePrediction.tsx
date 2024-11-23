import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { View, Text, Pressable, FlatList, Image } from "react-native";

export default function PricePredictionScreen() {
  const [currentPrice, setCurrentPrice] = useState(1000);
  const [predictedPrice, setPredictedPrice] = useState(2000);
  const [remainingPredictions, setRemainingPredictions] = useState(10);

  const handlePredictionClick = () => {
    if (remainingPredictions > 0) {
      setRemainingPredictions(remainingPredictions - 1);
      alert("Price prediction updated!");
    } else {
      alert("No predictions remaining. Click 'Get More'!");
    }
  };

  const renderVegetableTile = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      key={index}
      onPress={handlePredictionClick}
      className="bg-white flex-1 m-2 aspect-square rounded-lg shadow-md justify-center items-center"
    >
      <Image
        source={{
          uri: "https://cdn11.bigcommerce.com/s-kc25pb94dz/images/stencil/1280x1280/products/271/762/Carrot__40927.1634584458.jpg",
        }}
        className="w-12 h-12"
      />
    </Pressable>
  );

  return (
    <View className="p-4 bg-gray-100 flex-1">
      <ThemedText type="title">
        Price Prediction
      </ThemedText>

      <View className="bg-white rounded-lg shadow-md p-4 mb-6">
        <View className="flex-row items-center mb-4">
          <Image
            source={{
              uri: "https://cdn11.bigcommerce.com/s-kc25pb94dz/images/stencil/1280x1280/products/271/762/Carrot__40927.1634584458.jpg",
            }}
            className="w-10 h-10 mr-4"
          />
          <Text className="text-lg font-bold">Carrot</Text>
        </View>
        <Text className="text-gray-600">Current Price: {currentPrice}</Text>
        <Text className="text-green-600 font-bold">Predicted Price: {predictedPrice}</Text>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-gray-600">
          {remainingPredictions} Predictions Remaining
        </Text>
        <Pressable
          onPress={() => alert("Redirecting to purchase predictions...")}
          className="bg-green-500 px-4 py-2 rounded-md"
        >
          <Text className="text-white font-bold">Get More</Text>
        </Pressable>
      </View>

      <Text className="text-lg font-bold mb-4 text-center">
        Select a Different Vegetable
      </Text>

      <FlatList
        data={Array(9).fill(0)} 
        numColumns={3}
        renderItem={renderVegetableTile}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-evenly",
        }}
      />
    </View>
  );
}
