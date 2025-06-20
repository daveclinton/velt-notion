export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

let currentUser: User | null = null;

export async function signIn(email: string, password: string): Promise<User> {
  if (!email || !password) {
    throw new Error("Invalid credentials");
  }
  const user: User = {
    id: `user_${Math.random().toString(36).slice(2)}`,
    name: email.split("@")[0],
    email,
    imageUrl: `https://ui-avatars.com/api/?name=${email}`,
  };
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
}

export async function signOut(): Promise<void> {
  currentUser = null;
  localStorage.removeItem("currentUser");
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  }
  return currentUser;
}
