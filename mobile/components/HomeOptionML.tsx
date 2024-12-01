import { getAgeGroup, rulesEngine } from "@/utils/ruleEngine";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
// Assuming the path is correct

interface MenuOptionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  age: number; // Added age prop for dynamic style application
}

const MenuOptionML: React.FC<MenuOptionProps> = ({ icon, label, onPress, age }) => {
  // Get the user’s age group based on the passed `age` prop
  const ageGroup = getAgeGroup(age);
  
  // Apply styles based on the rules engine
  const textSize = rulesEngine.age[ageGroup].text_size;
  const textColor = rulesEngine.age[ageGroup].color;

  return (
    <TouchableOpacity
      style={{ alignItems: "center", justifyContent: "center", padding: 16, width: "50%" }}
      onPress={onPress}
    >
      <View style={{ alignItems: "center", display: "flex" }}>
        <View style={{ width: "100%" }}>
          {icon}
        </View>
        <Text style={{ color: textColor, fontSize: textSize, marginTop: 8, textAlign: "center" }} className="text-white">
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MenuOptionML;
