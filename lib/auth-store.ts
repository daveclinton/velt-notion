import { create } from "zustand";
import { User, signIn, signOut, getCurrentUser } from "./auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const user = await signIn(email, password);
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  initialize: () => {
    if (!get().isInitialized) {
      const user = getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isInitialized: true,
      });
    }
  },
}));

// Auto-initialize when the store is created (client-side only)
if (typeof window !== "undefined") {
  useAuthStore.getState().initialize();
}
