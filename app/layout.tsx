import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="flex items-center justify-between p-4">
          <Link href="/" className="text-white text-xl font-bold">
            HOME
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
