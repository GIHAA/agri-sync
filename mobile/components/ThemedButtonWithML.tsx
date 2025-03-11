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
import { useThemeColor } from "@/hooks/useThemeColor";
import { trackInteraction } from "@/api/trackEventService";
import { Dimensions } from "react-native";

export type ThemedButtonProps = {
  label: string;
  onPress: () => void;
  onMissClick?: () => void;
  devmode?: boolean;
  buttonId: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  containerStyle?: string;
  textStyle?: string;
  viewStyle?: string;
  missClickTrackingArea?: number;
  missContainerStyle?: string;
  actualButton?: React.ReactNode;
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
  devmode = false,
  containerStyle = "",
  textStyle = "",
  missClickTrackingArea = 50,
  missContainerStyle = "",
  actualButton,
}: ThemedButtonProps) {
  const themeColor = useThemeColor({}, "background");
  const containerRef = useRef<View>(null);
  const sessionStartTime = useRef<number>(Date.now());
  const [buttonLayout, setButtonLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [buttonContainerLayout, setButtonContainerLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const { width, height } = Dimensions.get("window");

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

  const handleButtonLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log("Button layout:", { x, y, width, height });
    setButtonLayout({ x, y, width, height });
  };

  const [coordinates, setCoordinates] = React.useState({ x: 0, y: 0 });

  const handleLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setButtonContainerLayout({ x, y, width, height });
  };

  const trackButtonInteraction = async (
    event: GestureResponderEvent,
    isMissClick: boolean = false
  ) => {
    const { locationX, locationY } = event.nativeEvent;

    setCoordinates({ x: locationX, y: locationY });

    try {
      // Get user ID from SecureStore
      const user = await SecureStore.getItemAsync("user");
      const userId = user ? JSON.parse(user).id : null;

      const interactionData = {
        userID: userId || 99,
        buttonId: buttonId,
        touchPoint: {
          x: locationX,
          y: locationY,
        },
        buttonBounds: {
          x: (buttonContainerLayout?.x || 0) + (buttonLayout?.x || 0),
          y: (buttonContainerLayout?.y || 0) + (buttonLayout?.y || 0),
          width: buttonLayout?.width,
          height: buttonLayout?.height,
        },
        isMissClick: isMissClick,
        deviceMetrics: {
          screenWidth: width,
          screenHeight: height,
          deviceOrientation: "portrait",
        },
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
        className={`absolute z-0 ${
          devmode ? "bg-cyan-100 opacity-50 border-2 border-cyan-600" : ""
        }}`}
        style={{
          top: -missClickTrackingArea,
          left: -missClickTrackingArea,
          right: -missClickTrackingArea,
          bottom: -missClickTrackingArea,
        }}
        onPress={(event) => {
          trackButtonInteraction(event, true);
          onMissClick && onMissClick();
        }}
        onLayout={handleButtonLayout}
      />
      {devmode && (
        <View className="absolute top-0 left-0 z-20 bg-white opacity-70 p-2 rounded-md shadow">
          <Text>Touch coordinates:</Text>
          <Text>X: {coordinates.x.toFixed(2)}</Text>
          <Text>Y: {coordinates.y.toFixed(2)}</Text>
        </View>
      )}

      {/* Actual button */}
      {actualButton ? (
        <>
        {actualButton}
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={(event) => {
              trackButtonInteraction(event);
              onPress();
            }}
            disabled={disabled || loading}
            className={`flex items-center justify-center rounded-lg border px-4 py-3 my-1 ${getButtonClasses()} ${
              devmode ? "z-10" : ""
            } ${containerStyle}`}
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
        </>
      )}
    </View>
  );
}
