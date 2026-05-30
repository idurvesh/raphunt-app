import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "RapHunt — Indian Hip-Hop Launch Platform",
  description: "Discover and support the best new Indian hip-hop drops",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#E63946",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-0 md:pt-16 pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
