import React, { useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getUiRecommendation, trackInteraction } from "@/api/reinforceUI";
import { router } from "expo-router";

export type ThemedButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  containerStyle?: string;
  textStyle?: string;
};

export function ThemedButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  containerStyle = "",
  textStyle = "",
}: ThemedButtonProps) {
  const themeColor = useThemeColor({}, "background");

  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return `bg-[#2F855A]  ${disabled ? "opacity-50" : ""}`;
      case "secondary":
        return `bg-green-200 border-green-300 ${disabled ? "opacity-50" : ""}`;
      case "outline":
        return `bg-transparent border-green-600 ${disabled ? "opacity-50" : ""}`;
      default:
        return "bg-[#2F855A] ";
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case "primary":
        return "text-white";
      case "secondary":
        return "text-green-800";
      case "outline":
        return "text-green-600";
      default:
        return "";
    }
  };


  const [buttonClicks, setButtonClicks] = useState(0);
  const [uiAction, setUiAction] = useState<string | null>(null);

   // Function to simulate button clicks and track them
   const handleButtonClick = async () => {
    setButtonClicks(buttonClicks + 1);
    const response = await trackInteraction(buttonClicks + 1); // Send the number of clicks to the backend

    // Fetch the UI recommendation (action to adjust UI)
    const recommendation = await getUiRecommendation();
    setUiAction(recommendation.action); // Adjust UI based on the response
    console.log('UI recommendation:', recommendation.action);
  };

  return (
    <TouchableOpacity
    onPress={() => {
      onPress();
      handleButtonClick();
    }}
      disabled={disabled || loading}
      className={`flex items-center justify-center rounded-lg border px-4 py-3 my-1 ${getButtonClasses()} ${containerStyle}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#fff" : themeColor} />
      ) : (
        <Text className={`font-semibold text-base ${getTextClasses()} ${textStyle}`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
