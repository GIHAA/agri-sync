import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  SafeAreaView,
  LogBox,
} from "react-native";
import Brinjals from "@/assets/images/vegitables/Brinjals.jpeg";
import Cabbage from "@/assets/images/vegitables/Cabbage.jpg";
import Carrot from "@/assets/images/vegitables/Carrot.webp";
import Pumpkin from "@/assets/images/vegitables/Pumpkin.jpg";
import Tomatoes from "@/assets/images/vegitables/Tomatoes.jpg";
import { fetchPredictedPrice } from "@/api/predictionApiService";
import { AntDesign } from "@expo/vector-icons";
import { usePostRedeemReward } from "@/api/rewardService";
import { useGetRewardPoints } from "@/api/rewardService";

interface Vegetable {
  name: string;
  image: any;
  currentPrice: number;
  predictedPrice: number;
}

const vegetableData: Vegetable[] = [
  { name: "Brinjals", image: Brinjals, currentPrice: 120, predictedPrice: 200 },
  { name: "Cabbage", image: Cabbage, currentPrice: 90, predictedPrice: 150 },
  { name: "Carrot", image: Carrot, currentPrice: 100, predictedPrice: 200 },
  { name: "Pumpkin", image: Pumpkin, currentPrice: 70, predictedPrice: 120 },
  { name: "Tomatoes", image: Tomatoes, currentPrice: 110, predictedPrice: 180 },
];

export default function PricePredictionScreen() {
  const { whereToPlant, whenToPlant, whatToPlant } = useLocalSearchParams();

  const [currentSelectedVegetable, setCurrentSelectedVegetable] =
    useState<string>(whatToPlant.toString() || "Carrot");
  const [currentSelectedVegetableImage, setCurrentSelectedVegetableImage] =
    useState<any>(
      vegetableData.find(
        (veg) => veg.name.toLowerCase() === whatToPlant.toString().toLowerCase()
      )?.image || Carrot
    );
  const [currentPrice, setCurrentPrice] = useState<number>(
    vegetableData.find((veg) => veg.name === whatToPlant)?.currentPrice || 100
  );
  const [predictedPrice, setPredictedPrice] = useState<number>(
    vegetableData.find((veg) => veg.name === whatToPlant)?.predictedPrice || 200
  );
  const [remainingPredictions, setRemainingPredictions] = useState<number>(10);

  const fetchPoints = async () => {
    const points = await useGetRewardPoints();
    setRemainingPredictions(points);
  };
  useEffect(() => {

    fetchPoints();
  }, []);

  const handleVegetableSelect = async (veg: Vegetable) => {
    try {
      LogBox.ignoreAllLogs();
      try {
        await usePostRedeemReward({
          rewardType: "premium_prediction",
        });
        setCurrentSelectedVegetable(veg.name);
        setCurrentSelectedVegetableImage(veg.image);
        setCurrentPrice(veg.currentPrice);

        const predictedPrice = await fetchPredictedPrice(
          whenToPlant.toString(),
          veg.name
        );
        setPredictedPrice(predictedPrice);
        fetchPoints();
      } catch (error) {
        alert("Could not redeem reward. insufficient points.");
      }
    } catch (error) {
      console.error(error);
      alert("Could not fetch the predicted price. Please try again.");
    }
  };

  const renderVegetableTile = ({ item }: { item: Vegetable }) => (
    <Pressable
      onPress={() => handleVegetableSelect(item)}
      className="bg-white flex-1 m-2 aspect-square rounded-lg shadow-md justify-center items-center"
    >
      <Image source={item.image} className="w-12 h-12" />
      <Text className="mt-2 font-bold">{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1  bg-white">
      <View className="p-4">
        <Pressable
          className="flex-row items-center mb-4"
          onPress={() => router.replace("/(root)/(screens)/home")}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-black ml-2 text-lg">Back</Text>
        </Pressable>

        <ThemedText type="title">Price Prediction</ThemedText>

        <View className="bg-white rounded-lg shadow-md p-4 mb-6">
          <View className="flex-row items-center mb-4">
            <Image
              source={currentSelectedVegetableImage}
              className="w-[120px] h-[100px] mr-4"
            />
            <Text className="text-lg font-bold">
              {currentSelectedVegetable}
            </Text>
          </View>
          {/* <Text className="text-gray-600">Current Price: {currentPrice}</Text> */}
          <Text className="text-green-600 font-bold text-2xl">
            Predicted Price: Rs: {predictedPrice.toPrecision(8)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-600">
            {remainingPredictions} Remaining Points
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
          data={vegetableData}
          numColumns={3}
          renderItem={renderVegetableTile}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-evenly",
          }}
        />
      </View>
    </SafeAreaView>
  );
}
