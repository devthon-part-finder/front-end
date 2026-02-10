// API implementation for authentication.

export type AuthUser = {
  id: string;
  username: string;
  email: string;
};

export type AuthSession = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
};

export type AuthLoginInput = {
  email: string;
  password: string;
};

export type AuthSignupInput = {
  username: string;
  email: string;
  password: string;
};

type MockUserRecord = AuthUser & { password: string };

let mockUsers: MockUserRecord[] = [
  {
    id: "1",
    username: "demo",
    email: "demo@partfinder.com",
    password: "Password123",
  },
];

const refreshTokens = new Map<string, { userId: string; expiresAt: number }>();

const getApiBaseUrl = () => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not set.");
  }
  return baseUrl.replace(/\/$/, "");
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as {
        message?: string;
        detail?: string;
      };
      return data.message || data.detail || JSON.stringify(data);
    }

    const text = await response.text();
    return text || response.statusText;
  } catch {
    return response.statusText;
  }
}

const createMockToken = (userId: string, type: "access" | "refresh") => {
  const random = Math.random().toString(36).slice(2);
  return `${type}.${userId}.${random}`;
};

const buildSession = (data: AuthSession): AuthSession => {
  const refreshTokenExpiresAt = Date.now() + data.refresh_expires_in * 1000;

  refreshTokens.set(data.refresh_token, {
    userId: "api",
    expiresAt: refreshTokenExpiresAt,
  });

  return {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token,
    refresh_expires_in: data.refresh_expires_in,
  };
};

export async function loginApi(input: AuthLoginInput): Promise<AuthSession> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Login failed.");
  }

  const data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
  } = await response.json();

  console.log("Login response data:", data.access_token);

  return buildSession(data);
}

export async function signupApi(input: AuthSignupInput): Promise<AuthSession> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      username: input.username,
      password: input.password,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Signup failed.");
  }

  const data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
  } = await response.json();

  return buildSession(data);
}

export async function refreshAccessTokenApi(
  refreshToken: string,
): Promise<AuthSession> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/users/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Refresh token expired. Please log in again.");
  }

  const data: AuthSession = await response.json();
  return buildSession(data);
}

export async function sendResetCodeApi(
  email: string,
): Promise<{ message: string }> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/users/forgot-password/send-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(
      (await readErrorMessage(response)) || "Failed to send code.",
    );
  }

  const data: { message: string } = await response.json();
  return data;
}

export async function verifyResetCodeApi(
  email: string,
  code: string,
): Promise<{ valid: boolean; message: string }> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/users/forgot-password/verify-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    },
  );

  if (!response.ok) {
    throw new Error(
      (await readErrorMessage(response)) || "Failed to verify code.",
    );
  }

  const data: { valid: boolean; message: string } = await response.json();
  return data;
}

export async function resetPasswordApi(
  email: string,
  code: string,
  newPassword: string,
): Promise<{ message: string }> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/users/forgot-password/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, new_password: newPassword }),
    },
  );

  if (!response.ok) {
    throw new Error(
      (await readErrorMessage(response)) || "Failed to reset password.",
    );
  }

  const data: { message: string } = await response.json();
  return data;
}
