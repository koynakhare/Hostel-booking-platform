import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createResolver, zNum } from "@/utils/form";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateHostelMutation,
  useGetHostelQuery,
  useUpdateHostelMutation,
} from "@/api/hostelApi";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import FileUpload from "@/components/ui/FileUpload";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import { OWNER_ROUTES } from "@/utils/constants";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().min(6, "Pin code is required"),
  totalRooms: zNum(1, "At least 1 room"),
  amenities: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function HostelFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);

  const { data: hostel, isLoading: loadingHostel } = useGetHostelQuery(Number(id), { skip: !isEdit });
  const [createHostel, { isLoading: creating }] = useCreateHostelMutation();
  const [updateHostel, { isLoading: updating }] = useUpdateHostelMutation();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: createResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      totalRooms: 1,
      amenities: "",
    },
  });

  useEffect(() => {
    if (hostel) {
      reset({
        name: hostel.name,
        description: hostel.description,
        address: hostel.address,
        city: hostel.city,
        state: hostel.state,
        pinCode: hostel.pinCode,
        totalRooms: hostel.totalRooms,
        amenities: hostel.amenities ?? "",
      });
    }
  }, [hostel, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updateHostel({ id: Number(id), data, images: images.length ? images : undefined }).unwrap();
      } else {
        await createHostel({ data, images }).unwrap();
      }
      navigate(OWNER_ROUTES.hostels);
    } catch { /* handled */ }
  };

  if (isEdit && loadingHostel) return <Loader label="Loading hostel..." />;

  return (
    <Card className="max-w-2xl">
      <h2 className="mb-6 text-lg font-bold text-text-primary">
        {isEdit ? "Edit Hostel" : "Add New Hostel"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField name="name" control={control} label="Hostel Name" required />
        <TextField name="description" control={control} label="Description" required />
        <TextField name="address" control={control} label="Address" required />
        <div className="grid grid-cols-2 gap-4">
          <TextField name="city" control={control} label="City" required />
          <TextField name="state" control={control} label="State" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextField name="pinCode" control={control} label="Pin Code" required />
          <TextField name="totalRooms" control={control} label="Total Rooms" type="number" required />
        </div>
        <TextField name="amenities" control={control} label="Amenities" helperText="Comma-separated, e.g. WiFi, Laundry, Mess" />
        <FileUpload files={images} onChange={setImages} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={creating || updating}>
            {isEdit ? "Update Hostel" : "Create Hostel"}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate(OWNER_ROUTES.hostels)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
