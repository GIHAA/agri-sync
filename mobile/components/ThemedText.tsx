import { Text, type TextProps } from "react-native";
import { evaluateRules, rulesEngine } from "@/utils/ruleEngine";
import farmerData from "@/data";


export type ThemedTextProps = TextProps & {
  userId?: number; 
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  className?: string;
};

export function ThemedText({
  userId = 1, // Default user ID
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  // Fetch user preferences
  const userPreferences = farmerData.find((user: { user_id: number; }) => user.user_id === userId) || {};

  // Default preferences if user not found
  const preferences = {
    text_size: "Medium",
    color_friendly_scheme: "Default",
    layout: "Simple",
    age: 25, // Default age
    ...userPreferences,
  };

  // Evaluate rules based on preferences
  const resolvedStyles = evaluateRules(preferences, rulesEngine);

  // Merge resolved styles
  const typeClasses = {
    default: `${resolvedStyles.text_size || "text-base"} ${resolvedStyles.color || "text-black"} ${resolvedStyles.layout || "leading-6"}`,
    defaultSemiBold: `${resolvedStyles.text_size || "text-base"} font-semibold ${resolvedStyles.layout || "leading-6"}`,
    title: `${resolvedStyles.text_size || "text-2xl"} font-bold mb-4 ${resolvedStyles.color || "text-black"}`,
    subtitle: `${resolvedStyles.text_size || "text-xl"} font-bold`,
    link: `${resolvedStyles.text_size || "text-base"} text-blue-500`,
  };

  return (
    <Text
      className={`${typeClasses[type]} ${className}`}
      {...rest}
    />
  );
}
