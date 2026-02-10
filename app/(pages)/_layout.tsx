import { Redirect, Stack, useRootNavigationState } from "expo-router";
import React from "react";
import { PagesNavbar } from "../../components/navbars/PagesNavbar";
import { useAuth } from "../../providers/AuthProvider";
import { LayoutProvider } from "../../providers/LayoutProvider";

// Pages layout: separate route group for standalone pages (no bottom tabs).
// Still protected by auth to match (app) behavior.
export default function PagesLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key || isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <LayoutProvider>
      <Stack
        screenOptions={{
          header: () => <PagesNavbar />,
        }}
      />
    </LayoutProvider>
  );
}
