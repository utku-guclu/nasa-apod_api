import { Nasa } from "@/types";
import ImageComponent from "./ImageComponent";

export default async function FetchImage() {
  const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_TOKEN}&count=10`;
  const res = await fetch(nasaURL, { next: { revalidate: 3600000 } }); // 1 hour
  const imageData: Nasa[] = await res.json();
  //console.log(imageData);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageData &&
          imageData.map((image) => (
            <ImageComponent key={image.date} image={image} />
          ))}
      </div>
    </div>
  );
}
