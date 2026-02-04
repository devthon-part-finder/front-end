// Mock API implementation for authentication.
// Replace these with real API calls when backend is ready.

export type AuthUser = {
  id: string;
  username: string;
  email: string;
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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginApi(input: AuthLoginInput): Promise<AuthUser> {
  await wait(600);

  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase(),
  );
  if (!user || user.password !== input.password) {
    throw new Error("Invalid email or password.");
  }

  return { id: user.id, username: user.username, email: user.email };
}

export async function signupApi(input: AuthSignupInput): Promise<AuthUser> {
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

  return { id: newUser.id, username: newUser.username, email: newUser.email };
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
