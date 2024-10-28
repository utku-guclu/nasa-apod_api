# NASA APOD (Astronomy Picture of the Day) App Documentation

## Overview

The **NASA APOD (Astronomy Picture of the Day)** app allows users to explore and enjoy daily images from NASA's APOD API. This app provides users with a visually rich experience by offering high-quality space images, detailed information about each image, and engagement features like "like" and "favorite."

## Features

- **Daily Image Feed**: Automatically updates with the daily APOD image.
- **Image Details**: Users can learn more about each image, including descriptions and metadata.
- **Likes and Favorites**: Users can engage with the images by liking and adding them to their favorites list.
- **Responsive Design**: Fully optimized for desktop and mobile views.

## Technologies Used

- **Frontend**: Next.js, TypeScript
- **Backend**: REST API integration with NASA's APOD API
- **Database**: MongoDB for storing user data (favorites and likes)
- **Containerization**: Docker for a consistent development and production environment

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/nasa-apod-app.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd nasa-apod-app
   ```
3. **Navigate to the project directory**:
   ```bash
   # Create .env file
    NASA_API_KEY=your_api_key_here
    MONGODB_URI=your_mongodb_connection_string
   ```
4. **Navigate to the project directory**:
   ```bash
    npm run dev
   ```
## Usage

### Basic Navigation
- Visit the homepage to view today's astronomical picture
- Click on images to view full details
- Use the calendar to explore past images

### User Features
- **Liking Images**: Click the heart icon to like an image
- **Favorites**: Star images to add them to your favorites
- **Sharing**: Use the share button to copy the image link

## API Integration

### NASA APOD API
Base URL: `https://api.nasa.gov/planetary/apod`

#### Parameters
| Parameter | Type    | Description                   |
|-----------|---------|-------------------------------|
| api_key   | string  | Your NASA API key            |
| date      | string  | Date in YYYY-MM-DD format    |
| hd        | boolean | Request HD image if available |

##Contributing

Contributions are welcome! Please follow these steps:

    Fork the repository.
    Create a new branch (feature-branch).
    Make your changes and commit them.
    Push to your branch (git push origin feature-branch).
    Open a pull request.

##License
This project is licensed under the MIT License. See the LICENSE file for details.
