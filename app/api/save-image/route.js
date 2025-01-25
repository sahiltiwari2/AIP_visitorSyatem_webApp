import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    // Parse the JSON body from the request
    const { email, image } = await req.json();

    // Validate input data
    if (!email || !image) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Remove the Base64 metadata from the image string
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // Define the folder path in the public directory
    const folderPath = path.join(process.cwd(), "public", "visitorPhoto");

    // Ensure the directory exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Define the file path within the visitorPhoto folder
    const filePath = path.join(folderPath, `${email}.png`);

    // Write the file to the visitorPhoto folder
    fs.writeFileSync(filePath, base64Data, "base64");

    // Respond with success
    return NextResponse.json({ message: "Image saved successfully", path: `/visitorPhoto/${email}.png` });
  } catch (error) {
    // Log the error for debugging
    console.error("Error saving image:", error);

    // Respond with an error message
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
