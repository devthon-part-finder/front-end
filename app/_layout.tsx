import { AuthProvider } from "@/providers/AuthProvider";
import { MessageProvider } from "@/providers/MessageProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";

// Root layout: wires up global providers and the app router.
export default function RootLayout() {
  return (
    <ThemeProvider>
      <MessageProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}
