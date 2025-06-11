"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

const Navbar = () => {
  const scrolled = useScrollTop();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, initialize } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {!isAuthenticated && (
          <>
            <Button
              size="sm"
              onClick={() => router.push("/sign-in")}
              disabled={isLoading}
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/sign-up")}
              disabled={isLoading}
            >
              Get Notion free
            </Button>
          </>
        )}
        {isAuthenticated && (
          <>
            <Button variant="ghost" size="sm" asChild disabled={isLoading}>
              <Link href="/documents">Enter Notion</Link>
            </Button>
            <Button
              size="sm"
              onClick={handleSignOut}
              disabled={isLoading}
              variant="outline"
            >
              {user?.name || "User"}
              <span className="ml-2">Sign Out</span>
            </Button>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
