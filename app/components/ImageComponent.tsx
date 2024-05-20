"use client";
import type { Nasa } from "@/types";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  image: Nasa;
};

const ImageComponent = ({ image }: Props) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [users, setUsers] = useState<{ name: string; image: string }[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const { data: session } = useSession();

  const handleMouseEnter = async () => {
    try {
      const res = await fetch(`/api/likes/${image.date}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setShowUsers(true);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleMouseLeave = () => {
    setShowUsers(false);
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes/${image.date}`);

        if (res.ok) {
          const data = await res.json();
          setLikes(data.likes);
          setLiked(data.liked);
          setUsers(data.users || []);
          console.log(data.users);
        } else {
          throw new Error("Failed to fetch likes");
        }
      } catch (error) {
        console.error("Failed to fetch likes", error);
      }
    };

    fetchLikes();
  }, [image.date]);

  const handleLikeClick = async () => {
    if (!session) {
      return;
    }

    try {
      const res = await fetch(`/api/likes/${image.date}`, {
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
        setLikes(data.likes); // Update likes count based on API response
        setLiked(!liked); // Toggle liked state
        setUsers(data.users || []);
      } else {
        throw new Error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div key={image.date} className="relative w-full h-64">
      <Link href={`/nasa/apod/${encodeURIComponent(image.date)}`}>
        <Image
          src={image.url}
          alt="apod"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </Link>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black bg-opacity-50 text-white p-2">
        <h2>{image.title}</h2>
        <div className="flex items-center">
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
            <FontAwesomeIcon
              icon={faHeart}
              className={likes > 0 ? "text-red-500" : "text-white"}
            />
          </button>
          <span
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
            className="text-white ml-2"
          >
            Likes: {likes}
          </span>
          {users.length > 0 && (
            <div className="absolute bottom-10 right-0 bg-black bg-opacity-75 text-white p-2 rounded-lg shadow-lg w-100 h-100">
              {users.map((user, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageComponent;
