import React from "react";
import { TextInput, View, Text, TextInputProps, Platform } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export type ThemedInputProps = {
  label: string;
  placeholder?: string;
  value: any;
  onChangeText: (value: any) => void;
  lightColor?: string;
  darkColor?: string;
  inputStyle?: string;
  containerStyle?: string;
  error?: string;
  disabled?: boolean;
  type?: "text" | "number" | "date";
  dateRange?: "past" | "future" | "both"; // New prop
} & TextInputProps;

export function ThemedInput({
  label,
  placeholder,
  value,
  onChangeText,
  lightColor,
  darkColor,
  inputStyle = "",
  containerStyle = "",
  error,
  disabled = false,
  type = "text",
  dateRange = "both", // Default: allow both past & future dates
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const borderColor = error ? "border-red-500" : "border-gray-300";

  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const today = new Date();
      if (
        (dateRange === "past" && selectedDate > today) || 
        (dateRange === "future" && selectedDate < today)
      ) {
        return; // Prevent selection if it doesn't match the allowed range
      }
      onChangeText(selectedDate);
    }
  };

  return (
    <View className={`mb-4 ${containerStyle}`} style={{ width: "100%" }}>
      <Text className="text-base font-semibold mb-2 text-black ">
        {label}
      </Text>
      {type === "date" ? (
        <View
          style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: error ? "red" : "#d1d5db", 
            backgroundColor: "#f3f4f6",
            width: "100%", 
            padding: 8,
          }}
        >
          <DateTimePicker
            value={value as Date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={dateRange === "future" ? new Date() : undefined} // Prevent past dates
            maximumDate={dateRange === "past" ? new Date() : undefined} // Prevent future dates
            style={{ width: "100%" }}
            {...(Platform.OS === "ios" && { textColor: "black" })}
          />
        </View>
      ) : (
        <TextInput
          placeholder={placeholder}
          value={value as string}
          onChangeText={onChangeText}
          editable={!disabled}
          keyboardType={type === "number" ? "numeric" : "default"}
          className={`border rounded-lg  text-black  text-base bg-gray-100 dark:bg-gray-800 ${borderColor} ${
            disabled ? "opacity-50" : ""
          } ${inputStyle}`}
          placeholderTextColor="gray"
          style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: error ? "red" : "#d1d5db",
            backgroundColor: "#f3f4f6",
            width: "100%",
            padding: 16,
          }}
          {...rest}
        />
      )}
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
