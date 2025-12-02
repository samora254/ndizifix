import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0A0A0A" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="video/[id]"
        options={{
          presentation: "fullScreenModal",
          animation: "fade",
        }}
      />
    </Stack>
  );
}
