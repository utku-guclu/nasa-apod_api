// app/layout.tsx
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";
import { NextAuthProvider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="relative group">
            <Navbar />
          </div>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
