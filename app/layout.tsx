import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import MobileWarning from "@/components/common/MobileWarning";

export const metadata: Metadata = {
  title: "LUA.PW | Modern URL Management",
  description: "Simple, fast, and secure URL shortening and QR code generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <MobileWarning />
        <Analytics />
      </body>
    </html>
  );
}
