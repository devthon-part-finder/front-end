import { Tabs, useRootNavigationState } from "expo-router";
import { BottomNavbar } from "../../components/navbars/BottomNavbar";
import { TopNavbar } from "../../components/navbars/TopNavbar";
import { useAuth } from "../../providers/AuthProvider";
import { LayoutProvider } from "../../providers/LayoutProvider";

// App layout: protected routes with top and bottom navigation.
export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key || isLoading) {
    return null;
  }

  // if (!isAuthenticated) {
  //   return <Redirect href="/(auth)/login" />;
  // }

  return (
    <LayoutProvider>
      <Tabs
        screenOptions={{
          header: () => <TopNavbar />,
        }}
        tabBar={() => <BottomNavbar />}
      />
    </LayoutProvider>
  );
}
