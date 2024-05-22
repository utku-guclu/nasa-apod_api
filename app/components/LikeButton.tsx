// components/LikeButton.tsx
"use client";

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useLikeContext } from "../context/LikeContext";

type Props = {
  imageDate: string;
};

const LikeButton = ({ imageDate }: Props) => {
  const { liked, toggleLike, likes, updateLikes, users, setShowUsers } =
    useLikeContext();
  const [hovered, setHovered] = useState(false);

  const { data: session } = useSession();

  const handleLikeClick = async () => {
    await toggleLike(imageDate);
  };

  const handleMouseEnter = async () => {
    try {
      await updateLikes(imageDate);
      setShowUsers(true);
      setHovered(true);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleMouseLeave = () => {
    setShowUsers(false);
    setHovered(false);
  };

  return (
    <button
      onClick={handleLikeClick}
      className={`bg-transparent hover:bg-transparent text-white rounded-full p-2 ${
        !session && "cursor-not-allowed opacity-50"
      }`}
      disabled={!session}
      style={{ pointerEvents: !session ? "none" : "auto" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faHeart}
          className={
            likes > 0 || liked || hovered ? "text-red-500" : "text-white"
          }
        />
        <span
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          className="text-white ml-2"
        >
          Likes: {likes}
        </span>
      </div>
    </button>
  );
};

export default LikeButton;
