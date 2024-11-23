import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

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
        return `bg-green-600 border-green-600 ${disabled ? "opacity-50" : ""}`;
      case "secondary":
        return `bg-green-200 border-green-300 ${disabled ? "opacity-50" : ""}`;
      case "outline":
        return `bg-transparent border-green-600 ${disabled ? "opacity-50" : ""}`;
      default:
        return "";
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

  return (
    <TouchableOpacity
      onPress={onPress}
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
