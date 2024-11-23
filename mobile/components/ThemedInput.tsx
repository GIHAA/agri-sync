import React from 'react';
import { TextInput, View, Text, TextInputProps, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export type ThemedInputProps = {
  label: string;
  placeholder?: string;
  value: string | Date;
  onChangeText: (value: string | Date) => void;
  lightColor?: string;
  darkColor?: string;
  inputStyle?: string;
  containerStyle?: string;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'number' | 'date';
} & TextInputProps;

export function ThemedInput({
  label,
  placeholder,
  value,
  onChangeText,
  lightColor,
  darkColor,
  inputStyle = '',
  containerStyle = '',
  error,
  disabled = false,
  type = 'text',
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = error ? 'border-red-500' : 'border-gray-300';

  // State to handle showing the date picker for iOS and Android
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the picker after selection
    if (selectedDate) {
      onChangeText(selectedDate); // Pass the selected date to the parent component
    }
  };

  return (
    <View className={`mb-4 ${containerStyle}`}>
      <Text className="text-base font-semibold mb-2 text-black dark:text-white">{label}</Text>
      {type === 'date' ? (
        <>
          <Text
            onPress={() => setShowDatePicker(true)}
            className={`border rounded-lg p-4 mt-4 text-black dark:text-white text-base bg-gray-100 dark:bg-gray-800 ${borderColor} ${disabled ? 'opacity-50' : ''} ${inputStyle}`}
            style={{ color, ...(disabled ? { backgroundColor: 'rgba(0,0,0,0.1)' } : {}) }}
          > 
            {value}
          </Text>
          {showDatePicker && (
            <DateTimePicker
              value={value as Date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </>
      ) : (
        <TextInput
          placeholder={placeholder}
          value={value as string}
          onChangeText={onChangeText}
          editable={!disabled}
          keyboardType={type === 'number' ? 'numeric' : 'default'}
          className={`border rounded-lg p-4 mt-4 text-black dark:text-white text-base bg-gray-100 dark:bg-gray-800 ${borderColor} ${disabled ? 'opacity-50' : ''} ${inputStyle}`}
          placeholderTextColor="gray"
          style={{ color, ...(disabled ? { backgroundColor: 'rgba(0,0,0,0.1)' } : {}) }}
          {...rest}
        />
      )}
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
