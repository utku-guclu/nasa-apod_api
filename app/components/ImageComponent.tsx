"use client";

import Image from "next/image";
import Link from "next/link";

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useState } from "react";

type NasaImage = {
  title: string;
  url: string;
  date: string;
};

type Props = {
  image: NasaImage;
};

const ImageComponent = ({ image }: Props) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleLikeClick = (date: string) => {
    console.log(`Liked image for date: ${date}`);
    if (!liked) {
      setLikes((prev) => prev + 1);
    } else {
      setLikes((prev) => prev - 1);
    }
    setLiked((prev) => !prev);
  };

  return (
    <div key={image.date} className="relative w-full h-64">
      <Link href={`/nasa/apod/${image.date}`}>
        <Image
          className="object-cover"
          src={image.url}
          alt="apod"
          layout="fill"
        />
      </Link>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black bg-opacity-50 text-white p-2">
        <h2>{image.title}</h2>
        <div className="flex items-center">
          <button
            onClick={() => handleLikeClick(image.date)}
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
