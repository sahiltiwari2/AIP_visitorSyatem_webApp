import { promises as fs } from "fs";
import path from "path";

const emailFilePath = process.env.EMAIL_FILE_PATH || path.join(process.cwd(), "public", "email.json");

export const readJSON = async () => {
  try {
    const fileData = await fs.readFile(emailFilePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("email.json does not exist. Initializing...");
      return { accounts: [], admins: [] };
    }
    throw error;
  }
};

export const writeJSON = async (data) => {
  try {
    await fs.writeFile(emailFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to email.json:", error);
    throw error;
  }
};