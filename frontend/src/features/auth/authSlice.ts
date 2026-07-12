import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  ROLES,
  type Role,
} from "@/utils/constants";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

function loadToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function loadUser(): User | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  token: loadToken(),
  user: loadUser(),
  isAuthenticated: !!loadToken() && !!loadUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectRole = (state: { auth: AuthState }): Role | null =>
  state.auth.user?.role ?? null;
export const selectIsOwner = (state: { auth: AuthState }) =>
  state.auth.user?.role === ROLES.OWNER;
export const selectIsStudent = (state: { auth: AuthState }) =>
  state.auth.user?.role === ROLES.STUDENT;

export default authSlice.reducer;
