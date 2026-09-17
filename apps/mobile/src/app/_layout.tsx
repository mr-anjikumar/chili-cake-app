import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF9F1' },
        headerTintColor: '#2B2118',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#FFF9F1' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Discover', headerShown: false }}
      />
      <Stack.Screen
        name="add-dish"
        options={{ title: 'Add a dish' }}
      />
      <Stack.Screen
        name="dish-detail"
        options={{ title: 'Dish details' }}
      />
      <Stack.Screen
        name="explore"
        options={{ title: 'Explore' }}
      />
    </Stack>
  );
}
