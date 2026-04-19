import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nyssa Youth Spectacular",
  description: "Registration for the NYS youth conference.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
