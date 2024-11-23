import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
// Example date picker library
import { useThemeColor } from '@/hooks/useThemeColor';
import DatePicker from 'react-native-date-picker';

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

  return (
    <View className={`mb-4 ${containerStyle}`}>
      <Text className="text-base font-semibold mb-2 text-black dark:text-white">{label}</Text>
      {type === 'date' ? (
        <DatePicker
          date={typeof value === 'string' ? new Date(value) : value}
          mode="date"
          minimumDate={new Date('2000-01-01')}
          maximumDate={new Date('2100-12-31')}
          confirmText="Confirm"
          cancelText="Cancel"
          onDateChange={(date) => onChangeText(date)}
          is24hourSource={disabled ? 'locale' : 'device'}
        />
      ) : (
        <TextInput
          placeholder={placeholder}
          value={value}
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
