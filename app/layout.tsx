import type { Metadata } from "next";
import "./globals.css";


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
      </body>
    </html>
  );
}
