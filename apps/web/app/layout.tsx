import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Netlium Systems",
  description: "Institutional Capital Operating System"
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
