import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "email.json");

const readJSON = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const writeJSON = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const data = readJSON();

  if (!data.accounts.includes(email)) {
    data.accounts.push(email);
    writeJSON(data);
    return NextResponse.json({ message: "Email added successfully", data });
  } else {
    return NextResponse.json({ message: "Email already exists", data }, { status: 409 });
  }
}

export async function DELETE(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const data = readJSON();
  const index = data.accounts.indexOf(email);

  if (index !== -1) {
    data.accounts.splice(index, 1);
    writeJSON(data);
    return NextResponse.json({ message: "Email removed successfully", data });
  } else {
    return NextResponse.json({ message: "Email not found", data }, { status: 404 });
  }
}
