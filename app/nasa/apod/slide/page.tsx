"use client";

import { Nasa } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

import Loading from "@/app/components/Loading";
import SpeechButton from "@/app/components/SpeechButton";

type Props = {
  params: { date: string };
};

export default function ImageDetail({ params }: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const [data, setData] = useState<Nasa | null>(null);
  const [flash, setFlash] = useState(false);

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
      setFlash(true);
      setImageIndex((prevIndex) => (prevIndex + 1) % 10); // Assuming you want to cycle through 10 images
    }, 120000); // 120 seconds

    return () => clearInterval(interval);
  }, [imageIndex]);

  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => setFlash(false), 600); // Flash duration
      return () => clearTimeout(timer);
    }
  }, [flash]);

  if (!data) {
    return (
      <div className="w-full h-screen text-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className={`image-container ${flash ? "flash" : ""}`}>
        <Image
          className="object-cover image-zoom-in"
          src={data.hdurl}
          alt="apod"
          layout="fill"
          priority={true}
        />
      </div>

      <div className="absolute inset-0 flex items-end justify-center">
        <div className="relative group">
          <div
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
            className="bg-black bg-opacity-50 p-4 text-white opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 overflow-y-auto max-h-full w-full md:p-6"
          >
            <div className="flex items-center space-x-2">
              <h1 className="text-4xl md:text-6xl">{data.title}</h1>
              <SpeechButton text={data.explanation} />
            </div>

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
