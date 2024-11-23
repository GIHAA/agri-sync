import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const createScreenOptions = (title: string, focusedIcon: string, outlineIcon: string) => ({
  title,
  tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
    <TabBarIcon name={focused ? focusedIcon : outlineIcon as any} color={color} />
  ),
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={createScreenOptions('Home', 'home', 'home-outline')} />
      <Tabs.Screen name="rewards" options={createScreenOptions('Explore', 'gift', 'gift-outline')} />
    </Tabs>
  );
}
