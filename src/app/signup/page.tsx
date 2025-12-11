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
import { signup } from "@/shared/api/auth";
import { ApiError } from "@/shared/api/client";
import { useAuth } from "@/features/auth/model/useAuth";
import { toast } from "sonner";
import { saveAuthSession } from "@/shared/lib/auth-storage";
import type { SignupPayload } from "@/shared/api/auth";

const defaultValues: SignupPayload = {
  username: "",
  password: "",
  name: "",
  surname: "",
  email: "",
};

export default function SignupPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupPayload>({ defaultValues });

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      try {
        const auth = await signup(values);
        const sessionUser = saveAuthSession({
          accountId: auth.accountId,
          username: auth.username,
          token: auth.token,
        });
        setUser(sessionUser);
        toast.success("Account created! Welcome to PubFinder.");
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
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join PubFinder to review and bookmark your favourite spots.
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
                  maxLength: { value: 50, message: "Max 50 characters" },
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
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">First name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Alex"
                {...register("name", {
                  required: "Name is required",
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
              />
              {errors.name && (
                <p className="text-xs text-red-500">
                  {errors.name.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                type="text"
                placeholder="Morgan"
                {...register("surname", {
                  required: "Surname is required",
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
              />
              {errors.surname && (
                <p className="text-xs text-red-500">
                  {errors.surname.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /.+@.+\..+/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-600 underline hover:text-orange-700"
            >
              Login
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
