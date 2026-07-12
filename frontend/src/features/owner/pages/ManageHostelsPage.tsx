import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetHostelsQuery, useDeleteHostelMutation } from "@/api/hostelApi";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";
import Table, { type Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Hostel } from "@/types/hostel";
import { OWNER_ROUTES } from "@/utils/constants";

export default function ManageHostelsPage() {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const { data, isLoading } = useGetHostelsQuery({});
  const [deleteHostel, { isLoading: deleting }] = useDeleteHostelMutation();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const myHostels = useMemo(
    () => data?.content.filter((h) => h.ownerId === user?.id) ?? [],
    [data, user?.id],
  );

  const columns: Column<Hostel>[] = [
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "totalRooms", label: "Rooms" },
    {
      key: "active",
      label: "Status",
      render: (row) => (
        <Badge label={row.active ? "Active" : "Inactive"} variant={row.active ? "success" : "neutral"} />
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/owner/hostels/${row.id}/rooms`); }}>
            Rooms
          </Button>
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/owner/hostels/${row.id}/edit`); }}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteHostel(deleteId).unwrap();
      setDeleteId(null);
    } catch { /* handled */ }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="cursor-pointer" onClick={() => navigate(OWNER_ROUTES.hostelNew)}>+ Add Hostel</Button>
      </div>
      <Table columns={columns} data={myHostels} loading={isLoading} emptyMessage="No hostels yet. Create your first hostel!" />
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Hostel"
        message="Are you sure you want to delete this hostel? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
