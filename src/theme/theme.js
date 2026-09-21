import { Platform } from 'react-native';

export const Colors = {
  // Brand
  primary:          '#7F11E0',
  primaryLight:     '#9B4AE8',
  primaryDark:      '#660CB8',
  primaryHighlight: '#F3E8FF',
  secondary:        '#48BFE3',

  // Neutrals
  white:            '#FFFFFF',
  black:            '#000000',
  background:       '#FFFFFF',
  surface:          '#FFFFFF',

  // Text
  textPrimary:      '#000000',
  textSecondary:    '#4A4A4A',
  textPlaceholder:  '#BDBDBD',
  textLight:        '#BDBDBD',

  // Utility
  border:           '#E0E0E0',
  link:             '#FF5252',
  shadow:           '#7F11E026',
  error:            '#FF5252',
  success:          '#2DC653',
  warning:          '#F4A261',
  overlay:          '#00000055',
  divider:          '#E0E0E0',

  // Surfaces
  searchBackground: '#F5F5F5',
  cardShadow:       '#00000014',
};

export const FontFamily = {
  regular: 'RobotoRegular',
  bold:    'RobotoBold',
};

export const FontSize = {
  xs:   11,
  sm:   13,
  md:   16,
  lg:   20,
  xl:   24,
  xxl:  30,
  hero: 38,
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
};

export const Radius = {
  sm:     8,
  md:     12,
  lg:     20,
  button: 28,
  full:   999,
};


// iOS draws shadows from shadowColor + shadowOpacity; Android draws `elevation` shadows and uses the
// colour's own alpha, so the soft iOS colours vanish there. Use an opaque colour on Android instead.
export const Shadow = {
  card: Platform.select({
    ios: {
      shadowColor: Colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
    },
    android: { elevation: 4, shadowColor: '#000000' },
  }),
  floating: Platform.select({
    ios: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    android: { elevation: 6, shadowColor: Colors.primary },
  }),
};
