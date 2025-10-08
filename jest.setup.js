import '@testing-library/jest-native/extend-expect';

// Mock do expo-file-system
jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///mock/documents/',
  getInfoAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  copyAsync: jest.fn(),
  moveAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

// Mock do expo-image-manipulator
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: {
    JPEG: 'jpeg',
    PNG: 'png',
  },
}));

// Mock do expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock do expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  Accuracy: {
    Balanced: 'balanced',
  },
}));

// Mock do expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useFocusEffect: jest.fn(),
}));

// Mock do react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
  SafeAreaProvider: 'SafeAreaProvider',
}));

// Mock do react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock do styled-components
jest.mock('styled-components/native', () => {
  const React = require('react');
  
  const styled = (Component) => (strings, ...values) => {
    return React.forwardRef((props, ref) => {
      // Simular styled component com props do tema
      const mockProps = {
        ...props,
        theme: props.theme || {
          colors: {
            primary: '#007AFF',
            secondary: '#5856D6',
            background: '#FFFFFF',
            text: '#000000',
            gray100: '#F2F2F7',
            gray300: '#C7C7CC',
            gray500: '#8E8E93',
            gray700: '#48484A',
            white: '#FFFFFF',
            blue: '#007AFF',
            danger: '#FF3B30',
            alert: '#FF9500',
          },
        },
      };
      
      return React.createElement(Component, { ...mockProps, ref });
    });
  };
  
  return styled;
});

// Mock do AsyncStorage (se usado no projeto)
// jest.mock('@react-native-async-storage/async-storage', () => ({
//   getItem: jest.fn(),
//   setItem: jest.fn(),
//   removeItem: jest.fn(),
//   clear: jest.fn(),
// }));

// Mock do react-native para evitar erros de TurboModule
jest.mock('react-native', () => {
  return {
    Alert: {
      alert: jest.fn(),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
    StatusBar: 'StatusBar',
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((style) => style),
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    Image: 'Image',
    TextInput: 'TextInput',
    SafeAreaView: 'SafeAreaView',
    useColorScheme: jest.fn(() => 'light'),
    Appearance: {
      getColorScheme: jest.fn(() => 'light'),
    },
  };
});

// Mock do @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock do expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
}));

// Mock do console para reduzir logs nos testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
