import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightTheme } from '../constants/theme';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  variant?: 'default' | 'gradient' | 'minimal';
}

export function ModernHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  variant = 'default'
}: ModernHeaderProps) {
  const renderContent = () => (
    <View style={styles.content}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={lightTheme.colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Section */}
      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        {rightAction && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={rightAction.onPress}
            activeOpacity={0.7}
          >
            <Ionicons name={rightAction.icon} size={24} color={lightTheme.colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[lightTheme.colors.primary, lightTheme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <SafeAreaView style={styles.safeArea}>
          {renderContent()}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (variant === 'minimal') {
    return (
      <SafeAreaView style={styles.minimalSafeArea}>
        <View style={styles.minimalHeader}>
          {renderContent()}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.defaultHeader}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: lightTheme.colors.primary,
  },
  minimalSafeArea: {
    backgroundColor: lightTheme.colors.background,
  },
  gradientHeader: {
    shadowColor: lightTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  defaultHeader: {
    backgroundColor: lightTheme.colors.primary,
    shadowColor: lightTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  minimalHeader: {
    backgroundColor: lightTheme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.gray200,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: lightTheme.colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
  },
});
