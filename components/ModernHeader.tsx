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
            style={variant === 'minimal' ? styles.minimalBackButton : styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-back" 
              size={20} 
              color={variant === 'minimal' ? lightTheme.colors.text : lightTheme.colors.white} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Section */}
      <View style={styles.centerSection}>
        <Text style={variant === 'minimal' ? styles.minimalTitle : styles.title}>{title}</Text>
        {subtitle && <Text style={variant === 'minimal' ? styles.minimalSubtitle : styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        {rightAction && (
          <TouchableOpacity
            style={variant === 'minimal' ? styles.minimalRightButton : styles.rightButton}
            onPress={rightAction.onPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={rightAction.icon} 
              size={20} 
              color={variant === 'minimal' ? lightTheme.colors.text : lightTheme.colors.white} 
            />
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  defaultHeader: {
    backgroundColor: lightTheme.colors.primary,
    shadowColor: lightTheme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  minimalHeader: {
    backgroundColor: lightTheme.colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: lightTheme.colors.gray200,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    minHeight: 80,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: lightTheme.colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: lightTheme.colors.white,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  minimalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: lightTheme.colors.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  minimalSubtitle: {
    fontSize: 12,
    color: lightTheme.colors.gray700,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  minimalBackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: lightTheme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimalRightButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: lightTheme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
