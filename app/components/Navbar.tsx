// components/Navbar.js
"use client";

import Link from "next/link";
import LoginButton from "./Loginbutton";

export default function Navbar() {
  return (
    <nav className="opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 flex items-center justify-between p-4 absolute w-full z-10 bg-nasaSky hover:bg-nasaSkyHover">
      <Link href="/" className="text-white text-xl font-bold">
        HOME
      </Link>
      <div className="flex items-center">
        <Link href="/nasa/apod" className="mr-4 text-white text-xl font-bold">
          POD
        </Link>
        <Link
          href="/nasa/apod/slide"
          className="mr-4 text-white text-xl font-bold"
        >
          SLIDE
        </Link>
        <LoginButton />
      </div>
    </nav>
  );
}
