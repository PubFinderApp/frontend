"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/model/useAuth";
import { logout } from "@/shared/api/auth";
import { toast } from "sonner";

export const Navbar = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout();
        setUser(null);
        toast.success("Signed out successfully.");
        router.push("/login");
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error ? error.message : "Failed to logout.";
        toast.error(message);
      }
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-stone-900">
          PubFinder
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
          <Link href="/" className="transition hover:text-orange-600">
            Pubs
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="text-sm text-stone-600 transition hover:text-orange-600"
              >
                My Account
              </Link>
              <span className="hidden text-xs text-stone-500 sm:inline">
                @{user.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isPending}
              >
                {isPending ? "Signing out..." : "Logout"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
