import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  loginApi,
  refreshAccessTokenApi,
  resetPasswordApi,
  sendResetCodeApi,
  signupApi,
  verifyResetCodeApi,
  type AuthLoginInput,
  type AuthSession,
  type AuthSignupInput,
} from "../services/user-service";

// AuthProvider: handles login state and exposes auth actions.
type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (input: AuthLoginInput) => Promise<void>;
  signup: (input: AuthSignupInput) => Promise<void>;
  logout: () => Promise<void>;
  sendResetCode: (email: string) => Promise<string>;
  verifyResetCode: (email: string, code: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string,
  ) => Promise<void>;
  clearError: () => void;
  getAuthHeader: () => Promise<{ Authorization?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type StoredSession = {
  session: AuthSession;
  receivedAt: number;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
  const refreshTokenRef = useRef<string | null>(null);
  const refreshTokenExpiresAtRef = useRef<number | null>(null);

  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  useEffect(() => {
    refreshTokenExpiresAtRef.current = refreshTokenExpiresAt;
  }, [refreshTokenExpiresAt]);

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
    setAccessToken(null);
    setRefreshToken(null);
    setAccessTokenExpiresAt(null);
    setRefreshTokenExpiresAt(null);
    await storage.removeItem("auth.session");
  }, [storage]);

  const persistSession = useCallback(
    async (session: AuthSession, receivedAt: number) => {
      const payload: StoredSession = { session, receivedAt };
      await storage.setItem("auth.session", JSON.stringify(payload));
    },
    [storage],
  );

  const applySession = useCallback(
    (session: AuthSession, receivedAt: number) => {
      const accessTokenExpiry = receivedAt + session.expires_in * 1000;
      const refreshTokenExpiry = receivedAt + session.refresh_expires_in * 1000;

      setAccessToken(session.access_token);
      setRefreshToken(session.refresh_token);
      setAccessTokenExpiresAt(accessTokenExpiry);
      setRefreshTokenExpiresAt(refreshTokenExpiry);
    },
    [],
  );

  const refreshAccessToken = useCallback(async () => {
    const currentRefreshToken = refreshTokenRef.current;
    const currentRefreshTokenExpiresAt = refreshTokenExpiresAtRef.current;

    if (!currentRefreshToken || !currentRefreshTokenExpiresAt) {
      await clearSession();
      return null;
    }

    if (currentRefreshTokenExpiresAt <= Date.now()) {
      await clearSession();
      return null;
    }

    try {
      const result = await refreshAccessTokenApi(currentRefreshToken);
      const receivedAt = Date.now();

      applySession(result, receivedAt);
      await persistSession(result, receivedAt);

      return result.access_token;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh session.",
      );
      await clearSession();
      return null;
    }
  }, [applySession, clearSession, persistSession]);

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

      const parsed = JSON.parse(stored) as StoredSession | AuthSession;
      const session = "session" in parsed ? parsed.session : parsed;
      const receivedAt =
        "receivedAt" in parsed ? parsed.receivedAt : Date.now();

      if (!session?.refresh_token) {
        await clearSession();
        return;
      }

      applySession(session, receivedAt);

      const now = Date.now();
      const accessTokenExpiresAt = receivedAt + session.expires_in * 1000;
      if (accessTokenExpiresAt <= now) {
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
      const receivedAt = Date.now();
      applySession(session, receivedAt);
      await persistSession(session, receivedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (input: AuthSignupInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await signupApi(input);
      const receivedAt = Date.now();
      applySession(session, receivedAt);
      await persistSession(session, receivedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await clearSession();
  };

  const sendResetCode = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { message } = await sendResetCodeApi(email);
      return message;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset code.",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetCode = async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await verifyResetCodeApi(email, code);
      if (!result.valid) {
        throw new Error(result.message || "Invalid verification code.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to verify reset code.",
      );
      throw err;
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
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(accessToken),
      isLoading,
      error,
      login,
      signup,
      logout,
      sendResetCode,
      verifyResetCode,
      resetPassword,
      clearError,
      getAuthHeader,
    }),
    [
      accessToken,
      isLoading,
      error,
      login,
      signup,
      logout,
      sendResetCode,
      verifyResetCode,
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
