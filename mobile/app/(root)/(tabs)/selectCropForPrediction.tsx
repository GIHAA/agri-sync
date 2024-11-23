import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { View, Text, Pressable, FlatList, Image } from "react-native";

export default function selectCropForPrediction() {
  const [whereToPlant, setWhereToPlant] = React.useState('');
  const [whenToPlant, setWhenToPlant] = React.useState('');
  const [whatToPlant, setWhatToPlant] = React.useState('');

  return (
    <View className="p-4 bg-white flex-1">
      <ThemedText type="title">
        Price Prediction
      </ThemedText>


      <View className="">
      <ThemedInput
        label="Where Would You Like to Plant?"
        placeholder="Enter location"
        value={whereToPlant}
        onChangeText={setWhereToPlant}
      />
      <ThemedInput
        label="When Do You Wish to Plant?"
        placeholder="Select date"
        type="date"
        value={whenToPlant}
        onChangeText={setWhenToPlant}
      />
      <ThemedInput
        label="What Vegetable Would You Like to Plant?"
        placeholder="Enter vegetable"
        value={whatToPlant}
        onChangeText={setWhatToPlant}
      />

    </View>
     
    </View>
  );
}
