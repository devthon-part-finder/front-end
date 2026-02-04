import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  loginApi,
  refreshAccessTokenApi,
  resetPasswordApi,
  sendResetCodeApi,
  signupApi,
  type AuthLoginInput,
  type AuthSession,
  type AuthSignupInput,
  type AuthUser,
} from "../services/authApi";

// AuthProvider: handles login state and exposes auth actions.
type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (input: AuthLoginInput) => Promise<void>;
  signup: (input: AuthSignupInput) => Promise<void>;
  logout: () => void;
  sendResetCode: (email: string) => Promise<string>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string,
  ) => Promise<void>;
  clearError: () => void;
  getAuthHeader: () => Promise<{ Authorization?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState<
    number | null
  >(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState<
    number | null
  >(null);

  const storage = useMemo(
    () => ({
      getItem: async (key: string) => {
        if (Platform.OS === "web") {
          return Promise.resolve(globalThis.localStorage?.getItem(key) ?? null);
        }
        return AsyncStorage.getItem(key);
      },
      setItem: async (key: string, value: string) => {
        if (Platform.OS === "web") {
          globalThis.localStorage?.setItem(key, value);
          return;
        }
        await AsyncStorage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        if (Platform.OS === "web") {
          globalThis.localStorage?.removeItem(key);
          return;
        }
        await AsyncStorage.removeItem(key);
      },
    }),
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  const clearSession = useCallback(async () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setAccessTokenExpiresAt(null);
    setRefreshTokenExpiresAt(null);
    await storage.removeItem("auth.session");
  }, [storage]);

  const persistSession = useCallback(
    async (session: AuthSession) => {
      await storage.setItem("auth.session", JSON.stringify(session));
    },
    [storage],
  );

  const applySession = useCallback((session: AuthSession) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
    setAccessTokenExpiresAt(session.accessTokenExpiresAt);
    setRefreshTokenExpiresAt(session.refreshTokenExpiresAt);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken || !refreshTokenExpiresAt) {
      await clearSession();
      return null;
    }

    if (refreshTokenExpiresAt <= Date.now()) {
      await clearSession();
      return null;
    }

    try {
      const result = await refreshAccessTokenApi(refreshToken);
      setAccessToken(result.accessToken);
      setAccessTokenExpiresAt(result.accessTokenExpiresAt);

      const currentSession: AuthSession | null = user
        ? {
            user,
            accessToken: result.accessToken,
            refreshToken,
            accessTokenExpiresAt: result.accessTokenExpiresAt,
            refreshTokenExpiresAt,
          }
        : null;

      if (currentSession) {
        await persistSession(currentSession);
      }

      return result.accessToken;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh session.",
      );
      await clearSession();
      return null;
    }
  }, [clearSession, persistSession, refreshToken, refreshTokenExpiresAt, user]);

  const getAuthHeader = useCallback(async () => {
    const now = Date.now();
    if (
      accessToken &&
      accessTokenExpiresAt &&
      accessTokenExpiresAt > now + 5000
    ) {
      return { Authorization: `Bearer ${accessToken}` };
    }

    const refreshed = await refreshAccessToken();
    return refreshed ? { Authorization: `Bearer ${refreshed}` } : {};
  }, [accessToken, accessTokenExpiresAt, refreshAccessToken]);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await storage.getItem("auth.session");
      if (!stored) {
        return;
      }

      const parsed: AuthSession = JSON.parse(stored);
      if (!parsed?.refreshToken || !parsed?.user) {
        await clearSession();
        return;
      }

      applySession(parsed);

      const now = Date.now();
      if (parsed.accessTokenExpiresAt <= now) {
        await refreshAccessToken();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to restore session.",
      );
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [applySession, clearSession, refreshAccessToken, storage]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (input: AuthLoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await loginApi(input);
      applySession(session);
      await persistSession(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (input: AuthSignupInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await signupApi(input);
      applySession(session);
      await persistSession(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    void clearSession();
  };

  const sendResetCode = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { code } = await sendResetCodeApi(email);
      return code;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset code.",
      );
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await resetPasswordApi(email, code, newPassword);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      signup,
      logout,
      sendResetCode,
      resetPassword,
      clearError,
      getAuthHeader,
    }),
    [
      user,
      isLoading,
      error,
      login,
      signup,
      logout,
      sendResetCode,
      resetPassword,
      clearError,
      getAuthHeader,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
