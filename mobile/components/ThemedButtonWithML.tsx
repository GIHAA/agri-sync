import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
  View,
  LayoutChangeEvent,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trackInteraction } from "@/api/trackEventService";
import { router } from "expo-router";

export type ThemedButtonProps = {
  label: string;
  onPress: () => void;
  onMissClick ?: () => void;
  buttonId: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  containerStyle?: string;
  textStyle?: string;
  viewStyle?: string;
  missClickTrackingArea?: number;
  missContainerStyle?: string;
};

export function ThemedButtonWithML({
  label,
  onPress,
  onMissClick,
  buttonId,
  disabled = false,
  loading = false,
  variant = "primary",
  viewStyle = "",
  containerStyle = "",
  textStyle = "",
  missClickTrackingArea = 50,
  missContainerStyle = "",
}: ThemedButtonProps) {
  const themeColor = useThemeColor({}, "background");
  const buttonRef = useRef<any>(null);
  const containerRef = useRef<View>(null);
  const sessionStartTime = useRef<number>(Date.now());
  const [buttonLayout, setButtonLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return `bg-[#2F855A] ${disabled ? "opacity-50" : ""}`;
      case "secondary":
        return `bg-green-200 border-green-300 ${disabled ? "opacity-50" : ""}`;
      case "outline":
        return `bg-transparent border-green-600 ${
          disabled ? "opacity-50" : ""
        }`;
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

  const handleLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setButtonLayout({ x, y, width, height });
  };

  const calculateMissClickDistance = (
    clickX: number,
    clickY: number,
    buttonLayout: any
  ) => {
    // Calculate the center of the button
    const buttonCenterX = buttonLayout.x + buttonLayout.width / 2;
    const buttonCenterY = buttonLayout.y + buttonLayout.height / 2;

    // Calculate Euclidean distance
    const distance = Math.sqrt(
      Math.pow(clickX - buttonCenterX, 2) + Math.pow(clickY - buttonCenterY, 2)
    );

    return distance;
  };

  const trackButtonInteraction = async (
    event: GestureResponderEvent,
    isMissClick: boolean = false
  ) => {
    try {
      // Get user ID from SecureStore
      const user = await SecureStore.getItemAsync("user");
      const userId = user ? JSON.parse(user).id : null;

      //Get click coordinates
      // const { locationX, locationY } = event.nativeEvent;

      // Calculate session duration
      const sessionDuration = Math.floor(
        (Date.now() - sessionStartTime.current) / 1000
      );

      // Prepare interaction data
      const interactionData = {
        user_id: userId || "unknown",
        button_id: buttonId,
        click_coordinates: {
          x: 1,
          y: 2,
        },
        missed_click_distance:
          isMissClick && buttonLayout
            ? calculateMissClickDistance(2, 1, buttonLayout)
            : 0,
        is_miss_click: isMissClick,
        session_duration: sessionDuration,
        device: Device.deviceName || "Unknown Device",
        timestamp: new Date().toISOString(),
      };

      // Send interaction data to tracking service
      await trackInteraction(interactionData);

      // Call the original onPress handler only if it's not a miss click
      if (!isMissClick) {
        onPress();
      }
    } catch (error) {
      console.error("Error tracking button interaction:", error);
      // Fallback to original onPress if tracking fails
      if (!isMissClick) {
        onPress();
      }
    }
  };

  return (
    <View
      ref={containerRef}
      className={`relative w-full p-4 ${viewStyle}`}
      onLayout={handleLayout}
    >
      {/* Invisible miss-click tracking area */}
      <TouchableOpacity
      className={`absolute z-0 ${missContainerStyle}`}
        style={{
          top: -missClickTrackingArea,
          left: -missClickTrackingArea,
          right: -missClickTrackingArea,
          bottom: -missClickTrackingArea,
        }}
        onPress={(event) => {
          trackButtonInteraction(event, true)
          onMissClick && onMissClick()
        }}
      />

      {/* Actual button */}
      <TouchableOpacity
        ref={buttonRef}
        onPress={(event) => trackButtonInteraction(event, false)}
        disabled={disabled || loading}
        className={`flex items-center justify-center rounded-lg border px-4 py-3 my-1 ${getButtonClasses()} ${containerStyle}`}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#fff" : themeColor}
          />
        ) : (
          <Text
            className={`font-semibold text-base ${getTextClasses()} ${textStyle}`}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
