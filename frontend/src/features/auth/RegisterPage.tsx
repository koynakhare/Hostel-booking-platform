import { useForm } from "react-hook-form";
import { createResolver } from "@/utils/form";
import { z } from "zod";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/api/authApi";
import { useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated, selectRole } from "@/features/auth/authSlice";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import { OWNER_ROUTES, ROLES, STUDENT_ROUTES } from "@/utils/constants";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  role: z.enum([ROLES.OWNER, ROLES.STUDENT], { message: "Select a role" }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [register, { isLoading }] = useRegisterMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: createResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: ROLES.STUDENT,
    },
  });

  if (isAuthenticated) {
    return (
      <Navigate
        to={role === ROLES.OWNER ? OWNER_ROUTES.dashboard : STUDENT_ROUTES.browse}
        replace
      />
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      const result = await register(data).unwrap();
      navigate(
        result.role === ROLES.OWNER
          ? OWNER_ROUTES.dashboard
          : STUDENT_ROUTES.browse,
        { replace: true },
      );
    } catch {
      /* handled by baseApi */
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
          <p className="mt-1 text-sm text-text-muted">Join as a hostel owner or student</p>
        </div>

        <Card accentTop>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextField name="fullName" control={control} label="Full Name" required />
            <TextField name="email" control={control} label="Email" type="email" required />
            <TextField name="phoneNumber" control={control} label="Phone Number" required />
            <TextField name="password" control={control} label="Password" type="password" required />
            <Select
              name="role"
              control={control}
              label="I am a"
              required
              options={[
                { value: ROLES.STUDENT, label: "Student — browse & book hostels" },
                { value: ROLES.OWNER, label: "Hostel Owner — manage hostels & rooms" },
              ]}
            />
            <Button type="submit" loading={isLoading} className="w-full">
              Create Account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
