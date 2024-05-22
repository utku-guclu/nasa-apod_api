import { Nasa } from "@/types";
import { LikeContextProvider } from "../context/LikeContext";
import ImageComponent from "./ImageComponent";

export default async function FetchImage() {
  const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_TOKEN}&count=10`;
  const res = await fetch(nasaURL, { next: { revalidate: 3600000 } }); // 1 hour
  const imageData: Nasa[] = await res.json();
  //console.log(imageData);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageData &&
          imageData.map((image) => (
            <LikeContextProvider
              key={image.date}
              initialLikes={0}
              initialLiked={false}
              initialShowUsers={false}
              initialUsers={[]}
            >
              <ImageComponent image={image} />
            </LikeContextProvider>
          ))}
      </div>
    </div>
  );
}
