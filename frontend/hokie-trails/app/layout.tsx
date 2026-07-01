import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { NavBar } from "@/components/menu-bar";

export const metadata: Metadata = {
  title: "HokieTrails - Hike Virginia",
  description:
    "Discover hiking trails across Virginia with difficulty ratings, routes, and lodging alongside the trails.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-shell">
            <NavBar />
            <main className="content">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
