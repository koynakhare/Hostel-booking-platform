import { baseApi } from "@/api/baseApi";
import { setCredentials } from "@/features/auth/authSlice";
import { showToast } from "@/features/toast/toastSlice";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} = authApi;
