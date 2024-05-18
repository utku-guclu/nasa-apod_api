import { Nasa } from "@/types";
import Image from "next/image";

type Props = {
  params: { date: string };
};

export default async function ImageDetail({ params }: Props) {
  const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_TOKEN}`;
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
        <div className="bg-black bg-opacity-50 p-4 text-white overflow-y-auto h-full">
          <h1 className="text-6xl">{data.title}</h1>
          <hr />
          <br />
          <p className="text-lg">{data.explanation}</p>
        </div>
      </div>
    </div>
  );
}
