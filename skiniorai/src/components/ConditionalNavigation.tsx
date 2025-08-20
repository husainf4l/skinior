"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface ConditionalNavigationProps {
  children: ReactNode;
}

export default function ConditionalNavigation({
  children,
}: ConditionalNavigationProps) {
  const pathname = usePathname();

  // Hide navbar and footer for dashboard pages
  const isDashboard = pathname.includes("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {!isDashboard && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  );
}
