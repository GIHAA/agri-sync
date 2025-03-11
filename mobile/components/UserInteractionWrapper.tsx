import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  View,
  LayoutChangeEvent,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trackInteraction } from "@/api/trackEventService";
import { Dimensions } from "react-native";

export type UserInteractionWrapperProps = {
  onMissClick?: () => void;
  devmode?: boolean;
  buttonId: string;
  missClickTrackingArea?: number;
  missContainerStyle?: string;
  actualButton: React.ReactNode;
};

export function UserInteractionWrapper({
  onMissClick,
  buttonId,
  devmode = false,
  missClickTrackingArea = 50,
  actualButton,
}: UserInteractionWrapperProps) {
  const containerRef = useRef<View>(null);
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

  const handleButtonLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
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
    } catch (error) {
      console.error("Error tracking button interaction:", error);
    }
  };

  return (
    <View
      ref={containerRef}
      className={`relative w-full p-4 `}
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
        <View 
        style={{
          top: -missClickTrackingArea,
          left: -missClickTrackingArea,


        }}
        className="absolute top-0 left-0 z-20 bg-white opacity-70 p-2 rounded-md shadow">
            <Text style={{ fontSize: 12 }}>Touch:</Text>
            <Text style={{ fontSize: 12 }}>X: {coordinates.x.toFixed(2)}</Text>
            <Text style={{ fontSize: 12 }}>Y: {coordinates.y.toFixed(2)}</Text>
            <Text style={{ fontSize: 12 }}>Id: {buttonId}</Text>
        </View>
      )}

      {/* Actual button */}
      {actualButton}
    </View>
  );
}
