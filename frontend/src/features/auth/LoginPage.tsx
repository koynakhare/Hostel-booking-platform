import { useForm } from "react-hook-form";
import { createResolver } from "@/utils/form";
import { z } from "zod";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useLoginMutation } from "@/api/authApi";
import { useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated, selectRole } from "@/features/auth/authSlice";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import Card from "@/components/ui/Card";
import { OWNER_ROUTES, ROLES, STUDENT_ROUTES } from "@/utils/constants";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { control, handleSubmit } = useForm<FormData>({
    resolver: createResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  if (isAuthenticated) {
    if (redirect) return <Navigate to={redirect} replace />;
    return (
      <Navigate
        to={role === ROLES.OWNER ? OWNER_ROUTES.dashboard : STUDENT_ROUTES.browse}
        replace
      />
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data).unwrap();
      const dest =
        redirect ??
        (result.role === ROLES.OWNER
          ? OWNER_ROUTES.dashboard
          : STUDENT_ROUTES.browse);
      navigate(dest, { replace: true });
    } catch {
      /* handled by baseApi */
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sidebar-bg">
            <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="mt-1 text-sm text-text-muted">Sign in to your hostel booking account</p>
        </div>

        <Card accentTop>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextField name="email" control={control} label="Email" type="email" required placeholder="you@example.com" />
            <TextField name="password" control={control} label="Password" type="password" required placeholder="••••••••" />
            <Button type="submit" loading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-muted">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-accent hover:underline">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
