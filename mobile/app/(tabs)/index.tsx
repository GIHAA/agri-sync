import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface MenuOptionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

interface HomeScreenProps {
  logoSource?: ImageSourcePropType;
  onQRCodePress?: () => void;
  onAddFarmingPress?: () => void;
  onRewardPress?: () => void;
  onPreferencePress?: () => void;
  onLogoutPress?: () => void;
}

const MenuOption: React.FC<MenuOptionProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity
    className="items-center justify-center p-4 w-1/2"
    onPress={onPress}
  >
    <View className="items-center">
      {icon}
      <Text className="text-white text-sm mt-2 text-center">{label}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen: React.FC<HomeScreenProps> = ({
  onQRCodePress,
  onAddFarmingPress,
  onRewardPress,
  onPreferencePress,
  onLogoutPress,
}) => {
  // Define menu items with their handlers
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
    <View className="flex-1 bg-white">
      <View className="items-center pt-8 pb-4">
        <Image
          source={require("../../assets/images/app-icon.png")}
          className="w-16 h-16"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 bg-green-700 rounded-t-3xl mt-4 px-4 pt-8">
        <View className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 px-6 w-full">
          <TouchableOpacity
            className="bg-white rounded-xl py-3 flex-row items-center justify-center shadow-lg"
            onPress={onQRCodePress}
          >
            <Text className="text-gray-800 font-medium">Show QR Code</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap">
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
  );
};

export default HomeScreen;
