import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konekteo — Prospection Commerciale Autonome",
  description: "Solution concrète, épurée et ultra-simple d'acquisition B2B sans usine à gaz technique.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-[#0a0a0a] text-gray-100 antialiased selection:bg-[#e9ff3b] selection:text-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}
