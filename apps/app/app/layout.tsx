import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Netlium Dashboard | Institutional Capital Operations",
  description: "Institutional capital operations dashboard"
};

export default function RootLayout({
  children
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
