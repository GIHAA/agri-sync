import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import QRCode from "react-native-qrcode-svg";
import MenuOption from "@/components/HomeOption";
import { UserInteractionWrapper } from "@/components/UserInteractionWrapper";

const HomeScreen = () => {
  interface User {
    email: string;
  }
  const [user, setUser] = useState<User | null>(null);
  const [openQR, setOpenQR] = useState(false);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("user").then((storedUser) => {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    });

    SecureStore.getItemAsync("devMode").then((storedDevMode) => {
      setDevMode(storedDevMode === "true");
    });
  }, []);

  const toggleDevMode = async () => {
    const newDevMode = !devMode;
    setDevMode(newDevMode);
    await SecureStore.setItemAsync("devMode", newDevMode.toString());
  };

  const onQRCodePress = () => {
    setOpenQR(!openQR);
  };

  return (
    <SafeAreaView className="flex-1 gap-10">
      <View className="items-center pt-8 pb-4">
        <Image
          source={require("../../../assets/images/app-icon.png")}
          className="w-[126p] h-[126px] mt-[35px]"
          resizeMode="contain"
        />
      </View>

      <View className="absolute top-12 right-4">
        <TouchableOpacity
          onPress={toggleDevMode}
          className="bg-gray-800 p-2 opacity-35 rounded-lg"
        >
          <Text className="text-white font-bold">{devMode ? "Dev On" : "Dev Off"}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-green-700 rounded-t-3xl mt-4 px-4 pt-8">
        <View className="absolute top-[-35px] left-4 transform px-6 w-full flex justify-center">
          <TouchableOpacity
            className="bg-white rounded-xl py-[20px] flex-row items-center justify-center shadow-lg gap-[11px]"
            onPress={onQRCodePress}
          >
            <Image
              source={require("@/assets/images/qr.png")}
              className="w-8 h-8"
            />
            <Text className="text-gray-800 font-medium">Show QR Code </Text>
          </TouchableOpacity>
        </View>

        {openQR && user ? (
          <View className="mt-[78px] items-center">
            <View className="bg-white p-4 rounded-xl">
              <QRCode value={user.email} size={220} color="green" />
            </View>
          </View>
        ) : (
          <View className="mt-[28px]">
            <View className="flex-row flex-wrap justify-between">
              {[{
                icon: <AntDesign name="pluscircleo" size={55} color="white" />, 
                label: "Add Farming Data",
                buttonId: "home-addFarmingDataButton",
                onPress: () => router.replace("/(root)/(screens)/addFarmingData"),
              },
              {
                icon: <AntDesign name="gift" size={55} color="white" />, 
                label: "Reward Program",
                buttonId: "home-rewardsButton",
                onPress: () => router.replace("/(root)/(screens)/rewards"),
              },
              {
                icon: <AntDesign name="setting" size={55} color="white" />, 
                label: "User Preference",
                buttonId: "home-userPreferenceButton",
                onPress: () => router.replace("/(root)/(screens)/user-preferences"),
              },
              {
                icon: <Entypo name="chat" size={55} color="white" />, 
                label: "Chat",
                buttonId: "home-chatButton",
                onPress: () => router.replace("/(root)/(screens)/chatbot"),
              },
              {
                icon: <AntDesign name="login" size={55} color="white" />, 
                label: "Logout",
                buttonId: "home-logoutButton",
                onPress: () => router.replace("/(auth)/sign-in"),
              }].map((item, index) => (
                <View key={index} className="w-[48%] mb-[5px]">
                  <UserInteractionWrapper
                    buttonId={item.buttonId}
                    devmode={devMode}
                    missClickTrackingArea={5}
                    actualButton={
                      <MenuOption icon={item.icon} label={item.label} onPress={item.onPress} />
                    }
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
