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
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [imageIndex]);

  if (!data) {
    return (
      <div className="w-full h-screen text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
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
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="relative group">
          <div
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
            className="bg-black bg-opacity-50 p-4 text-white opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 overflow-y-auto max-h-full w-full md:p-6"
          >
            <h1 className="text-4xl md:text-6xl">{data.title}</h1>
            <hr className="my-2" />
            <p
              style={{ maxHeight: "75vh" }}
              className="text-base md:text-lg overflow-y-auto"
            >
              {data.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
