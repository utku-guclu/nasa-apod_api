"use client";

import { Nasa } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { LikeContextProvider } from "../context/LikeContext";
import ImageComponent from "./ImageComponent";

const BATCH_SIZE = 9;

export default function FetchImage() {
  const [images, setImages] = useState<Nasa[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalFetched, setTotalFetched] = useState(0);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_TOKEN}&count=${BATCH_SIZE}`;
    const res = await fetch(nasaURL);
    const newImageData: Nasa[] = await res.json();

    // Filter out non-image URLs
    const filteredImages = newImageData.filter((image) => {
      const { url } = image;
      // Check if the URL ends with a known image file extension
      return /\.(jpeg|jpg|gif|png)$/i.test(url);
    });

    setImages((prevImages) => [...prevImages, ...filteredImages]);
    setTotalFetched((prevTotal) => prevTotal + filteredImages.length);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const isReachBottom = document.body.scrollHeight === scrolledTo;
      if (isReachBottom && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    if (page > 0) {
      fetchImages();
    }
  }, [page, fetchImages]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.length > 0 ? (
          images.map((image) => (
            <LikeContextProvider
              key={image.date}
              initialLikes={0}
              initialLiked={false}
              initialShowUsers={false}
              initialUsers={[]}
            >
              <ImageComponent image={image} />
            </LikeContextProvider>
          ))
        ) : (
          <div className="w-screen h-screen text-white flex items-center justify-center">
            Loading...
          </div>
        )}
      </div>
      {loading && <div>Loading more images...</div>}
    </div>
  );
}
