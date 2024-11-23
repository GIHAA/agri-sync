import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedSelect } from "@/components/ThemedSelect";
import { router } from "expo-router";
import { ThemedButton } from "@/components/ThemedButton";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [textSize, setTextSize] = useState("");
  const [age, setAge] = useState(0);
  const [userName, setUserName] = useState("");
  const [visionProblems, setVisionProblems] = useState(false);
  const [colorBlindness, setColorBlindness] = useState(false);
  const [layout, setLayout] = useState("");
  const [colorFriendlyScheme, setColorFriendlyScheme] = useState("");
  const [useSymbolsWithColors, setUseSymbolsWithColors] = useState(false);

  function handleRegister(): void {
    router.replace("/(auth)/sign-in");
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex justify-center items-center px-[40px]">
          <Image
            source={require("../../assets/images/reg-header-img.png")}
            className="w-screen h-[191px]"
          />
          <Text className="text-[32px] text-center font-bold">Register</Text>
          <Text className="text-[16px] text-center mb-6 text-gray-600">
            Join us and personalize your experience.
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

          <ThemedInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(value) => setPassword(value as string)}
            className="mb-4"
            secureTextEntry
          />

          <Text className="text-[20px] leading-[24px] text-[#2B9348] mb-4">
            Let’s make the app work better for you! Answer a few quick
            questions.
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
            onValueChange={(value) => setUseSymbolsWithColors(value as boolean)}
            containerStyle="w-full"
          />

          <ThemedButton
            label="Log In"
            variant="primary"
            onPress={() => handleRegister()}
            textStyle="text-lg"
            containerStyle="w-full  p-4 rounded-lg my-6"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
