// Define rules for preferences
export const rulesEngine = {
  text_size: {
    Medium: 14,        // Set font size as numbers
    Large: 18,         // Set font size as numbers
    "Extra Large": 22, // Set font size as numbers
  },
  color_friendly_scheme: {
    "Red-Green Safe": "text-black",
    "Blue-Yellow Safe": "text-blue-600",
    Grayscale: "text-gray-800",
    Default: "text-black",
  },
  layout: {
    Simple: "leading-6",
    Compact: "leading-5",
  },
  age: {
    young: {
      text_size: 14, // Use numbers for font sizes
      color: "text-blue-500",
    },
    middle_aged: {
      text_size: 18, // Use numbers for font sizes
      color: "text-black",
    },
    senior: {
      text_size: 22, // Use numbers for font sizes
      color: "text-gray-800",
    },
  },
};

// Utility function to classify age group
export function getAgeGroup(age: number): "young" | "middle_aged" | "senior" {
  if (age < 30) return "young";
  if (age >= 30 && age < 60) return "middle_aged";
  return "senior";
}
