import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";

export default function SelectCropForPrediction() {
  const [whereToPlant, setWhereToPlant] = useState("");
  const [whenToPlant, setWhenToPlant] = useState(new Date());
  const [whatToPlant, setWhatToPlant] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <ThemedText type="title">Crop Selection for Prediction</ThemedText>

        <View className="mt-6">
          <ThemedInput
            label="Where Would You Like to Plant?"
            placeholder="Enter location"
            value={whereToPlant}
            onChangeText={(value) =>
              setWhereToPlant(value instanceof Date ? value.toISOString() : value)
            }
          />
          <ThemedInput
            label="When Do You Wish to Plant?"
            placeholder="Select date"
            type="date"
            value={whenToPlant.toISOString()}
            onChangeText={(value) =>
              setWhenToPlant(value instanceof Date ? value : new Date(value))
            }
          />
          <ThemedInput
            label="What Vegetable Would You Like to Plant?"
            placeholder="Enter vegetable"
            value={whatToPlant}
            onChangeText={(value) =>
              setWhatToPlant(value instanceof Date ? value.toISOString() : value)
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
