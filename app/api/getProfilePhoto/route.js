import fs from "fs";
import path from "path";

export async function GET(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return new Response(
      JSON.stringify({ success: false, message: "Email is required" }),
      { status: 400 }
    );
  }

  try {
    const uploadDir = path.resolve(process.cwd(), "public/uploads");
    const files = fs.readdirSync(uploadDir);

    // Search for a file matching the email
    const fileName = files.find((file) => file.startsWith(email));

    if (fileName) {
      const photoPath = `/uploads/${fileName}`;
      return new Response(JSON.stringify({ success: true, photoPath }), {
        status: 200,
      });
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "No photo found" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error retrieving photo:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
