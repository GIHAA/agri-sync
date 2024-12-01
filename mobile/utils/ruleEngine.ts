// Define rules for preferences
export const rulesEngine = {
  text_size: {
    Medium: 14,      
    Large: 18,        
    "Extra Large": 22,
  },

  color_friendly_scheme: {
        "Red_Green_Safe": {
        color:  "text-black "
        },
        "Blue_Yellow_Safe":{
        color:  "text-blue-600"
        },
        Default: "text-black",
  },
  layout: {
    Simple: "leading-6",
    Compact: "leading-5",
  },

  age: {
    young: {
      text_size: 14,
      color: "white",
    },
    middle_aged: {
      text_size: 18, 
      color: "white",
    },
    senior: {
      text_size: 22, 
      color: "white",
    },
  },
};

// Utility function to classify age group
export function getAgeGroup(age: number): "young" | "middle_aged" | "senior" {
  if (age < 30) return "young";
  if (age >= 30 && age < 60) return "middle_aged";
  return "senior";
}



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