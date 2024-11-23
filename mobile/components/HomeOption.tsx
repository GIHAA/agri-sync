import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

interface MenuOptionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

const MenuOption: React.FC<MenuOptionProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={{ alignItems: "center", justifyContent: "center", padding: 16, width: "50%" }}
    onPress={onPress}
  >
    <View style={{ alignItems: "center", display: "flex" }}>
      <View style={{ width: "100%" }}>{icon}</View>
      <Text style={{ color: "white", fontSize: 14, marginTop: 8, textAlign: "center" }}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default MenuOption;
