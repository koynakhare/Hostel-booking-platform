import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createResolver } from "@/utils/form";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/api/authApi";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";

const schema = z
  .object({
    fullName: z.string().min(2, "Name is required"),
    phoneNumber: z.string().min(10, "Enter a valid phone number"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasNewPassword = !!data.newPassword?.trim();
    if (hasNewPassword) {
      if (!data.currentPassword?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["currentPassword"],
          message: "Current password is required",
        });
      }
      if ((data.newPassword?.length ?? 0) < 6) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: "New password must be at least 6 characters",
        });
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    }
  });

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const authUser = useAppSelector(selectUser);
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: createResolver(schema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        currentPassword: data.newPassword ? data.currentPassword : undefined,
        newPassword: data.newPassword || undefined,
      }).unwrap();
      reset({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch { /* handled */ }
  };

  if (isLoading) return <Loader label="Loading profile..." />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <Card className="max-w-xl">
      <h2 className="mb-1 text-lg font-bold text-text-primary">My Profile</h2>
      <p className="mb-6 text-sm text-text-muted">
        Update your account details. Email and role cannot be changed.
      </p>

      <div className="mb-6 space-y-1 rounded-lg bg-bg-page px-4 py-3 text-sm">
        <p className="text-text-muted">
          <span className="font-medium text-text-primary">Email:</span> {authUser?.email}
        </p>
        <p className="text-text-muted">
          <span className="font-medium text-text-primary">Role:</span> {authUser?.role}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField name="fullName" control={control} label="Full Name" required />
        <TextField name="phoneNumber" control={control} label="Phone Number" required />

        <div className="border-t border-border-subtle pt-4">
          <p className="mb-3 text-sm font-medium text-text-primary">Change Password (optional)</p>
          <div className="space-y-4">
            <TextField
              name="currentPassword"
              control={control}
              label="Current Password"
              type="password"
            />
            <TextField
              name="newPassword"
              control={control}
              label="New Password"
              type="password"
            />
            <TextField
              name="confirmPassword"
              control={control}
              label="Confirm New Password"
              type="password"
            />
          </div>
        </div>

        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </form>
      </Card>
    </div>
  );
}
