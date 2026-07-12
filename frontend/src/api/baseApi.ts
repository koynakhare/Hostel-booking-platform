import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { logout } from "@/features/auth/authSlice";
import { showToast } from "@/features/toast/toastSlice";
import { extractErrorMessage } from "@/utils/apiErrorHandler";
import { API_BASE_URL } from "@/utils/constants";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const message = extractErrorMessage(result.error);

    if (status === 401) {
      api.dispatch(logout());
      api.dispatch(showToast({ message: "Session expired. Please login again.", type: "error" }));
    } else {
      api.dispatch(showToast({ message, type: "error" }));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Auth", "Hostel", "Room", "Booking"],
  endpoints: () => ({}),
});
