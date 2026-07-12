import { baseApi } from "@/api/baseApi";
import { setCredentials, updateUser } from "@/features/auth/authSlice";
import { showToast } from "@/features/toast/toastSlice";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from "@/types/user";
import type { Role } from "@/utils/constants";

function toUser(response: AuthResponse): User {
  return {
    id: response.id,
    fullName: response.fullName,
    email: response.email,
    role: response.role as Role,
  };
}

function toUserFromProfile(response: User): User {
  return {
    id: response.id,
    fullName: response.fullName,
    email: response.email,
    phoneNumber: response.phoneNumber,
    role: response.role,
    createdAt: response.createdAt,
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ token: data.token, user: toUser(data) }),
          );
          dispatch(showToast({ message: "Welcome back!", type: "success" }));
        } catch {
          /* handled by baseQuery */
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ token: data.token, user: toUser(data) }),
          );
          dispatch(showToast({ message: "Account created successfully!", type: "success" }));
        } catch {
          /* handled by baseQuery */
        }
      },
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(toUserFromProfile(data)));
          dispatch(showToast({ message: "Profile updated successfully!", type: "success" }));
        } catch { /* handled */ }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
