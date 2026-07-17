import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rapporter",
  description:
    "Årsrapporter, kvartalsrapporter, strategi og vedtekter for TIHLDE Fondet.",
};

export default function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
