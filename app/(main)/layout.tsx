"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "./_components/navigation";
import { Spinner } from "@/components/spinner";
import { SearchCommand } from "@/components/search-command";
import { useAuthStore } from "@/lib/auth-store";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
