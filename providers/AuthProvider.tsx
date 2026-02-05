import React, { createContext, useContext, useMemo, useState } from "react";
import {
    loginApi,
    resetPasswordApi,
    sendResetCodeApi,
    signupApi,
    type AuthLoginInput,
    type AuthSignupInput,
    type AuthUser,
} from "../services/authApi";

// AuthProvider: handles login state and exposes auth actions.
type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: AuthLoginInput) => Promise<void>;
  signup: (input: AuthSignupInput) => Promise<void>;
  logout: () => void;
  sendResetCode: (email: string) => Promise<string>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (input: AuthLoginInput) => {
    setIsLoading(true);
    try {
      const result = await loginApi(input);
      setUser(result);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (input: AuthSignupInput) => {
    setIsLoading(true);
    try {
      const result = await signupApi(input);
      setUser(result);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const sendResetCode = async (email: string) => {
    setIsLoading(true);
    try {
      const { code } = await sendResetCodeApi(email);
      return code;
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
    try {
      await resetPasswordApi(email, code, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated:true,
      isLoading,
      login,
      signup,
      logout,
      sendResetCode,
      resetPassword,
    }),
    [user, isLoading],
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
