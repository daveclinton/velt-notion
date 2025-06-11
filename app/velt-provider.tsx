"use client";
import React, { ReactNode } from "react";
import {
  VeltProvider,
  VeltComments,
  VeltCommentsSidebar,
} from "@veltdev/react";

export function VeltWrapper({ children }: { children: ReactNode }) {
  return (
    <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_KEY || ""}>
      <VeltComments textMode={false} darkMode={true} />
      <VeltCommentsSidebar />
      {children}
    </VeltProvider>
  );
}
