import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time-Zone Comparison",
  description: "Modern time-zone comparison with global timeline and draggable marker."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
