import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motor Calculator - Three-Phase Motor Analysis Tool",
  description: "Advanced electromagnetic analysis and design tool for three-phase induction motors with harmonic analysis and safety validation.",
  keywords: ["motor calculator", "three-phase motor", "electromagnetic analysis", "harmonic analysis", "motor design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
