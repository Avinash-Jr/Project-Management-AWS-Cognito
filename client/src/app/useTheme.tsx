import { Theme } from "@aws-amplify/ui-react";

/**
 * Optimized Glassmorphism Navy Theme
 * - Uses shared alpha values for consistent "glass" depth.
 * - Refines contrast for production-grade accessibility.
 */
export const glassmorphismTheme: Theme = {
  name: "glassmorphism-navy-theme",
  tokens: {
    colors: {
      font: {
        primary: { value: "#ffffff" },
        secondary: { value: "#94a3b8" }, // slate-400
        tertiary: { value: "#cbd5e1" },  // slate-300
      },
      brand: {
        primary: {
          10: { value: "rgba(10, 25, 47, 0.1)" },
          80: { value: "#1e3a8a" }, // navy-800
          90: { value: "#1e40af" }, // navy-700
          100: { value: "#2563eb" }, // blue-600
        },
      },
      border: {
        // Shared border for glass refractive edges
        primary: { value: "rgba(255, 255, 255, 0.12)" },
      },
    },
    components: {
      authenticator: {
        router: {
          backgroundColor: { value: "rgba(10, 25, 47, 0.45)" }, // Deepened for better legibility
          borderWidth: { value: "1px" },
          borderColor: { value: "{colors.border.primary.value}" },
          boxShadow: { value: "0 8px 32px 0 rgba(0, 0, 0, 0.37)" }, // Standard glass shadow
        },
      },
      fieldcontrol: {
        color: { value: "{colors.font.primary.value}" },
        backgroundColor: { value: "rgba(10, 25, 47, 0.65)" }, 
        borderColor: { value: "rgba(255, 255, 255, 0.2)" }, // Slightly brighter for inputs
        borderRadius: { value: "12px" },
        _focus: {
          borderColor: { value: "{colors.brand.primary.80.value}" }, 
          boxShadow: { value: "0 0 0 2px rgba(59, 130, 246, 0.4)" },
        },
        _placeholder: {
          color: { value: "{colors.font.secondary.value}" },
        }
      },
      button: {
        primary: {
          backgroundColor: { value: "{colors.brand.primary.90.value}" },
          borderRadius: { value: "12px" },
          fontWeight: { value: "600" },
          _hover: {
            backgroundColor: { value: "{colors.brand.primary.100.value}" },
            boxShadow: { value: "0 0 15px rgba(30, 64, 175, 0.5)" },
          },
        },
        link: {
          color: { value: "#60a5fa" },
          _hover: { 
            color: { value: "#ffffff" },
            backgroundColor: { value: "transparent" }
          },
        },
      },
      tabs: {
        item: {
          color: { value: "{colors.font.secondary.value}" },
          fontWeight: { value: "600" },
          _active: {
            color: { value: "{colors.font.primary.value}" },
            borderColor: { value: "{colors.brand.primary.80.value}" },
            backgroundColor: { value: "rgba(255, 255, 255, 0.03)" },
          },
          _hover: {
            color: { value: "{colors.font.primary.value}" },
          }
        },
      },
    },
  },
};