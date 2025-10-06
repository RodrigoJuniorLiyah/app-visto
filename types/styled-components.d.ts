import 'styled-components';
import { MobileTheme } from '../constants/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends MobileTheme {}
}
