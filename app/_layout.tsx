// app/_layout.tsx
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { TransactionProvider } from '../data/TransactionContext';

export default function RootLayout() {
  return (
    <PaperProvider>
      <TransactionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TransactionProvider>
    </PaperProvider>
  );
}