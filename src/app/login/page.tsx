"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/shared/api/auth";
import { ApiError } from "@/shared/api/client";
import { useAuth } from "@/features/auth/model/useAuth";
import { toast } from "sonner";
import { saveAuthSession } from "@/shared/lib/auth-storage";
import type { LoginPayload } from "@/shared/api/auth";

const defaultValues: LoginPayload = {
  username: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginPayload>({ defaultValues });

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      try {
        const auth = await login(values);
        const sessionUser = saveAuthSession({
          accountId: auth.accountId,
          username: auth.username,
          token: auth.token,
        });
        setUser(sessionUser);
        toast.success("Welcome back!");
        router.push("/");
      } catch (err) {
        const apiError = err as ApiError;
        toast.error(apiError.message);
      }
    });
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-stone-50 to-white px-4 py-12">
      <Card className="w-full max-w-md border-stone-200">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to leave and manage your reviews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="pubfan123"
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
              />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message as string}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-stone-500">
            Need an account?{" "}
            <Link
              href="/signup"
              className="text-orange-600 underline hover:text-orange-700"
            >
              Create one
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
