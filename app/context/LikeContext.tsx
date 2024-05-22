"use client";
// context/LikeContext.tsx

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  image: string;
};

type LikeContextType = {
  likes: number;
  liked: boolean;
  users: User[];
  showUsers: boolean;
  updateLikes: (imageDate: string) => void;
  toggleLike: (imageDate: string) => void;
  setShowUsers: (show: boolean) => void;
};

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const useLikeContext = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error("useLikeContext must be used within a LikeContextProvider");
  }
  return context;
};

type Props = {
  children: React.ReactNode;
  initialLikes: number;
  initialLiked: boolean;
  initialShowUsers: boolean;
  initialUsers: User[];
};

export const LikeContextProvider = ({
  children,
  initialLikes,
  initialLiked,
  initialUsers,
  initialShowUsers,
}: Props) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showUsers, setShowUsers] = useState<boolean>(initialShowUsers);
  const { data: session } = useSession();

  useEffect(() => {
    setLikes(initialLikes);
    setLiked(initialLiked);
    setUsers(initialUsers);
    setShowUsers(initialShowUsers);
  }, [initialLikes, initialLiked, initialUsers, initialShowUsers]);

  const updateLikes = async (imageDate: string) => {
    try {
      const res = await fetch(`/api/likes/${imageDate}`);
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setUsers(data.users || []);
      } else {
        throw new Error("Failed to fetch likes");
      }
    } catch (error) {
      console.error("Failed to fetch likes", error);
    }
  };

  const toggleLike = async (imageDate: string) => {
    if (!session) {
      return;
    }

    try {
      const res = await fetch(`/api/likes/${imageDate}`, {
        method: liked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // No need to send userId here
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setLiked(!liked);
        setUsers(data.users || []);
      } else {
        throw new Error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <LikeContext.Provider
      value={{
        likes,
        liked,
        users,
        showUsers,
        updateLikes,
        toggleLike,
        setShowUsers,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};
