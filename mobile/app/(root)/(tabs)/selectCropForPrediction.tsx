import React from "react";
import { View } from "react-native";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function SelectCropForPrediction() {
  const [whereToPlant, setWhereToPlant] = React.useState<string>("");
  const [whenToPlant, setWhenToPlant] = React.useState<Date>(new Date());
  const [whatToPlant, setWhatToPlant] = React.useState<string>("");

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-1">
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
        <ThemedInput
          label="What Vegetable Would You Like to Plant?"
          placeholder="Enter vegetable"
          value={whatToPlant}
          onChangeText={(value) => setWhatToPlant(value as string)}
          className="mb-4"
        />
      </View>

      <View className="flex space-x-4">
        <ThemedButton
          label="Submit"
          onPress={() => console.log("Primary button pressed")}
          variant="primary"
          textStyle="text-lg"
        />
        <ThemedButton
          label="Cancel"
          onPress={() => console.log("Secondary button pressed")}
          variant="secondary"
        />
        <ThemedButton
          label="Delete"
          onPress={() => console.log("Outline button pressed")}
          variant="outline"
          loading={false}
        />
        <ThemedButton
          label="Delete"
          onPress={() => console.log("Outline button pressed")}
          variant="outline"
          loading={true}
        />
      </View>
    </View>
  );
}
