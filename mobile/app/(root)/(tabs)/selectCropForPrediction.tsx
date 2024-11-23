import React from "react";
import { View } from "react-native";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";

export default function SelectCropForPrediction() {
  const [whereToPlant, setWhereToPlant] = React.useState<string>('');
  const [whenToPlant, setWhenToPlant] = React.useState<Date>(new Date()); // Keep as a string
  const [whatToPlant, setWhatToPlant] = React.useState<string>('');

  // // Handler to process date input
  // const handleDateChange = (value: string | Date) => {
  //   if (value instanceof Date) {
  //     // Format the date and set as a string
  //     setWhenToPlant(value.toISOString().split("T")[0]); // Example: "YYYY-MM-DD"
  //   } else {
  //     setWhenToPlant(value); // Handle string fallback
  //   }
  // };

  return (
    <View className="p-4 bg-white flex-1">
      <ThemedText type="title">Price Prediction</ThemedText>

      <View>
        <ThemedInput
          label="Where Would You Like to Plant?"
          placeholder="Enter location"
          value={whereToPlant}
          onChangeText={(value) => setWhereToPlant(value as string)} 
        />
        <ThemedInput
          label="When Do You Wish to Plant?"
          placeholder="Select date"
          type="date"
          value={new Date(whenToPlant)}
          onChangeText={setWhenToPlant} 
        />
        <ThemedInput
          label="What Vegetable Would You Like to Plant?"
          placeholder="Enter vegetable"
          value={whatToPlant}
          onChangeText={(value) => setWhatToPlant(value as string)} 
        />
      </View>
    </View>
  );
}
