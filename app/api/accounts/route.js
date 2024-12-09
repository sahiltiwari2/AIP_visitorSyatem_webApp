// routes/accounts.js
import { readJSON, writeJSON } from "@/app/utils/jsonHandler";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ message: "Invalid email address" }), { status: 400 });
    }

    const data = await readJSON();
    if (data.accounts.includes(email)) {
      return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
    }

    data.accounts.push(email);
    await writeJSON(data);

    return new Response(JSON.stringify({ message: "Email added successfully", data }), { status: 200 });
  } catch (error) {
    console.error("Error handling POST:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ message: "Invalid email address" }), { status: 400 });
    }

    const data = await readJSON();
    if (!data.accounts.includes(email)) {
      return new Response(JSON.stringify({ message: "Email not found" }), { status: 404 });
    }

    data.accounts = data.accounts.filter((acc) => acc !== email);
    await writeJSON(data);

    return new Response(JSON.stringify({ message: "Email removed successfully", data }), { status: 200 });
  } catch (error) {
    console.error("Error handling DELETE:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
