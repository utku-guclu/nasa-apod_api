// components/LoginButton.tsx
"client";
// components/LoginButton.tsx

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";

const LoginButton = (): ReactElement => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading" && !session) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status, session]);

  const handleSignIn = () => {
    signIn("github");
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="text-white text-xl font-bold">
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : session ? (
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
            onClick={handleSignOut}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          disabled={status === "loading"}
        >
          Sign in with GitHub
        </button>
      )}
    </div>
  );
};

export default LoginButton;
