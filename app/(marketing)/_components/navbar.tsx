"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";

const Navbar = () => {
  const scrolled = useScrollTop();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout, initialize } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full px-4 py-3 sm:px-6 sm:py-4",
        scrolled && "border-b shadow-sm"
      )}
    >
      {/* Logo */}
      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:ml-auto items-center gap-x-2">
        {!isAuthenticated && (
          <>
            <Button
              size="sm"
              onClick={() => router.push("/sign-in")}
              disabled={isLoading}
              variant="ghost"
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
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden lg:inline">{user?.name || "User"}</span>
              <span className="lg:hidden">Sign Out</span>
            </Button>
          </>
        )}
        <ModeToggle />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden ml-auto flex items-center gap-2">
        <ModeToggle />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-auto"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <Logo />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-2 h-auto"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation Content */}
              <div className="flex-1 py-6">
                {!isAuthenticated && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        size="lg"
                        onClick={() => handleNavigation("/sign-in")}
                        disabled={isLoading}
                        variant="ghost"
                        className="w-full justify-start text-left h-12"
                      >
                        Login
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => handleNavigation("/sign-up")}
                        disabled={isLoading}
                        className="w-full h-12"
                      >
                        Get Notion free
                      </Button>
                    </div>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="lg"
                        asChild
                        disabled={isLoading}
                        className="w-full justify-start text-left h-12"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/documents">Enter Notion</Link>
                      </Button>
                    </div>

                    {/* Sign Out */}
                    <div className="pt-4 border-t">
                      <Button
                        size="lg"
                        onClick={handleSignOut}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full h-12"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  © 2024 Notion. All rights reserved.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
