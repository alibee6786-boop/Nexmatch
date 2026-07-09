import "./globals.css";
import React from "react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "NexMatch",
  description: "Production-ready dating platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
