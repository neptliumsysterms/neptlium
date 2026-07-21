import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neptlium — The Operating System for Institutional Digital Capital",
  description:
    "Neptlium is institutional-grade infrastructure for digital capital — treasury coordination, capital allocation, portfolio intelligence, and risk monitoring in one execution layer.",
  metadataBase: new URL("https://neptlium.com"),
  openGraph: {
    type: "website",
    url: "https://neptlium.com",
    title: "Neptlium — Institutional Digital Capital Infrastructure",
    description:
      "The operating system for institutional digital capital: treasury, allocation, portfolio intelligence, and risk — unified.",
    images: [{ url: "/og-marketing.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neptlium — Institutional Digital Capital Infrastructure",
    description:
      "The operating system for institutional digital capital: treasury, allocation, portfolio intelligence, and risk — unified.",
    images: ["/og-marketing.png"],
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="canonical" href="https://neptlium.com/" />
      </head>
      <body>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
