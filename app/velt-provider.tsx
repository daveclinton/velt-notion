"use client";
import React, { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useIdentify } from "@veltdev/react";
import {
  VeltProvider,
  VeltComments,
  VeltCommentsSidebar,
} from "@veltdev/react";

export function VeltWrapper({ children }: { children: ReactNode }) {
  return (
    <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_KEY || ""}>
      <VeltAuthHandler />
      <VeltComments textMode={false} darkMode={true} />
      <VeltCommentsSidebar />
      {children}
    </VeltProvider>
  );
}

function VeltAuthHandler() {
  const { user, isLoaded } = useUser();

  // Always prepare a user object - use real data when available, dummy data when not
  const veltUser =
    isLoaded && user
      ? {
          userId: user.id,
          organizationId:
            user.organizationMemberships?.[0]?.organization?.id ||
            "default-org",
          name: user.fullName || user.firstName || "Anonymous User",
          email: user.primaryEmailAddress?.emailAddress || "",
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

  // Always call useIdentify - no conditional calls
  useIdentify(veltUser);

  return null;
}

// Helper function to generate consistent colors for users
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
