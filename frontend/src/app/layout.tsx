import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./header";
import ScrollBackground from "./components/scroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KOCA-REİS Menü",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-gradient-to-t from-sky-500 via-white to-white h-screen">
          <header className="max-w-[1240px] mx-auto">
            <Header />
          </header>
          <ScrollBackground />
          <main className="max-w-[1240px] mx-auto ">{children}</main>
        </div>
      </body>
    </html>
  );
}
