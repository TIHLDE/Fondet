import "../styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "@/components/navigation/TopBar";
import Footer from "@/components/navigation/Footer";
import BottomBar from "@/components/navigation/BottomBar";
import ThemeScript from "@/components/providers/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIHLDE Fondet",
  description:
    "TIHLDE-fondet - Forvaltningsgruppen for TIHLDEs investeringsfond",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full">
      <head>
        <ThemeScript />
      </head>
      <body className={`antialiased ${inter.variable} w-full`}>
        <Providers>
          <div className="relative flex min-h-dvh w-full flex-col items-center">
            <Navbar />
            <main className="w-full flex flex-col items-center">
              {children}
            </main>
            <BottomBar />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
