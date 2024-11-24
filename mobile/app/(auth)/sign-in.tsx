import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedInput } from "@/components/ThemedInput";
import { router } from "expo-router";
import { ThemedButton } from "@/components/ThemedButton";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogIn(): void {
    router.replace("/(root)/(screens)/home");
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="felx justify-center items-center mx-[40px] ">
          <View>
            <Image
              source={require("../../assets/images/reg-header-img.png")}
              className=" w-screen h-[191px]"
            />
          </View>
          <Text className="text-[32px] text-center mt-[50px]">Log In</Text>
          <Text className="text-[16px] text-center">You can login here</Text>

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

          <ThemedButton
            label="Log In"
            variant="primary"
            onPress={() => handleLogIn()}
            textStyle="text-lg"
            containerStyle="w-full  p-4 rounded-lg my-6"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
