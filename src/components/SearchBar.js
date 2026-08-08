import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';

/**
 * SearchBar — shared search input + filter button row used by question,
 * category, and level screens (always paired identically in the design).
 *
 * Props:
 *  value          {string}  – current search text
 *  onChangeText   {func}    – search text change handler
 *  placeholder    {string}  – input placeholder (default: 'Search Catagories')
 *  onFilterPress  {func}    – opens the sort sheet
 */
export default function SearchBar({ value, onChangeText, placeholder = 'Search Catagories', onFilterPress }) {
  return (
    <View style={styles.row}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.black} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress} activeOpacity={0.75}>
        <Ionicons name="options-outline" size={22} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  searchIcon: {
    marginRight: Spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    height: '100%',
  },

  filterButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
