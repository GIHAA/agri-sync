// Define rules for preferences
export const rulesEngine = {
    text_size: {
      Medium: "text-base",
      Large: "text-lg",
      "Extra Large": "text-xl",
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
        text_size: "text-base",
        color: "text-blue-500",
      },
      middle_aged: {
        text_size: "text-lg",
        color: "text-black",
      },
      senior: {
        text_size: "text-xl",
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
  
  // Evaluate rules based on preferences
  export function evaluateRules(preferences: any, rules: any) {
    const resolvedStyles: Record<string, string> = {};
  
    Object.keys(preferences).forEach((key) => {
      if (key === "age") {
        const ageGroup = getAgeGroup(preferences[key]);
        const ageRules = rules.age[ageGroup];
        if (ageRules) {
          Object.assign(resolvedStyles, ageRules); // Merge age-based styles
        }
      } else if (rules[key] && rules[key][preferences[key]]) {
        resolvedStyles[key] = rules[key][preferences[key]];
      }
    });
  
    return resolvedStyles;
  }
  