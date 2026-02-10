import { useAuth } from "@/providers/AuthProvider";
import { Redirect, type Href, useRootNavigationState } from "expo-router";

// Entry route: decides where to go based on auth state.
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key || isLoading) {
    return null;
  }

  return isAuthenticated ? (
    <Redirect href="/(app)/home" />
  ) : (
    <Redirect href={"/(auth)/welcome" as Href} />
  );
}
