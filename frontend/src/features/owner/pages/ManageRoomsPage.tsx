import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createResolver, zNum } from "@/utils/form";
import { useParams } from "react-router-dom";
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "@/api/roomApi";
import { useGetHostelQuery } from "@/api/hostelApi";
import Table, { type Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TextField from "@/components/ui/TextField";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Loader from "@/components/ui/Loader";
import { formatCurrency } from "@/utils/formatters";
import { ROOM_TYPES } from "@/utils/constants";
import type { Room } from "@/types/room";

const schema = z.object({
  roomNumber: z.string().min(1, "Required"),
  roomType: z.enum(ROOM_TYPES),
  pricePerMonth: zNum(1),
  capacity: zNum(1),
  floorNumber: zNum(0),
  rowPosition: zNum(1),
  colPosition: zNum(1),
  hasWindow: z.boolean(),
  hasBalcony: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function getNextGridPosition(rooms: Room[]) {
  if (rooms.length === 0) {
    return { floorNumber: 0, rowPosition: 1, colPosition: 1 };
  }

  const sorted = [...rooms].sort((a, b) => {
    if (a.floorNumber !== b.floorNumber) return a.floorNumber - b.floorNumber;
    if (a.rowPosition !== b.rowPosition) return a.rowPosition - b.rowPosition;
    return a.colPosition - b.colPosition;
  });

  const last = sorted[sorted.length - 1];
  const cols = 4;
  let colPosition = last.colPosition + 1;
  let rowPosition = last.rowPosition;
  const floorNumber = last.floorNumber;

  if (colPosition > cols) {
    colPosition = 1;
    rowPosition += 1;
  }

  return { floorNumber, rowPosition, colPosition };
}

export default function ManageRoomsPage() {
  const { hostelId } = useParams<{ hostelId: string }>();
  const hId = Number(hostelId);
  const { data: hostel } = useGetHostelQuery(hId);
  const { data: rooms = [], isLoading } = useGetRoomsQuery(hId);
  const [createRoom, { isLoading: creating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: updating }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: deleting }] = useDeleteRoomMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: createResolver(schema),
    defaultValues: {
      roomNumber: "",
      roomType: "STANDARD",
      pricePerMonth: 5000,
      capacity: 2,
      floorNumber: 0,
      rowPosition: 1,
      colPosition: 1,
      hasWindow: false,
      hasBalcony: false,
    },
  });

  const openCreate = () => {
    setEditRoom(null);
    const nextPosition = getNextGridPosition(rooms);
    reset({
      roomNumber: "",
      roomType: "STANDARD",
      pricePerMonth: 5000,
      capacity: 2,
      floorNumber: nextPosition.floorNumber,
      rowPosition: nextPosition.rowPosition,
      colPosition: nextPosition.colPosition,
      hasWindow: false,
      hasBalcony: false,
    });
    setModalOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditRoom(room);
    reset({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      pricePerMonth: room.pricePerMonth,
      capacity: room.capacity,
      floorNumber: room.floorNumber,
      rowPosition: room.rowPosition,
      colPosition: room.colPosition,
      hasWindow: room.hasWindow,
      hasBalcony: room.hasBalcony,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, hostelId: hId };
    try {
      if (editRoom) {
        await updateRoom({ roomId: editRoom.id, data: payload }).unwrap();
      } else {
        await createRoom(payload).unwrap();
      }
      setModalOpen(false);
    } catch { /* handled */ }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRoom({ roomId: deleteId, hostelId: hId }).unwrap();
      setDeleteId(null);
    } catch { /* handled */ }
  };

  const columns: Column<Room>[] = [
    { key: "roomNumber", label: "Room #" },
    { key: "roomType", label: "Type" },
    { key: "floorNumber", label: "Floor" },
    { key: "capacity", label: "Seats" },
    {
      key: "pricePerMonth",
      label: "Rent/Seat",
      render: (r) => formatCurrency(r.pricePerMonth),
    },
    {
      key: "hasWindow",
      label: "Features",
      render: (r) => (
        <div className="flex gap-1">
          {r.hasWindow && <Badge label="Window" variant="info" />}
          {r.hasBalcony && <Badge label="Balcony" variant="info" />}
          {r.roomType === "AC" && <Badge label="AC" variant="info" />}
        </div>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <Loader label="Loading rooms..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          Rooms for <span className="font-semibold text-text-primary">{hostel?.name}</span>
        </p>
        <Button onClick={openCreate}>+ Add Room</Button>
      </div>
      <Table columns={columns} data={rooms} emptyMessage="No rooms yet. Add your first room." />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editRoom ? "Edit Room" : "Add Room"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={creating || updating} onClick={handleSubmit(onSubmit)}>
              {editRoom ? "Update" : "Add Room"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField name="roomNumber" control={control} label="Room Number" required />
            <Select
              name="roomType"
              control={control}
              label="Room Type"
              required
              options={ROOM_TYPES.map((t) => ({ value: t, label: t.replace("_", " ") }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField name="pricePerMonth" control={control} label="Rent/Month (₹)" type="number" required />
            <TextField name="capacity" control={control} label="Seat Count" type="number" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <TextField name="floorNumber" control={control} label="Floor" type="number" required />
            <TextField name="rowPosition" control={control} label="Row" type="number" required />
            <TextField name="colPosition" control={control} label="Col" type="number" required />
          </div>
          <div className="flex gap-6">
            <Checkbox name="hasWindow" control={control} label="Has Window" />
            <Checkbox name="hasBalcony" control={control} label="Has Balcony" />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Room"
        message="Are you sure you want to delete this room?"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
