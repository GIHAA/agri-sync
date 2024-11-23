import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

export type ThemedSelectProps = {
  label: string;
  placeholder?: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onValueChange: (value: string | number) => void;
  containerStyle?: string;
  inputStyle?: string;
  error?: string;
  disabled?: boolean;
};

export function ThemedSelect({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  containerStyle = "",
  inputStyle = "",
  error,
  disabled = false,
}: ThemedSelectProps) {
  return (
    <View
      className={`mb-4 ${containerStyle}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {/* Label */}
      <Text className="text-base font-semibold mb-2 text-black">{label}</Text>

      {/* Picker Container */}
      <View
        className={`border rounded-lg bg-gray-100 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          enabled={!disabled}
          style={{
            color: "black", // This ensures the text is black
          }}
          className={`w-full p-2 text-black ${inputStyle}`}
        >
          {/* Placeholder */}
          {placeholder && (
            <Picker.Item
              label={placeholder}
              value=""
              enabled={false}
              style={{
                color: "black", // Ensure placeholder text is black
              }}
              color="black"
            />
          )}

          {/* Options */}
          {options.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
              style={{
                color: "black", // Ensure options text is black
              }}
              color="black"
            />
          ))}
        </Picker>
      </View>

      {/* Error Message */}
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
