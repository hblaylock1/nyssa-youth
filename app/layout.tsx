import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nyssa Youth Spectacular",
  description:
    "Register your youth for the Nyssa Youth Spectacular — Saturday, June 6, 2026.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Nyssa Youth Spectacular",
    description:
      "Register your youth for the Nyssa Youth Spectacular — Saturday, June 6, 2026.",
    url: "/",
    siteName: "Nyssa Youth Spectacular",
    images: [
      {
        url: "/logo.png",
        alt: "Walk With Him — Nyssa Youth Spectacular",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nyssa Youth Spectacular",
    description:
      "Register your youth for the Nyssa Youth Spectacular — Saturday, June 6, 2026.",
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
