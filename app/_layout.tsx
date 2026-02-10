import { AuthProvider } from "@/providers/AuthProvider";
import { MessageProvider } from "@/providers/MessageProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

function getStatusBarStyle(backgroundColor: string): "light" | "dark" {
  const hex = backgroundColor.replace("#", "");
  if (hex.length !== 6) return "dark";

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.5 ? "light" : "dark";
}

function ThemedStatusBar() {
  const { colors } = useTheme();
  const style = getStatusBarStyle(colors.background);

  const backgroundColor = style === "dark" ? "#ffffff" : colors.background;
  return <StatusBar style={style} backgroundColor={backgroundColor} />;
}

// Root layout: wires up global providers and the app router.
export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <MessageProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}
