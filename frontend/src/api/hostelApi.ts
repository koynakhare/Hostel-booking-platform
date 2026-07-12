import { baseApi } from "@/api/baseApi";
import { showToast } from "@/features/toast/toastSlice";
import type { Hostel, HostelFormData, PagedResponse } from "@/types/hostel";

interface HostelListParams {
  page?: number;
  limit?: number;
  city?: string;
  search?: string;
}

export const hostelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHostels: builder.query<PagedResponse<Hostel>, HostelListParams | void>({
      query: (params) => ({
        url: "/hostels",
        params: params ?? {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: "Hostel" as const, id })),
              { type: "Hostel", id: "LIST" },
            ]
          : [{ type: "Hostel", id: "LIST" }],
    }),
    getHostel: builder.query<Hostel, number>({
      query: (id) => `/hostels/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Hostel", id }],
    }),
    createHostel: builder.mutation<Hostel, { data: HostelFormData; images?: File[] }>({
      query: ({ data, images }) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        images?.forEach((file) => formData.append("images", file));
        return { url: "/hostels", method: "POST", body: formData };
      },
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Hostel created successfully!", type: "success" }));
        } catch { /* handled */ }
      },
    }),
    updateHostel: builder.mutation<
      Hostel,
      { id: number; data: HostelFormData; images?: File[]; existingImages?: string[] }
    >({
      query: ({ id, data, images, existingImages }) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        if (existingImages) {
          formData.append("syncImages", "true");
          existingImages.forEach((url) => formData.append("existingImages", url));
        }
        images?.forEach((file) => formData.append("images", file));
        return { url: `/hostels/${id}`, method: "PUT", body: formData };
      },
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Hostel", id },
        { type: "Hostel", id: "LIST" },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Hostel updated successfully!", type: "success" }));
        } catch { /* handled */ }
      },
    }),
    deleteHostel: builder.mutation<void, number>({
      query: (id) => ({ url: `/hostels/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Hostel deleted.", type: "success" }));
        } catch { /* handled */ }
      },
    }),
  }),
});

export const {
  useGetHostelsQuery,
  useGetHostelQuery,
  useCreateHostelMutation,
  useUpdateHostelMutation,
  useDeleteHostelMutation,
} = hostelApi;
