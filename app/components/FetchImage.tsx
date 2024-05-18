import Image from "next/image";
import Link from "next/link";

type Nasa = {
  title: string;
  url: string;
  explanation: string;
  date: string;
};

export default async function FetchImage() {
  const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_TOKEN}&count=10`;
  const res = await fetch(nasaURL, { next: { revalidate: 3600000 } }); // 1 hour
  const imageData: Nasa[] = await res.json();
  console.log(imageData);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageData &&
          imageData.map((image) => (
            <div key={image.date} className="relative w-full h-64">
              <Link href={`/nasa/apod/${image.date}`}>
                <Image
                  className="object-cover"
                  src={image.url}
                  alt="apod"
                  layout="fill"
                />
                <h2 className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                  {image.title}
                </h2>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
