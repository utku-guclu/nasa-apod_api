"use client";

import { Nasa } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  params: { date: string };
};

export default function ImageDetail({ params }: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const [data, setData] = useState<Nasa | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_NASA_TOKEN;
    const fetchData = async () => {
      const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${token}&count=1`;
      const res = await fetch(nasaURL);
      const dataArr: Nasa[] = await res.json();
      setData(dataArr[0]);
    };

    fetchData();

    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % 10); // Assuming you want to cycle through 10 images
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [imageIndex]);

  if (!data) {
    return (
      <div className="w-full h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <Image
        className="object-cover"
        src={data.hdurl}
        alt="apod"
        layout="fill"
        priority={true}
      />
      <div className="absolute inset-0 flex items-end justify-center max-h-fit">
        <div className="relative group overflow-y-auto h-full">
          <div className="bg-black bg-opacity-50 p-4 text-white opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
            <h1 className="text-6xl">{data.title}</h1>
            <hr />
            <br />
            <p className="text-lg">{data.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
