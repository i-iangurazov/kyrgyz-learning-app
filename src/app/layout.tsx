import type { Metadata, Viewport } from "next";

import { AppShell } from "@/components/app/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kyrgyz Path",
  description: "Mobile-first Kyrgyz learning MVP foundation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101714",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
