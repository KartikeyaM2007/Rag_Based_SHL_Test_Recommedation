import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServerStatusProvider from "@/components/ServerStatusProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHL Assessment Finder - AI-Powered Recommendations",
  description: "Find the perfect SHL assessment using AI-powered search and recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-white relative`}
        suppressHydrationWarning
      >
        {/* Blue Flame Background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-600/30 rounded-full animate-blue-flame mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[40%] w-[40%] h-[50%] bg-cyan-500/20 rounded-full animate-blue-flame animation-delay-2000 mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[10%] w-[80%] h-[70%] bg-blue-900/40 rounded-full animate-blue-flame animation-delay-4000 mix-blend-screen pointer-events-none" />
        </div>

        <div className="relative z-10">
          <ServerStatusProvider>
            {children}
          </ServerStatusProvider>
        </div>
      </body>
    </html>
  );
}
