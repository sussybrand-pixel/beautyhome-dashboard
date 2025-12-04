import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emmaville Dashboard",
  description: "Admin dashboard for Emmaville Academy",
  icons: {
    icon: "/favicon.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
