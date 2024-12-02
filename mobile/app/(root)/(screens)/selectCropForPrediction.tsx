import React from "react";
import { View, ScrollView, Pressable, Text, SafeAreaView } from "react-native";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSelect } from "@/components/ThemedSelect";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function SelectCropForPrediction() {
  const [whereToPlant, setWhereToPlant] =
    React.useState<string>("NUWARA ELIYA");
  const [whenToPlant, setWhenToPlant] = React.useState<Date>(new Date());
  const [whatToPlant, setWhatToPlant] = React.useState<string>("");

  const handleGetPrediction = () => {


    // make them required
    if (!whereToPlant || !whenToPlant || !whatToPlant) {
      console.log("Please fill all fields");
      return;
    }
    // Format the `whenToPlant` date as ISO or another suitable format
    const formattedDate = whenToPlant.toISOString();

    router.replace({
      pathname: "/(root)/(screens)/pricePrediction",
      params: {
        whereToPlant,
        whenToPlant: formattedDate,
        whatToPlant,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        <Pressable
          className="flex-row items-center mb-4"
          onPress={() => router.replace("/(root)/(screens)/rewards")}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-black ml-2 text-lg">Back</Text>
        </Pressable>

        <View>
          <ThemedText type="title" className="mb-4">
            Price Prediction
          </ThemedText>

          <ThemedInput
            label="Where Would You Like to Plant?"
            placeholder="Enter location"
            value={whereToPlant}
            onChangeText={(value) => setWhereToPlant(value as string)}
            className="mb-4"
          />
          <ThemedInput
            label="When Do You Wish to Plant?"
            placeholder="Select date"
            type="date"
            value={new Date(whenToPlant)}
            onChangeText={setWhenToPlant}
            className="mb-4"
          />
          <ThemedSelect
            label="Select a Vegetable"
            placeholder="Choose one"
            options={[
              { label: "Brinjals", value: "BRINJALS" },
              { label: "Cabbage", value: "CABBAGE" },
              { label: "Carrot", value: "CARROT" },
              { label: "Pumpkin", value: "PUMPKIN" },
              { label: "Tomatoes", value: "TOMATOES" },
            ]}
            value={whatToPlant}
            onValueChange={(value) => setWhatToPlant(value as string)}
            error=""
            disabled={false}
          />
        </View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-200">
        <ThemedButton
          label="Get Prediction"
          onPress={() => handleGetPrediction()}
          variant="primary"
          textStyle="text-lg"
        />
      </View>
    </SafeAreaView>
  );
}
