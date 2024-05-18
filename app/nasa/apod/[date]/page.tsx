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
        src={data.url}
        alt="apod"
        layout="fill"
        priority={true}
      />
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="bg-black bg-opacity-50 p-4 text-white">
          <h1 className="text-3xl">{data.title}</h1>
          <p>{data.explanation}</p>
        </div>
      </div>
    </div>
  );
}
