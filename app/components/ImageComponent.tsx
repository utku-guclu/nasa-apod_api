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
  const { data: session } = useSession();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes/${image.date}`);

        if (res.ok) {
          const data = await res.json();
          setLikes(data.likes);
          setLiked(data.liked); // Update liked state based on API response
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
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={liked ? "text-red-500" : "text-white"}
            />
          </button>
          <span
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
            className="text-white ml-2"
          >
            Likes: {likes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageComponent;
