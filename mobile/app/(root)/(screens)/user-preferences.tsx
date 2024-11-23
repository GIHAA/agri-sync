import { View, Text, ScrollView, Alert} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedSelect } from "@/components/ThemedSelect";
import { router } from "expo-router";
import { ThemedButton } from "@/components/ThemedButton";

const UserPreferences = () => {
  const [email, setEmail] = useState("");
  const [textSize, setTextSize] = useState("");
  const [age, setAge] = useState(0);
  const [userName, setUserName] = useState("");
  const [visionProblems, setVisionProblems] = useState(false);
  const [colorBlindness, setColorBlindness] = useState(false);
  const [layout, setLayout] = useState("");
  const [colorFriendlyScheme, setColorFriendlyScheme] = useState("");
  const [useSymbolsWithColors, setUseSymbolsWithColors] = useState(false);

  function handleUpdate(): void {
   Alert.alert("User Preferences Updated Successfully");
  }

  function handleCancel(): void {
    router.replace("/(root)/(tabs)/home");
  }

  function handleNavigate(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex  p-[40px]">
         
          <Text className="text-[32px]  text-left font-bold">User Profile</Text>
          <Text className="text-[16px]  mb-6 text-gray-600">
            You can edit your preferences here.
          </Text>

          <Text className="text-[20px] leading-[24px] font-bold mb-3 ">
          Account Details
          </Text>

          <ThemedInput
            label="Name"
            placeholder="Enter your name"
            value={userName}
            onChangeText={(value) => setUserName(value as string)}
            className="mb-4"
          />

          <ThemedInput
            label="Age"
            placeholder="Enter your age"
            value={age.toString()}
            onChangeText={(value) => setAge(value as number)}
            className="mb-4"
            keyboardType="numeric"
          />

          <ThemedInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(value) => setEmail(value as string)}
            className="mb-4"
            keyboardType="email-address"
          />

          <Text className="text-[20px] leading-[24px] font-bold mb-3">
          Preferences
          </Text>

          <ThemedSelect
            label="Are you having a vision problem?"
            placeholder="Choose one"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            value={visionProblems}
            onValueChange={(value) => setVisionProblems(value as boolean)}
            containerStyle="w-full"
          />

          <ThemedSelect
            label="Preferred Text Size"
            placeholder="Choose one"
            options={[
              { label: "Small", value: "Small" },
              { label: "Medium", value: "Medium" },
              { label: "Large", value: "Large" },
            ]}
            value={textSize}
            onValueChange={(value) => setTextSize(value as string)}
             containerStyle="w-full"
          />

          <ThemedSelect
            label="Are you color blind?"
            placeholder="Choose one"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            value={colorBlindness}
            onValueChange={(value) => setColorBlindness(value as boolean)}
             containerStyle="w-full"
          />

          <ThemedSelect
            label="Preferred Layout"
            placeholder="Choose one"
            options={[
              { label: "Simple", value: "Simple" },
              { label: "Advanced", value: "Advanced" },
            ]}
            value={layout}
            onValueChange={(value) => setLayout(value as string)}
            containerStyle="w-full"
          />

          <ThemedSelect
            label="Color Scheme Preference"
            placeholder="Choose one"
            options={[
              { label: "Red-Green Safe", value: "Red-Green Safe" },
              { label: "High Contrast", value: "High Contrast" },
            ]}
            value={colorFriendlyScheme}
            onValueChange={(value) => setColorFriendlyScheme(value as string)}
            containerStyle="w-full"
          />

          <ThemedSelect
            label="Use Symbols with Colors"
            placeholder="Choose one"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            value={useSymbolsWithColors}
            onValueChange={(value) => setUseSymbolsWithColors(value as  boolean)}
            containerStyle="w-full"
          />

          <View className="flex flex-row gap-[12px]">

          <ThemedButton
          label="Update"
          variant='primary'
          onPress={() => handleUpdate()}
          textStyle="text-lg"
          containerStyle='w-1/2  p-4 rounded-lg my-6'
        />
          <ThemedButton
          label="Cancel"
          variant='outline'
          onPress={() => handleCancel()}
          textStyle="text-lg"
          containerStyle='w-1/2  p-4 rounded-lg my-6'
        />
          </View>

          <ThemedButton
          label="Give Feedback about the app"
          variant='primary'
          onPress={() => handleNavigate()}
          textStyle="text-lg"
          containerStyle='w-full  p-4 rounded-lg my-6'
        />
   
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserPreferences;
