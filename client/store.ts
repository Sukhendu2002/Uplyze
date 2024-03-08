import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem("token"),
  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
  logout: () => set({ isLoggedIn: false }),
}));

export default useAuthStore;
