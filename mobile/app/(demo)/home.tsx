import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import QRCode from "react-native-qrcode-svg"; // Import QRCode component
import MenuOption from "@/components/HomeOptionML";




interface MenuOptionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

interface User {
  email: string;
  username: string;
}

const HomeScreen: React.FC = ({}) => {
  const [user, setUser] = useState<User | null>(null);
  const [openQR, setOpenQR] = useState<boolean>(false);

  const onQRCodePress = () => {
    setOpenQR(!openQR); // Toggle QR code visibility
  };

  const onAddFarmingPress = () => {
    console.log("Add Farming Data Pressed");
    router.replace("/(root)/(screens)/addFarmingData");
  };

  const onRewardPress = () => {
    router.replace("/(root)/(screens)/rewards");
  };

  const onPreferencePress = () => {
    router.replace("/(root)/(screens)/user-preferences");
  };

  const onLogoutPress = () => {
    router.replace("/(auth)/sign-in");
  };

  const menuItems: Array<MenuOptionProps> = [
    {
      icon: <AntDesign name="pluscircleo" size={55} color="white" />,
      label: "Add Farming Data",
      onPress: onAddFarmingPress,
    },
    {
      icon: <AntDesign name="gift" size={55} color="white" />,
      label: "Reward Program",
      onPress: onRewardPress,
    },
    {
      icon: <AntDesign name="setting" size={55} color="white" />,
      label: "User Preference",
      onPress: onPreferencePress,
    },
    {
      icon: <AntDesign name="login" size={55} color="white" />,
      label: "Logout",
      onPress: onLogoutPress,
    },
  ];

  // get user from store
  useEffect(() => {
    SecureStore.getItemAsync("user").then((user) => {
      if (user) {
        setUser(JSON.parse(user));
      }
    });
  }, []);

  const userAge = 25; 


  return (
    <SafeAreaView className="flex-1 gap-10">
      <View className="items-center pt-8 pb-4">
        {/* <Image
          source={require("../../../assets/images/app-icon.png")}
          className="w-[126p] h-[126px] mt-[35px]"
          resizeMode="contain"
        /> */}
      </View>

      <View className="flex-1 bg-green-700 rounded-t-3xl mt-4 px-4 pt-8 ">
        <View className="absolute top-[-35px] left-4 transform px-6 w-full flex justify-center ">
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
            <View className="bg-white p-4 rounded-xl  ">
              <QRCode value={user.email} size={220} color="green" />
            </View>
          </View>
        ) : (
          <View className="mt-[78px]">
            <View className="flex-row flex-wrap gap-y-[30px]">
              {menuItems.map((item, index) => (
                <MenuOption
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  onPress={item.onPress}
                  age={userAge}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
