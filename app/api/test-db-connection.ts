// pages/api/test-db-connection.ts

import connectDB from "@/config/database";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("API route /api/test-db-connection called"); // Add this line for logging
  try {
    await connectDB();
    res.status(200).json({ message: "Connected to MongoDB successfully!" });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Failed to connect to MongoDB" });
  }
};

export default handler;
