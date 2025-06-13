"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useIdentify } from "@veltdev/react";
import {
  VeltProvider,
  VeltComments,
  VeltCommentsSidebar,
} from "@veltdev/react";
import { useTheme } from "next-themes";

export function VeltWrapper({ children }: { children: ReactNode }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>{children}</div>;
  }

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  return (
    <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_KEY || ""}>
      <VeltAuthHandler />
      <VeltComments shadowDom={false} textMode={false} darkMode={isDark} />
      <VeltCommentsSidebar darkMode={isDark} />
      {children}
    </VeltProvider>
  );
}

function VeltAuthHandler() {
  const { user, isLoading } = useAuthStore();

  const veltUser =
    !isLoading && user
      ? {
          userId: user.id,
          organizationId: "default-org",
          name: user.name || "Anonymous User",
          email: user.email || "",
          photoUrl: user.imageUrl || "",
          color: generateColorFromUserId(user.id),
        }
      : {
          userId: "temp-user",
          organizationId: "temp-org",
          name: "Loading...",
          email: "",
          photoUrl: "",
          color: "#808080",
        };

  useIdentify(veltUser);

  return null;
}

function generateColorFromUserId(userId: string): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
