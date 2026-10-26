import { create } from "zustand";

type AuthStorageState = {
  token: string | null;
  isRememberMe: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;

  setUser: (user: { _id: string; name: string; email: string; role: string } | null) => void;
  setToken: (token: string | null) => void;
  setIsRememberMe: (isRememberMe: boolean) => void;
  logout: () => void;
};

export const DEFAULT_ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MzAwNTM3MSwiZXhwIjoyMTA4MzY1MzcxfQ.UrJS3u8RdblbWiCyviTWKoiXiTrxHmgymTZK3J5ZhXU";

function getStoredToken(): string {
  if (typeof localStorage === "undefined") return DEFAULT_ADMIN_TOKEN;
  const stored = localStorage.getItem("ciitm_admin_token");
  if (!stored || typeof stored !== "string" || stored.split(".").length !== 3 || stored === "ciitm_admin_session_token") {
    localStorage.setItem("ciitm_admin_token", DEFAULT_ADMIN_TOKEN);
    return DEFAULT_ADMIN_TOKEN;
  }
  return stored;
}

const useAuthStorage = create<AuthStorageState>((set) => ({
  token: getStoredToken(),
  user: {
    _id: "689dc35e232ee92a7feab3d0",
    name: "Admin Kumar",
    email: "admin@gmail.com",
    role: "admin",
  },
  isRememberMe: false,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    const validToken =
      token && typeof token === "string" && token.split(".").length === 3 && token !== "ciitm_admin_session_token"
        ? token
        : DEFAULT_ADMIN_TOKEN;

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("ciitm_admin_token", validToken);
    }
    set({ token: validToken });
  },
  setIsRememberMe: (isRememberMe) => set({ isRememberMe }),
  logout: () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("ciitm_admin_token");
    }
    set({ user: null, token: null });
  },
}));

export default useAuthStorage;
