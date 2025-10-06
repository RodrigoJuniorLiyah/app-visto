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
    primary: "#FF6B6B",
    primaryLight: "rgba(255, 107, 107, 0.15)",
    secondary: "#4ECDC4",
    background: "#F8F9FA",
    gray100: "#E9ECEF",
    gray200: "#DEE2E6",
    gray500: "#6C757D",
    gray700: "#495057",
    gray800: "#343A40",
    text: "#212529",
    footer: "#6C757D",
    danger: "#E74C3C",
    dangerLight: "#FADBD8",
    success: "#27AE60",
    successLight: "rgba(39, 174, 96, 0.15)",
    successLighter: "#D5F4E6",
    alert: "#F39C12",
    blue: "#3498DB",
    white: "#FFFFFF",
    cardNum: "#2C3E50",
    modalbg: "rgba(0, 0, 0, 0.75)",
    especText: "#E67E22",
    black: "#2C3E50",
    ModalButton: "#ECF0F1",
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
    primary: "#FF6B6B",
    primaryLight: "rgba(255, 107, 107, 0.25)",
    secondary: "#4ECDC4",
    background: "#1A1A1A",
    gray100: "#2C2C2C",
    gray200: "#404040",
    gray500: "#6C6C6C",
    gray700: "#A0A0A0",
    gray800: "#D0D0D0",
    text: "#FFFFFF",
    footer: "#A0A0A0",
    danger: "#FF4757",
    dangerLight: "#FF6B7A",
    success: "#2ED573",
    successLight: "rgba(46, 213, 115, 0.25)",
    successLighter: "#7BED9F",
    alert: "#FFA502",
    blue: "#3742FA",
    white: "#FFFFFF",
    cardNum: "#FF6B6B",
    modalbg: "rgba(0, 0, 0, 0.90)",
    especText: "#FFA502",
    black: "#000000",
    ModalButton: "#2C2C2C",
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