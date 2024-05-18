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
        <nav className="flex items-center justify-between p-4 absolute w-full z-10 bg-nasaSky hover:bg-nasaSkyHover">
          <Link href="/" className="text-white text-xl font-bold">
            HOME
          </Link>
          <div className="flex justify-between">
            <Link
              href="/nasa/apod"
              className="mr-4 text-white text-xl font-bold"
            >
              POD
            </Link>
            <Link
              href="/nasa/apod/slide"
              className="text-white text-xl font-bold"
            >
              SLIDE
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
