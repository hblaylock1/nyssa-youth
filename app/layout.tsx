import type { Metadata } from "next";
import "./globals.css";
import { EVENT } from "@/lib/event";

export const metadata: Metadata = {
  title: EVENT.title,
  description: EVENT.metaDescription,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: EVENT.title,
    description: EVENT.metaDescription,
    url: "/",
    siteName: EVENT.title,
    images: [
      {
        url: "/logo.png",
        alt: EVENT.title,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: EVENT.title,
    description: EVENT.metaDescription,
    images: ["/logo.png"],
  },
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
