import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, IBM_Plex_Serif } from "next/font/google";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "ICE Procurement — A public accountability project",
  description:
    "A searchable record of every procurement action awarded by U.S. Immigration and Customs Enforcement from June 2025 to June 2026, sourced from USASpending.gov.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full bg-background antialiased",
        plexSans.variable,
        plexMono.variable,
        plexSerif.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NuqsAdapter>
          <Suspense fallback={null}>
            <SiteNav />
          </Suspense>
          <div className="flex-1 w-full">{children}</div>
          <SiteFooter />
        </NuqsAdapter>
      </body>
    </html>
  );
}
