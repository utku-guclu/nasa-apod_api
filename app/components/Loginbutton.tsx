"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

const LoginButton = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div className="text-white text-xl font-bold">
      {session ? (
        <div className="flex items-center space-x-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              width={40}
              height={40}
              className="rounded-full"
              alt={session.user.name || "User Image"}
            />
          )}
          <button
            onClick={() => signOut()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("github")}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Sign in with GitHub
        </button>
      )}
    </div>
  );
};

export default LoginButton;
