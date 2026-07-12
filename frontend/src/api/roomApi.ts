import { baseApi } from "@/api/baseApi";
import { showToast } from "@/features/toast/toastSlice";
import type {
  CreateRoomRequest,
  Room,
  RoomSheetResponse,
} from "@/types/room";

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], number>({
      query: (hostelId) => ({
        url: "/rooms",
        params: { hostelId },
      }),
      providesTags: (_r, _e, hostelId) => [
        { type: "Room", id: `hostel-${hostelId}` },
      ],
    }),
    getRoomSheet: builder.query<
      RoomSheetResponse,
      { hostelId: number; checkIn: string; checkOut: string }
    >({
      query: ({ hostelId, checkIn, checkOut }) => ({
        url: "/rooms/sheet",
        params: { hostelId, checkIn, checkOut },
      }),
      providesTags: (_r, _e, { hostelId }) => [
        { type: "Room", id: `sheet-${hostelId}` },
      ],
      keepUnusedDataFor: 0,
    }),
    createRoom: builder.mutation<Room, CreateRoomRequest>({
      query: (body) => ({ url: "/rooms", method: "POST", body }),
      invalidatesTags: (_r, _e, { hostelId }) => [
        { type: "Room", id: `hostel-${hostelId}` },
        { type: "Room", id: `sheet-${hostelId}` },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Room added successfully!", type: "success" }));
        } catch { /* handled */ }
      },
    }),
    updateRoom: builder.mutation<Room, { roomId: number; data: CreateRoomRequest }>({
      query: ({ roomId, data }) => ({
        url: `/rooms/${roomId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { data }) => [
        { type: "Room", id: `hostel-${data.hostelId}` },
        { type: "Room", id: `sheet-${data.hostelId}` },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Room updated!", type: "success" }));
        } catch { /* handled */ }
      },
    }),
    deleteRoom: builder.mutation<void, { roomId: number; hostelId: number }>({
      query: ({ roomId, hostelId }) => ({
        url: `/rooms/${roomId}`,
        method: "DELETE",
        params: { hostelId },
      }),
      invalidatesTags: (_r, _e, { hostelId }) => [
        { type: "Room", id: `hostel-${hostelId}` },
        { type: "Room", id: `sheet-${hostelId}` },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Room deleted.", type: "success" }));
        } catch { /* handled */ }
      },
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomSheetQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
