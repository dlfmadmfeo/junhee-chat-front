import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const userStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // localStorage key
      // optional: 필요한 경우 serialize/deserialize 커스터마이징도 가능
    }
  )
);
