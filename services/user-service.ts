// Mock API implementation for authentication.
// Replace these with real API calls when backend is ready.

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

const resetCodes = new Map<string, string>();
const refreshTokens = new Map<string, { userId: string; expiresAt: number }>();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getApiBaseUrl = () => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not set.");
  }
  return baseUrl.replace(/\/$/, "");
};

const baseUrl = getApiBaseUrl();

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
  const response = await fetch(`${baseUrl}/api/v1/users/login`, {
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
  const response = await fetch(`${baseUrl}/api/v1/users/register`, {
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
  await wait(400);

  const record = refreshTokens.get(refreshToken);
  if (!record || record.expiresAt <= Date.now()) {
    throw new Error("Refresh token expired. Please log in again.");
  }

  const expiresIn = 15 * 60;
  const refreshExpiresIn = Math.max(
    0,
    Math.floor((record.expiresAt - Date.now()) / 1000),
  );
  const accessToken = createMockToken(record.userId, "access");

  return {
    access_token: accessToken,
    token_type: "bearer",
    expires_in: expiresIn,
    refresh_token: refreshToken,
    refresh_expires_in: refreshExpiresIn,
  };
}

export async function sendResetCodeApi(
  email: string,
): Promise<{ code: string }> {
  await wait(500);

  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (!user) {
    throw new Error("No account found for this email.");
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  resetCodes.set(email.toLowerCase(), code);

  // In a real API, this code would be emailed. We return it for mock UX.
  return { code };
}

export async function resetPasswordApi(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  await wait(600);

  const expectedCode = resetCodes.get(email.toLowerCase());
  if (!expectedCode || expectedCode !== code) {
    throw new Error("Invalid or expired reset code.");
  }

  mockUsers = mockUsers.map((user) =>
    user.email.toLowerCase() === email.toLowerCase()
      ? { ...user, password: newPassword }
      : user,
  );

  resetCodes.delete(email.toLowerCase());
}
