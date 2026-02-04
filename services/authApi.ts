// Mock API implementation for authentication.
// Replace these with real API calls when backend is ready.

export type AuthUser = {
  id: string;
  username: string;
  email: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
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

const createMockToken = (userId: string, type: "access" | "refresh") => {
  const random = Math.random().toString(36).slice(2);
  return `${type}.${userId}.${random}`;
};

const buildSession = (user: AuthUser): AuthSession => {
  const accessTokenExpiresAt = Date.now() + 15 * 60 * 1000;
  const refreshTokenExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const accessToken = createMockToken(user.id, "access");
  const refreshToken = createMockToken(user.id, "refresh");

  refreshTokens.set(refreshToken, {
    userId: user.id,
    expiresAt: refreshTokenExpiresAt,
  });

  return {
    user,
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  };
};

export async function loginApi(input: AuthLoginInput): Promise<AuthSession> {
  await wait(600);

  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase(),
  );
  if (!user || user.password !== input.password) {
    throw new Error("Invalid email or password.");
  }

  return buildSession({
    id: user.id,
    username: user.username,
    email: user.email,
  });
}

export async function signupApi(input: AuthSignupInput): Promise<AuthSession> {
  await wait(700);

  const existing = mockUsers.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase(),
  );
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const newUser: MockUserRecord = {
    id: String(mockUsers.length + 1),
    username: input.username,
    email: input.email,
    password: input.password,
  };

  mockUsers = [...mockUsers, newUser];

  return buildSession({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  });
}

export async function refreshAccessTokenApi(
  refreshToken: string,
): Promise<{ accessToken: string; accessTokenExpiresAt: number }> {
  await wait(400);

  const record = refreshTokens.get(refreshToken);
  if (!record || record.expiresAt <= Date.now()) {
    throw new Error("Refresh token expired. Please log in again.");
  }

  const accessToken = createMockToken(record.userId, "access");
  const accessTokenExpiresAt = Date.now() + 15 * 60 * 1000;

  return { accessToken, accessTokenExpiresAt };
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
