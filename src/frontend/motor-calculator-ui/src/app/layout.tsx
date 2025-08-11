import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motor Calculator",
  description: "Calculadora de Motores Trifásicos - Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
