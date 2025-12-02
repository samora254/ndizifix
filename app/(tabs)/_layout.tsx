import { Tabs } from "expo-router";
import { Home, Tv, Film, Bookmark } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF3B5C",
        tabBarInactiveTintColor: "#6B7280",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A1A1A",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600" as const,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          tabBarIcon: ({ color }) => <Film size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="series"
        options={{
          title: "Series",
          tabBarIcon: ({ color }) => <Tv size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-list"
        options={{
          title: "My List",
          tabBarIcon: ({ color }) => <Bookmark size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
