import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-providers";
import { VeltWrapper } from "./velt-provider";
import { EdgeStoreProvider } from "@/lib/edgeStore";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "All-in-one workspace for you and your team.",
  icons: {
    icon: [
      {
        media: "(prefers-color-schema: light)",
        url: "/notion.svg",
        href: "/notion.svg",
      },
      {
        media: "(prefers-color-schema: dark)",
        url: "/notion.svg",
        href: "/notion.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <EdgeStoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="notion-theme-2"
          >
            <VeltWrapper>
              <Toaster position="top-center" />
              <ModalProvider />
              {children}
            </VeltWrapper>
          </ThemeProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
