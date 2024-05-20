-- schema.sql

CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255)
);

CREATE TABLE "Image" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  url VARCHAR(255),
  date TIMESTAMP
);

CREATE TABLE "Like" (
  id SERIAL PRIMARY KEY,
  userId INT REFERENCES "User"(id),
  imageId INT REFERENCES "Image"(id)
);
