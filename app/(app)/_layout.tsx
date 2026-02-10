import { Redirect, Tabs, useRootNavigationState } from "expo-router";
import { View } from "react-native";
import { BottomNavbar } from "../../components/navbars/BottomNavbar";
import { TopNavbar } from "../../components/navbars/TopNavbar";
import { useAuth } from "../../providers/AuthProvider";
import { CatalogSearchProvider } from "../../providers/CatalogSearchProvider";
import { LayoutProvider } from "../../providers/LayoutProvider";

// App layout: protected routes with top and bottom navigation.
export default function AppLayout() {
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
      <CatalogSearchProvider>
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <Tabs
            screenOptions={{
              header: () => <TopNavbar />,
            }}
            tabBar={() => <BottomNavbar />}
          />
        </View>
      </CatalogSearchProvider>
    </LayoutProvider>
  );
}
