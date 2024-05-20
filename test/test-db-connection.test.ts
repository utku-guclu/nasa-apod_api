// test/test-db-connection.test.ts

import { NextApiRequest, NextApiResponse } from "next";
import handler from "../app/api/test-db-connection";
import connect from "../app/lib/mongoose";

jest.mock("../app/lib/mongoose");

// Mock Next.js API request and response objects
const mockRequest = {} as NextApiRequest;
const mockResponse = {
  status: jest.fn(() => mockResponse),
  json: jest.fn(),
} as unknown as NextApiResponse;

const mockedConnect = connect as jest.MockedFunction<typeof connect>;

beforeAll(async () => {
  // Establish a connection before running tests
  await mockedConnect();
});

describe("API Route: /api/test-db-connection", () => {
  it("should connect to MongoDB successfully", async () => {
    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Connected to MongoDB successfully!",
    });
  });

  it("should handle MongoDB connection error", async () => {
    // Mocking mongoose.connect to throw an error
    mockedConnect.mockRejectedValueOnce(new Error("Connection failed"));

    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Failed to connect to MongoDB",
    });
  });
});
