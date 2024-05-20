// pages/api/session.js

import { authOptions } from "@/utils/authOptions";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      res.status(200).json(session);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { handler as GET, handler as POST };
