import { Redirect, Stack, useRootNavigationState } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

// Auth layout: shows auth screens when user is logged out.
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key || isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
