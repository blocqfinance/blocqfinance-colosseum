"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Sidebar from "@/layout/sidebar/Sidebar";
import { usePathname } from "next/navigation";



export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body
      >
        <div className="main">
          <div className={"seller"}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
