import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MenuOption from "@/components/HomeOption";
import { router } from "expo-router";
import qr from "@/assets/images/qr.png";

interface MenuOptionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

const HomeScreen: React.FC = ({}) => {
  const onQRCodePress = () => {
    console.log("QR Code Pressed");
  };

  const onAddFarmingPress = () => {
    console.log("Add Farming Data Pressed");
  };

  const onRewardPress = () => {
    router.replace("/(root)/screens/rewards");
  };

  const onPreferencePress = () => {
    console.log("User Preference Pressed");
  };

  const onLogoutPress = () => {
    console.log("Logout Pressed");
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

  return (
    <View className="flex-1 gap-10">
      <View className="items-center pt-8 pb-4">
        <Image
          source={require("../../../assets/images/app-icon.png")}
          className="w-[126p] h-[126px] mt-[35px]"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 bg-green-700 rounded-t-3xl mt-4 px-4 pt-8 ">
        <View className="absolute top-[-35px]  left-4  transform px-6 w-full flex justify-center ">
          <TouchableOpacity
            className="bg-white rounded-xl py-[20px] flex-row items-center justify-center shadow-lg gap-[11px]"
            onPress={onQRCodePress}
          >
            <Image
              source={qr}
              className="w-8 h-8"
            />
            <Text className="text-gray-800 font-medium">Show QR Code</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-[78px]">
          <View className="flex-row flex-wrap gap-y-[30px]">
            {menuItems.map((item, index) => (
              <MenuOption
                key={index}
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
