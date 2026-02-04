# PartFinder Front-End

Minimal authentication flow with structured routing, providers, and a protected app shell.

## Directory overview

- app/
  - (auth)/
    - \_layout.tsx: Auth stack (login/signup/forgot-password).
    - login.tsx: Login screen (email + password).
    - signup.tsx: Signup screen (username + email + password + confirm).
    - forgot-password.tsx: Email -> 6-digit code -> new password flow.
  - (app)/
    - \_layout.tsx: Protected app layout with top/bottom navbars.
    - home.tsx: Home screen after login.
    - example.tsx: Example placeholder screen.
  - \_layout.tsx: Root layout wiring providers + router.
  - index.tsx: Redirects to auth or app based on login state.

- components/
  - FormInput.tsx: Labeled input for forms.
  - PrimaryButton.tsx: Primary action button.
  - TopNavbar.tsx: Top bar with title + logout.
  - BottomNavbar.tsx: Bottom tab navigation (Home, Example).

- providers/
  - ThemeProvider.tsx: Theme tokens for consistent colors.
  - AuthProvider.tsx: Auth state + actions (login, signup, reset).
  - LayoutProvider.tsx: Layout state (top bar title).

- services/
  - authApi.ts: Mock API calls (replace with real APIs later).

## How auth works

- `AuthProvider` exposes `login`, `signup`, `sendResetCode`, `resetPassword`, and `logout`.
- `app/index.tsx` redirects to login or home based on `isAuthenticated`.
- `app/(app)/_layout.tsx` protects routes; unauthenticated users are redirected to login.

## How to add new pages and show them in the bottom navbar

1. Add a new file inside app/(app)/. Example: app/(app)/profile.tsx.
2. Update the bottom navbar to include the new route.
   - Edit components/BottomNavbar.tsx and add a new tab button that routes to /(app)/profile.
3. Set the top title inside the page:
   - Use `useLayout()` and call `setTitle("Profile")` in a useEffect.

## Mock API behavior

- `services/authApi.ts` holds in-memory mock users and reset codes.
- Replace each function body with real API calls when your backend is ready.

## Run the app

1. Install dependencies

   npm install

2. Start the app

   npx expo start
