import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

export const action = async ({ request }: { request: Request }) => {
  if (request.method !== "PUT") {
    return json({ message: "Method not allowed" }, { status: 405 });
  }

  const { name, content } = await request.json();
  const sharedPath = "/shared";
  const filePath = path.join(sharedPath, name);

  try {
    fs.writeFileSync(filePath, content);
    return json({ message: `File '${name}' updated successfully` });
  } catch (error) {
    console.error('Error updating file:', error);
    return json({ message: `Error updating file` }, { status: 500 });
  }
}; 