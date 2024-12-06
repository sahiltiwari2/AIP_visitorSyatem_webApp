import { promises as fs } from "fs";
import path from "path";

const emailFilePath = path.join(process.cwd(), "public", "email.json");

export async function POST(req) {
  let data = { accounts: [], admins: [] };

  try {
    const fileData = await fs.readFile(emailFilePath, "utf-8");
    data = JSON.parse(fileData);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Error reading email.json:", error);
      return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
    console.log("email.json does not exist. Initializing with default values.");
  }

  const body = await req.json();
  const { email } = body;

  if (!email || !email.includes("@")) {
    return new Response(JSON.stringify({ message: "Invalid email address" }), { status: 400 });
  }

  if (data.accounts.includes(email)) {
    return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
  }

  data.accounts.push(email);

  try {
    await fs.writeFile(emailFilePath, JSON.stringify(data, null, 2));
    return new Response(JSON.stringify({ message: "Email added successfully", data }), { status: 200 });
  } catch (error) {
    console.error("Error writing to email.json:", error);
    return new Response(JSON.stringify({ message: "Failed to update email.json" }), { status: 500 });
  }
}

export async function DELETE(req) {
  let data = { accounts: [], admins: [] };

  try {
    const fileData = await fs.readFile(emailFilePath, "utf-8");
    data = JSON.parse(fileData);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Error reading email.json:", error);
      return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
    console.log("email.json does not exist. Initializing with default values.");
  }

  const body = await req.json();
  const { email } = body;

  if (!email || !email.includes("@")) {
    return new Response(JSON.stringify({ message: "Invalid email address" }), { status: 400 });
  }

  if (!data.accounts.includes(email)) {
    return new Response(JSON.stringify({ message: "Email not found" }), { status: 404 });
  }

  data.accounts = data.accounts.filter((acc) => acc !== email);

  try {
    await fs.writeFile(emailFilePath, JSON.stringify(data, null, 2));
    return new Response(JSON.stringify({ message: "Email removed successfully", data }), { status: 200 });
  } catch (error) {
    console.error("Error writing to email.json:", error);
    return new Response(JSON.stringify({ message: "Failed to update email.json" }), { status: 500 });
  }
}
