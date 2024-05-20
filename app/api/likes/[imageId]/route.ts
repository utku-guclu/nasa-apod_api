// route.ts

import connectDB from "@/config/database";
import ImageModel, { ImageDocument } from "@/models/Image";
import LikeModel from "@/models/Like";
import UserModel, { UserDocument } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { createHash } from "crypto";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { v5 as uuidv5 } from "uuid";

// Connect to the database
connectDB();

// Function to convert email to UUID
function emailToUuid(email: string): string {
  const namespace = "1b671a64-40d5-491e-99b0-da01ff1f3341"; // Some random namespace UUID
  const emailHash = createHash("sha1").update(email).digest("hex");
  return uuidv5(emailHash, namespace);
}

// Function to convert image date to UUID
function dateToUuid(imageDate: string): string {
  const namespace = "1b671a64-40d5-491e-99b0-da01ff1f3341"; // Some random namespace UUID
  const dateHash = createHash("sha1").update(imageDate).digest("hex");
  return uuidv5(dateHash, namespace);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { imageId: string } }
) {
  const imageDate = params.imageId;

  try {
    // Find or create the image
    let image: ImageDocument | null = await ImageModel.findOne({
      date: imageDate,
    }).exec();

    if (!image) {
      const imageData = await fetchImageData(imageDate); // Fetch image details
      if (!imageData) {
        throw new Error("Image data not found for date: " + imageDate);
      }
      // Create a new image record
      image = await ImageModel.create({
        title: imageData.title,
        url: imageData.url,
        date: imageDate,
        likes: 0,
        liked: false,
      });
      console.log("New image created:", image);
    }

    // Fetch all likes for the image and populate users
    const likes = await LikeModel.find({
      imageId: image?._id, // Use image._id instead of dateToUuid(imageDate)
    }).populate({
      path: "userId",
      model: UserModel, // Provide the UserModel to correctly populate
    });
    console.log("likes", likes);
    // Map over the populated likes to create the users array
    const users = likes.map((like) => ({
      name: like.userId.name || "Unknown",
      image: like.userId.image || "", // default image
    }));
    console.log("users", users);
    return NextResponse.json({ likes: image?.likes, users });
  } catch (error) {
    console.error("Error in GET /api/likes/[images]:", error);
    return NextResponse.json(
      { message: "Failed to fetch likes", error },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { imageId: string } }
) {
  const imageDate = params.imageId;

  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const image = await ImageModel.findOne({ date: imageDate }).exec();
    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    // Find or create the user
    let user: UserDocument | null = await UserModel.findOne({
      email: userEmail,
    }).exec();
    if (!user) {
      user = await UserModel.create({
        email: userEmail,
        name: session.user?.name,
        image: session.user?.image,
      });
      console.log("New user created:", user);
    }

    // Check if the user has already liked the image
    const existingLike = await LikeModel.findOne({
      userId: user?._id, // Use user._id instead of emailToUuid(userEmail)
      imageId: image._id, // Use image._id instead of dateToUuid(imageDate)
    }).exec();

    if (!existingLike) {
      await LikeModel.create({
        userId: user?._id, // Use user._id instead of emailToUuid(userEmail)
        imageId: image._id, // Use image._id instead of dateToUuid(imageDate)
      });
      image.likes++;
      await image.save(); // Save the updated likes count
    }

    return NextResponse.json({ likes: image.likes, liked: true });
  } catch (error) {
    console.error("Error in POST /api/likes/[images]:", error);
    return NextResponse.json(
      { message: "Failed to like image", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { imageId: string } }
) {
  const imageDate = params.imageId;

  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const image = await ImageModel.findOne({ date: imageDate }).exec();
    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    // Find the user
    const user = await UserModel.findOne({ email: userEmail }).exec();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the user has liked the image
    const like = await LikeModel.findOneAndDelete({
      userId: user._id, // Use user._id instead of emailToUuid(userEmail)
      imageId: image._id, // Use image._id instead of dateToUuid(imageDate)
    }).exec();

    if (like) {
      image.likes--;
      await image.save(); // Save the updated likes count
    }

    return NextResponse.json({ likes: image.likes, liked: false });
  } catch (error) {
    console.error("Error in DELETE /api/likes/[images]:", error);
    return NextResponse.json(
      { message: "Failed to unlike image", error },
      { status: 500 }
    );
  }
}

async function fetchImageData(imageId: string) {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?date=${imageId}&api_key=${process.env.NASA_TOKEN}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch image data: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      title: data.title,
      url: data.url,
    };
  } catch (error) {
    console.error("Failed to fetch image data:", error);
    return null;
  }
}
