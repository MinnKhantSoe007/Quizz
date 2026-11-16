import React from 'react';
import MenuView from '@expo/ui/community/menu';

/**
 * DropdownMenu — native menu (SwiftUI on iOS, Compose on Android) that opens
 * when its child (the trigger) is tapped.
 *
 * Props:
 *  items     {Array<{ label: string, onPress: func, danger?: bool }>}
 *  children  – the trigger element
 */
export default function DropdownMenu({ items, children }) {
  const actions = items.map(({ label, danger }) => ({
    id: label,
    title: label,
    attributes: { destructive: !!danger },
  }));

  return (
    <MenuView
      actions={actions}
      onPressAction={({ nativeEvent }) => items.find((i) => i.label === nativeEvent.event)?.onPress()}
    >
      {children}
    </MenuView>
  );
}
