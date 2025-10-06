/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { lightTheme, darkTheme, MobileTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof MobileTheme['colors']
) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme.colors[colorName];
  }
}
