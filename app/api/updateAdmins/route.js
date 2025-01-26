import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "public", "data.json");

  if (req.method === "POST") {
    const { newAdmin } = req.body;

    if (!newAdmin) {
      return res.status(400).json({ error: "Admin email is required" });
    }

    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(fileData);

      // Replace the current admin
      jsonData.admins = [newAdmin];

      // Write back to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

      res.status(200).json({ message: "Admin updated successfully!" });
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({ error: "Failed to update admin" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
