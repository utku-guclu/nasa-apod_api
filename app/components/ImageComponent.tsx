// components/ImageComponent.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { blurDataUrl } from "../assets/blurdataUrl";
import { useLikeContext } from "../context/LikeContext";
import LikeButton from "./LikeButton";

type Props = {
  image: {
    date: string;
    title: string;
    url: string;
  };
};

const ImageComponent = ({ image }: Props) => {
  const { users, showUsers, updateLikes } = useLikeContext();

  useEffect(() => {
    updateLikes(image.date);
  }, []);

  return (
    <div key={image.date} className="relative w-full h-64">
      <Link href={`/nasa/apod/${encodeURIComponent(image.date)}`}>
        <Image
          src={image.url}
          alt="apod"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          loading="lazy"
          placeholder="blur"
          blurDataURL={blurDataUrl}
        />
      </Link>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black bg-opacity-50 text-white p-2">
        <h2>{image.title}</h2>
        <div className="flex items-center">
          <LikeButton imageDate={image.date} />
          {/* Show users liked the image */}
          {users.length > 0 && showUsers && (
            <div className="absolute bottom-10 right-0 bg-black bg-opacity-75 text-white p-2 rounded-lg shadow-lg w-100 h-100">
              {users.map((user, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                    loading="lazy"
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
