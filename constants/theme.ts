// Simplified theme structure
export interface MobileTheme {
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    background: string;
    gray100: string;
    gray200: string;
    gray500: string;
    gray700: string;
    gray800: string;
    text: string;
    footer: string;
    danger: string;
    dangerLight: string;
    success: string;
    successLight: string;
    successLighter: string;
    alert: string;
    blue: string;
    white: string;
    cardNum: string;
    modalbg: string;
    especText: string;
    black: string;
    ModalButton: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fonts: {
      regular: string;
      bold: string;
      black: string;
      light: string;
      thin: string;
    };
  };
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  borderRadius: {
    xs: number;
    s: number;
    sm: number;
    m: number;
    l: number;
    xl: number;
  };
  fonts: {
    regular: string;
    bold: string;
    black: string;
    light: string;
    thin: string;
  };
}

// Light theme
export const lightTheme: MobileTheme = {
  colors: {
    primary: "#0761A6",
    primaryLight: "rgba(19, 119, 254, 0.10)",
    secondary: "#4AB38B",
    background: "#FAFBFC",
    gray100: "#EFF2F4",
    gray200: "#C8D0D6",
    gray500: "#8198AC",
    gray700: "#60768A",
    gray800: "#3A5163",
    text: "#011729",
    footer: "#333333",
    danger: "#8E0101",
    dangerLight: "#FEE2E2",
    success: "#4AB38B",
    successLight: "rgba(74, 179, 139, .10)",
    successLighter: "#4AB38B40",
    alert: "#F59E0B",
    blue: "#1377FE",
    white: "#FFFFFF",
    cardNum: "#15588A",
    modalbg: "rgba(24, 24, 24, 0.80)",
    especText: "#BDCC36",
    black: "#011729",
    ModalButton: "#F2F2F7",
  },
  typography: {
    fontFamily: "Lato",
    fontSize: 16,
    fontWeight: "400",
    fonts: {
      regular: "LatoRegular",
      bold: "LatoBold",
      black: "LatoBlack",
      light: "LatoLight",
      thin: "LatoThin",
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    l: 24,
    xl: 32,
  },
  fonts: {
    regular: "LatoRegular",
    bold: "LatoBold",
    black: "LatoBlack",
    light: "LatoLight",
    thin: "LatoThin",
  },
};

// Dark theme
export const darkTheme: MobileTheme = {
  colors: {
    primary: "#1377FE",
    primaryLight: "rgba(19, 119, 254, 0.20)",
    secondary: "#4AB38B",
    background: "#011729",
    gray100: "#3A5163",
    gray200: "#60768A",
    gray500: "#8198AC",
    gray700: "#C8D0D6",
    gray800: "#EFF2F4",
    text: "#FFFFFF",
    footer: "#EFF2F4",
    danger: "#FF6B6B",
    dangerLight: "#FEE2E2",
    success: "#4AB38B",
    successLight: "rgba(74, 179, 139, .20)",
    successLighter: "#4AB38B40",
    alert: "#F59E0B",
    blue: "#1377FE",
    white: "#FFFFFF",
    cardNum: "#1377FE",
    modalbg: "rgba(24, 24, 24, 0.90)",
    especText: "#BDCC36",
    black: "#011729",
    ModalButton: "#3A5163",
  },
  typography: {
    fontFamily: "Lato",
    fontSize: 16,
    fontWeight: "400",
    fonts: {
      regular: "LatoRegular",
      bold: "LatoBold",
      black: "LatoBlack",
      light: "LatoLight",
      thin: "LatoThin",
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    l: 24,
    xl: 32,
  },
  fonts: {
    regular: "LatoRegular",
    bold: "LatoBold",
    black: "LatoBlack",
    light: "LatoLight",
    thin: "LatoThin",
  },
};