import { Nasa } from "@/types";
import Image from "next/image";

type Props = {
  params: { date: string };
};

export default async function ImageDetail({ params }: Props) {
  const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_TOKEN}&date=${params.date}`;
  const res = await fetch(nasaURL);
  const data: Nasa = await res.json();

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
        <div className="relative group">
          <div
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
            className="bg-black bg-opacity-50 p-4 text-white opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100  overflow-y-auto max-h-full w-full md:p-6"
          >
            <h1 className="text-4xl md:text-6xl">{data.title}</h1>
            <hr className="my-2" />
            <p className="text-base md:text-lg">{data.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
