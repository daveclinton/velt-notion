// lib/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

let mockUser: User | null = null;

export function signIn(email: string, password: string): Promise<User | null> {
  // Simulate a successful login for demo purposes
  if (email && password) {
    mockUser = {
      id: "user_123",
      name: "Demo User",
      email,
      image: "/logo.svg",
    };
    return Promise.resolve(mockUser);
  }
  return Promise.resolve(null);
}

export function signOut(): Promise<void> {
  mockUser = null;
  return Promise.resolve();
}

export function getCurrentUser(): User | null {
  return mockUser;
}

export function isAuthenticated(): boolean {
  return !!mockUser;
}
